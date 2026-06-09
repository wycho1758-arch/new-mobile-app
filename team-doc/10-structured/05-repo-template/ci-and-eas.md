---
docType: "procedure"
sourcePageId: "1371963427"
sourceTitle: "01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안"
sourceVersion: "20"
sourceHeading: "CI and EAS workflows"
---

# CI and EAS workflows

The template splits responsibility between two execution surfaces: the GitHub PR
gate handles static checks and unit tests, while EAS Workflows (an Expo-hosted,
non-self-hostable cloud service) handles mobile cloud build, E2E, submit, and OTA.

## EAS build profiles (`apps/mobile/eas.json`)

- `cli.version` floor is pinned to the current major at scaffold time (20.x as
  of 2026-06), which requires Node 20+ and aligns with the repo's Node 22 choice.
  `appVersionSource` is set to `remote`.
- Build profiles: `development` (dev client, internal distribution, `development`
  channel), `preview` (internal distribution, `preview` channel), `production`
  (`production` channel, `autoIncrement`), and `e2e-test` (`withoutCredentials`,
  Android APK, iOS simulator).
- `submit.production` is defined as the default submit profile.

## EAS Workflows (`apps/mobile/.eas/workflows/`)

- `e2e-test-android.yml` — triggers on `pull_request`. A `build` job (profile
  `e2e-test`, Android) feeds a `maestro` job that runs `.maestro/home.yml`,
  wiring `build_id` via `needs`/`outputs`.
- `build-and-submit.yml` — `workflow_dispatch` only (manual run via
  `eas workflow:run`). Builds Android and iOS on the `production` profile, then
  submits each using the matching `build_id` and `submit.production`.
- `ota-update.yml` — triggers on push to the `preview` branch. An `update` job
  runs `eas update` to the `preview` channel for all platforms (`channel` must
  match the build profile's channel; `branch` and `channel` cannot be set
  together). Sentry sourcemap upload is opt-in via
  `params.upload_sentry_sourcemaps: true`.
- The `.eas` directory must sit at the same level as `eas.json`, and EAS commands
  run from `apps/mobile`.

## PR quality gate (`.github/workflows/quality-gate.yml`)

- Triggers on `pull_request` to `main`. Steps: checkout with full history
  (`fetch-depth: 0`), pnpm + Node 22 setup, `pnpm install --frozen-lockfile`,
  `pnpm run test:runtime` (Codex runtime structure/role-boundary/hook checks),
  then `pnpm turbo run lint test`.
- A change-detection step inspects `.codex`/`.agents`/`evals`/`scripts`/
  `AGENTS.md`; when those change, it conditionally runs
  `pnpm run test:local-harness` (Codex CLI runtime + headless smoke).
- No extra CI is needed when an optional `apps/api` workspace is present —
  `pnpm turbo run lint test` automatically picks up the api workspace's `lint`
  (`tsc --noEmit`) and `test` (vitest) scripts.

## Release flow boundaries

- The PR gate proves static and unit correctness only; cloud build, E2E, submit,
  and OTA are all EAS responsibilities.
- Operating these in practice requires the project owner's external setup — an
  Expo subscription, GitHub integration, store accounts, and a Sentry project —
  none of which the template can self-host.
- Agents authenticate EAS CLI non-interactively via an `EXPO_TOKEN` (Expo Robot
  user token) injected only through a k8s Secret, never baked into images.

## Source

- Page ID: 1371963427
- Source heading: CI and EAS workflows
- Source version: 20
