# Current Feature: Mini-Game Runtime Contract

Use this file as the live tracker for what is active now. Keep it lean. When a
feature lands, summarize the completed work in `context/history.md` and move
this file forward to the next task.

Branch: `feature/04-minigame-runtime-contract`

## Status

In Progress

## Goals

- Runtime contract in `src/games/runtime`: game lifecycle states (idle,
  predicting, simulating, reacting, explaining, transfer, complete),
  pause/restart, attempt tracking, scoring interface, result event shape, an
  accessibility-mode flag, and a renderer-agnostic mount boundary (DOM/SVG/canvas).
- `LevelDefinition`-driven game loading per `context/project-overview.md` data
  models (`mode: discover | apply | master`, objective, mechanic, winCondition, reflection).
- `/play/:lessonSlug` route: resolves the lesson from the catalog (feature 03),
  mounts the appropriate game via the runtime, and enforces the Hook → Predict
  → Simulate → React → Explain → Transfer rhythm at the runtime level (games
  implement the mechanic; the runtime orchestrates rhythm and transitions).
- Shared Result/Reflection component at `/play/:lessonSlug/result`: what
  happened, why, the named concept, one transfer question/alternate scenario,
  and score/mastery/XP/streak placeholders (real mastery/streak wiring is feature 06/07).
- A minimal reference/demo mini-game (not a real track game) proving the
  contract end-to-end — clearly marked as a runtime fixture, not shippable content.
- Reduced-motion and sound-off state exposed at the runtime level so games can
  query it.
- Keyboard/touch input abstraction so games don't each reimplement input handling.

---

## Notes

- Out of scope: any real, shippable mini-game (Event Bubbling Bubbles is
  feature 05); sound/haptics implementation details beyond runtime-exposed
  settings; persisted attempts/progress/mastery (feature 06 — this feature
  may emit result events but doesn't need to persist them); GSAP timeline
  work beyond what's needed to prove the contract.
- Runtime transitions must work with keyboard-only and touch input.
- Pause/restart controls must be discoverable and accessible.
- Reduced-motion must change how transitions render, not just skip decoration.
- Result/reflection screen must be readable and navigable via screen reader.
- Keep the contract minimal — add fields only when a concrete game or the
  result screen needs them, not speculatively.
- Likely files: `src/games/runtime/types.ts`, `src/games/runtime/useGameRuntime.ts`
  (or reducer-based runtime hook), `src/games/runtime/GameHost.tsx`,
  `src/games/runtime/ResultScreen.tsx`, `src/games/shared/`,
  `src/games/_reference-game/` (demo game, name clearly as non-shippable),
  `src/app/routes/PlayLessonPage.tsx`, `PlayResultPage.tsx`.
- Acceptance: reference game runs end-to-end through all six rhythm stages via
  the runtime; result/reflection screen renders real data from a completed
  run; runtime exposes reduced-motion and sound-off state; unit tests cover
  the runtime lifecycle/reducer and scoring interface; Storybook stories for
  the Result/Reflection screen in success and mistake states; `npm run build`
  passes; `CHANGELOG.md` updated.
- Suggested commit: `feat: add mini-game runtime contract and result/reflection UI`

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
