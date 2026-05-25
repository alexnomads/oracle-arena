'use client';

import { motion } from 'framer-motion';
import type { AgentRole } from '@/types/debate';

const AGENT_STYLES: Record<AgentRole, { bg: string; border: string; label: string; emoji: string; glow: string }> = {
  proponent: { 
    bg: 'bg-[--accent-cyan]/10', 
    border: 'border-[--accent-cyan]', 
    label: 'PRO', 
    emoji: '⚔️',
    glow: 'rgba(0, 240, 255, 0.4)',
  },
  opponent: { 
    bg: 'bg-[--accent-magenta]/10', 
    border: 'border-[--accent-magenta]', 
    label: 'CON', 
    emoji: '🛡️',
    glow: 'rgba(255, 0, 110, 0.4)',
  },
  researcher: { 
    bg: 'bg-[--accent-gold]/10', 
    border: 'border-[--accent-gold]', 
    label: 'RCH', 
    emoji: '🔍',
    glow: 'rgba(255, 215, 0, 0.4)',
  },
  judge: { 
    bg: 'bg-[--accent-white]/10', 
    border: 'border-[--accent-white]', 
    label: 'JUDGE', 
    emoji: '⚖️',
    glow: 'rgba(245, 245, 240, 0.4)',
  },
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

  const colorClass = 
    role === 'proponent' ? 'text-[--accent-cyan]' :
    role === 'opponent' ? 'text-[--accent-magenta]' :
    role === 'judge' ? 'text-[--accent-white]' : 'text-[--accent-gold]';

  return (
    <motion.div
      className={`relative rounded-full ${style.bg} border-2 ${style.border} ${sizeClasses[size]} flex items-center justify-center font-bold select-none`}
      initial={false}
      animate={{ 
        boxShadow: isActive ? [`0 0 5px ${style.glow}`, `0 0 20px ${style.glow}`] : 'none',
        scale: isActive ? [1, 1.05, 1] : 1
      }}
      transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
    >
      <span className="text-lg">{style.emoji}</span>
      {size === 'sm' && (
        <span className={`absolute -bottom-4 text-[8px] font-semibold tracking-wider uppercase ${colorClass}`}>
          {style.label}
        </span>
      )}
    </motion.div>
  );
}
