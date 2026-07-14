import type { Meta, StoryObj } from '@storybook/react-vite'
import { TrackMasteryList } from './TrackMasteryList'

const meta: Meta<typeof TrackMasteryList> = {
  title: 'Organisms/TrackMasteryList',
  component: TrackMasteryList,
}

export default meta
type Story = StoryObj<typeof TrackMasteryList>

const frontendTrack = {
  id: 'track-frontend',
  slug: 'frontend' as const,
  title: 'Frontend',
  summary: 'Feel how the browser renders, reacts, and recovers.',
  order: 0,
  iconKey: 'frontend',
  accentToken: '--color-track-frontend',
}

const systemDesignTrack = {
  id: 'track-system-design',
  slug: 'system-design' as const,
  title: 'System Design',
  summary: 'Balance traffic, caches, and tradeoffs.',
  order: 1,
  iconKey: 'system-design',
  accentToken: '--color-track-system-design',
}

export const NotStarted: Story = {
  args: {
    summaries: [
      { track: frontendTrack, lessonCount: 5, masteredCount: 0, completedCount: 0 },
      { track: systemDesignTrack, lessonCount: 4, masteredCount: 0, completedCount: 0 },
    ],
  },
}

export const InProgress: Story = {
  args: {
    summaries: [
      { track: frontendTrack, lessonCount: 5, masteredCount: 2, completedCount: 4 },
      { track: systemDesignTrack, lessonCount: 4, masteredCount: 4, completedCount: 4 },
    ],
  },
}
