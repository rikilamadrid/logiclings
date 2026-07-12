# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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
