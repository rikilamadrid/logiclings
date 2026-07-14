import { gsap } from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../../components/atoms/Button/Button'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { audioService } from '../../lib/audio/audioService'
import { hapticsService } from '../../lib/haptics/hapticsService'
import { ResourceMeter } from '../shared/ResourceMeter/ResourceMeter'
import type { GameComponentProps } from '../runtime/types'
import { PackingList, type ItemVisualState } from './PackingList'
import { simulatePackaging, totalCostOf, type PackagingSimulationResult } from './domain/packaging'
import type { PackagingRoundContent } from './domain/content'
import { getContextPackagerContent } from './levels'
import styles from './ContextPackagerGame.module.css'

type RoundKind = 'predicting' | 'transfer'

interface RoundEvaluation {
  kind: RoundKind
  packedIds: string[]
  result: PackagingSimulationResult
}

/**
 * Context Packager — learner picks which available items belong in an
 * agent's context package, within a visible budget, before the agent runs
 * and the resulting response quality is revealed.
 */
export function ContextPackagerGame({
  stage,
  level,
  accessibilityMode,
  onSubmitPrediction,
  onAdvance,
  onSubmitTransfer,
}: GameComponentProps) {
  const content = getContextPackagerContent(level.mode)
  const [packedIds, setPackedIds] = useState<Set<string>>(new Set())
  const [evaluation, setEvaluation] = useState<RoundEvaluation | null>(null)
  const [revealedCount, setRevealedCount] = useState(0)

  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map())
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const registerRef = useCallback((id: string, element: HTMLLIElement | null) => {
    if (element) rowRefs.current.set(id, element)
    else rowRefs.current.delete(id)
  }, [])

  const [roundStartStage, setRoundStartStage] = useState(stage)
  if (stage !== roundStartStage) {
    setRoundStartStage(stage)
    if (stage === 'predicting' || stage === 'transfer') {
      setPackedIds(new Set())
      setRevealedCount(0)
    }
  }

  const togglePacked = (id: string, roundContent: PackagingRoundContent) => {
    const previousCost = totalCostOf(packedIds, roundContent.scenario.items)
    const next = new Set(packedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setPackedIds(next)

    const nextCost = totalCostOf(next, roundContent.scenario.items)
    if (previousCost <= roundContent.scenario.budget && nextCost > roundContent.scenario.budget) {
      audioService.play('exceeded')
      hapticsService.trigger('exceeded')
    } else {
      audioService.play('tap')
      hapticsService.trigger('tap')
    }
  }

  const evaluate = (roundContent: PackagingRoundContent, kind: RoundKind): RoundEvaluation => {
    const ids = Array.from(packedIds)
    const result = simulatePackaging({ scenario: roundContent.scenario, packedIds: ids })
    return { kind, packedIds: ids, result }
  }

  const handleSubmitPrediction = () => {
    const round = evaluate(content.predicting, 'predicting')
    setEvaluation(round)
    onSubmitPrediction(round.result.correct, true)
  }

  const handleSubmitTransfer = () => {
    const round = evaluate(content.transfer, 'transfer')
    setEvaluation(round)
    onSubmitTransfer(round.result.correct, true)
  }

  useEffect(() => {
    if (stage !== 'reacting' || !evaluation) return
    audioService.play(evaluation.result.correct ? 'success' : 'mistake')
    hapticsService.trigger(evaluation.result.correct ? 'success' : 'mistake')
  }, [stage, evaluation])

  useEffect(() => {
    if (stage !== 'simulating' || !evaluation) return

    const roundContent = evaluation.kind === 'predicting' ? content.predicting : content.transfer
    const ideal = new Set(roundContent.scenario.idealIncludedIds)
    timers.current.forEach(clearTimeout)
    timers.current = []

    if (evaluation.packedIds.length === 0) {
      timers.current.push(setTimeout(onAdvance, 400))
      return () => timers.current.forEach(clearTimeout)
    }

    if (accessibilityMode.reducedMotion) {
      let step = 0
      const advanceStep = () => {
        const id = evaluation.packedIds[step]
        step += 1
        setRevealedCount(step)
        audioService.play(ideal.has(id) ? 'valid' : 'invalid')
        if (step < evaluation.packedIds.length) {
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

    evaluation.packedIds.forEach((id, index) => {
      const element = rowRefs.current.get(id)
      timeline.call(
        () => {
          setRevealedCount(index + 1)
          audioService.play(ideal.has(id) ? 'valid' : 'invalid')
        },
        undefined,
        index === 0 ? 0 : '+=0.05',
      )
      if (element) {
        timeline.fromTo(
          element,
          { scale: 1 },
          { scale: 1.04, duration: 0.2, ease: 'power1.out', yoyo: true, repeat: 1 },
          '<',
        )
      }
      timeline.to({}, { duration: 0.16 })
    })

    return () => {
      timeline.kill()
      timers.current.forEach(clearTimeout)
    }
  }, [stage, evaluation, accessibilityMode.reducedMotion, onAdvance, content])

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  if (stage === 'predicting' || stage === 'transfer') {
    const roundContent = stage === 'predicting' ? content.predicting : content.transfer
    const totalCost = totalCostOf(packedIds, roundContent.scenario.items)
    const overBudget = totalCost > roundContent.scenario.budget
    const canSubmit = packedIds.size > 0

    return (
      <div className={styles.round}>
        <Text>{roundContent.prompt}</Text>
        <ResourceMeter label="Context budget" value={totalCost} max={roundContent.scenario.budget} />
        {overBudget && (
          <Text size="sm" className={styles.overBudgetWarning}>
            {totalCost - roundContent.scenario.budget} units over budget
          </Text>
        )}
        <PackingList
          items={roundContent.scenario.items}
          interactive
          packedIds={packedIds}
          onTogglePacked={(id) => togglePacked(id, roundContent)}
        />
        <Button
          onClick={stage === 'predicting' ? handleSubmitPrediction : handleSubmitTransfer}
          disabled={!canSubmit}
        >
          {stage === 'predicting' ? 'Submit package' : 'Submit transfer package'}
        </Button>
      </div>
    )
  }

  if (stage === 'simulating' && evaluation) {
    const roundContent = evaluation.kind === 'predicting' ? content.predicting : content.transfer
    const revealedIds = new Set(evaluation.packedIds.slice(0, revealedCount))
    const ideal = new Set(roundContent.scenario.idealIncludedIds)
    const visualStateFor = (id: string): ItemVisualState => {
      if (!evaluation.packedIds.includes(id)) return 'excluded'
      if (!revealedIds.has(id)) return 'pending'
      return ideal.has(id) ? 'good' : 'extraneous'
    }
    const revealedTotalCost = totalCostOf(revealedIds, roundContent.scenario.items)

    return (
      <div className={styles.round} role="status" aria-live="polite">
        <Text tone="muted">Running the agent on this package…</Text>
        <ResourceMeter label="Context budget" value={revealedTotalCost} max={roundContent.scenario.budget} />
        <PackingList
          items={roundContent.scenario.items}
          interactive={false}
          packedIds={evaluation.packedIds}
          visualStateFor={visualStateFor}
          registerRef={registerRef}
        />
      </div>
    )
  }

  if (stage === 'reacting' && evaluation) {
    const roundContent = evaluation.kind === 'predicting' ? content.predicting : content.transfer
    const ideal = new Set(roundContent.scenario.idealIncludedIds)
    const packed = new Set(evaluation.packedIds)
    const labelFor = (id: string) =>
      roundContent.scenario.items.find((item) => item.id === id)?.label ?? id
    const visualStateFor = (id: string): ItemVisualState => {
      if (evaluation.result.missingIds.includes(id)) return 'missing'
      if (!packed.has(id)) return 'excluded'
      return ideal.has(id) ? 'good' : 'extraneous'
    }

    return (
      <div className={styles.round} role="status">
        <Heading level={3}>{evaluation.result.correct ? 'Correct!' : 'Not quite'}</Heading>
        <Text>Response quality: {evaluation.result.qualityScore} / 100</Text>
        <ResourceMeter
          label="Context budget used"
          value={evaluation.result.totalCost}
          max={roundContent.scenario.budget}
        />
        <PackingList
          items={roundContent.scenario.items}
          interactive={false}
          packedIds={evaluation.packedIds}
          visualStateFor={visualStateFor}
        />
        <Text>
          {evaluation.result.correct
            ? 'You packed exactly what the agent needed, within budget.'
            : evaluation.result.missingIds.length > 0
              ? `Left out: ${evaluation.result.missingIds.map(labelFor).join(', ')}.`
              : `Not needed: ${evaluation.result.extraneousIds.map(labelFor).join(', ')}.`}
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
