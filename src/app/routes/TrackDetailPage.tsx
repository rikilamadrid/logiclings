import { useParams } from 'react-router-dom'
import { Container } from '../../components/atoms/Container/Container'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { LessonListItem } from '../../components/molecules/LessonListItem/LessonListItem'
import { PlaceholderPage } from '../../components/atoms/PlaceholderPage'
import { deriveLessonState } from '../../learning/deriveLessonState'
import type { MasteryState } from '../../learning/schemas/lesson'
import {
  useLessonsByTrackQuery,
  useTrackQuery,
} from '../../learning/queries'
import styles from './TrackDetailPage.module.css'

const noMastery = new Map<string, MasteryState>()

export function TrackDetailPage() {
  const { trackSlug } = useParams<{ trackSlug: string }>()
  const { data: track, isLoading: isTrackLoading } = useTrackQuery(trackSlug)
  const { data: lessons, isLoading: areLessonsLoading } =
    useLessonsByTrackQuery(trackSlug)

  if (isTrackLoading || areLessonsLoading) {
    return <Text tone="muted">Loading track…</Text>
  }

  if (!track) {
    return (
      <PlaceholderPage
        title="Track not found"
        description={`No track matches "${trackSlug}".`}
      />
    )
  }

  return (
    <Container padding="none">
      <Heading level={1}>{track.title}</Heading>
      <Text tone="muted">{track.summary}</Text>

      <ul className={styles.list}>
        {lessons?.map((lesson) => (
          <li key={lesson.id}>
            <LessonListItem
              lesson={lesson}
              state={deriveLessonState(lesson, noMastery)}
            />
          </li>
        ))}
      </ul>
    </Container>
  )
}
