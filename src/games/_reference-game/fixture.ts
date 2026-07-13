/**
 * Runtime fixture — not a real track lesson. Proves the mini-game runtime
 * contract end-to-end (feature 04). Real games ship in features 05-07 and
 * are registered in the real catalog, not here.
 */
import { lessonSchema, type Lesson } from '../../learning/schemas/lesson'
import { levelDefinitionSchema, type LevelDefinition } from '../../learning/schemas/level'

export const referenceFixtureLesson: Lesson = lessonSchema.parse({
  id: 'lesson-runtime-fixture',
  trackId: 'track-runtime-fixture',
  slug: 'runtime-fixture',
  title: 'Runtime Fixture',
  summary: 'A minimal demo proving the mini-game runtime contract works end-to-end.',
  learningObjective: 'Predict a hidden signal before it reveals its real state.',
  misconception: 'N/A — this is a runtime fixture, not shippable lesson content.',
  estimatedMinutes: 1,
  difficulty: 1,
  version: 1,
  status: 'draft',
  prerequisiteLessonIds: [],
})

const rawLevels: LevelDefinition[] = [
  {
    id: 'level-runtime-fixture-discover',
    lessonId: referenceFixtureLesson.id,
    mode: 'discover',
    objective: 'Predict whether the signal will be on or off before it flips.',
    mechanic: 'Choose On or Off, then watch the signal reveal its real state.',
    winCondition:
      'The signal flipped, and your prediction was checked against its real state.',
    reflection:
      'Systems often hold hidden state that only becomes visible once you observe it — predicting first sharpens your mental model of what changed and why.',
    contentVersion: 1,
  },
  {
    id: 'level-runtime-fixture-apply',
    lessonId: referenceFixtureLesson.id,
    mode: 'apply',
    objective: 'Predict the signal with fewer hints than the discover round.',
    mechanic: 'Choose On or Off, then watch the signal reveal its real state.',
    winCondition:
      'The signal flipped, and your prediction was checked against its real state.',
    reflection:
      'Once the pattern is familiar, the same prediction skill applies with less guidance.',
    contentVersion: 1,
  },
  {
    id: 'level-runtime-fixture-master',
    lessonId: referenceFixtureLesson.id,
    mode: 'master',
    objective: 'Predict the signal across a transfer variation to prove mastery.',
    mechanic: 'Choose On or Off, then watch the signal reveal its real state.',
    winCondition:
      'The signal flipped, and your prediction was checked against its real state.',
    reflection:
      'Mastery means the mental model transfers to a new variation, not just a memorized answer.',
    contentVersion: 1,
  },
]

export const referenceFixtureLevels: LevelDefinition[] = rawLevels.map((level) =>
  levelDefinitionSchema.parse(level),
)

export function getReferenceFixtureLevel(
  mode: LevelDefinition['mode'],
): LevelDefinition {
  const level = referenceFixtureLevels.find((candidate) => candidate.mode === mode)
  if (!level) {
    throw new Error(`No runtime fixture level for mode "${mode}"`)
  }
  return level
}
