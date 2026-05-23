'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DEMO_TOPICS } from '@/lib/agents';
import AgentAvatar from '@/components/AgentAvatar';
import DebateTranscript from '@/components/DebateTranscript';
import Scoreboard from '@/components/Scoreboard';
import AudioPlayer from '@/components/AudioPlayer';
import ReasoningFeed from '@/components/ReasoningFeed';
import BettingPanel from '@/components/BettingPanel';
import type { DebateTranscript as DebateTranscriptType, Verdict, SSEMessage } from '@/types/debate';

// Find topic by ID
function findTopic(id: string) {
  return DEMO_TOPICS.find(t => t.id === id);
}

export default function DebatePage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [transcript, setTranscript] = useState<DebateTranscriptType | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [phase, setPhase] = useState<'idle' | 'research' | 'debating' | 'judging' | 'complete' | 'error'>('idle');
  const [currentRound, setCurrentRound] = useState(0);
  const [currentAgent, setCurrentAgent] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioTexts, setAudioTexts] = useState<Array<{ text: string; voiceId: string; agent: string }>>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    params.then(p => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const topic = findTopic(resolvedParams.id);
    if (!topic) {
      setPhase('error');
      setErrorMessage('Topic not found');
      return;
    }

    startDebate(topic.question, resolvedParams.id);
  }, [resolvedParams]);

  const startDebate = async (topic: string, topicId: string) => {
    setPhase('research');
    eventSourceRef.current?.close();
    
    const es = new EventSource(`/api/debate/stream?topic=${encodeURIComponent(topic)}&topicId=${topicId}`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (data.type) {
        case 'research':
          setPhase('research');
          break;
        case 'research_complete':
        case 'round_start':
          setPhase('debating');
          setCurrentRound(data.data.round || currentRound + 1);
          break;
        case 'agent_speaking':
          setCurrentAgent(data.data.agent || currentAgent);
          break;
        case 'agent_said':
          setCurrentAgent(null);
          break;
        case 'round_end':
          setCurrentRound(data.data.round || currentRound + 1);
          break;
        case 'judge_starting':
        case 'judge_reasoning':
          setPhase('judging');
          break;
        case 'verdict':
          setVerdict(data.data);
          setPhase('complete');
          break;
        case 'cached':
          setTranscript(data.data);
          setVerdict(data.data.verdict || null);
          setPhase('complete');
          break;
        case 'error':
          setPhase('error');
          setErrorMessage(data.data?.error || 'Stream error');
          break;
      }
    };

    es.onerror = () => {
      es.close();
      fetchFallbackDebate(topic, topicId);
    };
  };

  const fetchFullTranscript = async (topic: string, topicId: string) => {
    try {
      const res = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, topicId }),
      });
      if (res.ok) {
        const json = await res.json();
        setTranscript(json.transcript);
      }
    } catch (err) {
      console.error('Failed to fetch transcript:', err);
    }
  };

  const fetchFallbackDebate = async (topic: string, topicId: string) => {
    try {
      const res = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, topicId }),
      });
      if (res.ok) {
        const json = await res.json();
        setTranscript(json.transcript);
        setVerdict(json.transcript.verdict || null);
        setPhase('complete');
      } else {
        const errorJson = await res.json();
        setPhase('error');
        setErrorMessage(errorJson.error || 'Debate failed');
      }
    } catch (err) {
      setPhase('error');
      setErrorMessage('Network error');
    }
  };

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!transcript || !transcript.rounds.length) return;
    const round3 = transcript.rounds[transcript.rounds.length - 1];
    if (!round3) return;
    setAudioTexts([
      { text: round3.proponentClaim, voiceId: 'eleven_multilingual_v2', agent: 'Proponent' },
      { text: round3.opponentClaim, voiceId: 'eleven_english_v1', agent: 'Opponent' },
    ]);
    if (transcript.verdict && transcript.verdict.reasoning) {
      setAudioTexts(prev => [...prev, {
        text: transcript.verdict!.reasoning,
        voiceId: 'eleven_multilingual_v2',
        agent: 'Judge',
      }]);
    }
  }, [transcript]);

  if (!resolvedParams) {
    return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  const topic = findTopic(resolvedParams.id);

  if (phase === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-xl text-[--color-accent-red] font-bold">⚠️ {errorMessage}</p>
        <button
          onClick={() => {
            if (topic) startDebate(topic.question, resolvedParams.id);
          }}
          className="px-6 py-3 bg-[--color-accent-blue] text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
        >
          Retry Debate
        </button>
      </div>
    );
  }

  return (
    <motion.main className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-[--color-border] bg-[--color-background]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Topic */}
          <div className="flex-1 min-w-0 mr-4">
            <h1 className="text-base font-bold text-zinc-200 truncate">{topic?.question || 'Custom Debate'}</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Oracle Arena</p>
          </div>

          {/* Right: Audio toggle + avatars */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={audioEnabled}
                onChange={(e) => setAudioEnabled(e.target.checked)}
                className="rounded border-[--color-border] bg-[--color-surface]"
              />
              <span className="flex items-center gap-1">🔊 Audio</span>
            </label>
            
            <div className="flex -space-x-2">
              <AgentAvatar role="proponent" size="sm" isActive={currentAgent === 'proponent' || currentAgent === null} />
              <AgentAvatar role="opponent" size="sm" isActive={currentAgent === 'opponent'} />
              <AgentAvatar role="judge" size="sm" isActive={phase === 'judging' || phase === 'complete'} />
            </div>

            <Link 
              href="/" 
              className="ml-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Phase Indicator */}
      <div className="max-w-6xl mx-auto px-4 py-3">
        <PhaseIndicator phase={phase} currentRound={currentRound} />
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 pb-20">
        <AnimatePresence mode="wait">
          {phase === 'research' && (
            <motion.div
              key="research"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full"
            >
              <ResearchPhase />
            </motion.div>
          )}

          {phase === 'debating' && transcript && (
            <motion.div
              key="debating"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <DebateTranscript rounds={transcript.rounds} />
            </motion.div>
          )}

          {phase === 'judging' && (
            <motion.div
              key="judging"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full"
            >
              <JudgingPhase />
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="border-b border-[--color-border] pb-4">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Debate Complete</h2>
                <p className="text-sm text-zinc-600">Here&apos;s the full transcript and verdict</p>
              </div>
              
              {transcript && <DebateTranscript rounds={transcript.rounds} />}
              <Scoreboard verdict={verdict} />
              {verdict && topic && (
                <BettingPanel
                  topicId={resolvedParams.id}
                  topic={topic.question}
                  verdict={verdict}
                />
              )}
              {audioEnabled && audioTexts.length > 0 && (
                <AudioPlayer texts={audioTexts} autoPlay={true} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}

// Phase indicator component
function PhaseIndicator({ phase, currentRound }: { phase: string; currentRound: number }) {
  const phases = ['Research', 'R1', 'R2', 'R3', 'Judge'];
  const maxPhases = 5;
  const currentIndex = 
    phase === 'research' ? 0 :
    phase === 'debating' ? Math.min(currentRound, 3) :
    phase === 'judging' ? 4 : -1;

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {phases.map((label, i) => (
        <div key={label} className={`flex items-center ${i > maxPhases ? 'hidden md:flex' : ''}`}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all border ${
            i < currentIndex 
              ? 'bg-[--color-accent-gold] text-black border-[--color-accent-gold]' 
              : i === currentIndex
                ? 'bg-zinc-800 text-[--color-accent-gold] border-[--color-accent-gold] animate-pulse'
                : 'bg-[--color-surface] text-zinc-600 border-[--color-border]'
          }`}>
            {i < currentIndex ? '✓' : i + 1}
          </div>
          <span className={`text-xs ml-1 ${i <= currentIndex ? 'text-zinc-300' : 'text-zinc-600'}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ResearchPhase() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20 space-y-4"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-5xl mb-4"
      >
        🔍
      </motion.div>
      <h2 className="text-xl font-bold text-zinc-300">Researching topic...</h2>
      <p className="text-sm text-zinc-500 max-w-md mx-auto">Gathering current data, news, and expert opinions to inform the debate</p>
      
      {/* Loading dots */}
      <div className="flex justify-center gap-2 mt-6">
        {[0, 1, 2, 3, 4].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[--color-accent-blue]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function JudgingPhase() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20 space-y-4"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-5xl mb-4"
      >
        ⚖️
      </motion.div>
      <h2 className="text-xl font-bold text-zinc-300">Judge is evaluating...</h2>
      <p className="text-sm text-zinc-500 max-w-md mx-auto">Analyzing arguments, evidence quality, and persuasive impact</p>
      
      {/* Loading bars */}
      <div className="flex justify-center gap-1 mt-6">
        {[0, 1, 2, 3, 4].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[--color-accent-gold]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
