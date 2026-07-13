# Current Feature

Use this file as the live tracker for what is active now. Keep it lean. When a
feature lands, summarize the completed work in `context/history.md` and move
this file forward to the next task.

Branch: `main` until a concrete feature or fix is scoped, then branch per task.

## Status

<!-- Not Started | In Progress | Complete -->

## Goals

<!-- Bullet points of what success looks like -->

---

## Notes

<!-- Additional context, constraints, or details from spec -->

- Keep this file current before implementation starts.
- Update it again after merge so it reflects reality on `main`.
- Do not let this turn into a full project diary; that belongs in `context/history.md`.

---

## History

<!-- Completed features (append only) -->

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
