import type { ApiError } from '../../lib/api/contracts'

/** Typed JSON responses shared by every route handler. */

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function errorResponse(
  code: ApiError['error']['code'],
  message: string,
  status: number,
): Response {
  const body: ApiError = { error: { code, message } }
  return jsonResponse(body, status)
}

export function unauthorized(message = 'You must be signed in.'): Response {
  return errorResponse('unauthorized', message, 401)
}

export function invalidRequest(message: string): Response {
  return errorResponse('invalid_request', message, 400)
}

export function notFound(message = 'Not found.'): Response {
  return errorResponse('not_found', message, 404)
}

export function methodNotAllowed(allowed: string): Response {
  const body: ApiError = {
    error: { code: 'invalid_request', message: `Expected ${allowed}.` },
  }
  return new Response(JSON.stringify(body), {
    status: 405,
    headers: { 'content-type': 'application/json', allow: allowed },
  })
}

export function internalError(): Response {
  return errorResponse('internal_error', 'Something went wrong.', 500)
}
