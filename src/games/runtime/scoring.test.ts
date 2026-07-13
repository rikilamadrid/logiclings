import { describe, expect, it } from 'vitest'
import { calculateScore } from './scoring'
import type { RoundOutcome } from './types'

function round(correct: boolean): RoundOutcome {
  return { kind: 'predicting', predicted: true, actual: correct, correct }
}

describe('calculateScore', () => {
  it('returns a zero score with no rounds', () => {
    expect(calculateScore([])).toEqual({
      score: 0,
      correctCount: 0,
      totalRounds: 0,
    })
  })

  it('returns 100 when every round is correct', () => {
    expect(calculateScore([round(true), round(true)])).toEqual({
      score: 100,
      correctCount: 2,
      totalRounds: 2,
    })
  })

  it('rounds a partial score to the nearest integer', () => {
    expect(calculateScore([round(true), round(false), round(true)])).toEqual({
      score: 67,
      correctCount: 2,
      totalRounds: 3,
    })
  })
})
