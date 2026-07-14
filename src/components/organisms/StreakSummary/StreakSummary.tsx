import type { StreakRecord } from '../../../lib/api/contracts'
import { Heading } from '../../atoms/Heading/Heading'
import { Text } from '../../atoms/Text/Text'
import { Card } from '../../molecules/Card/Card'
import styles from './StreakSummary.module.css'

interface StreakSummaryProps {
  streak: StreakRecord
}

function formatLastQualifiedDate(lastQualifiedDate: string | null): string {
  if (!lastQualifiedDate) return 'No qualifying day yet'
  const date = new Date(`${lastQualifiedDate}T00:00:00Z`)
  return `Last qualified ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })}`
}

export function StreakSummary({ streak }: StreakSummaryProps) {
  const isActive = streak.currentDays > 0

  return (
    <Card elevation="flat" className={styles.card}>
      <div className={styles.headline}>
        <span className={styles.glyph} aria-hidden="true">
          {isActive ? '🔥' : '💤'}
        </span>
        <Heading level={4}>
          {streak.currentDays} day{streak.currentDays === 1 ? '' : 's'}
          {isActive ? ' streak' : ' — start one today'}
        </Heading>
      </div>
      <Text tone="muted" size="sm">
        Longest streak: {streak.longestDays} day{streak.longestDays === 1 ? '' : 's'}
      </Text>
      <Text tone="muted" size="sm">
        {formatLastQualifiedDate(streak.lastQualifiedDate)}
      </Text>
    </Card>
  )
}
