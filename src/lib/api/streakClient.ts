import {
  apiErrorSchema,
  streakResponseSchema,
  type StreakRecord,
} from './contracts'
import { ApiRequestError } from './progressClient'

/** Typed fetch wrapper for the streak API. Responses are parsed, not trusted. */

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

export async function fetchStreak(): Promise<StreakRecord> {
  const response = await fetch('/api/streak', {
    method: 'GET',
    headers: { accept: 'application/json' },
  })

  if (!response.ok) {
    throw await toApiError(response)
  }

  const body = streakResponseSchema.parse(await response.json())
  return body.streak
}
