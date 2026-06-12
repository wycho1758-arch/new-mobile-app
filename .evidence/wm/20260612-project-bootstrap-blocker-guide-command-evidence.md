# Project Bootstrap Blocker Guide Command Evidence

Date: 2026-06-12
Scope: `project-bootstrap` blocker guide reference and generated Markdown handoff

## TDD / Validator First

Initial validator failures after adding assertions, before implementation:

- `node scripts/validate-repo-operations.mjs`: FAIL, missing
  `references/blocker-resolution-guide.md`,
  `PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH`, and
  `project-bootstrap-blockers.md` in `project-bootstrap`.
- `node scripts/validate-team-doc.mjs`: FAIL, same missing role-boundary terms.

Post-implementation validator results:

- `node scripts/validate-repo-operations.mjs`: PASS
- `node scripts/validate-team-doc.mjs`: PASS

## Smoke

Command shape:

```bash
tmpdir="$(mktemp -d)"
printf -- "- %s/\n" "$PWD" > "$tmpdir/managed-paths.md"
WM_ROLE=mobile-app-dev \
WM_EXPECTED_ROLE=mobile-app-dev \
REPO_PATH="$PWD" \
CODEX_MANAGED_PATHS="$tmpdir/managed-paths.md" \
PROJECT_BOOTSTRAP_REPORT_PATH="$tmpdir/project-bootstrap-report.json" \
PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="$tmpdir/project-bootstrap-blockers.md" \
POD_ROLE_BOOTSTRAP_REPORT="$tmpdir/missing-pod-role-bootstrap-report.json" \
STITCH_ADC_REPORT="$tmpdir/missing-stitch-report.json" \
EAS_ROBOT_AUTH_REPORT="$tmpdir/missing-eas-report.json" \
bash mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
```

Observed redacted summary:

```json
{
  "status": "blocked",
  "blockerGuide": {
    "status": "written",
    "reference_status": "present"
  },
  "blockerCount": 3,
  "guideExists": true,
  "guideHasResolutionGuide": true,
  "guideHasAgentBoundary": true,
  "guideHasDetectedBlockers": true
}
```

No `pod-role-bootstrap`, `pnpm install`, EAS command, GitHub auth mutation, or
live external operation was run.

## Verification

- `bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`: PASS
- `git diff --check -- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap scripts/validate-repo-operations.mjs scripts/validate-team-doc.mjs .evidence/wm/20260612-project-bootstrap-blocker-guide-plan.md .evidence/wm/20260612-project-bootstrap-blocker-guide-plan-review-prompt.md`: PASS
- `pnpm run validate:evidence-hygiene`: PASS
- `pnpm run test:runtime`: PASS
- `pnpm run test:local-harness`: PASS
- `pnpm turbo run lint test`: PASS

## Notes

- The generated blocker guide path is configurable with
  `PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH`; default runtime path is
  `/workspace/state/project-bootstrap-blockers.md`.
- The generated guide includes detected blocker strings, status-only role/CLI/MCP
  summaries, and `references/blocker-resolution-guide.md`.
- Evidence contains status labels and paths only. It does not contain auth token
  values, OAuth codes, API keys, passwords, ADC JSON, service account JSON,
  database URLs, bearer token values, or private key material.
