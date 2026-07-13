import { useEffect, useRef } from 'react'
import { Button } from '../../components/atoms/Button/Button'
import { Text } from '../../components/atoms/Text/Text'
import { usePressable } from '../runtime/input'
import type { GameComponentProps } from '../runtime/types'
import styles from './ReferenceGame.module.css'

interface SignalChoiceProps {
  value: boolean
  label: string
  onChoose: (value: boolean) => void
}

function SignalChoice({ value, label, onChoose }: SignalChoiceProps) {
  const pressable = usePressable(() => onChoose(value))

  return (
    <div className={styles.choice} {...pressable}>
      {label}
    </div>
  )
}

/**
 * Runtime fixture game — proves the runtime contract, not shippable content.
 * Mechanic: predict a hidden boolean signal before it reveals its real state.
 */
export function ReferenceGame({
  stage,
  lastRound,
  accessibilityMode,
  onSubmitPrediction,
  onAdvance,
  onSubmitTransfer,
}: GameComponentProps) {
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (stage !== 'simulating') return

    const delay = accessibilityMode.reducedMotion ? 0 : 700
    advanceTimer.current = setTimeout(onAdvance, delay)

    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [stage, accessibilityMode.reducedMotion, onAdvance])

  if (stage === 'predicting') {
    return (
      <div className={styles.round}>
        <Text>Will the signal be ON or OFF?</Text>
        <div className={styles.choices}>
          <SignalChoice
            value={true}
            label="On"
            onChoose={(predicted) => onSubmitPrediction(predicted, Math.random() < 0.5)}
          />
          <SignalChoice
            value={false}
            label="Off"
            onChoose={(predicted) => onSubmitPrediction(predicted, Math.random() < 0.5)}
          />
        </div>
      </div>
    )
  }

  if (stage === 'simulating') {
    return (
      <div className={styles.round} role="status">
        <Text tone="muted">Revealing the signal…</Text>
      </div>
    )
  }

  if (stage === 'reacting') {
    return (
      <div className={styles.round} role="status">
        <Text weight="medium">
          The signal was {lastRound?.actual ? 'ON' : 'OFF'} — your prediction was{' '}
          {lastRound?.correct ? 'correct' : 'incorrect'}.
        </Text>
        <Button onClick={onAdvance}>Continue</Button>
      </div>
    )
  }

  if (stage === 'explaining') {
    return (
      <div className={styles.round}>
        <Text>
          Predicting before observing forces you to commit to a mental model,
          which makes the real result more informative either way.
        </Text>
        <Button onClick={onAdvance}>Try a variation</Button>
      </div>
    )
  }

  if (stage === 'transfer') {
    return (
      <div className={styles.round}>
        <Text>One more round — will the signal be ON or OFF this time?</Text>
        <div className={styles.choices}>
          <SignalChoice
            value={true}
            label="On"
            onChoose={(predicted) => onSubmitTransfer(predicted, Math.random() < 0.5)}
          />
          <SignalChoice
            value={false}
            label="Off"
            onChoose={(predicted) => onSubmitTransfer(predicted, Math.random() < 0.5)}
          />
        </div>
      </div>
    )
  }

  return null
}
