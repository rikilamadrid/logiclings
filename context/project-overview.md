# Logiclings — Project Overview

> Logiclings is a playful learning app made of short, interactive mini-games that help developers *feel* software engineering concepts instead of only reading or memorizing them. Each Logicling represents a small mental model from frontend, backend, APIs, databases, algorithms, system design, security, DevOps, AI fundamentals, or agentic coding.

---

## Table of Contents

- [Vision](#vision)
- [Product Positioning](#product-positioning)
- [Target Audience](#target-audience)
- [Core Product Idea](#core-product-idea)
- [Learning Design System](#learning-design-system)
- [Mini-Game Design Framework](#mini-game-design-framework)
- [Initial Learning Tracks](#initial-learning-tracks)
- [MVP Scope](#mvp-scope)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Core Data Models](#core-data-models)
- [Design System](#design-system)
- [Motion, Sound, and Feedback](#motion-sound-and-feedback)
- [Routing](#routing)
- [Authentication and Progress](#authentication-and-progress)
- [Accessibility](#accessibility)
- [Testing Strategy](#testing-strategy)
- [Analytics and Learning Signals](#analytics-and-learning-signals)
- [Performance](#performance)
- [Security and Privacy](#security-and-privacy)
- [Deployment and Mobile Distribution](#deployment-and-mobile-distribution)
- [Build Phases](#build-phases)
- [Conventions and Rules](#conventions-and-rules)
- [Things To Avoid](#things-to-avoid)

---

## Vision

Logiclings should feel like opening a tiny digital toy box for software engineering.

A user should be able to open the app, play one focused challenge for two to five minutes, receive immediate feedback, understand one useful concept, and leave with a memorable mental model.

The product is not primarily a syntax course, quiz app, video library, or LeetCode clone. It teaches through interaction.

| Goal | Description |
| --- | --- |
| Memorable | Every lesson uses a clear visual metaphor and one satisfying mechanic. |
| Effective | The mechanic itself demonstrates the concept rather than decorating an explanation. |
| Friendly | Cute characters, forgiving retries, concise language, and encouraging feedback reduce intimidation. |
| Fast | A learner should reach meaningful interaction within seconds. |
| Replayable | Daily challenges, streaks, mastery scores, alternate scenarios, and improved runs encourage return visits. |
| Extensible | New tracks and mini-games can be added through a shared level contract without rewriting the app shell. |
| Portfolio-worthy | The project demonstrates frontend architecture, game-like interaction, design systems, testing, accessibility, backend data, auth, analytics, and AI-assisted development. |

---

## Product Positioning

Working name: **Logiclings**

Working tagline:

> Tiny games. Big developer instincts.

Brand idea:

- A Logicling is a small, expressive creature formed from a programming concept.
- Each track can have its own Logicling family.
- Logiclings react to correct decisions, mistakes, streaks, retries, and mastery.
- The mascot system should support the logo, onboarding, empty states, achievements, and level feedback.
- The brand should feel intelligent, cute, modern, and welcoming without looking exclusively designed for children.

Logo direction:

- A rounded creature shaped like a soft code loop.
- Two node-like eyes.
- A small tail that hints at a closing bracket, connector, or flow path.
- App-icon safe at small sizes.
- Works as full wordmark, monochrome mark, favicon, mascot badge, and achievement stamp.

---

## Target Audience

| Persona | What they should feel or accomplish |
| --- | --- |
| Early-career developers | Build intuition for concepts that are often explained too abstractly. |
| Self-taught developers | Fill foundational gaps through short, visual experiences. |
| Experienced developers | Refresh concepts, test instincts, and explore newer areas such as AI and agentic coding. |
| Students | Connect textbook concepts to concrete behavior. |
| Interview candidates | Practice explaining why a pattern exists, not only how to name it. |
| Educators and mentors | Use individual mini-games as demonstrations or discussion starters. |

Primary measure of success:

> After completing a mini-game, a learner can explain the concept in their own words and correctly apply the same mental model to a slightly different scenario.

---

## Core Product Idea

Logiclings is a collection of short educational mini-games organized into learning tracks.

Main surfaces:

1. **Home**
   - Continue learning
   - Daily challenge
   - Current streak
   - Recommended next mini-game
   - Recently unlocked Logiclings

2. **Track Map**
   - Categories and progression
   - Completed, available, locked, and mastery states
   - Short descriptions of what each track teaches

3. **Mini-Game Player**
   - One concept
   - One primary mechanic
   - Clear goal
   - Immediate visual, motion, sound, and haptic feedback
   - Retry and reflection flow

4. **Result and Reflection**
   - What happened
   - Why it happened
   - The real software-engineering concept
   - One transfer question or alternate scenario
   - Score, mastery, XP, and streak result

5. **Profile and Progress**
   - Completed games
   - Track mastery
   - Achievements
   - Streak calendar
   - Saved or favorite lessons

6. **Settings**
   - Sound
   - Haptics
   - Reduced motion
   - Theme
   - Account and privacy controls

Core loop:

1. Choose a track or daily challenge.
2. Read a one-sentence mission.
3. Learn the controls through direct manipulation.
4. Solve a short interactive scenario.
5. Receive immediate feedback.
6. See a concise explanation connecting the mechanic to real development.
7. Retry, attempt a variation, or continue to the next concept.
8. Save progress and update streak/mastery.

> Every feature decision should strengthen the learn-by-playing loop rather than turn Logiclings into a generic course platform.

---

## Learning Design System

The project needs a reusable **learning design system**, not only a UI design system.

Every lesson must define:

| Field | Purpose |
| --- | --- |
| Learning objective | One observable thing the learner should understand or do. |
| Prerequisites | Knowledge or completed levels required first. |
| Misconception | The common incorrect mental model the level addresses. |
| Metaphor | The visual world used to represent the concept. |
| Core mechanic | The action the player repeats to learn. |
| System response | How the simulated system reacts to the player. |
| Win condition | What demonstrates sufficient understanding. |
| Failure condition | A recoverable state that makes the misconception visible. |
| Feedback | Immediate, specific, and emotionally supportive response. |
| Reflection | A brief explanation after the interaction. |
| Transfer challenge | A variation that checks whether the concept generalized. |
| Accessibility alternative | Equivalent input and feedback for users who cannot use the default interaction. |
| Telemetry events | Minimal learning signals needed to improve the lesson. |

Learning principles:

- Teach one primary concept per mini-game.
- Make the mechanic represent the concept directly.
- Let the player predict before revealing the result.
- Prefer visible cause and effect over long instructions.
- Use mistakes as demonstrations, not punishments.
- Explain only after the learner has interacted whenever possible.
- Keep text concise and optional during play.
- End with a real-world connection.
- Include a transfer variation before declaring mastery.
- Avoid trivia questions unless recall is truly the learning objective.

---

## Mini-Game Design Framework

Each mini-game follows this rhythm:

### 1. Hook

A visual problem appears immediately.

Example:

> Too many requests are overwhelming Pip's tiny server.

### 2. Predict

The learner chooses, places, routes, sorts, balances, or configures something before the simulation runs.

### 3. Simulate

The system visibly executes the learner's decision.

### 4. React

The Logicling, environment, metrics, sound, and motion communicate the outcome.

### 5. Explain

A concise explanation names the real concept and connects it to the interaction.

### 6. Transfer

A small variation checks whether the learner understood the underlying rule rather than memorizing one solution.

Interaction families:

- Drag and place
- Connect and route
- Sort and prioritize
- Balance resources
- Sequence steps
- Toggle or configure
- Trace execution
- Repair a broken system
- Detect unsupported or unsafe output
- Review and approve a proposed change
- Time a response
- Predict a simulation

Difficulty progression:

1. **Discover** — guided introduction with forgiving feedback.
2. **Apply** — independent version with fewer hints.
3. **Master** — variation, constraint, or tradeoff that requires transfer.

Difficulty should come from deeper reasoning, not faster timers or hidden rules.

---

## Initial Learning Tracks

### Frontend

- Flexbox Factory
- Event Bubbling Bubbles
- Render Rescue
- State Mutation Garden
- Accessibility Signal Path

### Backend

- Request Kitchen
- Rate Limiter Gate
- Queue Rescue
- Authentication Doorways
- Load Balancer Harbor

### APIs

- REST Delivery Routes
- Status Code Dispatcher
- GraphQL Order Builder
- WebSocket Party Line
- Idempotency Stamp

### Databases

- SQL Mystery Room
- Index Library
- Transaction Tower
- Join Junction
- Replication Relay

### Algorithms and Data Structures

- Binary Search Cave
- Sorting Workshop
- BFS vs. DFS Maze
- Hash Table Mailroom
- Stack and Queue Station

### System Design

- Scale the Startup
- Cache the Crowd
- CDN World Tour
- Sharding Districts
- Resilient Checkout

### Networking

- DNS Expedition
- TCP Packet Parade
- HTTP Journey
- Latency Relay
- Retry Storm

### Security

- XSS Shield
- Injection Vault
- Permission Gate
- Secret Scanner
- OAuth Journey

### DevOps

- CI/CD Conveyor
- Container Cargo
- Deployment Rollback
- Observability Control Room
- Kubernetes Pod Rescue

### AI Fundamentals

- Token Tetris
- Embedding Galaxy
- RAG Librarian
- Hallucination Detective
- Temperature Kitchen
- Structured Output Factory
- Model Selector
- Evaluation Arena

### Agentic Coding

- Context Packager
- Task Decomposer
- Spec Defender
- Repository Archaeologist
- Test-Driven Agent
- Diff Review
- Permission Gate
- Dependency Trap
- Infinite Loop Breaker
- Definition of Done

The roadmap should not attempt to build all tracks at once.

---

## MVP Scope

The MVP should prove the product loop with a small but representative vertical slice.

### MVP includes

- Responsive web app
- Installable PWA
- Capacitor-ready iOS and Android shells
- Authentication
- Persistent progress
- Track map
- Daily challenge foundation
- Streak calculation
- Profile/progress screen
- Shared mini-game runtime contract
- Shared result/reflection experience
- Three polished mini-games:
  1. Frontend: Event Bubbling Bubbles
  2. System Design: Cache the Crowd
  3. Agentic Coding: Context Packager
- Storybook component catalog
- Analytics for lesson completion and retry behavior
- Accessibility and reduced-motion support
- Vercel preview and production deployments

### MVP explicitly excludes

- Dozens of unfinished levels
- Social feed
- Multiplayer
- User-generated levels
- AI-generated lessons at runtime
- Competitive global leaderboard
- Paid subscriptions
- Educator dashboards
- Full offline synchronization
- Heavy 3D environments

Three excellent games are more valuable than thirty shallow demonstrations.

---

## Tech Stack

Use stable versions available at implementation time. Verify versions before installation.

| Layer | Technology | Reason |
| --- | --- | --- |
| Web UI | React + TypeScript strict mode | Strong component model and existing expertise. |
| Build Tool | Vite | Fast development and straightforward web/PWA builds. |
| Routing | React Router | Route-based app shell and deep-linkable lessons. |
| Component Catalog | Storybook | Isolated UI, state, interaction, and accessibility development. |
| Styling | CSS Modules or colocated CSS + CSS custom properties | Token-driven styling without a large UI framework. |
| Server State | TanStack Query | Authenticated progress, catalog, profile, and mutation handling. |
| Local Game State | React state/reducer first; Zustand only when a game genuinely needs a standalone store | Avoid global-state overengineering. |
| Forms | React Hook Form | Account/settings/admin forms when useful. |
| Validation | Zod | Shared runtime validation for API inputs, outputs, content, and environment variables. |
| Unit/Component Tests | Vitest + React Testing Library + user-event + jest-dom | Behavior-focused tests aligned with Vite. |
| Browser E2E | Playwright | Critical user flows, auth, progress persistence, and mobile viewport checks. |
| Accessibility Tests | axe-core integrations + manual keyboard/screen-reader checks | Automated guardrails plus human verification. |
| Motion | CSS transitions first; GSAP for orchestrated timelines and simulation feedback | Rich feedback without making every component animation-heavy. |
| 2D Rendering | DOM/SVG first; PixiJS only for levels that need many animated objects or canvas performance | Preserve accessibility and keep the MVP simple. |
| Audio | Howler.js or a tiny Web Audio abstraction | Short UI/game cues, volume controls, and consistent sound triggers. |
| Haptics | Capacitor Haptics | Native feedback on supported devices. |
| Native Wrapper | Capacitor | Package the React/Vite app for iOS and Android while sharing the web codebase. |
| PWA | vite-plugin-pwa | Installability, app manifest, icons, and controlled caching. |
| API Runtime | Vercel Functions using a small typed server layer | Fits deployment target and avoids a separate server initially. |
| API Contract | REST-style JSON endpoints with Zod schemas | Simple, inspectable, and portable. Add tRPC only if shared types materially reduce complexity. |
| Authentication | Better Auth with Prisma adapter | App-owned auth foundation with session support and social providers when added. |
| ORM | Prisma | Typed data access, schema migrations, and developer-friendly models. |
| Database | PostgreSQL; Prisma Postgres, Neon, Supabase Postgres, or another Vercel-compatible provider | Reliable relational storage for users, progress, attempts, streaks, and content metadata. |
| Analytics | PostHog or a small event abstraction | Product and learning telemetry with the ability to change providers. |
| Error Monitoring | Sentry | Production errors, source maps, and performance visibility. |
| CI | GitHub Actions | Typecheck, lint, tests, builds, and Storybook checks. |
| Deployment | Vercel | Preview deployments, serverless API, and production web hosting. |
| Package Manager | npm unless the repository establishes another choice | Keep setup familiar and avoid unnecessary tooling changes. |
| Versioning | Semantic Versioning + Keep a Changelog | Traceable releases. |

Technology rules:

- Do not start with Phaser, Three.js, or a custom game engine.
- Use semantic DOM and SVG for the first games.
- Add PixiJS only after profiling demonstrates that DOM/SVG is insufficient for a specific game.
- Use GSAP for deliberate timelines, not every hover or button press.
- Use CSS for small transitions and state changes.
- Keep the mini-game API renderer-agnostic so different games can use DOM, SVG, or canvas.
- Do not introduce both Framer Motion and GSAP.
- Do not add Redux.
- Do not add GraphQL during the MVP.
- Do not use AI generation in the critical gameplay loop during the MVP.

---

## Architecture

Use a single repository with explicit boundaries.

```text
Web / Capacitor App
        |
        | HTTPS JSON
        v
Vercel API Functions
        |
        +---- Better Auth
        |
        +---- Progress Service
        |
        +---- Catalog Service
        |
        +---- Streak Service
        |
        v
Prisma
        |
        v
PostgreSQL
```

Frontend layers:

1. **App shell**
   - Routing
   - Providers
   - Authentication state
   - Global navigation
   - Error boundaries

2. **Design system**
   - Tokens
   - UI primitives
   - Feedback components
   - Motion recipes
   - Sound/haptic triggers

3. **Learning system**
   - Track catalog
   - Lesson metadata
   - Prerequisites
   - Reflection content
   - Mastery rules

4. **Mini-game runtime**
   - Game lifecycle
   - Input abstraction
   - Pause/restart
   - Attempts
   - Scoring
   - Result events
   - Accessibility mode
   - Renderer boundary

5. **Game implementations**
   - One folder per mini-game
   - Game-specific state machine/reducer
   - Assets
   - Stories
   - Tests
   - Level definitions

6. **Data layer**
   - API client
   - Query keys
   - Mutations
   - Validation
   - Offline-safe local attempt queue only when needed

Backend layers:

- Route handlers
- Auth/session verification
- Zod validation
- Domain services
- Prisma repositories/queries
- Analytics event boundary
- Consistent API errors

Avoid putting Prisma calls directly inside unrelated route logic.

---

## Project Structure

```text
.
├── .github/
│   └── workflows/
├── .storybook/
├── android/
├── context/
│   ├── features/
│   ├── ai-interaction.md
│   ├── coding-standards.md
│   ├── current-feature.md
│   ├── history.md
│   └── project-overview.md
├── ios/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── providers/
│   │   ├── routes/
│   │   └── router/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── features/
│   │   ├── auth/
│   │   ├── progress/
│   │   ├── streaks/
│   │   ├── tracks/
│   │   └── settings/
│   ├── games/
│   │   ├── runtime/
│   │   ├── shared/
│   │   ├── event-bubbling/
│   │   ├── cache-the-crowd/
│   │   └── context-packager/
│   ├── learning/
│   │   ├── catalog/
│   │   ├── schemas/
│   │   └── mastery/
│   ├── lib/
│   │   ├── analytics/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── audio/
│   │   ├── haptics/
│   │   ├── motion/
│   │   └── validation/
│   ├── server/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── routes/
│   │   └── services/
│   ├── styles/
│   ├── test/
│   └── types/
├── api/
├── public/
│   ├── icons/
│   ├── mascots/
│   └── sounds/
├── brand/
│   └── logiclings-logo.svg
├── CHANGELOG.md
├── AGENTS.md
├── CLAUDE.md
├── package.json
└── README.md
```

Generated `ios/` and `android/` folders should be added only when the mobile phase begins.

---

## Core Data Models

The final Prisma schema should evolve through small migrations. These types describe the intended domain.

```ts
type TrackSlug =
  | "frontend"
  | "backend"
  | "apis"
  | "databases"
  | "algorithms"
  | "system-design"
  | "networking"
  | "security"
  | "devops"
  | "ai-fundamentals"
  | "agentic-coding";

type MasteryState = "not_started" | "discovering" | "applied" | "mastered";

interface Track {
  id: string;
  slug: TrackSlug;
  title: string;
  summary: string;
  order: number;
  iconKey: string;
  accentToken: string;
}

interface Lesson {
  id: string;
  trackId: string;
  slug: string;
  title: string;
  summary: string;
  learningObjective: string;
  misconception: string;
  estimatedMinutes: number;
  difficulty: 1 | 2 | 3;
  version: number;
  status: "draft" | "published" | "retired";
  prerequisiteLessonIds: string[];
}

interface LevelDefinition {
  id: string;
  lessonId: string;
  mode: "discover" | "apply" | "master";
  objective: string;
  mechanic: string;
  winCondition: string;
  reflection: string;
  contentVersion: number;
}

interface UserProgress {
  userId: string;
  lessonId: string;
  masteryState: MasteryState;
  bestScore: number | null;
  attempts: number;
  completedAt: string | null;
  lastPlayedAt: string | null;
  lessonVersion: number;
}

interface Attempt {
  id: string;
  userId: string;
  lessonId: string;
  levelId: string;
  startedAt: string;
  completedAt: string | null;
  outcome: "completed" | "failed" | "abandoned";
  score: number | null;
  mistakeCodes: string[];
  hintCount: number;
  durationMs: number | null;
  clientAttemptId: string;
}

interface Streak {
  userId: string;
  currentDays: number;
  longestDays: number;
  lastQualifiedDate: string | null;
  timezone: string;
}

interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconKey: string;
}
```

Data rules:

- Lesson definitions should be versioned.
- Progress should record the lesson version used.
- A client-generated attempt ID should make completion mutations idempotent.
- Streak dates must use the user's configured timezone.
- Do not store every pointer movement or unnecessarily detailed behavioral telemetry.
- Core lesson content should begin as typed, version-controlled local data.
- The database stores user state and publication metadata; it should not become an unstructured content dump.

---

## Design System

Logiclings should feel like:

- A polished handheld game
- Soft geometric shapes
- Expressive but restrained character animation
- Friendly editorial illustration
- Clear information hierarchy
- Tactile controls
- Bright track accents on a calm neutral foundation

It should avoid:

- Corporate dashboard styling
- Neon cyberpunk clichés
- A childish preschool appearance
- Overloaded gradients
- Excessive glassmorphism
- Constant motion
- Dense course-management UI

Token categories:

- Neutral and semantic colors
- Track accent colors
- Typography
- Spacing
- Radius
- Borders
- Elevation
- Motion duration/easing
- Feedback intensity
- Z-index
- Touch target sizing
- Safe-area insets
- Sound volume levels
- Haptic intensity labels

---

## Motion, Sound, and Feedback

Feedback is part of the teaching mechanism.

Feedback layers:

1. **Immediate**
   - Control press
   - Drag pickup
   - Valid target
   - Invalid target

2. **System**
   - Requests begin flowing
   - A cache absorbs traffic
   - A render propagates
   - Context exceeds a budget

3. **Outcome**
   - Success
   - Recoverable mistake
   - Retry
   - Mastery unlock

Motion rules:

- Use CSS transitions for ordinary UI states.
- Use GSAP for multi-step simulations, educational timelines, and coordinated result sequences.
- Motion should reveal causality and system state.
- Every important animation requires a reduced-motion behavior.
- Never require a user to track fast movement to understand the result.
- Pause or slow simulation controls should exist when appropriate.
- Do not animate layout continuously while the user is reading.

Sound rules:

- Sound is optional and off-able.
- Use short, soft cues rather than constant background audio in the MVP.
- Correct and incorrect cues must also be communicated visually and textually.
- Do not use sound as the only indication of state.
- Haptics should reinforce, not replace, visual feedback.
- Add sound through a centralized audio service so tests and reduced-sensory settings can disable it.
- Start with a tiny pack: tap, pickup, place, success, mistake, unlock, streak.

---

## Routing

| Route | Purpose |
| --- | --- |
| `/` | Home, daily challenge, streak, and continue-learning state. |
| `/tracks` | All learning tracks. |
| `/tracks/:trackSlug` | Track map and lesson progression. |
| `/play/:lessonSlug` | Mini-game player. |
| `/play/:lessonSlug/result` | Result, reflection, mastery, retry, and next action. |
| `/profile` | Progress, streaks, achievements, and completed lessons. |
| `/settings` | Account, sound, haptics, motion, theme, and privacy controls. |
| `/auth/sign-in` | Sign-in route. |
| `/auth/sign-up` | Sign-up route. |

Routes must work on mobile first and should remain deep-linkable where possible.

---

## Authentication and Progress

Authentication exists to preserve learner progress, streaks, and completion history.

MVP auth expectations:

- Email/password or magic-link sign-in.
- Social auth can be added after the base flow works.
- Authenticated users can persist progress across devices.
- Anonymous trial play may exist later, but it is not required for the first MVP slice.
- API endpoints must verify session ownership before reading or writing progress.
- Streak calculation must be timezone-aware.
- Completion mutations must be idempotent.

---

## Accessibility

Accessibility is required for every user-facing feature.

- Full keyboard access for interactive controls.
- Touch-friendly controls with adequate target size.
- Visible focus states.
- `prefers-reduced-motion` support.
- Sound-off equivalent for every sound cue.
- Text/visual equivalent for haptic-only feedback.
- Sufficient color contrast.
- Semantic headings and labels.
- ARIA only when semantic HTML is not enough.
- Screen-reader-friendly explanations and results.
- Alternative controls for drag-heavy mini-games.
- No important gameplay information communicated by color, sound, or motion alone.

Every mini-game should define an accessibility strategy in its feature spec.

---

## Testing Strategy

Use tests that protect the learning loop without creating brittle animation snapshots.

Required checks:

- TypeScript strict checks.
- Linting.
- Unit tests for utilities, reducers, schemas, scoring, mastery, and streak logic.
- React Testing Library tests for components and core flows.
- Storybook stories for reusable UI and game states.
- Playwright tests for critical routes and progress persistence.
- Accessibility checks for core screens and interactions.
- Manual mobile-first QA.

Avoid:

- Snapshot-heavy tests that break on harmless UI changes.
- Testing GSAP internals.
- Testing implementation details instead of user-observable behavior.
- Over-mocking the mini-game runtime until it no longer resembles real behavior.

---

## Analytics and Learning Signals

Analytics should help improve learning quality and product retention without becoming invasive.

Track:

- Lesson started
- Lesson completed
- Retry selected
- Hint used
- Transfer challenge attempted
- Mastery reached
- Streak qualified
- Sound disabled
- Reduced motion enabled
- Error boundary shown

Do not track:

- Keystroke-level details
- Highly sensitive personal data
- Unnecessary raw interaction streams
- Private code pasted by users

Create a small analytics abstraction so the provider can change later.

---

## Performance

- Mobile-first performance is the default.
- The first screen should feel fast on mid-range phones.
- Lazy-load game implementations by route.
- Lazy-load heavy visual libraries.
- Keep initial bundle small.
- Use SVG/DOM before canvas unless a game needs many objects.
- Avoid layout thrash in simulations.
- Respect reduced motion.
- Optimize audio loading and avoid blocking initial render.
- Use image and sound compression.
- Keep database calls narrow and indexed.

Suggested budgets:

- Initial route JavaScript should stay intentionally small.
- Individual mini-games may load extra code only on demand.
- No heavy 3D library in the MVP bundle.

---

## Security and Privacy

- Validate all API inputs with Zod.
- Use secure session configuration from the auth provider.
- Never expose secrets to the client.
- Keep environment variables documented and validated.
- Use Prisma migrations.
- Keep dependency additions deliberate.
- Do not store private code snippets or sensitive learning content unless explicitly designed and documented later.
- Prevent users from writing progress or attempts to another user's account.
- Rate-limit sensitive auth and mutation endpoints where appropriate.
- Treat agentic coding content carefully so examples do not encourage unsafe behavior.

---

## Deployment and Mobile Distribution

### Web

- Deploy preview and production builds to Vercel.
- Use GitHub Actions for checks.
- Use Vercel environment variables for database, auth, analytics, and monitoring config.
- Keep production deploys tied to the stable branch.

### PWA

- Add manifest, icons, theme colors, and installability once the app shell is stable.
- Cache shell assets carefully.
- Do not cache authenticated API responses unless explicitly designed.

### App Store path

Use Capacitor after the web MVP loop is stable.

Mobile app expectations:

- Shared React/Vite codebase.
- Native wrapper through Capacitor.
- Safe-area support.
- Haptics through Capacitor.
- App icon and launch assets.
- App Store privacy labels aligned with real tracking behavior.
- Authentication flow tested inside the native shell.
- Sound and haptics settings respected.
- Avoid native-specific divergence unless necessary.

---

## Build Phases

| Phase | Deliverable |
| --- | --- |
| 1 | Foundation: Vite React TypeScript app, Storybook, testing, linting, tokens, routing, CI, and Vercel readiness. |
| 2 | Brand and app shell: Logiclings visual identity, mobile-first navigation, home, track map skeleton, and profile/settings shells. |
| 3 | Learning system: typed track/lesson catalog, level schema, mastery model, and mini-game runtime contract. |
| 4 | First mini-game: Event Bubbling Bubbles with discover/apply/master levels, sound, motion, reduced-motion, tests, and reflection. |
| 5 | Backend/auth/progress: Better Auth, Prisma, PostgreSQL, progress mutations, attempts, streaks, and profile progress. |
| 6 | Second mini-game: Cache the Crowd to prove system design gameplay and reusable runtime patterns. |
| 7 | Third mini-game: Context Packager to prove agentic coding gameplay and review/supervision mechanics. |
| 8 | Daily challenge, achievements, polish, accessibility pass, performance pass, and PWA installability. |
| 9 | Capacitor mobile shell, haptics, app icons, mobile QA, and app-store-readiness documentation. |
| 10 | Public beta: monitoring, analytics review, onboarding refinement, content roadmap, and launch checklist. |

Each phase should produce at least one visible, demoable result.

---

## Conventions and Rules

- Mobile-first, then progressively enhanced.
- One concept per mini-game.
- One feature, one branch, one focused diff, one clean commit.
- Use feature branches for all implementation work.
- Preserve generic workflow docs unless the project needs a real rule change.
- Keep lessons data-driven.
- Keep game implementations isolated behind the mini-game runtime contract.
- Favor semantic DOM/SVG before canvas.
- Prefer CSS and small motion utilities before large animation systems.
- Use GSAP only when timeline-based motion improves learning.
- Centralize sound/haptic controls.
- Add Storybook stories for reusable UI and important game states.
- Do not commit without explicit user permission.
- Do not include AI attribution, co-author trailers, or generated-by footers in commits.

---

## Things To Avoid

- Building a generic quiz app.
- Building a generic course platform.
- Starting with too many tracks.
- Starting with Phaser, Three.js, or custom engine work.
- Adding animation that does not teach or clarify.
- Making all interactions drag-and-drop without keyboard alternatives.
- Designing desktop first.
- Treating sound as required for comprehension.
- Using AI generation for lesson content before the learning model is proven.
- Adding social features before the core loop works.
- Over-instrumenting user behavior.
- Overengineering content management before lesson structure is stable.
