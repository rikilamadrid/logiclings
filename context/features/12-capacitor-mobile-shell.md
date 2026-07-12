# Feature Spec: Capacitor Mobile Shell

## Status

Not Started

## Overview

Wrap the existing React/Vite web app with Capacitor to produce iOS and Android
app shells, wiring real haptic feedback and verifying the full app (including
auth) inside the native shell.

## Problem

The app is web/PWA-only. There's no native app-store-distributable shell, and
the haptics service (stubbed as a no-op since feature 05) has no real backing implementation.

## Goal

The same React/Vite codebase runs inside a Capacitor-wrapped iOS and Android
shell, with working navigation, auth, gameplay, safe-area handling, and real
native haptic feedback on supported devices.

## Requirements

- Capacitor installed and configured; `ios/` and `android/` platform projects
  generated (per `context/project-overview.md`, these are added only at this phase, not earlier).
- App icon and launch/splash assets generated for both platforms from the brand
  assets established in feature 02.
- Safe-area insets verified/adjusted for native shells (notches, home indicators, status bars).
- `src/lib/haptics` real implementation via Capacitor Haptics, replacing the
  feature-05 no-op stub, wired into the same trigger points already used by the audio/haptics call sites.
- Authentication flow (Better Auth, feature 06) verified working inside the
  native WebView shell (redirects, cookies/session handling, etc. — adjust
  auth configuration if the native context needs a different flow, e.g., deep-link callback).
- Sound and haptics settings (from Settings, if implemented by this point) respected inside the native shell.
- Basic native QA pass across the app's core flows: sign-in, track browsing,
  playing each of the three MVP mini-games, profile, streak.
- Document build/run commands for iOS and Android in this feature's branch
  notes and, if durable, in `CLAUDE.md`.

## Out Of Scope

- App Store / Play Store submission itself (this feature produces
  app-store-*readiness*, not a published listing).
- Native-only features beyond haptics and safe-area handling (no native push,
  no native-only UI divergence) — per project-overview guidance, avoid native-specific divergence unless necessary.
- Any new gameplay content or mini-games.
- Deep platform-specific redesigns; the web/PWA UI should carry over largely as-is.

## UX Notes

- Respect safe-area insets on all screens, not just the shell chrome.
- Haptic feedback should reinforce existing visual/audio feedback, never
  replace it, per the Motion/Sound rules in `context/project-overview.md`.
- Verify touch target sizing still holds up on real device screens, not just
  the desktop browser's mobile emulation.

## Technical Notes

Likely files/directories:

- `capacitor.config.ts`
- `ios/`, `android/` (generated platform projects)
- `src/lib/haptics/hapticsService.ts` (real Capacitor Haptics implementation)
- `src/styles/` safe-area token adjustments if gaps are found

Implementation notes:

- Follow `context/project-overview.md` Deployment and Mobile Distribution → App
  Store path guidance: shared codebase, native wrapper, avoid divergence unless necessary.
- Keep the haptics service's public interface unchanged from feature 05 where
  possible — this feature should mostly be a swap of the implementation behind
  the existing interface, not a rewrite of call sites.

## Acceptance Criteria

- App builds and runs in iOS and Android simulators/emulators via Capacitor.
- Auth flow works end-to-end inside the native shell.
- All three MVP mini-games are playable inside the native shell with working
  haptic feedback on a real or simulated device that supports it.
- Safe-area insets are respected across core screens.
- `npm run build` passes and Capacitor sync/build steps complete without errors.
- `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

- Manual QA pass on iOS simulator and Android emulator (or real devices if
  available): sign-in, track browsing, all three mini-games, profile, streak.
- Confirm haptic feedback fires at existing trigger points on a real device.
- Confirm safe-area handling on a notched/gesture-nav device or simulator profile.
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- Capacitor build/sync commands for iOS and Android.

## References

- `context/project-overview.md` (Deployment and Mobile Distribution → App Store path section)
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`
- `context/features/05-event-bubbling-bubbles.md`
- `context/features/06-auth-persistent-progress.md`
- `context/features/11-pwa-installability.md`

## Suggested Branch

`feature/12-capacitor-mobile-shell`

## Suggested Commit

`feat: add Capacitor iOS and Android mobile shell`
