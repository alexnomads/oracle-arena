/**
 * Debate Orchestrator — POST /api/debate
 * Runs the full debate lifecycle: Research → 3 Rounds → Judge Verdict
 */

import { NextRequest, NextResponse } from 'next/server';
import { veniceChat, withRetry } from '@/lib/venice';
import { AGENTS, buildDebatePrompt, buildJudgePrompt } from '@/lib/agents';
import { DEBATE_ROUND_SCHEMA, JUDGE_VERDICT_SCHEMA, RESEARCH_SUMMARY_SCHEMA } from '@/lib/schemas';
import { debateCache } from '@/lib/cache';
import type { DebateTranscript, DebateRound, Verdict } from '@/types/debate';

const TOTAL_ROUNDS = 3;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, topic } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Check cache first
    if (topicId && debateCache.has(topicId)) {
      const cached = debateCache.get(topicId)!;
      return NextResponse.json({ cached: true, transcript: cached });
    }

    const transcript: DebateTranscript = {
      topicId: topicId || '',
      topic,
      rounds: [],
      completed: false,
      startedAt: new Date().toISOString(),
    };

    // ── Phase 1: Research ──
    const researcher = AGENTS.researcher;
    const researchResponse = await withRetry(async () =>
      veniceChat({
        model: researcher.model,
        messages: [
          { role: 'system', content: researcher.systemPrompt },
          { role: 'user', content: `Research this prediction topic: ${topic}` },
        ],
        responseFormat: RESEARCH_SUMMARY_SCHEMA,
        enableWebSearch: true,
      })
    );

    const researchData = JSON.parse(researchResponse.choices[0].message.content);
    transcript.researchSummary = JSON.stringify(researchData, null, 2);

    // ── Phase 2: Debate Rounds ──
    for (let round = 1; round <= TOTAL_ROUNDS; round++) {
      const prevRound = transcript.rounds[round - 2];

      // Proponent speaks
      const proPrompt = buildDebatePrompt(
        'proponent',
        topic,
        transcript.researchSummary || '',
        round,
        prevRound ? { opponentClaim: prevRound.opponentClaim } : undefined
      );

      const proResponse = await withRetry(async () =>
        veniceChat({
          model: AGENTS.proponent.model,
          messages: [
            { role: 'system', content: AGENTS.proponent.systemPrompt },
            { role: 'user', content: proPrompt },
          ],
          responseFormat: DEBATE_ROUND_SCHEMA,
        })
      );

      const proData = JSON.parse(proResponse.choices[0].message.content);

      // Opponent speaks
      const oppPrompt = buildDebatePrompt(
        'opponent',
        topic,
        transcript.researchSummary || '',
        round,
        prevRound ? { proponentClaim: prevRound.proponentClaim } : undefined
      );

      const oppResponse = await withRetry(async () =>
        veniceChat({
          model: AGENTS.opponent.model,
          messages: [
            { role: 'system', content: AGENTS.opponent.systemPrompt },
            { role: 'user', content: oppPrompt },
          ],
          responseFormat: DEBATE_ROUND_SCHEMA,
        })
      );

      const oppData = JSON.parse(oppResponse.choices[0].message.content);

      const debateRound: DebateRound = {
        round,
        proponentClaim: proData.claim,
        proponentEvidence: proData.evidence || [],
        opponentClaim: oppData.claim,
        opponentEvidence: oppData.evidence || [],
        proponentCounter: proData.counter_to_opponent || undefined,
        opponentCounter: oppData.counter_to_opponent || undefined,
      };

      transcript.rounds.push(debateRound);
    }

    // ── Phase 3: Judge Verdict ──
    const judgePrompt = buildJudgePrompt(
      topic,
      transcript.researchSummary || '',
      transcript.rounds.map(r => ({
        proponentClaim: r.proponentClaim,
        opponentClaim: r.opponentClaim,
      }))
    );

    const judgeResponse = await withRetry(async () =>
      veniceChat({
        model: AGENTS.judge.model,
        messages: [
          { role: 'system', content: AGENTS.judge.systemPrompt },
          { role: 'user', content: judgePrompt },
        ],
        responseFormat: JUDGE_VERDICT_SCHEMA,
      })
    );

    const verdict: Verdict = JSON.parse(judgeResponse.choices[0].message.content);
    transcript.verdict = verdict;
    transcript.completed = true;
    transcript.completedAt = new Date().toISOString();

    // Cache the result
    if (topicId) {
      debateCache.set(topicId, transcript);
    }

    return NextResponse.json({ cached: false, transcript });
  } catch (error) {
    console.error('Debate orchestrator error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
