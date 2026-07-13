import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { TrackCard } from './TrackCard'

const meta: Meta<typeof TrackCard> = {
  title: 'Molecules/TrackCard',
  component: TrackCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TrackCard>

export const Frontend: Story = {
  args: {
    track: {
      id: 'track-frontend',
      slug: 'frontend',
      title: 'Frontend',
      summary:
        'Feel how the browser renders, reacts, and recovers — layout, events, and state.',
      order: 0,
      iconKey: 'frontend',
      accentToken: '--color-track-frontend',
    },
  },
}

export const SystemDesign: Story = {
  args: {
    track: {
      id: 'track-system-design',
      slug: 'system-design',
      title: 'System Design',
      summary:
        'Balance traffic, caches, and tradeoffs to keep a growing system standing.',
      order: 1,
      iconKey: 'system-design',
      accentToken: '--color-track-system-design',
    },
  },
}
