import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost'],
    },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Start Lesson', variant: 'primary' },
}

export const Secondary: Story = {
  args: { children: 'Skip for now', variant: 'secondary' },
}

export const Ghost: Story = {
  args: { children: 'Cancel', variant: 'ghost' },
}

export const Disabled: Story = {
  args: { children: 'Continue', disabled: true },
}

export const Small: Story = {
  args: { children: 'Retry', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Play Now', size: 'lg' },
}
