import { Link } from 'react-router-dom'
import { Card } from '../../components/molecules/Card/Card'
import { Container } from '../../components/atoms/Container/Container'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { useLessonsQuery, useTracksQuery } from '../../learning/queries'
import styles from './HomePage.module.css'

export function HomePage() {
  const { data: tracks } = useTracksQuery()
  const { data: lessons } = useLessonsQuery()

  const sortedTracks = [...(tracks ?? [])].sort((a, b) => a.order - b.order)
  const continueLesson = lessons?.find(
    (lesson) => lesson.trackId === sortedTracks[0]?.id,
  )
  const dailyChallengeLesson = lessons?.find(
    (lesson) => lesson.trackId === sortedTracks[1]?.id,
  )
  const recommendedLesson = lessons?.find(
    (lesson) => lesson.trackId === sortedTracks[2]?.id,
  )

  return (
    <Container padding="none">
      <Heading level={1}>Home</Heading>
      <Text tone="muted">Tiny games. Big developer instincts.</Text>

      <div className={styles.grid}>
        <Card>
          <Heading level={3}>Continue learning</Heading>
          {continueLesson ? (
            <>
              <Text tone="muted" size="sm">
                {continueLesson.title}
              </Text>
              <Link to={`/play/${continueLesson.slug}`}>Resume</Link>
            </>
          ) : (
            <Text tone="muted" size="sm">
              Start your first track to see it here.
            </Text>
          )}
        </Card>

        <Card>
          <Heading level={3}>Daily challenge</Heading>
          {dailyChallengeLesson ? (
            <>
              <Text tone="muted" size="sm">
                {dailyChallengeLesson.title}
              </Text>
              <Link to={`/play/${dailyChallengeLesson.slug}`}>Play today</Link>
            </>
          ) : (
            <Text tone="muted" size="sm">
              Today's challenge will appear here.
            </Text>
          )}
        </Card>

        <Card>
          <Heading level={3}>Streak</Heading>
          <Text tone="muted" size="sm">
            0-day streak. Complete a lesson to start one.
          </Text>
        </Card>

        <Card>
          <Heading level={3}>Recommended next</Heading>
          {recommendedLesson ? (
            <>
              <Text tone="muted" size="sm">
                {recommendedLesson.title}
              </Text>
              <Link to={`/play/${recommendedLesson.slug}`}>Try it</Link>
            </>
          ) : (
            <Text tone="muted" size="sm">
              Recommendations will appear as tracks unlock.
            </Text>
          )}
        </Card>
      </div>
    </Container>
  )
}
