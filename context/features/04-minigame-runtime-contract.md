# Feature Spec: Mini-Game Runtime Contract

## Status

Not Started

## Overview

Build the shared mini-game runtime: the lifecycle, input abstraction, and result
contract that every mini-game implements, plus the shared result/reflection UI.
This is the seam that lets each game stay isolated while the app shell hosts any of them.

## Problem

Without a shared runtime contract, each mini-game would reinvent lifecycle,
scoring, and result handling, and the app shell would have no consistent way to
mount, run, and collect results from a game.

## Goal

The app can mount any conforming mini-game at `/play/:lessonSlug`, run it through
predict → simulate → react → explain → transfer, and land on a shared result/
reflection screen — using a mock/demo game, since no real game exists yet.

## Requirements

- Define the runtime contract in `src/games/runtime`: game lifecycle states
  (idle, predicting, simulating, reacting, explaining, transfer, complete),
  pause/restart, attempt tracking, scoring interface, result event shape, an
  accessibility-mode flag, and a renderer-agnostic mount boundary (DOM/SVG/canvas).
- Define `LevelDefinition`-driven game loading per `context/project-overview.md`
  data models (`mode: discover | apply | master`, objective, mechanic, winCondition, reflection).
- `/play/:lessonSlug` route: resolves the lesson from the catalog (feature 03),
  mounts the appropriate game via the runtime, and enforces the Hook → Predict →
  Simulate → React → Explain → Transfer rhythm at the runtime level (games
  implement the mechanic, the runtime orchestrates the rhythm and transitions).
- Shared Result/Reflection component at `/play/:lessonSlug/result`: shows what
  happened, why, the named concept, one transfer question/alternate scenario,
  and score/mastery/XP/streak placeholders (real mastery/streak wiring comes later).
- A minimal reference/demo mini-game (not a real track game) implemented purely
  to prove the contract end-to-end — clearly marked as a runtime fixture, not shippable content.
- Reduced-motion and sound-off behavior supported at the runtime level (games
  must be able to query these settings from the runtime).
- Keyboard/touch input abstraction so games don't each reimplement input handling.

## Out Of Scope

- Any real, shippable mini-game (Event Bubbling Bubbles is feature 05).
- Sound/haptics implementation details beyond the settings the runtime exposes
  (actual audio service wiring lands with feature 05).
- Persisted attempts/progress/mastery (feature 06); this feature can emit result
  events but does not need to persist them yet.
- GSAP timeline work beyond what's needed to prove the contract.

## UX Notes

- Runtime transitions must work with keyboard-only and touch input.
- Pause/restart controls must be discoverable and accessible.
- Reduced-motion must change how transitions render, not just skip decoration.
- Result/reflection screen must be readable and navigable via screen reader.

## Technical Notes

Likely files:

- `src/games/runtime/types.ts` (lifecycle states, result event, level definition types)
- `src/games/runtime/useGameRuntime.ts` (or reducer-based runtime hook)
- `src/games/runtime/GameHost.tsx` (mount boundary component)
- `src/games/runtime/ResultScreen.tsx`
- `src/games/shared/` (any primitives shared across future games)
- `src/games/_reference-game/` (demo game proving the contract; name clearly as non-shippable)
- `src/app/routes/PlayLesson.tsx`, `PlayResult.tsx`

Implementation notes:

- Follow `context/coding-standards.md`: DOM/SVG first, renderer-agnostic contract,
  runtime owns lifecycle/orchestration, games own mechanic/visuals only.
- Keep the contract minimal — add fields only when a concrete game or the result
  screen needs them, not speculatively.

## Acceptance Criteria

- The reference game runs end-to-end through all six rhythm stages via the runtime.
- Result/reflection screen renders real data from a completed run.
- Runtime exposes reduced-motion and sound-off state to games.
- Unit tests cover the runtime lifecycle/reducer and scoring interface.
- Storybook stories for the Result/Reflection screen in success and mistake states.
- `npm run build` passes.
- `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

- Manual: play the reference game through to the result screen on mobile and desktop.
- Keyboard-only playthrough of the reference game.
- Toggle reduced-motion (OS or a settings stub) and confirm runtime responds.
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run build-storybook`

## References

- `context/project-overview.md` (Mini-Game Design Framework, Architecture, Core Data Models sections)
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`

## Suggested Branch

`feature/04-minigame-runtime-contract`

## Suggested Commit

`feat: add mini-game runtime contract and result/reflection UI`
