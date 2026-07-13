import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import { ApiRequestError } from '../../lib/api/progressClient'
import type { GameResult } from '../../games/runtime/types'
import type { Lesson } from '../../learning/schemas/lesson'
import type { LevelDefinition } from '../../learning/schemas/level'
import { SaveProgressPanel } from './SaveProgressPanel'

const useSession = vi.fn()
const completeLesson = vi.fn()
const audioPlay = vi.fn()

vi.mock('../../lib/auth/authClient', () => ({
  useSession: () => useSession(),
}))

vi.mock('../../lib/api/progressClient', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../lib/api/progressClient')>()
  return {
    ...actual,
    completeLesson: (...args: unknown[]) => completeLesson(...args),
  }
})

vi.mock('../../lib/audio/audioService', () => ({
  audioService: { play: (...args: unknown[]) => audioPlay(...args) },
}))

const lesson: Lesson = {
  id: 'lesson-1',
  trackId: 'track-frontend',
  slug: 'event-bubbling-bubbles',
  title: 'Event Bubbling Bubbles',
  summary: 'Events travel outward.',
  learningObjective: 'Predict which layers react to a tap.',
  misconception: 'Only the tapped element reacts.',
  estimatedMinutes: 5,
  difficulty: 1,
  version: 3,
  status: 'published',
  prerequisiteLessonIds: [],
}

const level: LevelDefinition = {
  id: 'level-apply',
  lessonId: 'lesson-1',
  mode: 'apply',
  objective: 'Apply bubbling.',
  mechanic: 'Tap layers.',
  winCondition: 'All rounds correct.',
  reflection: 'Events bubble outward.',
  contentVersion: 1,
}

const result: GameResult = {
  lessonSlug: 'event-bubbling-bubbles',
  levelMode: 'apply',
  outcome: 'completed',
  score: 100,
  correctCount: 2,
  totalRounds: 2,
  attemptCount: 1,
  durationMs: 41_000,
  startedAt: '2026-07-13T10:00:00.000Z',
  completedAt: '2026-07-13T10:00:41.000Z',
  mistakeCodes: [],
  clientAttemptId: 'attempt-abc',
}

function signedIn() {
  useSession.mockReturnValue({
    data: { user: { id: 'user-1', name: 'Ada', email: 'ada@example.com' } },
    isPending: false,
  })
}

function signedOut() {
  useSession.mockReturnValue({ data: null, isPending: false })
}

function renderPanel(route = '/play/event-bubbling-bubbles/result') {
  return renderWithProviders(
    <SaveProgressPanel result={result} lesson={lesson} level={level} />,
    { route },
  )
}

describe('SaveProgressPanel', () => {
  beforeEach(() => {
    useSession.mockReset()
    completeLesson.mockReset()
    audioPlay.mockReset()
    completeLesson.mockResolvedValue({
      progress: {
        lessonId: 'lesson-1',
        masteryState: 'applied',
        bestScore: 100,
        attempts: 1,
        completedAt: '2026-07-13T10:00:41.000Z',
        lastPlayedAt: '2026-07-13T10:00:41.000Z',
        lessonVersion: 3,
      },
      attemptRecorded: true,
      streak: {
        currentDays: 1,
        longestDays: 1,
        lastQualifiedDate: '2026-07-13',
        timezone: 'America/New_York',
      },
      streakQualified: false,
    })
  })

  describe('signed out', () => {
    it('prompts for sign-in instead of saving', async () => {
      signedOut()
      renderPanel()

      expect(
        await screen.findByRole('link', { name: 'Sign in to save' }),
      ).toBeInTheDocument()
      // Play is never gated — but nothing is written for an anonymous visitor.
      expect(completeLesson).not.toHaveBeenCalled()
    })

    it('sends the learner back to this result after signing in', async () => {
      signedOut()
      renderPanel()

      const link = await screen.findByRole('link', { name: 'Sign in to save' })

      expect(link).toHaveAttribute(
        'href',
        '/auth/sign-in?redirectTo=%2Fplay%2Fevent-bubbling-bubbles%2Fresult',
      )
    })
  })

  describe('signed in', () => {
    it('saves the attempt and confirms it', async () => {
      signedIn()
      renderPanel()

      await waitFor(() => expect(completeLesson).toHaveBeenCalledTimes(1))

      expect(completeLesson.mock.calls[0][0]).toMatchObject({
        clientAttemptId: 'attempt-abc',
        lessonId: 'lesson-1',
        levelId: 'level-apply',
        levelMode: 'apply',
        lessonVersion: 3,
        outcome: 'completed',
        score: 100,
        correctCount: 2,
        totalRounds: 2,
        startedAt: '2026-07-13T10:00:00.000Z',
        completedAt: '2026-07-13T10:00:41.000Z',
      })
      expect(completeLesson.mock.calls[0][0]).toHaveProperty('timezone')

      expect(await screen.findByText('Progress saved')).toBeInTheDocument()
    })

    it('plays the streak cue and shows the streak message on a qualifying day', async () => {
      signedIn()
      completeLesson.mockResolvedValue({
        progress: {
          lessonId: 'lesson-1',
          masteryState: 'applied',
          bestScore: 100,
          attempts: 1,
          completedAt: '2026-07-13T10:00:41.000Z',
          lastPlayedAt: '2026-07-13T10:00:41.000Z',
          lessonVersion: 3,
        },
        attemptRecorded: true,
        streak: {
          currentDays: 3,
          longestDays: 5,
          lastQualifiedDate: '2026-07-13',
          timezone: 'America/New_York',
        },
        streakQualified: true,
      })

      renderPanel()

      expect(
        await screen.findByText('3-day streak! Keep it up.'),
      ).toBeInTheDocument()
      expect(audioPlay).toHaveBeenCalledWith('streak')
    })

    it('does not show a streak message when the day already qualified', async () => {
      signedIn()
      renderPanel()

      await screen.findByText('Progress saved')
      expect(screen.queryByText(/day streak/)).not.toBeInTheDocument()
      expect(audioPlay).not.toHaveBeenCalled()
    })

    it('saves once even across re-renders', async () => {
      signedIn()
      const { rerender } = renderPanel()

      await waitFor(() => expect(completeLesson).toHaveBeenCalledTimes(1))

      rerender(
        <SaveProgressPanel result={result} lesson={lesson} level={level} />,
      )

      await screen.findByText('Progress saved')
      expect(completeLesson).toHaveBeenCalledTimes(1)
    })

    it('offers a retry when the save fails', async () => {
      signedIn()
      completeLesson.mockRejectedValueOnce(
        new ApiRequestError('internal_error', 'Something went wrong.', 500),
      )

      const user = userEvent.setup()
      renderPanel()

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Something went wrong.',
      )

      await user.click(screen.getByRole('button', { name: 'Try again' }))

      await waitFor(() => expect(completeLesson).toHaveBeenCalledTimes(2))
      expect(await screen.findByText('Progress saved')).toBeInTheDocument()
    })
  })
})
