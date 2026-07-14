import type { MasteryState } from './schemas/lesson'
import type { Lesson } from './schemas/lesson'

export type LessonState = 'locked' | 'available' | 'completed'

const completedMasteryStates: MasteryState[] = ['applied', 'mastered']

/** A lesson counts as completed in the catalog once mastery reaches `applied`. */
export function isCompletedMastery(mastery: MasteryState): boolean {
  return completedMasteryStates.includes(mastery)
}

export function deriveLessonState(
  lesson: Lesson,
  masteryByLessonId: ReadonlyMap<string, MasteryState>,
): LessonState {
  const ownMastery = masteryByLessonId.get(lesson.id) ?? 'not_started'
  if (completedMasteryStates.includes(ownMastery)) {
    return 'completed'
  }

  const prerequisitesMet = lesson.prerequisiteLessonIds.every((id) => {
    const mastery = masteryByLessonId.get(id) ?? 'not_started'
    return completedMasteryStates.includes(mastery)
  })

  return prerequisitesMet ? 'available' : 'locked'
}
