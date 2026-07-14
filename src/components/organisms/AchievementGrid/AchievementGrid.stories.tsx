import type { Meta, StoryObj } from '@storybook/react-vite'
import { AchievementGrid } from './AchievementGrid'

const meta: Meta<typeof AchievementGrid> = {
  title: 'Organisms/AchievementGrid',
  component: AchievementGrid,
}

export default meta
type Story = StoryObj<typeof AchievementGrid>

export const AllLocked: Story = {
  args: { earned: [] },
}

export const SomeEarned: Story = {
  args: {
    earned: [
      {
        slug: 'first-completion',
        title: 'First Steps',
        description: 'Complete your first lesson.',
        iconKey: 'first-completion',
        earnedAt: '2026-07-10T10:00:00.000Z',
      },
    ],
  },
}

export const AllEarned: Story = {
  args: {
    earned: [
      {
        slug: 'first-completion',
        title: 'First Steps',
        description: 'Complete your first lesson.',
        iconKey: 'first-completion',
        earnedAt: '2026-07-10T10:00:00.000Z',
      },
      {
        slug: 'three-day-streak',
        title: 'On a Roll',
        description: 'Keep a 3-day streak going.',
        iconKey: 'three-day-streak',
        earnedAt: '2026-07-12T10:00:00.000Z',
      },
      {
        slug: 'track-mastered',
        title: 'Track Master',
        description: 'Master every lesson in a track.',
        iconKey: 'track-mastered',
        earnedAt: '2026-07-13T10:00:00.000Z',
      },
    ],
  },
}
