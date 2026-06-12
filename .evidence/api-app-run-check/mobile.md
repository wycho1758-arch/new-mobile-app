# Mobile App Run Evidence

- Date: 2026-06-09
- Scope: local `apps/mobile` Expo/Metro run and available-device QA check
- Result: partial pass, device QA blocked

## Environment

- `EXPO_PUBLIC_APP_ENV=development`
- `EXPO_PUBLIC_API_URL=http://127.0.0.1:3001`
- API port matched the local API fallback port used during this run.

## Commands

| Step | Command | Result | Evidence |
| --- | --- | --- | --- |
| Start Expo/Metro | `EXPO_NO_TELEMETRY=1 EXPO_PUBLIC_APP_ENV=development EXPO_PUBLIC_API_URL=http://127.0.0.1:3001 pnpm --filter mobile start -- --localhost` | Pass with simulator warning | Metro started for `apps/mobile`; Expo Router root detected as `src/app`; development-build URL emitted for `127.0.0.1:8081`; web URL emitted as `http://localhost:8081`. |
| iOS simulator probe | Startup-time `xcrun simctl help` probe | Blocked | `xcrun simctl help exited with non-zero code: 72`. |
| mobile-mcp device list | `mobile_list_available_devices` | Blocked | Returned `{"devices":[]}`. |
| Stop Expo/Metro | Ctrl-C Expo dev session | Pass | Expo server stopped cleanly. |

## Not Claimed

- No mobile-to-API end-to-end flow is claimed. The current mobile screen parses `EXPO_PUBLIC_API_URL` but does not call the API.
- No mobile visual QA is claimed because `mobile-mcp` reported no available devices.
- No Maestro smoke is claimed because no installed simulator/device app id was available. The default Android development fallback would be `com.template.mobile` if a device and installed app were present.

## Residual Risk

- A real simulator/device run remains required before PR readiness for mobile UI/runtime confidence.
- `xcrun simctl` failure should be addressed on the host machine if iOS simulator QA is expected.
