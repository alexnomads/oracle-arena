/**
 * SSE Stream — GET /api/debate/stream
 * Streams the full debate lifecycle in real-time to the client
 *
 * Uses prompt engineering for JSON output + robust JSON parser.
 * No OpenAI-style response_format schemas (Venice doesn't support reliably).
 */

import { NextRequest } from 'next/server';
import { veniceChat, withRetry } from '@/lib/venice';
import { AGENTS, buildDebatePrompt, buildJudgePrompt } from '@/lib/agents';
import { parseJsonResponse } from '@/lib/parseJson';
import { debateCache } from '@/lib/cache';
import type { DebateRound, Verdict } from '@/types/debate';

const TOTAL_ROUNDS = 3;

async function* debateStreamGenerator(topic: string) {
  // ── Phase 1: Research ──
  yield `data: ${JSON.stringify({ type: 'research', timestamp: new Date().toISOString() })}\n\n`;

  const researcher = AGENTS.researcher;
  const researchResponse = await withRetry(async () =>
    veniceChat({
      model: researcher.model,
      messages: [
        { role: 'system', content: researcher.systemPrompt + '\n\nOutput ONLY valid JSON. Use this structure: { "current_state": "...", "key_data_points": ["..."], "expert_opinions": ["..."], "recent_trends": "..." }' },
        { role: 'user', content: `Research this prediction topic: ${topic}` },
      ],
      enableWebSearch: true,
      maxTokens: 5000,
      reasoningEffort: 'none',
    })
  );

  const researchData = parseJsonResponse(researchResponse.choices[0].message.content);
  const researchSummary = JSON.stringify(researchData, null, 2);

  yield `data: ${JSON.stringify({ type: 'research_complete', data: researchData, timestamp: new Date().toISOString() })}\n\n`;

  // ── Phase 2: Debate Rounds ──
  const rounds: DebateRound[] = [];

  for (let round = 1; round <= TOTAL_ROUNDS; round++) {
    yield `data: ${JSON.stringify({ type: 'round_start', data: { round }, timestamp: new Date().toISOString() })}\n\n`;

    const prevRound = rounds[round - 2];

    // Proponent
    yield `data: ${JSON.stringify({ type: 'agent_speaking', data: { agent: 'proponent', round }, timestamp: new Date().toISOString() })}\n\n`;

    const proPrompt = buildDebatePrompt(
      'proponent',
      topic,
      researchSummary,
      round,
      prevRound ? { opponentClaim: prevRound.opponentClaim } : undefined
    );

    const proResponse = await withRetry(async () =>
      veniceChat({
        model: AGENTS.proponent.model,
        messages: [
          { role: 'system', content: AGENTS.proponent.systemPrompt + '\n\nOutput ONLY valid JSON. Use this exact structure: { "claim": "...", "evidence": [{"point": "...", "source": "..."}], "counter_to_opponent": "..." }' },
          { role: 'user', content: proPrompt },
        ],
        maxTokens: 3000,
      })
    );

    const proData = parseJsonResponse<{claim: string; evidence: Array<{point: string; source?: string}>; counter_to_opponent?: string}>(proResponse.choices[0].message.content);
    yield `data: ${JSON.stringify({ type: 'agent_said', data: { agent: 'proponent', content: proData }, timestamp: new Date().toISOString() })}\n\n`;

    // Opponent
    yield `data: ${JSON.stringify({ type: 'agent_speaking', data: { agent: 'opponent', round }, timestamp: new Date().toISOString() })}\n\n`;

    const oppPrompt = buildDebatePrompt(
      'opponent',
      topic,
      researchSummary,
      round,
      prevRound ? { proponentClaim: prevRound.proponentClaim } : undefined
    );

    const oppResponse = await withRetry(async () =>
      veniceChat({
        model: AGENTS.opponent.model,
        messages: [
          { role: 'system', content: AGENTS.opponent.systemPrompt + '\n\nOutput ONLY valid JSON. Use this exact structure: { "claim": "...", "evidence": [{"point": "...", "source": "..."}], "counter_to_opponent": "..." }' },
          { role: 'user', content: oppPrompt },
        ],
        maxTokens: 2500,
      })
    );

    const oppData = parseJsonResponse<{claim: string; evidence: Array<{point: string; source?: string}>; counter_to_opponent?: string}>(oppResponse.choices[0].message.content);
    yield `data: ${JSON.stringify({ type: 'agent_said', data: { agent: 'opponent', content: oppData }, timestamp: new Date().toISOString() })}\n\n`;

    rounds.push({
      round,
      proponentClaim: proData.claim || '',
      proponentEvidence: proData.evidence || [],
      opponentClaim: oppData.claim || '',
      opponentEvidence: oppData.evidence || [],
      proponentCounter: proData.counter_to_opponent || undefined,
      opponentCounter: oppData.counter_to_opponent || undefined,
    });

    yield `data: ${JSON.stringify({ type: 'round_end', data: { round }, timestamp: new Date().toISOString() })}\n\n`;
  }

  // ── Phase 3: Judge ──
  yield `data: ${JSON.stringify({ type: 'judge_starting', timestamp: new Date().toISOString() })}\n\n`;

  const judgePrompt = buildJudgePrompt(
    topic,
    researchSummary,
    rounds.map(r => ({
      proponentClaim: r.proponentClaim,
      opponentClaim: r.opponentClaim,
    }))
  );

  yield `data: ${JSON.stringify({ type: 'judge_reasoning', timestamp: new Date().toISOString() })}\n\n`;

  const judgeResponse = await withRetry(async () =>
    veniceChat({
      model: AGENTS.judge.model,
      messages: [
        { role: 'system', content: AGENTS.judge.systemPrompt + '\n\nOutput ONLY valid JSON. Use this structure: { "prediction": "YES/NO", "confidence": 0-1, "scores": { "proponent": { "logic": 1-10, "evidence": 1-10, "persuasion": 1-10 }, "opponent": { "logic": 1-10, "evidence": 1-10, "persuasion": 1-10 } }, "reasoning": "..." }' },
        { role: 'user', content: judgePrompt },
      ],
      maxTokens: 4000,
    })
  );

  const verdict: Verdict = parseJsonResponse(judgeResponse.choices[0].message.content);

  yield `data: ${JSON.stringify({ type: 'verdict', data: verdict, timestamp: new Date().toISOString() })}\n\n`;
  yield `data: [DONE]\n\n`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const topicId = searchParams.get('topicId');

  if (!topic) {
    return new Response('Missing topic parameter', { status: 400 });
  }

  // Check cache
  if (topicId && debateCache.has(topicId)) {
    const cached = debateCache.get(topicId)!;
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'cached', data: cached, timestamp: new Date().toISOString() })}\n\n`));
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of debateStreamGenerator(topic)) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (error) {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'error', data: { error: error instanceof Error ? error.message : 'Stream error' }, timestamp: new Date().toISOString() })}\n\n`
        ));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
