import type { GameDefinition } from '../runtime/types'
import { CacheTheCrowdGame } from './CacheTheCrowdGame'

export const cacheTheCrowdGameDefinition: GameDefinition = {
  gameSlug: 'cache-the-crowd',
  mount: 'dom',
  Component: CacheTheCrowdGame,
}
