import { useEffect, useRef } from 'react'
import { Button } from '../../components/atoms/Button/Button'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { useGameRuntime } from './useGameRuntime'
import type { GameDefinition, GameResult } from './types'
import type { LevelDefinition } from '../../learning/schemas/level'
import styles from './GameHost.module.css'

const STAGE_LABELS = [
  { stage: 'predicting', label: 'Predict' },
  { stage: 'simulating', label: 'Simulate' },
  { stage: 'reacting', label: 'React' },
  { stage: 'explaining', label: 'Explain' },
  { stage: 'transfer', label: 'Transfer' },
] as const

interface GameHostProps {
  lessonSlug: string
  level: LevelDefinition
  game: GameDefinition
  onComplete: (result: GameResult) => void
}

export function GameHost({ lessonSlug, level, game, onComplete }: GameHostProps) {
  const { state, actions } = useGameRuntime({ lessonSlug, level })
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.stage === 'complete' && state.result) {
      onComplete(state.result)
    }
  }, [state.stage, state.result, onComplete])

  useEffect(() => {
    if (!state.paused) stageRef.current?.focus()
  }, [state.stage, state.paused])

  const { Component } = game

  return (
    <section
      className={styles.host}
      data-mount={game.mount}
      aria-label={`${level.mechanic} mini-game`}
    >
      <header className={styles.header}>
        <div className={styles.controls}>
          {state.stage !== 'idle' && state.stage !== 'complete' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={state.paused ? actions.resume : actions.pause}
                aria-pressed={state.paused}
              >
                {state.paused ? 'Resume' : 'Pause'}
              </Button>
              <Button variant="ghost" size="sm" onClick={actions.restart}>
                Restart
              </Button>
            </>
          )}
        </div>

        {state.stage !== 'idle' && state.stage !== 'complete' && (
          <ol className={styles.stageTrack} aria-label="Lesson progress">
            {STAGE_LABELS.map(({ stage, label }) => (
              <li
                key={stage}
                className={styles.stageItem}
                data-active={state.stage === stage}
                data-done={
                  STAGE_LABELS.findIndex((s) => s.stage === stage) <
                  STAGE_LABELS.findIndex((s) => s.stage === state.stage)
                }
              >
                {label}
              </li>
            ))}
          </ol>
        )}
      </header>

      {state.stage === 'idle' ? (
        <div className={styles.hook} ref={stageRef} tabIndex={-1}>
          <Heading level={2}>{level.objective}</Heading>
          <Text tone="muted">{level.mechanic}</Text>
          <Button onClick={actions.start}>Start</Button>
        </div>
      ) : state.paused ? (
        <div className={styles.paused} role="status">
          <Text weight="medium">Paused</Text>
          <Button onClick={actions.resume}>Resume</Button>
        </div>
      ) : state.stage === 'complete' ? (
        <div className={styles.complete} role="status">
          <Text weight="medium">Nice work! Loading your result…</Text>
        </div>
      ) : (
        <div
          className={styles.mount}
          ref={stageRef}
          tabIndex={-1}
          aria-live="polite"
        >
          <Component
            stage={state.stage}
            level={level}
            lastRound={state.lastRound}
            accessibilityMode={state.accessibilityMode}
            onSubmitPrediction={actions.submitPrediction}
            onAdvance={actions.advance}
            onSubmitTransfer={actions.submitTransfer}
          />
        </div>
      )}
    </section>
  )
}
