# Feature Spec: Authentication and Persistent Progress

## Status

Not Started

## Overview

Add the backend: Better Auth with the Prisma adapter, PostgreSQL via Prisma, and
the progress/attempt API so a signed-in learner's completions on Event Bubbling
Bubbles persist across sessions and devices.

## Problem

Everything built so far (catalog, runtime, first game) is client-only and
resets on reload. There's no account system and no durable record of what a
learner has done.

## Goal

A user can sign up, sign in, play Event Bubbling Bubbles, and see their
completion persist after a reload or on another device; unauthenticated users
are prompted to sign in before progress-relevant actions are saved.

## Requirements

- Prisma schema for `User` (via Better Auth), `UserProgress`, `Attempt` per the
  Core Data Models in `context/project-overview.md`; PostgreSQL as the database.
- Better Auth configured with the Prisma adapter; email/password or magic-link
  sign-in for the MVP (social providers can come later, out of scope here).
- `/auth/sign-in` and `/auth/sign-up` routes wired to real Better Auth flows,
  replacing the feature-03 placeholders.
- Vercel Functions API layer (`api/` + `src/server`) exposing:
  - session-aware progress read (get `UserProgress` for the current user)
  - idempotent completion mutation (write `Attempt` + update `UserProgress`,
    keyed by `clientAttemptId`)
- All API inputs/outputs validated with Zod; route handlers verify session
  ownership before reading or writing progress for a user.
- Server layer separation per `context/project-overview.md`: route handler →
  auth/session check → Zod validation → domain service → Prisma repository —
  no direct Prisma calls from route handlers.
- Wire Event Bubbling Bubbles' result flow (feature 05) to call the real
  completion mutation instead of local-only state.
- Wire the Track/Lesson catalog views (feature 03) to reflect real
  `UserProgress.masteryState` for the signed-in user instead of the static
  `not_started` placeholder.

## Out Of Scope

- Streak calculation (feature 07) — `Attempt`/`UserProgress` writes happen here, but streak derivation is a separate feature.
- Full Profile/Progress screen UI (feature 08) — this feature only needs progress to persist and be readable, not a polished profile page.
- Social auth providers.
- Anonymous/guest trial play.
- Rate limiting beyond what's trivially available from the auth provider (note as a follow-up if skipped).

## UX Notes

- Sign-in/sign-up forms must be usable on mobile first, keyboard accessible, with clear validation error messaging.
- Do not block game *play* behind auth if avoidable — prompt for sign-in at the point progress would be saved, per common product patterns, unless the user directs otherwise; confirm this decision before implementing if ambiguous.
- Loading and error states required for all progress reads/writes (e.g., save failed, retry).

## Technical Notes

Likely files:

- `prisma/schema.prisma`, `prisma/migrations/*`
- `src/server/auth/betterAuth.ts`
- `src/server/db/client.ts` (Prisma client singleton)
- `src/server/services/progressService.ts`
- `src/server/routes/progress.ts` (or per Vercel Functions convention under `api/`)
- `api/progress/*.ts`, `api/auth/*.ts` (Better Auth handler mount)
- `src/features/auth/*`, `src/features/progress/*`
- `src/lib/api/progressClient.ts` (TanStack Query hooks)

Implementation notes:

- Follow `context/coding-standards.md` server/API rules strictly (thin handlers, service layer, idempotent mutations, session ownership checks).
- Use TanStack Query mutations/queries on the client; do not introduce a second server-state library.
- Document required environment variables (database URL, auth secrets) in this feature's PR/branch notes.

## Acceptance Criteria

- A new user can sign up, sign in, play Event Bubbling Bubbles to completion, and see it marked complete after a page reload.
- Progress is scoped correctly: a user cannot read or write another user's progress (verified by test).
- Completion mutation is idempotent under duplicate `clientAttemptId` submission (e.g., retry after network blip does not double-count).
- Unit tests cover the progress service and mastery/attempt logic.
- API-level tests (or integration tests) cover session ownership enforcement.
- `npm run build` passes.
- `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

- Manual: sign up, play the game, reload, confirm persisted completion; sign in on a second browser/profile and confirm the same state.
- Attempt to access another user's progress via the API directly (e.g., altered request) and confirm it's rejected.
- Submit a duplicate completion mutation and confirm no duplicate `Attempt`/double progress.
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- Playwright: sign-up → play → reload → progress-persisted flow.

## References

- `context/project-overview.md` (Authentication and Progress, Core Data Models, Security and Privacy sections)
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`
- `context/features/05-event-bubbling-bubbles.md`

## Suggested Branch

`feature/06-auth-persistent-progress`

## Suggested Commit

`feat: add authentication and persistent progress`
