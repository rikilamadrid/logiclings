import { levelDefinitionSchema, type LevelDefinition, type LevelMode } from '../../learning/schemas/level'
import type { PackagingLevelContent } from './domain/content'
import { discoverContent } from './levels/discover'
import { applyContent } from './levels/apply'
import { masterContent } from './levels/master'

const LESSON_ID = 'lesson-context-packager'

const rawLevels: LevelDefinition[] = [
  {
    id: 'level-context-packager-discover',
    lessonId: LESSON_ID,
    mode: 'discover',
    objective: 'Predict which pieces of available information belong in an agent\'s context package.',
    mechanic:
      'Select which available items to include in the context package, within a visible budget, before the agent runs.',
    winCondition:
      'The package you packed was checked against exactly the file and spec the agent actually needed — no more, no less.',
    reflection:
      'An agent only reasons well over what is actually in its context window. Unrelated files and stale notes do not help it — they just take up room the essential file and spec could have used.',
    contentVersion: 1,
  },
  {
    id: 'level-context-packager-apply',
    lessonId: LESSON_ID,
    mode: 'apply',
    objective: 'Predict the right context package under a tighter budget with more distractors.',
    mechanic:
      'Select which available items to include in the context package, within a visible budget, before the agent runs.',
    winCondition:
      'The package you packed was checked against exactly the files and decision doc the agent actually needed.',
    reflection:
      'A tighter budget makes every distractor cost something real — packing one leaves less room for what the agent actually needed to do the task.',
    contentVersion: 1,
  },
  {
    id: 'level-context-packager-master',
    lessonId: LESSON_ID,
    mode: 'master',
    objective:
      'Choose between a large raw log dump and a small curated excerpt when both technically contain the answer.',
    mechanic:
      'Select which available items to include in the context package, within a visible budget, before the agent runs — including choosing between a costly raw dump and a cheap curated excerpt.',
    winCondition:
      'The package you packed included the handler file, a curated excerpt, and the relevant decision doc — not the full raw log.',
    reflection:
      'More raw context is not more signal. A large log dump can contain the answer and still be the wrong choice if its cost crowds out the file the agent actually needs to edit.',
    contentVersion: 1,
  },
]

export const contextPackagerLevels: LevelDefinition[] = rawLevels.map((level) =>
  levelDefinitionSchema.parse(level),
)

const contentByMode: Record<LevelMode, PackagingLevelContent> = {
  discover: discoverContent,
  apply: applyContent,
  master: masterContent,
}

export function getContextPackagerLevel(mode: LevelMode): LevelDefinition {
  const level = contextPackagerLevels.find((candidate) => candidate.mode === mode)
  if (!level) {
    throw new Error(`No Context Packager level for mode "${mode}"`)
  }
  return level
}

export function getContextPackagerContent(mode: LevelMode): PackagingLevelContent {
  return contentByMode[mode]
}
