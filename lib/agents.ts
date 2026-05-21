import { AgentConfig } from '@/types/debate';

/**
 * Agent pool configuration.
 * Each agent has a specific model, system prompt, and reasoning effort level.
 */
export const AGENTS: Record<string, AgentConfig> = {
  proponent: {
    role: 'proponent',
    model: 'zai-org-glm-5',
    reasoningEffort: 'medium',
    voiceId: 'eleven_multilingual_v2',
    voiceLabel: 'Confident Male',
    systemPrompt: `You are the PROPOSER in a prediction debate. You argue that the prediction WILL happen.
Rules:
- Use data, logic, and cite sources when possible
- Be direct and persuasive
- Acknowledge counterarguments but refute them with evidence
- Structure: state your claim, provide evidence, counter the opponent's points
- Be confident but not arrogant`,
  },
  opponent: {
    role: 'opponent',
    model: 'venice-uncensored-1-2',
    reasoningEffort: 'low',
    voiceId: 'eleven_english_v1',
    voiceLabel: 'Sharp Female',
    systemPrompt: `You are the OPPOSER in a prediction debate. You argue that the prediction will NOT happen.
Rules:
- Challenge assumptions and play devil's advocate
- Use data and real-world examples
- Be direct, sharp, and unfiltered in your analysis
- Structure: state your counter-claim, provide evidence, refute the proponent's points
- Don't hold back — expose weak logic`,
  },
  researcher: {
    role: 'researcher',
    model: 'qwen3-5-9b',
    reasoningEffort: 'none',
    voiceLabel: 'N/A',
    systemPrompt: `You are a RESEARCHER agent. Your job is to gather current, factual information about a prediction topic.
Rules:
- Search for current data, news, analyst opinions, on-chain metrics
- Output a structured research summary
- Include: current state, recent trends, expert predictions, key data points
- Be factual, neutral, and cite sources`,
  },
  judge: {
    role: 'judge',
    model: 'kimi-k2-5',
    reasoningEffort: 'high',
    voiceId: 'eleven_multilingual_v2',
    voiceLabel: 'Authoritative Neutral',
    systemPrompt: `You are the JUDGE in a prediction debate. Your job is to fairly evaluate both sides and make a final prediction.
Rules:
- Evaluate LOGIC (sound reasoning), EVIDENCE (data quality), and PERSUASION (rhetorical impact)
- Score each agent 1-10 on each dimension
- Make a final YES/NO prediction with confidence (0-1)
- Explain your reasoning clearly
- Be fair — reward strong arguments regardless of which side they're on`,
  },
};

/**
 * Pre-built debate topics for demo
 */
export const DEMO_TOPICS = [
  {
    id: 'btc-100k-june',
    question: 'Will BTC exceed $100K by June 30, 2026?',
    category: 'crypto' as const,
    cached: true,
  },
  {
    id: 'fed-rate-cut-june',
    question: 'Will the Fed cut interest rates in June 2026?',
    category: 'geopolitics' as const,
    cached: true,
  },
  {
    id: 'eth-etf-approval',
    question: 'Will a spot ETH ETF be approved in the EU by Q3 2026?',
    category: 'crypto' as const,
    cached: true,
  },
  {
    id: 'ai-jobs-2027',
    question: 'Will AI cause net job losses in tech by 2027?',
    category: 'ai' as const,
    cached: false,
  },
  {
    id: 'nasdaq-50k',
    question: 'Will NASDAQ hit 50,000 by end of 2026?',
    category: 'stocks' as const,
    cached: false,
  },
  {
    id: 'trump-2028',
    question: 'Will Trump win the 2028 US presidential election?',
    category: 'geopolitics' as const,
    cached: false,
  },
];

/**
 * Build the full system prompt for a debate round
 */
export function buildDebatePrompt(
  agentRole: 'proponent' | 'opponent',
  topic: string,
  researchSummary: string,
  roundNumber: number,
  previousRound?: {
    proponentClaim?: string;
    opponentClaim?: string;
  }
): string {
  const agent = AGENTS[agentRole];

  let roundInstruction = '';
  if (roundNumber === 1) {
    roundInstruction = 'This is ROUND 1 — Opening Arguments. State your core position with evidence.';
  } else if (roundNumber === 2) {
    roundInstruction = 'This is ROUND 2 — Rebuttals. Directly counter the other side\'s arguments.';
  } else {
    roundInstruction = 'This is ROUND 3 — Closing Statements. Deliver your most compelling final argument. This will be read aloud.';
  }

  let previousContext = '';
  if (previousRound) {
    previousContext = `\n\nPrevious round:\n`;
    if (agentRole === 'proponent' && previousRound.opponentClaim) {
      previousContext += `Opponent said: "${previousRound.opponentClaim}"\n`;
    }
    if (agentRole === 'opponent' && previousRound.proponentClaim) {
      previousContext += `Proponent said: "${previousRound.proponentClaim}"\n`;
    }
  }

  return `${agent.systemPrompt}

${roundInstruction}

Topic: ${topic}

Research summary:
${researchSummary}
${previousContext}

Respond in the required JSON format.`;
}

/**
 * Build the judge's evaluation prompt
 */
export function buildJudgePrompt(
  topic: string,
  researchSummary: string,
  rounds: Array<{
    proponentClaim: string;
    opponentClaim: string;
  }>
): string {
  const agent = AGENTS.judge;

  const transcript = rounds
    .map(
      (r, i) =>
        `Round ${i + 1}:\nProponent: "${r.proponentClaim}"\nOpponent: "${r.opponentClaim}"`
    )
    .join('\n\n');

  return `${agent.systemPrompt}

Topic: ${topic}

Research summary:
${researchSummary}

Full debate transcript:
${transcript}

Evaluate both sides and provide your verdict in the required JSON format.`;
}
