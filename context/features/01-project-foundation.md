# Feature Spec: Project Foundation

## Status

Not Started

## Overview

Scaffold the Logiclings web app: a Vite + React + TypeScript strict project with
routing, Storybook, testing, linting, formatting, CI, and design-token entry
points. This is the base every later feature builds on.

## Problem

There is no app yet — only context docs. Nothing can be built, previewed, or
tested until the foundation exists.

## Goal

A developer can clone the repo, run `npm install && npm run dev`, and see a
minimal mobile-first shell with working routing, and run lint/typecheck/test/build
commands successfully.

## Requirements

- Vite + React 19 + TypeScript strict mode project scaffolded at repo root.
- React Router installed with a minimal route table matching `context/project-overview.md`
  (`/`, `/tracks`, `/tracks/:trackSlug`, `/play/:lessonSlug`, `/play/:lessonSlug/result`,
  `/profile`, `/settings`, `/auth/sign-in`, `/auth/sign-up`) — placeholder pages are fine.
- ESLint + Prettier (or equivalent) configured for TypeScript + React.
- Vitest + React Testing Library + user-event + jest-dom configured and able to run
  a sample test.
- Storybook configured and able to run a sample story.
- Base folder structure created per `context/project-overview.md` (`src/app`,
  `src/components`, `src/features`, `src/games/runtime`, `src/games/shared`,
  `src/learning`, `src/lib`, `src/server`, `src/styles`, `src/test`, `src/types`, `api/`, `public/{icons,mascots,sounds}`).
- `src/styles` includes a token entry point (CSS custom properties file) with
  placeholder categories from `context/project-overview.md` (color, spacing,
  radius, typography, motion, elevation, z-index, touch targets, safe-area insets)
  — real values come in feature 02.
- Minimal mobile-first app shell: viewport meta, safe-area-aware root layout, a
  basic nav placeholder.
- GitHub Actions workflow running typecheck, lint, test, and build on PRs.
- `package.json` scripts: `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, `storybook`, `build-storybook`.

## Out Of Scope

- Auth, Prisma, or any backend/API work (feature 06).
- Design system tokens, brand identity, or mascot assets (feature 02).
- Any mini-game implementation (features 04, 05, 09, 10).
- GSAP, sound, or haptics wiring.
- PWA manifest/installability (feature 11) and Capacitor (feature 12).

## UX Notes

- Mobile-first viewport and layout from the first commit.
- Placeholder pages should render something legible, not blank screens, so
  routing can be visually verified.
- No visual polish expected yet — that starts in feature 02.

## Technical Notes

Likely files/directories:

- `vite.config.ts`, `tsconfig.json`, `.eslintrc*`/`eslint.config.*`, `.prettierrc*`
- `src/app/router/`, `src/app/providers/`, `src/app/routes/`
- `src/styles/tokens.css`
- `src/test/setup.ts`
- `.storybook/main.ts`, `.storybook/preview.ts`
- `.github/workflows/ci.yml`

Implementation notes:

- Follow the project structure and stack in `context/project-overview.md` exactly;
  do not introduce Next.js, Tailwind, or Redux.
- Follow `context/coding-standards.md` for naming and file organization.
- Keep this feature scoped to scaffolding only — no game or learning-system logic.

## Acceptance Criteria

- `npm run dev` serves the app locally with working client-side routing between placeholder pages.
- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, and `npm run build-storybook` all pass.
- CI workflow runs the same checks on push/PR.
- `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

- Manual: load each placeholder route in a mobile viewport (~375px) and confirm it renders.
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run build-storybook`
- Confirm GitHub Actions workflow succeeds on the feature branch.

## References

- `context/project-overview.md`
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`

## Suggested Branch

`feature/01-project-foundation`

## Suggested Commit

`feat: scaffold Vite React TypeScript app foundation`
