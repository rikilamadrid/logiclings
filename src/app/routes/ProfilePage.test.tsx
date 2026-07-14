import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import { ProfilePage } from './ProfilePage'

const useSession = vi.fn()
const fetchProgress = vi.fn()
const fetchStreak = vi.fn()
const fetchAchievements = vi.fn()

vi.mock('../../lib/auth/authClient', () => ({
  useSession: () => useSession(),
  signOut: vi.fn(),
}))

vi.mock('../../lib/api/progressClient', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../lib/api/progressClient')>()
  return {
    ...actual,
    fetchProgress: (...args: unknown[]) => fetchProgress(...args),
  }
})

vi.mock('../../lib/api/streakClient', () => ({
  fetchStreak: (...args: unknown[]) => fetchStreak(...args),
}))

vi.mock('../../lib/api/achievementClient', () => ({
  fetchAchievements: (...args: unknown[]) => fetchAchievements(...args),
}))

function signedIn() {
  useSession.mockReturnValue({
    data: { user: { id: 'user-1', name: 'Ada', email: 'ada@example.com' } },
    isPending: false,
  })
}

function signedOut() {
  useSession.mockReturnValue({ data: null, isPending: false })
}

describe('ProfilePage', () => {
  beforeEach(() => {
    useSession.mockReset()
    fetchProgress.mockReset()
    fetchStreak.mockReset()
    fetchAchievements.mockReset()
  })

  it('prompts a signed-out visitor to sign in', () => {
    signedOut()
    renderWithProviders(<ProfilePage />)

    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('shows an encouraging empty state for a brand-new signed-in user', async () => {
    signedIn()
    fetchProgress.mockResolvedValue([])
    fetchStreak.mockResolvedValue({
      currentDays: 0,
      longestDays: 0,
      lastQualifiedDate: null,
      timezone: 'UTC',
    })
    fetchAchievements.mockResolvedValue([])

    renderWithProviders(<ProfilePage />)

    expect(
      await screen.findByText(/haven't finished a lesson yet/),
    ).toBeInTheDocument()
    expect(screen.getByText('start one today', { exact: false })).toBeInTheDocument()
    expect(screen.getAllByText('Locked').length).toBeGreaterThan(0)
    expect(screen.queryByText('Earned')).not.toBeInTheDocument()
  })

  it('renders real completed lessons, streak, and earned achievements', async () => {
    signedIn()
    fetchProgress.mockResolvedValue([
      {
        lessonId: 'lesson-flexbox-factory',
        masteryState: 'applied',
        bestScore: 100,
        attempts: 1,
        completedAt: '2026-07-13T10:00:00.000Z',
        lastPlayedAt: '2026-07-13T10:00:00.000Z',
        lessonVersion: 1,
      },
    ])
    fetchStreak.mockResolvedValue({
      currentDays: 3,
      longestDays: 3,
      lastQualifiedDate: '2026-07-13',
      timezone: 'America/New_York',
    })
    fetchAchievements.mockResolvedValue([
      {
        slug: 'first-completion',
        title: 'First Steps',
        description: 'Complete your first lesson.',
        iconKey: 'first-completion',
        earnedAt: '2026-07-13T10:00:00.000Z',
      },
    ])

    renderWithProviders(<ProfilePage />)

    expect(await screen.findByText('Flexbox Factory')).toBeInTheDocument()
    expect(screen.getByText('3 days streak')).toBeInTheDocument()
    expect(screen.getByText('First Steps')).toBeInTheDocument()
    expect(screen.getAllByText('Earned').length).toBe(1)
  })
})
