import { auth } from '../auth/betterAuth'

/**
 * Resolves the signed-in user from the request's session cookie.
 *
 * This is the single source of user identity for the API. Handlers must take
 * the owner of any read or write from here and never from the request body or
 * query string.
 */
export async function getSessionUserId(request: Request): Promise<string | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  return session?.user.id ?? null
}
