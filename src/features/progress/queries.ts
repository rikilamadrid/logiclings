import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { MasteryState } from '../../learning/schemas/lesson'
import {
  completeLesson,
  fetchProgress,
  isUnauthorizedError,
  ApiRequestError,
} from '../../lib/api/progressClient'
import type {
  CompleteLessonRequest,
  ProgressRecord,
} from '../../lib/api/contracts'
import { useSession } from '../../lib/auth/authClient'
import { achievementQueryKeys } from '../achievements/queries'
import { streakQueryKeys } from '../streaks/queries'

export const progressQueryKeys = {
  all: ['progress'] as const,
}

/**
 * The signed-in learner's progress. Disabled when signed out — a signed-out
 * visitor has no server progress to read, and firing the request anyway would
 * just produce a guaranteed 401.
 */
export function useProgressQuery() {
  const { data: session, isPending: isSessionPending } = useSession()
  const isSignedIn = Boolean(session?.user)

  const query = useQuery<ProgressRecord[], ApiRequestError>({
    queryKey: progressQueryKeys.all,
    queryFn: fetchProgress,
    enabled: isSignedIn,
    // A 401 will not fix itself by trying again.
    retry: (failureCount, error) =>
      !isUnauthorizedError(error) && failureCount < 2,
  })

  return {
    ...query,
    isSignedIn,
    // Signed-out visitors are not "loading" — they are simply unauthenticated,
    // and the catalog should render immediately with no progress.
    isLoading: isSessionPending || (isSignedIn && query.isLoading),
  }
}

/** Lesson id → mastery, the shape `deriveLessonState` expects. */
export function useMasteryByLessonId(): {
  masteryByLessonId: Map<string, MasteryState>
  isLoading: boolean
} {
  const { data, isLoading } = useProgressQuery()

  const masteryByLessonId = useMemo(() => {
    const map = new Map<string, MasteryState>()
    for (const record of data ?? []) {
      map.set(record.lessonId, record.masteryState)
    }
    return map
  }, [data])

  return { masteryByLessonId, isLoading }
}

/**
 * Records a finished attempt.
 *
 * No auto-retry: a failed write surfaces immediately so the learner sees an
 * honest error and can retry deliberately, rather than staring at a spinner
 * through a backoff. Retrying is safe whenever they choose to — the server keys
 * on `clientAttemptId`, so a replay changes nothing and reports
 * `attemptRecorded: false`.
 */
export function useCompleteLessonMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    Awaited<ReturnType<typeof completeLesson>>,
    ApiRequestError,
    CompleteLessonRequest
  >({
    mutationFn: completeLesson,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: progressQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: streakQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: achievementQueryKeys.all })
    },
  })
}
