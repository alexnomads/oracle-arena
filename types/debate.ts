// Debate event types for SSE streaming
export type DebateEventType =
  | 'research'
  | 'round_start'
  | 'agent_speaking'
  | 'reasoning'
  | 'agent_said'
  | 'round_end'
  | 'judge_reasoning'
  | 'verdict'
  | 'error';

export type AgentRole = 'proponent' | 'opponent' | 'researcher' | 'judge';

export interface DebateTopic {
  id: string;
  question: string;
  category: 'crypto' | 'geopolitics' | 'stocks' | 'ai' | 'custom';
  cached?: boolean;
}

export interface AgentConfig {
  role: AgentRole;
  model: string;
  systemPrompt: string;
  reasoningEffort: 'none' | 'low' | 'medium' | 'high';
  voiceId?: string;
  voiceLabel: string;
}

export interface EvidencePoint {
  point: string;
  source?: string | null;
}

export interface DebateRound {
  round: number;
  proponentClaim: string;
  proponentEvidence: EvidencePoint[];
  opponentClaim: string;
  opponentEvidence: EvidencePoint[];
  proponentCounter?: string | null;
  opponentCounter?: string | null;
}

export interface AgentScore {
  logic: number;
  evidence: number;
  persuasion: number;
}

export interface Verdict {
  prediction: 'YES' | 'NO';
  confidence: number;
  scores: {
    proponent: AgentScore;
    opponent: AgentScore;
  };
  reasoning: string;
}

export interface DebateTranscript {
  topicId: string;
  topic: string;
  researchSummary?: string;
  rounds: DebateRound[];
  verdict?: Verdict;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface SSEMessage {
  type: DebateEventType;
  agentRole?: AgentRole;
  data?: unknown;
  timestamp: string;
}
