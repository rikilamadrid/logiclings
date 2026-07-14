import { useCallback } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { PlaceholderPage } from '../../components/atoms/PlaceholderPage'
import { Container } from '../../components/atoms/Container/Container'
import { GameHost } from '../../games/runtime/GameHost'
import type { GameResult } from '../../games/runtime/types'
import { referenceGameDefinition } from '../../games/_reference-game/gameDefinition'
import {
  getReferenceFixtureLevel,
  referenceFixtureLesson,
} from '../../games/_reference-game/fixture'
import { eventBubblingGameDefinition } from '../../games/event-bubbling-bubbles/gameDefinition'
import { getEventBubblingLevel } from '../../games/event-bubbling-bubbles/levels'
import { cacheTheCrowdGameDefinition } from '../../games/cache-the-crowd/gameDefinition'
import { getCacheTheCrowdLevel } from '../../games/cache-the-crowd/levels'
import { useLessonsQuery } from '../../learning/queries'
import type { LevelMode } from '../../learning/schemas/level'

const EVENT_BUBBLING_LESSON_SLUG = 'event-bubbling-bubbles'
const CACHE_THE_CROWD_LESSON_SLUG = 'cache-the-crowd'

const VALID_MODES: LevelMode[] = ['discover', 'apply', 'master']

function parseLevelMode(value: string | null): LevelMode {
  return VALID_MODES.includes(value as LevelMode) ? (value as LevelMode) : 'discover'
}

export function PlayLessonPage() {
  const { lessonSlug } = useParams<{ lessonSlug: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data: lessons, isLoading } = useLessonsQuery()

  const handleComplete = useCallback(
    (result: GameResult) => {
      navigate(`/play/${lessonSlug}/result`, { state: result })
    },
    [navigate, lessonSlug],
  )

  if (lessonSlug === referenceFixtureLesson.slug) {
    const level = getReferenceFixtureLevel(parseLevelMode(searchParams.get('mode')))

    return (
      <Container padding="none">
        <GameHost
          lessonSlug={lessonSlug}
          level={level}
          game={referenceGameDefinition}
          onComplete={handleComplete}
        />
      </Container>
    )
  }

  if (lessonSlug === EVENT_BUBBLING_LESSON_SLUG) {
    const level = getEventBubblingLevel(parseLevelMode(searchParams.get('mode')))

    return (
      <Container padding="none">
        <GameHost
          lessonSlug={lessonSlug}
          level={level}
          game={eventBubblingGameDefinition}
          onComplete={handleComplete}
        />
      </Container>
    )
  }

  if (lessonSlug === CACHE_THE_CROWD_LESSON_SLUG) {
    const level = getCacheTheCrowdLevel(parseLevelMode(searchParams.get('mode')))

    return (
      <Container padding="none">
        <GameHost
          lessonSlug={lessonSlug}
          level={level}
          game={cacheTheCrowdGameDefinition}
          onComplete={handleComplete}
        />
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container padding="none">
        <PlaceholderPage title="Loading…" description="Fetching this lesson." />
      </Container>
    )
  }

  const lesson = lessons?.find((candidate) => candidate.slug === lessonSlug)

  if (!lesson) {
    return (
      <Container padding="none">
        <PlaceholderPage
          title="Lesson not found"
          description={`No lesson matches "${lessonSlug}".`}
        />
      </Container>
    )
  }

  return (
    <Container padding="none">
      <PlaceholderPage
        title={lesson.title}
        description="This mini-game hasn't been built yet — the runtime contract is ready, but this lesson's gameplay ships in a later feature."
      />
    </Container>
  )
}
