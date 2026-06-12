---
name: pod-role-bootstrap
description: Prepare an OpenClaw role pod to work on this WonderMove mobile app template runtime by resolving its WM role, aligning pnpm to the repo packageManager pin, installing the checked-out repo, running repo-local Codex pod preflight, and writing a redacted readiness report.
---

# Pod Role Bootstrap

Use this pod-native OpenClaw skill when an OpenClaw role pod must prepare a
WonderMove mobile app template runtime repository for Codex-driven repo work.
If the checkout is absent, the pod may acquire it only from an explicit
non-secret `REPO_CLONE_URL` pod configuration.

Runtime shape:

```text
/workspace/skills/pod-role-bootstrap/SKILL.md
```

## Safety Rules

- Do not print auth token values, API keys, OAuth tokens, refresh tokens,
  passwords, or full secret-bearing config contents.
- Report auth, GitHub, EAS, MCP, and config readiness as status only.
- Treat `REPO_CLONE_URL`, `GITHUB_TOKEN` presence, and `gh auth status` output
  as status only. Do not print configured token or credential values.
- Do not run live EAS, pod creation, image build/push, webhook, branch
  protection, or platform provisioning commands.
- Do not claim native Android E2E readiness from this bootstrap. Boram-like
  pods have no usable local Android E2E environment.
- Use this as a repo checkout/bootstrap contract, not as proof that OrbStack,
  OpenClaw, GitHub branch protection, EAS, Confluence, webhook, or native
  device behavior works.

## Role Resolution

Resolve the role in this order:

1. `WM_ROLE`
2. First line of `/workspace/IDENTITY`

If neither source exists, hard fail. If `WM_EXPECTED_ROLE` is present and does
not match the resolved role, hard fail.

## Workflow

1. Resolve the role and verify or acquire the repo checkout path.

```bash
export REPO_PATH="${REPO_PATH:-/workspace/new-mobile-app}"
bash /workspace/skills/pod-role-bootstrap/scripts/pod-bootstrap.sh
```

The default checkout path is `/workspace/new-mobile-app`. If that directory is
missing, `REPO_CLONE_URL` must be configured by the pod environment. The
bootstrap may run `gh auth status` as a redacted GitHub readiness check when
the GitHub CLI is available. It does not print the clone URL token material or
any token value.

The checkout is not ready for Codex-managed repo work until
`/workspace/CODEX_MANAGED_PATHS.md` contains the managed path entry for
`/workspace/new-mobile-app/`. If the entry is missing, bootstrap writes a
status-only blocker report and exits non-zero instead of claiming readiness.

2. Align package manager selection with the repo SoT.

The repo declares `pnpm@9.15.9` in `package.json`. The bootstrap uses corepack
to activate that pin before `pnpm install --frozen-lockfile`. A pod with pnpm
`10.33.3` must not proceed as ready until the pin is corrected.

3. Run repo-local pod preflight.

```bash
node scripts/codex-preflight.mjs --pod --json
```

The preflight must report:

- role identity status
- codex CLI candidate status
- Node 22 status
- pnpm packageManager pin match/mismatch
- git identity status
- GitHub auth status only
- Chromium/RN Web capability
- native local E2E capability as false for boram-like pods
- EAS cloud auth material as status only
- `.codex/config.toml` and `codex mcp list` status only

4. Write the readiness report under `/workspace/state/`.

The default report path is:

```text
/workspace/state/pod-role-bootstrap-report.json
```

The report includes `repo_acquisition` and `managed_path` status so a reviewer
can distinguish an existing checkout, a cloned checkout, and a blocked checkout
whose `/workspace/CODEX_MANAGED_PATHS.md` policy is not ready.

## Done When

- role resolution succeeds
- the repo checkout exists at `/workspace/new-mobile-app`
- the checkout came from an existing directory or explicit `REPO_CLONE_URL`
- `/workspace/CODEX_MANAGED_PATHS.md` contains the managed path entry
- pnpm is aligned to `pnpm@9.15.9`
- `pnpm install --frozen-lockfile` exits 0
- `node scripts/codex-preflight.mjs --pod --json` exits 0
- the report is written under `/workspace/state/`
- the report contains status and capability summaries only

See `references/report-template.md` for the expected report shape.
