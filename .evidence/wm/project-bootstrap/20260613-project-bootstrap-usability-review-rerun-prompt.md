Rerun the usability-focused review from
`.evidence/wm/project-bootstrap/20260613-project-bootstrap-usability-review-prompt.md`.

Important output constraint: each finding `owner` must be one of the supported
owner strings. For this review, use `Product/Planning` for documentation and
pod-runtime runbook ownership findings.

Keep the same scope and questions:

- Verify whether user-facing setup should be presented as a single high-level
  `project-bootstrap` entry point.
- Verify whether current SoT already makes `project-bootstrap` capable of
  orchestrating Codex CLI/auth precheck and pod-role bootstrap.
- Identify any usability gap where `16-pod-environment-bootstrap.md` presents
  `codex-cli-auth-setup` and `pod-role-bootstrap` as peer manual steps even
  though `project-bootstrap/SKILL.md` includes them inside its workflow.
- Return valid JSON envelope only with supported owner values.
