import type { StreakRecord } from '../../lib/api/contracts'
import type { StreakRepository, StreakSnapshot } from '../db/streakRepository'

/**
 * Streak domain service. Pure date math, no Prisma — the interesting decision
 * (does this qualify today, or extend/reset the streak?) is testable on its
 * own against fixed instants, independent of the database.
 *
 * Streak dates are compared as local calendar days, not instants: an instant
 * is resolved to a `YYYY-MM-DD` string in the learner's timezone once, and
 * every later comparison is calendar arithmetic on that string. This keeps
 * DST transitions out of the comparison entirely — a day is "the next day"
 * because its date string is one calendar day later, never because 24 hours
 * of wall-clock time passed.
 */

const NO_STREAK: StreakSnapshot = {
  currentDays: 0,
  longestDays: 0,
  lastQualifiedDate: null,
  timezone: 'UTC',
}

/** The calendar date (`YYYY-MM-DD`) `instant` falls on on in `timezone`. */
export function localDateString(instant: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant)
}

function addCalendarDays(dateString: string, days: number): string {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export interface QualifyOutcome {
  streak: StreakSnapshot
  /** True when this call moved the streak forward to a new qualifying day. */
  justQualified: boolean
}

/**
 * Applies a qualifying event (a completed attempt) at `instant`, in the
 * learner's `timezone`, to their current streak.
 *
 * - Same local day as last time: no change (already qualified today).
 * - The local day directly after `lastQualifiedDate`: increments `currentDays`.
 * - Any other day (first time, or a day was missed): resets `currentDays` to 1.
 *
 * `longestDays` only ever grows. `timezone` is always updated to the one just
 * observed, so a learner who changes timezones keeps qualifying against where
 * they actually are now.
 */
export function qualify(
  current: StreakSnapshot,
  instant: Date,
  timezone: string,
): QualifyOutcome {
  const today = localDateString(instant, timezone)

  if (current.lastQualifiedDate === today) {
    return { streak: { ...current, timezone }, justQualified: false }
  }

  const isConsecutiveDay =
    current.lastQualifiedDate !== null &&
    addCalendarDays(current.lastQualifiedDate, 1) === today

  const currentDays = isConsecutiveDay ? current.currentDays + 1 : 1
  const longestDays = Math.max(current.longestDays, currentDays)

  return {
    streak: { currentDays, longestDays, lastQualifiedDate: today, timezone },
    justQualified: true,
  }
}

function toStreakRecord(snapshot: StreakSnapshot): StreakRecord {
  return snapshot
}

export interface StreakService {
  getStreak(userId: string): Promise<StreakRecord>
  recordQualifyingEvent(
    userId: string,
    instant: Date,
    timezone: string,
  ): Promise<{ streak: StreakRecord; streakQualified: boolean }>
}

export function createStreakService(
  repository: StreakRepository,
): StreakService {
  return {
    async getStreak(userId) {
      const snapshot = await repository.getStreak(userId)
      return toStreakRecord(snapshot ?? NO_STREAK)
    },

    async recordQualifyingEvent(userId, instant, timezone) {
      const { streak, justQualified } = await repository.qualify(
        userId,
        (current) => qualify(current ?? NO_STREAK, instant, timezone),
      )

      return { streak: toStreakRecord(streak), streakQualified: justQualified }
    },
  }
}
