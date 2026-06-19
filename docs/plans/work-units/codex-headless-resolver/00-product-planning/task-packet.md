# Codex Headless Resolver Fix Plan

Date: 2026-06-19

## 0. Decision

- status: required
- PRD acceptance / SoT reference: user requested a revised plan that reflects
  reviewer findings for making Codex headless review work across macOS,
  Linux/Ubuntu, and Windows without relying on a broken first PATH hit.
- owner: Product/Planning
- implementation owner: Mobile App Dev
- input artifact: `wm-implementation-reviewer` NO_GO review on the initial
  resolver approach.
- output artifact: this revised task packet.
- acceptance criteria: implementation plan must address all Medium reviewer
  findings before any code edit starts.
- evidence requirement: future implementation must include tests for resolver
  selection, local smoke, and runtime validators.
- dependencies/blockers: reviewer re-check is required before implementation.
- open decisions: exact module filename and export shape are implementation
  details, but resolver behavior below is required.
- next responsible role: Product/Planning for re-review, then Mobile App Dev for
  implementation after approval.
- GitHub branch/PR handoff link: not created yet.

This plan does not authorize code changes yet. It records the required fix
shape after reviewer feedback.

## 1. Problem Summary

Current failure mode:

- `scripts/codex-headless-review.mjs` runs `spawnSync('codex', ...)`.
- On the current Apple Silicon Mac, `PATH` resolves `codex` to
  `/usr/local/bin/codex`.
- `/usr/local/bin/codex` is an x86_64 binary linked to
  `/usr/local/Caskroom/codex/0.73.0/codex-x86_64-apple-darwin`.
- Running that binary exits with status `137`.
- `/opt/homebrew/bin/codex` is an arm64 binary linked to
  `/opt/homebrew/Caskroom/codex/0.140.0/codex-aarch64-apple-darwin`.
- `/opt/homebrew/bin/codex` successfully runs headless review with `gpt-5.5`.

Root cause:

- The helper depends on PATH's first `codex` hit, while `scripts/codex-preflight.mjs`
  already has candidate/architecture logic that selects the correct binary.
- Preflight and headless review can therefore drift.

## 2. Reviewer Findings To Fix

Reviewer: `wm-implementation-reviewer`

Verdict: `NO_GO` for the initial approach.

Findings incorporated:

1. Linux absolute defaults were incomplete.
   - Required fix: include `/home/linuxbrew/.linuxbrew/bin/codex` for Linux
     because Homebrew's documented Linux prefix is `/home/linuxbrew/.linuxbrew`.
2. Architecture detection was too single-arch.
   - Required fix: parse file output as a compatible architecture set, so
     universal or multi-arch binaries are accepted when the host architecture is
     included.
3. Shared resolver was only "preferred".
   - Required fix: make shared resolver behavior mandatory so preflight and
     headless review cannot drift again.
4. Runtime documentation may become stale.
   - Required fix: update `PROJECT_ENVIRONMENT.md` if helper behavior changes
     from literal PATH lookup to selected absolute resolver behavior.

## 3. Official-Doc Basis

- Homebrew installation defaults:
  - Apple Silicon macOS: `/opt/homebrew`
  - Intel macOS: `/usr/local`
  - Linux: `/home/linuxbrew/.linuxbrew`
- Node runtime APIs:
  - `process.platform` identifies `darwin`, `linux`, `win32`, and other runtime
    platforms.
  - `process.arch` reports the architecture Node was compiled for.
  - `os.machine()` is preferred for the machine type when available.
  - `child_process` command lookup uses PATH; Windows `.bat` and `.cmd` files
    need `cmd.exe` / shell handling.
- Codex CLI:
  - `codex exec` supports model selection, sandbox selection, and
    `--output-last-message`.

## 4. Required Design

Create one canonical Codex binary resolver and use it from both:

- `scripts/codex-preflight.mjs`
- `scripts/codex-headless-review.mjs`

The resolver must return an execution descriptor:

```json
{
  "command": "/absolute/path/to/codex-or-wrapper",
  "argsPrefix": [],
  "path": "/absolute/path/to/codex-or-wrapper",
  "platform": "darwin | linux | win32",
  "hostArch": "arm64 | x64 | unknown",
  "candidateReport": []
}
```

For Windows `.cmd` or `.bat` candidates, the descriptor may use:

```json
{
  "command": "C:\\\\path\\\\codex.cmd",
  "argsPrefix": [],
  "shell": true
}
```

The implementation should choose the simpler safe Windows invocation that uses
Node's shell handling for `.cmd` and `.bat` wrappers, passes tests, and does not
expose secrets.

## 5. Candidate Order

Candidate order must prefer verified absolute paths before falling back to PATH.

1. `CODEX_BIN`, if set.
2. Platform defaults:
   - macOS:
     - `/opt/homebrew/bin/codex`
     - `/usr/local/bin/codex`
   - Linux/Ubuntu:
     - `/usr/local/bin/codex`
     - `/usr/bin/codex`
     - `/home/linuxbrew/.linuxbrew/bin/codex`
   - Windows:
     - absolute `CODEX_BIN`, if set
     - PATH/PATHEXT-resolved `codex.exe`
     - PATH/PATHEXT-resolved `codex.cmd`
     - PATH/PATHEXT-resolved `codex.bat`
     - PATH/PATHEXT-resolved `codex`
3. All PATH-resolved candidates, not only the first `codex`.

Do not hardcode this Mac's `/opt/homebrew/bin/codex` as the only path.
Do select `/opt/homebrew/bin/codex` on this Mac because it is the verified
absolute arm64 candidate.

## 6. Host Architecture Detection

Preferred host architecture source:

1. `os.machine()` when available.
2. fallback to `process.arch`.
3. POSIX fallback command only if needed.

Normalize host architecture:

- `arm64`, `aarch64` -> `arm64`
- `x64`, `x86_64`, `amd64` -> `x64`
- unknown values remain `unknown`

## 7. Candidate Architecture Detection

POSIX candidate detection:

- Use `file <candidate>` when available.
- Parse output into an architecture set, not a single architecture.
- Recognize:
  - `arm64`
  - `aarch64`
  - `x86_64`
  - `amd64`
  - `x64`
- Reject a candidate only when:
  - candidate architecture is known; and
  - host architecture is known; and
  - the normalized host architecture is not in the candidate architecture set.

Accept unknown architecture for wrapper scripts, Node shims, npm shims, or
Windows wrappers if the candidate passes executable validation, `--version`, and
`exec --help`.

Universal binary example:

```text
file output contains both arm64 and x86_64
host arch is arm64
result: accept, because arm64 is present
```

## 8. Candidate Validation

Each candidate must be validated before use:

- exists
- executable, where applicable
- architecture compatible or unknown wrapper
- `--version` exits 0
- `exec --help` exits 0

Preflight may additionally run a read-only smoke:

```bash
codex exec --sandbox read-only "Return exactly: LOCAL_CODEX_HEADLESS_OK"
```

Headless review should use the selected resolver descriptor for actual reviewer
execution.

## 9. Headless Review Change

Replace:

```js
spawnSync('codex', [...])
```

with:

```js
const selectedCodex = resolveCodexBinary({ cwd: root });
spawnSync(
  selectedCodex.command,
  [...selectedCodex.argsPrefix, ...codexArgs],
  spawnOptions,
);
```

On failure, print clear diagnostics:

- platform
- host architecture
- candidates checked
- rejection reasons
- selected candidate, if any
- remediation:
  - set `CODEX_BIN`
  - fix PATH order
  - install native Codex binary for the host
  - remove or upgrade stale local binary through package manager

## 10. Current Mac Local Remediation Decision

Do not change `/usr/local/bin/codex` to arm64 as part of this repo fix.

Reason:

- `/usr/local` is the Intel/Rosetta Homebrew prefix on macOS by Homebrew
  convention.
- Manually repointing `/usr/local/bin/codex` to `/opt/homebrew/...` would be
  local machine maintenance, not repo SoT.
- It may confuse package-manager ownership.

Allowed local workaround:

```bash
CODEX_BIN=/opt/homebrew/bin/codex node scripts/codex-headless-review.mjs ...
```

or:

```bash
PATH="/opt/homebrew/bin:$PATH" node scripts/codex-headless-review.mjs ...
```

Longer-term local cleanup, if desired, should use Homebrew-owned
uninstall/upgrade/migration flow, not manual symlink edits.

## 11. Required Tests

Add or update tests before implementation.

Required fixture coverage:

- macOS arm64:
  - `/usr/local/bin/codex` x86_64 appears before `/opt/homebrew/bin/codex`
  - resolver rejects x86_64 candidate and selects arm64 candidate
- macOS universal:
  - candidate file output includes both `arm64` and `x86_64`
  - resolver accepts on arm64 host
- Linux aarch64:
  - `/usr/local/bin/codex` or `/usr/bin/codex` ELF aarch64 is accepted
- Linux Homebrew:
  - `/home/linuxbrew/.linuxbrew/bin/codex` is included and accepted when valid
- Linux x86_64 wrapper:
  - file architecture unknown or wrapper-like
  - accepted only after version/help pass
- Windows:
  - PATH/PATHEXT resolves `codex.exe`
  - PATH/PATHEXT resolves `codex.cmd` or `codex.bat`
  - wrapper execution descriptor includes proper command handling
- failure case:
  - no valid candidate
  - error includes diagnostics and remediation
- drift prevention:
  - preflight and headless review use the same resolver module

## 12. Required File Changes

Expected implementation files:

- add shared resolver module, for example:
  - `scripts/lib/codex-binary-resolver.mjs`
- update:
  - `scripts/codex-preflight.mjs`
  - `scripts/codex-headless-review.mjs`
- update tests/fixtures:
  - existing `evals/local-harness/preflight/fixtures/**`, or a new focused
    resolver fixture location
- update docs if behavior changes:
  - `PROJECT_ENVIRONMENT.md`

Do not change:

- `.codex/hooks/**`
- `.codex/agents/**`
- `/usr/local/bin/codex`

unless a future reviewer finds a separate direct issue in those surfaces.

## 13. Verification Plan

Minimum verification after implementation:

```bash
pnpm run validate
pnpm run test:hooks
pnpm run validate:project-environment
node scripts/codex-preflight.mjs --json --no-write
node scripts/codex-headless-review.mjs --json-envelope --agent po-planning-reviewer --prompt <smoke-prompt> --out <tmp-output>
```

Because this touches Codex runtime scripts, required broader verification:

```bash
pnpm run test:runtime
```

If local harness path classification treats the change as runtime/harness
relevant, also run:

```bash
pnpm run test:local-harness
```

## 14. Acceptance Criteria

Implementation is ready for final review only when:

- all Medium reviewer findings are directly addressed;
- preflight and headless review share one canonical resolver behavior;
- selected Codex command is an absolute path when possible;
- Linux Homebrew path is included;
- universal/multi-arch candidates are handled correctly;
- Windows PATH/PATHEXT candidates are supported without POSIX-only assumptions;
- stale `/usr/local/bin/codex` on this Mac no longer breaks headless review;
- diagnostics are actionable;
- required validators pass;
- reviewer evidence is collected after implementation.

## 15. Not Approved

This plan does not approve:

- modifying `/usr/local/bin/codex`;
- manual symlink changes outside the repo;
- package-manager cleanup on the user's machine;
- changing Codex model policy from `gpt-5.5`;
- changing `.codex/hooks`;
- changing `.codex/agents`;
- broad runtime refactors beyond resolver sharing.

## 16. Next Action

Request reviewer re-check of this revised plan. If reviewer returns GO, proceed
with tests-first implementation in the smallest slice:

1. add resolver tests/fixtures;
2. add shared resolver;
3. migrate preflight to shared resolver;
4. migrate headless review to shared resolver;
5. update docs if needed;
6. run required verification;
7. request final reviewer check.
