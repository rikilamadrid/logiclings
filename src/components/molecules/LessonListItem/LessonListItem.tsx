import { Link } from 'react-router-dom'
import { Badge } from '../../atoms/Badge/Badge'
import { Heading } from '../../atoms/Heading/Heading'
import { Text } from '../../atoms/Text/Text'
import type { Lesson } from '../../../learning/schemas/lesson'
import type { LessonState } from '../../../learning/deriveLessonState'
import { Card } from '../Card/Card'
import styles from './LessonListItem.module.css'

interface LessonListItemProps {
  lesson: Lesson
  state: LessonState
}

const stateLabel: Record<LessonState, string> = {
  locked: 'Locked',
  available: 'Available',
  completed: 'Completed',
}

const stateTone: Record<LessonState, 'neutral' | 'success'> = {
  locked: 'neutral',
  available: 'neutral',
  completed: 'success',
}

export function LessonListItem({ lesson, state }: LessonListItemProps) {
  const isLocked = state === 'locked'

  const content = (
    <Card elevation="flat" className={styles.card}>
      <div className={styles.header}>
        <Heading level={4}>{lesson.title}</Heading>
        <Badge tone={stateTone[state]}>
          {isLocked ? `🔒 ${stateLabel[state]}` : stateLabel[state]}
        </Badge>
      </div>
      <Text tone="muted" size="sm">
        {lesson.summary}
      </Text>
      <Text size="sm" tone="muted">
        {lesson.estimatedMinutes} min · Difficulty {lesson.difficulty}
      </Text>
    </Card>
  )

  if (isLocked) {
    return (
      <div className={styles.link} aria-disabled="true">
        {content}
      </div>
    )
  }

  return (
    <Link to={`/play/${lesson.slug}`} className={styles.link}>
      {content}
    </Link>
  )
}
