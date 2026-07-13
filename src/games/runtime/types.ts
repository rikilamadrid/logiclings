import type { ComponentType } from 'react'
import type { LevelDefinition } from '../../learning/schemas/level'

/**
 * The Hook → Predict → Simulate → React → Explain → Transfer rhythm, bracketed
 * by an idle intro stage and a terminal complete stage.
 */
export type RuntimeStage =
  | 'idle'
  | 'predicting'
  | 'simulating'
  | 'reacting'
  | 'explaining'
  | 'transfer'
  | 'complete'

export type RendererKind = 'dom' | 'svg' | 'canvas'

export interface RoundOutcome {
  kind: 'predicting' | 'transfer'
  predicted: boolean
  actual: boolean
  correct: boolean
}

export interface AccessibilityModeState {
  reducedMotion: boolean
  soundEnabled: boolean
}

export interface ScoreResult {
  score: number
  correctCount: number
  totalRounds: number
}

export interface GameResult extends ScoreResult {
  lessonSlug: string
  levelMode: LevelDefinition['mode']
  outcome: 'completed' | 'abandoned'
  attemptCount: number
  durationMs: number
  completedAt: string
  mistakeCodes: string[]
}

export interface RuntimeState {
  stage: RuntimeStage
  level: LevelDefinition
  paused: boolean
  attemptCount: number
  rounds: RoundOutcome[]
  lastRound: RoundOutcome | null
  accessibilityMode: AccessibilityModeState
  startedAt: number | null
  result: GameResult | null
}

export type RuntimeAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESTART' }
  | { type: 'SUBMIT_PREDICTION'; predicted: boolean; actual: boolean }
  | { type: 'ADVANCE' }
  | { type: 'SUBMIT_TRANSFER'; predicted: boolean; actual: boolean }
  | { type: 'SET_REDUCED_MOTION'; reducedMotion: boolean }
  | { type: 'SET_SOUND_ENABLED'; soundEnabled: boolean }

export interface GameComponentProps {
  stage: RuntimeStage
  level: LevelDefinition
  lastRound: RoundOutcome | null
  accessibilityMode: AccessibilityModeState
  onSubmitPrediction: (predicted: boolean, actual: boolean) => void
  onAdvance: () => void
  onSubmitTransfer: (predicted: boolean, actual: boolean) => void
}

export interface GameDefinition {
  gameSlug: string
  mount: RendererKind
  Component: ComponentType<GameComponentProps>
}
