'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DEMO_TOPICS, ALL_TOPICS } from '@/lib/agents';
import type { DebateTopic } from '@/types/debate';

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  crypto: { label: 'Crypto', emoji: '₿' },
  geopolitics: { label: 'Geopolitics', emoji: '🌍' },
  stocks: { label: 'Stocks', emoji: '📈' },
  ai: { label: 'AI', emoji: '🤖' },
  custom: { label: 'Custom', emoji: '✨' },
};

const FREE_TOPICS = DEMO_TOPICS; // Exactly 3 free topics
const PASSWORD_PROTECTED_TOPICS = ALL_TOPICS.filter(t => !t.cached);

export default function TopicsPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check localStorage for authentication
  useEffect(() => {
    const isAuthenticated = typeof window !== 'undefined' ? 
      !!localStorage.getItem('oracle_arena_password_verified') : false;
    if (isAuthenticated) setIsAuthenticated(true);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      localStorage.setItem('oracle_arena_password_verified', 'true');
      localStorage.setItem('oracle_arena_password', password);
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setPassword('');
    }
  };

  const handleFreeTopicClick = (topicId: string) => {
    router.push(`/debate/${topicId}`);
  };

  // Only show password modal if not authenticated
  if (!isAuthenticated && PASSWORD_PROTECTED_TOPICS.length > 0) {
    return (
      <motion.main
        className="flex min-h-screen flex-col items-center justify-center bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 🔒 Password Gate for Full Platform Access */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="max-w-4xl w-full px-6"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
              🔒 Oracle Arena
            </h1>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Access premium topics by entering the debate access password. 
              Free demo debates are available below.
            </p>
          </div>

          {/* Password Entry Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
            onSubmit={handlePasswordSubmit}
          >
            <div className="p-6 bg-gradient-to-br from-[--accent-cyan]/20 to-[--accent-gold]/10 border-2 border-[--accent-cyan] rounded-xl text-center">
              <h2 className="text-xl font-bold text-white mb-3">
                🔓 Unlock Full Platform
              </h2>
              <p className="text-zinc-400 text-sm mb-4">
                Enter the access password to browse all debate topics and live debates.
              </p>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access password..."
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-zinc-700 text-white placeholder-zinc-600 focus:border-[--accent-gold] focus:outline-none focus:ring-2 focus:ring-[--accent-cyan]/30 text-sm mb-3"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[--accent-cyan] to-[--accent-gold] text-black font-bold hover:opacity-90 transition-all text-sm shadow-lg"
              >
                🔓 Unlock Platform & Browse Topics
              </button>

              <p className="text-xs text-zinc-500 mt-3">
                Need help? Contact support for the access password.
              </p>
            </div>
          </motion.form>

          {/* Free Demo Topics (Always Accessible) */}
          <section className="mt-12 mb-8">
            <h2 className="text-center text-xl font-bold text-white mb-6 flex items-center justify-center gap-3">
              💡 Free Demo Topics
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                Cached & Free
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
              {FREE_TOPICS.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/debate/${topic.id}`}
                  onClick={() => handleFreeTopicClick(topic.id)}
                  className="group relative block oracle-card p-6 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#251740]/80 text-[--accent-cyan] mb-3 border border-[--accent-cyan]/20">
                        {CATEGORY_LABELS[topic.category]?.emoji} {CATEGORY_LABELS[topic.category]?.label || topic.category}
                      </span>
                      <h3 className="text-lg font-bold leading-tight text-white mb-4">
                        {topic.question}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-500 mt-4 pt-4 border-t border-[--border]/50">
                        <span className="font-medium text-[--accent-cyan]">⚡ Instant Load</span>
                        <span className="text-xs bg-zinc-800/50 px-2 py-1 rounded-full">
                          No Password Required
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <p className="text-center text-zinc-500 text-sm max-w-xl">
            👉 Enter the password above to unlock all topics and live debates. 
            Or click any free demo topic to start instantly!
          </p>
        </motion.div>
      </motion.main>
    );
  }

  // Render topics list when authenticated
  return (
    <motion.main
      className="flex min-h-screen flex-col bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Nav */}
      <nav className="w-full border-b border-[--border] bg-[--background]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/oracle-arena-icon.png"
                alt="Oracle Arena"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-sm font-bold text-[--foreground] group-hover:text-[--accent-cyan] transition-colors">
              Oracle Arena
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-3 py-1.5 text-xs rounded-full bg-[--accent-gold]/20 text-[--accent-gold] hover:bg-[--accent-gold]/30 transition-colors"
            >
              🔒 Access Password
            </button>
          </div>
        </div>
      </nav>

      {/* Topics Grid */}
      <section className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {ALL_TOPICS.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">No topics available</h2>
            <Link href="/topics" className="text-[--accent-cyan] hover:underline">
              Browse all topics
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-black text-white mb-8 text-center">Browse Topics</h1>

            {/* Free / Cached Topics */}
            {FREE_TOPICS.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                  💡 Free Demo Topics
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                    Cached & Instant
                  </span>
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {FREE_TOPICS.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/debate/${topic.id}`}
                      onClick={() => handleFreeTopicClick(topic.id)}
                      className="group relative block oracle-card p-6 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#251740]/80 text-[--accent-cyan] mb-3 border border-[--accent-cyan]/20">
                            {CATEGORY_LABELS[topic.category]?.emoji} {CATEGORY_LABELS[topic.category]?.label || topic.category}
                          </span>
                          <h3 className="text-lg font-bold leading-tight text-white mb-4">
                            {topic.question}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-zinc-500 mt-4 pt-4 border-t border-[--border]/50">
                            <span className="font-medium text-[--accent-cyan]">⚡ Start Now</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Password Protected Topics */}
            {PASSWORD_PROTECTED_TOPICS.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                  🔒 Premium Topics (Access Required)
                  <span className="px-3 py-1 rounded-full bg-[--accent-gold]/20 text-[--accent-gold] text-xs">
                    Enter Password to View
                  </span>
                </h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 bg-gradient-to-br from-[--accent-cyan]/5 to-[--accent-gold]/5 border border-[--accent-gold]/30 rounded-lg text-center mb-8"
                >
                  <h3 className="text-sm font-semibold text-[--accent-gold] mb-2">🔒 Password Protected</h3>
                  <p className="text-xs text-zinc-400 mb-3">
                    Click "Unlock Topics" below to access all premium debate topics.
                  </p>

                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-[--accent-cyan] to-[--accent-gold] text-black font-bold hover:opacity-90 transition-all text-sm shadow-lg"
                  >
                    🔓 Unlock Topics
                  </button>
                </motion.div>

                <AnimatePresence>
                  {showPasswordModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="max-w-md w-full bg-[--background] border border-[--border]/50 rounded-xl p-6"
                      >
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          🔓 Unlock All Topics
                        </h3>
                        <p className="text-zinc-400 text-sm mb-4">
                          Enter the access password to browse all premium debate topics.
                        </p>

                        <form onSubmit={handlePasswordSubmit}>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter access password..."
                            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-zinc-700 text-white placeholder-zinc-600 focus:border-[--accent-gold] focus:outline-none text-sm mb-3"
                          />

                          <div className="flex gap-3">
                            <button
                              type="submit"
                              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[--accent-cyan] to-[--accent-gold] text-black font-bold hover:opacity-90 transition-all text-sm"
                            >
                              🔓 Unlock
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowPasswordModal(false);
                                setPassword('');
                              }}
                              className="flex-1 py-3 rounded-lg border border-[--border] text-zinc-400 hover:bg-[--background]/50 transition-all text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Premium Topics Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {PASSWORD_PROTECTED_TOPICS.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/debate/${topic.id}`}
                      onClick={() => handleFreeTopicClick(topic.id)}
                      className="group relative block oracle-card p-6 transition-all opacity-50 cursor-not-allowed"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#251740]/80 text-[--accent-gold] mb-3 border border-[--accent-gold]/20">
                            {CATEGORY_LABELS[topic.category]?.emoji} {CATEGORY_LABELS[topic.category]?.label || topic.category}
                          </span>
                          <h3 className="text-lg font-bold leading-tight text-white mb-4 line-through opacity-70">
                            {topic.question}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-zinc-500 mt-4 pt-4 border-t border-[--border]/50">
                            <span className="font-medium text-[--accent-gold]">🔒 Password Protected</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-bold text-lg flex items-center gap-2">
                          🔓 Click to Unlock
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </motion.main>
  );
}
