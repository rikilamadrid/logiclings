# Feature Spec: Streak Tracking

## Status

Not Started

## Overview

Add timezone-aware streak calculation on top of the persisted progress/attempt
data from feature 06, surfaced on Home as the streak indicator described in
`context/project-overview.md`.

## Problem

Progress persists, but there is no notion of daily engagement/streaks yet, and
Home's streak section (feature 03) is still a static placeholder.

## Goal

A learner who completes at least one qualifying lesson/attempt on a given day
(in their own timezone) sees their current streak count increment on Home, and
the streak resets appropriately when a day is missed.

## Requirements

- `Streak` model per Core Data Models in `context/project-overview.md`:
  `currentDays`, `longestDays`, `lastQualifiedDate`, `timezone`.
- Streak service in `src/server/services` that:
  - determines whether a completed attempt qualifies the current day, using the
    user's stored timezone (not server/UTC time),
  - increments `currentDays` on a new qualifying day directly following the last
    qualified date, resets to 1 if a day was missed, and updates `longestDays` accordingly.
- Timezone captured/stored for the user (from browser at sign-up/first play, or
  a settings field) and used consistently for all streak-date math.
- API endpoint(s) to read the current streak and to record a qualifying event
  (likely triggered as part of the completion mutation from feature 06, not a
  separate user action).
- Home's streak section (feature 03 placeholder) wired to real streak data via
  TanStack Query.
- Basic streak micro-reaction on qualifying (visual + optional sound cue,
  reusing the audio service from feature 05) — no need for new sound assets
  beyond what already exists unless a "streak" cue is missing, in which case add it.

## Out Of Scope

- Achievements/badges beyond the streak count itself (that's part of Profile, feature 08).
- Streak-freeze/grace-day mechanics or any monetized streak-saving feature.
- Push notifications or reminders about at-risk streaks.
- Full Profile/Progress screen layout (feature 08) — only Home's streak indicator is in scope here.

## UX Notes

- Streak update should feel like a small delightful moment (per Motion/Sound
  rules: CSS transitions, optional sound, no required motion to understand the result).
- Must be understandable without sound or motion (a numeric streak count is
  sufficient as the accessible baseline).
- No dark patterns around streak loss — keep messaging encouraging, not guilt-inducing, per the "friendly" product goal.

## Technical Notes

Likely files:

- `prisma/schema.prisma` (add `Streak` model + migration)
- `src/server/services/streakService.ts`
- `src/server/routes/streak.ts` / `api/streak/*.ts`
- `src/features/streaks/useStreak.ts` (TanStack Query hook)
- `src/app/routes/Home.tsx` (wire real data)

Implementation notes:

- Follow `context/coding-standards.md` server rules: streak service is a domain
  service, not logic embedded in a route handler.
- Timezone correctness is the core risk here — write focused unit tests around
  date-boundary edge cases (midnight rollover, DST transitions) rather than
  relying on manual QA alone.

## Acceptance Criteria

- Completing a qualifying attempt increments the streak correctly for the user's timezone.
- Missing a day resets `currentDays` to 1 on the next qualifying day while preserving `longestDays`.
- Home displays the real current streak for a signed-in user.
- Unit tests cover streak increment, reset, and longest-streak logic across
  timezone/date-boundary edge cases.
- `npm run build` passes.
- `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

- Manual: complete a lesson, confirm streak shows 1; simulate (via test data or
  manipulated system date in a test environment) a next-day completion and confirm increment to 2; simulate a missed day and confirm reset to 1.
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

## References

- `context/project-overview.md` (Core Data Models, Authentication and Progress sections)
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`
- `context/features/06-auth-persistent-progress.md`

## Suggested Branch

`feature/07-streak-tracking`

## Suggested Commit

`feat: add timezone-aware streak tracking`
