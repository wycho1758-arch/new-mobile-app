# Project Bootstrap WM_ROLE Canonicalization Review

Date: 2026-06-12
Reviewer: reviewer(xhigh)
Scope:

- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`

## Review Result

Verdict: GO

The update aligns `project-bootstrap` with the stricter downstream
`pod-role-bootstrap` behavior: pod identity must use canonical role slugs rather
than SOUL display names or operating-role labels.

## Findings

No Critical findings.

No High findings.

No Medium findings.

No Low findings.

## Checks

- `bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`: PASS
- `git diff --check -- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap`: PASS
- Canonical smoke with `WM_ROLE=mobile-app-dev` and `WM_EXPECTED_ROLE=mobile-app-dev`: PASS; report role canonical status is `canonical`, expected status is `match`, and no role-related blockers are emitted.
- Non-canonical smoke with `WM_ROLE="Mobile App Dev"` and `WM_EXPECTED_ROLE="Mobile App Dev"`: PASS; report emits role blockers for non-canonical `WM_ROLE` and `WM_EXPECTED_ROLE`.
- `node scripts/validate-repo-operations.mjs`: PASS
- `node scripts/validate-team-doc.mjs`: PASS

## Reviewer Notes

- The SOUL files remain the role identity source for humans and role selection.
- `project-bootstrap` now requires conversion from SOUL role identity to the
  canonical runtime slug before writing `WM_ROLE`, `WM_EXPECTED_ROLE`, or
  `/workspace/IDENTITY`.
- `WM_ROLE` precedence over `/workspace/IDENTITY` is still preserved, but the
  preflight now reports `/workspace/IDENTITY` canonical status and blocks a
  mismatch when both surfaces are configured.
- The report template records raw role values because invalid input is reported
  before it is blocked; canonical status fields carry the validation result.
