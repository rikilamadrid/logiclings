# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Authentication and persistent progress** — the app's first backend. A
  learner can sign up, sign in, play Event Bubbling Bubbles, and find their
  completion still there after a reload or on another device.
  - Prisma schema on PostgreSQL for the Better Auth core models (`User`,
    `Session`, `Account`, `Verification`) plus `UserProgress` and `Attempt`,
    per the Core Data Models in `context/project-overview.md`, with an initial
    migration.
  - Better Auth with the Prisma adapter, email/password sign-in, mounted at
    `/api/auth/*`. Magic links and social providers stay out of scope — both
    need delivery/provider infrastructure that is not provisioned.
  - Vercel Functions API (`api/` + `src/server`): a session-aware progress read
    (`GET /api/progress`) and a completion mutation
    (`POST /api/progress/complete`) that is idempotent on `clientAttemptId`, so
    a retry after a network blip cannot double-count an attempt.
  - Strict server layering — route handler → session check → Zod validation →
    domain service → Prisma repository. Handlers never touch Prisma, and the
    owner of every read and write comes from the verified session, never from
    the request body.
  - Real `/auth/sign-in` and `/auth/sign-up` routes replacing the feature-03
    placeholders: mobile-first, keyboard accessible, with field-level validation
    messaging and an accessible `TextField` molecule.
  - Play is never gated behind auth. A signed-out learner is prompted to sign in
    at the point progress would be saved, and the finished attempt is preserved
    across the sign-in round trip (and a reload) so nothing is lost.
  - Track/Lesson catalog views now reflect the signed-in learner's real
    `UserProgress.masteryState` instead of the static `not_started` placeholder.
  - Mastery rules are pure and independently tested: an attempt passes only when
    it is completed with every round correct, mastery never regresses, and a
    lesson's completion date is stamped once rather than moving on every replay.
  - Tests cover the mastery/attempt logic, the progress service (including
    idempotent replays and per-user scoping), and the API handlers (a caller
    with no session is rejected; a caller cannot read or write another learner's
    progress, including by naming one in the request body). A Playwright spec
    covers sign-up → play → reload → persisted, skipped unless `E2E_WITH_API=1`.
  - Integration tests against a real PostgreSQL
    (`src/server/db/progressRepository.integration.test.ts`, opt-in via
    `INTEGRATION_DB=1`) cover replay handling and concurrent duplicate writes.
    The in-memory fake used by the unit tests detects duplicates with a set
    lookup and so cannot reproduce Postgres transaction semantics — database
    behavior has to be proved against a database.
  - `npm run dev` now also serves `/api/*`, via a Vite dev middleware
    (`vite/apiDevServer.ts`) that mounts the same handlers the Vercel Functions
    call. Local development needs no Vercel CLI or account; production still
    runs the real functions in `api/`.

- **Event Bubbling Bubbles**, the first shippable mini-game
  (`src/games/event-bubbling-bubbles`), teaching DOM event bubbling/
  propagation through a nested-bubble metaphor: the learner selects which
  ancestor layers react to a tap, watches the click bubble outward, and gets
  a layer-by-layer correctness breakdown. Discover, apply, and master
  `LevelDefinition`s and level content (varied nesting depth per mode) are
  built against the feature 04 runtime contract with no forking.
  - Master introduces `stopPropagation`-equivalent "stop" placement: the
    learner places a stop at a layer, then predicts the new reacting set —
    the stopped layer still reacts, nothing further outward does.
  - Pure domain logic (`domain/bubbling.ts`) computes the reacting-layer set
    and compares it against the learner's selection; covered by unit tests
    alongside a component test suite exercising correct/incorrect
    predictions, master stop placement, and a keyboard-only playthrough.
  - GSAP timeline animates the bubble outward through reacting layers on
    the runtime's `simulating` stage, with a reduced-motion fallback that
    steps through the same sequence via staged highlights instead.
  - Sound cues (tap, place, valid, invalid, success, mistake) and haptics are
    fully optional and never the sole feedback channel; every layer's
    reacting/selected state is also shown visually and in text.
  - Storybook stories cover the predicting, master stop-placement, transfer,
    and explaining game states, plus the shared `BubbleLayerList` visual in
    its mid-propagation, success, and mistake states.
  - Wired into `/play/event-bubbling-bubbles` and its result screen.
- Centralized sound-cue service (`src/lib/audio/audioService.ts`): a small
  Web Audio abstraction that synthesizes short tones per cue rather than
  loading sample files, with a global enable/disable switch so mini-games
  never hardcode audio playback.
- Haptics service stub (`src/lib/haptics/hapticsService.ts`): a no-op seam
  mini-games can call now, ready to back with real Capacitor Haptics calls
  once the native shell lands (feature 12).
- Mini-game runtime contract in `src/games/runtime`: a `LevelDefinition`-driven
  reducer (`runtimeReducer`) modeling the Hook → Predict → Simulate → React →
  Explain → Transfer rhythm as explicit stages, pause/restart, attempt
  tracking, a pure `calculateScore` scoring function, a `GameResult` event
  shape, an accessibility-mode flag (reduced motion + sound-off) synced from
  `prefers-reduced-motion`, and a renderer-agnostic `GameDefinition`/mount
  boundary (DOM/SVG/canvas).
- `GameHost` component that mounts a game via the runtime contract, renders
  pause/restart controls and a stage-progress indicator, and manages focus
  across stage transitions for keyboard and screen-reader users.
- `usePressable` input abstraction (`src/games/runtime/input.ts`) so mini-games
  get consistent keyboard/touch/click activation without reimplementing it.
- Shared `ResultScreen` component and `/play/:lessonSlug/result` wiring:
  what happened, the named concept, a transfer question, score/correctness/
  attempts, and mastery/XP/streak placeholders (real wiring lands in a later
  feature). Storybook stories cover the success and mistake states.
- A minimal reference/demo mini-game (`src/games/_reference-game`) proving the
  runtime contract end-to-end via a signal-prediction mechanic — explicitly
  marked as a non-shippable runtime fixture, reachable at
  `/play/runtime-fixture`.
- `LevelDefinition` Zod schema (`src/learning/schemas/level.ts`) per the
  project's core data models.
- `/play/:lessonSlug` now resolves lessons from the catalog and mounts the
  runtime fixture game for the demo lesson; real catalog lessons without a
  built game show an honest "not built yet" placeholder.
- Typed, Zod-validated learning catalog in `src/learning`: `Track` and `Lesson`
  schemas, seed data for the Frontend, System Design, and Agentic Coding
  tracks, and a `deriveLessonState` utility for locked/available/completed
  lesson states based on `prerequisiteLessonIds`.
- TanStack Query hooks (`src/learning/queries.ts`) for reading catalog data,
  keeping the data-fetching seam in place for the future API-backed version.
- Real app shell navigation: a `NavBar` organism (mobile bottom tab bar,
  desktop top bar) and an `ErrorBoundary`, wired into `AppShell`.
- `TrackCard` and `LessonListItem` molecules with Storybook stories, used to
  render `/tracks` and `/tracks/:trackSlug`.
- Home (`/`), Tracks (`/tracks`), and Track Detail (`/tracks/:trackSlug`)
  routes now render real, catalog-derived content instead of placeholders.
- Full design token system in `src/styles/tokens.css`: neutral and semantic
  colors, one accent color per track slug, typography/spacing/radius/border/
  elevation/motion/feedback-intensity/z-index scales, touch-target sizing, and
  safe-area insets.
- Refined the Logicling mascot mark (`brand/logiclings-logo.svg`) and
  generated favicon and app icon assets into `public/icons/`
  (`favicon.svg`, `mascot.svg`, `icon-192.png`, `icon-512.png`).
- Core UI primitives with Storybook stories and tests: `Button`, `IconButton`,
  `Badge` (semantic and track-accent tones), `Text`, `Heading`, and
  `Container` atoms, plus a `Card` molecule.
- A `Foundations/Design Tokens` Storybook story showcasing the full color,
  typography, spacing, and radius scales.
- Initial project setup.
- Full MVP feature breakdown in `context/features/01`–`12`, covering project
  foundation, design system, app shell/catalog, mini-game runtime, the three
  MVP mini-games, auth/progress, streaks, profile, PWA, and Capacitor.
- Scaffolded the Vite + React 19 + TypeScript strict app foundation: React
  Router with placeholder pages for every MVP route, ESLint + Prettier,
  Vitest + React Testing Library, Storybook, the base project folder
  structure, a placeholder design-token entry point, a mobile-first app
  shell with safe-area-aware layout and nav, and a GitHub Actions CI
  workflow running typecheck/lint/test/build.

### Changed

- `GameResult` now carries `startedAt` and a `clientAttemptId` generated when an
  attempt finishes, so every mini-game gets an idempotency key for the completion
  mutation without each game inventing one.
- The Profile page carries account state (sign in / sign out); the full
  progress/streak/achievement profile remains feature 08.
- Rewrote `CLAUDE.md` and `context/coding-standards.md` to reflect the actual
  Logiclings stack (Vite, React Router, CSS Modules/custom properties, TanStack
  Query, Zod, Better Auth, Prisma) instead of the generic starter-kit defaults.

### Fixed

- None yet.

### Removed

- None yet.
