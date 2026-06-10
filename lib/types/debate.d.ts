import type { DebateTopic } from '@/lib/agents';

export interface AgentConfig {
  role: string;
  model: string;
  reasoningEffort: 'low' | 'medium' | 'high';
  voiceId: string;
  voiceLabel: string;
  name?: string;
  backstory?: string;
  tone?: string;
  quirks?: string;
  visualStyle?: {
    borderAnimation?: string;
    cornerStyle?: string;
    quoteMarker?: string;
  };
  systemPrompt?: string;
}

export interface DebateTopic {
  id: string;
  question: string;
  category: 'crypto' | 'geopolitics' | 'stocks' | 'ai' | 'custom';
  cached?: boolean;
}
