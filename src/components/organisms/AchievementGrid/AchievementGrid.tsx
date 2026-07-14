import { achievementCatalog } from '../../../achievements/catalog/achievements'
import type { AchievementRecord } from '../../../lib/api/contracts'
import { Badge } from '../../atoms/Badge/Badge'
import { Heading } from '../../atoms/Heading/Heading'
import { Text } from '../../atoms/Text/Text'
import { Card } from '../../molecules/Card/Card'
import styles from './AchievementGrid.module.css'

interface AchievementGridProps {
  earned: AchievementRecord[]
}

/** Placeholder glyphs — final mascot/badge artwork lands in a later pass. */
const iconGlyph: Record<string, string> = {
  'first-completion': '🌱',
  'three-day-streak': '🔥',
  'track-mastered': '🏆',
}

export function AchievementGrid({ earned }: AchievementGridProps) {
  const earnedBySlug = new Map(earned.map((achievement) => [achievement.slug, achievement]))

  return (
    <div className={styles.grid}>
      {achievementCatalog.map((achievement) => {
        const earnedRecord = earnedBySlug.get(achievement.slug)
        const isEarned = Boolean(earnedRecord)

        return (
          <Card
            key={achievement.slug}
            elevation="flat"
            className={isEarned ? styles.earned : styles.locked}
          >
            <div className={styles.glyph} aria-hidden="true">
              {isEarned ? iconGlyph[achievement.iconKey] : '🔒'}
            </div>
            <Heading level={4}>{achievement.title}</Heading>
            <Text tone="muted" size="sm">
              {achievement.description}
            </Text>
            <Badge tone={isEarned ? 'success' : 'neutral'}>
              {isEarned ? 'Earned' : 'Locked'}
            </Badge>
          </Card>
        )
      })}
    </div>
  )
}
