import { z } from 'zod'
import { masteryStateSchema } from '../../learning/schemas/lesson'
import { levelModeSchema } from '../../learning/schemas/level'

/**
 * Wire contract for the progress API. Imported by both the Vercel Functions
 * (to validate input and shape output) and the browser client (to parse
 * responses), so the two can never drift apart.
 *
 * Must stay free of server-only imports — this module is bundled into the app.
 */

export const attemptOutcomeSchema = z.enum(['completed', 'failed', 'abandoned'])

export type AttemptOutcome = z.infer<typeof attemptOutcomeSchema>

/** A learner's progress on one lesson, as returned by the API. */
export const progressRecordSchema = z.object({
  lessonId: z.string().min(1),
  masteryState: masteryStateSchema,
  bestScore: z.number().int().nullable(),
  attempts: z.number().int().nonnegative(),
  completedAt: z.iso.datetime().nullable(),
  lastPlayedAt: z.iso.datetime().nullable(),
  lessonVersion: z.number().int().positive(),
})

export type ProgressRecord = z.infer<typeof progressRecordSchema>

export const progressListResponseSchema = z.object({
  progress: z.array(progressRecordSchema),
})

export type ProgressListResponse = z.infer<typeof progressListResponseSchema>

/** True when `value` is a timezone name the runtime's `Intl` recognizes. */
export function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat(undefined, { timeZone: value })
    return true
  } catch {
    return false
  }
}

/** IANA timezone name, e.g. `America/New_York`. */
export const timeZoneSchema = z
  .string()
  .min(1)
  .max(64)
  .refine(isValidTimeZone, { message: 'Must be a valid IANA timezone name.' })

/** A learner's streak, as returned by the API. */
export const streakRecordSchema = z.object({
  currentDays: z.number().int().nonnegative(),
  longestDays: z.number().int().nonnegative(),
  lastQualifiedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  timezone: z.string().min(1),
})

export type StreakRecord = z.infer<typeof streakRecordSchema>

export const streakResponseSchema = z.object({
  streak: streakRecordSchema,
})

export type StreakResponse = z.infer<typeof streakResponseSchema>

/**
 * Body of the completion mutation. `clientAttemptId` is the idempotency key:
 * the server records at most one attempt per (user, clientAttemptId).
 *
 * There is deliberately no `userId` here — the server takes the owner from the
 * session, so a caller cannot write progress for anyone but themselves.
 *
 * Scores and round counts are client-reported for the MVP; server-authoritative
 * scoring would need the level definitions on the server and is out of scope.
 *
 * `timezone` is the browser's current IANA timezone (captured fresh on every
 * completion rather than stored once at sign-up, so a traveling learner's
 * streak always qualifies against where they actually are).
 */
export const completeLessonRequestSchema = z.object({
  clientAttemptId: z.string().min(1).max(128),
  lessonId: z.string().min(1),
  levelId: z.string().min(1),
  levelMode: levelModeSchema,
  lessonVersion: z.number().int().positive(),
  outcome: attemptOutcomeSchema,
  score: z.number().int().nullable(),
  correctCount: z.number().int().nonnegative(),
  totalRounds: z.number().int().nonnegative(),
  mistakeCodes: z.array(z.string().max(64)).max(50),
  hintCount: z.number().int().nonnegative(),
  durationMs: z.number().int().nonnegative().nullable(),
  startedAt: z.iso.datetime(),
  completedAt: z.iso.datetime().nullable(),
  timezone: timeZoneSchema,
})

export type CompleteLessonRequest = z.infer<typeof completeLessonRequestSchema>

export const completeLessonResponseSchema = z.object({
  progress: progressRecordSchema,
  /**
   * False when this `clientAttemptId` had already been recorded — the caller
   * hit a replay and nothing was double-counted.
   */
  attemptRecorded: z.boolean(),
  streak: streakRecordSchema,
  /** True when this completion moved the streak forward to a new day. */
  streakQualified: z.boolean(),
})

export type CompleteLessonResponse = z.infer<typeof completeLessonResponseSchema>

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.enum([
      'unauthorized',
      'invalid_request',
      'not_found',
      'internal_error',
    ]),
    message: z.string(),
  }),
})

export type ApiError = z.infer<typeof apiErrorSchema>
