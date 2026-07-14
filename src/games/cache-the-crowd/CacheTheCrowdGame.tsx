import { gsap } from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../../components/atoms/Button/Button'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { audioService } from '../../lib/audio/audioService'
import { hapticsService } from '../../lib/haptics/hapticsService'
import { ResourceMeter } from '../shared/ResourceMeter/ResourceMeter'
import type { GameComponentProps } from '../runtime/types'
import { CrowdWaveList, type RequestVisualState } from './CrowdWaveList'
import { isSameIdSet, simulateCacheWave, type CacheSimulationResult } from './domain/cache'
import type { CacheRoundContent } from './domain/content'
import { getCacheTheCrowdContent } from './levels'
import styles from './CacheTheCrowdGame.module.css'

type RoundKind = 'predicting' | 'transfer'

interface RoundEvaluation {
  kind: RoundKind
  selectedIds: string[]
  result: CacheSimulationResult
  correct: boolean
}

interface OptionGroupProps {
  legend: string
  options: number[]
  unit: string
  value: number | null
  onChange: (value: number) => void
}

function OptionGroup({ legend, options, unit, value, onChange }: OptionGroupProps) {
  return (
    <fieldset className={styles.optionGroup}>
      <legend className={styles.optionLegend}>{legend}</legend>
      <div className={styles.optionButtons}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={styles.optionButton}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option} {unit}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

/**
 * Cache the Crowd — learner sets a cache TTL (and, at master, a purge
 * timing) before a wave of visitor requests runs, then predicts which
 * requests will miss the cache and hit the origin server directly.
 */
export function CacheTheCrowdGame({
  stage,
  level,
  accessibilityMode,
  onSubmitPrediction,
  onAdvance,
  onSubmitTransfer,
}: GameComponentProps) {
  const content = getCacheTheCrowdContent(level.mode)
  const [ttl, setTtl] = useState<number | null>(null)
  const [invalidateAtTick, setInvalidateAtTick] = useState<number | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
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
      setTtl(null)
      setInvalidateAtTick(null)
      setSelectedIds(new Set())
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

  const chooseTtl = (value: number) => {
    setTtl(value)
    audioService.play('place')
    hapticsService.trigger('place')
  }

  const chooseInvalidation = (value: number) => {
    setInvalidateAtTick(value)
    audioService.play('place')
    hapticsService.trigger('place')
  }

  const evaluate = (roundContent: CacheRoundContent, kind: RoundKind): RoundEvaluation => {
    const result = simulateCacheWave({
      scenario: roundContent.scenario,
      ttl: ttl ?? roundContent.scenario.ttlOptions[0],
      invalidateAtTick: roundContent.allowInvalidationChoice ? invalidateAtTick : null,
    })
    const selected = Array.from(selectedIds)
    const correct = isSameIdSet(selected, result.missIds)
    return { kind, selectedIds: selected, result, correct }
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

    const roundContent = evaluation.kind === 'predicting' ? content.predicting : content.transfer
    const ids = roundContent.scenario.requests.map((request) => request.id)
    timers.current.forEach(clearTimeout)
    timers.current = []

    if (accessibilityMode.reducedMotion) {
      let step = 0
      const advanceStep = () => {
        const outcome = evaluation.result.outcomesById[ids[step]]
        step += 1
        setRevealedCount(step)
        audioService.play(outcome.hit ? 'valid' : 'invalid')
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
      const element = rowRefs.current.get(id)
      const outcome = evaluation.result.outcomesById[id]
      timeline.call(
        () => {
          setRevealedCount(index + 1)
          audioService.play(outcome.hit ? 'valid' : 'invalid')
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
    const canSubmit =
      ttl !== null &&
      selectedIds.size > 0 &&
      (!roundContent.allowInvalidationChoice || invalidateAtTick !== null)

    return (
      <div className={styles.round}>
        <Text>{roundContent.prompt}</Text>
        <OptionGroup
          legend="Cache TTL"
          options={roundContent.scenario.ttlOptions}
          unit="ticks"
          value={ttl}
          onChange={chooseTtl}
        />
        {roundContent.allowInvalidationChoice && roundContent.scenario.invalidationTickOptions && (
          <OptionGroup
            legend="Run the cache purge at"
            options={roundContent.scenario.invalidationTickOptions}
            unit="tick"
            value={invalidateAtTick}
            onChange={chooseInvalidation}
          />
        )}
        <CrowdWaveList
          requests={roundContent.scenario.requests}
          interactive
          selectedIds={selectedIds}
          onToggleSelected={toggleSelected}
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
    const revealedIds = roundContent.scenario.requests.slice(0, revealedCount).map((r) => r.id)
    const visualStateFor = (id: string): RequestVisualState => {
      if (!revealedIds.includes(id)) return 'pending'
      return evaluation.result.outcomesById[id].hit ? 'hit' : 'miss'
    }
    const strain = revealedCount > 0 ? evaluation.result.outcomesById[revealedIds[revealedIds.length - 1]].strainAfter : 0

    return (
      <div className={styles.round} role="status" aria-live="polite">
        <Text tone="muted">Watching the crowd arrive…</Text>
        <ResourceMeter label="Origin server strain" value={strain} />
        <CrowdWaveList
          requests={roundContent.scenario.requests}
          interactive={false}
          selectedIds={evaluation.selectedIds}
          visualStateFor={visualStateFor}
          registerRef={registerRef}
        />
      </div>
    )
  }

  if (stage === 'reacting' && evaluation) {
    const roundContent = evaluation.kind === 'predicting' ? content.predicting : content.transfer
    const missed = evaluation.result.missIds.filter((id) => !evaluation.selectedIds.includes(id))
    const extra = evaluation.selectedIds.filter((id) => !evaluation.result.missIds.includes(id))
    const labelFor = (id: string) =>
      roundContent.scenario.requests.find((request) => request.id === id)?.visitorLabel ?? id

    return (
      <div className={styles.round} role="status">
        <Heading level={3}>{evaluation.correct ? 'Correct!' : 'Not quite'}</Heading>
        <ResourceMeter label="Peak origin server strain" value={evaluation.result.peakStrain} />
        <CrowdWaveList
          requests={roundContent.scenario.requests}
          interactive={false}
          selectedIds={evaluation.selectedIds}
          visualStateFor={(id) => (evaluation.result.missIds.includes(id) ? 'miss' : 'hit')}
        />
        <Text>
          {evaluation.correct
            ? 'You identified exactly which requests missed the cache.'
            : missed.length > 0
              ? `You missed: ${missed.map(labelFor).join(', ')}.`
              : `These actually hit the cache: ${extra.map(labelFor).join(', ')}.`}
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
