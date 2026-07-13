import { useQuery } from '@tanstack/react-query'
import type { StreakRecord } from '../../lib/api/contracts'
import { fetchStreak } from '../../lib/api/streakClient'
import { isUnauthorizedError, type ApiRequestError } from '../../lib/api/progressClient'
import { useSession } from '../../lib/auth/authClient'

export const streakQueryKeys = {
  all: ['streak'] as const,
}

/**
 * The signed-in learner's current streak. Disabled when signed out — a
 * signed-out visitor has no server streak to read.
 */
export function useStreakQuery() {
  const { data: session, isPending: isSessionPending } = useSession()
  const isSignedIn = Boolean(session?.user)

  const query = useQuery<StreakRecord, ApiRequestError>({
    queryKey: streakQueryKeys.all,
    queryFn: fetchStreak,
    enabled: isSignedIn,
    // A 401 will not fix itself by trying again.
    retry: (failureCount, error) =>
      !isUnauthorizedError(error) && failureCount < 2,
  })

  return {
    ...query,
    isSignedIn,
    isLoading: isSessionPending || (isSignedIn && query.isLoading),
  }
}
