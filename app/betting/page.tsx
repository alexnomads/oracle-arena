'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { loadWallet, loadBets, marketFromTopic, calculateOdds, resetBettingState, placeBet } from '@/lib/betting';
import { DEMO_TOPICS } from '@/lib/agents';
import type { UserWallet, Bet, BettingMarket } from '@/types/betting';

const CATEGORY_EMOJI: Record<string, string> = {
  crypto: '₿',
  geopolitics: '🌍',
  stocks: '📈',
  ai: '🤖',
  custom: '✨',
};

export default function BettingMarketsPage() {
  const [wallet, setWallet] = useState<UserWallet>(() => loadWallet());
  const [bets, setBets] = useState<Bet[]>(() => loadBets());
  const [markets, setMarkets] = useState<BettingMarket[]>([]);
  const [filter, setFilter] = useState<'all' | 'my_bets' | 'open' | 'resolved'>('all');

  useEffect(() => {
    // Generate markets from demo topics
    const generated = DEMO_TOPICS.map((t, i) => {
      const conf = 0.4 + (i % 3) * 0.15; // varied confidence
      return marketFromTopic(t, conf, i < 2 ? ('YES' as const) : undefined);
    });
    setMarkets(generated);
  }, []);

  const myBets = bets.filter(b => markets.some(m => m.topicId === b.topicId));
  const pendingBets = myBets.filter(b => b.status === 'pending');
  const totalPotential = pendingBets.reduce((sum, b) => sum + b.potentialPayout, 0);

  const filteredMarkets = markets.filter(m => {
    if (filter === 'my_bets') return bets.some(b => b.topicId === m.topicId);
    if (filter === 'open') return m.status === 'open';
    if (filter === 'resolved') return m.status === 'resolved';
    return true;
  });

  return (
    <motion.main
      className="flex min-h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero */}
      <section className="w-full px-6 py-16 text-center border-b border-[--color-border]">
        <motion.h1
          className="text-5xl md:text-6xl font-black tracking-tight mb-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="bg-gradient-to-r from-[--accent-gold] via-yellow-400 to-[--accent-gold] bg-clip-text text-transparent">
            Betting Arena
          </span>
        </motion.h1>
        <motion.p
          className="text-lg text-zinc-400 max-w-lg mx-auto"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Watch the debate. Place your bet. Win credits.
        </motion.p>
      </section>

      {/* Wallet Card */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-8">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-[--accent-gold]/30 rounded-2xl p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Balance</p>
              <p className="text-2xl font-black text-[--accent-gold]">{wallet.balance}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Wagered</p>
              <p className="text-xl font-bold text-zinc-300">{wallet.totalWagered}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Won</p>
              <p className="text-xl font-bold text-[--accent-green]">{wallet.totalWon}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Pending</p>
              <p className="text-xl font-bold text-[--accent-blue]">{totalPotential > 0 ? `${totalPotential} pot.` : '—'}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[--color-border]/50 flex items-center justify-between">
            <p className="text-xs text-zinc-600">{wallet.betCount} bets placed</p>
            <button
              onClick={() => { resetBettingState(); setWallet(loadWallet()); setBets([]); }}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Reset wallet
            </button>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-6">
        <div className="flex gap-2">
          {(['all', 'open', 'my_bets', 'resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-[--accent-gold] text-black'
                  : 'bg-[--color-surface] text-zinc-400 border border-[--color-border] hover:border-zinc-500'
              }`}
            >
              {f === 'all' ? '🎯 All' : f === 'open' ? '📊 Open' : f === 'my_bets' ? '💰 My Bets' : '✅ Resolved'}
            </button>
          ))}
        </div>
      </div>

      {/* Markets List */}
      <div className="max-w-4xl mx-auto w-full px-6 py-8 pb-24">
        {filteredMarkets.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-4xl mb-3">🎰</p>
            <p>No markets found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMarkets.map((market, index) => (
              <MarketCard
                key={market.topicId}
                market={market}
                userBet={bets.find(b => b.topicId === market.topicId)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-[--color-border] py-8 text-center">
        <p className="text-sm text-zinc-600">
          <Link href="/" className="hover:text-zinc-400 transition-colors">← Back to Home</Link>
          {' · '}Built for Venice AI Hackathon
        </p>
      </footer>
    </motion.main>
  );
}

function MarketCard({ market, userBet, index }: { market: BettingMarket; userBet: Bet | undefined; index: number }) {
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState<'YES' | 'NO' | null>(null);
  const [placed, setPlaced] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="bg-[--color-surface] border border-[--color-border] rounded-xl p-5 space-y-4"
    >
      {/* Topic header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link
            href={`/debate/${market.topicId}`}
            className="text-sm font-bold text-zinc-200 hover:text-white transition-colors"
          >
            {market.topic}
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              market.status === 'open'
                ? 'bg-[--accent-green]/10 text-[--accent-green] border border-[--accent-green]/20'
                : 'bg-zinc-700/50 text-zinc-500 border border-zinc-600/30'
            }`}>
              {market.status === 'open' ? '● OPEN' : '● RESOLVED'}
            </span>
            <span className="text-[10px] text-zinc-600">
              Pool: {(market.totalYesPool + market.totalNoPool).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Odds display */}
        <div className="flex gap-3 ml-4">
          <div className="text-center">
            <div className="text-[10px] text-zinc-500 uppercase">YES</div>
            <div className="text-lg font-black text-[--accent-green]">{market.yesOdds}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-zinc-500 uppercase">NO</div>
            <div className="text-lg font-black text-[--accent-red]">{market.noOdds}</div>
          </div>
        </div>
      </div>

      {/* User bet status */}
      {userBet && (
        <div className="bg-zinc-800/50 rounded-lg p-3 border border-[--color-border]/50 flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            userBet.side === 'YES' ? 'bg-[--accent-green]/20 text-[--accent-green]' : 'bg-[--accent-red]/20 text-[--accent-red]'
          }`}>
            {userBet.side}
          </span>
          <span className="text-xs text-zinc-400">{userBet.amount} credits</span>
          <span className="text-xs text-zinc-500">→ {userBet.potentialPayout} potential</span>
          <span className={`ml-auto text-[10px] font-semibold ${
            userBet.status === 'pending' ? 'text-[--accent-blue]' :
            userBet.status === 'won' ? 'text-[--accent-green]' : 'text-[--accent-red]'
          }`}>
            {userBet.status.toUpperCase()}
          </span>
        </div>
      )}

      {/* Quick bet (only if open and no existing bet) */}
      {market.status === 'open' && !userBet && !placed && (
        <QuickBet
          topicId={market.topicId}
          yesOdds={market.yesOdds}
          noOdds={market.noOdds}
          onPlaced={() => setPlaced(true)}
        />
      )}
    </motion.div>
  );
}

function QuickBet({ topicId, yesOdds, noOdds, onPlaced }: {
  topicId: string;
  yesOdds: number;
  noOdds: number;
  onPlaced: () => void;
}) {
  const [wallet, setWallet] = useState<UserWallet>(() => loadWallet());
  const [bets, setBets] = useState<Bet[]>(() => loadBets());
  const [amount, setAmount] = useState('50');
  const [side, setSide] = useState<'YES' | 'NO'>('YES');

  const handlePlace = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    const odds = side === 'YES' ? yesOdds : noOdds;
    const result = placeBet(wallet, bets, topicId, side, numAmount, odds);
    if (result) {
      setWallet(result.wallet);
      setBets([...bets, result.bet]);
      onPlaced();
    }
  };

  const potential = amount ? Number((parseFloat(amount) * (side === 'YES' ? yesOdds : noOdds)).toFixed(2)) : 0;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={() => setSide('YES')}
        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
          side === 'YES' ? 'bg-[--accent-green] text-black' : 'bg-zinc-700 text-zinc-400'
        }`}
      >
        YES ({yesOdds})
      </button>
      <button
        onClick={() => setSide('NO')}
        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
          side === 'NO' ? 'bg-[--accent-red] text-black' : 'bg-zinc-700 text-zinc-400'
        }`}
      >
        NO ({noOdds})
      </button>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min={1}
        max={wallet.balance}
        className="w-20 bg-[--color-background] border border-[--color-border] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
      />
      <span className="text-[10px] text-zinc-500">→ {potential || 0} pot.</span>
      <button
        onClick={handlePlace}
        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > wallet.balance}
        className={`ml-auto px-4 py-2 rounded-lg text-xs font-bold transition-all ${
          amount && parseFloat(amount) > 0 && parseFloat(amount) <= wallet.balance
            ? 'bg-[--accent-gold] text-black hover:opacity-90'
            : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
        }`}
      >
        Place Bet
      </button>
    </div>
  );
}
