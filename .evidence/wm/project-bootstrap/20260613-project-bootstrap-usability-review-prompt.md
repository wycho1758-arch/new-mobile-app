Review the pod-native bootstrap SoT specifically from the user-usability goal,
not from an internal module-boundary goal.

User correction to honor:

> The important thing is not the boundary. The current skill goal is whether
> users can easily set up the environment.

Question to verify:

1. Under current SoT, should the user-facing setup UX be presented as a single
   high-level `project-bootstrap` entry point, even if it internally uses
   `codex-cli-auth-setup` and `pod-role-bootstrap`?
2. Does the current SoT already make `project-bootstrap` capable of orchestrating
   the practical flow, including Codex CLI/auth precheck and pod-role bootstrap?
3. Is there a usability gap or source contradiction because
   `mobile-app-dev-team/16-pod-environment-bootstrap.md` still lists
   `project-bootstrap`, `codex-cli-auth-setup`, and `pod-role-bootstrap` as
   separate user-visible runbook steps, while `project-bootstrap/SKILL.md`
   also includes those calls inside its workflow?
4. What should be reported to the user as the correct SoT-based position:
   - "Do not merge the implementation contracts blindly"; and
   - "Do expose/use `project-bootstrap` as the simple standard entry point";
   - plus any needed doc/skill follow-up if current wording makes the user run
     too many manual steps.

Source files to inspect:

- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`
- `scripts/validate-team-doc.mjs`
- `scripts/validate-repo-operations.mjs`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`

Expected reviewer output:

- Findings first.
- Verdict should focus on whether the usability interpretation is SoT-backed.
- If there is a doc/runtime usability gap, classify it and recommend the
  follow-up at the right severity.

Draft usability interpretation to review:

The correct user-facing model should be:

```text
repo clone / pod artifact install
-> run project-bootstrap as the standard entry point
-> project-bootstrap performs agent-owned setup, preflight, Codex CLI/auth
   precheck, pod-role-bootstrap, re-preflight, and role-specific status checks
-> only human-owned credentials/account/live-action blockers are returned
```

The internal skills may remain separate because they provide reusable,
secret-safe contracts and report schemas. However, if the runbook makes the
user manually reason about all three skills as peer steps, that is a usability
gap. The SoT should present `project-bootstrap` as the one command/workflow
users invoke for normal setup, and mention `codex-cli-auth-setup` and
`pod-role-bootstrap` as dependencies/internals or advanced recovery steps.
