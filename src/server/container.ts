import { progressRepository } from './db/progressRepository'
import { streakRepository } from './db/streakRepository'
import { getSessionUserId } from './http/session'
import { createProgressRoutes } from './routes/progress'
import { createStreakRoutes } from './routes/streak'
import { createProgressService } from './services/progressService'
import { createStreakService } from './services/streakService'

/**
 * Composition root: the one place that binds handlers to the real session
 * resolver and the Prisma-backed repositories. Keeping the wiring here —
 * rather than as module-level singletons in the services — is what lets the
 * domain and route tests run with no database and no auth provider.
 */
export const streakService = createStreakService(streakRepository)

export const progressService = createProgressService(
  progressRepository,
  streakService,
)

export const progressRoutes = createProgressRoutes({
  getUserId: getSessionUserId,
  service: progressService,
})

export const streakRoutes = createStreakRoutes({
  getUserId: getSessionUserId,
  service: streakService,
})
