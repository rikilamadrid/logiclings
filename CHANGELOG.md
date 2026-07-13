# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

- Rewrote `CLAUDE.md` and `context/coding-standards.md` to reflect the actual
  Logiclings stack (Vite, React Router, CSS Modules/custom properties, TanStack
  Query, Zod, Better Auth, Prisma) instead of the generic starter-kit defaults.

### Fixed

- None yet.

### Removed

- None yet.
