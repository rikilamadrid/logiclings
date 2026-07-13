import type {
  CompleteLessonRequest,
  CompleteLessonResponse,
  ProgressRecord,
} from '../../lib/api/contracts'
import type {
  ProgressRepository,
  ProgressSnapshot,
} from '../db/progressRepository'
import { isCompletedMastery, nextBestScore, nextMasteryState } from './mastery'

/**
 * Progress domain service.
 *
 * `userId` is always a separate argument sourced from the verified session —
 * never from the request body — so there is no code path that lets a caller
 * name someone else as the owner of a read or write.
 */

const NOT_STARTED: ProgressSnapshot = {
  masteryState: 'not_started',
  bestScore: null,
  attempts: 0,
  completedAt: null,
  lastPlayedAt: null,
  lessonVersion: 1,
}

export interface ProgressService {
  listProgress(userId: string): Promise<ProgressRecord[]>
  completeLesson(
    userId: string,
    request: CompleteLessonRequest,
  ): Promise<CompleteLessonResponse>
}

export function createProgressService(
  repository: ProgressRepository,
): ProgressService {
  return {
    listProgress(userId) {
      return repository.listProgress(userId)
    },

    completeLesson(userId, request) {
      const playedAt = request.completedAt
        ? new Date(request.completedAt)
        : new Date(request.startedAt)

      const applyAttempt = (
        current: ProgressSnapshot | null,
      ): ProgressSnapshot => {
        const base = current ?? NOT_STARTED

        const masteryState = nextMasteryState(
          base.masteryState,
          request.levelMode,
          {
            outcome: request.outcome,
            correctCount: request.correctCount,
            totalRounds: request.totalRounds,
          },
        )

        const justCompleted =
          isCompletedMastery(masteryState) && !isCompletedMastery(base.masteryState)

        return {
          masteryState,
          bestScore: nextBestScore(base.bestScore, request.score),
          attempts: base.attempts + 1,
          // First time the lesson counts as completed, stamp it; afterwards keep
          // the original completion date rather than moving it on every replay.
          completedAt: justCompleted ? playedAt : base.completedAt,
          lastPlayedAt: playedAt,
          lessonVersion: request.lessonVersion,
        }
      }

      return repository.recordCompletion(
        {
          userId,
          lessonId: request.lessonId,
          levelId: request.levelId,
          lessonVersion: request.lessonVersion,
          clientAttemptId: request.clientAttemptId,
          outcome: request.outcome,
          score: request.score,
          mistakeCodes: request.mistakeCodes,
          hintCount: request.hintCount,
          durationMs: request.durationMs,
          startedAt: new Date(request.startedAt),
          completedAt: request.completedAt
            ? new Date(request.completedAt)
            : null,
        },
        applyAttempt,
      )
    },
  }
}
