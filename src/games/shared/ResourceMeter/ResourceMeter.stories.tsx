import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResourceMeter } from './ResourceMeter'

const meta: Meta<typeof ResourceMeter> = {
  title: 'Games/Shared/ResourceMeter',
  component: ResourceMeter,
}

export default meta
type Story = StoryObj<typeof ResourceMeter>

export const Calm: Story = {
  args: { label: 'Origin server strain', value: 10 },
}

export const Busy: Story = {
  args: { label: 'Origin server strain', value: 50 },
}

export const Strained: Story = {
  args: { label: 'Origin server strain', value: 90 },
}
