import { Button } from '../../components/atoms/Button/Button'
import { Card } from '../../components/molecules/Card/Card'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import type { LevelDefinition } from '../../learning/schemas/level'
import type { GameResult } from './types'
import styles from './ResultScreen.module.css'

interface ResultScreenProps {
  level: LevelDefinition
  result: GameResult
  transferQuestion: string
  onRetry: () => void
  onContinue?: () => void
}

export function ResultScreen({
  level,
  result,
  transferQuestion,
  onRetry,
  onContinue,
}: ResultScreenProps) {
  const passed = result.correctCount === result.totalRounds

  return (
    <div className={styles.screen}>
      <Card>
        <Heading level={1}>{passed ? 'Nice work!' : 'Close — let’s look again'}</Heading>
        <Text tone="muted">
          {passed
            ? 'You predicted the outcome correctly every round.'
            : 'A prediction or two missed the mark. That’s exactly where the concept lives.'}
        </Text>

        <dl className={styles.statGrid}>
          <div className={styles.stat}>
            <dt>Score</dt>
            <dd>{result.score}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Correct</dt>
            <dd>
              {result.correctCount}/{result.totalRounds}
            </dd>
          </div>
          <div className={styles.stat}>
            <dt>Attempts</dt>
            <dd>{result.attemptCount}</dd>
          </div>
        </dl>
      </Card>

      <Card elevation="flat">
        <Heading level={2}>What happened</Heading>
        <Text>{level.winCondition}</Text>
      </Card>

      <Card elevation="flat">
        <Heading level={2}>The concept</Heading>
        <Text>{level.reflection}</Text>
      </Card>

      <Card elevation="flat">
        <Heading level={2}>Try it a different way</Heading>
        <Text>{transferQuestion}</Text>
      </Card>

      <Card elevation="flat">
        <Heading level={3}>Mastery, XP, and streak</Heading>
        <Text tone="muted" size="sm">
          Coming soon — progress and streak tracking arrive in a later feature.
        </Text>
      </Card>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
        {onContinue && <Button onClick={onContinue}>Continue</Button>}
      </div>
    </div>
  )
}
