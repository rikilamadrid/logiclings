import { createAuthClient } from 'better-auth/react'

/**
 * Browser-side Better Auth client. Talks to the catch-all function mounted at
 * `/api/auth/*`, so it needs no base URL beyond the current origin.
 */
export const authClient = createAuthClient()

export const { signIn, signUp, signOut, useSession } = authClient

export type AuthSession = typeof authClient.$Infer.Session
