# 🏛️ Oracle Arena — AI Prediction Debates

> Three AI agents debate predictions. A judge scores them. You decide who's right.

Built for the **Venice AI × MetaMask Hackathon** — targeting **Best A2A Coordination** + **Best Agent** tracks.

## Demo

Pick a prediction topic → Watch 4 AI agents debate in real-time → See the judge's verdict with scores.

## Architecture

```
User picks topic
    ↓
Researcher Agent (web search) → gathers live data
    ↓
3 Debate Rounds:
  Proponent (zai-org-glm-5) ↔ Opponent (venice-uncensored-1-2)
    ↓
Judge (kimi-k2-5) → scores + final prediction
    ↓
TTS Audio (Round 3 + Verdict)
```

## Tech Stack

| Component | Tool |
|-----------|------|
| Frontend | Next.js 16 + React 19 + Tailwind CSS 4 |
| Animations | framer-motion |
| Audio | howler.js |
| AI Layer | Venice AI (multi-model: glm-5, qwen, kimi, uncensored) |
| Hosting | Vercel (free tier) |

## Quick Start

```bash
# Install
npm install

# Configure
cp .env.local.example .env.local  # Add your VENICE_API_KEY

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
oracle-arena/
├── app/
│   ├── page.tsx                    # Landing + topic picker
│   ├── debate/[id]/page.tsx        # Live debate view
│   └── api/
│       ├── debate/route.ts         # Debate orchestrator
│       ├── debate/stream/route.ts  # SSE streaming
│       └── tts/route.ts            # TTS generation
├── components/
│   ├── AgentAvatar.tsx             # Animated agent portraits
│   ├── ReasoningFeed.tsx           # Expandable thinking panel
│   ├── DebateTranscript.tsx        # Round-by-round display
│   ├── Scoreboard.tsx              # Live judge scores
│   └── AudioPlayer.tsx             # TTS playback
├── lib/
│   ├── venice.ts                   # Venice API client
│   ├── agents.ts                   # Agent configs + prompts
│   ├── schemas.ts                  # JSON response schemas
│   └── cache.ts                    # Demo cache
└── types/
    └── debate.ts                   # TypeScript interfaces
```

## Cost

~$0.034 per debate (with demo caching, ~$0.68/day for 100 sessions).

---

*Built for Venice AI Hackathon · Powered by Venice AI*
