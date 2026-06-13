# Project Bootstrap Expanded User Help UX GREEN Evidence

Date: 2026-06-13

## Targeted Checks

```text
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
Exit: 0.
Output: project-bootstrap-agent-setup smoke passed

node scripts/validate-team-doc.mjs
Exit: 0.
Output: Validated current mobile-app-dev-team managed docs.

bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
node --check <embedded project-bootstrap-preflight Node renderer>
bash -n evals/skills/project-bootstrap-agent-setup-smoke.sh
node --check scripts/validate-team-doc.mjs
Exit: 0.
```

## Notes

- Phase 1 RED reviewer returned GO before implementation.
- The generated JSON report now includes `user_summary.language.*`.
- Korean generated Markdown uses the required Korean primary headings and keeps
  raw blocker IDs in support details and JSON.

## Korean Sample Outputs

Generated from the real `project-bootstrap-preflight.sh` with temporary fake pod
inputs:

- `.evidence/wm/project-bootstrap/korean-samples-20260613/github-git-identity.md`
- `.evidence/wm/project-bootstrap/korean-samples-20260613/missing-sot-mcp.md`
- `.evidence/wm/project-bootstrap/korean-samples-20260613/missing-codex-cli-runtime.md`
- `.evidence/wm/project-bootstrap/korean-samples-20260613/role-specific-credential-source.md`
- `.evidence/wm/project-bootstrap/korean-samples-20260613/human-gate.md`
- `.evidence/wm/project-bootstrap/korean-samples-20260613/public-app-config.md`
- `.evidence/wm/project-bootstrap/korean-samples-20260613/api-railway-secure-source.md`
- `.evidence/wm/project-bootstrap/korean-samples-20260613/package-manager-pnpm-pin.md`

## Full Verification

```text
pnpm run test:runtime
Exit: 0.
Included validate:team-doc and validate:evidence-hygiene.

pnpm run test:local-harness
Exit: 0.
Output included: local harness all passed.

pnpm turbo run lint test
Exit: 0.
Tasks: 7 successful, 7 total.

pnpm run validate:evidence-hygiene
Exit: 0.
Output: Validated evidence hygiene fixtures. Validated evidence hygiene artifacts.

git diff --check
Exit: 0.

bash evals/skills/project-bootstrap-agent-setup-smoke.sh && node scripts/validate-team-doc.mjs
Exit: 0.
Output: project-bootstrap-agent-setup smoke passed; Validated current mobile-app-dev-team managed docs.
```

## Final Reviewer NO_GO Fixes

Final reviewer run:

```text
node scripts/codex-headless-review.mjs --json-envelope --agent wm-implementation-reviewer --prompt .evidence/wm/project-bootstrap/20260613-expanded-user-help-ux-final-review-prompt.md --out .evidence/wm/project-bootstrap/20260613-expanded-user-help-ux-final-review.md
Exit: 0.
Verdict: NO_GO.
```

Findings fixed:

- `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` is now persisted only when it is an
  accepted non-secret language hint; secret-like hints are recorded as
  `[redacted_current_user_language_hint]`.
- `PROJECT_BOOTSTRAP_USER_LANGUAGE` now accepts only `auto`, `ko`, and `en` as
  requested values. Aliases such as `ko-KR` are valid only as auto hints.
- English generated guidance and the report template now use the shared section
  order: current state, already checked, agent next action, user request,
  do-not-send, support details.
- English auth guidance no longer relies on the old "when the login screen
  opens" body copy; it says the agent opens or guides the login surface when
  possible and the user enters credentials in the provider surface.

Rerun verification after fixes:

```text
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
Exit: 0.

node scripts/validate-team-doc.mjs
Exit: 0.

bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
node --check <embedded project-bootstrap-preflight Node renderer>
bash -n evals/skills/project-bootstrap-agent-setup-smoke.sh
node --check scripts/validate-team-doc.mjs
Exit: 0.

pnpm run test:runtime
Exit: 0.

pnpm run test:local-harness
Exit: 0.

pnpm turbo run lint test
Exit: 0.

pnpm run validate:evidence-hygiene
Exit: 0.

git diff --check
Exit: 0.
```
