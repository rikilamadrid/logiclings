import type { RoundOutcome, ScoreResult } from './types'

export function calculateScore(rounds: RoundOutcome[]): ScoreResult {
  const totalRounds = rounds.length
  const correctCount = rounds.filter((round) => round.correct).length
  const score =
    totalRounds === 0 ? 0 : Math.round((correctCount / totalRounds) * 100)

  return { score, correctCount, totalRounds }
}
