# Logiclings Initial Project Prompt

You are helping build **Logiclings**, a mobile-first, game-like learning app where tiny interactive mini-games teach software engineering fundamentals through play.

Read the project documentation before implementing anything.

Required files to read in full before the first implementation task:

- `context/project-overview.md`
- `CLAUDE.md`
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`

## Product Summary

Logiclings teaches software engineering mental models through short, interactive mini-games.

The product should feel:

- Simple
- Cute
- Gamey
- Polished
- Responsive
- Effective at teaching
- Friendly to beginners
- Useful to experienced developers
- Built with professional frontend architecture

It should not feel like:

- A generic quiz app
- A static course platform
- A LeetCode clone
- A corporate dashboard
- A heavy game engine demo
- A pile of disconnected visualizations

Working tagline:

> Tiny games. Big developer instincts.

## Core Tracks

The long-term product includes these learning tracks:

- Frontend
- Backend
- APIs
- Databases
- Algorithms and Data Structures
- System Design
- Networking
- Security
- DevOps
- AI Fundamentals
- Agentic Coding

Do not build all tracks at once. The MVP should prove the learning loop with a few excellent mini-games.

## MVP Target

Build a polished vertical slice with:

1. App foundation
2. Design system and brand foundation
3. Track map and lesson catalog
4. Mini-game runtime contract
5. First mini-game: **Event Bubbling Bubbles**
6. Auth and persistent progress
7. Streak tracking
8. Profile/progress screen
9. Second mini-game: **Cache the Crowd**
10. Third mini-game: **Context Packager**
11. PWA installability
12. Capacitor-ready mobile path

Three excellent mini-games are better than many shallow ones.

## Required Tech Direction

Use this stack unless the user explicitly changes it:

- React
- TypeScript strict mode
- Vite
- React Router
- Storybook
- Vitest
- React Testing Library
- user-event
- jest-dom
- Playwright for critical E2E flows
- CSS custom properties with CSS Modules or colocated CSS
- TanStack Query for server state
- Zod for validation
- Better Auth with Prisma adapter for auth
- Prisma
- PostgreSQL
- Vercel Functions
- Vercel deployment
- GitHub Actions
- vite-plugin-pwa
- Capacitor for the future iOS/Android app shell
- GSAP only for intentional timeline-based educational motion
- DOM/SVG first for game rendering
- PixiJS only later if a specific level needs canvas performance
- Howler.js or a very small Web Audio abstraction for sound effects
- Capacitor Haptics for native haptic feedback when the mobile shell exists
- PostHog or a small analytics abstraction
- Sentry or equivalent error monitoring

Do not add:

- Next.js
- Tailwind
- shadcn/ui
- Redux
- GraphQL
- Phaser
- Three.js
- Framer Motion if GSAP is already chosen
- A custom game engine
- Runtime AI-generated lessons

Unless the user explicitly asks.

## Product Design Rules

Every mini-game must have:

- One learning objective
- One misconception it corrects
- One clear visual metaphor
- One primary interaction mechanic
- Immediate feedback
- A visible system reaction
- A concise explanation after interaction
- A transfer challenge
- Keyboard/touch accessibility strategy
- Reduced-motion behavior
- Sound-off equivalent
- Testable success conditions

Every game should follow this loop:

1. Hook
2. Predict
3. Simulate
4. React
5. Explain
6. Transfer

The interaction should teach the concept directly. Do not simply decorate a quiz with animations.

## Visual and Brand Direction

The working name is **Logiclings**.

The logo/mascot direction:

- Small soft creature
- Built from a code loop, node, connector, or bracket shape
- Two node-like eyes
- Friendly but not childish
- Works as favicon, app icon, mascot, and achievement badge
- Supports track-specific variants later

Visual feel:

- Playful handheld app
- Soft geometric UI
- Bright accents over calm neutral surfaces
- Tactile controls
- Clear typography
- Small delightful reactions
- No overloaded motion
- No corporate SaaS dashboard feel

## Sound and Micro-Reactions

Sound and feedback are part of the teaching system.

Add feedback deliberately:

- Tap
- Pick up
- Place
- Valid target
- Invalid target
- Success
- Mistake
- Unlock
- Streak

Rules:

- Sound must be optional.
- Haptics must be optional.
- Reduced-motion must be supported.
- Sound cannot be the only way to understand feedback.
- Motion cannot be the only way to understand feedback.
- Feedback must clarify cause and effect.

## Architecture Rules

Build boundaries first:

- `src/app` for app shell, providers, routes, and router setup.
- `src/components` for shared UI using atomic design only where helpful.
- `src/features` for product areas like auth, progress, streaks, tracks, and settings.
- `src/games/runtime` for the shared mini-game runtime contract.
- `src/games/shared` for reusable game UI and primitives.
- `src/games/[game-slug]` for individual mini-games.
- `src/learning` for track catalog, lesson schemas, mastery rules, and content.
- `src/lib` for api, auth, analytics, validation, audio, haptics, and motion utilities.
- `src/server` for route handlers, services, auth integration, and Prisma access.
- `prisma` for schema and migrations.
- `public/sounds`, `public/icons`, and `public/mascots` for static assets.

Keep mini-games isolated. Shared behavior belongs in the runtime or shared game primitives, not copied across games.

## Development Workflow

Follow the repo workflow:

1. Update `context/current-feature.md`.
2. Work on a feature branch.
3. Keep the scope small.
4. Implement only the active feature.
5. Add or update tests.
6. Add Storybook stories for reusable UI or meaningful game states.
7. Verify mobile-first.
8. Run checks.
9. Update `CHANGELOG.md` under `## [Unreleased]`.
10. Ask before committing.

Do not commit without permission.

Do not add AI attribution, generated-by footers, or co-author trailers.

## Before Implementing Any Feature

Restate:

1. The goal
2. The files expected to change
3. The risks
4. The verification plan
5. What will not be done
6. The current branch
7. The intended feature branch
8. Whether the working tree is clean

Then proceed only within that scope.

## First Task Recommendation

Start with a foundation feature:

`context/features/01-project-foundation.md`

Goal:

Create the initial Vite React TypeScript app foundation with Storybook, Vitest, React Testing Library, linting, formatting, basic routing, design token entry points, and a minimal mobile-first shell.

Do not implement auth, Prisma, games, GSAP, sound, or mobile app shell in the first feature. Those should come later as scoped features.
