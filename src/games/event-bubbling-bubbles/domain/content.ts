import type { LevelMode } from '../../../learning/schemas/level'
import type { BubblingScenario } from './bubbling'

export interface EventBubblingRoundContent {
  prompt: string
  scenario: BubblingScenario
  allowStopPlacement: boolean
}

export interface EventBubblingLevelContent {
  mode: LevelMode
  predicting: EventBubblingRoundContent
  transfer: EventBubblingRoundContent
  explanation: string
}
