import { z } from 'zod'

/**
 * Server-side environment contract. Validated once at module load so a
 * misconfigured deployment fails loudly at boot instead of at the first
 * request that happens to need a variable.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(16, 'BETTER_AUTH_SECRET must be at least 16 characters'),
  BETTER_AUTH_URL: z.url('BETTER_AUTH_URL must be a valid URL'),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

function loadServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env)

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(`Invalid server environment:\n${issues}`)
  }

  return parsed.data
}

export const serverEnv = loadServerEnv()
