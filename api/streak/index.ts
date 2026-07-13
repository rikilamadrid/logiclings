import { streakRoutes } from '../../src/server/container'

/** GET /api/streak — the signed-in learner's current streak. */
export default function handler(request: Request): Promise<Response> {
  return streakRoutes.get(request)
}
