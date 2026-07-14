import type { LevelMode } from '../../../learning/schemas/level'
import type { CacheScenario } from './cache'

export interface CacheRoundContent {
  prompt: string
  scenario: CacheScenario
  allowInvalidationChoice: boolean
}

export interface CacheLevelContent {
  mode: LevelMode
  predicting: CacheRoundContent
  transfer: CacheRoundContent
  explanation: string
}
