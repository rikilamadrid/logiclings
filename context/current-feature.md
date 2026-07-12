# Current Feature: Project Foundation

Use this file as the live tracker for what is active now. Keep it lean. When a
feature lands, summarize the completed work in `context/history.md` and move
this file forward to the next task.

Branch: `feature/01-project-foundation` (create when implementation starts).

## Status

In Progress

## Goals

- Vite + React 19 + TypeScript strict mode project scaffolded at repo root.
- React Router with placeholder pages for `/`, `/tracks`, `/tracks/:trackSlug`,
  `/play/:lessonSlug`, `/play/:lessonSlug/result`, `/profile`, `/settings`,
  `/auth/sign-in`, `/auth/sign-up`.
- ESLint + Prettier configured for TypeScript + React.
- Vitest + React Testing Library + user-event + jest-dom configured with a
  sample test passing.
- Storybook configured with a sample story running.
- Base folder structure per `context/project-overview.md`: `src/app`,
  `src/components`, `src/features`, `src/games/runtime`, `src/games/shared`,
  `src/learning`, `src/lib`, `src/server`, `src/styles`, `src/test`,
  `src/types`, `api/`, `public/{icons,mascots,sounds}`.
- `src/styles/tokens.css` with placeholder custom-property categories (color,
  spacing, radius, typography, motion, elevation, z-index, touch targets,
  safe-area insets) — real values arrive in feature 02.
- Minimal mobile-first app shell: viewport meta, safe-area-aware root layout,
  basic nav placeholder.
- GitHub Actions workflow running typecheck, lint, test, and build on PRs.
- `package.json` scripts: `dev`, `build`, `preview`, `lint`, `typecheck`,
  `test`, `storybook`, `build-storybook`.

---

## Recently landed

- Docs pass: rewrote `CLAUDE.md` and `context/coding-standards.md` to match the
  real Logiclings stack, and authored `context/features/01`–`12` covering the
  full MVP scope from `context/project-overview.md`.

---

## Notes

- Spec: `context/features/01-project-foundation.md`.
- Out of scope: auth/Prisma/backend, design tokens/brand/mascots, mini-games,
  GSAP/sound/haptics, PWA manifest, Capacitor.
- Follow `context/project-overview.md` and `context/coding-standards.md`
  exactly — no Next.js, Tailwind, or Redux.
- Acceptance: `npm run dev` serves working client-side routing; typecheck,
  lint, test, build, and build-storybook all pass; CI runs the same checks;
  `CHANGELOG.md` updated under `## [Unreleased]`.
- Suggested commit message: `feat: scaffold Vite React TypeScript app foundation`.
- Keep this file current before implementation starts.
- Update it again after merge so it reflects reality on `main`.
- Do not let this turn into a full project diary; that belongs in `context/history.md`.
