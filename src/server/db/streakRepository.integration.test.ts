import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/**
 * Integration tests for the real Prisma streak repository, against a real
 * PostgreSQL. See progressRepository.integration.test.ts for why this tier
 * exists: the in-memory fake cannot model transaction/upsert semantics.
 *
 * Run with a migrated database:
 *
 *   INTEGRATION_DB=1 npm run test
 *
 * Skipped by default so the normal suite needs no database.
 */

const enabled = Boolean(process.env.INTEGRATION_DB && process.env.DATABASE_URL)

describe.skipIf(!enabled)('streakRepository (real Postgres)', () => {
  let prisma: typeof import('./client').prisma
  let streakRepository: typeof import('./streakRepository').streakRepository

  const userId = `itest-streak-user-${Date.now()}`

  beforeAll(async () => {
    ;({ prisma } = await import('./client'))
    ;({ streakRepository } = await import('./streakRepository'))

    await prisma.user.create({
      data: {
        id: userId,
        name: 'Streak Integration Test',
        email: `${userId}@example.test`,
      },
    })
  })

  afterAll(async () => {
    if (!enabled) return
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  it('reads null for a learner with no streak row', async () => {
    expect(await streakRepository.getStreak('itest-streak-nobody')).toBeNull()
  })

  it('creates a streak row on the first qualifying event', async () => {
    const { streak, justQualified } = await streakRepository.qualify(
      userId,
      () => ({
        streak: {
          currentDays: 1,
          longestDays: 1,
          lastQualifiedDate: '2026-07-13',
          timezone: 'America/New_York',
        },
        justQualified: true,
      }),
    )

    expect(justQualified).toBe(true)
    expect(streak.currentDays).toBe(1)
    expect(await streakRepository.getStreak(userId)).toEqual(streak)
  })

  it('updates the existing row on a later qualifying event', async () => {
    const { streak } = await streakRepository.qualify(userId, (current) => ({
      streak: {
        currentDays: (current?.currentDays ?? 0) + 1,
        longestDays: (current?.longestDays ?? 0) + 1,
        lastQualifiedDate: '2026-07-14',
        timezone: 'America/New_York',
      },
      justQualified: true,
    }))

    expect(streak.currentDays).toBe(2)
    expect(streak.longestDays).toBe(2)
  })
})
