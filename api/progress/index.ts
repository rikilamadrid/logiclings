import { progressRoutes } from '../../src/server/container'

/** GET /api/progress — the signed-in learner's progress across all lessons. */
export default function handler(request: Request): Promise<Response> {
  return progressRoutes.list(request)
}
