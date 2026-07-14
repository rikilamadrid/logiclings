import { z } from 'zod'

export const achievementSlugSchema = z.enum([
  'first-completion',
  'three-day-streak',
  'track-mastered',
])

export type AchievementSlug = z.infer<typeof achievementSlugSchema>

export const achievementSchema = z.object({
  slug: achievementSlugSchema,
  title: z.string(),
  description: z.string(),
  iconKey: z.string(),
})

export type Achievement = z.infer<typeof achievementSchema>
