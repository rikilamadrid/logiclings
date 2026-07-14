import { useMemo } from 'react'
import { useAchievementsQuery } from '../achievements/queries'
import type {
  AchievementRecord,
  ProgressRecord,
  StreakRecord,
} from '../../lib/api/contracts'
import { isCompletedMastery } from '../../learning/deriveLessonState'
import type { Lesson } from '../../learning/schemas/lesson'
import type { Track } from '../../learning/schemas/track'
import { useLessonsQuery, useTracksQuery } from '../../learning/queries'
import { useMasteryByLessonId, useProgressQuery } from '../progress/queries'
import { useStreakQuery } from '../streaks/queries'

export interface TrackMasterySummary {
  track: Track
  lessonCount: number
  masteredCount: number
  completedCount: number
}

export interface CompletedLesson {
  lesson: Lesson
  progress: ProgressRecord
}

export interface ProfileData {
  isSignedIn: boolean
  isLoading: boolean
  isError: boolean
  completedLessons: CompletedLesson[]
  trackSummaries: TrackMasterySummary[]
  streak: StreakRecord | undefined
  achievements: AchievementRecord[]
}

/**
 * Composes the profile screen's four sections from the existing progress,
 * streak, achievement, and catalog queries rather than a bespoke aggregation
 * endpoint — each already fetches efficiently for the signed-in user, and the
 * joins here (progress × catalog) are cheap, in-memory, and small (one
 * learner's rows against a fixed local catalog).
 */
export function useProfile(): ProfileData {
  const progressQuery = useProgressQuery()
  const { masteryByLessonId } = useMasteryByLessonId()
  const streakQuery = useStreakQuery()
  const achievementsQuery = useAchievementsQuery()
  const tracksQuery = useTracksQuery()
  const lessonsQuery = useLessonsQuery()

  const isLoading =
    progressQuery.isLoading ||
    streakQuery.isLoading ||
    achievementsQuery.isLoading ||
    tracksQuery.isLoading ||
    lessonsQuery.isLoading

  const isError =
    progressQuery.isError || streakQuery.isError || achievementsQuery.isError

  const progressByLessonId = useMemo(() => {
    const map = new Map<string, ProgressRecord>()
    for (const record of progressQuery.data ?? []) {
      map.set(record.lessonId, record)
    }
    return map
  }, [progressQuery.data])

  const completedLessons = useMemo<CompletedLesson[]>(() => {
    const lessons = lessonsQuery.data ?? []
    return lessons
      .map((lesson) => {
        const progress = progressByLessonId.get(lesson.id)
        return progress && isCompletedMastery(progress.masteryState)
          ? { lesson, progress }
          : null
      })
      .filter((entry): entry is CompletedLesson => entry !== null)
      .sort((a, b) => {
        const aDate = a.progress.completedAt ?? ''
        const bDate = b.progress.completedAt ?? ''
        return bDate.localeCompare(aDate)
      })
  }, [lessonsQuery.data, progressByLessonId])

  const trackSummaries = useMemo<TrackMasterySummary[]>(() => {
    const tracks = tracksQuery.data ?? []
    const lessons = lessonsQuery.data ?? []

    return tracks.map((track) => {
      const trackLessons = lessons.filter((lesson) => lesson.trackId === track.id)
      const masteredCount = trackLessons.filter(
        (lesson) => masteryByLessonId.get(lesson.id) === 'mastered',
      ).length
      const completedCount = trackLessons.filter((lesson) => {
        const mastery = masteryByLessonId.get(lesson.id)
        return mastery !== undefined && isCompletedMastery(mastery)
      }).length

      return {
        track,
        lessonCount: trackLessons.length,
        masteredCount,
        completedCount,
      }
    })
  }, [tracksQuery.data, lessonsQuery.data, masteryByLessonId])

  return {
    isSignedIn: progressQuery.isSignedIn,
    isLoading,
    isError,
    completedLessons,
    trackSummaries,
    streak: streakQuery.data,
    achievements: achievementsQuery.data ?? [],
  }
}
