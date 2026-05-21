'use client';

import { motion } from 'framer-motion';
import type { DebateRound } from '@/types/debate';

interface DebateTranscriptProps {
  rounds: DebateRound[];
}

export default function DebateTranscript({ rounds }: DebateTranscriptProps) {
  if (!rounds.length) {
    return (
      <div className="text-center text-zinc-600 py-8">
        <p>Waiting for debate to start...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {rounds.map((round) => (
        <motion.div
          key={round.round}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Round header */}
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Round {round.round}
            </span>
          </div>

          {/* Proponent */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-full bg-accent-green rounded-full" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-accent-green mb-1">Proponent</h4>
              <p className="text-sm text-zinc-300">{round.proponentClaim}</p>
              {round.proponentEvidence.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {round.proponentEvidence.map((ev, i) => (
                    <li key={i} className="text-xs text-zinc-500 flex gap-1">
                      <span className="text-accent-green">▸</span>
                      <span>{ev.point}</span>
                      {ev.source && <span className="text-zinc-600">({ev.source})</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Opponent */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-full bg-accent-red rounded-full" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-accent-red mb-1">Opponent</h4>
              <p className="text-sm text-zinc-300">{round.opponentClaim}</p>
              {round.opponentEvidence.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {round.opponentEvidence.map((ev, i) => (
                    <li key={i} className="text-xs text-zinc-500 flex gap-1">
                      <span className="text-accent-red">▸</span>
                      <span>{ev.point}</span>
                      {ev.source && <span className="text-zinc-600">({ev.source})</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
