import { gsap } from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../../components/atoms/Button/Button'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { audioService } from '../../lib/audio/audioService'
import { hapticsService } from '../../lib/haptics/hapticsService'
import type { GameComponentProps } from '../runtime/types'
import { BubbleLayerList } from './BubbleLayerList'
import { isSameLayerSet, reactingLayerIds } from './domain/bubbling'
import type { EventBubblingRoundContent } from './domain/content'
import { getEventBubblingContent } from './levels'
import styles from './EventBubblingGame.module.css'

type RoundKind = 'predicting' | 'transfer'

interface RoundEvaluation {
  kind: RoundKind
  selectedIds: string[]
  expectedIds: string[]
  correct: boolean
}

/**
 * Event Bubbling Bubbles — learner selects which nested layers react to a
 * tap, then watches the click bubble outward through them. Master levels let
 * the learner place a stop (stopPropagation) before predicting the outcome.
 */
export function EventBubblingGame({
  stage,
  level,
  accessibilityMode,
  onSubmitPrediction,
  onAdvance,
  onSubmitTransfer,
}: GameComponentProps) {
  const content = getEventBubblingContent(level.mode)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [stopId, setStopId] = useState<string | null>(null)
  const [evaluation, setEvaluation] = useState<RoundEvaluation | null>(null)
  const [revealedCount, setRevealedCount] = useState(0)

  const layerRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const registerRef = useCallback((id: string, element: HTMLDivElement | null) => {
    if (element) layerRefs.current.set(id, element)
    else layerRefs.current.delete(id)
  }, [])

  const [roundStartStage, setRoundStartStage] = useState(stage)
  if (stage !== roundStartStage) {
    setRoundStartStage(stage)
    if (stage === 'predicting' || stage === 'transfer') {
      setSelectedIds(new Set())
      setStopId(null)
      setRevealedCount(0)
    }
  }

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    audioService.play('tap')
    hapticsService.trigger('tap')
  }

  const toggleStop = (id: string) => {
    setStopId((prev) => (prev === id ? null : id))
    audioService.play('place')
    hapticsService.trigger('place')
  }

  const evaluate = (
    roundContent: EventBubblingRoundContent,
    kind: RoundKind,
  ): RoundEvaluation => {
    const stopLayerId = roundContent.allowStopPlacement
      ? stopId
      : roundContent.scenario.stopLayerId
    const expectedIds = reactingLayerIds({
      layers: roundContent.scenario.layers,
      stopLayerId,
    })
    const selected = Array.from(selectedIds)
    const correct = isSameLayerSet(selected, expectedIds)
    return { kind, selectedIds: selected, expectedIds, correct }
  }

  const handleSubmitPrediction = () => {
    const result = evaluate(content.predicting, 'predicting')
    setEvaluation(result)
    onSubmitPrediction(result.correct, true)
  }

  const handleSubmitTransfer = () => {
    const result = evaluate(content.transfer, 'transfer')
    setEvaluation(result)
    onSubmitTransfer(result.correct, true)
  }

  useEffect(() => {
    if (stage !== 'reacting' || !evaluation) return
    audioService.play(evaluation.correct ? 'success' : 'mistake')
    hapticsService.trigger(evaluation.correct ? 'success' : 'mistake')
  }, [stage, evaluation])

  useEffect(() => {
    if (stage !== 'simulating' || !evaluation) return

    const ids = evaluation.expectedIds
    timers.current.forEach(clearTimeout)
    timers.current = []

    if (accessibilityMode.reducedMotion) {
      let step = 0
      const advanceStep = () => {
        step += 1
        setRevealedCount(step)
        audioService.play('tap')
        if (step < ids.length) {
          timers.current.push(setTimeout(advanceStep, 260))
        } else {
          timers.current.push(setTimeout(onAdvance, 420))
        }
      }
      timers.current.push(setTimeout(advanceStep, 160))
      return () => timers.current.forEach(clearTimeout)
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        timers.current.push(setTimeout(onAdvance, 320))
      },
    })

    ids.forEach((id, index) => {
      const element = layerRefs.current.get(id)
      timeline.call(
        () => {
          setRevealedCount(index + 1)
          audioService.play('tap')
        },
        undefined,
        index === 0 ? 0 : '+=0.05',
      )
      if (element) {
        timeline.fromTo(
          element,
          { scale: 1 },
          { scale: 1.06, duration: 0.2, ease: 'power1.out', yoyo: true, repeat: 1 },
          '<',
        )
      }
      timeline.to({}, { duration: 0.16 })
    })

    return () => {
      timeline.kill()
      timers.current.forEach(clearTimeout)
    }
  }, [stage, evaluation, accessibilityMode.reducedMotion, onAdvance])

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  if (stage === 'predicting' || stage === 'transfer') {
    const roundContent = stage === 'predicting' ? content.predicting : content.transfer
    const canSubmit =
      selectedIds.size > 0 && (!roundContent.allowStopPlacement || stopId !== null)

    return (
      <div className={styles.round}>
        <Text>{roundContent.prompt}</Text>
        <BubbleLayerList
          layers={roundContent.scenario.layers}
          interactive
          selectedIds={selectedIds}
          onToggleSelected={toggleSelected}
          stopPlacementEnabled={roundContent.allowStopPlacement}
          stopId={stopId}
          onToggleStop={toggleStop}
          registerRef={registerRef}
        />
        <Button
          onClick={stage === 'predicting' ? handleSubmitPrediction : handleSubmitTransfer}
          disabled={!canSubmit}
        >
          {stage === 'predicting' ? 'Submit prediction' : 'Submit transfer prediction'}
        </Button>
      </div>
    )
  }

  if (stage === 'simulating' && evaluation) {
    const roundContent = evaluation.kind === 'predicting' ? content.predicting : content.transfer
    const revealed = new Set(evaluation.expectedIds.slice(0, revealedCount))

    return (
      <div className={styles.round} role="status" aria-live="polite">
        <Text tone="muted">Watching the click bubble outward…</Text>
        <BubbleLayerList
          layers={roundContent.scenario.layers}
          interactive={false}
          selectedIds={evaluation.selectedIds}
          stopPlacementEnabled={false}
          visualStateFor={(id) => (revealed.has(id) ? 'reacting' : 'pending')}
          registerRef={registerRef}
        />
      </div>
    )
  }

  if (stage === 'reacting' && evaluation) {
    const roundContent = evaluation.kind === 'predicting' ? content.predicting : content.transfer
    const missed = evaluation.expectedIds.filter((id) => !evaluation.selectedIds.includes(id))
    const extra = evaluation.selectedIds.filter((id) => !evaluation.expectedIds.includes(id))
    const labelFor = (id: string) =>
      roundContent.scenario.layers.find((layer) => layer.id === id)?.label ?? id

    return (
      <div className={styles.round} role="status">
        <Heading level={3}>{evaluation.correct ? 'Correct!' : 'Not quite'}</Heading>
        <BubbleLayerList
          layers={roundContent.scenario.layers}
          interactive={false}
          selectedIds={evaluation.selectedIds}
          stopPlacementEnabled={false}
          visualStateFor={(id) =>
            evaluation.expectedIds.includes(id) ? 'reacting' : 'not-reacting'
          }
        />
        <Text>
          {evaluation.correct
            ? 'You identified exactly which layers reacted.'
            : missed.length > 0
              ? `You missed: ${missed.map(labelFor).join(', ')}.`
              : `These didn't actually react: ${extra.map(labelFor).join(', ')}.`}
        </Text>
        <Button onClick={onAdvance}>Continue</Button>
      </div>
    )
  }

  if (stage === 'explaining') {
    return (
      <div className={styles.round}>
        <Text>{content.explanation}</Text>
        <Button onClick={onAdvance}>Try a variation</Button>
      </div>
    )
  }

  return null
}
