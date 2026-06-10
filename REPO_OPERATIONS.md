# Repo Operations

This document is the canonical root-owned operating policy for this repository.
It explains where repo-wide operating rules live and how validators enforce
them. It does not replace `AGENTS.md` as the mandatory agent instruction
entrypoint, and it does not replace `PROJECT_ENVIRONMENT.md` as the current
runtime facts document.

## Policy Ownership Map

| Path | Owner Role |
| --- | --- |
| `AGENTS.md` | Mandatory agent execution rules, constraints, runtime paths, and required gates. |
| `PROJECT_ENVIRONMENT.md` | Current runtime and environment facts. |
| `REPO_OPERATIONS.md` | Canonical repo-wide operating policy and policy ownership model. |
| `team-doc/mobile-app-dev-team/` | Team, role, process, reference, and migration documentation. |
| `team-doc/00-source/` | Immutable Confluence source/export evidence. |
| `team-doc/10-structured/` | Generated or structured reference layer, not current policy owner. |
| `TEAM_DOC_ARCHIVE_MANIFEST.json` | Root-owned archive metadata for historical team-doc source/reference corpus. |
| `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` | Root-owned archived content bundle for historical team-doc source/reference corpus. |
| `scripts/` | Executable validation and test tooling, not policy owner. |

When these documents conflict, use the narrowest authoritative owner:
`AGENTS.md` for agent instructions, `PROJECT_ENVIRONMENT.md` for runtime facts,
this file for repo-wide operating policy, and role/team docs for role-specific
process detail.

## Document Strata

- Root policy and runtime files are the current canonical layer for repo-wide
  operations.
- `docs/confluence/**` is a local publication mirror and evidence area. It is
  not the active runtime SoT, and local runtime gates must not require live
  Confluence access or require `docs/confluence/**` as current policy input.
- Confluence page IDs, versions, source URLs, and fetched timestamps are
  provenance/refetch anchors. Preserve them in local snapshots, crosswalks, and
  archive evidence unless a separate source-refresh or archive migration is
  approved.
- Team docs describe how roles, processes, evidence, and migrations work within
  the mobile app development team.
- `team-doc/00-source/` preserves source/export evidence and should not be
  rewritten as current operating policy.
- `team-doc/10-structured/` remains a generated/reference layer until a
  separately approved migration or archive plan changes that status.
- `TEAM_DOC_ARCHIVE_MANIFEST.json` and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` are the
  root-owned archive metadata and root-owned archived content used for
  delete-ready validation after the historical corpus is captured.

Do not delete, rewrite, or migrate `team-doc/00-source/` or
`team-doc/10-structured/` only because scripts or documents reference them.
Classify each reference first as current invariant, source/export integrity,
generated/reference traceability, migration evidence, or accidental coupling.

## Source And Archive Rules

`team-doc/00-source/` is immutable source/export evidence by default. If it is
ever moved or archived, the change must preserve `pageId`, source version,
`fetchedAt`, `sourceUrl`, and an explicit archive/sourcePath strategy before
the original path is removed.

`team-doc/10-structured/` is generated/reference material by default. It may be
used as migration input, historical examples, or generated integrity evidence,
but it is not the canonical owner of current repo-wide policy. A migration plan
must classify each structured reference before moving, rewriting, archiving, or
dropping it.

After archive capture, `TEAM_DOC_ARCHIVE_MANIFEST.json` is the root-owned
archive metadata SoT and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` is the root-owned
archived content SoT for the historical `team-doc/00-source/`,
`team-doc/10-structured/`, and `team-doc/_meta/` corpus. The bundle is the
explicit archive/sourcePath strategy: restore by writing each JSONL entry's
`content` to its recorded `path`. Once the root archive files validate and a
temp-workspace deletion check passes, the legacy directories are delete-ready
from a repo validation perspective.

## OpenClaw And Codex Operational Boundaries

Pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` at runtime
and are authored under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/`.
Repo-local Codex skills and agents use `.agents/skills/<skill-name>/SKILL.md`
and `.codex/agents/<agent-name>.toml`.

### Codex-only Repo Work Policy

For OpenClaw pods operating on a Codex-managed repository, repository work must
be routed through Codex CLI. The pod-local AGENTS.md policy should stay
agent-neutral and describe `this agent`, `assistant`, or `the agent`, not a
specific personal name. Codex-managed paths are listed in
`/workspace/CODEX_MANAGED_PATHS.md`, and the repository checkout path for this
project is `/workspace/new-mobile-app/`. The default Codex hook wrapper is
`/workspace/codex-hooks/codex-run` when available.

Do not print or commit auth tokens, API keys, OAuth tokens, refresh tokens,
passwords, or full secret-bearing config contents. Reports must use redacted
status, presence, file mode, and key-name summaries only.

## Evidence Gates

Done requires linked evidence, not status-only prose. For runtime and docs
changes, run the applicable gates from `AGENTS.md` and keep command output with
exit status in evidence.

## Package Script Composition

Active runtime composition:

```text
pnpm run validate
pnpm run validate:repo-operations
pnpm run validate:team-doc
pnpm run validate:work-units
pnpm run validate:work-unit-next
pnpm run validate:eas-evidence
pnpm run test:hooks
```

`pnpm run test:runtime` must compose those active current team/runtime gate
checks. It must not include archive/reference corpus validation as a hidden
runtime requirement.

Archive/reference corpus validation is explicit:

```text
pnpm run validate:team-doc-archive
```

Run `validate:team-doc-archive` when changing, moving, archiving, regenerating,
or auditing `TEAM_DOC_ARCHIVE_MANIFEST.json`, `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`,
historical `team-doc/00-source/`, historical `team-doc/10-structured/`, `_meta`
source maps, or migration crosswalks. Do not treat that command as proof that
the legacy Confluence-shaped corpus is current team/runtime SoT.

Runtime path or harness changes must also run `pnpm run test:local-harness`
unless a source-backed blocker is reported.

Local validation and local harness evidence prove repo-local rules only. They do
not prove actual OrbStack/OpenClaw pod execution, Jira or Confluence behavior,
GitHub branch protection, EAS production submit, or external platform state.
Live Confluence publish/update is external platform work and requires explicit
human approval with target page IDs, current versions, proposed body changes,
and reviewer evidence. It must not be required for local CI or `test:runtime`.

## Validator Responsibility Model

Validators enforce documented policy; they are not the policy owner.

- `scripts/validate-repo-operations.mjs` validates root policy ownership,
  `AGENTS.md` linkage, package script composition, and selected cross-document
  operating-policy invariants.
- `scripts/validate-team-doc.mjs` validates current managed team docs,
  role/process documents, active repo-local skill and agent contracts, pod-native
  skill documentation, and current migration documents. It must not require
  `team-doc/00-source/` or `team-doc/10-structured/` as active current
  team/runtime inputs.
- `scripts/validate-work-units.mjs` validates committed work-unit `status.json`
  artifacts and its own fixtures for the passive `wu-status/v1` status-machine
  schema, including the mobile evidence ladder required before `05-qa-release`
  can be marked `done`. It is repo-local runtime validation only and does not
  prove pod, native, EAS, branch-protection, Jira, Confluence, or other external
  platform state.
- `scripts/ingest-eas-evidence.mjs` validates offline EAS/Maestro fixture ingest
  and redaction into `eas-evidence/v1`. Its self-test is repo-local only and
  does not call EAS, use tokens, run cloud jobs, or prove native behavior.
- `scripts/work-unit-next.mjs` resolves deterministic next actions from
  validated work-unit state and validates its own resolver fixtures. It is
  repo-local orchestration validation only and does not execute role work,
  external platform changes, pod behavior, native behavior, or human approval.
- `scripts/validate-team-doc-archive.mjs` validates archive/reference integrity
  from root archive files: `TEAM_DOC_ARCHIVE_MANIFEST.json` and
  `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`. It must preserve `_meta` source map,
  generated-reference shape, legacy Confluence-shaped corpus checks, and
  migration crosswalk traceability without requiring live
  `team-doc/00-source/` or `team-doc/10-structured/` directories.
- `scripts/generate-team-doc.mjs` is legacy Confluence-shaped corpus generation
  and migration tooling. It is not current team/runtime validation.
- Package scripts compose subvalidators explicitly. Do not rely on hidden
  coupling in a monolithic validator to preserve gate strength.
- Manual or provenance refresh commands must not use a `test:` package script
  prefix unless they execute deterministic local tests. Keep live Atlassian or
  Confluence access out of active runtime gate composition.

Future validator changes must keep required gates explicit in `package.json`
and must include reviewer evidence before removing or demoting an existing check.
