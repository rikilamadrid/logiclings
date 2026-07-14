import { beforeEach, describe, expect, it } from 'vitest'
import type { ProgressRecord } from '../../lib/api/contracts'
import { createInMemoryAchievementRepository } from '../testing/inMemoryAchievementRepository'
import {
  createAchievementService,
  determineNewlyEarnedSlugs,
  type AchievementService,
} from './achievementService'

const FRONTEND_LESSON_IDS = [
  'lesson-flexbox-factory',
  'lesson-event-bubbling-bubbles',
  'lesson-render-rescue',
  'lesson-state-mutation-garden',
  'lesson-accessibility-signal-path',
]

function progress(
  lessonId: string,
  masteryState: ProgressRecord['masteryState'],
): ProgressRecord {
  return {
    lessonId,
    masteryState,
    bestScore: 100,
    attempts: 1,
    completedAt: '2026-07-13T10:00:00.000Z',
    lastPlayedAt: '2026-07-13T10:00:00.000Z',
    lessonVersion: 1,
  }
}

describe('determineNewlyEarnedSlugs', () => {
  it('awards first-completion once any lesson reaches applied or beyond', () => {
    const slugs = determineNewlyEarnedSlugs({
      allProgress: [progress('lesson-x', 'applied')],
      streakCurrentDays: 0,
      alreadyEarnedSlugs: new Set(),
    })

    expect(slugs).toContain('first-completion')
  })

  it('does not re-award first-completion once already earned', () => {
    const slugs = determineNewlyEarnedSlugs({
      allProgress: [progress('lesson-x', 'applied')],
      streakCurrentDays: 0,
      alreadyEarnedSlugs: new Set(['first-completion']),
    })

    expect(slugs).not.toContain('first-completion')
  })

  it('awards three-day-streak once the streak reaches 3 days', () => {
    const slugs = determineNewlyEarnedSlugs({
      allProgress: [],
      streakCurrentDays: 3,
      alreadyEarnedSlugs: new Set(),
    })

    expect(slugs).toContain('three-day-streak')
  })

  it('does not award three-day-streak below 3 days', () => {
    const slugs = determineNewlyEarnedSlugs({
      allProgress: [],
      streakCurrentDays: 2,
      alreadyEarnedSlugs: new Set(),
    })

    expect(slugs).not.toContain('three-day-streak')
  })

  it('awards track-mastered once every lesson in a track is mastered', () => {
    const allProgress = FRONTEND_LESSON_IDS.map((lessonId) =>
      progress(lessonId, 'mastered'),
    )

    const slugs = determineNewlyEarnedSlugs({
      allProgress,
      streakCurrentDays: 0,
      alreadyEarnedSlugs: new Set(),
    })

    expect(slugs).toContain('track-mastered')
  })

  it('does not award track-mastered while any lesson in the track is unmastered', () => {
    const allProgress = FRONTEND_LESSON_IDS.map((lessonId, index) =>
      progress(lessonId, index === 0 ? 'applied' : 'mastered'),
    )

    const slugs = determineNewlyEarnedSlugs({
      allProgress,
      streakCurrentDays: 0,
      alreadyEarnedSlugs: new Set(),
    })

    expect(slugs).not.toContain('track-mastered')
  })
})

describe('createAchievementService', () => {
  let service: AchievementService

  beforeEach(() => {
    service = createAchievementService(createInMemoryAchievementRepository())
  })

  it('awards the first-completion achievement exactly once', async () => {
    const input = {
      allProgress: [progress('lesson-x', 'applied')],
      streakCurrentDays: 0,
    }

    const first = await service.evaluateAndAward('user-1', input)
    const second = await service.evaluateAndAward('user-1', input)

    expect(first.map((achievement) => achievement.slug)).toEqual([
      'first-completion',
    ])
    expect(second).toEqual([])

    const earned = await service.listEarned('user-1')
    expect(earned).toHaveLength(1)
    expect(earned[0].slug).toBe('first-completion')
  })

  it('scopes earned achievements per user', async () => {
    await service.evaluateAndAward('user-1', {
      allProgress: [progress('lesson-x', 'applied')],
      streakCurrentDays: 0,
    })

    expect(await service.listEarned('user-2')).toEqual([])
  })
})
