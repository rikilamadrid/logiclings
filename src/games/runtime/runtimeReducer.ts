import type { LevelDefinition } from '../../learning/schemas/level'
import { calculateScore } from './scoring'
import type {
  AccessibilityModeState,
  GameResult,
  RoundOutcome,
  RuntimeAction,
  RuntimeState,
} from './types'

export function createInitialRuntimeState(
  level: LevelDefinition,
  accessibilityMode: AccessibilityModeState,
): RuntimeState {
  return {
    stage: 'idle',
    level,
    paused: false,
    attemptCount: 0,
    rounds: [],
    lastRound: null,
    accessibilityMode,
    startedAt: null,
    result: null,
  }
}

function buildResult(
  state: RuntimeState,
  outcome: GameResult['outcome'],
  lessonSlug: string,
): GameResult {
  const { score, correctCount, totalRounds } = calculateScore(state.rounds)
  const mistakeCodes = state.rounds
    .filter((round) => !round.correct)
    .map((round) => `${round.kind}-mismatch`)

  return {
    lessonSlug,
    levelMode: state.level.mode,
    outcome,
    score,
    correctCount,
    totalRounds,
    attemptCount: state.attemptCount,
    durationMs: state.startedAt ? Date.now() - state.startedAt : 0,
    completedAt: new Date().toISOString(),
    mistakeCodes,
  }
}

export function createRuntimeReducer(lessonSlug: string) {
  return function runtimeReducer(
    state: RuntimeState,
    action: RuntimeAction,
  ): RuntimeState {
    switch (action.type) {
      case 'START':
        if (state.stage !== 'idle') return state
        return {
          ...state,
          stage: 'predicting',
          attemptCount: state.attemptCount + 1,
          startedAt: Date.now(),
        }

      case 'PAUSE':
        if (state.stage === 'idle' || state.stage === 'complete') return state
        return { ...state, paused: true }

      case 'RESUME':
        return { ...state, paused: false }

      case 'RESTART':
        return createInitialRuntimeState(state.level, state.accessibilityMode)

      case 'SUBMIT_PREDICTION': {
        if (state.stage !== 'predicting') return state
        const round: RoundOutcome = {
          kind: 'predicting',
          predicted: action.predicted,
          actual: action.actual,
          correct: action.predicted === action.actual,
        }
        return {
          ...state,
          stage: 'simulating',
          rounds: [...state.rounds, round],
          lastRound: round,
        }
      }

      case 'ADVANCE': {
        if (state.stage === 'simulating') {
          return { ...state, stage: 'reacting' }
        }
        if (state.stage === 'reacting') {
          return { ...state, stage: 'explaining' }
        }
        if (state.stage === 'explaining') {
          return { ...state, stage: 'transfer' }
        }
        return state
      }

      case 'SUBMIT_TRANSFER': {
        if (state.stage !== 'transfer') return state
        const round: RoundOutcome = {
          kind: 'transfer',
          predicted: action.predicted,
          actual: action.actual,
          correct: action.predicted === action.actual,
        }
        const nextState: RuntimeState = {
          ...state,
          stage: 'complete',
          rounds: [...state.rounds, round],
          lastRound: round,
        }
        return {
          ...nextState,
          result: buildResult(nextState, 'completed', lessonSlug),
        }
      }

      case 'SET_REDUCED_MOTION':
        return {
          ...state,
          accessibilityMode: {
            ...state.accessibilityMode,
            reducedMotion: action.reducedMotion,
          },
        }

      case 'SET_SOUND_ENABLED':
        return {
          ...state,
          accessibilityMode: {
            ...state.accessibilityMode,
            soundEnabled: action.soundEnabled,
          },
        }

      default:
        return state
    }
  }
}
