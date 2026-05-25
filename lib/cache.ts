import { DebateTranscript } from '@/types/debate';
import eth5k2026 from './seeded-debates/eth-5k-2026.json';
import aiJobs2027 from './seeded-debates/ai-jobs-2027.json';
import chinaTaiwan2026 from './seeded-debates/china-taiwan-2026.json';

/**
 * Simple in-memory cache for pre-run debates.
 * In production, swap for Supabase/Redis.
 */
class DebateCache {
  private cache = new Map<string, DebateTranscript>();

  get(topicId: string): DebateTranscript | undefined {
    return this.cache.get(topicId);
  }

  set(topicId: string, transcript: DebateTranscript): void {
    this.cache.set(topicId, transcript);
  }

  has(topicId: string): boolean {
    return this.cache.has(topicId);
  }

  clear(): void {
    this.cache.clear();
  }

  /**
   * Seed with pre-cached demo debates (zero API calls)
   */
  seedDemoDebates(): void {
    const seeded = [eth5k2026, aiJobs2027, chinaTaiwan2026] as DebateTranscript[];
    for (const debate of seeded) {
      this.cache.set(debate.topicId, debate);
    }
    console.log(`📦 Debate cache seeded with ${seeded.length} pre-cached debates`);
  }
}

// Singleton instance — auto-seeded at module load
export const debateCache = new DebateCache();
debateCache.seedDemoDebates();
