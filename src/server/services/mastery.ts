import type { MasteryState } from '../../learning/schemas/lesson'
import type { LevelDefinition } from '../../learning/schemas/level'

/**
 * Mastery progression rules. Pure and Prisma-free so the interesting decisions
 * (does this attempt count? does mastery advance?) are testable on their own.
 */

const masteryRank: Record<MasteryState, number> = {
  not_started: 0,
  discovering: 1,
  applied: 2,
  mastered: 3,
}

/** Mastery a learner earns by *passing* a level of the given mode. */
const masteryEarnedByMode: Record<LevelDefinition['mode'], MasteryState> = {
  discover: 'discovering',
  apply: 'applied',
  master: 'mastered',
}

export interface AttemptSummary {
  outcome: 'completed' | 'failed' | 'abandoned'
  correctCount: number
  totalRounds: number
}

/**
 * An attempt passes only when the learner finished it and got every round
 * right. A finished-but-imperfect run still counts as an attempt — it just
 * doesn't move mastery forward.
 */
export function isPassingAttempt(attempt: AttemptSummary): boolean {
  return (
    attempt.outcome === 'completed' &&
    attempt.totalRounds > 0 &&
    attempt.correctCount === attempt.totalRounds
  )
}

/**
 * Mastery never regresses: a failed attempt on `master` cannot demote a learner
 * who has already mastered the lesson, and passing `discover` after `apply`
 * leaves them at `applied`.
 */
export function nextMasteryState(
  current: MasteryState,
  levelMode: LevelDefinition['mode'],
  attempt: AttemptSummary,
): MasteryState {
  if (!isPassingAttempt(attempt)) {
    return current
  }

  const earned = masteryEarnedByMode[levelMode]
  return masteryRank[earned] > masteryRank[current] ? earned : current
}

/** Lessons count as "completed" in the catalog once mastery reaches `applied`. */
export function isCompletedMastery(mastery: MasteryState): boolean {
  return masteryRank[mastery] >= masteryRank.applied
}

/** `null` scores (an abandoned run) never beat a recorded best. */
export function nextBestScore(
  current: number | null,
  score: number | null,
): number | null {
  if (score === null) return current
  if (current === null) return score
  return Math.max(current, score)
}
