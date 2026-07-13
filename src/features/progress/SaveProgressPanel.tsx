import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../../components/atoms/Button/Button'
import { Text } from '../../components/atoms/Text/Text'
import { signInHref } from '../auth/useAuthRedirect'
import { useSession } from '../../lib/auth/authClient'
import { audioService } from '../../lib/audio/audioService'
import type { CompleteLessonRequest } from '../../lib/api/contracts'
import type { GameResult } from '../../games/runtime/types'
import type { Lesson } from '../../learning/schemas/lesson'
import type { LevelDefinition } from '../../learning/schemas/level'
import { useCompleteLessonMutation } from './queries'
import styles from './SaveProgressPanel.module.css'

interface SaveProgressPanelProps {
  result: GameResult
  lesson: Lesson
  level: LevelDefinition
}

/**
 * Saves a finished attempt to the learner's account.
 *
 * Play itself is never gated — the learner reaches this screen signed in or
 * not. Auth is asked for here, at the point progress would actually be saved,
 * and the attempt is preserved across the sign-in round trip so nothing is lost.
 */
export function SaveProgressPanel({
  result,
  lesson,
  level,
}: SaveProgressPanelProps) {
  const location = useLocation()
  const { data: session, isPending: isSessionPending } = useSession()
  const isSignedIn = Boolean(session?.user)

  const mutation = useCompleteLessonMutation()
  const { mutate } = mutation

  const request = useMemo<CompleteLessonRequest>(
    () => ({
      clientAttemptId: result.clientAttemptId,
      lessonId: lesson.id,
      levelId: level.id,
      levelMode: result.levelMode,
      lessonVersion: lesson.version,
      outcome: result.outcome,
      score: result.score,
      correctCount: result.correctCount,
      totalRounds: result.totalRounds,
      mistakeCodes: result.mistakeCodes,
      // The runtime does not track hints yet (no game offers them); when one
      // does, it becomes part of GameResult.
      hintCount: 0,
      durationMs: result.durationMs,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
    [result, lesson, level],
  )

  // Save as soon as we know who the learner is. Guarded so React's re-renders
  // (and StrictMode's double-invoke in dev) cannot fire a second save — though
  // even if one slipped through, `clientAttemptId` makes the server ignore it.
  const savedAttemptId = useRef<string | null>(null)

  useEffect(() => {
    if (!isSignedIn) return
    if (savedAttemptId.current === request.clientAttemptId) return

    savedAttemptId.current = request.clientAttemptId
    mutate(request)
  }, [isSignedIn, mutate, request])

  // Plays the streak cue once per qualifying save, and enters the CSS
  // transition on the next frame so it actually transitions in rather than
  // rendering already-visible.
  const [streakVisible, setStreakVisible] = useState(false)
  const streak = mutation.data?.streak
  const streakQualified = mutation.data?.streakQualified ?? false

  useEffect(() => {
    if (!streakQualified) return

    audioService.play('streak')
    const frame = requestAnimationFrame(() => setStreakVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [streakQualified])

  if (isSessionPending) {
    return (
      <div className={styles.panel}>
        <Text tone="muted" size="sm">
          Checking your account…
        </Text>
      </div>
    )
  }

  if (!isSignedIn) {
    const returnTo = `${location.pathname}${location.search}`

    return (
      <div className={styles.panel}>
        <Text weight="medium">Save this to your progress</Text>
        <Text tone="muted" size="sm">
          Sign in and we&apos;ll keep this result — your progress syncs across
          your devices.
        </Text>
        <Link className={styles.signInLink} to={signInHref(returnTo)}>
          Sign in to save
        </Link>
      </div>
    )
  }

  if (mutation.isPending) {
    return (
      <div className={styles.panel} aria-live="polite">
        <Text tone="muted" size="sm">
          Saving your progress…
        </Text>
      </div>
    )
  }

  if (mutation.isError) {
    return (
      <div className={styles.panel} role="alert">
        <Text weight="medium">We couldn&apos;t save your progress</Text>
        <Text tone="muted" size="sm">
          {mutation.error.message}
        </Text>
        <Button variant="secondary" onClick={() => mutate(request)}>
          Try again
        </Button>
      </div>
    )
  }

  if (mutation.isSuccess) {
    return (
      <div className={styles.panel} aria-live="polite">
        <Text weight="medium">Progress saved</Text>
        {streak && streakQualified && (
          <Text
            tone="muted"
            size="sm"
            className={`${styles.streak} ${streakVisible ? styles.streakIn : ''}`}
          >
            {streak.currentDays === 1
              ? "You're on a 1-day streak. Keep it up!"
              : `${streak.currentDays}-day streak! Keep it up.`}
          </Text>
        )}
      </div>
    )
  }

  return null
}
