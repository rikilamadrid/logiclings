import { progressRoutes } from '../../src/server/container'

/**
 * POST /api/progress/complete — record a finished attempt and advance mastery.
 * Idempotent on `clientAttemptId`.
 */
export default function handler(request: Request): Promise<Response> {
  return progressRoutes.complete(request)
}
