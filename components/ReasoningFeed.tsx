'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AgentRole } from '@/types/debate';

const ROLE_COLORS: Record<string, string> = {
  proponent: 'text-[--accent-cyan]',
  opponent: 'text-[--accent-magenta]',
  judge: 'text-[--accent-white]',
  researcher: 'text-[--accent-gold]',
};

interface ReasoningFeedProps {
  agentRole: AgentRole;
  content: string;
  isActive?: boolean;
}

export default function ReasoningFeed({ agentRole, content, isActive = false }: ReasoningFeedProps) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = ROLE_COLORS[agentRole] || 'text-zinc-400';

  return (
    <motion.div className="mt-3">
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-1.5 text-xs font-medium ${colorClass} hover:opacity-80 transition-opacity group`}
      >
        <motion.span
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-lg"
        >
          ▶
        </motion.span>
        <span className={isActive ? 'animate-pulse' : ''}>
          {isActive ? '🧠 Thinking…' : '📋 Show reasoning'}
        </span>
      </button>

      {/* Hidden content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-2 p-3 rounded-lg bg-[--surface] border border-[--border]/50 text-xs font-mono whitespace-pre-wrap ${colorClass} leading-relaxed`}
            >
              {content.trim()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
