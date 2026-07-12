# Logiclings

Tiny games. Big developer instincts.

Logiclings is a mobile-first, game-like learning app where short interactive
mini-games teach software engineering mental models through play — frontend,
backend, APIs, databases, algorithms, system design, security, DevOps, AI
fundamentals, and agentic coding, one small concept at a time.

## Getting started

```bash
npm install
npm run dev             # Vite dev server
```

Other useful commands:

```bash
npm run build            # typecheck + production build
npm run preview           # preview the production build
npm run lint             # ESLint
npm run typecheck          # tsc --noEmit
npm run test              # Vitest
npm run test:e2e           # Playwright
npm run storybook           # Storybook dev server
npm run build-storybook       # Storybook static build
```

## Project context

Deep context for contributors and coding agents lives in `context/`:

- `context/project-overview.md` — product vision, learning design system,
  stack, architecture, data models, and constraints
- `context/coding-standards.md` — TypeScript, React, styling, testing, and
  file conventions
- `context/ai-interaction.md` — workflow rules for Claude, Codex, and similar
  agents
- `context/current-feature.md` — the active feature tracker
- `context/history.md` — append-only log of completed work
- `context/features/` — per-feature specs, numbered in build order

See `CLAUDE.md` for the full agent-facing guide, including the default stack
and build order.

## Versioning

This project follows Semantic Versioning (`MAJOR.MINOR.PATCH`) with a root
`CHANGELOG.md` in Keep a Changelog style.
