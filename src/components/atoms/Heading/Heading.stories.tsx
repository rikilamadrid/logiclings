import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from './Heading'

const meta: Meta<typeof Heading> = {
  title: 'Atoms/Heading',
  component: Heading,
  argTypes: {
    level: { control: { type: 'select' }, options: [1, 2, 3, 4] },
  },
}

export default meta
type Story = StoryObj<typeof Heading>

export const Level1: Story = {
  args: { level: 1, children: 'Tiny games. Big developer instincts.' },
}

export const Level2: Story = {
  args: { level: 2, children: 'Frontend Track' },
}

export const Level3: Story = {
  args: { level: 3, children: 'Event Bubbling' },
}

export const Level4: Story = {
  args: { level: 4, children: 'Lesson 3 of 8' },
}
