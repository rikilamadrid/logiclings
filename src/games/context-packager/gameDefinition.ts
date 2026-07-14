import type { GameDefinition } from '../runtime/types'
import { ContextPackagerGame } from './ContextPackagerGame'

export const contextPackagerGameDefinition: GameDefinition = {
  gameSlug: 'context-packager',
  mount: 'dom',
  Component: ContextPackagerGame,
}
