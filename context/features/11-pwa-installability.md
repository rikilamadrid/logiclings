# Feature Spec: PWA Installability

## Status

Not Started

## Overview

Make Logiclings installable as a Progressive Web App: manifest, icons, theme
colors, and a careful service-worker caching strategy via `vite-plugin-pwa`,
now that the app shell, catalog, and all three MVP mini-games are stable.

## Problem

The app currently only runs as a regular web page. There's no manifest, no
install prompt, and no offline/caching story, so it can't be added to a home
screen or feel like a "real" app on mobile.

## Goal

A user on a supported mobile or desktop browser can install Logiclings to their
home screen/app list, launch it with an app-like icon and splash/theme color,
and reload the shell instantly from cache while still getting fresh authenticated data.

## Requirements

- `vite-plugin-pwa` configured with a web app manifest: name, short name,
  description, icons (multiple sizes, using the mascot/icon assets from feature
  02), theme color, background color, display mode (`standalone`).
- App icons generated at all required sizes (including maskable icon variants)
  from the brand assets in `public/icons/`.
- Service worker caching strategy that caches shell/static assets for fast
  repeat loads, per `context/project-overview.md` PWA guidance — do not cache
  authenticated API responses (progress, profile, streak) by default.
- Install prompt handling: either rely on the browser's native install UI or
  add a minimal custom "Install Logiclings" affordance if the product wants one
  — confirm which before building a custom prompt UI.
- Update flow: when a new service worker version is available, prompt the user
  to refresh rather than silently serving stale assets indefinitely.
- Verify the app still works correctly online (no accidental over-caching
  breaking auth or progress reads).

## Out Of Scope

- Full offline gameplay or offline sync of attempts (explicitly excluded from
  MVP per `context/project-overview.md`).
- Capacitor/native app shells (feature 12).
- Push notifications.
- Background sync.

## UX Notes

- Icons must look correct at small sizes (favicon, home-screen icon) and as
  maskable icons (safe-zone padding respected).
- Any custom install prompt must be dismissible and not block core app usage.
- Update-available prompt must be clear and non-disruptive (not a blocking modal during active gameplay).

## Technical Notes

Likely files:

- `vite.config.ts` (vite-plugin-pwa configuration)
- `public/icons/manifest-icon-*.png`, `public/icons/maskable-icon-*.png`
- `public/manifest.webmanifest` (or plugin-generated)
- `src/app/pwa/useServiceWorkerUpdate.ts` (update-prompt hook, if needed)

Implementation notes:

- Follow `context/project-overview.md` PWA guidance exactly: cache shell assets
  carefully, do not cache authenticated API responses unless explicitly designed.
- Keep this scoped to installability and caching — do not fold in Capacitor work.

## Acceptance Criteria

- App manifest is valid and installable (verified via browser install prompt/devtools Lighthouse PWA audit).
- Icons render correctly at all required sizes, including maskable variants.
- Authenticated data (progress, profile, streak) is always fetched fresh, not served stale from cache.
- Service worker update flow prompts the user rather than silently serving stale shell assets.
- `npm run build` passes and produces a valid service worker/manifest output.
- `CHANGELOG.md` updated under `## [Unreleased]`.

## Verification

- Lighthouse PWA audit passes installability checks.
- Manual: install the app on a mobile browser and a desktop browser; confirm icon, name, and standalone launch.
- Manual: confirm progress/profile data is fresh after reload, not stale-cached.
- Manual: ship a trivial change, rebuild, and confirm the update prompt appears for an already-installed instance.
- `npm run build`

## References

- `context/project-overview.md` (Deployment and Mobile Distribution → PWA section)
- `context/coding-standards.md`
- `context/ai-interaction.md`
- `context/current-feature.md`
- `context/features/02-design-system-brand-foundation.md`

## Suggested Branch

`feature/11-pwa-installability`

## Suggested Commit

`feat: add PWA manifest and installability`
