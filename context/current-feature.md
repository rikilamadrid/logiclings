# Current Feature

Use this file as the live tracker for what is active now. Keep it lean. When a
feature lands, summarize the completed work in `context/history.md` and move
this file forward to the next task.

Branch: `main` until a concrete feature or fix is scoped, then branch per task.

## Status

<!-- Not Started | In Progress | Complete -->

## Goals

<!-- Bullet points of what success looks like -->

---

## Notes

<!-- Additional context, constraints, or details from spec -->

- Keep this file current before implementation starts.
- Update it again after merge so it reflects reality on `main`.
- Do not let this turn into a full project diary; that belongs in `context/history.md`.

---

## History

<!-- Completed features (append only) -->

### App Shell, Navigation, and Track/Lesson Catalog

- Added a typed, Zod-validated learning catalog (`src/learning`): `Track` and
  `Lesson` schemas, seed data for Frontend, System Design, and Agentic Coding
  tracks, and a `deriveLessonState` utility for locked/available/completed
  lesson states based on `prerequisiteLessonIds`.
- Added TanStack Query hooks (`src/learning/queries.ts`) for reading catalog
  data, keeping the data-fetching seam in place for the future API-backed
  version.
- Built real app shell navigation: a `NavBar` organism (mobile bottom tab bar,
  desktop top bar) and an `ErrorBoundary`, wired into a refactored `AppShell`.
- Added `TrackCard` and `LessonListItem` molecules with Storybook stories.
- Home (`/`), Tracks (`/tracks`), and Track Detail (`/tracks/:trackSlug`)
  routes now render real, catalog-derived content instead of placeholders.
- Profile and Settings remain navigable skeleton pages for later features.
