'use client';

import { motion } from 'framer-motion';
import type { AgentRole } from '@/types/debate';

const AGENT_STYLES: Record<AgentRole, { bg: string; border: string; label: string; emoji: string }> = {
  proponent: { bg: 'bg-accent-green/20', border: 'border-accent-green', label: 'PRO', emoji: '⚔️' },
  opponent: { bg: 'bg-accent-red/20', border: 'border-accent-red', label: 'CON', emoji: '🛡️' },
  researcher: { bg: 'bg-accent-blue/20', border: 'border-accent-blue', label: 'RESEARCH', emoji: '🔍' },
  judge: { bg: 'bg-accent-gold/20', border: 'border-accent-gold', label: 'JUDGE', emoji: '⚖️' },
};

interface AgentAvatarProps {
  role: AgentRole;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function AgentAvatar({ role, isActive = false, size = 'md' }: AgentAvatarProps) {
  const style = AGENT_STYLES[role];
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  return (
    <motion.div
      className={`relative rounded-full ${style.bg} border-2 ${style.border} ${sizeClasses[size]} flex items-center justify-center font-bold select-none`}
      animate={isActive ? { boxShadow: ['0 0 5px currentColor', '0 0 20px currentColor'] } : {}}
      transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
    >
      <span className="text-lg">{style.emoji}</span>
      <span className={`absolute -bottom-5 text-[10px] font-semibold tracking-wider ${style.border.replace('border', 'text')}`}>
        {style.label}
      </span>
    </motion.div>
  );
}
