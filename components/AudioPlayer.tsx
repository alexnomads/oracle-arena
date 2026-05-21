'use client';

import { useState, useRef, useEffect } from 'react';
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

  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-400">
          🔊 Audio ({currentTrack + 1}/{texts.length})
        </span>
        <span className="text-xs text-zinc-600">{texts[currentTrack]?.agent}</span>
      </div>

      {/* Waveform placeholder */}
      <div className="h-8 flex items-center gap-0.5">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all ${
              isPlaying ? 'bg-accent-blue animate-pulse' : 'bg-zinc-700'
            }`}
            style={{
              height: isPlaying ? `${Math.random() * 100}%` : '20%',
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentTrack === 0 || isLoading}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 transition-colors"
        >
          ⏮
        </button>
        <button
          onClick={handlePlayPause}
          disabled={isLoading}
          className="p-3 rounded-lg bg-accent-blue hover:bg-blue-600 disabled:opacity-30 transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={handleNext}
          disabled={currentTrack >= texts.length - 1 || isLoading}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 transition-colors"
        >
          ⏭
        </button>
      </div>

      {isLoading && <p className="text-xs text-center text-zinc-500">Generating audio...</p>}
    </div>
  );
}
