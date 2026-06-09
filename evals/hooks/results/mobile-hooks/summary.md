# Hook Evaluation Evidence

Command:

```sh
pnpm run test:hooks
```

Result:

- PASS: destructive `git reset --hard` fixture is denied by `mobile-pretool-policy`.
- PASS: clean native regeneration fixture is denied by `mobile-pretool-policy`.
- PASS: quoted clean native regeneration fixture is denied by `mobile-pretool-policy`.
- PASS: production EAS operation fixture is denied by `mobile-pretool-policy`.
- PASS: quoted production EAS operation fixture is denied by `mobile-pretool-policy`.
- PASS: production EAS operation through `npx eas-cli` is denied by `mobile-pretool-policy`.
- PASS: production EAS operation through `pnpm dlx eas-cli` is denied by `mobile-pretool-policy`.
- PASS: package-manager mixing fixture is denied by `mobile-pretool-policy`.
- PASS: quoted destructive git fixture is denied by `mobile-pretool-policy`.
- PASS: package-manager mixing through a shell wrapper is denied by `mobile-pretool-policy`.
- PASS: package-manager mixing through an eval wrapper is denied by `mobile-pretool-policy`.
- PASS: quoted package-manager verb is denied by `mobile-pretool-policy`.
- PASS: destructive removal of protected repo paths is denied by `mobile-pretool-policy`.
- PASS: destructive removal with reordered flags, split flags, and option terminator forms is denied by `mobile-pretool-policy`.
- PASS: `.env` read fixture is denied by `mobile-pretool-policy`.
- PASS: root `.env` read fixture is denied by `mobile-pretool-policy`.
- PASS: root `.env.production` read through `sed` is denied by `mobile-pretool-policy`.
- PASS: `.env` read through an eval wrapper is denied by `mobile-pretool-policy`.
- PASS: quoted `.env` read is denied by `mobile-pretool-policy`.
- PASS: `.env` read through `rg` is denied by `mobile-pretool-policy`.
- PASS: `.env` read through `grep` is denied by `mobile-pretool-policy`.
- PASS: quoted env-file reads through `rg` and `grep` are denied by `mobile-pretool-policy`.
- PASS: policy text search input is approved by `mobile-pretool-policy`.
- PASS: safe `npm test` fixture is approved.
- PASS: task-scoped mobile source change emits evidence reminder.
- PASS: read-only command output that mentions mobile paths does not emit a change reminder.
- PASS: runtime wiring changes under `.codex`, `.agents`, and `scripts` emit evidence reminders.
- PASS: final stop requests continuation when evidence is missing.
- PASS: final stop blocks review wording that lacks verification evidence.
- PASS: final stop blocks added/change wording that lacks verification evidence.
- PASS: final stop blocks completed/done wording that lacks verification evidence.
- PASS: final stop blocks reviewed wording that lacks verification evidence.
- PASS: final stop blocks finished/shipped/ready wording that lacks verification evidence.
- PASS: final stop allows a response that reports verification/evidence.
- PASS: session start emits mobile runtime context.

Validated artifacts:

- `.codex/hooks.json`
- `.codex/hooks/mobile-pretool-policy.mjs`
- `.codex/hooks/mobile-posttool-evidence-reminder.mjs`
- `.codex/hooks/mobile-stop-gatekeeper-advisory.mjs`
- `.codex/hooks/mobile-subagent-context.mjs`
