# Current Feature: Context Packager (Third Mini-Game)

Use this file as the live tracker for what is active now. Keep it lean. When a
feature lands, summarize the completed work in `context/history.md` and move
this file forward to the next task.

Branch: `main` until a concrete feature or fix is scoped, then branch per task.

## Status

In Progress

## Goals

- Build the third mini-game, Context Packager, against the existing runtime
  contract (feature 04), teaching agentic-coding context management (what to
  include/exclude when assembling context for an AI coding agent, and the
  cost of an over-full context window).
- Packing/prioritization metaphor: learner selects which available items
  (relevant file, unrelated file, stale note, prior decision, spec snippet,
  huge log dump) to include in a context "package" within a visible budget,
  before seeing a simulated agent response-quality/cost outcome.
- Three levels (discover/apply/master); master introduces a genuine tradeoff
  (e.g. a large-but-sometimes-necessary log excerpt, or mutually exclusive
  items that can't both fit).
- Fully specified learning design fields per `context/project-overview.md`,
  targeting the misconception that more context is always better.
- Keyboard/touch accessible packing (not drag-and-drop only); reduced-motion
  and sound-off must each independently allow understanding the outcome.
- Reuse the feature 09 meter primitive for the budget visualization if the
  shapes genuinely match, rather than duplicating it.
- Content must model safe agentic-coding practice per the Security and
  Privacy guidance (no depicting real secrets as a valid "include").

---

## Notes

- Suggested branch: `feature/10-context-packager`.
- Suggested commit: `feat: add Context Packager mini-game`.
- Likely files: `src/games/context-packager/ContextPackagerGame.tsx`,
  `src/games/context-packager/levels/{discover,apply,master}.ts`,
  `ContextPackagerGame.stories.tsx`, `ContextPackagerGame.test.tsx`,
  `reflection.ts`, and possibly `src/games/shared/BudgetMeter/...`.
- Out of scope: any other mini-game, real integration with a live AI agent
  (the agent response is simulated/scripted), new runtime capabilities beyond
  what's genuinely reusable, PixiJS/canvas rendering.
- Acceptance: all three levels playable end-to-end through the runtime and
  shared result/reflection screen; completable with sound off and reduced
  motion on; keyboard-only playthrough possible; unit tests cover
  packing/budget logic and win/failure; Storybook covers initial, packed
  within budget, over budget, success, mistake, transfer states; content
  reviewed against security/privacy guidance; `npm run build` passes;
  `CHANGELOG.md` updated under `## [Unreleased]`.
- Full spec: `context/features/10-context-packager.md`.
- Keep this file current before implementation starts.
- Update it again after merge so it reflects reality on `main`.
- Do not let this turn into a full project diary; that belongs in `context/history.md`.

---

## History

<!-- Completed features (append only) -->

### Cache the Crowd (Second Mini-Game)

- Built the second mini-game (`src/games/cache-the-crowd`) against the feature
  04 runtime contract, proving it against a "balance resources" interaction
  family distinct from Event Bubbling Bubbles' trace-execution genre: pure
  domain simulation (`domain/cache.ts`) replays a wave of visitor requests
  against a single-resource-keyed cache given a learner-chosen TTL and (at
  master) a purge timing, tracking hit/miss outcomes and origin-server strain.
- Three levels (discover/apply/master): discover and apply vary only the TTL
  choice across bigger waves; master adds a purge-timing choice whose tradeoff
  is real — a mistimed purge flushes the whole cache right as a burst of
  requests arrives, so several different resources miss together instead of
  one at a time (a thundering herd), verified live at 100/100 origin strain
  when the purge lands mid-burst vs. a safe early purge.
- Added a new shared `ResourceMeter` primitive (`src/games/shared/ResourceMeter`)
  for visualizing a bounded resource/strain value — status conveyed through
  text and a `data-status` attribute, never color alone — intended for reuse
  by future resource-balancing games.
- Reused the existing runtime, audio/haptics services (`valid`/`invalid` cues
  for hit/miss, `success`/`mistake` for the round result), and achievement-award
  hooks unchanged; no new runtime, sound, or achievement types were needed.
- Wired into `/play/cache-the-crowd` and its result screen. Unit tests cover
  the cache simulation (hit/miss, TTL expiry, thundering herd) and the game's
  win/failure grading; component tests cover keyboard-only and reduced-motion
  playthroughs. Storybook stories cover the predicting, master purge-timing,
  transfer, and explaining game states, plus the shared visitor-wave list in
  mid-wave, thundering-herd, and all-hits result states.
- Manually verified in a real browser: full discover playthrough end to end,
  the master level's purge-timing tradeoff, and a 390px mobile viewport, with
  no console errors.

### Profile and Progress Screen

- Added `Achievement` and `UserAchievement` Prisma models with a migration.
  Achievement definitions (`slug`, `title`, `description`, `iconKey`) stay
  typed, local catalog data (`src/achievements/catalog`) like tracks/lessons;
  the achievement service upserts them into the `Achievement` table by slug
  the first time each is evaluated.
- Pure achievement-award rules (`src/server/services/achievementService.ts`):
  "First Steps" on a learner's first completed lesson, "On a Roll" at a
  3-day streak, "Track Master" once every catalog lesson in a track reaches
  `mastered`. Evaluated as part of the existing completion mutation
  (`POST /api/progress/complete`) rather than polled, and idempotent on
  `(userId, achievementId)`.
- `GET /api/achievements` returns the signed-in learner's earned
  achievements, same session → service → repository layering as
  progress/streak.
- Real Profile page (`/profile`): completed lessons, per-track mastery,
  streak summary, and an earned/locked achievements grid, composed from the
  existing progress/streak/achievement/catalog queries rather than a new
  aggregation endpoint — the joins are cheap, in-memory, and per-user.
  Loading/error/empty states throughout, including an encouraging new-user
  state.
- `AchievementGrid`, `StreakSummary`, and `TrackMasteryList` organisms reuse
  the feature 02 `Card`/`Badge`/`Heading`/`Text` primitives and the existing
  `LessonListItem` molecule, with Storybook stories for populated,
  partially-earned, and empty states.
- Unit tests cover the achievement award rules (first completion awards
  exactly once) and the achievements route; component tests cover the
  profile page's signed-out, empty, and populated states.

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
