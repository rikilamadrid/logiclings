import type { Meta, StoryObj } from '@storybook/react-vite'
import { BubbleLayerList } from './BubbleLayerList'
import type { BubbleLayer } from './domain/bubbling'

const layers: BubbleLayer[] = [
  { id: 'pod', label: 'Pod' },
  { id: 'habitat', label: 'Habitat' },
  { id: 'planet', label: 'Planet' },
]

const meta: Meta<typeof BubbleLayerList> = {
  title: 'Games/Event Bubbling Bubbles/BubbleLayerList',
  component: BubbleLayerList,
}

export default meta
type Story = StoryObj<typeof BubbleLayerList>

export const MidPropagation: Story = {
  name: 'Mid-propagation — bubble reaches Habitat',
  args: {
    layers,
    interactive: false,
    selectedIds: ['pod', 'habitat', 'planet'],
    stopPlacementEnabled: false,
    visualStateFor: (id) => (id === 'planet' ? 'pending' : 'reacting'),
  },
}

export const Success: Story = {
  name: 'Result — correct prediction',
  args: {
    layers,
    interactive: false,
    selectedIds: ['pod', 'habitat', 'planet'],
    stopPlacementEnabled: false,
    visualStateFor: () => 'reacting',
  },
}

export const Mistake: Story = {
  name: 'Result — missed a reacting layer',
  args: {
    layers,
    interactive: false,
    selectedIds: ['pod'],
    stopPlacementEnabled: false,
    visualStateFor: () => 'reacting',
  },
}
