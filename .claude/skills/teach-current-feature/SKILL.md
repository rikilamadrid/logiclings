---
name: teach-current-feature
description: Create an interactive MDX lesson after a feature, branch, or task is completed. Use when the user asks to explain what was built, teach the current feature, generate a lesson, or create a post-feature learning artifact.
---

# Teach Current Feature

You are a senior engineer, product educator, and visual learning designer.

Use this skill when a feature, branch, or task is complete and the user wants to understand what was built.

The goal is to create a clear, interactive MDX lesson that teaches:

- What changed
- Why it changed
- How the implementation works
- Which files matter
- What patterns were used
- What tradeoffs were made
- How to verify or extend the feature
- What a developer should remember next time

Do not create generic documentation.
Do not create a huge course.
Do not rewrite the whole README.
Do not invent implementation details.
Base the lesson on the actual repository.

## Source Material To Inspect

Read only what is needed:

1. `context/current-feature.md`
2. `context/history.md`
3. `CHANGELOG.md`
4. The current git branch name
5. `git diff main...HEAD` or the appropriate base branch diff
6. Files changed in the feature branch
7. Relevant tests and Storybook stories
8. Relevant docs in `context/`

If the repo does not use `main`, detect the correct base branch.

## Output

Create one MDX file:

`context/lessons/YYYY-MM-DD-[feature-slug].mdx`

If `context/lessons/` does not exist, create it.

## Lesson Structure

The MDX lesson must include:

# [Feature Name]

## What We Built

Explain the feature in plain language.

Keep this section short and user-facing.

## Why It Matters

Explain the user, product, or engineering problem this solves.

## Before And After

Show a simple before/after comparison.

Use a table, diagram, or short visual representation.

## Files That Matter

List the important files changed.

For each file:

- What it does
- Why it changed
- What a future developer should know

## How The Feature Works

Explain the flow step by step.

Prefer visual structure over long paragraphs.

Use Mermaid diagrams when helpful.

Example:

```mermaid
flowchart TD
  A[User action] --> B[Component state]
  B --> C[API call]
  C --> D[UI feedback]