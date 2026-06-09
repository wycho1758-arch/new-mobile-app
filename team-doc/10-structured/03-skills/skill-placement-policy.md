---
docType: "reference"
sourcePageId: "1373667362"
sourceTitle: "01-4. Skills"
sourceVersion: "4"
sourceHeading: "Skill placement policy"
---

# Skill placement policy

Per Codex guidance, a skill packages one repeatable workflow as instruction, reference, and optional script; it should do one thing well, and include a script when deterministic behavior is required.

This organization splits skills into two packs by placement:

- **organization-runtime skill pack** — installed at the agent workspace or user-skill location created via admin-portal/admin-api. Used for organization operations, meetings, PRD/task decomposition, and bootstrap coordination.
- **new-mobile-app repo skill pack** — used inside the app repo for implementation, verification, and release. Committed to `new-mobile-app/.agents/skills`.

Notes on scope:

- The current `.codex/skills` in this project is operator-side tooling used for authoring and verifying this report, not the runtime pack the generated organization uses.
- Codex repo-scoped skills checked into the new mobile repo default to repo root `.agents/skills`.
- `.agents/skills` is not part of the Confluence template structure; it is added as an organization operations layer after the template repo is created in Phase 3.

## Source

- Page ID: 1373667362
- Source heading: Skill placement policy
- Source version: 4
