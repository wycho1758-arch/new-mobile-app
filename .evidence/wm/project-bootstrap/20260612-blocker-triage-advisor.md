**Failure Classification**

Command reported: `node scripts/codex-preflight.mjs --pod --json`  
Exit code: `1` when `--pod` status is blocked. The script exits non-zero on blocked pod preflight at [scripts/codex-preflight.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/codex-preflight.mjs:572). Relevant reported blockers: `no-valid-codex-binary`, `git-identity-missing`, `github-auth-unavailable`.

1. **`no-valid-codex-binary` is mechanically valid per current script, but likely a validator false negative.**

   `--pod` adds `no-valid-codex-binary` whenever no candidate passes `evaluateCandidate()` [scripts/codex-preflight.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/codex-preflight.mjs:402). Candidate probing rejects a path before running `--version`, `exec --help`, or smoke if `file` output does not match host arch [scripts/codex-preflight.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/codex-preflight.mjs:112). That means an npm symlink / JS wrapper such as `/workspace/.npm-global/bin/codex` can work at runtime but still be rejected during arch validation.

   Root cause: `codex-preflight` assumes the Codex entrypoint is a native binary. For npm-installed JS/symlink entrypoints, arch should be treated as architecture-neutral or resolved through the Node target before smoke.

   Owner: runtime maintainer.

   Smallest next action: update the validator tests first, then the candidate acceptance logic to allow symlink/JS Node entrypoints only after `--version`, `exec --help`, and read-only smoke pass. Rerun:
   ```bash
   pnpm run test:local-harness:preflight
   CODEX_BIN=/workspace/.npm-global/bin/codex node scripts/codex-preflight.mjs --pod --json --no-write
   ```

2. **`git-identity-missing` is valid if effective Git author name or email is unset.**

   The script checks `git config --get user.name` and `git config --get user.email` [scripts/codex-preflight.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/codex-preflight.mjs:76), then blocks if either command fails [scripts/codex-preflight.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/codex-preflight.mjs:403). The blocker guide says the agent may check these values, but must not invent an email; without an approved source, this remains human-owned [blocker-resolution-guide.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md:189).

   Owner: human gate for approving identity; pod agent/runtime can apply it after approval.

   Smallest next action:
   ```bash
   git config --global user.name "<approved name>"
   git config --global user.email "<approved email>"
   node scripts/codex-preflight.mjs --pod --json --no-write
   ```

3. **`github-auth-unavailable` is valid if `gh auth status` exits non-zero.**

   The script runs `gh auth status` [scripts/codex-preflight.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/codex-preflight.mjs:80) and blocks on non-zero status [scripts/codex-preflight.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/codex-preflight.mjs:404). The guide requires GitHub auth through `gh auth login` or an approved mounted/managed secret, and forbids token values in chat or evidence [blocker-resolution-guide.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md:213).

   Owner: human gate/platform credential owner unless approved mounted auth already exists.

   Smallest next action:
   ```bash
   gh auth status
   gh auth login
   gh auth status
   node scripts/codex-preflight.mjs --pod --json --no-write
   ```

**Blocking Status**

These are project-bootstrap / pod readiness blockers, not direct mobile lint/test failures. `PROJECT_ENVIRONMENT.md` defines `--pod` as repo-local pod readiness preflight that exits non-zero on blockers and does not prove external platform state [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:338). For PRs that change runtime files, local harness is PR-blocking via quality gate path detection [quality-gate.yml](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.github/workflows/quality-gate.yml:25). Failed gates remain failed until rerun successfully.