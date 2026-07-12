# Feature Spec: Design System and Brand Foundation

## Status

Not Started

## Overview

Establish the Logiclings visual identity and token-driven design system: color,
typography, spacing, radius, elevation, motion, and the base Logicling mascot
mark, plus the shared UI primitives that every later feature will reuse.

## Problem

The foundation app (feature 01) has no visual identity, tokens, or reusable UI
primitives. Every subsequent feature needs a consistent look and a small set of
shared components instead of one-off styling.

## Goal

The app has a distinct, cohesive visual identity — soft geometric shapes, calm
neutral surfaces with bright track accents — expressed through centralized
tokens and a small set of reusable UI primitives, viewable in Storybook.

## Requirements

- Token categories defined as CSS custom properties in `src/styles/`: neutral +
  semantic colors, track accent colors (one per track slug), typography scale,
  spacing scale, radius scale, border tokens, elevation/shadow tokens, motion
  duration/easing tokens, feedback-intensity tokens, z-index scale, touch-target
  sizing, safe-area insets.
- Base Logicling mascot mark (SVG) matching the logo direction in
  `context/project-overview.md`: rounded creature from a soft code loop, two
  node-like eyes, small tail hinting at a bracket/connector; usable at favicon,
  mascot, and badge sizes. `brand/logiclings-logo.svg` already exists — evaluate
  and refine it to match spec, or replace if it doesn't fit.
- Favicon and app icon assets generated from the mark into `public/icons/`.
- Core UI primitives in `src/components/atoms` and `src/components/molecules`:
  Button, IconButton, Card, Badge/Pill (for track accents and achievements),
  Text/Heading primitives, and a basic Layout/Container primitive.
- Light theme tokens at minimum; dark theme is optional here unless trivial.
- Storybook stories for every primitive and for the token palette itself
  (a palette/typography showcase story).

## Out Of Scope

- Full app shell navigation and page composition (feature 03).
- Track-specific mascot variants beyond the base mark.
- Motion recipes tied to specific game feedback (introduced per-game later).
- Sound/haptic services (introduced in feature 05 alongside the first game).
- Dark theme completeness if it adds significant scope beyond token definitions.

## UX Notes

- Mobile-first sizing for all primitives; verify touch target tokens meet
  accessible minimums.
- Soft geometric visual language, bright accents over calm neutrals — avoid
  corporate dashboard styling, neon/cyberpunk, or childish preschool style per
  `context/project-overview.md`.
- Visible focus states on every interactive primitive.
- Sufficient color contrast for text and interactive states.

## Technical Notes

Likely files:

- `src/styles/tokens.css` (or split into `colors.css`, `typography.css`, `spacing.css`, etc.)
- `src/components/atoms/Button/Button.tsx` (+ `.module.css`, `.stories.tsx`, `.test.tsx`)
- `src/components/atoms/Badge/...`
- `src/components/molecules/Card/...`
- `brand/logiclings-logo.svg`
- `public/icons/favicon.svg`, `public/icons/icon-*.png`

Implementation notes:

- Follow `context/coding-standards.md` styling rules: CSS Modules/colocated CSS
  with custom properties, no Tailwind.
- Keep primitives generic and reusable — no track- or game-specific logic inside them.
- Reference tokens by CSS custom property everywhere; no hardcoded hex/px values
  inside component styles.

## Acceptance Criteria

- All listed primitives exist, are typed, and have Storybook stories covering
  their key variants and states (default, hover/focus, disabled where applicable).
- Token file(s) cover every category listed above.
- Mascot mark renders correctly as favicon and at mascot/badge sizes.
- `npm run build`, `npm run test`, and `npm run build-storybook` pass.
- `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

- Visual check of each primitive and the palette showcase story in Storybook.
- Mobile viewport check (~375px) for touch target sizing.
- Keyboard navigation check: tab through primitives, confirm visible focus.
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run build-storybook`

## References

- `context/project-overview.md` (Design System, Visual and Brand Direction sections)
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`
- `brand/logiclings-logo.svg`

## Suggested Branch

`feature/02-design-system-brand-foundation`

## Suggested Commit

`feat: add design tokens, mascot mark, and core UI primitives`
