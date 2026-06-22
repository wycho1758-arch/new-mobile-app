---
name: stitch-adc-setup
description: Verify or explicitly prepare Google Cloud CLI, Application Default Credentials, the selected Google Cloud project, Stitch API service readiness, and repo-pinned Stitch MCP readiness inside an OpenClaw operating role pod without credential disclosure.
---

# Stitch ADC Setup

Use this pod-native OpenClaw skill when an operating role pod must verify whether
Google ADC, the selected Google Cloud project, `stitch.googleapis.com`, and the
repo-pinned Stitch MCP path are ready as status-only setup evidence. ADC
readiness includes a usable ADC quota project because Stitch calls can fail even
when ADC tokens exist. Live Stitch work still requires approved role scope, the
Design workflow gates, and any required `human-gate/v1` decision.

Runtime shape:

```text
/workspace/skills/stitch-adc-setup/SKILL.md
```

## Safety Rules

- Do not print auth token values, API keys, OAuth tokens, refresh tokens,
  passwords, Google ADC JSON, private keys, or full secret-bearing config
  contents.
- Report Google ADC, gcloud, project, Stitch API service, and Stitch MCP
  readiness as status only. The non-secret Google Cloud project id and ADC
  quota project id may be reported only after they match the normal safe Google
  Cloud project id shape.
- Do not download installers or execute arbitrary URLs. If gcloud is missing,
  only run a local executable installer path that the human/platform owner has
  approved from an official Google Cloud CLI source. Official Google apt
  package setup may be documented as a platform-owner setup path, but this skill
  must not silently add package repositories or install packages by default.
- Do not start Google browser auth flows unless a human is present and
  `STITCH_ADC_HUMAN_PRESENT=true` is set for this setup run.
- For non-GUI pods, use the official no-launch-browser forms with the human
  present: `gcloud auth login --no-launch-browser` and
  `gcloud auth application-default login --no-launch-browser`. Verification
  codes are transient human-owned inputs; do not log, store, paste into reports,
  or send them in chat.
- Do not enable `stitch.googleapis.com` unless `STITCH_ADC_ENABLE_STITCH_API=true`
  is set and the logged-in Google account has permission on the selected
  project.
- Do not run live Stitch generation or export from this setup check.
- Live Stitch use requires the Design workflow gates and any required
  `human-gate/v1` decision.

## Workflow

1. Run the precheck. With no opt-in environment variables, this is status-only
   and does not install, login, or enable Google Cloud services.

```bash
bash /workspace/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh
```

2. If gcloud is missing, have the platform owner install Google Cloud CLI from
   an approved official Google source, or provide an approved local installer
   path and explicit install approval before rerunning. Arbitrary URL downloads
   remain forbidden. Official apt package installation is a platform-owner setup
   path, not a silent action performed by this status check.

```bash
STITCH_ADC_GCLOUD_INSTALLER_PATH=/secure/path/install-google-cloud-cli.sh \
STITCH_ADC_INSTALL_APPROVED=true \
bash /workspace/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh
```

3. If Google auth, ADC, ADC quota project, or project selection is missing,
   rerun with a human present for the official non-GUI login surface. Provide
   only the non-secret project id. Do not report verification codes, ADC JSON,
   service account JSON, token values, or credential file contents.

```bash
STITCH_ADC_HUMAN_PRESENT=true \
STITCH_ADC_GOOGLE_CLOUD_PROJECT=<project-id> \
bash /workspace/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh
```

4. If the selected project does not have `stitch.googleapis.com` enabled, rerun
   only after the user approves enabling that service with the logged-in Google
   account.

```bash
STITCH_ADC_ENABLE_STITCH_API=true \
bash /workspace/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh
```

5. Review the report under `/workspace/state/`.

The default report path is:

```text
/workspace/state/stitch-adc-setup-report.json
```

6. Use repo-local Design skills only after Product/Planning scope/evidence gates
are satisfied. Stitch MCP details are sourced from `.codex/config.toml`; do not
copy MCP versions into pod-local claims.

## Done When

- gcloud CLI status, install decision, installer status, and version check are
  reported.
- gcloud CLI auth status and no-launch-browser login flow status are reported.
- Google ADC status is reported.
- Google ADC quota project status is reported, and the quota project id is
  included only when it is a safe non-secret project id.
- `gcloud auth application-default` status is reported without printing
  credential values.
- Google Cloud project status is reported, with `gcloud config set project`
  attempted only when `STITCH_ADC_GOOGLE_CLOUD_PROJECT` is provided.
- `stitch.googleapis.com` service status is reported, with
  `gcloud services enable stitch.googleapis.com` attempted only when
  `STITCH_ADC_ENABLE_STITCH_API=true` is set.
- `codex mcp list` or equivalent Stitch MCP status is reported.
- The top-level report summary includes safe project status/id, ADC/quota
  status, Stitch API service status/name, and Stitch MCP source/status/command
  and args when safe.
- Any live Stitch action is blocked until the required Design gates and
  `human-gate/v1` decisions are satisfied.
- The report contains status only and no auth token values.

See `references/report-template.md` for the expected report shape.
