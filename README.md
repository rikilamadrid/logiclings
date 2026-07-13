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

`npm run dev` serves the app only. The catalog and the mini-games work without
a backend; signing in and saving progress need the API and a database — see
[Environment and database](#environment-and-database).

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

## Environment and database

Auth and progress persistence run on Vercel Functions (`api/`) backed by
PostgreSQL through Prisma, with sessions from Better Auth.

Copy `.env.example` to `.env` and fill it in:

| Variable             | Purpose                                                     |
| -------------------- | ----------------------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string (Prisma migrations + runtime). |
| `BETTER_AUTH_SECRET` | Session signing secret — `openssl rand -base64 32`.         |
| `BETTER_AUTH_URL`    | Origin auth cookies/callbacks are issued against.           |

Then create the schema and run the app with its API:

```bash
npm run db:deploy       # apply migrations (prisma migrate deploy)
npm run dev:api         # vercel dev — serves the app *and* /api
```

Database commands:

```bash
npm run db:generate     # regenerate the Prisma client (also runs on postinstall)
npm run db:migrate      # create + apply a migration in development
npm run db:studio       # browse the data
```

The Prisma client is generated into `generated/` (gitignored) on `postinstall`,
so a fresh clone and CI typecheck without a database. Anything that actually
talks to Postgres — `db:migrate`, `db:deploy`, `db:studio`, the running API —
needs a real `DATABASE_URL`.

The auth/progress end-to-end spec is skipped unless the API is running:

```bash
E2E_WITH_API=1 npm run test:e2e
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
