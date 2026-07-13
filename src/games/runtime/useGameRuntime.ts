import { useEffect, useMemo, useReducer } from 'react'
import type { LevelDefinition } from '../../learning/schemas/level'
import { createInitialRuntimeState, createRuntimeReducer } from './runtimeReducer'
import { useReducedMotion } from './useReducedMotion'
import type { RuntimeState } from './types'

export interface UseGameRuntimeOptions {
  lessonSlug: string
  level: LevelDefinition
}

export function useGameRuntime({ lessonSlug, level }: UseGameRuntimeOptions) {
  const reducedMotion = useReducedMotion()
  const reducer = useMemo(() => createRuntimeReducer(lessonSlug), [lessonSlug])
  const [state, dispatch] = useReducer(
    reducer,
    level,
    (initialLevel): RuntimeState =>
      createInitialRuntimeState(initialLevel, {
        reducedMotion,
        soundEnabled: true,
      }),
  )

  useEffect(() => {
    dispatch({ type: 'SET_REDUCED_MOTION', reducedMotion })
  }, [reducedMotion])

  const actions = useMemo(
    () => ({
      start: () => dispatch({ type: 'START' }),
      pause: () => dispatch({ type: 'PAUSE' }),
      resume: () => dispatch({ type: 'RESUME' }),
      restart: () => dispatch({ type: 'RESTART' }),
      submitPrediction: (predicted: boolean, actual: boolean) =>
        dispatch({ type: 'SUBMIT_PREDICTION', predicted, actual }),
      advance: () => dispatch({ type: 'ADVANCE' }),
      submitTransfer: (predicted: boolean, actual: boolean) =>
        dispatch({ type: 'SUBMIT_TRANSFER', predicted, actual }),
      setSoundEnabled: (soundEnabled: boolean) =>
        dispatch({ type: 'SET_SOUND_ENABLED', soundEnabled }),
    }),
    [],
  )

  return { state, actions }
}
