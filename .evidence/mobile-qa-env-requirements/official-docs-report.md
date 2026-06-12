# Mobile Visual QA And Maestro Environment Requirements

- Date: 2026-06-09
- Scope: official-documentation review for enabling `mobile-mcp` visual QA and Maestro on macOS and Ubuntu Linux
- Repo context: Expo SDK 56 development build, `expo-dev-client`, `mobile-mcp@0.0.58`, Maestro flow under `apps/mobile/.maestro/home.yml`
- Result: local Android QA can be configured on macOS or Ubuntu; local iOS Simulator QA requires macOS; Ubuntu cannot provide a local iOS Simulator target.

## Official Sources Checked

- Mobile MCP overview and prerequisites: https://mobilenext.ai/docs/mobile-mcp/overview/
- Expo Android Studio Emulator: https://docs.expo.dev/workflow/android-studio-emulator/
- Expo iOS Simulator: https://docs.expo.dev/workflow/ios-simulator/
- Expo SDK reference: https://docs.expo.dev/versions/latest/
- Expo local app development: https://docs.expo.dev/guides/local-app-development/
- Expo iOS device development build: https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/
- Android Studio install requirements: https://developer.android.com/studio/install.html
- Android Emulator hardware acceleration: https://developer.android.com/studio/run/emulator-acceleration
- Android physical device setup: https://developer.android.com/studio/run/device
- Android Emulator network addresses: https://developer.android.com/studio/run/emulator-networking-address
- Maestro CLI install: https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli
- Maestro quickstart/device setup: https://docs.maestro.dev/get-started/quickstart
- Maestro parameters and constants: https://docs.maestro.dev/maestro-flows/flow-control-and-logic/parameters-and-constants
- Maestro start-device: https://docs.maestro.dev/maestro-flows/flow-control-and-logic/specify-and-start-devices

## Cross-Platform Minimum

1. Node.js 22 or later for Mobile MCP via `npx`; the repo already targets Node 22.
2. Keep repo MCP pinned to `@mobilenext/mobile-mcp@0.0.58`; official docs show `@latest`, but repo SoT requires pinning.
3. Maestro CLI requires Java 17+ and `JAVA_HOME` pointing at that Java installation.
4. A running target is mandatory:
   - `mobile-mcp` needs a local simulator/emulator or USB-connected real device.
   - Maestro also requires a running emulator/simulator or physical device before it can execute a flow.
5. The app must be installed on the target device:
   - Android: `pnpm --filter mobile android` or install an APK/development build.
   - iOS Simulator on macOS: `pnpm --filter mobile ios` or install an iOS Simulator build.
   - iOS physical device: signed development build is required.

## macOS Requirements

### iOS Simulator Path

Required:

- macOS host.
- Xcode installed from the Mac App Store.
- Xcode Command Line Tools selected in Xcode Settings > Locations.
- iOS Simulator runtime installed under Xcode Settings > Components.
- `xcrun simctl list devices` must work.
- A booted iOS Simulator or trusted USB iOS device for `mobile-mcp`.
- Watchman is recommended by Expo for better local development performance.

Validation commands:

```sh
xcode-select -p
xcrun simctl list devices
open -a Simulator
pnpm --filter mobile ios
```

Notes:

- Expo states iOS Simulator can only be installed on macOS; Linux users need a physical iOS device for iOS app development.
- Mobile MCP's iOS prerequisites also require macOS with Xcode command-line tools plus a running simulator or trusted USB device.
- If the earlier `xcrun simctl help` failure with exit code 72 remains, fix Xcode/Command Line Tools/simulator runtime before retrying mobile visual QA.

### Android Emulator Path

Required:

- Android Studio installed.
- JDK 17; Expo's macOS guide recommends Azul Zulu 17.
- Android SDK Platform 36 installed because Expo SDK 56 uses Android compile/target SDK 36.
- Android SDK Build-Tools, Android Emulator, and Android Platform Tools installed.
- `ANDROID_HOME` and PATH include SDK `emulator` and `platform-tools`.
- At least one AVD created and running.

Validation commands:

```sh
java -version
adb version
emulator -list-avds
adb devices
pnpm --filter mobile android
```

Maestro-specific note:

- Maestro quickstart currently recommends API 31+ and lists supported API levels as 29, 30, 31, 33, and 34. To reduce risk, install SDK Platform 36 for Expo SDK 56 builds and use an API 34 or API 33 emulator for Maestro until the local Maestro version confirms newer API support.

## Ubuntu Linux Requirements

### Android Emulator Path

Required:

- 64-bit Ubuntu/Linux distribution supported by Android Studio.
- Android Studio or Android command-line tools.
- JDK 17+.
- Android SDK Platform 36, Build-Tools, Emulator, and Platform Tools.
- `ANDROID_HOME` and PATH include SDK command-line tools, emulator, and platform-tools.
- CPU virtualization enabled in BIOS/UEFI.
- KVM installed and accessible; `/dev/kvm` should exist and be usable.
- For physical Android devices, user must be in `plugdev` and udev rules must be installed.

Ubuntu setup checks:

```sh
java -version
echo $ANDROID_HOME
adb version
egrep -c '(vmx|svm)' /proc/cpuinfo
sudo apt-get install cpu-checker
sudo kvm-ok
ls -l /dev/kvm
emulator -list-avds
adb devices
```

Ubuntu physical Android device requirements:

```sh
sudo usermod -aG plugdev $LOGNAME
sudo apt-get install android-sdk-platform-tools-common
adb devices
```

Notes:

- Android's official docs require virtualization support for performant emulator use; Linux VM acceleration uses KVM.
- Android Studio's Linux requirements exclude ARM-based Linux machines for Android Studio support.
- CI/self-hosted runners need nested virtualization and `/dev/kvm` access if they are expected to run Android emulators.

### iOS Path On Ubuntu

Local iOS Simulator QA is not feasible on Ubuntu:

- Expo states iOS Simulator can only be installed on macOS.
- Mobile MCP's iOS prerequisites require macOS with Xcode command-line tools.
- Therefore Ubuntu can run Android local QA, but iOS visual QA requires a macOS machine, a macOS self-hosted runner, or a cloud/remote device service.

For physical iOS app execution, Expo documents an EAS-signed development build path with:

- Apple Developer account.
- iOS Developer Mode enabled on iOS 16+.
- device registration/provisioning profile.
- EAS build for iOS development profile.

However, for this repo's local `mobile-mcp` iOS automation gate, the controlling host still needs macOS/Xcode tooling.

## Repo-Specific Execution Sequence After Environment Setup

Repo baseline gates:

```sh
pnpm --filter mobile exec expo install --check
pnpm --filter mobile run doctor
pnpm --filter mobile lint
pnpm --filter mobile test
codex mcp list
```

These deterministic gates already passed in `.evidence/api-app-run-check/baseline.md`, including `codex mcp list` with `mobile-mcp` enabled. Rerun them before PR readiness is claimed if the mobile environment/runtime changes again.

Android local QA:

```sh
export EXPO_PUBLIC_APP_ENV=development
export EXPO_PUBLIC_API_URL=http://10.0.2.2:<api-port>
pnpm --filter mobile android
# then verify mobile-mcp sees the target
# mobile_list_available_devices should return at least one Android target
pnpm --filter mobile e2e
```

iOS local QA on macOS:

```sh
export EXPO_PUBLIC_APP_ENV=development
export EXPO_PUBLIC_API_URL=http://127.0.0.1:<api-port>
pnpm --filter mobile ios
# then verify mobile-mcp sees the simulator
# mobile_list_available_devices should return at least one iOS target
```

Set `<api-port>` to the API process port. The repo default is `API_PORT=3000`; prior local run evidence used `3001` only because `3000` was already occupied.

`pnpm --filter mobile android` and `pnpm --filter mobile ios` map to Expo `run:*` commands, which compile/install the development build and start Metro. Use `pnpm --filter mobile start` separately only when the native development build is already installed and Metro is not running.

Use the installed app id for Maestro. The current development fallback app id is `com.template.mobile`; if `EXPO_PUBLIC_ANDROID_PACKAGE` is set during native build, use that exact installed app id instead. The current repo flow contains `appId: {{ANDROID_PACKAGE}}`, which `docs/TEMPLATE_VARIABLES.md` defines as a project-generation placeholder, not a runtime environment variable. Therefore `ANDROID_PACKAGE=com.template.mobile pnpm --filter mobile e2e` is not sufficient in this unrendered template repo. Before executing Maestro, either:

1. Run it in a generated project where `{{ANDROID_PACKAGE}}` has already been replaced with the real app id.
2. For template-local smoke only, create a temporary rendered copy of the flow with the installed app id.
3. Change the flow/script in a future implementation to Maestro's documented runtime parameter syntax, for example `appId: ${APP_ID}` with `maestro test -e APP_ID=<installed-app-id>`.

For API-backed Android emulator checks, use `http://10.0.2.2:<host-port>` to reach a service running on the development host. `127.0.0.1` inside the Android emulator points to the emulated device itself. For iOS Simulator on macOS, `127.0.0.1` can reach the host Mac; for physical devices, use a reachable LAN or tunnel URL.

`EXPO_PUBLIC_*` values above are public client configuration compiled into the app. They are required for this repo's local runtime, but they must not be used for tokens, bearer credentials, signing keys, or other private values.

## Findings

1. The previous blocker is environment-level, not app-code-level: `mobile-mcp` returned no devices and `xcrun simctl` failed.
2. macOS is the only local path that can cover both iOS Simulator and Android Emulator visual QA.
3. Ubuntu can cover Android Emulator/USB-device QA if Android SDK, Platform Tools, KVM, and udev permissions are configured.
4. Ubuntu cannot satisfy local iOS Simulator QA; use macOS or a cloud/remote device path.
5. For Maestro, do not assume an emulator exists. Create/start one first, then confirm app id and run the flow.

## Remaining Gate Impact

- This report is documentation/evidence only.
- No app code, external platform repository, credentials, or production config were changed.
- Before claiming full mobile PR readiness, run actual `mobile-mcp` visual QA and Maestro on a detected device/simulator and record the result.
