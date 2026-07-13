import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { LessonListItem } from './LessonListItem'

const meta: Meta<typeof LessonListItem> = {
  title: 'Molecules/LessonListItem',
  component: LessonListItem,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof LessonListItem>

const baseLesson = {
  id: 'lesson-event-bubbling-bubbles',
  trackId: 'track-frontend',
  slug: 'event-bubbling-bubbles',
  title: 'Event Bubbling Bubbles',
  summary: 'Pop bubbles in capture and bubble order before they reach the root.',
  learningObjective: 'Trace how a DOM event travels from target to root.',
  misconception: 'Clicking a child only triggers handlers bound to that element.',
  estimatedMinutes: 5,
  difficulty: 2 as const,
  version: 1,
  status: 'published' as const,
  prerequisiteLessonIds: ['lesson-flexbox-factory'],
}

export const Available: Story = {
  args: { lesson: { ...baseLesson, prerequisiteLessonIds: [] }, state: 'available' },
}

export const Locked: Story = {
  args: { lesson: baseLesson, state: 'locked' },
}

export const Completed: Story = {
  args: { lesson: baseLesson, state: 'completed' },
}
