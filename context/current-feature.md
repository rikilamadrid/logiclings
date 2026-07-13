# Current Feature: App Shell, Navigation, and Track/Lesson Catalog

Use this file as the live tracker for what is active now. Keep it lean. When a
feature lands, summarize the completed work in `context/history.md` and move
this file forward to the next task.

Branch: `feature/03-app-shell-track-catalog`

## Status

In Progress

## Goals

- App shell with global navigation (mobile bottom nav + desktop enhancement),
  providers (TanStack Query, theme, future auth placeholder), error boundary,
  and layout composition in `src/app`.
- Typed learning catalog in `src/learning`: `Track` and `Lesson` types, Zod-validated,
  as local version-controlled data (`src/learning/catalog/tracks.ts`, `lessons/*.ts`).
- Seed catalog data for Frontend, System Design, and Agentic Coding tracks with
  realistic lesson metadata (title, summary, learningObjective, misconception,
  estimatedMinutes, difficulty, prerequisites).
- `/tracks` route: list tracks with accent color, summary, placeholder progress
  (all `not_started`).
- `/tracks/:trackSlug` route: lesson list in order, locked/available states derived
  from `prerequisiteLessonIds` (static, no persisted mastery yet).
- Home (`/`) route: continue-learning, daily-challenge, streak, recommended-next —
  all static/derived placeholders.
- Profile (`/profile`) and Settings (`/settings`) as navigable skeleton pages.

---

## Notes

- Out of scope: mini-game runtime, auth/persisted progress/streaks, real
  profile/progress/settings functionality, real daily-challenge logic (features 04,
  06, 07, 08, 09, 10).
- Mobile-first nav pattern; verify usability at ~375px before enhancing.
- Locked lesson states must be visually + semantically distinct (not color-only).
- Keyboard/screen-reader navigable: semantic nav landmarks, labeled links, visible focus.
- Use primitives/tokens from feature 02; no new one-off styling patterns.
- Use TanStack Query to read catalog data even though it's local for now, to keep
  the data-fetching seam in place for feature 06.
- Likely files: `src/app/providers/{QueryProvider,AppProviders}.tsx`,
  `src/app/routes/{Home,TrackMap,TrackDetail,Profile,Settings}.tsx`,
  `src/components/organisms/NavBar/...`, `src/components/templates/AppShell/...`,
  `src/learning/schemas/{track,lesson}.ts`, `src/learning/catalog/tracks.ts`,
  `src/learning/catalog/lessons/*.ts`.
- Acceptance: nav reaches all five routes at mobile/desktop widths; catalog
  Zod-validated (invalid data fails at build/test time); locked/available states
  correct; Storybook stories for NavBar/AppShell/track-lesson list items; tests
  cover schema validation and locked/available derivation; `npm run build` passes;
  `CHANGELOG.md` updated.
- Suggested commit: `feat: add app shell navigation and track/lesson catalog`

---

## History

<!-- Completed features (append only) -->
