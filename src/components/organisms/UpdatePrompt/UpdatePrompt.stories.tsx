import type { Meta, StoryObj } from '@storybook/react-vite'
import { UpdatePrompt } from './UpdatePrompt'

const meta: Meta<typeof UpdatePrompt> = {
  title: 'Organisms/UpdatePrompt',
  component: UpdatePrompt,
}

export default meta
type Story = StoryObj<typeof UpdatePrompt>

export const Visible: Story = {
  args: {
    onRefresh: () => {},
    onDismiss: () => {},
  },
}
