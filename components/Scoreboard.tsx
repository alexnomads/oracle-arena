'use client';

import { motion } from 'framer-motion';
import type { Verdict } from '@/types/debate';

interface ScoreboardProps {
  verdict: Verdict | null;
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className={`font-bold ${color}`}>{value}/10</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
    </div>
  );
}

export default function Scoreboard({ verdict }: ScoreboardProps) {
  if (!verdict) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface border border-border rounded-xl p-6 space-y-6"
    >
      {/* Verdict */}
      <div className="text-center">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Verdict</h3>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`text-4xl font-bold ${verdict.prediction === 'YES' ? 'text-accent-green' : 'text-accent-red'}`}
        >
          {verdict.prediction}
        </motion.div>
        <p className="text-sm text-zinc-400 mt-1">
          Confidence: <span className="text-accent-gold font-bold">{Math.round(verdict.confidence * 100)}%</span>
        </p>
      </div>

      <div className="border-t border-border" />

      {/* Scores */}
      <div className="grid grid-cols-2 gap-6">
        {/* Proponent scores */}
        <div>
          <h4 className="text-sm font-semibold text-accent-green mb-3">Proponent</h4>
          <div className="space-y-3">
            <ScoreBar label="Logic" value={verdict.scores.proponent.logic} color="text-accent-green" />
            <ScoreBar label="Evidence" value={verdict.scores.proponent.evidence} color="text-accent-green" />
            <ScoreBar label="Persuasion" value={verdict.scores.proponent.persuasion} color="text-accent-green" />
          </div>
        </div>

        {/* Opponent scores */}
        <div>
          <h4 className="text-sm font-semibold text-accent-red mb-3">Opponent</h4>
          <div className="space-y-3">
            <ScoreBar label="Logic" value={verdict.scores.opponent.logic} color="text-accent-red" />
            <ScoreBar label="Evidence" value={verdict.scores.opponent.evidence} color="text-accent-red" />
            <ScoreBar label="Persuasion" value={verdict.scores.opponent.persuasion} color="text-accent-red" />
          </div>
        </div>
      </div>

      {/* Judge reasoning */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-semibold text-accent-gold mb-2">Judge&apos;s Reasoning</h4>
        <p className="text-sm text-zinc-400 leading-relaxed">{verdict.reasoning}</p>
      </div>
    </motion.div>
  );
}
