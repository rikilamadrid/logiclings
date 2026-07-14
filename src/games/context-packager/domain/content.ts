import type { LevelMode } from '../../../learning/schemas/level'
import type { PackagingScenario } from './packaging'

export interface PackagingRoundContent {
  prompt: string
  scenario: PackagingScenario
}

export interface PackagingLevelContent {
  mode: LevelMode
  predicting: PackagingRoundContent
  transfer: PackagingRoundContent
  explanation: string
}
