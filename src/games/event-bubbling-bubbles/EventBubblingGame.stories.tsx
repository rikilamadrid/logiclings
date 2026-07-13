import type { Meta, StoryObj } from '@storybook/react-vite'
import { EventBubblingGame } from './EventBubblingGame'
import { getEventBubblingLevel } from './levels'

const meta: Meta<typeof EventBubblingGame> = {
  title: 'Games/Event Bubbling Bubbles/EventBubblingGame',
  component: EventBubblingGame,
}

export default meta
type Story = StoryObj<typeof EventBubblingGame>

const accessibilityMode = { reducedMotion: false, soundEnabled: true }

const noop = () => {}

export const Predicting: Story = {
  name: 'Initial — predicting round',
  args: {
    stage: 'predicting',
    level: getEventBubblingLevel('discover'),
    lastRound: null,
    accessibilityMode,
    onSubmitPrediction: noop,
    onAdvance: noop,
    onSubmitTransfer: noop,
  },
}

export const MasterPlacingStop: Story = {
  name: 'Master — placing a stop',
  args: {
    stage: 'predicting',
    level: getEventBubblingLevel('master'),
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
    level: getEventBubblingLevel('apply'),
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
    level: getEventBubblingLevel('discover'),
    lastRound: null,
    accessibilityMode,
    onSubmitPrediction: noop,
    onAdvance: noop,
    onSubmitTransfer: noop,
  },
}
