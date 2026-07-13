import { describe, expect, it } from 'vitest'
import { lessonSchema } from '../schemas/lesson'
import { trackSchema } from '../schemas/track'
import { lessons } from './lessons'
import { tracks } from './tracks'

describe('catalog data', () => {
  it('validates every track against the track schema', () => {
    for (const track of tracks) {
      expect(() => trackSchema.parse(track)).not.toThrow()
    }
  })

  it('validates every lesson against the lesson schema', () => {
    for (const lesson of lessons) {
      expect(() => lessonSchema.parse(lesson)).not.toThrow()
    }
  })

  it('rejects a track with an invalid slug', () => {
    expect(() =>
      trackSchema.parse({
        id: 'track-invalid',
        slug: 'not-a-real-track',
        title: 'Invalid',
        summary: 'Invalid track',
        order: 0,
        iconKey: 'invalid',
        accentToken: '--color-track-invalid',
      }),
    ).toThrow()
  })

  it('rejects a lesson with an out-of-range difficulty', () => {
    expect(() =>
      lessonSchema.parse({
        id: 'lesson-invalid',
        trackId: 'track-frontend',
        slug: 'invalid',
        title: 'Invalid',
        summary: 'Invalid lesson',
        learningObjective: 'N/A',
        misconception: 'N/A',
        estimatedMinutes: 5,
        difficulty: 4,
        version: 1,
        status: 'published',
        prerequisiteLessonIds: [],
      }),
    ).toThrow()
  })

  it('has every lesson reference a track that exists', () => {
    const trackIds = new Set(tracks.map((track) => track.id))
    for (const lesson of lessons) {
      expect(trackIds.has(lesson.trackId)).toBe(true)
    }
  })

  it('has every lesson prerequisite reference a lesson that exists', () => {
    const lessonIds = new Set(lessons.map((lesson) => lesson.id))
    for (const lesson of lessons) {
      for (const prerequisiteId of lesson.prerequisiteLessonIds) {
        expect(lessonIds.has(prerequisiteId)).toBe(true)
      }
    }
  })
})
