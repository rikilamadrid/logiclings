# Coding Standards

These standards apply to the Logiclings codebase. See `context/project-overview.md`
for the full stack, architecture, and project structure rationale.

## TypeScript

- Use strict mode everywhere (`tsconfig` strict flags on, no loosening).
- Avoid `any`; prefer proper types or `unknown` with narrowing.
- Define types/interfaces for props, data models, API payloads, and external responses.
- Validate all external or user-provided data with Zod at the boundary, then infer
  static types from the schema (`z.infer<typeof schema>`) instead of hand-duplicating types.
- Let inference work when it keeps code clear; annotate when it improves readability
  or crosses a module boundary.

## React

- Use functional components and hooks only. No class components.
- Keep components focused on one job; split when a component handles more than one concern.
- Extract reusable logic into custom hooks when it improves clarity or is reused
  across two or more components.
- Prefer local component state (`useState`/`useReducer`) for UI and game state.
- Use TanStack Query for server state (progress, catalog, profile, auth session data).
- Only introduce a Zustand store when a mini-game or feature genuinely needs
  standalone state that outlives a single component tree — do not reach for
  global state by default.
- Lazy-load route-level components and individual mini-games with `React.lazy`.

## Routing

- React Router owns app routing (see the route table in `context/project-overview.md`).
- Routes must work mobile-first and remain deep-linkable.
- Keep route components thin; push logic into features/hooks.

## Styling

- CSS Modules or colocated CSS files, using CSS custom properties for design tokens
  (color, spacing, radius, typography, motion, elevation, z-index, touch targets, safe-area insets).
- No Tailwind CSS, no CSS-in-JS runtime libraries, no utility-class frameworks.
- Centralize tokens in `src/styles/` and reference them everywhere instead of
  hardcoding values in component styles.
- Avoid inline styles unless a value is truly dynamic (e.g., computed from game state).

## Server / API (Vercel Functions)

- Keep route handlers thin: verify session, validate input with Zod, call a domain
  service, return a typed response.
- Do not call Prisma directly from route handlers — go through a service/repository layer.
- Every mutation that touches user progress must verify session ownership and be
  idempotent (use `clientAttemptId` for attempt/completion writes).
- Return consistent, typed error shapes across all endpoints.

## Data & Content

- Prefer typed, version-controlled local content for lesson/track/level data during
  the MVP; the database stores user state and publication metadata, not raw content.
- Keep lesson/level definitions versioned; record the lesson version used on `UserProgress`.
- Keep UI data-driven — no hardcoded lesson copy or level parameters inside components.
- Only introduce client persistence (local storage, offline queues) when a feature
  genuinely needs it.

## Motion, Sound, and Haptics

- Use CSS transitions for ordinary UI state changes.
- Use GSAP only for orchestrated, multi-step, or educational timelines — not for
  routine hover/press feedback. Never introduce Framer Motion alongside GSAP.
- Every animation that isn't purely decorative needs a `prefers-reduced-motion` fallback.
- Trigger sound/haptics only through the centralized audio/haptics service in
  `src/lib/audio` / `src/lib/haptics` so they can be globally disabled and mocked in tests.
- Never make sound or motion the only channel that communicates a game outcome.

## Rendering

- Build mini-games with semantic DOM/SVG first.
- Only reach for PixiJS after profiling shows DOM/SVG is insufficient for a specific game.
- Keep the mini-game renderer swappable behind the runtime contract in `src/games/runtime`.

## File Organization

Follow the project structure defined in `context/project-overview.md`:

- App shell: `src/app/` (providers, routes, router)
- Shared UI: `src/components/` (atoms/molecules/organisms/templates)
- Feature areas: `src/features/` (auth, progress, streaks, tracks, settings)
- Mini-game runtime: `src/games/runtime/`
- Shared game primitives: `src/games/shared/`
- Individual mini-games: `src/games/[game-slug]/`
- Learning catalog/schemas/mastery: `src/learning/`
- Cross-cutting utilities: `src/lib/` (api, auth, analytics, validation, audio, haptics, motion)
- Server layer: `src/server/` (auth, db, routes, services)
- Vercel Functions entry points: `api/`
- Prisma schema/migrations: `prisma/`
- Static assets: `public/icons/`, `public/mascots/`, `public/sounds/`

Keep each mini-game isolated inside its own folder (state machine/reducer, assets,
stories, tests, level definitions). Shared behavior belongs in the runtime or
`src/games/shared`, never copy-pasted across games.

## Naming

- Components: PascalCase
- Functions and hooks: camelCase (hooks prefixed `use...`)
- Constants: SCREAMING_SNAKE_CASE
- Types and interfaces: PascalCase
- Track/lesson/level slugs: kebab-case
- Files: match the component/module name; one primary export per file where practical

## Testing

- Vitest + React Testing Library + user-event + jest-dom for unit/component tests.
- Playwright for critical E2E flows (auth, progress persistence, mobile viewports).
- Add or update Storybook stories for reusable UI and meaningful game states.
- Test user-observable behavior, not implementation details or GSAP internals.
- Avoid brittle snapshot tests for anything involving animation or layout.

## Accessibility

- Full keyboard access for every interactive control; visible focus states.
- Touch-friendly hit targets sized per the design tokens.
- Respect `prefers-reduced-motion`.
- Every sound cue needs a visual/text equivalent; every haptic cue needs a
  visual/text equivalent. No gameplay information conveyed by color, sound, or
  motion alone.
- Provide non-drag alternative controls for drag-based mini-game interactions.

## Code Quality

- No commented-out code unless there is a strong, stated reason to keep it temporarily.
- No unused imports or variables.
- Favor readable functions over clever ones.
- Make the smallest change that solves the task; do not refactor unrelated code
  without being asked.
