import type {
  AchievementRepository,
  EarnedAchievement,
} from '../db/achievementRepository'

/**
 * In-memory `AchievementRepository` for tests — earned achievements keyed by
 * `userId`, so service and route tests can exercise award idempotency
 * without a database.
 */

export function createInMemoryAchievementRepository(): AchievementRepository {
  const earnedByUserId = new Map<string, EarnedAchievement[]>()

  return {
    async listEarned(userId) {
      return earnedByUserId.get(userId) ?? []
    },

    async award(userId, definition) {
      const earned = earnedByUserId.get(userId) ?? []
      const existing = earned.find((entry) => entry.achievement.slug === definition.slug)
      if (existing) {
        return { earnedAt: existing.earnedAt, awarded: false }
      }

      const earnedAt = new Date().toISOString()
      earnedByUserId.set(userId, [...earned, { achievement: definition, earnedAt }])
      return { earnedAt, awarded: true }
    },
  }
}
