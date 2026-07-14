import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContextPackagerGame } from './ContextPackagerGame'
import { getContextPackagerLevel } from './levels'

const meta: Meta<typeof ContextPackagerGame> = {
  title: 'Games/Context Packager/ContextPackagerGame',
  component: ContextPackagerGame,
}

export default meta
type Story = StoryObj<typeof ContextPackagerGame>

const accessibilityMode = { reducedMotion: false, soundEnabled: true }

const noop = () => {}

export const Packing: Story = {
  name: 'Initial — packing round',
  args: {
    stage: 'predicting',
    level: getContextPackagerLevel('discover'),
    lastRound: null,
    accessibilityMode,
    onSubmitPrediction: noop,
    onAdvance: noop,
    onSubmitTransfer: noop,
  },
}

export const MasterChoosingBetweenLogAndExcerpt: Story = {
  name: 'Master — full log dump vs. curated excerpt',
  args: {
    stage: 'predicting',
    level: getContextPackagerLevel('master'),
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
    level: getContextPackagerLevel('apply'),
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
    level: getContextPackagerLevel('master'),
    lastRound: null,
    accessibilityMode,
    onSubmitPrediction: noop,
    onAdvance: noop,
    onSubmitTransfer: noop,
  },
}
