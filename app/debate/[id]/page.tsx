'use client';

import { useState, useEffect, useRef } from 'react';
import { params } from 'next/dist/compiled/@next/font/dist/google';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { DEMO_TOPICS } from '@/lib/agents';
import AgentAvatar from '@/components/AgentAvatar';
import DebateTranscript from '@/components/DebateTranscript';
import Scoreboard from '@/components/Scoreboard';
import AudioPlayer from '@/components/AudioPlayer';
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

  // Resolve dynamic params client-side
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

    // Try SSE stream first
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
          setPhase('debating');
          break;
        case 'round_start':
          setCurrentRound(data.data.round);
          setPhase('debating');
          break;
        case 'agent_speaking':
          setCurrentAgent(data.data.agent);
          break;
        case 'agent_said':
          setCurrentAgent(null);
          // Accumulate rounds - for simplicity, we'll fetch full transcript at end
          break;
        case 'round_end':
          setCurrentRound(data.data.round);
          break;
        case 'judge_starting':
        case 'judge_reasoning':
          setPhase('judging');
          break;
        case 'verdict':
          setVerdict(data.data);
          setPhase('complete');
          // Fetch full transcript
          fetchFullTranscript(topic, topicId);
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
      // Fallback: fetch non-streaming endpoint
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
    setPhase('debating');
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

  // Prepare TTS texts for Round 3
  useEffect(() => {
    if (!transcript || !transcript.rounds.length) return;
    const round3 = transcript.rounds[transcript.rounds.length - 1];
    if (!round3) return;
    setAudioTexts([
      { text: round3.proponentClaim, voiceId: 'eleven_multilingual_v2', agent: 'Proponent' },
      { text: round3.opponentClaim, voiceId: 'eleven_english_v1', agent: 'Opponent' },
    ]);
    if (transcript.verdict) {
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-accent-red">⚠️ {errorMessage}</p>
        <button
          onClick={() => {
            if (topic) startDebate(topic.question, resolvedParams.id);
          }}
          className="px-4 py-2 bg-accent-blue rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{topic?.question || 'Custom Debate'}</h1>
            <p className="text-xs text-zinc-500">Oracle Arena &middot; Live Debate</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={audioEnabled}
                onChange={(e) => setAudioEnabled(e.target.checked)}
                className="rounded"
              />
              Audio
            </label>
            <div className="flex items-center gap-2">
              <AgentAvatar role="proponent" size="sm" isActive={currentAgent === 'proponent'} />
              <AgentAvatar role="judge" size="sm" isActive={phase === 'judging'} />
              <AgentAvatar role="opponent" size="sm" isActive={currentAgent === 'opponent'} />
            </div>
          </div>
        </div>
      </header>

      {/* Phase indicator */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <PhaseIndicator phase={phase} currentRound={currentRound} />
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {phase === 'research' && <ResearchPhase />}
        {phase === 'debating' && transcript && <DebateTranscript rounds={transcript.rounds} />}
        {phase === 'judging' && <JudgingPhase />}
        {phase === 'complete' && (
          <div className="space-y-6">
            {transcript && <DebateTranscript rounds={transcript.rounds} />}
            <Scoreboard verdict={verdict} />
            {audioEnabled && audioTexts.length > 0 && (
              <AudioPlayer texts={audioTexts} autoPlay={false} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function PhaseIndicator({ phase, currentRound }: { phase: string; currentRound: number }) {
  const phases = ['Research', 'Round 1', 'Round 2', 'Round 3', 'Judge'];
  const phaseIndex = phase === 'research' ? 0 : phase === 'debating' ? Math.min(currentRound, 3) : phase === 'judging' ? 4 : 5;

  return (
    <div className="flex items-center gap-2">
      {phases.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all ${
            i < phaseIndex ? 'bg-accent-blue text-white' :
            i === phaseIndex ? 'bg-accent-gold text-black animate-pulse' :
            'bg-zinc-800 text-zinc-600'
          }`}>
            {i < phaseIndex ? '✓' : i + 1}
          </div>
          <span className={`text-xs ${i <= phaseIndex ? 'text-zinc-300' : 'text-zinc-600'}`}>{label}</span>
          {i < phases.length - 1 && <div className={`flex-1 h-px ${i < phaseIndex ? 'bg-accent-blue' : 'bg-zinc-800'}`} />}
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
      <div className="text-4xl animate-bounce">🔍</div>
      <h2 className="text-xl font-semibold text-zinc-300">Researching topic...</h2>
      <p className="text-sm text-zinc-500">Gathering data, news, and expert opinions</p>
      <div className="flex justify-center gap-1 mt-4">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
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
      <div className="text-4xl animate-pulse">⚖️</div>
      <h2 className="text-xl font-semibold text-zinc-300">Judge is evaluating...</h2>
      <p className="text-sm text-zinc-500">Analyzing arguments, evidence, and persuasion</p>
      <div className="flex justify-center gap-1 mt-4">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
