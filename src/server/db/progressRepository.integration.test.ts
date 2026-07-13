import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/**
 * Integration tests for the real Prisma repository, against a real PostgreSQL.
 *
 * These exist because the in-memory fake cannot model Postgres semantics. It
 * detects a duplicate attempt with a `Set` lookup, so it happily returned
 * `attemptRecorded: false` while the real repository was raising a 500: a failed
 * INSERT aborts the surrounding transaction, and the follow-up read that answers
 * the replay then dies with 25P02. Unit tests were green; the API was broken.
 *
 * Anything relying on database behavior — constraints, transactions, conflict
 * handling — has to be proved here.
 *
 * Run with a migrated database:
 *
 *   INTEGRATION_DB=1 npm run test
 *
 * Skipped by default so the normal suite needs no database.
 */

const enabled = Boolean(process.env.INTEGRATION_DB && process.env.DATABASE_URL)

describe.skipIf(!enabled)('progressRepository (real Postgres)', () => {
  let prisma: typeof import('./client').prisma
  let progressRepository: typeof import('./progressRepository').progressRepository

  const userId = `itest-user-${Date.now()}`
  const lessonId = 'itest-lesson'

  const baseInput = {
    userId,
    lessonId,
    levelId: 'itest-level',
    lessonVersion: 1,
    outcome: 'completed' as const,
    score: 100,
    mistakeCodes: [],
    hintCount: 0,
    durationMs: 1000,
    startedAt: new Date('2026-07-13T10:00:00.000Z'),
    completedAt: new Date('2026-07-13T10:00:41.000Z'),
  }

  /** Advance to `applied` on a pass; used as the repository's reducer. */
  const applyPass = (current: { attempts: number } | null) => ({
    masteryState: 'applied' as const,
    bestScore: 100,
    attempts: (current?.attempts ?? 0) + 1,
    completedAt: baseInput.completedAt,
    lastPlayedAt: baseInput.completedAt,
    lessonVersion: 1,
  })

  beforeAll(async () => {
    ;({ prisma } = await import('./client'))
    ;({ progressRepository } = await import('./progressRepository'))

    // The repository writes rows that reference `user` by foreign key.
    await prisma.user.create({
      data: {
        id: userId,
        name: 'Integration Test',
        email: `${userId}@example.test`,
      },
    })
  })

  afterAll(async () => {
    if (!enabled) return
    // Attempts and progress cascade from the user.
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  it('records a first attempt', async () => {
    const result = await progressRepository.recordCompletion(
      { ...baseInput, clientAttemptId: 'itest-attempt-1' },
      applyPass,
    )

    expect(result.attemptRecorded).toBe(true)
    expect(result.progress.attempts).toBe(1)
    expect(result.progress.masteryState).toBe('applied')
  })

  it('answers a replay without aborting the transaction', async () => {
    // The regression: this used to throw 25P02 rather than report the replay.
    const result = await progressRepository.recordCompletion(
      { ...baseInput, clientAttemptId: 'itest-attempt-1' },
      applyPass,
    )

    expect(result.attemptRecorded).toBe(false)
    expect(result.progress.attempts).toBe(1)
  })

  it('does not double-count under concurrent duplicate writes', async () => {
    const write = () =>
      progressRepository.recordCompletion(
        { ...baseInput, clientAttemptId: 'itest-attempt-race' },
        applyPass,
      )

    const results = await Promise.all([write(), write(), write(), write()])

    // Exactly one of the racing writes may win.
    expect(results.filter((r) => r.attemptRecorded)).toHaveLength(1)

    const attempts = await prisma.attempt.count({
      where: { userId, clientAttemptId: 'itest-attempt-race' },
    })
    expect(attempts).toBe(1)
  })

  it('scopes progress reads to the owner', async () => {
    const progress = await progressRepository.listProgress(userId)
    expect(progress.map((row) => row.lessonId)).toEqual([lessonId])

    expect(await progressRepository.listProgress('itest-nobody')).toEqual([])
  })
})
