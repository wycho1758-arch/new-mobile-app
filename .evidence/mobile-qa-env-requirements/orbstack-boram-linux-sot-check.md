# Orbstack Boram Linux SoT Check

- Date: 2026-06-09
- Scope: check whether local Orbstack `boram-*` pod can be used for Linux/Android E2E verification.
- Result: Linux pod exists, but it is not currently an Android local E2E verification environment.

## Local Kubernetes Check

Current Kubernetes context:

```text
orbstack
```

Matching pod:

```text
clawpod/boram-vf7sbm-agent-0   2/2   Running
```

Pod containers:

```text
agent
ontology-bridge
```

Pod details:

- Namespace: `clawpod`
- Node: `orbstack`
- Pod IP: `192.168.194.120`
- Workload: `StatefulSet/boram-vf7sbm-agent`
- `agent` container image: `clawpod/agent:local`
- `ontology-bridge` container image: `clawpod-ontology-bridge:latest`
- `agent` mounts `/workspace` as RW PVC.
- `ontology-bridge` mounts `/workspace` as RO.

## Container Environment Check

`agent` container:

```text
Linux boram-vf7sbm-agent-0 ... aarch64 GNU/Linux
Ubuntu 24.04.4 LTS
node v22.22.2
pnpm 10.33.3
git version 2.43.0
no /dev/kvm
java: not found
adb: not found
emulator: not found
maestro: not found
```

`ontology-bridge` container:

```text
Linux boram-vf7sbm-agent-0 ... aarch64
Alpine Linux 3.23.3
node v22.22.1
no /dev/kvm
java: not found
adb: not found
emulator: not found
maestro: not found
```

Workspace check:

- `/workspace/projects` exists, but no checked-out `new-mobile-app` repo was found there.
- No `pnpm-workspace.yaml`, `apps/mobile/eas.json`, or `.maestro/home.yml` for this repo was found under the pod workspace scan.

## SoT Comparison

Repo SoT requires:

- Mobile lint/test, `expo install --check`, `expo doctor`, and `codex mcp list` for mobile runtime changes.
- Local `mobile-mcp` visual QA only when simulator/device is available.
- Maestro smoke only when a usable target and executable app id exist.
- Android local E2E needs Android SDK/platform tools, Android Emulator or USB device, Java 17+, Maestro CLI, and an executable Maestro `appId`.

Existing repo evidence also says:

- Android/Ubuntu can cover Android QA only when Android SDK, platform tools, KVM, and device/emulator prerequisites are configured.
- The current Maestro flow still contains `appId: {{ANDROID_PACKAGE}}`, which is a project-generation placeholder, not a runtime env variable.

## Assessment

The Boram pod is usable as a general Linux execution container for limited tasks:

- shell commands
- Node 22 execution
- git operations
- possibly JS-only checks after the repo is cloned/copied and the correct pnpm version is selected

The Boram pod is not currently usable for Android local E2E:

1. No `/dev/kvm`.
2. CPU architecture is `aarch64`.
3. No Android SDK/platform tools.
4. No Android Emulator.
5. No Java 17.
6. No Maestro CLI.
7. No Android device/emulator target.
8. The current project repo is not mounted or cloned into `/workspace/projects`.
9. The repo Maestro `appId` is still a generation-time placeholder.

## Decision

Using the Boram pod does not solve the Android E2E blocker today.

It can become useful for:

- deterministic Linux checks after repo checkout,
- EAS cloud build/workflow orchestration if EAS auth and public client config are provided,
- agent-runner style tasks that do not require local Android emulator/device access.

It should not be treated as local Android E2E evidence unless the pod is redesigned to include:

- a checked-out repo workspace,
- Node/pnpm aligned to repo expectations,
- Java 17+,
- Android SDK/platform tools,
- Maestro CLI,
- a usable Android device path, such as USB device forwarding or a separate emulator host,
- executable Maestro app-id handling.

For emulator-based Android E2E, this pod also needs a real virtualization/device strategy. Merely being a Linux pod is not enough.
