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

### 2026-07-12 — Feature 02: Design System and Brand Foundation

- Built the full design token system in `src/styles/tokens.css`: neutral and
  semantic colors, one accent color per track slug (all 11 tracks), typography/
  spacing/radius/border/elevation/motion/feedback-intensity/z-index scales,
  touch-target sizing, and safe-area insets — replacing the feature 01
  placeholder tokens.
- Refined the Logicling mascot mark (`brand/logiclings-logo.svg`) and
  generated favicon and app icon assets into `public/icons/` (`favicon.svg`,
  `mascot.svg`, `icon-192.png`, `icon-512.png`), wired the new favicon into
  `index.html`.
- Built the first core UI primitives — `Button`, `IconButton`, `Badge`
  (semantic and track-accent tones), `Text`, `Heading`, `Container` atoms and
  a `Card` molecule — each with Storybook stories covering key variants/states
  and Vitest/RTL tests.
- Added a `Foundations/Design Tokens` Storybook story showcasing the palette,
  typography scale, spacing scale, and radius scale; wired `.storybook/preview.ts`
  to load global tokens so components render on-brand in Storybook.
- `npm run typecheck`, `lint`, `test`, `build`, and `build-storybook` all pass.
- No app shell/navigation, track-specific mascot variants, per-game motion
  recipes, sound/haptics, or dark theme work yet — those remain scoped to
  later features.

### 2026-07-12 — Feature 03: App Shell, Navigation, and Track/Lesson Catalog

- Added a typed, Zod-validated learning catalog (`src/learning`): `Track` and
  `Lesson` schemas, seed data for the Frontend, System Design, and Agentic
  Coding tracks, and a `deriveLessonState` utility deriving locked/available/
  completed lesson states from `prerequisiteLessonIds`.
- Added TanStack Query hooks (`src/learning/queries.ts`) for reading catalog
  data, keeping the data-fetching seam in place for the later API-backed version
  (which feature 06 went on to use).
- Built the real app shell: a `NavBar` organism (mobile bottom tab bar, desktop
  top bar) and an `ErrorBoundary`, wired into a refactored `AppShell`, plus
  `TrackCard` and `LessonListItem` molecules with Storybook stories.
- Home (`/`), Tracks (`/tracks`), and Track Detail (`/tracks/:trackSlug`) render
  real catalog-derived content instead of placeholders.
- Profile and Settings remained navigable skeleton pages for later features.

### 2026-07-13 — Feature 04: Mini-Game Runtime Contract

- Added the shared mini-game runtime (`src/games/runtime`): a reducer-driven
  lifecycle (idle → predicting → simulating → reacting → explaining → transfer →
  complete), pause/restart, attempt tracking, a pure scoring function, a
  `GameResult` event shape, reduced-motion/sound-off accessibility state synced
  from `prefers-reduced-motion`, and a renderer-agnostic `GameDefinition`/mount
  boundary (DOM/SVG/canvas).
- Built `GameHost` to mount games through the contract with pause/restart
  controls, a stage-progress indicator, and focus management across stage
  transitions for keyboard and screen-reader users, plus a `usePressable`
  keyboard/touch input abstraction.
- Added a shared `ResultScreen` and wired `/play/:lessonSlug` and
  `/play/:lessonSlug/result` to the runtime.
- Added a `LevelDefinition` Zod schema and a non-shippable reference/demo game
  (`src/games/_reference-game`, at `/play/runtime-fixture`) proving the contract
  end-to-end.
- Real catalog lessons without a built game render an honest "not built yet"
  placeholder until their mini-games ship.

### 2026-07-13 — Feature 05: Event Bubbling Bubbles (First Mini-Game)

- Built the first real, shippable mini-game
  (`src/games/event-bubbling-bubbles`) against the feature 04 runtime contract
  with no forking: discover/apply/master levels teaching DOM event bubbling and
  propagation through a nested-bubble tap metaphor, with pure domain logic
  (`domain/bubbling.ts`) computing the reacting-layer set for a tap and
  comparing it against the learner's selection.
- The master level introduces `stopPropagation`-equivalent "stop" placement: the
  learner places a stop at a layer, then predicts the new reacting set — the
  stopped layer still reacts, nothing further outward does.
- A GSAP timeline animates the bubble outward through reacting layers on the
  runtime's `simulating` stage, with a reduced-motion fallback that steps
  through the same sequence via staged highlights instead of continuous motion.
- Added the centralized audio service (`src/lib/audio/audioService.ts`) — a
  small Web Audio abstraction synthesizing short tones per cue rather than
  loading sample files — and a haptics service stub
  (`src/lib/haptics/hapticsService.ts`, a no-op until Capacitor in feature 12).
  Both are globally disableable and never the sole feedback channel.
- Unit tests cover the domain logic and win/failure evaluation, alongside a
  component test suite (correct/incorrect predictions, master stop placement,
  keyboard-only playthrough) and Storybook stories for the key game states.

### 2026-07-13 — Feature 06: Authentication and Persistent Progress

- Added the app's first backend. A learner can sign up, sign in, play Event
  Bubbling Bubbles, and find the completion still there after a reload or on
  another device.
- Prisma schema on PostgreSQL for the Better Auth core models (`user`,
  `session`, `account`, `verification`) plus `user_progress` and `attempt`, with
  an initial migration. Better Auth uses the Prisma adapter with email/password
  sign-in; magic links and social providers were left out because both need
  delivery/provider infrastructure that is not provisioned.
- Vercel Functions API (`api/` + `src/server`): a session-aware progress read
  and a completion mutation that is idempotent on `clientAttemptId`. Layering is
  strict — route handler → session check → Zod validation → domain service →
  Prisma repository. The owner of every read and write comes from the verified
  session, never from the request body.
- Play is never gated behind auth; sign-in is prompted at the point progress
  would be saved, and the finished attempt survives the sign-in round trip.
- Catalog views now reflect the signed-in learner's real `masteryState`.
- `npm run dev` also serves `/api/*` through a Vite dev middleware, so local
  development needs no Vercel CLI or account. Production runs the real functions.
- Durable lesson: idempotency uses `createMany({ skipDuplicates })`
  (`ON CONFLICT DO NOTHING`), not a caught unique-constraint violation. In
  Postgres a failed statement aborts the whole transaction, so the follow-up read
  that answers a replay dies with `25P02` — the API returned 500 on every retry
  while the unit tests stayed green, because the in-memory fake detected
  duplicates with a set lookup and could not model Postgres semantics. Database
  behavior is now proved by opt-in integration tests (`INTEGRATION_DB=1`).
- Verified against a live Prisma Postgres database: sign-up → save → reload,
  mastery progression, five concurrent duplicate writes recording exactly one
  attempt, and cross-user isolation.
- `npm run typecheck`, `lint`, `test` (101), and `build` all pass.
- Follow-ups: no rate limiting beyond Better Auth's defaults; scoring is
  client-reported; the Playwright E2E spec is written but gated behind
  `E2E_WITH_API=1` and has not been executed.

## Notes

- Keep entries concise but useful.
- Prefer user-visible outcomes over raw implementation inventory.
- If deployment details matter, record only the durable facts here.
