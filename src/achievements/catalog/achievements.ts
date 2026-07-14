import { achievementSchema, type Achievement } from '../schemas/achievement'

/**
 * The starter achievement set. Typed and version-controlled like the lesson
 * catalog — the achievement service upserts these into the `Achievement`
 * table by slug the first time each is evaluated, so this file stays the one
 * place their copy is edited.
 */
const rawAchievements: Achievement[] = [
  {
    slug: 'first-completion',
    title: 'First Steps',
    description: 'Complete your first lesson.',
    iconKey: 'first-completion',
  },
  {
    slug: 'three-day-streak',
    title: 'On a Roll',
    description: 'Keep a 3-day streak going.',
    iconKey: 'three-day-streak',
  },
  {
    slug: 'track-mastered',
    title: 'Track Master',
    description: 'Master every lesson in a track.',
    iconKey: 'track-mastered',
  },
]

export const achievementCatalog: Achievement[] = rawAchievements.map(
  (achievement) => achievementSchema.parse(achievement),
)
