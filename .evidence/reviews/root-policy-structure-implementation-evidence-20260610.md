# Root Policy Structure Implementation Evidence - 2026-06-10

## Scope

Implemented the root-owned repo operations policy structure for the current
folder-structure cleanup plan.

Primary changed paths:

- `AGENTS.md`
- `REPO_OPERATIONS.md`
- `package.json`
- `scripts/validate-repo-operations.mjs`
- `scripts/validate-team-doc.mjs`
- `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md`
- `team-doc/mobile-app-dev-team/README.md`
- `team-doc/mobile-app-dev-team/99-source-map.md`

Existing unrelated dirty/untracked paths were present before or outside this
change set, including `PROJECT_ENVIRONMENT.md`, `docs/CODEX_MCP_ENVIRONMENT.md`,
multiple prior `.evidence/reviews/*` files, and
`team-doc/mobile-app-dev-team/ref-organization/`.

## Reviewer Checkpoints

- Checkpoint 1 reviewer(xhigh): GO.
  - Root policy ownership can proceed.
  - `REPO_OPERATIONS.md` is the root-owned policy SoT.
  - `team-doc/mobile-app-dev-team/` is not the repo-wide policy owner.
  - `scripts/` are validators/gates, not policy owners.
- Checkpoint 2 reviewer(xhigh): GO.
  - Pod-native `codex-cli-auth-setup` skill no longer duplicates the full root
    policy.
  - The skill references `REPO_OPERATIONS.md` and retains pod setup facts:
    `/workspace/new-mobile-app/`, `/workspace/CODEX_MANAGED_PATHS.md`,
    `/workspace/codex-hooks/codex-run`.
  - `README.md` and `99-source-map.md` identify `REPO_OPERATIONS.md` as the
    root-owned repo-wide operating policy.
- Checkpoint 3 reviewer(xhigh): GO.
  - `scripts/validate-team-doc.mjs` validates the new policy-reference model
    and forbids reintroducing duplicated full policy text.
  - `package.json` adds `validate:repo-operations` and composes it into
    `test:runtime` while retaining `validate`, `validate:team-doc`, and
    `test:hooks`.
- Final reviewer(xhigh): GO_WITH_EXTERNAL_BLOCKER.
  - Implementation has no blocking finding.
  - Full runtime/local-harness gates remain blocked by unrelated untracked root
    Claude artifacts.
  - Non-blocking wording finding in `codex-cli-auth-setup/SKILL.md` was resolved
    by changing the registry example to reference `REPO_OPERATIONS.md` for root
    repo operations policy and `AGENTS.md` for runtime instructions.

## Command Evidence

Passed:

```text
pnpm run validate:repo-operations
Validated repo operations policy ownership.
exit 0
```

```text
pnpm run validate:team-doc
Validated team-doc: 71 source files, 32 structured files.
exit 0
```

```text
pnpm run test:hooks
Passed 44 hook fixture tests.
exit 0
```

Blocked by pre-existing/unrelated root Claude artifacts:

```text
pnpm run test:runtime
- root Claude runtime artifact must not be present: CLAUDE.md
- root Claude runtime artifact must not be present: .claude
exit 1
```

```text
pnpm run test:local-harness
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
- root Claude runtime artifact must not be present: CLAUDE.md
- root Claude runtime artifact must not be present: .claude
exit 1
```

Artifact status:

```text
?? .claude/
?? CLAUDE.md
```

Validator source:

```text
scripts/validate-runtime-artifacts.mjs:
const forbiddenRootRuntimeArtifacts = ['CLAUDE.md', '.claude', '.claude-state'];
```

## Scripts And Document Coupling Audit

Observed connections:

- `scripts/validate-repo-operations.mjs` now owns root policy ownership
  validation, not policy authorship. It checks `AGENTS.md`, `REPO_OPERATIONS.md`,
  the pod-native skill, team-doc README, and team-doc source map.
- `scripts/validate-team-doc.mjs` still validates `team-doc/00-source/` and
  `team-doc/10-structured/` because those folders remain source/export evidence
  and generated/reference integrity inputs. This is intentional for now and is
  not equivalent to making those folders current policy owners.
- `scripts/generate-team-doc.mjs` still generates or references
  `team-doc/00-source/` and `team-doc/10-structured/`. That remains generation
  behavior, not current policy ownership.
- `package.json` composes validators explicitly:
  `validate`, `validate:repo-operations`, `validate:team-doc`, `test:hooks`.

Recommendation from this audit:

- Do not delete `team-doc/00-source/` or `team-doc/10-structured/` only because
  scripts or documents reference them.
- Keep `team-doc/00-source/` as immutable source/export evidence unless a later
  archival plan preserves source identifiers and fetch metadata.
- Keep `team-doc/10-structured/` as historical/generated reference material
  until a later migration plan classifies each file.
- If validator ownership is split later, split by responsibility:
  root policy validator, team-doc structure validator, historical source/export
  integrity validator, and generated-reference/crosswalk validator.

## Current Blocker

The remaining full-gate blocker is the untracked root Claude runtime artifacts:

- `CLAUDE.md`
- `.claude/`

They were not deleted because they are untracked existing artifacts outside the
implemented change set. Removing them should be an explicit cleanup action.
