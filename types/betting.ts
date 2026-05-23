import { DebateTopic } from './debate';

export interface BettingMarket {
  topicId: string;
  topic: string;
  yesOdds: number;      // decimal odds for YES
  noOdds: number;       // decimal odds for NO
  totalYesPool: number;
  totalNoPool: number;
  status: 'open' | 'debating' | 'resolved';
  resolvedAt?: string;
  resolution?: 'YES' | 'NO';
}

export interface Bet {
  id: string;
  topicId: string;
  side: 'YES' | 'NO';
  amount: number;
  potentialPayout: number;
  status: 'pending' | 'won' | 'lost';
  placedAt: string;
  resolvedAt?: string;
  actualPayout?: number;
}

export interface UserWallet {
  balance: number;
  totalWagered: number;
  totalWon: number;
  betCount: number;
}

export interface TopicWithStatus extends DebateTopic {
  debateStatus?: 'available' | 'debating' | 'completed';
  debateCount?: number;
  createdAt?: string;
  popularity?: number;
}
