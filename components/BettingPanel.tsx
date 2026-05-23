'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadWallet, loadBets, placeBet, calculateOdds } from '@/lib/betting';
import type { UserWallet, Bet, BettingMarket } from '@/types/betting';
import type { Verdict } from '@/types/debate';

interface BettingPanelProps {
  topicId: string;
  topic: string;
  verdict: Verdict;
}

export default function BettingPanel({ topicId, topic, verdict }: BettingPanelProps) {
  const [wallet, setWallet] = useState<UserWallet>(() => loadWallet());
  const [bets, setBets] = useState<Bet[]>(() => loadBets());
  const [amount, setAmount] = useState('');
  const [selectedSide, setSelectedSide] = useState<'YES' | 'NO' | null>(null);
  const [placed, setPlaced] = useState(false);
  const [lastBet, setLastBet] = useState<Bet | null>(null);

  const { yesOdds, noOdds } = calculateOdds(verdict.confidence);

  const market: BettingMarket = {
    topicId,
    topic,
    yesOdds,
    noOdds,
    totalYesPool: 0,
    totalNoPool: 0,
    status: 'open',
  };

  const handlePlaceBet = useCallback(() => {
    if (!selectedSide || !amount) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const result = placeBet(wallet, bets, topicId, selectedSide, numAmount, selectedSide === 'YES' ? yesOdds : noOdds);
    if (result) {
      setWallet(result.wallet);
      setBets([...bets, result.bet]);
      setLastBet(result.bet);
      setPlaced(true);
      setAmount('');
      setSelectedSide(null);
    }
  }, [wallet, bets, topicId, selectedSide, amount, yesOdds, noOdds]);

  const existingBet = bets.find(b => b.topicId === topicId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[--color-surface] border border-[--color-border] rounded-xl p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <span>🎰</span> Place Your Bet
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Wallet: <span className="text-[--accent-gold] font-bold">{wallet.balance} credits</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Judge Confidence</p>
          <p className="text-sm text-[--accent-gold] font-bold">{Math.round(verdict.confidence * 100)}% → {verdict.prediction}</p>
        </div>
      </div>

      {existingBet ? (
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-[--color-border]/50">
          <p className="text-sm text-zinc-400">You already bet on this topic:</p>
          <div className="flex items-center gap-4 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              existingBet.side === 'YES' ? 'bg-[--accent-green]/20 text-[--accent-green]' : 'bg-[--accent-red]/20 text-[--accent-red]'
            }`}>
              {existingBet.side}
            </span>
            <span className="text-sm text-zinc-300">{existingBet.amount} credits</span>
            <span className="text-xs text-zinc-500">→ {existingBet.potentialPayout} potential</span>
          </div>
        </div>
      ) : (
        <>
          {/* Side selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedSide('YES')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                selectedSide === 'YES'
                  ? 'border-[--accent-green] bg-[--accent-green]/10 shadow-lg shadow-green-900/20'
                  : 'border-[--color-border] bg-[--color-background] hover:border-zinc-500'
              }`}
            >
              <div className="text-2xl mb-1">🟢</div>
              <div className="text-sm font-bold text-[--accent-green]">YES</div>
              <div className="text-xs text-zinc-500 mt-1">Odds: {yesOdds}</div>
            </button>
            <button
              onClick={() => setSelectedSide('NO')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                selectedSide === 'NO'
                  ? 'border-[--accent-red] bg-[--accent-red]/10 shadow-lg shadow-red-900/20'
                  : 'border-[--color-border] bg-[--color-background] hover:border-zinc-500'
              }`}
            >
              <div className="text-2xl mb-1">🔴</div>
              <div className="text-sm font-bold text-[--accent-red]">NO</div>
              <div className="text-xs text-zinc-500 mt-1">Odds: {noOdds}</div>
            </button>
          </div>

          {/* Amount input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
                max={wallet.balance}
                className="flex-1 bg-[--color-background] border border-[--color-border] rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              <button
                onClick={() => setAmount(String(wallet.balance))}
                className="px-4 py-3 rounded-xl bg-zinc-700 text-zinc-300 text-xs font-semibold hover:bg-zinc-600 transition-colors"
              >
                MAX
              </button>
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2">
              {[10, 25, 50, 100].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(String(v))}
                  className="flex-1 py-2 rounded-lg bg-[--color-background] border border-[--color-border] text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all"
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Potential payout preview */}
            {selectedSide && amount && parseFloat(amount) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[--accent-gold]/10 border border-[--accent-gold]/20 rounded-lg p-3 text-center"
              >
                <span className="text-xs text-zinc-400">Potential payout: </span>
                <span className="text-sm font-bold text-[--accent-gold]">
                  {Number((parseFloat(amount) * (selectedSide === 'YES' ? yesOdds : noOdds)).toFixed(2))} credits
                </span>
              </motion.div>
            )}
          </div>

          {/* Place bet button */}
          <button
            onClick={handlePlaceBet}
            disabled={!selectedSide || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > wallet.balance}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              selectedSide && amount && parseFloat(amount) > 0 && parseFloat(amount) <= wallet.balance
                ? 'bg-gradient-to-r from-[--accent-gold] to-yellow-500 text-black hover:opacity-90 shadow-lg shadow-yellow-900/20'
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {selectedSide ? `Bet ${amount || '0'} on ${selectedSide}` : 'Select YES or NO'}
          </button>
        </>
      )}

      {/* Last bet confirmation */}
      <AnimatePresence>
        {placed && lastBet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[--accent-green]/10 border border-[--accent-green]/30 rounded-lg p-4 text-center"
          >
            <p className="text-sm font-bold text-[--accent-green]">✅ Bet Placed!</p>
            <p className="text-xs text-zinc-400 mt-1">
              {lastBet.amount} credits on {lastBet.side} → {lastBet.potentialPayout} potential payout
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
