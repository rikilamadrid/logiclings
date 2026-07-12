# Feature Spec: Cache the Crowd (Second Mini-Game)

## Status

Not Started

## Overview

Build the second mini-game, **Cache the Crowd**, teaching caching fundamentals
(cache hit/miss, TTL, invalidation, thundering herd) through a crowd-of-requests
metaphor, proving the runtime contract works for a System Design–flavored,
resource-balancing game genre distinct from Event Bubbling Bubbles' trace-execution genre.

## Problem

Only one mini-game genre (trace/predict execution) has shipped. The runtime
contract and shared patterns need to be proven against a second, structurally
different interaction family (balance resources / simulate load) before the
patterns can be trusted as genuinely reusable.

## Goal

A learner plays Cache the Crowd, predicts how a surge of "visitor" requests will
be served with and without a cache in place, configures a simple cache
(TTL/invalidation choice), watches the simulated crowd hit the origin server or
get served from cache, and completes a transfer challenge involving a
traffic-pattern or invalidation-timing variation.

## Requirements

- Learning design fields per `context/project-overview.md` Learning Design
  System table, fully specified for this game (objective, prerequisites,
  misconception, metaphor, mechanic, system response, win/failure conditions,
  feedback, reflection, transfer challenge, accessibility alternative, telemetry events).
- Misconception targeted: that caching is "free" with no tradeoffs — ignoring
  staleness, TTL expiry causing thundering-herd spikes, or incorrect invalidation
  causing stale reads.
- Visual metaphor: a crowd of visitor characters approaching a venue ("origin
  server"), with a cache layer that can absorb repeat visits for a configured duration.
- Core mechanic: learner sets a cache TTL/invalidation rule before a simulated
  traffic wave runs, then watches which requests hit cache vs. origin, with
  origin-server "strain" visualized as a resource/balance meter.
- Three levels (discover/apply/master) against the runtime's level modes,
  master level introducing a tradeoff (e.g., stale-data risk vs. origin load,
  or a cache invalidation timed incorrectly causing a stampede).
- Built entirely against the existing runtime contract (feature 04) — if the
  contract needs extension to support this game's needs (e.g., a
  resource/meter visualization primitve), extend it deliberately and document
  the change rather than forking runtime behavior inside this game's folder.
- Sound/haptics through the existing centralized services (feature 05); reuse
  existing cues where they fit, add new ones only if a genuinely new feedback
  moment exists (e.g., "cache hit" vs. "cache miss" chime).
- Keyboard/touch accessible controls for setting TTL/invalidation and for
  triggering/stepping the simulation.
- Reflection content naming real caching concepts (cache hit/miss, TTL,
  invalidation, thundering herd) and connecting them to real system design practice.

## Out Of Scope

- Third mini-game (Context Packager — feature 10).
- Any backend caching implementation in the app itself — this is a simulated,
  client-side teaching visualization, not a real cache.
- PixiJS/canvas rendering — DOM/SVG first, per stack rules.
- New achievement types beyond what feature 08 already supports (reuse existing
  completion/mastery hooks).

## UX Notes

- Mobile-first layout for the crowd/venue/cache visualization; must remain
  legible at small viewport widths (consider a simplified/vertical layout on mobile).
- Predict-before-reveal: TTL/invalidation choice is committed before the
  simulated wave runs.
- Provide pause/slow controls if the traffic-wave animation is fast.
- Reduced-motion equivalent must still communicate hit/miss outcomes and origin strain.
- Sound-off and motion-off must each independently allow understanding the outcome.

## Technical Notes

Likely files:

- `src/games/cache-the-crowd/CacheTheCrowdGame.tsx`
- `src/games/cache-the-crowd/levels/{discover,apply,master}.ts`
- `src/games/cache-the-crowd/CacheTheCrowdGame.stories.tsx`
- `src/games/cache-the-crowd/CacheTheCrowdGame.test.tsx`
- `src/games/cache-the-crowd/reflection.ts`
- `src/games/shared/` additions if a resource/meter primitive is genuinely reusable across games

Implementation notes:

- Follow `context/coding-standards.md` and the runtime contract from feature 04
  exactly; treat any needed runtime extension as a small, deliberate,
  documented change, not a game-local workaround.
- Keep level/lesson content data-driven per the `LevelDefinition` shape.

## Acceptance Criteria

- All three levels are playable end-to-end through the runtime and reach the
  shared result/reflection screen.
- Game is fully completable with sound off and with reduced-motion on.
- Keyboard-only playthrough is possible for all three levels.
- Unit tests cover the cache simulation logic (hit/miss determination, TTL
  expiry, invalidation) and win/failure conditions.
- Storybook stories cover key states (initial, mid-wave, cache hit, cache miss/thundering herd, success, transfer).
- `npm run build` passes.
- `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

- Manual playthrough of all three levels on mobile and desktop viewports.
- Keyboard-only playthrough; sound-off playthrough; reduced-motion playthrough.
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run build-storybook`

## References

- `context/project-overview.md` (Mini-Game Design Framework, Learning Design System, Initial Learning Tracks → System Design sections)
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`
- `context/features/04-minigame-runtime-contract.md`
- `context/features/05-event-bubbling-bubbles.md`

## Suggested Branch

`feature/09-cache-the-crowd`

## Suggested Commit

`feat: add Cache the Crowd mini-game`
