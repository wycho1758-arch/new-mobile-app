# Hook Evaluation Evidence

Command:

```sh
npm run test:hooks
```

Result:

- PASS: destructive `git reset --hard` fixture is denied by `mobile-pretool-policy`.
- PASS: safe `npm test` fixture is approved.
- PASS: task-scoped mobile source change emits evidence reminder.
- PASS: final stop without evidence emits advisory reminder.

Validated artifacts:

- `.codex/hooks.json`
- `.codex/hooks/mobile-pretool-policy.mjs`
- `.codex/hooks/mobile-posttool-evidence-reminder.mjs`
- `.codex/hooks/mobile-stop-gatekeeper-advisory.mjs`
- `.codex/hooks/mobile-subagent-context.mjs`
