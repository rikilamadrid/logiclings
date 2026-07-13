import { z } from 'zod'

export const levelModeSchema = z.enum(['discover', 'apply', 'master'])

export type LevelMode = z.infer<typeof levelModeSchema>

export const levelDefinitionSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  mode: levelModeSchema,
  objective: z.string(),
  mechanic: z.string(),
  winCondition: z.string(),
  reflection: z.string(),
  contentVersion: z.number().int().positive(),
})

export type LevelDefinition = z.infer<typeof levelDefinitionSchema>
