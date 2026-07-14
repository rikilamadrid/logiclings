import type { AchievementListResponse } from '../../lib/api/contracts'
import { internalError, jsonResponse, methodNotAllowed, unauthorized } from '../http/responses'
import type { AchievementService } from '../services/achievementService'

/**
 * Achievement route handlers: verify session → call the domain service. No
 * Prisma, no business rules.
 *
 * Dependencies are injected rather than imported so the handlers can be
 * exercised without a database or a live auth provider — see
 * achievements.test.ts.
 */

export interface AchievementRouteDeps {
  /** Resolves the signed-in user, or `null` when there is no valid session. */
  getUserId: (request: Request) => Promise<string | null>
  service: AchievementService
}

export interface AchievementRoutes {
  list(request: Request): Promise<Response>
}

export function createAchievementRoutes({
  getUserId,
  service,
}: AchievementRouteDeps): AchievementRoutes {
  return {
    async list(request) {
      if (request.method !== 'GET') {
        return methodNotAllowed('GET')
      }

      const userId = await getUserId(request)
      if (!userId) {
        return unauthorized()
      }

      try {
        const achievements = await service.listEarned(userId)
        const body: AchievementListResponse = { achievements }
        return jsonResponse(body)
      } catch (error) {
        console.error('Failed to list achievements', error)
        return internalError()
      }
    },
  }
}
