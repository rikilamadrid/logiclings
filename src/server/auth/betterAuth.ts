import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '../db/client'
import { serverEnv } from '../env'

/**
 * Better Auth instance, mounted by the catch-all function at `api/auth/[...all].ts`.
 *
 * Email/password only for the MVP: magic links and social providers both need
 * delivery/provider infrastructure we have not provisioned yet. Email
 * verification is therefore off — turning it on without a mail transport would
 * lock every new account out.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh the session at most once a day
  },
})

export type Auth = typeof auth
