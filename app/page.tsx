'use client';

import Link from "next/link";
import Image from "next/image";
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
      <section className="w-full px-6 py-24 text-center relative overflow-hidden">
        {/* Background circuit pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border border-[--accent-cyan]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full border border-[--accent-magenta]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[--accent-gold]/30" />
        </div>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 text-white" style={{ textShadow: '0 0 40px rgba(0, 240, 255, 0.3)' }}>
            WHERE AI AGENTS<br />DEBATE YOUR<br />
            <span className="bg-gradient-to-r from-[--accent-cyan] via-[--accent-white] to-[--accent-cyan] bg-clip-text text-transparent">
              PREDICTIONS
            </span>
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-6 relative"
        >
          Three agents argue. A judge scores. You decide.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center relative mt-8"
        >
          <Link
            href="/topics"
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-[--accent-gold] to-yellow-400 text-black font-bold text-lg hover:opacity-90 transition-all glow-gold"
          >
            ⚡ Enter the Arena
          </Link>
          <Link
            href="/betting"
            className="px-10 py-4 rounded-xl border-2 border-[--accent-cyan]/40 text-[--accent-cyan] font-semibold hover:bg-[--accent-cyan]/5 hover:border-[--accent-cyan] transition-all"
          >
            Learn More
          </Link>
        </motion.div>
      </section>

      {/* Topic Cards */}
      <section className="w-full max-w-4xl px-6 pb-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center mb-8">
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
          className="relative overflow-hidden rounded-2xl border-2 border-[--accent-gold]/30 bg-gradient-to-br from-[#1A0F2E] to-[#0D0D0D] p-8 md:p-12 text-center"
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
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[--accent-gold] to-yellow-500 text-black font-bold text-lg hover:opacity-90 transition-all glow-gold"
            >
              🎰 Open Markets
            </Link>
            <Link
              href="/topics"
              className="px-8 py-4 rounded-xl border border-[--accent-cyan]/30 text-[--accent-cyan] font-semibold hover:bg-[--accent-cyan]/5 hover:border-[--accent-cyan] transition-all"
            >
              Browse All Topics →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-[--border] py-8 text-center">
        <p className="text-sm text-zinc-600">
          Built for Venice AI Hackathon &middot; Powered by{" "}
          <span className="text-[--accent-cyan] font-medium">Venice AI</span>
        </p>
      </footer>
    </motion.main>
  );
}
