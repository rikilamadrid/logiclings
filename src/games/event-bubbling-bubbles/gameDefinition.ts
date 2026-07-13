import type { GameDefinition } from '../runtime/types'
import { EventBubblingGame } from './EventBubblingGame'

export const eventBubblingGameDefinition: GameDefinition = {
  gameSlug: 'event-bubbling-bubbles',
  mount: 'dom',
  Component: EventBubblingGame,
}
