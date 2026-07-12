import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '../../components/atoms/PlaceholderPage'

export function PlayLessonPage() {
  const { lessonSlug } = useParams<{ lessonSlug: string }>()

  return (
    <PlaceholderPage
      title={`Play: ${lessonSlug}`}
      description="The mini-game player will render here."
    />
  )
}
