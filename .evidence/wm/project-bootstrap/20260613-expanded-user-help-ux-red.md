# Project Bootstrap Expanded User Help UX RED Evidence

Date: 2026-06-13
Phase: 1 RED tests and validator

## Scope

Updated RED coverage before implementation:

- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `scripts/validate-team-doc.mjs`

The active plan progress was updated in
`docs/plans/active/20260613-project-bootstrap-expanded-user-help-ux-plan.md`.

## Commands

### `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`

Exit: 1, expected RED.

Key failure:

```text
TypeError: Cannot read properties of undefined (reading 'language')
```

Interpretation: current `project-bootstrap-preflight.sh` does not yet write
`user_summary.language.*`, so the new Korean language contract test fails before
implementation.

### `node scripts/validate-team-doc.mjs`

Exit: 1, expected RED.

Key failure families:

```text
project-bootstrap/SKILL.md missing PROJECT_BOOTSTRAP_USER_LANGUAGE / current-language contract terms
blocker-resolution-guide.md missing full blocker matrix and browser/computer-use login terms
report-template.md missing user_summary.language.* and Korean generated heading terms
project-bootstrap-preflight.sh missing language selection, Korean output, expanded blocker matrix, and support-only raw blocker terms
```

Interpretation: validator now requires the docs and generator to encode the
expanded plan before this implementation can go GREEN.

## Sub-Agent Input

- Validator RED assertions were patched by sub-agent `Planck`, limited to
  `scripts/validate-team-doc.mjs`.
- Read-only audit sub-agent `Raman` identified additional RED gaps:
  auto/invalid language fallback, support details language metadata,
  package-manager/pnpm coverage, full matrix coverage, dynamic support-only raw
  blocker checks, and stronger open/guide login wording.
  Those gaps were folded into the smoke/validator coverage before this RED run.

## Reviewer NO_GO And Fixes

First RED coverage reviewer run returned `NO_GO` with two Medium findings:

- Explicit `PROJECT_BOOTSTRAP_USER_LANGUAGE=en` behavior was not executable
  smoke-covered.
- Generated Markdown support-detail language metadata was not executable
  smoke-covered.

Fixes added before rerun:

- Added an explicit `PROJECT_BOOTSTRAP_USER_LANGUAGE="en"` smoke path with
  `user_summary.language.requested/current_user_hint/selected/fallback_reason`
  assertions.
- Added generated blocker Markdown assertions for `Selected language: en` and
  Korean-mode `Selected language: ko`.
- Added invalid requested-language blocker Markdown assertion for
  `Fallback reason: unsupported_requested_language`.

Rerun command status after fixes:

```text
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
Exit: 1, expected RED at missing user_summary.language.* before implementation.

node scripts/validate-team-doc.mjs
Exit: 1, expected RED for missing project-bootstrap docs/generator terms before
implementation.
```

## Phase 1 RED Reviewer GO

Reviewer rerun:

```text
node scripts/codex-headless-review.mjs --json-envelope --agent wm-implementation-reviewer --prompt .evidence/wm/project-bootstrap/20260613-expanded-user-help-ux-red-review-prompt.md --out .evidence/wm/project-bootstrap/20260613-expanded-user-help-ux-red-review-rerun-4.md
Exit: 0.
Verdict: GO.
Next action: proceed.
```

Phase 2 implementation is authorized after this reviewer GO.

Second RED coverage reviewer rerun returned `NO_GO` with one Medium finding:

- Valid `PROJECT_BOOTSTRAP_USER_LANGUAGE=auto` hint mapping was not executable
  smoke-covered.

Fix added before the next rerun:

- Added `PROJECT_BOOTSTRAP_USER_LANGUAGE="auto"` with
  `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="ko-KR"` asserting selected `ko`.
- Added `PROJECT_BOOTSTRAP_USER_LANGUAGE="auto"` with
  `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="en-US"` asserting selected `en`.

Rerun command status after this fix:

```text
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
Exit: 1, expected RED at missing user_summary.language.* before implementation.

node scripts/validate-team-doc.mjs
Exit: 1, expected RED for missing project-bootstrap docs/generator terms before
implementation.
```

Third RED coverage reviewer rerun returned `NO_GO` with one Medium finding:

- `missing_current_user_language_hint` fallback reason was not executable
  smoke-covered in generated Markdown support details.

Fix added before the next rerun:

- Made the `PROJECT_BOOTSTRAP_USER_LANGUAGE="auto"` plus empty
  `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` smoke path generate blocker
  Markdown using a blocked nested pod-role report.
- Added Markdown assertions for `Selected language: en` and
  `Fallback reason: missing_current_user_language_hint`.

Rerun command status after this fix:

```text
bash -n evals/skills/project-bootstrap-agent-setup-smoke.sh
Exit: 0.

node --check scripts/validate-team-doc.mjs
Exit: 0.

bash evals/skills/project-bootstrap-agent-setup-smoke.sh
Exit: 1, expected RED at missing user_summary.language.* before implementation.
```

Fourth RED coverage reviewer rerun returned `NO_GO` with two Medium findings:

- Full blocker-matrix coverage was partly comment/literal-driven and did not
  force generated-message behavior for missing role identity, managed path, and
  missing pod skill families.
- The ready report path did not enforce
  `user_summary.language.requested/current_user_hint/selected/fallback_reason`.

Fixes added before the next rerun:

- Added ready-path smoke env coverage with
  `PROJECT_BOOTSTRAP_USER_LANGUAGE="auto"` and
  `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="en-US"`, asserting all four
  `user_summary.language.*` fields while status remains `ready_for_bootstrap`.
- Expanded the Korean full blocker-matrix fixture to trigger a real missing
  managed registry and missing pod skill, plus nested pod-role blockers for
  missing role identity, managed path, and missing pod skill.
- Added JSON and Markdown assertions for the widened full-matrix fixture, while
  keeping raw blocker strings constrained to support details and JSON.

Rerun command status after this fix:

```text
bash -n evals/skills/project-bootstrap-agent-setup-smoke.sh
Exit: 0.

node --check scripts/validate-team-doc.mjs
Exit: 0.

bash evals/skills/project-bootstrap-agent-setup-smoke.sh
Exit: 1, expected RED at ready-path missing user_summary.language.* before
implementation.

node scripts/validate-team-doc.mjs
Exit: 1, expected RED for missing project-bootstrap docs/generator terms before
implementation.
```
