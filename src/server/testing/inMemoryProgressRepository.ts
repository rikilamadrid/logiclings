import type { ProgressRecord } from '../../lib/api/contracts'
import type {
  ProgressRepository,
  ProgressSnapshot,
  RecordCompletionInput,
} from '../db/progressRepository'

/**
 * In-memory `ProgressRepository` for tests.
 *
 * Mirrors the two guarantees the Postgres implementation gets from the schema:
 *   - progress is unique per (userId, lessonId)
 *   - an attempt is unique per (userId, clientAttemptId) — a replay is a no-op
 *
 * Keeping those rules here means the service and route tests exercise real
 * idempotency and ownership behavior without a database.
 */

export type RecordedAttempt = RecordCompletionInput

export interface InMemoryProgressRepository extends ProgressRepository {
  attempts: RecordedAttempt[]
  seed(userId: string, lessonId: string, snapshot: ProgressSnapshot): void
}

function progressKey(userId: string, lessonId: string): string {
  return `${userId}::${lessonId}`
}

function attemptKey(userId: string, clientAttemptId: string): string {
  return `${userId}::${clientAttemptId}`
}

function toRecord(lessonId: string, snapshot: ProgressSnapshot): ProgressRecord {
  return {
    lessonId,
    masteryState: snapshot.masteryState,
    bestScore: snapshot.bestScore,
    attempts: snapshot.attempts,
    completedAt: snapshot.completedAt?.toISOString() ?? null,
    lastPlayedAt: snapshot.lastPlayedAt?.toISOString() ?? null,
    lessonVersion: snapshot.lessonVersion,
  }
}

export function createInMemoryProgressRepository(): InMemoryProgressRepository {
  const progress = new Map<string, { lessonId: string; snapshot: ProgressSnapshot }>()
  const seenAttempts = new Set<string>()
  const attempts: RecordedAttempt[] = []

  return {
    attempts,

    seed(userId, lessonId, snapshot) {
      progress.set(progressKey(userId, lessonId), { lessonId, snapshot })
    },

    async listProgress(userId) {
      return [...progress.entries()]
        .filter(([key]) => key.startsWith(`${userId}::`))
        .map(([, value]) => toRecord(value.lessonId, value.snapshot))
        .sort((a, b) => a.lessonId.localeCompare(b.lessonId))
    },

    async recordCompletion(input, reduceProgress) {
      const key = attemptKey(input.userId, input.clientAttemptId)
      const existing = progress.get(progressKey(input.userId, input.lessonId))

      if (seenAttempts.has(key)) {
        // Replay: nothing changes.
        return {
          progress: existing
            ? toRecord(existing.lessonId, existing.snapshot)
            : toRecord(input.lessonId, {
                masteryState: 'not_started',
                bestScore: null,
                attempts: 0,
                completedAt: null,
                lastPlayedAt: null,
                lessonVersion: input.lessonVersion,
              }),
          attemptRecorded: false,
        }
      }

      seenAttempts.add(key)
      attempts.push(input)

      const next = reduceProgress(existing?.snapshot ?? null)
      progress.set(progressKey(input.userId, input.lessonId), {
        lessonId: input.lessonId,
        snapshot: next,
      })

      return { progress: toRecord(input.lessonId, next), attemptRecorded: true }
    },
  }
}
