# Feature Spec: Event Bubbling Bubbles (First Mini-Game)

## Status

Not Started

## Overview

Build the first real, shippable mini-game: **Event Bubbling Bubbles**, teaching
DOM event bubbling/propagation through a bubble-popping metaphor, with discover/
apply/master levels, sound, motion, reduced-motion behavior, and reflection content.

## Problem

The runtime contract (feature 04) has only proven itself with a non-shippable
reference game. The product has no real teaching content yet, and the learning
loop (predict → simulate → react → explain → transfer) is unproven with a genuine concept.

## Goal

A learner plays Event Bubbling Bubbles, predicts which elements will react to a
click before it happens, watches the event bubble visibly through nested targets,
sees immediate feedback, reads a concise explanation connecting the mechanic to
real DOM event bubbling, and completes a transfer challenge that varies the nesting/stopPropagation setup.

## Requirements

- Learning design fields defined per `context/project-overview.md` Learning Design
  System table: objective, prerequisites, misconception, metaphor, core mechanic,
  system response, win condition, failure condition, feedback, reflection,
  transfer challenge, accessibility alternative, telemetry events.
- Misconception targeted: that only the exact clicked element "hears" the click
  (ignoring bubbling to ancestors) — and the inverse confusion once
  `stopPropagation` is introduced.
- Visual metaphor: nested bubble/creature layers where a "pop" ripples outward
  through parent layers unless stopped.
- Core mechanic: learner predicts which nested layers will react to a
  click/tap, then watches the simulated bubbling path animate outward; later
  levels let the learner place a "stop" at a layer and predict the new outcome.
- Three levels implemented against the runtime's `discover | apply | master` modes:
  - Discover: guided, forgiving, clearly telegraphed bubbling path.
  - Apply: independent prediction, fewer hints, varied nesting depth.
  - Master: introduces `stopPropagation`-equivalent placement as a tradeoff/constraint.
- Built entirely against the runtime contract from feature 04 (lifecycle, result
  events, accessibility/reduced-motion flags) — no game-specific runtime forking.
- Sound cues wired through the centralized audio service (tap, pickup/place if
  applicable, valid/invalid target, success, mistake) — implement the audio
  service (`src/lib/audio`) here since this is the first game that needs it.
- Haptics hook stubbed via `src/lib/haptics` (no-op until Capacitor lands in feature 12).
- GSAP timeline for the bubbling propagation animation, with a reduced-motion
  fallback that still communicates the propagation path (e.g., staged
  highlight/step-through instead of continuous animation).
- Keyboard/touch accessible: layers selectable and "stop" placement doable via
  keyboard, not just pointer drag.
- Reflection content: concise explanation naming "event bubbling" / "event
  propagation" and connecting it to real addEventListener/DOM behavior.
- Telemetry events per `context/project-overview.md` Analytics section (lesson
  started/completed, retry, hint used, transfer attempted) — emit events only;
  wiring to a real analytics provider can be a thin abstraction stub if PostHog
  isn't configured yet.

## Out Of Scope

- Authentication or persisted progress/mastery/streak (feature 06/07) — this
  feature can complete a run and reach the result screen without saving it
  server-side; use local-only state for now if needed to demo the loop.
- Any other mini-game (Cache the Crowd, Context Packager — features 09, 10).
- PixiJS or canvas rendering — this game must work with DOM/SVG.
- Capacitor haptics beyond the stub interface.

## UX Notes

- Mobile-first layout; nested bubbles must remain tappable at small viewport widths.
- Predict-before-reveal: the learner commits to a prediction before the
  simulation runs, per the Mini-Game Design Framework rhythm.
- Motion must reveal causality (the propagation path), never require tracking
  fast movement to understand the outcome.
- Provide a pause/slow control for the propagation animation if it's fast enough
  to be hard to follow.
- Sound optional and off-able; mistakes/success must be understandable with sound off.
- Reduced-motion equivalent must still make the bubbling path legible.

## Technical Notes

Likely files:

- `src/games/event-bubbling/EventBubblingGame.tsx`
- `src/games/event-bubbling/levels/{discover,apply,master}.ts`
- `src/games/event-bubbling/EventBubblingGame.stories.tsx`
- `src/games/event-bubbling/EventBubblingGame.test.tsx`
- `src/games/event-bubbling/reflection.ts` (or `.mdx` if colocated copy is easier to author)
- `src/lib/audio/audioService.ts`
- `src/lib/haptics/hapticsService.ts` (stub)
- `public/sounds/{tap,success,mistake,...}.mp3`

Implementation notes:

- Implement strictly against the runtime contract from feature 04; do not modify
  the runtime's shape to fit this game without updating the contract deliberately.
- Follow `context/coding-standards.md` motion/sound/haptics rules (GSAP for the
  orchestrated timeline only, centralized audio service, no sound-only feedback).
- Keep lesson/level content data-driven and version-controlled, matching the
  `LevelDefinition` shape.

## Acceptance Criteria

- All three levels (discover/apply/master) are playable end-to-end through the
  runtime and reach the shared result/reflection screen.
- Sound and haptics are fully optional; the game is completable and
  understandable with both off.
- Reduced-motion mode preserves comprehension of the bubbling path.
- Keyboard-only playthrough is possible for all three levels.
- Unit tests cover the level state machine/reducer and win/failure condition logic.
- Storybook stories cover key game states (initial, mid-propagation, success, mistake, transfer).
- `npm run build` passes.
- `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

- Manual playthrough of all three levels on mobile and desktop viewports.
- Keyboard-only playthrough.
- Sound-off playthrough; reduced-motion playthrough.
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run build-storybook`

## References

- `context/project-overview.md` (Mini-Game Design Framework, Learning Design System, Motion/Sound sections)
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`
- `context/features/04-minigame-runtime-contract.md`

## Suggested Branch

`feature/05-event-bubbling-bubbles`

## Suggested Commit

`feat: add Event Bubbling Bubbles mini-game`
