'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AgentRole } from '@/types/debate';

const ROLE_COLORS: Record<string, string> = {
  proponent: 'text-accent-green',
  opponent: 'text-accent-red',
  judge: 'text-accent-gold',
  researcher: 'text-accent-blue',
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
    <div className="mt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`text-xs flex items-center gap-1 ${colorClass} hover:opacity-80 transition-opacity`}
      >
        <span className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>
        {isActive ? '🧠 Thinking...' : '📋 Show reasoning'}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`mt-2 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-sm ${colorClass} font-mono whitespace-pre-wrap`}>
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
