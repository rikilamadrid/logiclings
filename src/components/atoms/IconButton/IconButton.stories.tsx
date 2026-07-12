import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from './IconButton'

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path
      d="M5 5l10 10M15 5L5 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost'],
    },
  },
}

export default meta
type Story = StoryObj<typeof IconButton>

export const Ghost: Story = {
  args: { icon: <CloseIcon />, label: 'Close', variant: 'ghost' },
}

export const Primary: Story = {
  args: { icon: <CloseIcon />, label: 'Close', variant: 'primary' },
}

export const Disabled: Story = {
  args: { icon: <CloseIcon />, label: 'Close', disabled: true },
}
