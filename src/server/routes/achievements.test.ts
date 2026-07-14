import { beforeEach, describe, expect, it } from 'vitest'
import type { AchievementListResponse, ApiError } from '../../lib/api/contracts'
import { createAchievementService } from '../services/achievementService'
import { createInMemoryAchievementRepository } from '../testing/inMemoryAchievementRepository'
import { createAchievementRoutes, type AchievementRoutes } from './achievements'

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T
}

const USER = 'user-1'

function getRequest(): Request {
  return new Request('https://logiclings.test/api/achievements', { method: 'GET' })
}

describe('achievement routes', () => {
  let currentUserId: string | null
  let routes: AchievementRoutes

  beforeEach(() => {
    currentUserId = USER
    routes = createAchievementRoutes({
      getUserId: async () => currentUserId,
      service: createAchievementService(createInMemoryAchievementRepository()),
    })
  })

  it('rejects an achievements read with no session', async () => {
    currentUserId = null

    const response = await routes.list(getRequest())
    const body = await readJson<ApiError>(response)

    expect(response.status).toBe(401)
    expect(body.error.code).toBe('unauthorized')
  })

  it('returns an empty list for a learner with no achievements yet', async () => {
    const response = await routes.list(getRequest())
    const body = await readJson<AchievementListResponse>(response)

    expect(response.status).toBe(200)
    expect(body.achievements).toEqual([])
  })

  it('rejects the wrong method', async () => {
    const response = await routes.list(
      new Request('https://logiclings.test/api/achievements', { method: 'POST' }),
    )

    expect(response.status).toBe(405)
  })
})
