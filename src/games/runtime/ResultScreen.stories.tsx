import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResultScreen } from './ResultScreen'
import type { LevelDefinition } from '../../learning/schemas/level'
import type { GameResult } from './types'

const level: LevelDefinition = {
  id: 'level-runtime-fixture-discover',
  lessonId: 'lesson-runtime-fixture',
  mode: 'discover',
  objective: 'Predict whether the signal will be on or off before it flips.',
  mechanic: 'Choose On or Off, then watch the signal reveal its real state.',
  winCondition:
    'The signal flipped, and your prediction was checked against its real state.',
  reflection:
    'Systems often hold hidden state that only becomes visible once you observe it — predicting first sharpens your mental model of what changed and why.',
  contentVersion: 1,
}

const transferQuestion =
  'If the signal always flips from its last shown state, what will it show after two more flips?'

const meta: Meta<typeof ResultScreen> = {
  title: 'Games/Runtime/ResultScreen',
  component: ResultScreen,
}

export default meta
type Story = StoryObj<typeof ResultScreen>

const baseResult: GameResult = {
  lessonSlug: 'runtime-fixture',
  levelMode: 'discover',
  outcome: 'completed',
  score: 100,
  correctCount: 2,
  totalRounds: 2,
  attemptCount: 1,
  durationMs: 42000,
  startedAt: new Date(Date.now() - 42000).toISOString(),
  completedAt: new Date().toISOString(),
  mistakeCodes: [],
  clientAttemptId: 'story-attempt-1',
}

export const Success: Story = {
  args: {
    level,
    result: baseResult,
    transferQuestion,
    onRetry: () => {},
    onContinue: () => {},
  },
}

export const WithMistakes: Story = {
  args: {
    level,
    result: {
      ...baseResult,
      score: 50,
      correctCount: 1,
      mistakeCodes: ['predicting-mismatch'],
    },
    transferQuestion,
    onRetry: () => {},
    onContinue: () => {},
  },
}
