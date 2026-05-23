'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { DEMO_TOPICS } from "@/lib/agents";

const CATEGORY_LABELS: Record<string, string> = {
  crypto: "₿ Crypto",
  geopolitics: "🌍 Geopolitics",
  stocks: "📈 Stocks",
  ai: "🤖 AI",
};

interface TopicCardProps {
  topic: typeof DEMO_TOPICS[0];
}

function TopicCard({ topic }: TopicCardProps) {
  const category = CATEGORY_LABELS[topic.category] || topic.category;
  
  return (
    <Link
      href={`/debate/${topic.id}`}
      className="group relative block rounded-xl border border-[--color-border] bg-[--color-surface] p-6 transition-all hover:border-zinc-600 hover:bg-[--color-surface-hover]"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-[#1a1a23] text-[--color-foreground] mb-4 border border-[--color-border]">
            {category}
          </span>
          <h3 className="text-xl font-bold leading-tight group-hover:text-white transition-colors mb-3">
            {topic.question}
          </h3>
          <div className="flex items-center gap-2 text-sm text-zinc-500 mt-4 pt-4 border-t border-[--color-border]/50">
            <span className="font-medium">⚡ Start debate</span>
            {topic.cached && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="flex items-center gap-1 text-[--accent-green]"
              >
                <span className="block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                Instant
              </motion.span>
            )}
          </div>
        </div>
        {/* Decorative corner accent */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[--color-accent-green] to-transparent opacity-20" />
        </div>
      </div>
    </Link>
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
      <nav className="w-full border-b border-[--color-border] bg-[--color-background]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-zinc-300 hover:text-white transition-colors">
            Oracle Arena
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/topics" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Browse Topics
            </Link>
            <Link href="/betting" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Betting Arena
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero */}
      <section className="w-full px-6 py-24 text-center">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-[--accent-green] via-[--accent-blue] to-[--accent-gold] bg-clip-text text-transparent">
              Oracle Arena
            </span>
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl md:text-3xl text-zinc-400 max-w-2xl mx-auto mb-6"
        >
          Where AI agents debate your predictions.
        </motion.p>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-zinc-500 max-w-xl mx-auto text-lg"
        >
          Three agents argue. A judge scores. You decide who's right.
        </motion.p>
      </section>

      {/* Topic Cards */}
      <section className="w-full max-w-4xl px-6 pb-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-xs font-bold text-zinc-600 uppercase tracking-widest text-center mb-8">
            Select a Debate to Start
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {DEMO_TOPICS.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + (index % 2) * 0.1, duration: 0.5 }}
              >
                <TopicCard topic={topic} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Betting Arena CTA */}
      <section className="w-full max-w-4xl px-6 pb-24">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-[--accent-gold]/30 bg-gradient-to-br from-[#1a1a2e] to-[#16162a] p-8 md:p-12 text-center"
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[--accent-gold]/5 rounded-full blur-3xl" />
          
          <h2 className="text-3xl md:text-4xl font-black mb-3 relative">
            <span className="bg-gradient-to-r from-[--accent-gold] via-yellow-400 to-[--accent-gold] bg-clip-text text-transparent">
              Betting Arena
            </span>
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-6 relative">
            Watch the debate. Place your bet on YES or NO. Win credits when you&apos;re right.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
            <Link
              href="/betting"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[--accent-gold] to-yellow-500 text-black font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-yellow-900/20"
            >
              🎰 Open Markets
            </Link>
            <Link
              href="/topics"
              className="px-8 py-4 rounded-xl border border-[--color-border] text-zinc-300 font-semibold hover:border-zinc-500 hover:text-white transition-all"
            >
              Browse All Topics →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-[--color-border] py-8 text-center">
        <p className="text-sm text-zinc-600">
          Built for Venice AI Hackathon &middot; Powered by{" "}
          <span className="text-zinc-400 font-medium">Venice AI</span>
        </p>
      </footer>
    </motion.main>
  );
}
