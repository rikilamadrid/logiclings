import { progressRepository } from './db/progressRepository'
import { getSessionUserId } from './http/session'
import { createProgressRoutes } from './routes/progress'
import { createProgressService } from './services/progressService'

/**
 * Composition root: the one place that binds handlers to the real session
 * resolver and the Prisma-backed repository. Keeping the wiring here — rather
 * than as module-level singletons in the service — is what lets the domain and
 * route tests run with no database and no auth provider.
 */
export const progressService = createProgressService(progressRepository)

export const progressRoutes = createProgressRoutes({
  getUserId: getSessionUserId,
  service: progressService,
})
