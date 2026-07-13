import { beforeEach, describe, expect, it } from 'vitest'
import type { ApiError, StreakResponse } from '../../lib/api/contracts'
import { createStreakService } from '../services/streakService'
import {
  createInMemoryStreakRepository,
  type InMemoryStreakRepository,
} from '../testing/inMemoryStreakRepository'
import { createStreakRoutes, type StreakRoutes } from './streak'

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T
}

const USER = 'user-1'

function getRequest(): Request {
  return new Request('https://logiclings.test/api/streak', { method: 'GET' })
}

describe('streak routes', () => {
  let repository: InMemoryStreakRepository
  let currentUserId: string | null
  let routes: StreakRoutes

  beforeEach(() => {
    repository = createInMemoryStreakRepository()
    currentUserId = USER
    routes = createStreakRoutes({
      getUserId: async () => currentUserId,
      service: createStreakService(repository),
    })
  })

  it('rejects a streak read with no session', async () => {
    currentUserId = null

    const response = await routes.get(getRequest())
    const body = await readJson<ApiError>(response)

    expect(response.status).toBe(401)
    expect(body.error.code).toBe('unauthorized')
  })

  it('returns a zeroed streak for a learner who has never qualified', async () => {
    const response = await routes.get(getRequest())
    const body = await readJson<StreakResponse>(response)

    expect(response.status).toBe(200)
    expect(body.streak).toEqual({
      currentDays: 0,
      longestDays: 0,
      lastQualifiedDate: null,
      timezone: 'UTC',
    })
  })

  it('returns the signed-in learner’s stored streak', async () => {
    repository.seed(USER, {
      currentDays: 3,
      longestDays: 5,
      lastQualifiedDate: '2026-07-13',
      timezone: 'America/New_York',
    })

    const response = await routes.get(getRequest())
    const body = await readJson<StreakResponse>(response)

    expect(body.streak.currentDays).toBe(3)
    expect(body.streak.longestDays).toBe(5)
  })

  it('rejects the wrong method', async () => {
    const response = await routes.get(
      new Request('https://logiclings.test/api/streak', { method: 'POST' }),
    )

    expect(response.status).toBe(405)
  })
})
