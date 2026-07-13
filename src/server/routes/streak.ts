import type { StreakResponse } from '../../lib/api/contracts'
import { internalError, jsonResponse, methodNotAllowed, unauthorized } from '../http/responses'
import type { StreakService } from '../services/streakService'

/**
 * Streak route handlers: verify session → call the domain service. No Prisma,
 * no business rules.
 *
 * Dependencies are injected rather than imported so the handlers can be
 * exercised without a database or a live auth provider — see streak.test.ts.
 */

export interface StreakRouteDeps {
  /** Resolves the signed-in user, or `null` when there is no valid session. */
  getUserId: (request: Request) => Promise<string | null>
  service: StreakService
}

export interface StreakRoutes {
  get(request: Request): Promise<Response>
}

export function createStreakRoutes({
  getUserId,
  service,
}: StreakRouteDeps): StreakRoutes {
  return {
    async get(request) {
      if (request.method !== 'GET') {
        return methodNotAllowed('GET')
      }

      const userId = await getUserId(request)
      if (!userId) {
        return unauthorized()
      }

      try {
        const streak = await service.getStreak(userId)
        const body: StreakResponse = { streak }
        return jsonResponse(body)
      } catch (error) {
        console.error('Failed to read streak', error)
        return internalError()
      }
    },
  }
}
