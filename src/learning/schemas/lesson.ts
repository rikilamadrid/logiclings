import { z } from 'zod'

export const masteryStateSchema = z.enum([
  'not_started',
  'discovering',
  'applied',
  'mastered',
])

export type MasteryState = z.infer<typeof masteryStateSchema>

export const lessonSchema = z.object({
  id: z.string(),
  trackId: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  learningObjective: z.string(),
  misconception: z.string(),
  estimatedMinutes: z.number().int().positive(),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  version: z.number().int().positive(),
  status: z.enum(['draft', 'published', 'retired']),
  prerequisiteLessonIds: z.array(z.string()),
})

export type Lesson = z.infer<typeof lessonSchema>
