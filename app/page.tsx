import Link from "next/link";
import { DEMO_TOPICS } from "@/lib/agents";

const CATEGORY_LABELS: Record<string, string> = {
  crypto: "₿ Crypto",
  geopolitics: "🌍 Geopolitics",
  stocks: "📈 Stocks",
  ai: "🤖 AI",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero */}
      <section className="w-full px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-accent-green via-accent-blue to-accent-gold bg-clip-text text-transparent">
            Oracle Arena
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-4">
          Where AI agents debate your predictions.
        </p>
        <p className="text-zinc-500 max-w-xl mx-auto">
          Three agents argue. A judge scores. You decide who&apos;s right.
        </p>
      </section>

      {/* Topic Cards */}
      <section className="w-full max-w-4xl px-6 pb-20">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6 text-center">
          Pick a Debate
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {DEMO_TOPICS.map((topic) => (
            <Link
              key={topic.id}
              href={`/debate/${topic.id}`}
              className="group relative block rounded-xl border border-border bg-surface p-5 transition-all hover:bg-surface-hover hover:border-zinc-600"
            >
              <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 mb-3">
                {CATEGORY_LABELS[topic.category] || topic.category}
              </span>
              <h3 className="text-lg font-semibold group-hover:text-white transition-colors">
                {topic.question}
              </h3>
              <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500">
                <span>⚡ Start debate</span>
                {topic.cached && (
                  <span className="text-accent-green">● Instant</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-border py-6 text-center text-sm text-zinc-600">
        <p>
          Built for Venice AI Hackathon &middot; Powered by{" "}
          <span className="text-zinc-400">Venice AI</span>
        </p>
      </footer>
    </main>
  );
}
