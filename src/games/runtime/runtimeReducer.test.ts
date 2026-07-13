import { describe, expect, it } from 'vitest'
import { createInitialRuntimeState, createRuntimeReducer } from './runtimeReducer'
import type { LevelDefinition } from '../../learning/schemas/level'
import type { RuntimeState } from './types'

const level: LevelDefinition = {
  id: 'level-test',
  lessonId: 'lesson-test',
  mode: 'discover',
  objective: 'Objective',
  mechanic: 'Mechanic',
  winCondition: 'Win condition',
  reflection: 'Reflection',
  contentVersion: 1,
}

const accessibilityMode = { reducedMotion: false, soundEnabled: true }

function runFullAttempt(reducer: ReturnType<typeof createRuntimeReducer>) {
  let state = createInitialRuntimeState(level, accessibilityMode)
  state = reducer(state, { type: 'START' })
  state = reducer(state, { type: 'SUBMIT_PREDICTION', predicted: true, actual: true })
  state = reducer(state, { type: 'ADVANCE' }) // simulating -> reacting
  state = reducer(state, { type: 'ADVANCE' }) // reacting -> explaining
  state = reducer(state, { type: 'ADVANCE' }) // explaining -> transfer
  state = reducer(state, {
    type: 'SUBMIT_TRANSFER',
    predicted: false,
    actual: true,
  })
  return state
}

describe('runtimeReducer', () => {
  it('walks through the full Hook -> Predict -> Simulate -> React -> Explain -> Transfer rhythm', () => {
    const reducer = createRuntimeReducer('test-lesson')
    let state = createInitialRuntimeState(level, accessibilityMode)
    expect(state.stage).toBe('idle')

    state = reducer(state, { type: 'START' })
    expect(state.stage).toBe('predicting')
    expect(state.attemptCount).toBe(1)

    state = reducer(state, { type: 'SUBMIT_PREDICTION', predicted: true, actual: true })
    expect(state.stage).toBe('simulating')
    expect(state.lastRound).toEqual({
      kind: 'predicting',
      predicted: true,
      actual: true,
      correct: true,
    })

    state = reducer(state, { type: 'ADVANCE' })
    expect(state.stage).toBe('reacting')

    state = reducer(state, { type: 'ADVANCE' })
    expect(state.stage).toBe('explaining')

    state = reducer(state, { type: 'ADVANCE' })
    expect(state.stage).toBe('transfer')

    state = reducer(state, {
      type: 'SUBMIT_TRANSFER',
      predicted: false,
      actual: true,
    })
    expect(state.stage).toBe('complete')
    expect(state.result).not.toBeNull()
  })

  it('builds a result event with a computed score and mistake codes', () => {
    const reducer = createRuntimeReducer('test-lesson')
    const state = runFullAttempt(reducer)

    expect(state.result).toMatchObject({
      lessonSlug: 'test-lesson',
      levelMode: 'discover',
      outcome: 'completed',
      score: 50,
      correctCount: 1,
      totalRounds: 2,
      attemptCount: 1,
      mistakeCodes: ['transfer-mismatch'],
    })
  })

  it('ignores actions that do not apply to the current stage', () => {
    const reducer = createRuntimeReducer('test-lesson')
    const idleState = createInitialRuntimeState(level, accessibilityMode)

    const unchanged = reducer(idleState, {
      type: 'SUBMIT_PREDICTION',
      predicted: true,
      actual: true,
    })
    expect(unchanged).toBe(idleState)
  })

  it('pauses and resumes without losing stage', () => {
    const reducer = createRuntimeReducer('test-lesson')
    let state = createInitialRuntimeState(level, accessibilityMode)
    state = reducer(state, { type: 'START' })

    state = reducer(state, { type: 'PAUSE' })
    expect(state.paused).toBe(true)
    expect(state.stage).toBe('predicting')

    state = reducer(state, { type: 'RESUME' })
    expect(state.paused).toBe(false)
  })

  it('does not allow pausing before the lesson starts', () => {
    const reducer = createRuntimeReducer('test-lesson')
    const idleState = createInitialRuntimeState(level, accessibilityMode)

    const unchanged = reducer(idleState, { type: 'PAUSE' })
    expect(unchanged).toBe(idleState)
  })

  it('restarts back to a fresh idle state and resets attempts', () => {
    const reducer = createRuntimeReducer('test-lesson')
    const completedState = runFullAttempt(reducer)

    const restarted = reducer(completedState, { type: 'RESTART' })
    expect(restarted.stage).toBe('idle')
    expect(restarted.attemptCount).toBe(0)
    expect(restarted.rounds).toEqual([])
    expect(restarted.result).toBeNull()
  })

  it('tracks reduced-motion and sound-off accessibility state', () => {
    const reducer = createRuntimeReducer('test-lesson')
    let state: RuntimeState = createInitialRuntimeState(level, accessibilityMode)

    state = reducer(state, { type: 'SET_REDUCED_MOTION', reducedMotion: true })
    expect(state.accessibilityMode.reducedMotion).toBe(true)

    state = reducer(state, { type: 'SET_SOUND_ENABLED', soundEnabled: false })
    expect(state.accessibilityMode.soundEnabled).toBe(false)
  })
})
