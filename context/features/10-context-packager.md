# Feature Spec: Context Packager (Third Mini-Game)

## Status

Not Started

## Overview

Build the third mini-game, **Context Packager**, teaching agentic-coding context
management (what to include/exclude when assembling context for an AI coding
agent, and the cost of an over-full context window) through a
packing/prioritization metaphor, proving the runtime contract against the
Agentic Coding track and a "review/approve" style mechanic.

## Problem

The MVP's three-game slice isn't complete without an Agentic Coding example, and
the product hasn't yet proven a mini-game built around reviewing/curating
information rather than tracing execution or balancing load.

## Goal

A learner plays Context Packager, predicts which pieces of available
information (files, prior messages, tool output, specs) should be included in a
context "package" for a given coding task, packs it within a visible budget,
watches the simulated agent's response quality/cost react to their choices, and
completes a transfer challenge with a different task and information set.

## Requirements

- Learning design fields per `context/project-overview.md` Learning Design
  System table, fully specified (objective, prerequisites, misconception,
  metaphor, mechanic, system response, win/failure conditions, feedback,
  reflection, transfer challenge, accessibility alternative, telemetry events).
- Misconception targeted: that including more context is always better/safer —
  ignoring signal dilution, cost, latency, and the real risk of irrelevant or
  stale context degrading output quality.
- Visual metaphor: a suitcase/package being packed with labeled context items
  (relevant file, unrelated file, stale note, prior decision, spec snippet, huge
  log dump) against a visible size/budget constraint.
- Core mechanic: learner selects which available items to include/exclude
  before the simulated "agent" runs, working within a visible context budget;
  the simulation shows a resulting response-quality and cost/latency outcome
  driven by what was included.
- Three levels (discover/apply/master) against the runtime's level modes;
  master level introduces a genuine tradeoff (e.g., a large but occasionally
  necessary log excerpt that costs a lot of budget, or two mutually exclusive
  items that can't both fit).
- Built entirely against the existing runtime contract (feature 04); extend the
  contract deliberately (and document the change) if a genuinely new
  primitive is needed (e.g., a budget/capacity meter, reusable from Cache the Crowd's meter if one exists).
- Content must follow the Security and Privacy guidance in
  `context/project-overview.md`: examples should model safe, responsible
  agentic-coding practice, not encourage unsafe context-handling habits (e.g.,
  don't depict pasting real secrets as a valid "include" option).
- Sound/haptics through existing centralized services; add new cues only for a
  genuinely new feedback moment (e.g., "budget exceeded").
- Keyboard/touch accessible: item selection/packing must work via keyboard, not only drag-and-drop.
- Reflection content naming real agentic-coding context-management concepts and
  connecting them to real practice (e.g., context window limits, relevance over volume).

## Out Of Scope

- Any other mini-game — this completes the three-game MVP slice.
- Real integration with an actual AI agent/model — the "agent response" is a
  simulated outcome driven by scripted level logic, not a live model call.
- New runtime capabilities beyond what's genuinely reusable/necessary.
- PixiJS/canvas rendering.

## UX Notes

- Mobile-first layout for the packing interface; ensure item selection targets
  meet touch-target size tokens.
- Predict-before-reveal: packing choices are committed before the simulated
  outcome is revealed.
- Reduced-motion equivalent must still communicate budget usage and outcome quality clearly.
- Sound-off and motion-off must independently allow understanding the outcome.
- Keep item/scenario copy concise — this game risks becoming a "reading" game if not careful; prioritize direct manipulation over long descriptions.

## Technical Notes

Likely files:

- `src/games/context-packager/ContextPackagerGame.tsx`
- `src/games/context-packager/levels/{discover,apply,master}.ts`
- `src/games/context-packager/ContextPackagerGame.stories.tsx`
- `src/games/context-packager/ContextPackagerGame.test.tsx`
- `src/games/context-packager/reflection.ts`
- `src/games/shared/BudgetMeter/...` if reusable with Cache the Crowd's meter primitive

Implementation notes:

- Follow `context/coding-standards.md` and the runtime contract from feature 04.
- Keep scenario/item content data-driven and reviewed for the security/content guidance above.
- Reuse any shared meter/budget visualization primitive from feature 09 rather than duplicating it, if the shapes genuinely match.

## Acceptance Criteria

- All three levels are playable end-to-end through the runtime and reach the
  shared result/reflection screen.
- Game is fully completable with sound off and with reduced-motion on.
- Keyboard-only playthrough is possible for all three levels.
- Unit tests cover the packing/budget logic and win/failure conditions.
- Storybook stories cover key states (initial, packed within budget, over
  budget, success, mistake, transfer).
- Content reviewed against the Security and Privacy guidance (no unsafe example patterns).
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

- `context/project-overview.md` (Mini-Game Design Framework, Learning Design System, Initial Learning Tracks → Agentic Coding, Security and Privacy sections)
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`
- `context/features/04-minigame-runtime-contract.md`
- `context/features/09-cache-the-crowd.md`

## Suggested Branch

`feature/10-context-packager`

## Suggested Commit

`feat: add Context Packager mini-game`
