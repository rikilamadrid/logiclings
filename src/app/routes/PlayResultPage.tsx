import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Container } from '../../components/atoms/Container/Container'
import { PlaceholderPage } from '../../components/atoms/PlaceholderPage'
import { ResultScreen } from '../../games/runtime/ResultScreen'
import type { GameResult } from '../../games/runtime/types'
import {
  getReferenceFixtureLevel,
  referenceFixtureLesson,
} from '../../games/_reference-game/fixture'

export function PlayResultPage() {
  const { lessonSlug } = useParams<{ lessonSlug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const result = location.state as GameResult | null

  if (!result || lessonSlug !== referenceFixtureLesson.slug) {
    return (
      <Container padding="none">
        <PlaceholderPage
          title="No recent result"
          description="Play a lesson first to see your result and reflection here."
        />
      </Container>
    )
  }

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
