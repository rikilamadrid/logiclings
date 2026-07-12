import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenShowcase } from './TokenShowcase'

const meta: Meta<typeof TokenShowcase> = {
  title: 'Foundations/Design Tokens',
  component: TokenShowcase,
}

export default meta
type Story = StoryObj<typeof TokenShowcase>

export const Palette: Story = {}
