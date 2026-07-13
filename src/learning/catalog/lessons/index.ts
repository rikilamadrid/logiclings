import type { Lesson } from '../../schemas/lesson'
import { tracks } from '../tracks'
import { agenticCodingLessons } from './agentic-coding'
import { frontendLessons } from './frontend'
import { systemDesignLessons } from './system-design'

export const lessons: Lesson[] = [
  ...frontendLessons,
  ...systemDesignLessons,
  ...agenticCodingLessons,
]

const trackIds = new Set(tracks.map((track) => track.id))
const lessonIds = new Set(lessons.map((lesson) => lesson.id))

for (const lesson of lessons) {
  if (!trackIds.has(lesson.trackId)) {
    throw new Error(
      `Lesson "${lesson.id}" references unknown trackId "${lesson.trackId}"`,
    )
  }

  for (const prerequisiteId of lesson.prerequisiteLessonIds) {
    if (!lessonIds.has(prerequisiteId)) {
      throw new Error(
        `Lesson "${lesson.id}" references unknown prerequisite "${prerequisiteId}"`,
      )
    }
  }
}

export function getLessonsForTrack(trackId: string): Lesson[] {
  return lessons.filter((lesson) => lesson.trackId === trackId)
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug)
}
