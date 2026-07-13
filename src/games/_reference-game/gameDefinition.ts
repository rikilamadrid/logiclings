import type { GameDefinition } from '../runtime/types'
import { ReferenceGame } from './ReferenceGame'

export const referenceGameDefinition: GameDefinition = {
  gameSlug: 'runtime-fixture',
  mount: 'dom',
  Component: ReferenceGame,
}
