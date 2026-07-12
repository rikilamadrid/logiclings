# Feature Spec: Profile and Progress Screen

## Status

Not Started

## Overview

Build the real Profile screen: completed games, track mastery, streak calendar,
and achievements — replacing the feature-03 skeleton with a page backed by real
progress/streak data.

## Problem

Profile is currently an empty skeleton route. Learners have no way to see a
summary of what they've completed, their mastery per track, or their streak history.

## Goal

A signed-in user visiting `/profile` sees their completed lessons, per-track
mastery state, a streak calendar/summary, and any achievements earned so far.

## Requirements

- `Achievement` model per Core Data Models in `context/project-overview.md`
  (`slug`, `title`, `description`, `iconKey`); seed a small starter set (e.g.,
  "first completion," "3-day streak," "track mastered").
- Achievement-award logic: a service that evaluates whether a completed
  attempt/streak update should award a new achievement, triggered from the
  completion/streak flows (features 06/07) rather than polled.
- Profile page sections:
  - Completed lessons list (from `UserProgress`)
  - Per-track mastery summary (derived from `UserProgress.masteryState` grouped by track)
  - Streak calendar or summary view (from `Streak`, feature 07)
  - Achievements grid (earned vs. locked, using the mascot/badge visual system)
- Empty states for a brand-new user with no completions yet (encouraging, not blank/broken-looking).
- API endpoint(s) to fetch the aggregated profile data for the current user (or
  compose from existing progress/streak endpoints if that's simpler and equally
  performant — decide based on query cost, not by default fetching N+1).

## Out Of Scope

- Settings screen functionality (sound/haptics/motion/theme/account toggles) —
  that can be a fast-follow but is not required by this spec unless the user
  asks to fold it in.
- Saved/favorite lessons (mentioned in the product surfaces list but not
  required for MVP profile — confirm before adding).
- Social/shareable profile pages.
- Achievement icon artwork beyond simple placeholders if final mascot variants aren't ready.

## UX Notes

- Mobile-first layout; sections should stack sensibly and remain scannable on a small screen.
- Locked achievements must be visually distinct but not discouraging (e.g., silhouette + label, not fully invisible).
- Streak calendar must be understandable without color alone (use icon/text alongside color for qualifying days).
- All data-loading states (loading/error/empty) must be handled, not just the happy path.

## Technical Notes

Likely files:

- `prisma/schema.prisma` (add `Achievement` + user-achievement join model, migration)
- `src/server/services/achievementService.ts`
- `src/server/routes/profile.ts` / `api/profile/*.ts`
- `src/features/progress/ProfilePage.tsx`
- `src/components/organisms/AchievementGrid/...`, `StreakCalendar/...`
- `src/features/progress/useProfile.ts` (TanStack Query hook)

Implementation notes:

- Follow `context/coding-standards.md` server rules (service layer, session
  ownership checks on the profile endpoint).
- Reuse primitives/tokens from feature 02 for badges, cards, and grid layout —
  do not introduce new one-off components where an existing primitive fits.

## Acceptance Criteria

- Profile renders real completed-lesson, mastery, streak, and achievement data
  for the signed-in user.
- A brand-new user sees appropriate empty states, not errors or blank sections.
- Achievement awarding is covered by unit tests (e.g., first completion awards
  the "first completion" achievement exactly once).
- Storybook stories cover populated and empty states for the profile sections.
- `npm run build` passes.
- `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

- Manual: new-account walkthrough (empty states) then complete a lesson and
  confirm profile updates (completed lesson, mastery, achievement if applicable).
- Mobile, tablet, desktop viewport checks.
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run build-storybook`

## References

- `context/project-overview.md` (Core Product Idea → Profile and Progress, Core Data Models sections)
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`
- `context/features/06-auth-persistent-progress.md`
- `context/features/07-streak-tracking.md`

## Suggested Branch

`feature/08-profile-progress-screen`

## Suggested Commit

`feat: add profile and progress screen`
