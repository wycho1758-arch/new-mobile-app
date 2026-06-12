# Linux-First Mobile QA Options

- Date: 2026-06-09
- Scope: Tavily-assisted research for Linux/Ubuntu-first Expo React Native development and QA
- Result: Linux-first development is feasible if QA is split into local Android/Web checks and cloud/remote iOS checks.

## Sources Checked

- Expo Web: https://docs.expo.dev/workflow/web/
- Expo Router: https://docs.expo.dev/router/introduction/
- Expo Router testing: https://docs.expo.dev/router/reference/testing/
- Expo unit testing: https://docs.expo.dev/develop/unit-testing/
- Expo EAS development builds: https://docs.expo.dev/develop/development-builds/create-a-build/
- Expo iOS development build for devices: https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/
- Expo EAS Workflows: https://docs.expo.dev/eas/workflows/introduction/
- Expo EAS Workflows E2E with Maestro: https://docs.expo.dev/eas/workflows/examples/e2e-tests/
- Expo EAS Workflows syntax: https://docs.expo.dev/eas/workflows/syntax/
- Mobile MCP overview: https://mobilenext.ai/docs/mobile-mcp/overview/
- BrowserStack App Automate: https://www.browserstack.com/docs/app-automate/appium/overview
- BrowserStack React Native Maestro guide: https://www.browserstack.com/guide/how-to-test-react-native-with-maestro
- AWS Device Farm overview: https://docs.aws.amazon.com/devicefarm/latest/developerguide/welcome.html
- AWS Device Farm Appium endpoint: https://docs.aws.amazon.com/devicefarm/latest/developerguide/appium-endpoint.html
- Bitrise Expo projects: https://docs.bitrise.io/en/bitrise-ci/getting-started/quick-start-guides/getting-started-with-expo-projects

## Practical Architecture

Use four QA lanes instead of trying to make Linux behave like macOS:

1. Linux local deterministic lane:
   - `pnpm --filter mobile lint`
   - `pnpm --filter mobile test`
   - `pnpm --filter mobile exec expo install --check`
   - `pnpm --filter mobile run doctor`
   - `codex mcp list`

2. Linux local Android lane:
   - Android Studio or command-line tools on Ubuntu.
   - Android SDK Platform 36 for Expo SDK 56 builds.
   - Android Emulator with KVM or USB Android device.
   - `pnpm --filter mobile android`
   - local `mobile-mcp` against Android target.
   - Maestro against Android target after app id is executable.

3. Linux local Web lane:
   - Expo supports React Native Web and Expo Router web.
   - Run with `pnpm --filter mobile start -- --web` or equivalent Expo CLI web command.
   - Use this for fast UI, routing, state, content, and API integration checks.
   - Do not treat Web as proof of iOS/Android native rendering, permissions, native modules, device gestures, or platform-specific runtime behavior.

4. Cloud/remote iOS lane:
   - EAS Build can trigger iOS builds from Linux because builds run on EAS servers.
   - iOS physical-device development builds require Apple Developer account, provisioning, and Developer Mode on the device.
   - EAS Workflows can run Maestro E2E on iOS Simulator using macOS workers.
   - Alternative device clouds can run iOS real-device checks without local macOS.

## Expo Web Findings

Expo officially supports web development for universal apps. Expo Router is a file-based router for Android, iOS, and web applications, so web checks are valid for shared route/component behavior when the app is written with cross-platform primitives.

Recommended use:

- Fast PR smoke for screens that use React Native primitives and shared business logic.
- API integration checks where the API is browser-reachable.
- Layout/content regression screenshots through browser tooling.
- Route/navigation validation through Expo Router web.

Limits:

- Web does not validate iOS Simulator availability.
- Web does not validate Android native runtime.
- Web does not validate native-only APIs, permission prompts, push notifications, deep native gestures, App Store/TestFlight packaging, native module compatibility, or mobile accessibility tree behavior.
- Visual differences are expected because React Native Web renders to browser DOM, not Android/iOS native views.

## iOS Without Local macOS

Local iOS Simulator remains unavailable on Linux, but the project can still cover iOS through:

- EAS Build for iOS development builds from Linux.
- EAS Workflows iOS Simulator Maestro jobs on macOS workers.
- Physical iOS devices with EAS-signed development builds.
- TestFlight or internal distribution for human QA.
- BrowserStack or similar real-device cloud for automated/manual iOS checks.
- AWS Device Farm if the team is willing to use Appium/XCTest instead of reusing Maestro YAML directly.
- Bitrise or GitHub Actions/macOS runners if the team wants CI-managed macOS capacity.

## Recommended Linux-First Policy

1. Make Android the local native feedback loop.
2. Add Expo Web as a fast shared UI/router/API smoke lane.
3. Do not block normal Linux development on local iOS Simulator access.
4. Move iOS simulator/device evidence to EAS Workflows or a device cloud.
5. Keep `mobile-mcp` local Android evidence as required when an Android target is available.
6. Record iOS evidence as cloud/remote evidence, not local evidence.

## Repo-Specific Notes

- The current repo already includes web-capable dependencies such as `react-dom`, `@expo/metro-runtime`, and Expo Router.
- The current `apps/mobile` script is `start: expo start`; web can be started by passing the web flag through the script.
- `EXPO_PUBLIC_*` values are public client configuration compiled into the app. They are required for local/web/native runtime configuration but must not be used for tokens or other private values.
- The current Maestro app id remains `{{ANDROID_PACKAGE}}`, a project-generation placeholder. Template-local Maestro smoke still needs a rendered flow or future `${APP_ID}` + `-e APP_ID=...` wiring.

## Decision

Linux-first is viable, but only if the team stops treating local iOS Simulator as a required developer-machine capability. The practical replacement is:

- Linux local: deterministic tests + Expo Web + Android emulator/device + Android `mobile-mcp`/Maestro.
- Cloud: EAS Build/Workflows for iOS build and simulator Maestro.
- Optional external: BrowserStack real-device iOS/Android, or AWS Device Farm with Appium/XCTest.

