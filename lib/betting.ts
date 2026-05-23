/**
 * Betting state management — localStorage-backed wallet + bet tracking.
 * Client-side only for hackathon demo. Swap for Supabase/WalletConnect in prod.
 */
import { Bet, BettingMarket, UserWallet } from '@/types/betting';
import { DebateTopic } from '@/types/debate';

const WALLET_KEY = 'oracle_arena_wallet';
const BETS_KEY = 'oracle_arena_bets';
const DEMO_BALANCE = 1000;

/**
 * Load wallet from localStorage or create fresh demo wallet
 */
export function loadWallet(): UserWallet {
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return createFreshWallet();
}

function createFreshWallet(): UserWallet {
  const wallet: UserWallet = {
    balance: DEMO_BALANCE,
    totalWagered: 0,
    totalWon: 0,
    betCount: 0,
  };
  saveWallet(wallet);
  return wallet;
}

export function saveWallet(wallet: UserWallet): void {
  try {
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  } catch {}
}

/**
 * Load all bets from localStorage
 */
export function loadBets(): Bet[] {
  try {
    const raw = localStorage.getItem(BETS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveBets(bets: Bet[]): void {
  try {
    localStorage.setItem(BETS_KEY, JSON.stringify(bets));
  } catch {}
}

/**
 * Calculate decimal odds from judge confidence.
 * confidence 0.8 → YES odds 1.25, NO odds 5.0
 * Adds small house edge (2%)
 */
export function calculateOdds(confidence: number): { yesOdds: number; noOdds: number } {
  const houseEdge = 0.02;
  const yesProb = confidence;
  const noProb = 1 - confidence;

  // Apply house edge
  const adjustedYesProb = yesProb * (1 + houseEdge);
  const adjustedNoProb = noProb * (1 + houseEdge);

  const yesOdds = Number((1 / adjustedYesProb).toFixed(2));
  const noOdds = Number((1 / adjustedNoProb).toFixed(2));

  return { yesOdds, noOdds };
}

/**
 * Place a bet. Returns the new bet or null if insufficient balance.
 */
export function placeBet(
  wallet: UserWallet,
  existingBets: Bet[],
  topicId: string,
  side: 'YES' | 'NO',
  amount: number,
  odds: number
): { wallet: UserWallet; bet: Bet } | null {
  if (amount > wallet.balance) return null;
  if (amount <= 0) return null;

  const newWallet: UserWallet = {
    ...wallet,
    balance: wallet.balance - amount,
    totalWagered: wallet.totalWagered + amount,
    betCount: wallet.betCount + 1,
  };

  const bet: Bet = {
    id: `bet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    topicId,
    side,
    amount,
    potentialPayout: Number((amount * odds).toFixed(2)),
    status: 'pending',
    placedAt: new Date().toISOString(),
  };

  saveWallet(newWallet);
  saveBets([...existingBets, bet]);

  return { wallet: newWallet, bet };
}

/**
 * Generate BettingMarket from a completed debate topic + verdict confidence
 */
export function marketFromTopic(topic: DebateTopic, confidence?: number, resolution?: 'YES' | 'NO'): BettingMarket {
  const conf = confidence ?? 0.5 + Math.random() * 0.3;
  const { yesOdds, noOdds } = calculateOdds(conf);

  return {
    topicId: topic.id,
    topic: topic.question,
    yesOdds,
    noOdds,
    totalYesPool: Math.floor(Math.random() * 5000) + 500,
    totalNoPool: Math.floor(Math.random() * 5000) + 500,
    status: resolution ? 'resolved' : 'open',
    resolution,
  };
}

/**
 * Reset wallet and bets (for demo purposes)
 */
export function resetBettingState(): void {
  localStorage.removeItem(WALLET_KEY);
  localStorage.removeItem(BETS_KEY);
}
