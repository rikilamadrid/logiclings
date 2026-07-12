# Project History

Append-only log of completed work. Keep `context/current-feature.md` focused on
what is active now, and summarize shipped work here after it lands.

## Completed work

### [YYYY-MM-DD] — [Feature or milestone name]

- What shipped
- Why it mattered
- Any important implementation note
- Any important verification note

### [YYYY-MM-DD] — [Next completed item]

- What shipped
- Notable follow-up or deployment note

### 2026-07-12 — Feature 01: Project Foundation

- Scaffolded the Vite + React 19 + TypeScript strict app at the repo root,
  with React Router placeholder pages for every MVP route (`/`, `/tracks`,
  `/tracks/:trackSlug`, `/play/:lessonSlug`, `/play/:lessonSlug/result`,
  `/profile`, `/settings`, `/auth/sign-in`, `/auth/sign-up`) behind a
  mobile-first `AppShell` with safe-area-aware layout and nav.
- Configured ESLint (flat config) + Prettier, Vitest + React Testing Library +
  user-event + jest-dom (sample test passing), and Storybook (sample story),
  plus Playwright as a dependency for future E2E work.
- Built out the full base folder structure from `context/project-overview.md`
  and a placeholder `src/styles/tokens.css` (real values arrive in feature 02).
- Added a GitHub Actions CI workflow running typecheck/lint/test/build on PRs.
- `npm run typecheck`, `lint`, `test`, `build`, and `build-storybook` all pass.
- This is the base every later feature builds on; no auth/Prisma, design
  tokens/brand, mini-games, GSAP/sound/haptics, or PWA/Capacitor work yet —
  those are scoped to later features per `context/features/`.

## Notes

- Keep entries concise but useful.
- Prefer user-visible outcomes over raw implementation inventory.
- If deployment details matter, record only the durable facts here.
