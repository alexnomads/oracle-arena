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
      className="oracle-card p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[--foreground] flex items-center gap-2">
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
        <div className="bg-[#0D0D0D]/50 rounded-lg p-4 border border-[--border]/50">
          <p className="text-sm text-zinc-400">You already bet on this topic:</p>
          <div className="flex items-center gap-4 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              existingBet.side === 'YES' ? 'bg-[--accent-cyan]/20 text-[--accent-cyan]' : 'bg-[--accent-magenta]/20 text-[--accent-magenta]'
            }`}>
              {existingBet.side}
            </span>
            <span className="text-sm text-zinc-300">{existingBet.amount} credits</span>
            <span className="text-xs text-zinc-500">→ {existingBet.potentialPayout} potential</span>
          </div>
        </div>
      ) : (
        <>
          {/* Side selection — orb style */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedSide('YES')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                selectedSide === 'YES'
                  ? 'border-[--accent-cyan] bg-[--accent-cyan]/10 glow-cyan'
                  : 'border-[--border] bg-[--background] hover:border-[--accent-cyan]/30'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[--accent-cyan]/10 border border-[--accent-cyan]/30 flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold text-[--accent-cyan]">Y</span>
              </div>
              <div className="text-sm font-bold text-[--accent-cyan]">YES</div>
              <div className="text-xs text-zinc-500 mt-1">Odds: {yesOdds}</div>
            </button>
            <button
              onClick={() => setSelectedSide('NO')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                selectedSide === 'NO'
                  ? 'border-[--accent-magenta] bg-[--accent-magenta]/10 glow-magenta'
                  : 'border-[--border] bg-[--background] hover:border-[--accent-magenta]/30'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[--accent-magenta]/10 border border-[--accent-magenta]/30 flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold text-[--accent-magenta]">N</span>
              </div>
              <div className="text-sm font-bold text-[--accent-magenta]">NO</div>
              <div className="text-xs text-zinc-500 mt-1">Odds: {noOdds}</div>
            </button>
          </div>

          {/* Amount input — oracle input style */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount…"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
                max={wallet.balance}
                className="flex-1 bg-[--background] border border-[--border] rounded-xl px-4 py-3 text-[--foreground] placeholder-zinc-500 focus:outline-none focus:border-[--accent-cyan]/50 transition-colors"
              />
              <button
                onClick={() => setAmount(String(wallet.balance))}
                className="px-4 py-3 rounded-xl bg-[--surface] text-zinc-300 text-xs font-semibold hover:bg-[--surface-hover] transition-colors border border-[--border]"
              >
                MAX
              </button>
            </div>

            {/* Quick bet buttons — cyan border */}
            <div className="flex gap-2">
              {[10, 25, 50, 100].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(String(v))}
                  className="flex-1 py-2 rounded-lg bg-[--background] border border-[--accent-cyan]/30 text-xs text-zinc-400 hover:text-[--accent-cyan] hover:border-[--accent-cyan] transition-all"
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

          {/* Place bet button — gold gradient full-width */}
          <button
            onClick={handlePlaceBet}
            disabled={!selectedSide || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > wallet.balance}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              selectedSide && amount && parseFloat(amount) > 0 && parseFloat(amount) <= wallet.balance
                ? 'bg-gradient-to-r from-[--accent-gold] to-yellow-500 text-black hover:opacity-90 glow-gold'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {selectedSide ? `Bet ${amount || '0'} on ${selectedSide}` : 'Select YES or NO'}
          </button>
        </>
      )}

      {/* Last bet confirmation — gold border with confetti */}
      <AnimatePresence>
        {placed && lastBet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[--accent-gold]/10 border-2 border-[--accent-gold]/30 rounded-lg p-4 text-center relative overflow-hidden"
          >
            {/* Confetti dots */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-[--accent-gold]/40"
                initial={{ x: Math.random() * 300 - 150, y: 20, opacity: 0 }}
                animate={{ 
                  y: [20, -20, 20],
                  opacity: [0, 0.8, 0],
                }}
                transition={{ 
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                style={{ left: '50%' }}
              />
            ))}
            <p className="text-sm font-bold text-[--accent-gold] relative">✨ Wisdom prevails! Bet placed.</p>
            <p className="text-xs text-zinc-400 mt-1 relative">
              {lastBet.amount} credits on {lastBet.side} → {lastBet.potentialPayout} potential payout
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
