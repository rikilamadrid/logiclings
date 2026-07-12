import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '../../components/atoms/PlaceholderPage'

export function PlayResultPage() {
  const { lessonSlug } = useParams<{ lessonSlug: string }>()

  return (
    <PlaceholderPage
      title={`Result: ${lessonSlug}`}
      description="Result, reflection, mastery, and retry actions will render here."
    />
  )
}
