import { describe, expect, it } from 'vitest'
import {
  isCompletedMastery,
  isPassingAttempt,
  nextBestScore,
  nextMasteryState,
  type AttemptSummary,
} from './mastery'

const perfect: AttemptSummary = {
  outcome: 'completed',
  correctCount: 3,
  totalRounds: 3,
}

const imperfect: AttemptSummary = {
  outcome: 'completed',
  correctCount: 2,
  totalRounds: 3,
}

const abandoned: AttemptSummary = {
  outcome: 'abandoned',
  correctCount: 3,
  totalRounds: 3,
}

describe('isPassingAttempt', () => {
  it('passes only a completed run with every round correct', () => {
    expect(isPassingAttempt(perfect)).toBe(true)
    expect(isPassingAttempt(imperfect)).toBe(false)
    expect(isPassingAttempt(abandoned)).toBe(false)
  })

  it('does not treat a zero-round run as a pass', () => {
    expect(
      isPassingAttempt({ outcome: 'completed', correctCount: 0, totalRounds: 0 }),
    ).toBe(false)
  })
})

describe('nextMasteryState', () => {
  it('advances mastery to the level the learner passed', () => {
    expect(nextMasteryState('not_started', 'discover', perfect)).toBe(
      'discovering',
    )
    expect(nextMasteryState('discovering', 'apply', perfect)).toBe('applied')
    expect(nextMasteryState('applied', 'master', perfect)).toBe('mastered')
  })

  it('leaves mastery untouched when the attempt did not pass', () => {
    expect(nextMasteryState('discovering', 'apply', imperfect)).toBe(
      'discovering',
    )
    expect(nextMasteryState('applied', 'master', abandoned)).toBe('applied')
  })

  it('never regresses mastery', () => {
    // Replaying an easier level after mastering the lesson must not demote.
    expect(nextMasteryState('mastered', 'discover', perfect)).toBe('mastered')
    expect(nextMasteryState('applied', 'discover', perfect)).toBe('applied')
  })

  it('cannot be demoted by failing a level the learner already passed', () => {
    expect(nextMasteryState('mastered', 'master', imperfect)).toBe('mastered')
  })

  it('lets a learner skip straight to mastered by passing the master level', () => {
    expect(nextMasteryState('not_started', 'master', perfect)).toBe('mastered')
  })
})

describe('isCompletedMastery', () => {
  it('counts applied and mastered as completed, discovering as not', () => {
    expect(isCompletedMastery('not_started')).toBe(false)
    expect(isCompletedMastery('discovering')).toBe(false)
    expect(isCompletedMastery('applied')).toBe(true)
    expect(isCompletedMastery('mastered')).toBe(true)
  })
})

describe('nextBestScore', () => {
  it('keeps the higher score', () => {
    expect(nextBestScore(60, 90)).toBe(90)
    expect(nextBestScore(90, 60)).toBe(90)
  })

  it('records the first score', () => {
    expect(nextBestScore(null, 40)).toBe(40)
  })

  it('never lets a missing score erase a recorded best', () => {
    expect(nextBestScore(75, null)).toBe(75)
    expect(nextBestScore(null, null)).toBeNull()
  })
})
