import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '../../components/atoms/PlaceholderPage'

export function TrackDetailPage() {
  const { trackSlug } = useParams<{ trackSlug: string }>()

  return (
    <PlaceholderPage
      title={`Track: ${trackSlug}`}
      description="Track map and lesson progression will render here."
    />
  )
}
