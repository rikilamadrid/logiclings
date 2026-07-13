import { z } from 'zod'

export const trackSlugSchema = z.enum([
  'frontend',
  'backend',
  'apis',
  'databases',
  'algorithms',
  'system-design',
  'networking',
  'security',
  'devops',
  'ai-fundamentals',
  'agentic-coding',
])

export type TrackSlug = z.infer<typeof trackSlugSchema>

export const trackSchema = z.object({
  id: z.string(),
  slug: trackSlugSchema,
  title: z.string(),
  summary: z.string(),
  order: z.number().int().nonnegative(),
  iconKey: z.string(),
  accentToken: z.string(),
})

export type Track = z.infer<typeof trackSchema>
