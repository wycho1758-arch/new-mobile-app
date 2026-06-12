# Android Write-Mode E2E Attempt

- Date: 2026-06-09
- Scope: retry Android local E2E readiness in write-capable execution mode.
- Result: this attempt passed `expo install --check`, mobile lint, and mobile Jest; Android E2E remained blocked by both host emulator/tooling prerequisites and repo/template app-id readiness.
- Related prior baseline: `.evidence/api-app-run-check/baseline.md` records broader runtime/mobile readiness gates including `pnpm run test:runtime`, `pnpm turbo run lint test`, `pnpm --filter mobile run doctor`, `codex mcp list`, and local harness.

## Commands And Results

| Check | Command | Result |
| --- | --- | --- |
| Android device list | `adb devices` | Pass command, no attached or booted devices. |
| AVD list | `emulator -list-avds` | Found `Pixel_2_API_28`, `Pixel_4_XL_API_30`. |
| Maestro CLI | `maestro --version` | Blocked: `command not found`. |
| Java version | `java -version` | Java 1.8.0_221 only. Maestro/modern Android tooling generally needs newer Java, typically Java 17. |
| Expo dependency check | `pnpm --filter mobile exec expo install --check` | Pass. |
| Mobile lint | `pnpm --filter mobile lint` | Pass. |
| Mobile Jest | `pnpm --filter mobile test` | Pass, 2 suites / 5 tests. |
| Emulator boot, accelerated | `emulator -avd Pixel_4_XL_API_30 -no-window -no-audio -no-boot-anim -gpu swiftshader_indirect -no-snapshot` | Failed: x86 emulation requires hardware acceleration; VT-x not supported on this host. |
| Emulator boot, no acceleration | `emulator -avd Pixel_2_API_28 -no-window -no-audio -no-boot-anim -gpu swiftshader_indirect -no-snapshot -accel off` | Process started but device remained `offline`; stopped manually after no usable target appeared. |
| Final device list | `adb devices` | Pass command, no attached or booted devices. |

Relevant log excerpts:

```text
emulator: ERROR: x86 emulation currently requires hardware acceleration!
CPU acceleration status: Android Emulator requires an Intel processor with VT-x and NX support.  (VT-x is not supported)
```

```text
emulator: WARNING: x86 emulation may not work without hardware acceleration!
Your emulator is out of date, please update by launching Android Studio
```

```text
List of devices attached
emulator-5554	offline
```

## Current Blockers

1. No usable Android target is booted or attached.
2. Existing x86 AVDs cannot run with hardware acceleration on this host.
3. `-accel off` did not produce an online device in the attempted window.
4. Maestro CLI is not installed.
5. Java is 1.8 only.
6. `apps/mobile/.maestro/home.yml` still contains `appId: {{ANDROID_PACKAGE}}`, so the repo flow is not executable until rendered or parameterized.

## Decision

Writing mode removes the read-only sandbox issue, but it does not remove the actual environment blockers.

Android-first remains the correct Linux-first strategy, but to let Codex execute Android E2E, the execution host must provide:

- Linux or macOS host with working emulator acceleration, or a USB Android device.
- Updated Android Emulator / platform tools if using AVDs.
- Java 17+.
- Maestro CLI.
- Executable Maestro app id, either rendered from `{{ANDROID_PACKAGE}}` or parameterized with a supported Maestro command.

Until then, Android E2E is blocked, not failed by app code.
