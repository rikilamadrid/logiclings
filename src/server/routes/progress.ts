import { z } from 'zod'
import {
  completeLessonRequestSchema,
  type ProgressListResponse,
} from '../../lib/api/contracts'
import {
  internalError,
  invalidRequest,
  jsonResponse,
  methodNotAllowed,
  unauthorized,
} from '../http/responses'
import type { ProgressService } from '../services/progressService'

/**
 * Progress route handlers: verify session → validate with Zod → call the domain
 * service. No Prisma, no business rules.
 *
 * Dependencies are injected rather than imported so the handlers can be
 * exercised without a database or a live auth provider — see progress.test.ts.
 */

export interface ProgressRouteDeps {
  /** Resolves the signed-in user, or `null` when there is no valid session. */
  getUserId: (request: Request) => Promise<string | null>
  service: ProgressService
}

export interface ProgressRoutes {
  list(request: Request): Promise<Response>
  complete(request: Request): Promise<Response>
}

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
    .join('; ')
}

export function createProgressRoutes({
  getUserId,
  service,
}: ProgressRouteDeps): ProgressRoutes {
  return {
    async list(request) {
      if (request.method !== 'GET') {
        return methodNotAllowed('GET')
      }

      const userId = await getUserId(request)
      if (!userId) {
        return unauthorized()
      }

      try {
        const progress = await service.listProgress(userId)
        const body: ProgressListResponse = { progress }
        return jsonResponse(body)
      } catch (error) {
        console.error('Failed to list progress', error)
        return internalError()
      }
    },

    async complete(request) {
      if (request.method !== 'POST') {
        return methodNotAllowed('POST')
      }

      const userId = await getUserId(request)
      if (!userId) {
        return unauthorized()
      }

      let rawBody: unknown
      try {
        rawBody = await request.json()
      } catch {
        return invalidRequest('Body must be valid JSON.')
      }

      const parsed = completeLessonRequestSchema.safeParse(rawBody)
      if (!parsed.success) {
        return invalidRequest(formatIssues(parsed.error))
      }

      try {
        // The session's user id — not anything in the body — owns this write.
        const result = await service.completeLesson(userId, parsed.data)
        return jsonResponse(result)
      } catch (error) {
        console.error('Failed to record lesson completion', error)
        return internalError()
      }
    },
  }
}
