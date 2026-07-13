import type { ReduceStreak, StreakRepository, StreakSnapshot } from '../db/streakRepository'

/**
 * In-memory `StreakRepository` for tests — a single row per user, keyed by
 * `userId`, so service and route tests can exercise real read-modify-write
 * behavior without a database.
 */

export interface InMemoryStreakRepository extends StreakRepository {
  seed(userId: string, snapshot: StreakSnapshot): void
}

export function createInMemoryStreakRepository(): InMemoryStreakRepository {
  const streaks = new Map<string, StreakSnapshot>()

  return {
    seed(userId, snapshot) {
      streaks.set(userId, snapshot)
    },

    async getStreak(userId) {
      return streaks.get(userId) ?? null
    },

    async qualify(userId, reduceStreak: ReduceStreak) {
      const current = streaks.get(userId) ?? null
      const { streak, justQualified } = reduceStreak(current)
      streaks.set(userId, streak)
      return { streak, justQualified }
    },
  }
}
