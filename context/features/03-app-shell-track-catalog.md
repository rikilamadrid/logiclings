# Feature Spec: App Shell, Navigation, and Track/Lesson Catalog

## Status

Not Started

## Overview

Build the real mobile-first app shell (navigation, layout, providers) and the
typed learning catalog: tracks and lessons as version-controlled local data,
rendered through Home, Track Map, and lesson-list surfaces. Profile and Settings
get skeleton pages; real content lands in later features.

## Problem

The app currently has placeholder routes and no navigation chrome, and there is
no typed model for tracks/lessons — every later feature (runtime, games, progress)
depends on this catalog existing first.

## Goal

A user can open the app, see Home with placeholder daily-challenge/streak/continue
sections, browse `/tracks`, open a track to see its lesson list with locked/available/
completed states (progress not yet persisted), and navigate via mobile-first nav
to Profile and Settings skeleton screens.

## Requirements

- App shell: global navigation (mobile bottom nav or equivalent + desktop
  enhancement), providers (TanStack Query client, theme, future auth placeholder),
  error boundary, and layout composition in `src/app`.
- Typed learning catalog in `src/learning`: `Track`, `Lesson` types per
  `context/project-overview.md` data models, defined as local version-controlled
  data (e.g. `src/learning/catalog/tracks.ts`, `lessons/*.ts`) validated with Zod schemas.
- Seed catalog data for at least the Frontend, System Design, and Agentic Coding
  tracks (enough to represent the three MVP mini-games), with realistic lesson
  metadata (title, summary, learningObjective, misconception, estimatedMinutes,
  difficulty, prerequisites).
- `/tracks` route: list all tracks with accent color, summary, and progress
  placeholder (no real progress yet — treat all as `not_started`).
- `/tracks/:trackSlug` route: track detail with its lessons in order, showing
  locked/available states derived from `prerequisiteLessonIds` (static, no persisted mastery yet).
- Home (`/`) route: continue-learning placeholder, daily-challenge placeholder,
  streak placeholder, recommended-next placeholder — static/derived from catalog,
  not from real user data.
- Profile (`/profile`) and Settings (`/settings`) as navigable skeleton pages
  (structure and layout only, real content in features 06–08).

## Out Of Scope

- Mini-game runtime and any playable game (features 04, 05, 09, 10).
- Authentication, persisted progress, streak calculation (features 06, 07).
- Real profile/progress/settings functionality (features 06–08).
- Daily challenge selection logic beyond a static placeholder.

## UX Notes

- Mobile-first navigation pattern; verify usability at ~375px before enhancing for tablet/desktop.
- Locked lesson states must be visually and semantically distinct (not color-only).
- Keyboard and screen-reader navigable: semantic nav landmarks, labeled links, visible focus.
- Use primitives and tokens from feature 02; no new one-off styling patterns.

## Technical Notes

Likely files:

- `src/app/providers/QueryProvider.tsx`, `src/app/providers/AppProviders.tsx`
- `src/app/routes/Home.tsx`, `TrackMap.tsx`, `TrackDetail.tsx`, `Profile.tsx`, `Settings.tsx`
- `src/components/organisms/NavBar/...`, `src/components/templates/AppShell/...`
- `src/learning/schemas/track.ts`, `src/learning/schemas/lesson.ts`
- `src/learning/catalog/tracks.ts`, `src/learning/catalog/lessons/*.ts`

Implementation notes:

- Follow `context/coding-standards.md` for data-driven UI and file organization.
- Keep catalog data separate from presentation components.
- Use TanStack Query to read catalog data even though it's local for now, so the
  data-fetching seam is already in place when the API-backed version lands in feature 06.

## Acceptance Criteria

- Nav reaches Home, Tracks, Track Detail, Profile, Settings on mobile and desktop widths.
- Track/lesson data is typed and Zod-validated; invalid catalog data fails at build/test time.
- Locked/available lesson states render correctly based on static prerequisites.
- Storybook stories for NavBar, AppShell/layout, and track/lesson list items.
- Tests cover catalog schema validation and locked/available derivation logic.
- `npm run build` passes.
- `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

- Manual: navigate the full route set at mobile (~375px), tablet, and desktop widths.
- Keyboard-only navigation through nav and track/lesson lists.
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run build-storybook`

## References

- `context/project-overview.md` (Core Product Idea, Routing, Core Data Models sections)
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`

## Suggested Branch

`feature/03-app-shell-track-catalog`

## Suggested Commit

`feat: add app shell navigation and track/lesson catalog`
