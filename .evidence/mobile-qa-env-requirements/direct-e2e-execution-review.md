# Direct E2E Execution Review

- Date: 2026-06-09
- Reviewer stance: assume Codex must directly execute mobile E2E, not merely advise.
- Repository: `/Users/tw.kim/Documents/AGA/test/new-mobile-app`
- Scope: Linux-first development, Expo React Native, Web smoke, local device/simulator E2E, and EAS Starter Workflows E2E.

## Sources Rechecked

- Expo pricing: https://expo.dev/pricing
- EAS Workflows introduction: https://docs.expo.dev/eas/workflows/introduction/
- EAS Workflows syntax: https://docs.expo.dev/eas/workflows/syntax/
- EAS Workflows Maestro E2E example: https://docs.expo.dev/eas/workflows/examples/e2e-tests/
- Expo Web workflow: https://docs.expo.dev/workflow/web/
- Mobile MCP overview: https://mobilenext.ai/docs/mobile-mcp/overview/

## Current Repo State

Relevant local files:

- `apps/mobile/eas.json`
  - Has an `e2e-test` build profile.
  - Android is configured as `buildType: "apk"`.
  - iOS is configured as `simulator: true`.
  - This matches the EAS E2E requirement for Android `.apk` and iOS simulator `.app` artifacts.
- `apps/mobile/.eas/workflows/e2e-test-android.yml`
  - Builds Android with the `e2e-test` profile.
  - Runs an EAS `maestro` job against `.maestro/home.yml`.
  - It is Android-only.
- `apps/mobile/.maestro/home.yml`
  - Uses `appId: {{ANDROID_PACKAGE}}`.
  - This is a template-generation placeholder, not an executable app id in the current unrendered repo.
  - It is also Android-specific, so it cannot be used as-is for iOS simulator E2E.
- `apps/mobile/package.json`
  - Has `start`, `android`, `ios`, `doctor`, `lint`, `test`, and local `e2e` scripts.
  - Local `e2e` assumes an app is already installed and a device/simulator target exists.

## If I Must Execute E2E Directly

### Linux local lane

What I can execute on Linux without native devices:

- deterministic gates: `pnpm turbo run lint test`, `pnpm --filter mobile test`, `pnpm --filter mobile lint`, `expo install --check`, `expo-doctor`
- Expo Web smoke: `pnpm --filter mobile start -- --web`

What this proves:

- TypeScript/Jest/runtime compatibility.
- Browser-renderable Expo path.
- Basic route/UI smoke on Web.

What this does not prove:

- Native Android/iOS runtime behavior.
- Native navigation, permissions, device APIs, or platform packaging.
- Maestro native E2E.
- Mobile MCP visual QA on real device/simulator.

Decision: Expo Web is a valid fast smoke lane, but it is not a replacement for native E2E.

### Linux Android local lane

To execute local Android E2E from Linux, I need:

- Android SDK/platform-tools with `adb` on PATH.
- Android Emulator running, or a USB Android device with debugging enabled.
- A build/install path for the app.
- A real Android app id in Maestro, not `{{ANDROID_PACKAGE}}`.
- `mobile-mcp` with Node.js 22+ for visual/device automation evidence.
- Maestro CLI for local `pnpm --filter mobile e2e`.

Current blocker:

- Previous local evidence showed no available devices from `mobile-mcp`.
- Without an emulator/USB device, I cannot complete local Android Maestro or Mobile MCP visual QA.
- Even after a device exists, `.maestro/home.yml` must be rendered or fixed because `{{ANDROID_PACKAGE}}` is not executable.

### Linux iOS local lane

To execute local iOS E2E, I would need macOS with Xcode command-line tools and a running iOS Simulator or trusted USB iOS device.

Decision:

- This cannot be done on a Linux developer machine locally.
- For Linux-first development, iOS E2E must move to a cloud macOS/simulator lane such as EAS Workflows.

## EAS Starter / Workflows Recheck

EAS Workflows can run build, update, submit, deploy, and Maestro jobs. The official workflow documentation states that workflows run on EAS with macOS and Linux workers and include built-in E2E testing with Maestro on Android emulators and iOS simulators.

Worker implications:

- Android Emulator jobs require Linux nested-virtualization workers.
- iOS builds and iOS Simulator jobs require macOS workers.

Build artifact implications:

- EAS Maestro E2E needs a built Android `.apk` or iOS `.app`.
- The repo's `e2e-test` build profile already matches this artifact shape.

Pricing implications on 2026-06-09:

- Free includes limited Android/iOS builds and limited CI/CD minutes.
- Starter is a paid plan with build credit and usage-based costs.
- EAS Maestro E2E jobs are not available on Free.
- On Starter, Maestro jobs are charged per run plus CI/CD minute usage.

Decision:

- Starter makes Android/iOS simulator E2E possible for a Linux-first team.
- Starter does not make repeated E2E free or unlimited.
- Cost depends on build frequency, workflow minutes, worker class, and Maestro job count.

## Is Starter Enough For Full E2E?

Capability answer: yes, for automated Android Emulator and iOS Simulator E2E.

Operational answer: not as-is in this repo.

Required before I can directly run and close E2E:

1. EAS account/project configured for `apps/mobile`.
2. EAS authentication available in the execution environment.
3. Billing/plan allows Starter Maestro jobs and CI/CD minutes.
4. Required `preview` public client config values configured before the build starts:
   - `EXPO_PUBLIC_APP_DISPLAY_NAME`
   - `EXPO_PUBLIC_APP_SLUG`
   - `EXPO_PUBLIC_APP_SCHEME`
   - `EXPO_PUBLIC_API_URL`
   - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`
   - `EXPO_PUBLIC_ANDROID_PACKAGE`
   - `EAS_PROJECT_ID` when the EAS project id is required by the selected workflow/account setup
   - `EXPO_PUBLIC_*` values are compiled into the client app. They must never contain tokens, credentials, bearer secrets, signing keys, or private service endpoints.
5. Android EAS workflow run enabled from the correct project directory.
6. iOS EAS workflow added because the repo currently has Android-only EAS E2E workflow.
7. Maestro `appId` made executable:
   - render `{{ANDROID_PACKAGE}}` during customer project generation, or
   - replace with generated platform-specific flows containing concrete Android/iOS ids.
   - Do not assume EAS `maestro` job can pass arbitrary Maestro `-e` values unless this is verified in an actual EAS run. The official EAS workflow syntax documents Maestro job params such as `build_id` and `flow_path`, but does not make a generic `-e` passthrough path explicit.
8. Test coverage added for the exact EAS readiness branches before implementation sign-off:
   - `EXPO_PUBLIC_APP_ENV=preview`
   - `EAS_BUILD=true`
   - missing required public client config values
9. PR evidence collection defined:
   - EAS workflow run URL
   - build artifact id
   - Maestro result
   - logs/screenshots/video where available

## Recommended Execution Model

Use three lanes, each with explicit proof boundaries.

### Lane 1: Always-on Linux local gate

- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- `pnpm --filter mobile exec expo install --check`
- `pnpm --filter mobile run doctor`
- `pnpm --filter mobile start -- --web` plus browser smoke when UI behavior changes

This lane is required, cheap, and deterministic, but not native E2E.

### Lane 2: Linux local Android native gate

- Install Android SDK/platform-tools.
- Run an Android Emulator or connect a USB Android device.
- Verify `adb devices`.
- Build/install app.
- Run `mobile-mcp` visual QA serially.
- Run `pnpm --filter mobile e2e`.

This lane is feasible on Linux but depends on a real local Android target.

### Lane 3: EAS cloud native E2E gate

- Run Android EAS workflow for PRs.
- Add and run iOS EAS workflow for PRs.
- Use the existing `e2e-test` profile for Android `.apk` and iOS simulator `.app`.
- Treat EAS run URL/artifacts as the native E2E evidence.
- Record that EAS `maestro` workflow support is currently documented by Expo as alpha, so failures and API changes need explicit triage before making it a hard merge gate.

This is the practical iOS lane for Linux-first development.

## Reviewer Verdict

If I am accountable for actually executing E2E, the answer changes from "environment guidance" to "there are execution blockers to remove."

Current state is not ready for direct full E2E completion because:

- there is no local Android/iOS target currently available in evidence,
- iOS local E2E is impossible on Linux,
- the EAS workflow only covers Android,
- Maestro `appId` is a placeholder and Android-specific,
- EAS account/auth/billing/workflow run evidence is not present.

The viable solution is:

- keep Web as a smoke-only lane,
- use local Linux Android only when emulator/device is available,
- use EAS Starter Workflows for Android/iOS simulator E2E,
- patch workflow/app-id gaps before claiming E2E completion.

Final decision:

- Starter can support the needed E2E capability.
- Starter is not free/unlimited.
- The repository needs small EAS/Maestro readiness fixes before I can run and sign off full Android+iOS native E2E as the executor.
