import { describe, expect, it } from 'vitest'
import { deriveLessonState } from './deriveLessonState'
import type { Lesson, MasteryState } from './schemas/lesson'

function makeLesson(overrides: Partial<Lesson>): Lesson {
  return {
    id: 'lesson-a',
    trackId: 'track-frontend',
    slug: 'lesson-a',
    title: 'Lesson A',
    summary: 'Summary',
    learningObjective: 'Objective',
    misconception: 'Misconception',
    estimatedMinutes: 5,
    difficulty: 1,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: [],
    ...overrides,
  }
}

describe('deriveLessonState', () => {
  it('is available when there are no prerequisites', () => {
    const lesson = makeLesson({ prerequisiteLessonIds: [] })
    const mastery = new Map<string, MasteryState>()

    expect(deriveLessonState(lesson, mastery)).toBe('available')
  })

  it('is locked when a prerequisite is not started', () => {
    const lesson = makeLesson({ prerequisiteLessonIds: ['lesson-prereq'] })
    const mastery = new Map<string, MasteryState>()

    expect(deriveLessonState(lesson, mastery)).toBe('locked')
  })

  it('is locked when a prerequisite is only discovering', () => {
    const lesson = makeLesson({ prerequisiteLessonIds: ['lesson-prereq'] })
    const mastery = new Map<string, MasteryState>([
      ['lesson-prereq', 'discovering'],
    ])

    expect(deriveLessonState(lesson, mastery)).toBe('locked')
  })

  it('is available when every prerequisite is applied or mastered', () => {
    const lesson = makeLesson({
      prerequisiteLessonIds: ['lesson-prereq-1', 'lesson-prereq-2'],
    })
    const mastery = new Map<string, MasteryState>([
      ['lesson-prereq-1', 'applied'],
      ['lesson-prereq-2', 'mastered'],
    ])

    expect(deriveLessonState(lesson, mastery)).toBe('available')
  })

  it('is locked when only some prerequisites are met', () => {
    const lesson = makeLesson({
      prerequisiteLessonIds: ['lesson-prereq-1', 'lesson-prereq-2'],
    })
    const mastery = new Map<string, MasteryState>([
      ['lesson-prereq-1', 'mastered'],
    ])

    expect(deriveLessonState(lesson, mastery)).toBe('locked')
  })

  it('is completed when the lesson itself is applied or mastered, regardless of prerequisites', () => {
    const lesson = makeLesson({
      id: 'lesson-b',
      prerequisiteLessonIds: ['lesson-prereq'],
    })
    const mastery = new Map<string, MasteryState>([['lesson-b', 'mastered']])

    expect(deriveLessonState(lesson, mastery)).toBe('completed')
  })
})
