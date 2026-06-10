import { AgentConfig } from '@/types/debate';

/**
 * 🔒 Free Demo Topics - Available without password
 * Exactly 3 cached debates for instant loading
 */
export const DEMO_TOPICS: Array<{id: string; question: string; category: 'crypto' | 'geopolitics' | 'stocks' | 'ai'; cached: boolean}> = [
  {
    id: 'btc-100k-june',
    question: 'Will ETH exceed $5,000 by end of 2026?',
    category: 'crypto',
    cached: true,
  },
  {
    id: 'ai-jobs-2027',
    question: 'Will AI cause net job losses in tech by 2027?',
    category: 'ai',
    cached: true,
  },
  {
    id: 'taiwan-invasion',
    question: 'Will China invade Taiwan by end of 2026?',
    category: 'geopolitics',
    cached: true,
  },
];

/**
 * 🔒 All Topics - Require password for access (except DEMO_TOPICS)
 */
export const ALL_TOPICS: DebateTopic[] = [
  ...DEMO_TOPICS,
  {
    id: 'fed-rate-cut-june',
    question: 'Will the Fed cut rates in June 2026?',
    category: 'stocks',
    cached: false, // Requires password to access
  },
  {
    id: 'eth-etf-approval',
    question: 'Will ETFs approve Ethereum by Q3 2026?',
    category: 'crypto',
    cached: false, // Requires password
  },
  {
    id: 'nasdaq-50k',
    question: 'Will NASDAQ reach $50K by end of 2026?',
    category: 'stocks',
    cached: false, // Requires password
  },
  {
    id: 'trump-2028',
    question: 'Will Trump win the 2028 election?',
    category: 'geopolitics',
    cached: false, // Requires password
  },
];

export interface DebateTopic {
  id: string;
  question: string;
  category: 'crypto' | 'geopolitics' | 'stocks' | 'ai' | 'custom';
  cached?: boolean;
}
