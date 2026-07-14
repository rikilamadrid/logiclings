import {
  apiErrorSchema,
  achievementListResponseSchema,
  type AchievementRecord,
} from './contracts'
import { ApiRequestError } from './progressClient'

/** Typed fetch wrapper for the achievements API. Responses are parsed, not trusted. */

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

export async function fetchAchievements(): Promise<AchievementRecord[]> {
  const response = await fetch('/api/achievements', {
    method: 'GET',
    headers: { accept: 'application/json' },
  })

  if (!response.ok) {
    throw await toApiError(response)
  }

  const body = achievementListResponseSchema.parse(await response.json())
  return body.achievements
}
