import { describe, expect, it } from 'vitest'
import { localDateString, qualify } from './streakService'
import type { StreakSnapshot } from '../db/streakRepository'

const NO_STREAK: StreakSnapshot = {
  currentDays: 0,
  longestDays: 0,
  lastQualifiedDate: null,
  timezone: 'UTC',
}

describe('localDateString', () => {
  it('resolves an instant to the calendar date in the given timezone', () => {
    // 11pm UTC on the 13th is already the 14th in Auckland.
    expect(localDateString(new Date('2026-07-13T23:00:00.000Z'), 'UTC')).toBe(
      '2026-07-13',
    )
    expect(
      localDateString(
        new Date('2026-07-13T23:00:00.000Z'),
        'Pacific/Auckland',
      ),
    ).toBe('2026-07-14')
  })

  it('resolves the day before midnight UTC for a negative-offset timezone', () => {
    // 2am UTC on the 14th is still the 13th in New York (UTC-4/5).
    expect(
      localDateString(new Date('2026-07-14T02:00:00.000Z'), 'America/New_York'),
    ).toBe('2026-07-13')
  })
})

describe('qualify', () => {
  it('starts a 1-day streak on the first qualifying event', () => {
    const { streak, justQualified } = qualify(
      NO_STREAK,
      new Date('2026-07-13T10:00:00.000Z'),
      'UTC',
    )

    expect(justQualified).toBe(true)
    expect(streak).toEqual({
      currentDays: 1,
      longestDays: 1,
      lastQualifiedDate: '2026-07-13',
      timezone: 'UTC',
    })
  })

  it('does not change the streak twice on the same local day', () => {
    const first = qualify(
      NO_STREAK,
      new Date('2026-07-13T10:00:00.000Z'),
      'UTC',
    )
    const second = qualify(
      first.streak,
      new Date('2026-07-13T22:00:00.000Z'),
      'UTC',
    )

    expect(second.justQualified).toBe(false)
    expect(second.streak).toEqual(first.streak)
  })

  it('increments the streak on the local day directly after the last one', () => {
    const day1 = qualify(
      NO_STREAK,
      new Date('2026-07-13T10:00:00.000Z'),
      'UTC',
    )
    const day2 = qualify(
      day1.streak,
      new Date('2026-07-14T10:00:00.000Z'),
      'UTC',
    )

    expect(day2.justQualified).toBe(true)
    expect(day2.streak.currentDays).toBe(2)
    expect(day2.streak.longestDays).toBe(2)
  })

  it('resets to 1 when a day is missed, while keeping the longest streak', () => {
    const day1 = qualify(
      NO_STREAK,
      new Date('2026-07-13T10:00:00.000Z'),
      'UTC',
    )
    const day2 = qualify(
      day1.streak,
      new Date('2026-07-14T10:00:00.000Z'),
      'UTC',
    )
    // Day 15 is skipped entirely; the next event is on the 16th.
    const day4 = qualify(
      day2.streak,
      new Date('2026-07-16T10:00:00.000Z'),
      'UTC',
    )

    expect(day4.justQualified).toBe(true)
    expect(day4.streak.currentDays).toBe(1)
    expect(day4.streak.longestDays).toBe(2)
  })

  it('extends a streak across a spring-forward DST transition', () => {
    // America/New_York springs forward on 2026-03-08.
    const beforeDst = qualify(
      NO_STREAK,
      new Date('2026-03-07T12:00:00.000Z'),
      'America/New_York',
    )
    const afterDst = qualify(
      beforeDst.streak,
      new Date('2026-03-08T12:00:00.000Z'),
      'America/New_York',
    )

    expect(afterDst.justQualified).toBe(true)
    expect(afterDst.streak.currentDays).toBe(2)
  })

  it('extends a streak across a fall-back DST transition', () => {
    // America/New_York falls back on 2026-11-01.
    const beforeDst = qualify(
      NO_STREAK,
      new Date('2026-10-31T12:00:00.000Z'),
      'America/New_York',
    )
    const afterDst = qualify(
      beforeDst.streak,
      new Date('2026-11-01T12:00:00.000Z'),
      'America/New_York',
    )

    expect(afterDst.justQualified).toBe(true)
    expect(afterDst.streak.currentDays).toBe(2)
  })

  it('qualifies near local midnight without crediting the wrong day', () => {
    // New York is on EDT (UTC-4) in July, so local midnight on the 14th falls
    // at 04:00 UTC. 03:59 UTC is still 11:59pm on the 13th, local.
    const lateNight = qualify(
      NO_STREAK,
      new Date('2026-07-14T03:59:00.000Z'),
      'America/New_York',
    )
    expect(lateNight.streak.lastQualifiedDate).toBe('2026-07-13')

    // 04:01 UTC has just become the 14th in New York — a new day.
    const justAfterMidnight = qualify(
      lateNight.streak,
      new Date('2026-07-14T04:01:00.000Z'),
      'America/New_York',
    )
    expect(justAfterMidnight.justQualified).toBe(true)
    expect(justAfterMidnight.streak.currentDays).toBe(2)
  })

  it('updates the stored timezone to the one just observed', () => {
    const first = qualify(
      NO_STREAK,
      new Date('2026-07-13T10:00:00.000Z'),
      'America/New_York',
    )
    const second = qualify(
      first.streak,
      new Date('2026-07-14T10:00:00.000Z'),
      'Pacific/Auckland',
    )

    expect(second.streak.timezone).toBe('Pacific/Auckland')
  })
})
