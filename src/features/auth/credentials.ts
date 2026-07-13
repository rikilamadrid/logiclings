import { z } from 'zod'

/**
 * Client-side form validation. The server validates independently — this exists
 * to give the learner an immediate, specific message instead of a round trip.
 *
 * `MIN_PASSWORD_LENGTH` must stay in step with `emailAndPassword.minPasswordLength`
 * in `src/server/auth/betterAuth.ts`.
 */
export const MIN_PASSWORD_LENGTH = 8

export const signInSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

export type SignInValues = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  name: z.string().trim().min(1, 'Enter a display name.').max(60),
  email: z.email('Enter a valid email address.'),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
    ),
})

export type SignUpValues = z.infer<typeof signUpSchema>

/** Field-keyed messages, ready to hand to `TextField`'s `error` prop. */
export type FieldErrors<T> = Partial<Record<keyof T, string>>

export function toFieldErrors<T>(error: z.ZodError): FieldErrors<T> {
  const errors: FieldErrors<T> = {}

  for (const issue of error.issues) {
    const key = issue.path[0] as keyof T | undefined
    if (key && !errors[key]) {
      errors[key] = issue.message
    }
  }

  return errors
}
