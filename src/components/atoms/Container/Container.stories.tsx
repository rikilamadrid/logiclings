import type { Meta, StoryObj } from '@storybook/react-vite'
import { Container } from './Container'

const meta: Meta<typeof Container> = {
  title: 'Atoms/Container',
  component: Container,
  argTypes: {
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Container>

export const Default: Story = {
  args: {
    children: (
      <div style={{ background: 'var(--color-surface-muted)' }}>
        Mobile-first content column, capped for readability.
      </div>
    ),
  },
}
