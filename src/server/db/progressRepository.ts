import type { MasteryState } from '../../learning/schemas/lesson'
import type {
  AttemptOutcome,
  CompleteLessonResponse,
  ProgressRecord,
} from '../../lib/api/contracts'
import { prisma } from './client'

/**
 * Data access for progress. The only module that talks to Prisma — services
 * depend on the `ProgressRepository` interface, so they can be unit tested
 * against an in-memory fake without a database.
 */

/** Progress as the domain sees it, independent of Prisma's row types. */
export interface ProgressSnapshot {
  masteryState: MasteryState
  bestScore: number | null
  attempts: number
  completedAt: Date | null
  lastPlayedAt: Date | null
  lessonVersion: number
}

export interface RecordCompletionInput {
  userId: string
  lessonId: string
  levelId: string
  lessonVersion: number
  clientAttemptId: string
  outcome: AttemptOutcome
  score: number | null
  mistakeCodes: string[]
  hintCount: number
  durationMs: number | null
  startedAt: Date
  completedAt: Date | null
}

/**
 * Given the learner's current progress (or `null` if they have never played
 * this lesson), return what it should become. Supplied by the service so the
 * mastery rules stay in the domain layer while the read-modify-write stays
 * atomic here.
 */
export type ReduceProgress = (
  current: ProgressSnapshot | null,
) => ProgressSnapshot

export interface ProgressRepository {
  listProgress(userId: string): Promise<ProgressRecord[]>
  recordCompletion(
    input: RecordCompletionInput,
    reduceProgress: ReduceProgress,
  ): Promise<CompleteLessonResponse>
}

function toProgressRecord(row: {
  lessonId: string
  masteryState: MasteryState
  bestScore: number | null
  attempts: number
  completedAt: Date | null
  lastPlayedAt: Date | null
  lessonVersion: number
}): ProgressRecord {
  return {
    lessonId: row.lessonId,
    masteryState: row.masteryState,
    bestScore: row.bestScore,
    attempts: row.attempts,
    completedAt: row.completedAt?.toISOString() ?? null,
    lastPlayedAt: row.lastPlayedAt?.toISOString() ?? null,
    lessonVersion: row.lessonVersion,
  }
}

export const progressRepository: ProgressRepository = {
  async listProgress(userId) {
    const rows = await prisma.userProgress.findMany({
      where: { userId },
      orderBy: { lessonId: 'asc' },
    })

    return rows.map(toProgressRecord)
  },

  async recordCompletion(input, reduceProgress) {
    return prisma.$transaction(async (tx) => {
      // The unique index on (userId, clientAttemptId) — not a prior read — is
      // what makes this idempotent: a pre-check would still let two concurrent
      // replays both through.
      //
      // `skipDuplicates` issues ON CONFLICT DO NOTHING. A plain `create` would
      // raise the conflict as an error, and in Postgres a failed statement
      // aborts the whole transaction — every later query in it, including the
      // read we need to answer the replay, then fails with 25P02. Reporting the
      // conflict through the row count instead keeps the transaction usable.
      const inserted = await tx.attempt.createMany({
        data: [
          {
            userId: input.userId,
            lessonId: input.lessonId,
            levelId: input.levelId,
            clientAttemptId: input.clientAttemptId,
            outcome: input.outcome,
            score: input.score,
            mistakeCodes: input.mistakeCodes,
            hintCount: input.hintCount,
            durationMs: input.durationMs,
            startedAt: input.startedAt,
            completedAt: input.completedAt,
          },
        ],
        skipDuplicates: true,
      })

      if (inserted.count === 0) {
        // Replay of an attempt we already recorded: report current progress
        // and change nothing.
        const existing = await tx.userProgress.findUnique({
          where: {
            userId_lessonId: {
              userId: input.userId,
              lessonId: input.lessonId,
            },
          },
        })

        const progress = existing
          ? toProgressRecord(existing)
          : toProgressRecord({
              lessonId: input.lessonId,
              masteryState: 'not_started',
              bestScore: null,
              attempts: 0,
              completedAt: null,
              lastPlayedAt: null,
              lessonVersion: input.lessonVersion,
            })

        return { progress, attemptRecorded: false }
      }

      const current = await tx.userProgress.findUnique({
        where: {
          userId_lessonId: { userId: input.userId, lessonId: input.lessonId },
        },
      })

      const next = reduceProgress(
        current
          ? {
              masteryState: current.masteryState,
              bestScore: current.bestScore,
              attempts: current.attempts,
              completedAt: current.completedAt,
              lastPlayedAt: current.lastPlayedAt,
              lessonVersion: current.lessonVersion,
            }
          : null,
      )

      const saved = await tx.userProgress.upsert({
        where: {
          userId_lessonId: { userId: input.userId, lessonId: input.lessonId },
        },
        create: {
          userId: input.userId,
          lessonId: input.lessonId,
          masteryState: next.masteryState,
          bestScore: next.bestScore,
          attempts: next.attempts,
          completedAt: next.completedAt,
          lastPlayedAt: next.lastPlayedAt,
          lessonVersion: next.lessonVersion,
        },
        update: {
          masteryState: next.masteryState,
          bestScore: next.bestScore,
          attempts: next.attempts,
          completedAt: next.completedAt,
          lastPlayedAt: next.lastPlayedAt,
          lessonVersion: next.lessonVersion,
        },
      })

      return { progress: toProgressRecord(saved), attemptRecorded: true }
    })
  },
}
