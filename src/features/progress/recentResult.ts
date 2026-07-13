import { z } from 'zod'
import { levelModeSchema } from '../../learning/schemas/level'
import type { GameResult } from '../../games/runtime/types'

/**
 * The most recent finished attempt, kept in `sessionStorage`.
 *
 * The result normally arrives as React Router location state, which does not
 * survive leaving the page. A signed-out learner who follows the "sign in to
 * save" prompt would otherwise come back to an empty result screen with the
 * attempt they just finished lost. Persisting it means they return to the same
 * result and it saves.
 *
 * Also makes the result screen survive a reload.
 */

const STORAGE_KEY = 'logiclings:recent-result'

const gameResultSchema = z.object({
  lessonSlug: z.string().min(1),
  levelMode: levelModeSchema,
  outcome: z.enum(['completed', 'abandoned']),
  score: z.number(),
  correctCount: z.number().int().nonnegative(),
  totalRounds: z.number().int().nonnegative(),
  attemptCount: z.number().int().nonnegative(),
  durationMs: z.number().int().nonnegative(),
  startedAt: z.iso.datetime(),
  completedAt: z.iso.datetime(),
  mistakeCodes: z.array(z.string()),
  clientAttemptId: z.string().min(1),
})

export function saveRecentResult(result: GameResult): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result))
  } catch {
    // Private mode or a full quota: saving progress still works for a signed-in
    // learner, they just lose reload-resilience. Not worth failing the screen.
  }
}

/** Returns the stored result only if it belongs to the lesson being viewed. */
export function loadRecentResult(lessonSlug: string): GameResult | null {
  let raw: string | null
  try {
    raw = sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }

  if (!raw) return null

  try {
    const parsed = gameResultSchema.safeParse(JSON.parse(raw))
    if (!parsed.success || parsed.data.lessonSlug !== lessonSlug) {
      return null
    }
    return parsed.data
  } catch {
    return null
  }
}

export function clearRecentResult(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to do — a stale entry is harmless, it is scoped by lesson slug.
  }
}
