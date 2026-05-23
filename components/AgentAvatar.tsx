'use client';

import { motion } from 'framer-motion';
import type { AgentRole } from '@/types/debate';

const AGENT_STYLES: Record<AgentRole, { bg: string; border: string; label: string; emoji: string }> = {
  proponent: { 
    bg: 'bg-[--color-accent-green]/10', 
    border: 'border-[--color-accent-green]', 
    label: 'PRO', 
    emoji: '⚔️' 
  },
  opponent: { 
    bg: 'bg-[--color-accent-red]/10', 
    border: 'border-[--color-accent-red]', 
    label: 'CON', 
    emoji: '🛡️' 
  },
  researcher: { 
    bg: 'bg-zinc-800', 
    border: 'border-zinc-600', 
    label: 'RCH', 
    emoji: '🔍' 
  },
  judge: { 
    bg: 'bg-[--color-accent-gold]/10', 
    border: 'border-[--color-accent-gold]', 
    label: 'JUDGE', 
    emoji: '⚖️' 
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

  return (
    <motion.div
      className={`relative rounded-full ${style.bg} border-2 ${style.border} ${sizeClasses[size]} flex items-center justify-center font-bold select-none`}
      initial={false}
      animate={{ 
        boxShadow: isActive ? ['0 0 5px currentColor', '0 0 20px currentColor'] : 'none',
        scale: isActive ? [1, 1.05, 1] : 1
      }}
      transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
    >
      <span className="text-lg">{style.emoji}</span>
      {size === 'sm' && (
        <span className={`absolute -bottom-4 text-[8px] font-semibold tracking-wider uppercase ${
          role === 'proponent' ? 'text-[--color-accent-green]' :
          role === 'opponent' ? 'text-[--color-accent-red]' :
          role === 'judge' ? 'text-[--color-accent-gold]' : 'text-zinc-500'
        }`}>
          {style.label}
        </span>
      )}
    </motion.div>
  );
}
