# Current Feature: Profile and Progress Screen

Use this file as the live tracker for what is active now. Keep it lean. When a
feature lands, summarize the completed work in `context/history.md` and move
this file forward to the next task.

Branch: `main` until a concrete feature or fix is scoped, then branch per task.

## Status

In Progress

## Goals

- Add an `Achievement` model (`slug`, `title`, `description`, `iconKey`) plus a
  user-achievement join model, with a migration and a small seeded starter set
  (e.g., "first completion," "3-day streak," "track mastered").
- Achievement-award service that evaluates completed attempts/streak updates
  and awards new achievements, triggered from the existing completion/streak
  flows (features 06/07) rather than polled.
- Real Profile page (`/profile`) with: completed-lessons list, per-track
  mastery summary, streak calendar/summary, and an achievements grid
  (earned vs. locked), replacing the feature-03 skeleton.
- Handle loading/error/empty states throughout, including an encouraging
  empty state for a brand-new user with no completions.
- API endpoint(s) for aggregated profile data for the current signed-in user,
  designed to avoid N+1 queries.

---

## Notes

<!-- Constraints, decisions, and details from the spec -->

- Spec: `context/features/08-profile-progress-screen.md`.
- Out of scope: Settings screen functionality, saved/favorite lessons, social
  profile pages, final achievement icon artwork (placeholders are fine).
- Reuse feature 02 primitives/tokens for badges, cards, grid layout — no new
  one-off components where an existing primitive fits.
- Server rules: session ownership checks on the profile endpoint, service
  layer between route handlers and Prisma (per `context/coding-standards.md`).
- Streak calendar must be understandable without color alone (icon/text +
  color for qualifying days).
- Acceptance: real data renders for all four sections; new-user empty states;
  achievement awarding covered by unit tests (e.g., first completion awards
  exactly once); Storybook stories for populated + empty states; `npm run
  build` passes; `CHANGELOG.md` updated under `## [Unreleased]`.
- Suggested branch: `feature/08-profile-progress-screen`.
- Keep this file current before implementation starts.
- Update it again after merge so it reflects reality on `main`.
- Do not let this turn into a full project diary; that belongs in `context/history.md`.

---

## History

<!-- Completed features (append only) -->

### Timezone-Aware Streak Tracking

- Added a `Streak` Prisma model (`currentDays`, `longestDays`,
  `lastQualifiedDate`, `timezone`), one row per user, with a migration.
- Pure streak domain service (`src/server/services/streakService.ts`):
  resolves a completion instant to the learner's local calendar date via
  `Intl.DateTimeFormat`, increments `currentDays` on the day directly after
  `lastQualifiedDate`, resets to 1 on a missed day, and keeps `longestDays`
  accurate — comparing calendar-date strings rather than instants keeps DST
  transitions out of the comparison entirely.
- The browser's current IANA timezone is captured with every completion
  rather than stored once at sign-up, so a traveling learner's streak always
  qualifies against where they actually are.
- Streak qualification happens as part of the existing completion mutation
  (`POST /api/progress/complete`) rather than a separate user action;
  `GET /api/streak` reads the current streak for Home. Same strict layering
  as progress: route handler → session check → Zod validation → domain
  service → Prisma repository.
- Home's streak card is wired to real data via a `useStreakQuery` TanStack
  Query hook.
- A small streak micro-reaction on qualifying (a `streak` audio cue plus a
  CSS-transitioned message on the result screen's save panel), respecting
  `prefers-reduced-motion` and never required to understand the result.
- Unit tests cover increment, reset, and longest-streak logic across
  date-boundary and DST edge cases (spring-forward and fall-back). Opt-in
  integration tests (`INTEGRATION_DB=1`) cover the real Prisma repository.

### Event Bubbling Bubbles (First Mini-Game)

- Built the first real, shippable mini-game (`src/games/event-bubbling-bubbles`)
  against the feature 04 runtime contract with no forking: discover/apply/
  master levels teaching DOM event bubbling/propagation through a
  nested-bubble tap metaphor, with pure domain logic (`domain/bubbling.ts`)
  computing the reacting-layer set for a tap and comparing it against the
  learner's selection.
- Master level introduces stopPropagation-equivalent "stop" placement: the
  learner places a stop at a layer, then predicts the new reacting set — the
  stopped layer still reacts, nothing further outward does.
- GSAP timeline animates the bubble outward through reacting layers on the
  runtime's `simulating` stage, with a reduced-motion fallback that steps
  through the same sequence via staged highlights instead of continuous motion.
- Added the centralized audio service (`src/lib/audio/audioService.ts`) —
  a small Web Audio abstraction synthesizing short tones per cue rather than
  loading sample files — and a haptics service stub (`src/lib/haptics/
  hapticsService.ts`, no-op until Capacitor in feature 12). Both are globally
  disableable and never the sole feedback channel.
- Wired into `/play/event-bubbling-bubbles` and its result screen.
- Unit tests cover the domain logic and win/failure evaluation, plus a
  component test suite (correct/incorrect predictions, master stop
  placement, keyboard-only playthrough). Storybook stories cover the
  predicting, master stop-placement, transfer, and explaining game states,
  plus the shared `BubbleLayerList` visual in mid-propagation, success, and
  mistake states.

### App Shell, Navigation, and Track/Lesson Catalog

- Added a typed, Zod-validated learning catalog (`src/learning`): `Track` and
  `Lesson` schemas, seed data for Frontend, System Design, and Agentic Coding
  tracks, and a `deriveLessonState` utility for locked/available/completed
  lesson states based on `prerequisiteLessonIds`.
- Added TanStack Query hooks (`src/learning/queries.ts`) for reading catalog
  data, keeping the data-fetching seam in place for the future API-backed
  version.
- Built real app shell navigation: a `NavBar` organism (mobile bottom tab bar,
  desktop top bar) and an `ErrorBoundary`, wired into a refactored `AppShell`.
- Added `TrackCard` and `LessonListItem` molecules with Storybook stories.
- Home (`/`), Tracks (`/tracks`), and Track Detail (`/tracks/:trackSlug`)
  routes now render real, catalog-derived content instead of placeholders.
- Profile and Settings remain navigable skeleton pages for later features.

### Mini-Game Runtime Contract

- Added the shared mini-game runtime in `src/games/runtime`: a reducer-driven
  lifecycle (idle → predicting → simulating → reacting → explaining →
  transfer → complete), pause/restart, attempt tracking, a pure scoring
  function, a `GameResult` event shape, reduced-motion/sound-off
  accessibility state synced from `prefers-reduced-motion`, and a
  renderer-agnostic `GameDefinition`/mount boundary (DOM/SVG/canvas).
- Built `GameHost` to mount games via the contract with pause/restart
  controls, a stage-progress indicator, and focus management across stage
  transitions for keyboard and screen-reader users, plus a `usePressable`
  keyboard/touch input abstraction.
- Added a shared `ResultScreen` (with Storybook stories for success and
  mistake states) and wired `/play/:lessonSlug` and
  `/play/:lessonSlug/result` to the runtime.
- Added a `LevelDefinition` Zod schema and a non-shippable reference/demo
  mini-game (`src/games/_reference-game`, reachable at
  `/play/runtime-fixture`) proving the contract end-to-end.
- Real catalog lessons without a built game render an honest "not built yet"
  placeholder until their mini-games ship in later features.

### Authentication and Persistent Progress

- Added the app's first backend: Better Auth (Prisma adapter, email/password)
  and a progress/attempt API on PostgreSQL, so a signed-in learner's completions
  persist across reloads and devices.
- Prisma schema for the Better Auth core models plus `UserProgress` and
  `Attempt`, per the Core Data Models, with an initial migration.
- Vercel Functions API (`api/` + `src/server`): a session-aware progress read
  and a completion mutation idempotent on `clientAttemptId`. Strict layering —
  route handler → session check → Zod validation → domain service → Prisma
  repository — with the owner of every read and write taken from the verified
  session, never the request body.
- Real `/auth/sign-in` and `/auth/sign-up` routes replacing the feature-03
  placeholders. Play is never gated; sign-in is prompted at the point progress
  would be saved, and the finished attempt survives the sign-in round trip.
- Catalog views reflect the signed-in learner's real `masteryState`.
- `npm run dev` now also serves `/api/*` via a Vite dev middleware, so local
  development needs no Vercel CLI; production runs the real functions.
- Idempotency uses `createMany({ skipDuplicates })` rather than catching the
  unique violation — in Postgres a failed statement aborts the transaction, so
  the follow-up read answering a replay died with `25P02` and the API returned
  500 on every retry while unit tests stayed green. Opt-in integration tests
  (`INTEGRATION_DB=1`) now cover the database behavior the in-memory fake cannot
  model.
- Verified against a live database: sign-up → save → reload, mastery
  progression, five concurrent duplicate writes recording exactly one attempt,
  and cross-user isolation.
- Follow-ups: no rate limiting beyond Better Auth's defaults; scoring is
  client-reported; the Playwright E2E spec is gated behind `E2E_WITH_API=1` and
  has not been executed.
