# Reviewer Prompt: Project Bootstrap Expanded User Help UX RED Coverage

Please review with xhigh scrutiny.

Reviewer: `wm-implementation-reviewer`
Mode: plan
Scope: Phase 1 RED coverage before implementation.

## Task

Determine whether the current RED test and validator changes are sufficient to
authorize Phase 2 implementation for the approved plan:

- Plan: `docs/plans/active/20260613-project-bootstrap-expanded-user-help-ux-plan.md`
- RED evidence:
  `.evidence/wm/project-bootstrap/20260613-expanded-user-help-ux-red.md`

This is a rerun after a first RED coverage reviewer `NO_GO`. The two prior
findings were:

- Missing executable explicit `PROJECT_BOOTSTRAP_USER_LANGUAGE=en` coverage.
- Missing executable generated Markdown support-detail selected-language and
  fallback-reason coverage.

Both were addressed in `evals/skills/project-bootstrap-agent-setup-smoke.sh`
before this rerun.

A second reviewer rerun then returned `NO_GO` for missing executable valid
`auto` hint mapping. That was addressed before this rerun by adding:

- `PROJECT_BOOTSTRAP_USER_LANGUAGE="auto"` +
  `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="ko-KR"` => selected `ko`.
- `PROJECT_BOOTSTRAP_USER_LANGUAGE="auto"` +
  `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="en-US"` => selected `en`.

A third reviewer rerun then returned `NO_GO` for missing generated Markdown
support-detail coverage of `missing_current_user_language_hint`. That was
addressed before this rerun by making the auto-empty fallback smoke path produce
blocked Markdown and assert:

- `Selected language: en`
- `Fallback reason: missing_current_user_language_hint`

A fourth reviewer rerun then returned `NO_GO` for two remaining gaps:

- Full blocker-matrix generated-message coverage was too comment/literal-driven
  and did not force missing role identity, managed path, or missing pod skill
  families.
- The ready report path did not enforce
  `user_summary.language.requested/current_user_hint/selected/fallback_reason`.

Those were addressed before this rerun by adding:

- Ready-path smoke coverage using `PROJECT_BOOTSTRAP_USER_LANGUAGE="auto"` and
  `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="en-US"`, asserting all four
  `user_summary.language.*` fields on a `ready_for_bootstrap` report.
- Expanded Korean full blocker-matrix fixture coverage that triggers a real
  missing managed registry and missing pod skill, plus nested pod-role blocker
  reasons for missing role identity, managed path, and missing pod skill.
- JSON and Markdown assertions for those matrix families, with raw blocker
  strings asserted only in support details and JSON.

## Changed RED Coverage Files

- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `scripts/validate-team-doc.mjs`
- progress-only plan update:
  `docs/plans/active/20260613-project-bootstrap-expanded-user-help-ux-plan.md`

## Review Requirements

Check the RED coverage against the approved plan and SoT:

- Korean mode must be first-class generated output using
  `PROJECT_BOOTSTRAP_USER_LANGUAGE=ko`.
- `PROJECT_BOOTSTRAP_USER_LANGUAGE` and
  `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` must cover `ko`, `en`, `auto`,
  invalid requested values, and fallback reasons.
- Report coverage must require `user_summary.language.requested`,
  `user_summary.language.current_user_hint`,
  `user_summary.language.selected`, and
  `user_summary.language.fallback_reason`.
- Full blocker matrix coverage must include package-manager/pnpm:
  `pnpm-pin-mismatch`, `pnpm@9.15.9`, `package.json`, `pnpm-lock.yaml`,
  `corepack --version`, and `pnpm --version`.
- Raw blocker IDs must be support-only in primary guidance.
- GitHub/auth guidance must require the agent to open or guide the login
  surface when possible, while the user only signs in/approves/enters
  credentials in the real surface.
- The tests must not ask the user to perform agent-owned setup.

## Expected Output

Return a final JSON envelope only, using the helper schema:

Important: `findings[*].owner`, if any, must be one of the supported helper
owners such as `Mobile App Dev`, `QA/Release`, `Product/Planning`, or `human`.

```json
{
  "verdict": "GO | NO_GO | NEEDS_HUMAN | BLOCKED",
  "reviewer": "wm-implementation-reviewer",
  "mode": "plan",
  "scope": {
    "baseline": null,
    "target": "Phase 1 RED coverage for project-bootstrap expanded user-help UX",
    "paths_reviewed": []
  },
  "findings": [],
  "checks_reviewed": [],
  "residual_risks": [],
  "next_action": "proceed | fix_findings | ask_human | rerun_review"
}
```
