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
    <div className="space-y-8">
      {rounds.map((round, roundIndex) => (
        <motion.div
          key={round.round}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: roundIndex * 0.1 }}
          className="space-y-4"
        >
          {/* Round header */}
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: roundIndex * 0.1 }}
              className={`text-2xl ${
                roundIndex === 2 ? 'text-[--color-accent-gold]' : 'text-zinc-500'
              }`}
            >
              Round {round.round}
            </motion.div>
            <div className="h-px flex-1 bg-[--color-border]/30" />
          </div>

          {/* Proponent */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: roundIndex * 0.1 + 0.1 }}
            className="flex gap-4 group"
          >
            <div className="flex-shrink-0 w-1 h-full bg-[--color-accent-green] rounded-full opacity-30 group-hover:opacity-60 transition-opacity" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[--color-accent-green] mb-2 flex items-center gap-2">
                <span>⚔️</span> Proponent
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed">{round.proponentClaim}</p>
              {round.proponentEvidence.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: roundIndex * 0.1 + 0.2, duration: 0.3 }}
                  className="mt-3 space-y-1.5"
                >
                  {round.proponentEvidence.map((ev, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-xs text-zinc-500 flex gap-1.5 items-start"
                    >
                      <span className="text-[--color-accent-green] mt-0.5">▸</span>
                      <span>{ev.point}</span>
                      {ev.source && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 + 0.1 }}
                          className="text-xs text-zinc-600 ml-1"
                        >
                          ({ev.source})
                        </motion.span>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>

          {/* Opponent */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: roundIndex * 0.1 + 0.2 }}
            className="flex gap-4 group"
          >
            <div className="flex-shrink-0 w-1 h-full bg-[--color-accent-red] rounded-full opacity-30 group-hover:opacity-60 transition-opacity" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[--color-accent-red] mb-2 flex items-center gap-2">
                <span>🛡️</span> Opponent
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed">{round.opponentClaim}</p>
              {round.opponentEvidence.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: roundIndex * 0.1 + 0.2, duration: 0.3 }}
                  className="mt-3 space-y-1.5"
                >
                  {round.opponentEvidence.map((ev, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-xs text-zinc-500 flex gap-1.5 items-start"
                    >
                      <span className="text-[--color-accent-red] mt-0.5">▸</span>
                      <span>{ev.point}</span>
                      {ev.source && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 + 0.1 }}
                          className="text-xs text-zinc-600 ml-1"
                        >
                          ({ev.source})
                        </motion.span>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
