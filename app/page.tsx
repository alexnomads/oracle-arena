'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DEMO_TOPICS } from '../lib/agents';
import type { DebateTopic } from '../lib/types/debate';

const CATEGORY_LABELS: Record<string, string> = {
  crypto: '₿ Crypto',
  geopolitics: '🌍 Geopolitics',
  stocks: '📈 Stocks',
  ai: '🤖 AI',
};

interface TopicCardProps {
  topic: DebateTopic;
}

function TopicCard({ topic }: TopicCardProps) {
  const category = CATEGORY_LABELS[topic.category] || topic.category;
  
  return (
    <Link
      href={`/debate/${topic.id}`}
      className="group relative block oracle-card p-6 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#251740]/80 text-[--accent-cyan] mb-4 border border-[--accent-cyan]/20">
            {category}
          </span>
          <h3 className="text-xl font-bold leading-tight group-hover:text-white transition-colors mb-3 text-[--foreground]">
            {topic.question}
          </h3>
          <div className="flex items-center gap-2 text-sm text-zinc-500 mt-4 pt-4 border-t border-[--border]/50">
            <span className="font-medium text-[--accent-cyan]">⚡ Start Now</span>
            {topic.cached && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="flex items-center gap-1 text-[--accent-gold]"
              >
                <span className="block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                Instant
              </motion.span>
            )}
          </div>
        </div>
        {/* Decorative corner accent */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[--accent-cyan] to-transparent opacity-20" />
        </div>
      </div>
    </Link>
  );
}

// 🔒 Password Gate for Live Debates (custom topics) - CLEAR UI
function PasswordGate() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.55, duration: 0.5 }}
      className="max-w-md mx-auto mt-6"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="p-5 bg-gradient-to-r from-[--accent-cyan]/20 to-[--accent-gold]/10 border-2 border-[--accent-cyan] rounded-xl text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-2xl">🔒</span>
          <h3 className="text-lg font-bold text-white">
            Unlock Full Platform Access
          </h3>
          <span className="text-2xl">🔓</span>
        </div>
        
        <p className="text-sm text-zinc-400 mb-4">
          Enter the access password to unlock all premium debate topics and run live debates. 
          The free demo topics below are available instantly!
        </p>

        <form className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Enter access password..."
            className="w-full px-4 py-3 rounded-lg bg-black/50 border-2 border-zinc-700 text-white placeholder-zinc-600 focus:border-[--accent-gold] focus:outline-none transition-all text-sm"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[--accent-cyan] to-[--accent-gold] text-black font-bold hover:opacity-90 transition-all text-sm shadow-lg"
          >
            🔓 Unlock Full Platform
          </button>
        </form>

        <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-500 leading-relaxed">
            ⚡ <strong>Free Topics Below:</strong> Click any demo topic for instant load without a password.<br/>
            🔒 <strong>Full Access:</strong> Unlock to browse all markets and run live debates.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const dynamic = 'force-dynamic';
export default function Home() {
  return (
    <motion.main
      className="flex min-h-screen flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Nav */}
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
            <Link href="/topics" className="text-xs text-zinc-500 hover:text-[--accent-cyan] transition-colors">
              Browse Topics
            </Link>
            <Link href="/betting" className="text-xs text-zinc-500 hover:text-[--accent-gold] transition-colors">
              Betting Arena
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="w-full px-6 py-12 md:py-24 text-center relative overflow-hidden">
        {/* Background circuit pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border border-[--accent-cyan]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full border border-[--accent-magenta]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[--accent-gold]/30" />
        </div>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative z-10"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 text-white leading-[1.1]" style={{ textShadow: '0 0 40px rgba(0, 240, 255, 0.3)' }}>
            WHERE AI AGENTS<br />DEBATE YOUR<br />
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-[--accent-cyan] to-[--accent-gold] blur-xl opacity-40 rounded-lg" />
              <span className="relative bg-gradient-to-r from-[--accent-cyan] via-[#fff] to-[--accent-gold] bg-clip-text text-transparent">
                PREDICTIONS
              </span>
            </span>
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-base md:text-xl lg:text-2xl text-zinc-400 max-w-2xl mx-auto mb-4 md:mb-6 relative"
        >
          Three agents argue. A judge scores. You decide.
        </motion.p>

        {/* 🔒 Password Gate for Live Debates */}
        <PasswordGate />
      </section>

      {/* 🔒 Cached Markets Section (Free Demo) - Only 3 Topics */}
      <section className="w-full max-w-4xl px-6 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-2">
            💡 Free Demo Topics
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Click any cached debate to start instantly — no password needed!
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {DEMO_TOPICS.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </motion.div>

        {/* Password Protected Notice */}
        <div className="mt-8 p-4 bg-gradient-to-r from-[--accent-gold]/10 to-transparent border border-[--accent-gold]/30 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-xl">🔒</span>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">Premium Topics (Password Protected)</h4>
              <p className="text-sm text-zinc-500">
                Browse all markets and topics by entering the access password. 
                Unlock premium content including stocks, crypto analysis, geopolitics forecasts, and more!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="w-full py-8 text-center">
        <Link
          href="/topics"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[--accent-gold]/20 border border-[--accent-gold]/40 text-[--accent-gold] hover:bg-[--accent-gold]/30 transition-all font-semibold text-sm"
        >
          <span>🔓 Browse All Topics</span>
          <span className="text-lg">→</span>
        </Link>
      </footer>
    </motion.main>
  );
}
