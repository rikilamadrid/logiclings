import type { Meta, StoryObj } from '@storybook/react-vite'
import { CacheTheCrowdGame } from './CacheTheCrowdGame'
import { getCacheTheCrowdLevel } from './levels'

const meta: Meta<typeof CacheTheCrowdGame> = {
  title: 'Games/Cache the Crowd/CacheTheCrowdGame',
  component: CacheTheCrowdGame,
}

export default meta
type Story = StoryObj<typeof CacheTheCrowdGame>

const accessibilityMode = { reducedMotion: false, soundEnabled: true }

const noop = () => {}

export const Predicting: Story = {
  name: 'Initial — predicting round',
  args: {
    stage: 'predicting',
    level: getCacheTheCrowdLevel('discover'),
    lastRound: null,
    accessibilityMode,
    onSubmitPrediction: noop,
    onAdvance: noop,
    onSubmitTransfer: noop,
  },
}

export const MasterChoosingPurgeTiming: Story = {
  name: 'Master — choosing purge timing',
  args: {
    stage: 'predicting',
    level: getCacheTheCrowdLevel('master'),
    lastRound: null,
    accessibilityMode,
    onSubmitPrediction: noop,
    onAdvance: noop,
    onSubmitTransfer: noop,
  },
}

export const Transfer: Story = {
  name: 'Transfer round',
  args: {
    stage: 'transfer',
    level: getCacheTheCrowdLevel('apply'),
    lastRound: {
      kind: 'predicting',
      predicted: true,
      actual: true,
      correct: true,
    },
    accessibilityMode,
    onSubmitPrediction: noop,
    onAdvance: noop,
    onSubmitTransfer: noop,
  },
}

export const Explaining: Story = {
  name: 'Explaining — named concept',
  args: {
    stage: 'explaining',
    level: getCacheTheCrowdLevel('discover'),
    lastRound: null,
    accessibilityMode,
    onSubmitPrediction: noop,
    onAdvance: noop,
    onSubmitTransfer: noop,
  },
}
