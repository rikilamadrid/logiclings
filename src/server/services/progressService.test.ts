import { beforeEach, describe, expect, it } from 'vitest'
import type { CompleteLessonRequest } from '../../lib/api/contracts'
import {
  createInMemoryProgressRepository,
  type InMemoryProgressRepository,
} from '../testing/inMemoryProgressRepository'
import { createProgressService, type ProgressService } from './progressService'

const USER = 'user-1'
const OTHER_USER = 'user-2'
const LESSON = 'lesson-event-bubbling'

const STARTED_AT = '2026-07-13T10:00:00.000Z'
const COMPLETED_AT = '2026-07-13T10:04:00.000Z'

function completionRequest(
  overrides: Partial<CompleteLessonRequest> = {},
): CompleteLessonRequest {
  return {
    clientAttemptId: 'attempt-1',
    lessonId: LESSON,
    levelId: 'level-discover',
    levelMode: 'discover',
    lessonVersion: 1,
    outcome: 'completed',
    score: 100,
    correctCount: 2,
    totalRounds: 2,
    mistakeCodes: [],
    hintCount: 0,
    durationMs: 240_000,
    startedAt: STARTED_AT,
    completedAt: COMPLETED_AT,
    ...overrides,
  }
}

describe('progressService', () => {
  let repository: InMemoryProgressRepository
  let service: ProgressService

  beforeEach(() => {
    repository = createInMemoryProgressRepository()
    service = createProgressService(repository)
  })

  it('creates progress on a first passing attempt', async () => {
    const { progress, attemptRecorded } = await service.completeLesson(
      USER,
      completionRequest(),
    )

    expect(attemptRecorded).toBe(true)
    expect(progress).toMatchObject({
      lessonId: LESSON,
      masteryState: 'discovering',
      bestScore: 100,
      attempts: 1,
      lessonVersion: 1,
    })
    expect(progress.lastPlayedAt).toBe(COMPLETED_AT)
  })

  it('does not mark a lesson completed until mastery reaches applied', async () => {
    const discovered = await service.completeLesson(USER, completionRequest())
    expect(discovered.progress.completedAt).toBeNull()

    const applied = await service.completeLesson(
      USER,
      completionRequest({
        clientAttemptId: 'attempt-2',
        levelId: 'level-apply',
        levelMode: 'apply',
      }),
    )

    expect(applied.progress.masteryState).toBe('applied')
    expect(applied.progress.completedAt).toBe(COMPLETED_AT)
  })

  it('keeps the original completion date across later attempts', async () => {
    await service.completeLesson(
      USER,
      completionRequest({ levelId: 'level-apply', levelMode: 'apply' }),
    )

    const later = '2026-07-20T09:00:00.000Z'
    const { progress } = await service.completeLesson(
      USER,
      completionRequest({
        clientAttemptId: 'attempt-2',
        levelId: 'level-master',
        levelMode: 'master',
        startedAt: later,
        completedAt: later,
      }),
    )

    expect(progress.masteryState).toBe('mastered')
    // Completion is stamped once — it marks when the lesson was first finished.
    expect(progress.completedAt).toBe(COMPLETED_AT)
    expect(progress.lastPlayedAt).toBe(later)
  })

  it('counts a failed attempt without advancing mastery', async () => {
    const { progress } = await service.completeLesson(
      USER,
      completionRequest({ correctCount: 1, totalRounds: 2, score: 50 }),
    )

    expect(progress.masteryState).toBe('not_started')
    expect(progress.attempts).toBe(1)
    expect(progress.bestScore).toBe(50)
    expect(progress.completedAt).toBeNull()
  })

  it('keeps the best score when a later attempt scores worse', async () => {
    await service.completeLesson(USER, completionRequest({ score: 100 }))

    const { progress } = await service.completeLesson(
      USER,
      completionRequest({
        clientAttemptId: 'attempt-2',
        score: 50,
        correctCount: 1,
        totalRounds: 2,
      }),
    )

    expect(progress.bestScore).toBe(100)
    expect(progress.attempts).toBe(2)
  })

  describe('idempotency', () => {
    it('ignores a replay of the same clientAttemptId', async () => {
      const request = completionRequest()

      const first = await service.completeLesson(USER, request)
      const replay = await service.completeLesson(USER, request)

      expect(first.attemptRecorded).toBe(true)
      expect(replay.attemptRecorded).toBe(false)

      // The retry must not double-count the attempt or re-run the mastery rules.
      expect(replay.progress.attempts).toBe(1)
      expect(replay.progress).toEqual(first.progress)
      expect(repository.attempts).toHaveLength(1)
    })

    it('records a genuinely new attempt with a different clientAttemptId', async () => {
      await service.completeLesson(USER, completionRequest())
      const second = await service.completeLesson(
        USER,
        completionRequest({ clientAttemptId: 'attempt-2' }),
      )

      expect(second.attemptRecorded).toBe(true)
      expect(second.progress.attempts).toBe(2)
      expect(repository.attempts).toHaveLength(2)
    })

    it('scopes the idempotency key per user', async () => {
      const request = completionRequest()

      await service.completeLesson(USER, request)
      const other = await service.completeLesson(OTHER_USER, request)

      // Same clientAttemptId, different learner — this is a real attempt.
      expect(other.attemptRecorded).toBe(true)
      expect(other.progress.attempts).toBe(1)
      expect(repository.attempts).toHaveLength(2)
    })
  })

  describe('ownership', () => {
    it('writes progress against the given user only', async () => {
      await service.completeLesson(USER, completionRequest())

      expect(await service.listProgress(USER)).toHaveLength(1)
      expect(await service.listProgress(OTHER_USER)).toEqual([])
    })

    it('never returns another learner’s progress', async () => {
      await service.completeLesson(USER, completionRequest())
      await service.completeLesson(
        OTHER_USER,
        completionRequest({
          clientAttemptId: 'attempt-other',
          lessonId: 'lesson-other',
        }),
      )

      const mine = await service.listProgress(USER)

      expect(mine).toHaveLength(1)
      expect(mine[0].lessonId).toBe(LESSON)
    })
  })
})
