import { useParams } from 'react-router-dom'
import { Container } from '../../components/atoms/Container/Container'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { LessonListItem } from '../../components/molecules/LessonListItem/LessonListItem'
import { PlaceholderPage } from '../../components/atoms/PlaceholderPage'
import { deriveLessonState } from '../../learning/deriveLessonState'
import {
  useLessonsByTrackQuery,
  useTrackQuery,
} from '../../learning/queries'
import { useMasteryByLessonId } from '../../features/progress/queries'
import styles from './TrackDetailPage.module.css'

export function TrackDetailPage() {
  const { trackSlug } = useParams<{ trackSlug: string }>()
  const { data: track, isLoading: isTrackLoading } = useTrackQuery(trackSlug)
  const { data: lessons, isLoading: areLessonsLoading } =
    useLessonsByTrackQuery(trackSlug)

  // Empty for signed-out learners, so every lesson falls back to `not_started`.
  const { masteryByLessonId, isLoading: isProgressLoading } =
    useMasteryByLessonId()

  if (isTrackLoading || areLessonsLoading || isProgressLoading) {
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
              state={deriveLessonState(lesson, masteryByLessonId)}
            />
          </li>
        ))}
      </ul>
    </Container>
  )
}
