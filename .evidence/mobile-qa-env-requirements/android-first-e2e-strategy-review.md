# Android-First E2E Strategy Review

- Date: 2026-06-09
- Scope: whether Linux-local Android E2E can be the primary E2E lane, with EAS macOS/iOS Simulator deferred to integration after Android is complete.
- Reviewer stance: assume Codex must execute the E2E lane when the required environment exists.

## Sources Checked

- Android Emulator acceleration on Linux: https://developer.android.com/studio/run/emulator-acceleration
- EAS Workflows Maestro E2E: https://docs.expo.dev/eas/workflows/examples/e2e-tests/
- EAS Workflows syntax / worker requirements: https://docs.expo.dev/eas/workflows/syntax/
- Expo Web workflow: https://docs.expo.dev/workflow/web/

## Short Answer

Yes, Android-first is the right Linux-first strategy.

If a Linux machine has Android SDK/platform-tools, KVM acceleration, an AVD or USB device, Maestro CLI, and an executable app id in the flow, Codex can run Android E2E locally.

No, this does not remove the need for EAS macOS/iOS Simulator. It changes the timing:

- Android E2E should be the daily/local primary native E2E gate.
- iOS EAS Simulator E2E can be run at integration/PR readiness points after Android E2E is green.
- iOS EAS should still run before claiming cross-platform native E2E completion.

## Current Local Execution Check

Commands checked in this workspace:

- `command -v adb`
  - Found: `/Users/tw.kim/Library/Android/sdk/platform-tools/adb`
- `command -v emulator`
  - Found: `/Users/tw.kim/Library/Android/sdk/emulator/emulator`
- `emulator -list-avds`
  - Found:
    - `Pixel_2_API_28`
    - `Pixel_4_XL_API_30`
- `adb devices`
  - Result: no attached or booted devices.
- `maestro --version`
  - Result: `command not found`.

Current repo blockers:

- `apps/mobile/.maestro/home.yml` has `appId: {{ANDROID_PACKAGE}}`.
- `{{ANDROID_PACKAGE}}` is a project-generation placeholder, not a runtime environment variable.
- `apps/mobile/package.json` runs `maestro test .maestro/*.yml` directly.
- Therefore Android E2E is not executable in this unrendered repo until the flow is rendered or app id handling is fixed.

## What I Can Do When Android Environment Is Ready

Once the Android target and toolchain are ready, Codex can execute:

1. Start or verify Android emulator:
   - `emulator -avd <name>` or existing device
   - `adb devices`
2. Run deterministic mobile gates:
   - `pnpm --filter mobile lint`
   - `pnpm --filter mobile test`
   - `pnpm --filter mobile exec expo install --check`
   - `pnpm --filter mobile run doctor`
3. Build/install the Android app:
   - development build path: `pnpm --filter mobile android`
   - or EAS/local APK path if chosen
4. Run local visual/device QA:
   - `mobile-mcp`, serially, when the emulator/device is detected
5. Run Maestro:
   - after `maestro` is installed
   - after `.maestro/home.yml` contains the actual installed Android app id

This is enough for Android-native E2E evidence.

## Recommended Test Strategy

### Daily Linux Development

Use Android as the main native E2E platform:

- deterministic gates
- Expo Web smoke for browser-renderable regressions:
  - `pnpm --filter mobile start -- --web`
- Android emulator smoke
- Android Mobile MCP visual QA
- Android Maestro E2E

This gives high signal quickly and fits the planned Linux development environment.

### Integration / PR Readiness

After Android E2E is green, run EAS cloud E2E:

- Android EAS workflow if cloud parity evidence is needed.
- iOS EAS workflow on macOS/iOS Simulator for cross-platform native confirmation.

This is the practical point to use EAS macOS/iOS Simulator. It does not need to run on every local edit, but it should run before claiming full Android+iOS E2E completion.

### Release Readiness

Run iOS EAS Simulator E2E again for release-impacting changes. Add physical-device QA if the app uses device-specific behavior, permissions, native modules, camera, location, push notifications, payments, or platform-specific UI.

## Boundary

Android-first is acceptable because most app behavior, selectors, API integration, and navigation flows can be exercised through Android native E2E.

Android-first is not enough when:

- behavior differs by platform,
- iOS-specific native APIs are used,
- iOS permissions, linking, safe-area behavior, keyboard behavior, or build config are touched,
- release readiness is being claimed.

## Decision

The proposed strategy is valid:

1. Make Android local E2E executable and use it as the primary Linux development gate.
2. Fix the repo blockers first:
   - install Maestro in the execution environment,
   - boot or provision an Android emulator/device,
   - render or replace the Maestro `appId`,
   - add test coverage for `preview` / `EAS_BUILD=true` config readiness before EAS sign-off.
3. Defer EAS macOS/iOS Simulator to integration/PR readiness after Android is green.

This is better than trying to run iOS E2E continuously from Linux, because iOS local simulator execution is not available on Linux and EAS macOS minutes should be used as a cross-platform gate, not the daily loop.
