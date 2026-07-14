import type { Meta, StoryObj } from '@storybook/react-vite'
import { StreakSummary } from './StreakSummary'

const meta: Meta<typeof StreakSummary> = {
  title: 'Organisms/StreakSummary',
  component: StreakSummary,
}

export default meta
type Story = StoryObj<typeof StreakSummary>

export const NoStreak: Story = {
  args: {
    streak: {
      currentDays: 0,
      longestDays: 0,
      lastQualifiedDate: null,
      timezone: 'UTC',
    },
  },
}

export const ActiveStreak: Story = {
  args: {
    streak: {
      currentDays: 4,
      longestDays: 7,
      lastQualifiedDate: '2026-07-13',
      timezone: 'America/New_York',
    },
  },
}
