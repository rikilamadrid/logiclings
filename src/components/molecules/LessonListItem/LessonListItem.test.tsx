import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Lesson } from '../../../learning/schemas/lesson'
import { LessonListItem } from './LessonListItem'

const lesson: Lesson = {
  id: 'lesson-event-bubbling-bubbles',
  trackId: 'track-frontend',
  slug: 'event-bubbling-bubbles',
  title: 'Event Bubbling Bubbles',
  summary: 'Pop bubbles in capture and bubble order.',
  learningObjective: 'Trace how a DOM event travels from target to root.',
  misconception: 'Clicking a child only triggers handlers bound to that element.',
  estimatedMinutes: 5,
  difficulty: 2,
  version: 1,
  status: 'published',
  prerequisiteLessonIds: [],
}

describe('LessonListItem', () => {
  it('links to the player route when available', () => {
    render(
      <MemoryRouter>
        <LessonListItem lesson={lesson} state="available" />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('link', { name: /event bubbling bubbles/i }),
    ).toHaveAttribute('href', '/play/event-bubbling-bubbles')
  })

  it('renders a locked lesson as non-interactive with a locked label', () => {
    render(
      <MemoryRouter>
        <LessonListItem lesson={lesson} state="locked" />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText(/locked/i)).toBeInTheDocument()
  })

  it('shows a completed label when mastered', () => {
    render(
      <MemoryRouter>
        <LessonListItem lesson={lesson} state="completed" />
      </MemoryRouter>,
    )

    expect(screen.getByText(/completed/i)).toBeInTheDocument()
  })
})
