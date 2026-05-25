'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DEMO_TOPICS } from '@/lib/agents';
import type { DebateTopic } from '@/types/debate';

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  crypto: { label: 'Crypto', emoji: '₿' },
  geopolitics: { label: 'Geopolitics', emoji: '🌍' },
  stocks: { label: 'Stocks', emoji: '📈' },
  ai: { label: 'AI', emoji: '🤖' },
  custom: { label: 'Custom', emoji: '✨' },
};

const ALL_CATEGORIES = ['all', 'crypto', 'geopolitics', 'stocks', 'ai', 'custom'];

export default function TopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<DebateTopic[]>(DEMO_TOPICS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customCategory, setCustomCategory] = useState<'crypto' | 'geopolitics' | 'stocks' | 'ai' | 'custom'>('custom');

  const debateStats: Record<string, { count: number; popularity: number }> = {
    'btc-100k-june': { count: 47, popularity: 92 },
    'fed-rate-cut-june': { count: 31, popularity: 78 },
    'eth-etf-approval': { count: 22, popularity: 65 },
    'ai-jobs-2027': { count: 18, popularity: 55 },
    'nasdaq-50k': { count: 14, popularity: 48 },
    'trump-2028': { count: 38, popularity: 85 },
  };

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.question.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || topic.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAddCustomTopic = () => {
    if (!customQuestion.trim()) return;
    const newTopic: DebateTopic = {
      id: `custom-${Date.now()}`,
      question: customQuestion.trim(),
      category: customCategory,
      cached: false,
    };
    setTopics((prev) => [newTopic, ...prev]);
    setCustomQuestion('');
    setShowCustomForm(false);
    router.push(`/debate/${newTopic.id}`);
  };

  return (
    <motion.main
      className="flex min-h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Nav */}
      <nav className="w-full border-b border-[--border] bg-[--background]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image src="/oracle-arena-icon.png" alt="Oracle Arena" fill className="object-contain" />
            </div>
            <span className="text-sm font-bold text-[--foreground] group-hover:text-[--accent-cyan] transition-colors">
              Oracle Arena
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-zinc-500 hover:text-[--accent-cyan] transition-colors">
              Home
            </Link>
            <Link href="/betting" className="text-xs text-zinc-500 hover:text-[--accent-gold] transition-colors">
              Betting Arena
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="w-full px-6 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full border border-[--accent-magenta]" />
          <div className="absolute bottom-1/3 left-1/3 w-56 h-56 rounded-full border border-[--accent-cyan]" />
        </div>
        <motion.h1
          className="text-5xl md:text-7xl font-black tracking-tight mb-3 relative text-white"
          style={{ textShadow: '0 0 40px rgba(0, 240, 255, 0.2)' }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="bg-gradient-to-r from-[--accent-cyan] via-[--accent-white] to-[--accent-magenta] bg-clip-text text-transparent">
            DEBATE TOPICS
          </span>
        </motion.h1>
        <motion.p
          className="text-lg text-zinc-400 max-w-lg mx-auto relative"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Browse predictions or create your own. Three agents will debate it.
        </motion.p>
      </section>

      {/* Search + Filters */}
      <div className="max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Search bar */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search topics…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[--surface] border border-[--border] rounded-xl px-5 py-3.5 text-[--foreground] placeholder-zinc-500 focus:outline-none focus:border-[--accent-cyan]/50 transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
        </motion.div>

        {/* Category chips */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat
                  ? 'bg-[--accent-cyan] text-black shadow-lg shadow-cyan-900/20'
                  : 'bg-[#251740] text-zinc-400 border border-[--border] hover:border-[--accent-cyan]/30'
              }`}
            >
              {cat === 'all' ? '🎯 All' : `${CATEGORY_LABELS[cat]?.emoji || ''} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
            </button>
          ))}
        </motion.div>

        {/* New topic button */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[--accent-cyan]/10 border border-[--accent-cyan]/30 text-[--accent-cyan] font-semibold hover:bg-[--accent-cyan]/20 transition-all"
          >
            <span className="text-lg">{showCustomForm ? '✕' : '➕'}</span>
            {showCustomForm ? 'Cancel' : 'Create Custom Topic'}
          </button>
        </motion.div>

        {/* Custom topic form */}
        <AnimatePresence>
          {showCustomForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="oracle-card p-6 space-y-4">
                <input
                  type="text"
                  placeholder="e.g. Will SpaceX launch a Mars mission by 2030?"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="w-full bg-[--background] border border-[--border] rounded-xl px-4 py-3 text-[--foreground] placeholder-zinc-500 focus:outline-none focus:border-[--accent-cyan]/50 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCustomTopic();
                  }}
                />
                <div className="flex gap-3 items-center">
                  <span className="text-sm text-zinc-500">Category:</span>
                  <div className="flex gap-2">
                    {(['crypto', 'geopolitics', 'stocks', 'ai', 'custom'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCustomCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          customCategory === cat
                            ? 'bg-[--accent-cyan] text-black'
                            : 'bg-[--background] text-zinc-400 border border-[--border]'
                        }`}
                      >
                        {CATEGORY_LABELS[cat]?.emoji} {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddCustomTopic}
                  disabled={!customQuestion.trim()}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    customQuestion.trim()
                      ? 'bg-gradient-to-r from-[--accent-gold] to-yellow-400 text-black hover:opacity-90 glow-gold'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  ⚡ Start Debate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Topics grid */}
      <div className="max-w-4xl mx-auto w-full px-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-zinc-500">
            {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-4xl mb-3">🔍</p>
            <p>The arena is silent… for now.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTopics.map((topic, index) => (
              <TopicCard key={topic.id} topic={topic} index={index} stats={debateStats[topic.id]} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-[--border] py-8 text-center">
        <p className="text-sm text-zinc-600">
          <Link href="/" className="hover:text-[--accent-cyan] transition-colors">← Back to Home</Link>
          {' · '}Built for Venice AI Hackathon
        </p>
      </footer>
    </motion.main>
  );
}

function TopicCard({ topic, index, stats }: { topic: DebateTopic; index: number; stats?: { count: number; popularity: number } }) {
  const catInfo = CATEGORY_LABELS[topic.category] || { label: topic.category, emoji: '📌' };

  return (
    <Link
      href={`/debate/${topic.id}`}
      className="group relative block oracle-card p-5 transition-all"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * index }}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#251740]/80 text-[--accent-cyan] border border-[--accent-cyan]/20">
            <span>{catInfo.emoji}</span>
            {catInfo.label}
          </span>
          {topic.cached ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[--accent-gold]/10 text-[--accent-gold] border border-[--accent-gold]/20">
              CACHED
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[--accent-cyan]/10 text-[--accent-cyan] border border-[--accent-cyan]/20">
              LIVE
            </span>
          )}
        </div>
        <h3 className="text-base font-bold leading-snug group-hover:text-white transition-colors mb-3 text-[--foreground]">
          {topic.question}
        </h3>
        <div className="flex items-center gap-2 text-xs text-zinc-500 pt-3 border-t border-[--border]/50">
          <span className="text-[--accent-cyan]">⚡ Start debate</span>
          {stats && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-zinc-600">{stats.count} debates</span>
              <div className="flex items-center gap-1">
                <div className="w-8 h-1 bg-[#251740] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[--accent-cyan] to-[--accent-magenta] rounded-full" 
                    style={{ width: `${stats.popularity}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-600">{stats.popularity}%</span>
              </div>
            </div>
          )}
          {!stats && <span className="ml-auto text-zinc-600">→</span>}
        </div>
      </motion.div>
    </Link>
  );
}
