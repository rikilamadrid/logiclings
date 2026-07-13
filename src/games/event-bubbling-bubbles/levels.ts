import { levelDefinitionSchema, type LevelDefinition, type LevelMode } from '../../learning/schemas/level'
import type { EventBubblingLevelContent } from './domain/content'
import { discoverContent } from './levels/discover'
import { applyContent } from './levels/apply'
import { masterContent } from './levels/master'

const LESSON_ID = 'lesson-event-bubbling-bubbles'

const rawLevels: LevelDefinition[] = [
  {
    id: 'level-event-bubbling-bubbles-discover',
    lessonId: LESSON_ID,
    mode: 'discover',
    objective: 'Predict which nested layers react before a bubble pops.',
    mechanic:
      'Select every layer that reacts to the pop, then watch the click bubble outward.',
    winCondition:
      'The click bubbled from the tapped layer through every ancestor layer, and your selection was checked against the layers that actually reacted.',
    reflection:
      'A click never stays put — it fires on the exact element you tapped, then travels outward through every ancestor. That’s event bubbling.',
    contentVersion: 1,
  },
  {
    id: 'level-event-bubbling-bubbles-apply',
    lessonId: LESSON_ID,
    mode: 'apply',
    objective: 'Predict the reacting layers independently, with deeper nesting.',
    mechanic:
      'Select every layer that reacts to the pop, then watch the click bubble outward.',
    winCondition:
      'The click bubbled from the tapped layer through every ancestor layer, and your selection was checked against the layers that actually reacted.',
    reflection:
      'No matter how many layers separate the target from the root, bubbling still visits every one of them.',
    contentVersion: 1,
  },
  {
    id: 'level-event-bubbling-bubbles-master',
    lessonId: LESSON_ID,
    mode: 'master',
    objective:
      'Place a stop at a layer and predict how it changes which layers react.',
    mechanic:
      'Place a stop at one layer, then select every layer that still reacts to the pop.',
    winCondition:
      'The stop you placed let the click react at and inside that layer, but blocked it from reaching anything further outward.',
    reflection:
      'stopPropagation lets a layer react to an event while still keeping that event from reaching its ancestors — the layer itself is never silenced, only the trip onward.',
    contentVersion: 1,
  },
]

export const eventBubblingLevels: LevelDefinition[] = rawLevels.map((level) =>
  levelDefinitionSchema.parse(level),
)

const contentByMode: Record<LevelMode, EventBubblingLevelContent> = {
  discover: discoverContent,
  apply: applyContent,
  master: masterContent,
}

export function getEventBubblingLevel(mode: LevelMode): LevelDefinition {
  const level = eventBubblingLevels.find((candidate) => candidate.mode === mode)
  if (!level) {
    throw new Error(`No Event Bubbling Bubbles level for mode "${mode}"`)
  }
  return level
}

export function getEventBubblingContent(mode: LevelMode): EventBubblingLevelContent {
  return contentByMode[mode]
}
