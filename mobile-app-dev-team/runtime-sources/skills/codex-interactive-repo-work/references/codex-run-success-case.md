# Codex Run Launch Gate Success Case

This packet fixes the TASK-11.1 successful launch-gate flow as repo source of
truth. It exists so another practitioner can reproduce the same runtime wrapper
materialization, launch evidence, and fail-closed behavior after a normal repo
sync.

## Scope and boundary

This is Codex runtime tooling evidence only. It does not prove app UI, native
runtime, live external platform state, merge readiness, release readiness,
production readiness, or app readiness.

The deliverable is repo SoT under:

```text
mobile-app-dev-team/runtime-sources/skills/codex-interactive-repo-work/
mobile-app-dev-team/runtime-sources/skills/openclaw-pod-skills-sync/
evals/skills/
```

The live file `/workspace/codex-hooks/codex-run` is materialization proof only.
It is not the source of truth.

## Successful flow

1. `openclaw-pod-skills-sync` copies the repo-source wrapper from:

   ```text
   mobile-app-dev-team/runtime-sources/skills/codex-interactive-repo-work/scripts/codex-run
   ```

   to:

   ```text
   /workspace/codex-hooks/codex-run
   ```

2. The sync report records `codex_hooks.codex_run.status=applied`, source path,
   target path, wrapper sha256, and `cmp=true`.

3. A valid launch request supplies:
   - git workdir;
   - `codex-role-workflow/v1` routing artifact with `status=ready`,
     `codex_interactive_required=true`, expected execution contract, allowed
     skill, required reviewers, and no active human-gate blocker;
   - prompt file containing `$wm` or `/wm`, routing artifact path, required
     reviewer names, human-gate, external-proof, and secret-safety wording;
   - numeric report room id;
   - executable Codex CLI path;
   - launch mode `dry-run` or `pty`.

4. In dry-run mode the wrapper writes `launch.json` and does not invoke Codex.

5. In PTY mode the wrapper launches Codex through `script`, from the requested
   workdir, using supported Codex positional prompt text:

   ```text
   codex [caller options] "<prompt text>"
   ```

   The wrapper must not use unsupported `codex --prompt <prompt-file>`.

## Commands and outputs used for TASK-11.1

Focused validation commands:

```bash
bash -n mobile-app-dev-team/runtime-sources/skills/codex-interactive-repo-work/scripts/codex-run
bash -n mobile-app-dev-team/runtime-sources/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh
bash -n evals/skills/codex-run-smoke.sh
bash -n evals/skills/openclaw-pod-skills-sync-smoke.sh
TMPDIR=/dev/shm bash evals/skills/codex-run-smoke.sh
bash evals/skills/openclaw-pod-skills-sync-smoke.sh
node scripts/validate-runtime-sources.mjs
node scripts/validate-project-environment.mjs --self-test && node scripts/validate-project-environment.mjs
node scripts/validate-evidence-hygiene.mjs --self-test && node scripts/validate-evidence-hygiene.mjs
git diff --check
```

Observed focused outputs:

```text
codex-run smoke self-test passed
openclaw-pod-skills-sync smoke passed
Validated runtime source docs.
Validated project environment fixtures.
Validated project environment drift checks.
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
```

Live materialization command used in Hyunwoo context:

```bash
OPENCLAW_ROLE_SLUG=mobile-app-dev \
OPENCLAW_EXPECTED_ROLE_SLUG=mobile-app-dev \
OPENCLAW_POD_SKILLS_SYNC_REPORT_PATH=/workspace/state/task-11-1-codex-run-live-sync-report.json \
bash mobile-app-dev-team/runtime-sources/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh
```

Then verify:

```bash
test -x /workspace/codex-hooks/codex-run
cmp -s \
  mobile-app-dev-team/runtime-sources/skills/codex-interactive-repo-work/scripts/codex-run \
  /workspace/codex-hooks/codex-run
node -e "const r=require('/workspace/state/task-11-1-codex-run-live-sync-report.json'); const h=r.codex_hooks&&r.codex_hooks.codex_run; if(!h||h.status!=='applied'||!h.cmp) process.exit(1); console.log(JSON.stringify(h,null,2));"
```

Expected report excerpt:

```json
{
  "status": "applied",
  "source_path": "/workspace/projects/Wondermove-Inc/new-mobile-app/mobile-app-dev-team/runtime-sources/skills/codex-interactive-repo-work/scripts/codex-run",
  "target_path": "/workspace/codex-hooks/codex-run",
  "sha256": "<sha256>",
  "cmp": true
}
```

## Generated evidence

The wrapper writes success evidence to `launch.json` and blocked evidence to
`blocked.json` when the requested evidence directory is writable. If the
evidence path itself is invalid, it writes a fallback blocked report under a
temporary `codex-run-blocked-*` directory and reports `wrapper_error`.

`launch.json` includes schema, `status=launched`, timestamps, workdir, routing
artifact path, prompt file path and `prompt_sha256`, numeric report room id,
wrapper path, Codex path, redacted wrapper/Codex argv, check results, launch
decision, dry-run flag, transcript/log path when applicable, exit status, and
safety flags.

`blocked.json` includes schema, blocked status class, failed checks, blocked
reasons when available, nonzero exit status, and safety flags.

Status classes:

- `launched`
- `blocked_preflight`
- `codex_not_found`
- `codex_exit_nonzero`
- `operator_interrupted`
- `wrapper_error`

## Fail-closed behavior

The wrapper blocks before launching Codex when required inputs are missing or
unsafe, including missing or non-git workdir, missing routing artifact, missing
prompt file, invalid evidence path, non-numeric room id, missing Codex CLI,
routing not ready, missing `codex_interactive_required`, wrong execution
contract, missing allowed repo-local skill, missing required reviewers, active
human-gate blocker, missing `$wm`/`/wm` prompt guardrail, missing routing path in
prompt, missing reviewer names in prompt, missing human-gate / external-proof /
secret-safety prompt language, PTY mode without a PTY-capable terminal, or PTY
mode without `script`.

When preflight fails, the wrapper writes blocked evidence and returns nonzero.
It must not silently fall back to raw Codex when required checks are in scope.

## Offline QA fixture evidence

TASK-11.1 produced persistent QA artifacts under:

```text
.evidence/task-11-1-codex-run-mvp-launch-gate/qa-evidence/
```

`status-summary.json` maps fail-closed matrix cases to artifact paths, status
classes, and exit statuses. The forced offline fixture cases include:

- human-gate blocker
- missing Codex CLI
- missing evidence directory
- missing prompt
- missing routing artifact
- missing workdir
- nonnumeric room id
- positive dry-run
- positive PTY with fake Codex
- prompt missing forbidden-boundary language
- prompt missing reviewers
- prompt missing `$wm`/`/wm`
- routing missing interactive-required
- routing not ready

Residual risk to preserve in PR/Product review: `codex_exit_nonzero` and
`operator_interrupted` are implemented PTY runtime outcomes, but were not
force-triggered in the offline fixture run.

## Reviewer and planning evidence

TASK-11.1 used Spring-approved alternate reviewer routing because
`wm-implementation-reviewer` was unavailable through the headless helper:

- monolithic final review timed out twice;
- split Packet A timed out with exit `124`;
- Packet A output was missing/empty.

Alternate evidence:

- Sohee / Mobile Architect: GO with conditions;
- Sarah / QA-Release: GO with conditions after TASK attachments 20 and 21;
- Spring / Product Planning: GO for PR preparation and normal PR review, not
  merge, release, production, or app-readiness approval.

## Practitioner reproduction checklist

A practitioner can reproduce the rollout evidence by:

1. checking out the repo branch;
2. running the focused validation commands above;
3. running the live materialization command with the expected role slug;
4. confirming `/workspace/codex-hooks/codex-run` is executable;
5. confirming repo source and live wrapper compare equal;
6. confirming the sync report contains `codex_hooks.codex_run.status=applied`
   and `cmp=true`;
7. reviewing `evals/skills/codex-run-smoke.sh` output for dry-run, PTY fake
   Codex, and fail-closed matrix coverage.
