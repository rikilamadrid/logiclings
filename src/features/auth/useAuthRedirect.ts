import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Where to land after a successful sign-in/sign-up.
 *
 * Progress-gated actions send the learner here with `?redirectTo=…` so they
 * return to the result screen they were on and can save the attempt they just
 * finished, rather than being dumped on the home page.
 */
export function useAuthRedirect() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const redirectParam = searchParams.get('redirectTo')

  // Only same-origin, absolute-path redirects — never an off-site URL supplied
  // through the query string.
  const redirectTo =
    redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
      ? redirectParam
      : '/'

  const completeAuth = useCallback(async () => {
    // The identity behind every cached server response just changed.
    await queryClient.invalidateQueries()
    navigate(redirectTo, { replace: true })
  }, [navigate, queryClient, redirectTo])

  return { redirectTo, completeAuth }
}

/** Builds the sign-in link for a learner who needs an account to continue. */
export function signInHref(redirectTo: string): string {
  return `/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
}

export function signUpHref(redirectTo: string): string {
  return `/auth/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`
}
