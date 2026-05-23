'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';

interface AudioPlayerProps {
  texts: Array<{ text: string; voiceId: string; agent: string }>;
  autoPlay?: boolean;
}

export default function AudioPlayer({ texts, autoPlay = false }: AudioPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const howlRef = useRef<Howl | null>(null);

  const loadTrack = async (index: number) => {
    if (index < 0 || index >= texts.length) return;

    setIsLoading(true);
    setCurrentTrack(index);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: texts[index].text,
          voiceId: texts[index].voiceId,
        }),
      });

      if (!res.ok) throw new Error('TTS failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      if (howlRef.current) {
        howlRef.current.unload();
      }

      howlRef.current = new Howl({
        src: [url],
        onload: () => {
          setIsLoading(false);
          if (autoPlay) {
            howlRef.current?.play();
            setIsPlaying(true);
          }
        },
        onend: () => {
          setIsPlaying(false);
          // Auto-advance to next track
          if (index < texts.length - 1) {
            loadTrack(index + 1);
          }
        },
      });

      // Handle play errors
      howlRef.current.on('loaderror', () => {
        setIsLoading(false);
        setIsPlaying(false);
      });
    } catch (err) {
      console.error('Audio load error:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (autoPlay && currentTrack === 0 && !isPlaying && !isLoading) {
      loadTrack(0);
    }
  }, [autoPlay]);

  const handlePlayPause = () => {
    if (!howlRef.current) return;
    if (isPlaying) {
      howlRef.current.pause();
      setIsPlaying(false);
    } else {
      howlRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentTrack < texts.length - 1) {
      loadTrack(currentTrack + 1);
    }
  };

  const handlePrev = () => {
    if (currentTrack > 0) {
      loadTrack(currentTrack - 1);
    }
  };

  if (!texts.length) return null;

  const agentColors: Record<string, string> = {
    'Proponent': 'text-[--color-accent-green]',
    'Opponent': 'text-[--color-accent-red]',
    'Judge': 'text-[--color-accent-gold]',
  };
  const currentAgentColor = agentColors[texts[currentTrack]?.agent || ''] || 'text-zinc-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[--color-surface] border border-[--color-border] rounded-xl p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">🔊</span>
          <div>
            <p className="text-sm font-bold text-zinc-300">
              Audio ({currentTrack + 1}/{texts.length})
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-xs font-medium ${currentAgentColor}`}
            >
              {texts[currentTrack]?.agent}
            </motion.p>
          </div>
        </div>
        <span className="text-xs text-zinc-600">TTS via Venice</span>
      </div>

      {/* Waveform visualization */}
      <div className="h-12 flex items-center justify-center gap-0.5 px-2">
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.div
            key={i}
            className={`flex-1 rounded-full transition-all ${
              isPlaying ? 'bg-[--color-accent-blue]' : 'bg-zinc-700'
            }`}
            animate={{
              height: isPlaying ? `${Math.random() * 80 + 20}%` : '15%',
              opacity: isPlaying ? 1 : 0.7,
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.03,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrev}
          disabled={currentTrack === 0 || isLoading}
          className={`p-3 rounded-xl bg-[--color-surface] border border-[--color-border] transition-colors ${
            currentTrack === 0 || isLoading ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[--color-surface-hover]'
          }`}
        >
          <span className="text-lg">⏮</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          disabled={isLoading}
          className={`p-4 rounded-xl bg-[--color-accent-blue] text-white font-bold shadow-lg shadow-blue-900/20 transition-all ${
            isLoading ? 'opacity-60 cursor-wait' : 'hover:bg-blue-500'
          }`}
        >
          {isPlaying ? '⏸' : '▶'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={currentTrack >= texts.length - 1 || isLoading}
          className={`p-3 rounded-xl bg-[--color-surface] border border-[--color-border] transition-colors ${
            currentTrack >= texts.length - 1 || isLoading ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[--color-surface-hover]'
          }`}
        >
          <span className="text-lg">⏭</span>
        </motion.button>
      </div>

      {/* Status messages */}
      {isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-xs text-center text-zinc-500"
        >
          Generating audio...
        </motion.p>
      )}
      
      {!isLoading && isPlaying && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-[--color-accent-blue] font-medium"
        >
          Playing...
        </motion.span>
      )}
    </motion.div>
  );
}
