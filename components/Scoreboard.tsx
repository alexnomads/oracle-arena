'use client';

import { motion } from 'framer-motion';
import type { Verdict } from '@/types/debate';

interface ScoreBarProps {
  label: string;
  value: number;
  colorClass: string;
  barBg: string;
}

function ScoreBar({ label, value, colorClass, barBg }: ScoreBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-400 font-medium">{label}</span>
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-bold ${colorClass}`}
        >
          {value}/10
        </motion.span>
      </div>
      <div className="h-2 bg-[#251740] rounded-full overflow-hidden border border-[--border]/30">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${barBg}`}
        />
      </div>
    </div>
  );
}

export default function Scoreboard({ verdict }: { verdict: Verdict | null }) {
  if (!verdict) return null;

  const isYes = verdict.prediction === 'YES';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="oracle-card p-6 space-y-6"
    >
      {/* Verdict Header */}
      <div className="text-center">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">⚖️ Verdict</h3>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className={`text-5xl font-black tracking-tight ${
            isYes ? 'text-[--accent-cyan]' : 'text-[--accent-magenta]'
          }`}
          style={{ 
            textShadow: isYes 
              ? '0 0 30px rgba(0, 240, 255, 0.3)' 
              : '0 0 30px rgba(255, 0, 110, 0.3)' 
          }}
        >
          {verdict.prediction}
        </motion.div>
        <p className="text-sm text-zinc-400 mt-3 flex items-center justify-center gap-2">
          Confidence: 
          <span className="text-[--accent-gold] font-bold">{Math.round(verdict.confidence * 100)}%</span>
        </p>
      </div>

      <div className="border-t border-[--border]" />

      {/* VS Scores */}
      <div className="grid grid-cols-2 gap-6">
        {/* Proponent scores */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h4 className="text-sm font-bold text-[--accent-cyan] mb-3 flex items-center gap-2">
            <span>⚔️</span> Proponent
          </h4>
          <div className="space-y-3">
            <ScoreBar label="Logic" value={verdict.scores.proponent.logic} colorClass="text-[--accent-cyan]" barBg="bg-[--accent-cyan]" />
            <ScoreBar label="Evidence" value={verdict.scores.proponent.evidence} colorClass="text-[--accent-cyan]" barBg="bg-[--accent-cyan]" />
            <ScoreBar label="Persuasion" value={verdict.scores.proponent.persuasion} colorClass="text-[--accent-cyan]" barBg="bg-[--accent-cyan]" />
          </div>
        </motion.div>

        {/* Opponent scores */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-sm font-bold text-[--accent-magenta] mb-3 flex items-center gap-2">
            <span>🛡️</span> Opponent
          </h4>
          <div className="space-y-3">
            <ScoreBar label="Logic" value={verdict.scores.opponent.logic} colorClass="text-[--accent-magenta]" barBg="bg-[--accent-magenta]" />
            <ScoreBar label="Evidence" value={verdict.scores.opponent.evidence} colorClass="text-[--accent-magenta]" barBg="bg-[--accent-magenta]" />
            <ScoreBar label="Persuasion" value={verdict.scores.opponent.persuasion} colorClass="text-[--accent-magenta]" barBg="bg-[--accent-magenta]" />
          </div>
        </motion.div>
      </div>

      {/* Judge reasoning */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-t border-[--border] pt-4"
      >
        <h4 className="text-sm font-bold text-[--accent-white] mb-2 flex items-center gap-2">
          <span>⚖️</span> Judge&apos;s Reasoning
        </h4>
        <p className="text-sm text-zinc-300 leading-relaxed bg-[#0D0D0D]/50 p-4 rounded-lg border border-[--border]/50">
          {verdict.reasoning}
        </p>
      </motion.div>
    </motion.div>
  );
}
