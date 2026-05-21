import { DebateTranscript } from '@/types/debate';

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
   * Seed with pre-cached demo debates
   */
  seedDemoDebates(): void {
    // These would be pre-run debates seeded at startup
    // For now, the cache starts empty and fills as debates complete
    console.log('📦 Debate cache initialized (empty — fills on first run)');
  }
}

// Singleton instance
export const debateCache = new DebateCache();
