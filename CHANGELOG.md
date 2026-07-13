# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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
