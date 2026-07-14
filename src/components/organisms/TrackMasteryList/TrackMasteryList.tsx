import type { TrackMasterySummary } from '../../../features/profile/useProfile'
import { Badge } from '../../atoms/Badge/Badge'
import { Heading } from '../../atoms/Heading/Heading'
import { Text } from '../../atoms/Text/Text'
import { Card } from '../../molecules/Card/Card'
import styles from './TrackMasteryList.module.css'

interface TrackMasteryListProps {
  summaries: TrackMasterySummary[]
}

export function TrackMasteryList({ summaries }: TrackMasteryListProps) {
  return (
    <ul className={styles.list}>
      {summaries.map((summary) => (
        <li key={summary.track.id}>
          <Card
            elevation="flat"
            className={styles.card}
            style={{
              borderInlineStartWidth: 'var(--border-width-md)',
              borderInlineStartStyle: 'solid',
              borderInlineStartColor: `var(${summary.track.accentToken})`,
            }}
          >
            <Heading level={4}>{summary.track.title}</Heading>
            <div className={styles.stats}>
              <Badge tone={summary.track.slug}>
                {summary.masteredCount}/{summary.lessonCount} mastered
              </Badge>
              <Text tone="muted" size="sm">
                {summary.completedCount}/{summary.lessonCount} completed
              </Text>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  )
}
