import { useQuery } from '@tanstack/react-query'
import type { AchievementRecord } from '../../lib/api/contracts'
import { fetchAchievements } from '../../lib/api/achievementClient'
import { isUnauthorizedError, type ApiRequestError } from '../../lib/api/progressClient'
import { useSession } from '../../lib/auth/authClient'

export const achievementQueryKeys = {
  all: ['achievements'] as const,
}

/**
 * The signed-in learner's earned achievements. Disabled when signed out — a
 * signed-out visitor has no server achievements to read.
 */
export function useAchievementsQuery() {
  const { data: session, isPending: isSessionPending } = useSession()
  const isSignedIn = Boolean(session?.user)

  const query = useQuery<AchievementRecord[], ApiRequestError>({
    queryKey: achievementQueryKeys.all,
    queryFn: fetchAchievements,
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
