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
| `mobile-app-dev-team/` | Team, role, process, reference, and migration documentation. |
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
and are authored under `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/`.
Repo-local Codex skills and agents use `.agents/skills/<skill-name>/SKILL.md`
and `.codex/agents/<agent-name>.toml`.

`openclaw-pod-skills-sync` is the required bridge from repo SoT to runtime
snapshot: after clone or pull, it copy-syncs
`mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills` into `/workspace/skills`.
It does not replace the repo SoT, and `/workspace/skills` remains only a
runtime snapshot.

### Codex-only Repo Work Policy

For OpenClaw pods operating on a Codex-managed repository, repository work must
be routed through Codex CLI. The pod-local AGENTS.md policy should stay
agent-neutral and describe `this agent`, `assistant`, or `the agent`, not a
specific personal name. Codex-managed paths are listed in
`/workspace/CODEX_MANAGED_PATHS.md`, and the repository checkout path for this
project is `/workspace/projects/Wondermove-Inc/new-mobile-app/`. The default Codex hook wrapper is
`/workspace/codex-hooks/codex-run` when available.

Do not print or commit auth tokens, API keys, OAuth tokens, refresh tokens,
passwords, or full secret-bearing config contents. Reports must use redacted
status, presence, file mode, and key-name summaries only.

## Skill, Agent, And AGENTS.md Terminology

This section is the canonical, single-concept definition for the overloaded terms
`skill`, `agent`, and `AGENTS.md`. Each term maps to exactly one concept. A runtime
location is only where that one concept lives; it is not a separate concept. These
path definitions are grounded in the repo SoT (`AGENTS.md`, `PROJECT_ENVIRONMENT.md`)
as the binding authority, and they align with the official Codex and Claude Code
documentation as recorded in the research evidence at
`.evidence/research/20260613-codex-claude-skill-agent-paths.md` (source URLs and
per-claim verdicts). Repo policy authority is unchanged and still follows the
narrowest-owner model in this file and `AGENTS.md`.

### Skill (one concept)

A skill is a capability folder whose required entrypoint is a `SKILL.md` file
(markdown with a `name`/`description` YAML frontmatter). The same single skill concept
is deployed in three locations:

- Codex CLI repo skill: `.agents/skills/<name>/SKILL.md`
- Claude Code skill: `.claude/skills/<name>/SKILL.md`
- Pod-native OpenClaw skill: `/workspace/skills/<slug>/SKILL.md` at runtime, authored
  under `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`

Claude Code ports are deferred unless an approved porting plan creates them. The
Codex CLI repo skill path remains authoritative for active local runtime
validation.

The phrase "pod agent skills" means pod-native OpenClaw skills (this skill concept),
not custom agents.

### Custom agent (one concept)

A custom agent is a named, specialized subagent definition. The same single agent
concept is stored in two locations:

- Codex CLI custom agent: `.codex/agents/<name>.toml` (TOML; the internal `name` field
  is the identity source of truth, the filename is conventional)
- Claude Code custom agent: `.claude/agents/<name>.md` (markdown; standard path only; currently not generated)

### AGENTS.md (a distinct third concept)

`AGENTS.md` is the plain custom-instructions standard a coding agent reads before
work. It is `not a skill and not a custom agent`. In this repo `AGENTS.md` is also the
mandatory agent execution-rules entrypoint per the Policy Ownership Map.

### Directory trap

The directory name does not match the concept. `.agents/` holds skills, while
`.codex/agents/` holds custom agents. This asymmetry is the documented official
convention; do not place agents under `.agents/` or skills under `.codex/agents/`.

### Non-artifact usages (not the concepts above)

- Operating role / pod role: an organizational LLM role (the six operating roles plus
  the non-LLM Gatekeeper), not a `.codex/agents` artifact.
- Agent/Task dispatch tool: a runtime invocation mechanism, not a stored artifact.

### Standard versus authority

Official vendor documentation is the upstream standard for these path definitions.
Repo policy precedence is unchanged: `AGENTS.md` first, then `PROJECT_ENVIRONMENT.md`,
then `REPO_OPERATIONS.md`, then role and team docs.

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
pnpm run validate:project-environment
pnpm run validate:evidence-hygiene
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

## Local Harness Applicability

Codex runtime and harness changes must also run `pnpm run test:local-harness`
unless a source-backed blocker is reported. This includes `.agents/**`,
`.codex/**`, `evals/local-harness/**`, local harness scripts, Codex hook/review
scripts, workflow gate configuration, root runtime policy files, `package.json`,
and `pnpm-lock.yaml`.

Changes under `mobile-app-dev-team/reports/**` use `validate:evidence-hygiene`
and diff checks; local harness is not required unless the same change also
touches Codex runtime or harness paths. They do not trigger the active
`validate:team-doc` runtime gate unless a directly managed runtime source or
routing-support dependency is also changed.

Changes under `mobile-app-dev-team/ref-organization/**` use
`validate:reference-docs`; local harness is not required unless the same change
also touches Codex runtime or harness paths. They do not trigger the active
`validate:team-doc` runtime gate unless a directly managed runtime source or
routing-support dependency is also changed.

Changes under `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/**`
use targeted pod-native smoke plus `test:runtime`; local harness is not required
unless the same change also touches Codex runtime or harness paths.

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
- `scripts/validate-team-doc.mjs` is the composition wrapper for current
  managed runtime docs. It runs only `validate-runtime-sources` and the focused
  `validate-runtime-routing-support` check so broad reference, archive, report,
  workflow, governance, structure, and managed parity churn does not become a
  mandatory runtime gate unless it is directly required by pod-native skills,
  runtime SOUL identity, or Codex CLI routing.
- `scripts/validate-team-doc-structure.mjs` validates the current
  `mobile-app-dev-team/**` structure registry, source-map terms, RED/valid
  structure fixtures, and rejects numbered current top-level docs after the
  physical path rename.
- `scripts/validate-runtime-sources.mjs` validates runtime-source docs such as
  role SOUL files, the Codex skill/agent matrix, pod-native OpenClaw skills,
  pod-native runtime specs, and pod bootstrap source docs. It is repo-local and
  does not prove live `/workspace/skills` installation.
- `scripts/validate-runtime-routing-support.mjs` validates only the
  routing-support SoT directly named by `codex-role-workflow` and rejects
  resolving managed repo SoT from `/workspace/skills/codex-role-workflow`.
- `scripts/validate-workflow-docs.mjs` validates current workflow and durable
  handoff docs such as work processes, GitHub artifact workflow, native E2E
  strategy, entry-case routing, and sample work-unit READMEs. It is standalone
  docs-quality validation, not part of the active `validate:team-doc` runtime
  gate.
- `scripts/validate-governance-docs.mjs` validates governance docs such as
  `AGENTS.md`, SoT/principles, gates/evidence, human/ops live readiness, and
  rollback boundaries. It is standalone docs-quality validation.
- `scripts/validate-reference-docs.mjs` validates `ref-organization`, source
  map, completed-plan archive placement, and reference/archive crosswalk
  invariants without treating historical `team-doc/00-source/` or
  `team-doc/10-structured/` as current runtime inputs.
- `scripts/validate-team-doc-managed.mjs` is a parity backstop copied from the
  prior monolithic validator for this split checkpoint. It preserves existing
  detailed term checks while the new surface validators provide clearer failure
  ownership. It is not part of active `validate:team-doc` runtime composition
  and must not become the only validator path again.
- `scripts/validate-work-units.mjs` validates committed work-unit `status.json`
  artifacts and its own fixtures for the passive `wu-status/v1` status-machine
  schema, including the mobile evidence ladder required before `05-qa-release`
  can be marked `done`. It is repo-local runtime validation only and does not
  prove pod, native, EAS, branch-protection, Jira, Confluence, or other external
  platform state.
- `scripts/ingest-eas-evidence.mjs` validates offline EAS/Maestro fixture ingest
  and redaction into `eas-evidence/v1`. Its self-test is repo-local only and
  does not call EAS, use tokens, run cloud jobs, or prove native behavior.
- `scripts/validate-project-environment.mjs` validates offline drift between
  `PROJECT_ENVIRONMENT.md` and executable repo facts such as package manager
  pin, mobile package versions, MCP pins, quality-gate runtime path detection,
  package script composition, and local snapshot metadata. Its self-test is
  repo-local only and does not call Confluence, Atlassian, Railway, EAS, GitHub,
  mobile-mcp, devices, pods, or external platform services.
- `scripts/validate-evidence-hygiene.mjs` validates durable evidence hygiene for
  `.evidence/` and `docs/plans/work-units/`, including forbidden evidence paths,
  `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` naming, and shared secret-pattern
  scanning. Its self-test is repo-local only and does not call external services.
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
