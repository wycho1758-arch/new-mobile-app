---
name: eas-robot-auth-setup
description: Verify EAS CLI and Expo robot auth readiness inside an OpenClaw QA role pod with status-only reporting, without exposing token values or claiming live EAS/Maestro readiness.
---

# EAS Robot Auth Setup

Use this pod-native OpenClaw skill when a QA/Release role pod must verify
whether EAS CLI and Expo robot auth material are present before an approved
EAS/Maestro evidence run.

Runtime shape:

```text
/workspace/skills/eas-robot-auth-setup/SKILL.md
```

## Safety Rules

- Do not print auth token values, API keys, OAuth tokens, refresh tokens,
  passwords, or full secret-bearing config contents.
- Report `EXPO_TOKEN`, EAS CLI, and account readiness as status only.
- Do not run live EAS build, submit, update, or Maestro cloud jobs from this
  setup check.
- Live EAS token use requires a recorded `human-gate/v1` approval and must be
  tied to the target work unit evidence path.

## Workflow

1. Run the status-only precheck.

```bash
bash /workspace/skills/eas-robot-auth-setup/scripts/eas-robot-auth-precheck.sh
```

2. Review the report under `/workspace/state/`.

The default report path is:

```text
/workspace/state/eas-robot-auth-setup-report.json
```

3. If an approved EAS/Maestro run has produced recorded output, ingest that
output through the repo script from the checked-out repo:

```bash
node scripts/ingest-eas-evidence.mjs --help
```

The ingested evidence schema is `eas-evidence/v1`. The self-test remains
offline and does not prove live EAS behavior.

## Done When

- EAS CLI status is reported.
- `EXPO_TOKEN` presence is reported as status only.
- `eas whoami` status is reported without printing token values.
- Any live EAS/Maestro action is blocked until a `human-gate/v1` decision
  exists.
- The report contains status only and no auth token values.

See `references/report-template.md` for the expected report shape.
