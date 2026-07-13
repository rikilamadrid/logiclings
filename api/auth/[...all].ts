import { auth } from '../../src/server/auth/betterAuth'

/** Mounts every Better Auth endpoint under `/api/auth/*`. */
export default function handler(request: Request): Promise<Response> {
  return auth.handler(request)
}
