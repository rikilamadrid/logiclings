import { prisma } from './client'

/**
 * Data access for streaks. The only module that talks to Prisma for streaks —
 * the service depends on the `StreakRepository` interface, so it can be unit
 * tested against an in-memory fake without a database.
 */

/** A streak as the domain sees it, independent of Prisma's row type. */
export interface StreakSnapshot {
  currentDays: number
  longestDays: number
  lastQualifiedDate: string | null
  timezone: string
}

/**
 * Given the learner's current streak (or `null` if they have never had one),
 * return what it should become. Supplied by the service so the qualifying
 * rules stay in the domain layer while the read-modify-write stays atomic here.
 */
export type ReduceStreak = (current: StreakSnapshot | null) => {
  streak: StreakSnapshot
  justQualified: boolean
}

export interface StreakRepository {
  getStreak(userId: string): Promise<StreakSnapshot | null>
  qualify(
    userId: string,
    reduceStreak: ReduceStreak,
  ): Promise<{ streak: StreakSnapshot; justQualified: boolean }>
}

function toSnapshot(row: {
  currentDays: number
  longestDays: number
  lastQualifiedDate: string | null
  timezone: string
}): StreakSnapshot {
  return {
    currentDays: row.currentDays,
    longestDays: row.longestDays,
    lastQualifiedDate: row.lastQualifiedDate,
    timezone: row.timezone,
  }
}

export const streakRepository: StreakRepository = {
  async getStreak(userId) {
    const row = await prisma.streak.findUnique({ where: { userId } })
    return row ? toSnapshot(row) : null
  },

  async qualify(userId, reduceStreak) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.streak.findUnique({ where: { userId } })

      const { streak, justQualified } = reduceStreak(
        current ? toSnapshot(current) : null,
      )

      const saved = await tx.streak.upsert({
        where: { userId },
        create: {
          userId,
          currentDays: streak.currentDays,
          longestDays: streak.longestDays,
          lastQualifiedDate: streak.lastQualifiedDate,
          timezone: streak.timezone,
        },
        update: {
          currentDays: streak.currentDays,
          longestDays: streak.longestDays,
          lastQualifiedDate: streak.lastQualifiedDate,
          timezone: streak.timezone,
        },
      })

      return { streak: toSnapshot(saved), justQualified }
    })
  },
}
