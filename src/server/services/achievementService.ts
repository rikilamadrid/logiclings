import { achievementCatalog } from '../../achievements/catalog/achievements'
import type { AchievementSlug } from '../../achievements/schemas/achievement'
import { lessons, getLessonsForTrack } from '../../learning/catalog/lessons'
import type { AchievementRecord, ProgressRecord } from '../../lib/api/contracts'
import type { AchievementRepository } from '../db/achievementRepository'
import { isCompletedMastery } from './mastery'

/**
 * Achievement award rules. Pure and Prisma-free — given the learner's full
 * progress list and current streak, decide which not-yet-earned achievements
 * now qualify. Triggered from the completion flow (`progressService`), never
 * polled.
 */

const lessonTrackId = new Map(lessons.map((lesson) => [lesson.id, lesson.trackId]))

function isTrackMastered(trackId: string, progressByLessonId: Map<string, ProgressRecord>): boolean {
  const trackLessons = getLessonsForTrack(trackId)
  if (trackLessons.length === 0) return false

  return trackLessons.every(
    (lesson) => progressByLessonId.get(lesson.id)?.masteryState === 'mastered',
  )
}

export interface AchievementEvaluationInput {
  allProgress: ProgressRecord[]
  streakCurrentDays: number
  alreadyEarnedSlugs: Set<AchievementSlug>
}

/** The achievement slugs newly qualified by this evaluation, in a fixed order. */
export function determineNewlyEarnedSlugs(
  input: AchievementEvaluationInput,
): AchievementSlug[] {
  const { allProgress, streakCurrentDays, alreadyEarnedSlugs } = input
  const newlyEarned: AchievementSlug[] = []

  const hasCompletedLesson = allProgress.some((progress) =>
    isCompletedMastery(progress.masteryState),
  )
  if (hasCompletedLesson && !alreadyEarnedSlugs.has('first-completion')) {
    newlyEarned.push('first-completion')
  }

  if (streakCurrentDays >= 3 && !alreadyEarnedSlugs.has('three-day-streak')) {
    newlyEarned.push('three-day-streak')
  }

  if (!alreadyEarnedSlugs.has('track-mastered')) {
    const progressByLessonId = new Map(
      allProgress.map((progress) => [progress.lessonId, progress]),
    )
    const trackIds = new Set(
      allProgress
        .map((progress) => lessonTrackId.get(progress.lessonId))
        .filter((trackId): trackId is string => Boolean(trackId)),
    )
    const anyTrackMastered = [...trackIds].some((trackId) =>
      isTrackMastered(trackId, progressByLessonId),
    )
    if (anyTrackMastered) {
      newlyEarned.push('track-mastered')
    }
  }

  return newlyEarned
}

export interface AchievementService {
  listEarned(userId: string): Promise<AchievementRecord[]>
  /**
   * Evaluates the learner's full progress/streak state and awards any
   * newly-qualified achievements. Returns just the ones awarded by this call.
   */
  evaluateAndAward(
    userId: string,
    input: { allProgress: ProgressRecord[]; streakCurrentDays: number },
  ): Promise<AchievementRecord[]>
}

function toRecord(
  achievement: { slug: AchievementSlug; title: string; description: string; iconKey: string },
  earnedAt: string,
): AchievementRecord {
  return { ...achievement, earnedAt }
}

export function createAchievementService(
  repository: AchievementRepository,
): AchievementService {
  return {
    async listEarned(userId) {
      const earned = await repository.listEarned(userId)
      return earned.map((entry) => toRecord(entry.achievement, entry.earnedAt))
    },

    async evaluateAndAward(userId, { allProgress, streakCurrentDays }) {
      const earned = await repository.listEarned(userId)
      const alreadyEarnedSlugs = new Set(earned.map((entry) => entry.achievement.slug))

      const newlyEarnedSlugs = determineNewlyEarnedSlugs({
        allProgress,
        streakCurrentDays,
        alreadyEarnedSlugs,
      })

      const awarded: AchievementRecord[] = []
      for (const slug of newlyEarnedSlugs) {
        const definition = achievementCatalog.find((entry) => entry.slug === slug)
        if (!definition) continue

        const result = await repository.award(userId, definition)
        if (result.awarded) {
          awarded.push(toRecord(definition, result.earnedAt))
        }
      }

      return awarded
    },
  }
}

export { achievementCatalog }
