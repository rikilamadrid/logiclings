# Starter Context Kit

Reusable project context for Claude, Codex, and similar coding agents.

This kit is based on the workflow and structure that worked well in RicardoOS,
but the project-specific content has been removed.

## What's included

- `CLAUDE.md` — the main repo guide
- `AGENTS.md` — lightweight pointer for AGENTS-aware tools
- `CHANGELOG.md` — reusable Keep a Changelog starter
- `context/project-overview.md` — product, stack, architecture, and constraints
- `context/coding-standards.md` — code conventions
- `context/ai-interaction.md` — the working agreement for agent collaboration
- `context/current-feature.md` — the live tracker for what is active right now
- `context/history.md` — append-only completed-work log
- `context/features/example-feature-spec.md` — a model feature spec you can copy

## How to use it

1. Copy `starter-context/CLAUDE.md` to your new repo root as `CLAUDE.md`.
2. Copy `starter-context/AGENTS.md` to your new repo root as `AGENTS.md`.
3. Copy `starter-context/CHANGELOG.md` to your new repo root as `CHANGELOG.md`.
4. Copy `starter-context/context/` into your new repo as `context/`.
5. Replace bracketed placeholders like `[Project Name]`.
6. Duplicate `context/features/example-feature-spec.md` for each real feature.
7. Keep `context/current-feature.md` updated before and after each feature.

## What was intentionally left out

- Screenshots
- HTML prototypes
- Project-specific phase specs
- Hosting/provider details tied to one project

## Recommended default stack

This starter assumes the stack that worked well here:

- Next.js 16 (App Router)
- React 19
- TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui + Radix primitives
- Zustand for client state
- MDX for long-form content

If a future project uses a different stack, update `CLAUDE.md`,
`context/project-overview.md`, and `context/coding-standards.md` first so the
agents get the right instructions from day one.

## Versioning

This starter now assumes:

- Semantic Versioning (`MAJOR.MINOR.PATCH`)
- A root `CHANGELOG.md`
- A running `## [Unreleased]` section

If a future repo should not use SemVer or a changelog, remove those rules from
`CLAUDE.md` and `context/ai-interaction.md` before starting work.
