'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
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

  // Simulated debate stats for each topic
  const debateStats: Record<string, { count: number; popularity: number }> = {
    'btc-100k-june': { count: 47, popularity: 92 },
    'fed-rate-cut-june': { count: 31, popularity: 78 },
    'eth-etf-approval': { count: 22, popularity: 65 },
    'ai-jobs-2027': { count: 18, popularity: 55 },
    'nasdaq-50k': { count: 14, popularity: 48 },
    'trump-2028': { count: 38, popularity: 85 },
  };

  // Filter topics
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
    // Navigate to the new debate
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
      <nav className="w-full border-b border-[--color-border] bg-[--color-background]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-zinc-300 hover:text-white transition-colors">
            ← Oracle Arena
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Home
            </Link>
            <Link href="/betting" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Betting Arena
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero */}
      <section className="w-full px-6 py-16 text-center border-b border-[--color-border]">
        <motion.h1
          className="text-5xl md:text-6xl font-black tracking-tight mb-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="bg-gradient-to-r from-[--accent-green] via-[--accent-blue] to-[--accent-gold] bg-clip-text text-transparent">
            Debate Topics
          </span>
        </motion.h1>
        <motion.p
          className="text-lg text-zinc-400 max-w-lg mx-auto"
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
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[--color-surface] border border-[--color-border] rounded-xl px-5 py-3.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
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
                  ? 'bg-[--color-accent-blue] text-white shadow-lg shadow-blue-900/20'
                  : 'bg-[--color-surface] text-zinc-400 border border-[--color-border] hover:border-zinc-500'
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[--accent-green]/20 to-[--accent-blue]/20 border border-[--accent-green]/30 text-[--accent-green] font-semibold hover:from-[--accent-green]/30 hover:to-[--accent-blue]/30 transition-all"
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
              <div className="bg-[--color-surface] border border-[--color-border] rounded-xl p-6 space-y-4">
                <input
                  type="text"
                  placeholder="e.g. Will SpaceX launch a Mars mission by 2030?"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="w-full bg-[--color-background] border border-[--color-border] rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
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
                            ? 'bg-[--color-accent-blue] text-white'
                            : 'bg-[--color-background] text-zinc-400 border border-[--color-border]'
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
                      ? 'bg-gradient-to-r from-[--accent-green] to-[--accent-blue] text-white hover:opacity-90'
                      : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  🚀 Start Debate
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
            <p>No topics found. Try a different search or create one.</p>
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
      <footer className="mt-auto w-full border-t border-[--color-border] py-8 text-center">
        <p className="text-sm text-zinc-600">
          <Link href="/" className="hover:text-zinc-400 transition-colors">← Back to Home</Link>
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
      className="group relative block rounded-xl border border-[--color-border] bg-[--color-surface] p-5 transition-all hover:border-zinc-500 hover:bg-[--color-surface-hover]"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * index }}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1a1a23] text-zinc-400 border border-[--color-border]">
            <span>{catInfo.emoji}</span>
            {catInfo.label}
          </span>
          {topic.cached ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[--accent-green]/10 text-[--accent-green] border border-[--accent-green]/20">
              CACHED
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-700/50 text-zinc-500 border border-zinc-600/30">
              LIVE
            </span>
          )}
        </div>
        <h3 className="text-base font-bold leading-snug group-hover:text-white transition-colors mb-3">
          {topic.question}
        </h3>
        <div className="flex items-center gap-2 text-xs text-zinc-500 pt-3 border-t border-[--color-border]/50">
          <span>⚡ Start debate</span>
          {stats && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-zinc-600">{stats.count} debates</span>
              <div className="flex items-center gap-1">
                <div className="w-8 h-1 bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[--accent-green] to-[--accent-blue] rounded-full" 
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
