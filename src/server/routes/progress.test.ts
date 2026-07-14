import { beforeEach, describe, expect, it } from 'vitest'
import type {
  ApiError,
  CompleteLessonRequest,
  CompleteLessonResponse,
  ProgressListResponse,
} from '../../lib/api/contracts'
import { createAchievementService } from '../services/achievementService'
import { createProgressService } from '../services/progressService'
import { createStreakService } from '../services/streakService'
import { createInMemoryAchievementRepository } from '../testing/inMemoryAchievementRepository'
import { createInMemoryProgressRepository } from '../testing/inMemoryProgressRepository'
import { createInMemoryStreakRepository } from '../testing/inMemoryStreakRepository'
import { createProgressRoutes, type ProgressRoutes } from './progress'

/** `Response.json()` is `unknown`; tests assert against the documented shape. */
async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T
}

const USER = 'user-1'
const OTHER_USER = 'user-2'
const LESSON = 'lesson-event-bubbling'

function completionBody(
  overrides: Partial<CompleteLessonRequest> = {},
): CompleteLessonRequest {
  return {
    clientAttemptId: 'attempt-1',
    lessonId: LESSON,
    levelId: 'level-apply',
    levelMode: 'apply',
    lessonVersion: 1,
    outcome: 'completed',
    score: 100,
    correctCount: 2,
    totalRounds: 2,
    mistakeCodes: [],
    hintCount: 0,
    durationMs: 1000,
    startedAt: '2026-07-13T10:00:00.000Z',
    completedAt: '2026-07-13T10:04:00.000Z',
    timezone: 'America/New_York',
    ...overrides,
  }
}

function postRequest(body: unknown): Request {
  return new Request('https://logiclings.test/api/progress/complete', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function getRequest(): Request {
  return new Request('https://logiclings.test/api/progress', { method: 'GET' })
}

describe('progress routes', () => {
  let repository: ReturnType<typeof createInMemoryProgressRepository>
  /** Who the session resolves to — `null` stands in for a signed-out caller. */
  let currentUserId: string | null
  let routes: ProgressRoutes

  beforeEach(() => {
    repository = createInMemoryProgressRepository()
    currentUserId = USER
    const streakService = createStreakService(createInMemoryStreakRepository())
    const achievementService = createAchievementService(
      createInMemoryAchievementRepository(),
    )
    routes = createProgressRoutes({
      getUserId: async () => currentUserId,
      service: createProgressService(repository, streakService, achievementService),
    })
  })

  describe('authentication', () => {
    it('rejects a progress read with no session', async () => {
      currentUserId = null

      const response = await routes.list(getRequest())
      const body = await readJson<ApiError>(response)

      expect(response.status).toBe(401)
      expect(body.error.code).toBe('unauthorized')
    })

    it('rejects a completion write with no session', async () => {
      currentUserId = null

      const response = await routes.complete(postRequest(completionBody()))

      expect(response.status).toBe(401)
      // Nothing may be written for an unauthenticated caller.
      expect(repository.attempts).toHaveLength(0)
    })
  })

  describe('session ownership', () => {
    it('returns only the signed-in learner’s progress', async () => {
      await routes.complete(postRequest(completionBody()))

      currentUserId = OTHER_USER
      const response = await routes.list(getRequest())
      const body = await readJson<ProgressListResponse>(response)

      expect(response.status).toBe(200)
      // user-2 must not see user-1's progress.
      expect(body.progress).toEqual([])
    })

    it('ignores a userId supplied in the request body', async () => {
      // A caller trying to write progress onto someone else's account.
      const response = await routes.complete(
        postRequest({ ...completionBody(), userId: OTHER_USER }),
      )

      expect(response.status).toBe(200)

      // The attempt is owned by the session user, not the body's claim.
      expect(repository.attempts).toHaveLength(1)
      expect(repository.attempts[0].userId).toBe(USER)

      expect(await repository.listProgress(OTHER_USER)).toEqual([])
      expect(await repository.listProgress(USER)).toHaveLength(1)
    })

    it('does not let one learner’s replay touch another learner’s progress', async () => {
      await routes.complete(postRequest(completionBody()))

      currentUserId = OTHER_USER
      // Same clientAttemptId, different session: a distinct attempt for user-2.
      const response = await routes.complete(postRequest(completionBody()))
      const body = await readJson<CompleteLessonResponse>(response)

      expect(body.attemptRecorded).toBe(true)
      expect(await repository.listProgress(USER)).toHaveLength(1)
      expect(await repository.listProgress(OTHER_USER)).toHaveLength(1)
    })
  })

  describe('idempotency', () => {
    it('does not double-count a duplicate clientAttemptId', async () => {
      const body = completionBody()

      const first = await readJson<CompleteLessonResponse>(
        await routes.complete(postRequest(body)),
      )
      const retry = await readJson<CompleteLessonResponse>(
        await routes.complete(postRequest(body)),
      )

      expect(first.attemptRecorded).toBe(true)
      expect(retry.attemptRecorded).toBe(false)
      expect(retry.progress.attempts).toBe(1)
      expect(repository.attempts).toHaveLength(1)
    })
  })

  describe('validation', () => {
    it('rejects a malformed body', async () => {
      const response = await routes.complete(
        postRequest({ ...completionBody(), correctCount: -1 }),
      )
      const body = await readJson<ApiError>(response)

      expect(response.status).toBe(400)
      expect(body.error.code).toBe('invalid_request')
      expect(repository.attempts).toHaveLength(0)
    })

    it('rejects a body that is not JSON', async () => {
      const request = new Request(
        'https://logiclings.test/api/progress/complete',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: 'not json',
        },
      )

      const response = await routes.complete(request)

      expect(response.status).toBe(400)
    })

    it('rejects the wrong method', async () => {
      const response = await routes.list(postRequest(completionBody()))

      expect(response.status).toBe(405)
    })
  })
})
