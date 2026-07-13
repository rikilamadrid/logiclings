import {
  apiErrorSchema,
  completeLessonResponseSchema,
  progressListResponseSchema,
  type ApiError,
  type CompleteLessonRequest,
  type CompleteLessonResponse,
  type ProgressRecord,
} from './contracts'

/** Typed fetch wrappers for the progress API. Responses are parsed, not trusted. */

type ApiErrorCode = ApiError['error']['code']

export class ApiRequestError extends Error {
  code: ApiErrorCode
  status: number

  constructor(code: ApiErrorCode, message: string, status: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.code = code
    this.status = status
  }
}

/** True when the request failed only because nobody is signed in. */
export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.code === 'unauthorized'
}

async function toApiError(response: Response): Promise<ApiRequestError> {
  let body: unknown
  try {
    body = await response.json()
  } catch {
    body = null
  }

  const parsed = apiErrorSchema.safeParse(body)
  if (parsed.success) {
    return new ApiRequestError(
      parsed.data.error.code,
      parsed.data.error.message,
      response.status,
    )
  }

  return new ApiRequestError(
    response.status === 401 ? 'unauthorized' : 'internal_error',
    'Something went wrong. Please try again.',
    response.status,
  )
}

export async function fetchProgress(): Promise<ProgressRecord[]> {
  const response = await fetch('/api/progress', {
    method: 'GET',
    headers: { accept: 'application/json' },
  })

  if (!response.ok) {
    throw await toApiError(response)
  }

  const body = progressListResponseSchema.parse(await response.json())
  return body.progress
}

export async function completeLesson(
  request: CompleteLessonRequest,
): Promise<CompleteLessonResponse> {
  const response = await fetch('/api/progress/complete', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw await toApiError(response)
  }

  return completeLessonResponseSchema.parse(await response.json())
}
