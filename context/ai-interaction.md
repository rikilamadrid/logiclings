# AI Interaction Guidelines

## Communication

- Be concise and direct.
- Explain non-obvious decisions briefly.
- Ask before large refactors or architectural changes.
- Do not add features that are not in the spec.
- Do not delete files without clarification.

## Workflow

This is the default workflow for every feature or fix:

1. Document the work in `context/current-feature.md`.
2. Create a branch for the feature or fix.
3. Implement the scoped work only.
4. Verify in the browser when relevant.
5. Run `npm run build` and fix any errors.
6. Add or update changelog entries under `## [Unreleased]`.
7. Ask before committing.
8. Merge only after verification is complete.
9. Update `context/current-feature.md` and `context/history.md` after merge.
10. Delete the branch after the work lands.

Do not commit without permission, and do not commit if the build is failing.

## Branching

- Create a new branch for every feature or fix.
- Use clear names like `feature/<name>` or `fix/<name>`.

## Commits

- Ask before committing.
- Prefer conventional commits unless the repo uses another standard.
- Keep commits focused on one feature or fix.
- Do not include AI attribution, co-author trailers, or generated-by footers.

## Versioning

- Default to Semantic Versioning: `MAJOR.MINOR.PATCH`.
- Keep `CHANGELOG.md` in Keep a Changelog format.
- Add real, human-readable entries under `## [Unreleased]` while the work is in progress.
- Use `PATCH` for backward-compatible fixes.
- Use `MINOR` for backward-compatible features.
- Use `MAJOR` for breaking or intentionally incompatible user-facing changes.
- If the project does not want changelog or release management in-repo, remove this section at project setup time.

## When Stuck

- If something is not working after 2-3 grounded attempts, stop and explain the issue.
- Do not keep trying random fixes.
- Ask for clarification if requirements are genuinely unclear.

## Code Changes

- Make the smallest change that solves the task well.
- Do not refactor unrelated code unless asked.
- Preserve existing patterns unless there is a strong reason to improve them.

## Code Review Priorities

- Security
- Performance
- Logic errors and edge cases
- Accessibility
- Consistency with the existing codebase
