import { useEffect, useMemo } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Container } from '../../components/atoms/Container/Container'
import { PlaceholderPage } from '../../components/atoms/PlaceholderPage'
import { ResultScreen } from '../../games/runtime/ResultScreen'
import type { GameResult } from '../../games/runtime/types'
import {
  getReferenceFixtureLevel,
  referenceFixtureLesson,
} from '../../games/_reference-game/fixture'
import { getEventBubblingLevel } from '../../games/event-bubbling-bubbles/levels'
import { getEventBubblingTransferQuestion } from '../../games/event-bubbling-bubbles/reflection'
import { getCacheTheCrowdLevel } from '../../games/cache-the-crowd/levels'
import { getCacheTheCrowdTransferQuestion } from '../../games/cache-the-crowd/reflection'
import { getLessonBySlug } from '../../learning/catalog/lessons'
import { SaveProgressPanel } from '../../features/progress/SaveProgressPanel'
import {
  loadRecentResult,
  saveRecentResult,
} from '../../features/progress/recentResult'

const EVENT_BUBBLING_LESSON_SLUG = 'event-bubbling-bubbles'
const CACHE_THE_CROWD_LESSON_SLUG = 'cache-the-crowd'

export function PlayResultPage() {
  const { lessonSlug } = useParams<{ lessonSlug: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const stateResult = location.state as GameResult | null

  // Router state does not survive a reload or the sign-in round trip, so keep a
  // copy the moment the result arrives.
  useEffect(() => {
    if (stateResult) {
      saveRecentResult(stateResult)
    }
  }, [stateResult])

  const result = useMemo(
    () => stateResult ?? (lessonSlug ? loadRecentResult(lessonSlug) : null),
    [stateResult, lessonSlug],
  )

  if (!result) {
    return (
      <Container padding="none">
        <PlaceholderPage
          title="No recent result"
          description="Play a lesson first to see your result and reflection here."
        />
      </Container>
    )
  }

  if (lessonSlug === EVENT_BUBBLING_LESSON_SLUG) {
    const level = getEventBubblingLevel(result.levelMode)
    const lesson = getLessonBySlug(lessonSlug)

    return (
      <Container padding="none">
        <ResultScreen
          level={level}
          result={result}
          transferQuestion={getEventBubblingTransferQuestion(result.levelMode)}
          onRetry={() => navigate(`/play/${lessonSlug}?mode=${result.levelMode}`)}
          onContinue={() => navigate('/')}
        />

        {lesson ? (
          <SaveProgressPanel result={result} lesson={lesson} level={level} />
        ) : null}
      </Container>
    )
  }

  if (lessonSlug === CACHE_THE_CROWD_LESSON_SLUG) {
    const level = getCacheTheCrowdLevel(result.levelMode)
    const lesson = getLessonBySlug(lessonSlug)

    return (
      <Container padding="none">
        <ResultScreen
          level={level}
          result={result}
          transferQuestion={getCacheTheCrowdTransferQuestion(result.levelMode)}
          onRetry={() => navigate(`/play/${lessonSlug}?mode=${result.levelMode}`)}
          onContinue={() => navigate('/')}
        />

        {lesson ? (
          <SaveProgressPanel result={result} lesson={lesson} level={level} />
        ) : null}
      </Container>
    )
  }

  if (lessonSlug !== referenceFixtureLesson.slug) {
    return (
      <Container padding="none">
        <PlaceholderPage
          title="No recent result"
          description="Play a lesson first to see your result and reflection here."
        />
      </Container>
    )
  }

  // The reference fixture is a runtime demo, not a catalog lesson — there is no
  // progress to save against it.
  const level = getReferenceFixtureLevel(result.levelMode)

  return (
    <Container padding="none">
      <ResultScreen
        level={level}
        result={result}
        transferQuestion="If the signal always flips from its last shown state, what will it show after two more flips?"
        onRetry={() => navigate(`/play/${lessonSlug}?mode=${result.levelMode}`)}
        onContinue={() => navigate('/')}
      />
    </Container>
  )
}
