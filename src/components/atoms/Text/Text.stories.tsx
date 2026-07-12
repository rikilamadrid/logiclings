import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from './Text'

const meta: Meta<typeof Text> = {
  title: 'Atoms/Text',
  component: Text,
  argTypes: {
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    tone: { control: { type: 'select' }, options: ['default', 'muted'] },
    weight: {
      control: { type: 'select' },
      options: ['regular', 'medium', 'bold'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Text>

export const Default: Story = {
  args: { children: 'Short mini-games teach real engineering instincts.' },
}

export const Muted: Story = {
  args: {
    tone: 'muted',
    children: 'Estimated 3 minutes remaining in this lesson.',
  },
}

export const Small: Story = {
  args: { size: 'sm', children: 'Level 2 of 4' },
}

export const Bold: Story = {
  args: { weight: 'bold', children: 'Streak: 6 days' },
}
