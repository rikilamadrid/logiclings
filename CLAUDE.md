# Logiclings

A mobile-first, game-like learning app where short interactive mini-games teach
software engineering mental models through play. Tagline: "Tiny games. Big
developer instincts."

## Orientation (read this first)

- Deep context lives in `context/`:
  - `context/project-overview.md` — product vision, learning design system, stack, architecture, data models, and constraints
  - `context/coding-standards.md` — TypeScript, React, styling, testing, and file conventions
  - `context/ai-interaction.md` — workflow rules for Claude, Codex, and similar agents
  - `context/current-feature.md` — the active feature tracker; keep it current
  - `context/history.md` — append-only log of completed work
- Per-feature specs live in `context/features/`, numbered in build order.
- Read only the docs needed for the task; do not load everything by default.

## Default stack

- React 19 + TypeScript strict mode
- Vite
- React Router
- Storybook
- Vitest + React Testing Library + user-event + jest-dom
- Playwright for critical E2E flows
- CSS Modules or colocated CSS with CSS custom properties (no Tailwind, no CSS-in-JS)
- TanStack Query for server state
- Zod for validation (API inputs/outputs, content, env vars)
- Better Auth with the Prisma adapter for authentication
- Prisma + PostgreSQL
- Vercel Functions for the API layer, Vercel for deployment
- GitHub Actions for CI
- vite-plugin-pwa for PWA installability
- Capacitor for the future iOS/Android shell
- GSAP for orchestrated educational timelines only (not routine UI motion)
- DOM/SVG first for mini-game rendering; PixiJS only if profiling proves it's needed
- Howler.js or a small Web Audio abstraction for sound
- Capacitor Haptics for native haptic feedback
- PostHog (or a small analytics abstraction) + Sentry for monitoring

Do not add Next.js, Tailwind, shadcn/ui, Redux, GraphQL, Phaser, Three.js, Framer
Motion, or a custom game engine unless the user explicitly asks.

## Architecture notes

- Mobile-first, then progressively enhanced.
- Keep the app data-driven: lesson/track/level content is typed and version-controlled,
  not hardcoded inside components.
- Mini-games are isolated under `src/games/[game-slug]`, built against the shared
  runtime contract in `src/games/runtime`. Shared behavior belongs in the runtime
  or `src/games/shared`, never duplicated across games.
- Server logic flows: route handler → session/Zod validation → domain service →
  Prisma. Do not call Prisma directly from route handlers.
- Put design tokens in CSS custom properties in `src/styles/` and keep styling
  decisions centralized.
- One concept, one primary mechanic, one clear visual metaphor per mini-game —
  see the mini-game design framework in `context/project-overview.md`.

## Conventions

- Branch per feature or fix.
- Update `context/current-feature.md` before starting implementation and again after merge.
- Build must pass (`npm run build`) before commit.
- Ask before committing.
- Keep `CHANGELOG.md` updated under `## [Unreleased]` as work happens.
- Keep `context/history.md` aligned with shipped work.
- Commit messages must carry no AI attribution, co-author trailers, or generated-by footers.
- Do not build more than the scoped feature; do not add tracks, games, or
  infrastructure ahead of the current build phase.

## Versioning

- Semantic Versioning: `MAJOR.MINOR.PATCH`.
- Keep a root `CHANGELOG.md` in Keep a Changelog style.
- Add changes under `## [Unreleased]` as the work happens, not at the very end.
- `PATCH` for backward-compatible fixes, `MINOR` for backward-compatible features,
  `MAJOR` for breaking user-facing changes.

## Commands

```bash
npm run dev             # Vite dev server
npm run build            # typecheck + production build
npm run preview           # preview the production build
npm run lint             # ESLint
npm run typecheck          # tsc --noEmit
npm run test              # Vitest
npm run test:e2e           # Playwright
npm run storybook           # Storybook dev server
npm run build-storybook       # Storybook static build
```

Adjust this list once `package.json` is scaffolded (feature 01) if script names differ.

## Build order

Features are scoped and sequenced in `context/features/`, numbered `01`–`12`,
following the MVP scope in `context/project-overview.md`. Work through them in
order unless the user redirects priority.
