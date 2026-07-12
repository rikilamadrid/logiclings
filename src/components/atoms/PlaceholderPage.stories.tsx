import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlaceholderPage } from './PlaceholderPage'

const meta: Meta<typeof PlaceholderPage> = {
  title: 'Atoms/PlaceholderPage',
  component: PlaceholderPage,
}

export default meta
type Story = StoryObj<typeof PlaceholderPage>

export const Default: Story = {
  args: {
    title: 'Home',
    description: 'Continue learning, daily challenge, and streak arrive here.',
  },
}
