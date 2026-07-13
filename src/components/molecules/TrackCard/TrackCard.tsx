import { Link } from 'react-router-dom'
import { Heading } from '../../atoms/Heading/Heading'
import { Text } from '../../atoms/Text/Text'
import type { Track } from '../../../learning/schemas/track'
import { Card } from '../Card/Card'
import styles from './TrackCard.module.css'

interface TrackCardProps {
  track: Track
}

export function TrackCard({ track }: TrackCardProps) {
  return (
    <Link to={`/tracks/${track.slug}`} className={styles.link}>
      <Card
        className={styles.card}
        style={{
          borderInlineStartWidth: 'var(--border-width-md)',
          borderInlineStartStyle: 'solid',
          borderInlineStartColor: `var(${track.accentToken})`,
        }}
      >
        <Heading level={3}>{track.title}</Heading>
        <Text tone="muted" size="sm">
          {track.summary}
        </Text>
        <Text size="sm" weight="medium">
          Not started
        </Text>
      </Card>
    </Link>
  )
}
