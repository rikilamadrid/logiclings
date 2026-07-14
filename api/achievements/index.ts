import { achievementRoutes } from '../../src/server/container'

/** GET /api/achievements — the signed-in learner's earned achievements. */
export default function handler(request: Request): Promise<Response> {
  return achievementRoutes.list(request)
}
