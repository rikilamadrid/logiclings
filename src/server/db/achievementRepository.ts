import type { AchievementSlug } from '../../achievements/schemas/achievement'
import { prisma } from './client'

/**
 * Data access for achievements. The only module that talks to Prisma for
 * achievements — the service depends on the `AchievementRepository`
 * interface, so it can be unit tested against an in-memory fake without a
 * database.
 */

export interface AchievementDefinition {
  slug: AchievementSlug
  title: string
  description: string
  iconKey: string
}

export interface EarnedAchievement {
  achievement: AchievementDefinition
  earnedAt: string
}

export interface AwardResult {
  earnedAt: string
  /** False when the learner had already earned this achievement. */
  awarded: boolean
}

export interface AchievementRepository {
  listEarned(userId: string): Promise<EarnedAchievement[]>
  /**
   * Ensures `definition` exists (upserted by slug), then records it as earned
   * by `userId`. Idempotent on (userId, achievementId) — awarding an
   * already-earned achievement again changes nothing.
   */
  award(userId: string, definition: AchievementDefinition): Promise<AwardResult>
}

export const achievementRepository: AchievementRepository = {
  async listEarned(userId) {
    const rows = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: 'asc' },
    })

    return rows.map((row) => ({
      achievement: {
        slug: row.achievement.slug as AchievementSlug,
        title: row.achievement.title,
        description: row.achievement.description,
        iconKey: row.achievement.iconKey,
      },
      earnedAt: row.earnedAt.toISOString(),
    }))
  },

  async award(userId, definition) {
    return prisma.$transaction(async (tx) => {
      const achievement = await tx.achievement.upsert({
        where: { slug: definition.slug },
        create: definition,
        update: {
          title: definition.title,
          description: definition.description,
          iconKey: definition.iconKey,
        },
      })

      // ON CONFLICT DO NOTHING via the unique (userId, achievementId) index —
      // a race that evaluates the same qualifying event twice still earns the
      // achievement only once.
      const inserted = await tx.userAchievement.createMany({
        data: [{ userId, achievementId: achievement.id }],
        skipDuplicates: true,
      })

      if (inserted.count === 0) {
        const existing = await tx.userAchievement.findUniqueOrThrow({
          where: { userId_achievementId: { userId, achievementId: achievement.id } },
        })
        return { earnedAt: existing.earnedAt.toISOString(), awarded: false }
      }

      const created = await tx.userAchievement.findUniqueOrThrow({
        where: { userId_achievementId: { userId, achievementId: achievement.id } },
      })
      return { earnedAt: created.earnedAt.toISOString(), awarded: true }
    })
  },
}
