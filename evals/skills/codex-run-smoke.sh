#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="${ROOT_DIR}/mobile-app-dev-team/runtime-sources/skills/codex-interactive-repo-work/scripts/codex-run"

assert_json_field() {
  local file="$1"
  local expression="$2"
  node - "${file}" "${expression}" <<'NODE'
const fs = require('node:fs');
const [file, expression] = process.argv.slice(2);
const r = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Function('r', `return (${expression});`)(r)) {
  console.error(`JSON assertion failed: ${expression}`);
  process.exit(1);
}
NODE
}

assert_file_not_contains() {
  local file="$1"
  local text="$2"
  if [[ -f "${file}" ]] && grep -F -- "${text}" "${file}" >/dev/null 2>&1; then
    printf 'assertion failed: %s contains forbidden text %s\n' "${file}" "${text}" >&2
    exit 1
  fi
}

make_codex() {
  local path="$1"
  mkdir -p "$(dirname "${path}")"
  cat > "${path}" <<'JS'
#!/usr/bin/env node
const fs = require('node:fs');
if (process.env.CODEX_ARGV_LOG) {
  fs.writeFileSync(process.env.CODEX_ARGV_LOG, `${JSON.stringify(process.argv.slice(2))}\n`);
}
if (process.env.CODEX_PWD_LOG) {
  fs.writeFileSync(process.env.CODEX_PWD_LOG, `${process.cwd()}\n`);
}
console.log('fake codex launched');
JS
  chmod +x "${path}"
}

make_script() {
  local path="$1"
  mkdir -p "$(dirname "${path}")"
  cat > "${path}" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
command_text=""
transcript=""
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    -c)
      shift
      command_text="$1"
      ;;
    -*)
      ;;
    *)
      transcript="$1"
      ;;
  esac
  shift
done
if [[ -n "${transcript}" ]]; then
  mkdir -p "$(dirname "${transcript}")"
  printf 'fake transcript\n' > "${transcript}"
fi
eval "${command_text}"
SH
  chmod +x "${path}"
}

write_routing() {
  local path="$1"
  local active_blocker="${2:-false}"
  mkdir -p "$(dirname "${path}")"
  cat > "${path}" <<JSON
{
  "schema": "codex-role-workflow/v1",
  "status": "ready",
  "codex_interactive_required": true,
  "codex_execution_contract": "/workspace/skills/codex-interactive-repo-work/SKILL.md",
  "allowed_repo_local_codex_skills": ["mobile-app-dev-workflow"],
  "required_reviewers": ["wm-implementation-reviewer", "mobile-architect", "qa-release", "product-planning"],
  "human_gate": {"active_blocker": ${active_blocker}},
  "task": "TASK-11.1"
}
JSON
}

write_prompt() {
  local path="$1"
  local routing_path="$2"
  local wm_token="${3:-\$wm}"
  local reviewer_text="${4:-wm-implementation-reviewer mobile-architect qa-release product-planning}"
  mkdir -p "$(dirname "${path}")"
  cat > "${path}" <<EOF
${wm_token}
/goal Implement TASK-11.1 minimal codex-run MVP launch gate wrapper.
Routing artifact: ${routing_path}
Required reviewers before Done/PR handoff: ${reviewer_text}.
Preserve human gates, external proof boundaries, and secret safety.
Do not self-approve, merge, bypass failed gates, accept human-gate risk, expose secrets, or change external platform state.
EOF
}

run_case() {
  local name="$1"
  shift
  local out="${TMPDIR}/${name}.out"
  set +e
  "${SCRIPT}" "$@" >"${out}" 2>&1
  local status=$?
  set -e
  assert_file_not_contains "${out}" "TOKEN_SHOULD_NOT_LEAK"
  printf '%s\n' "${status}"
}

run_pty_case() {
  local name="$1"
  shift
  local out="${TMPDIR}/${name}.out"
  local transcript="${TMPDIR}/${name}.outer-transcript"
  local real_script
  real_script="$(command -v script)"
  local command_text
  printf -v command_text '%q ' \
    env \
    "CODEX_ARGV_LOG=${TMPDIR}/pty-argv.json" \
    "CODEX_PWD_LOG=${TMPDIR}/pty-pwd.txt" \
    "CODEX_RUN_SMOKE_ASSUME_TTY=1" \
    "PATH=${TMPDIR}/bin:${PATH}" \
    "${SCRIPT}" \
    "$@"
  set +e
  "${real_script}" -q -e -c "${command_text}" "${transcript}" >"${out}" 2>&1
  local status=$?
  set -e
  assert_file_not_contains "${out}" "TOKEN_SHOULD_NOT_LEAK"
  if [[ "${status}" != "0" ]]; then
    sed -n '1,120p' "${out}" >&2
    if [[ -f "${TMPDIR}/evidence/${name}/blocked.json" ]]; then
      sed -n '1,160p' "${TMPDIR}/evidence/${name}/blocked.json" >&2
    fi
  fi
  printf '%s\n' "${status}"
}

TMPDIR="$(mktemp -d)"
trap 'rm -rf "${TMPDIR}"' EXIT

bash -n "${SCRIPT}"

repo="${TMPDIR}/repo"
mkdir -p "${repo}"
git -C "${repo}" init -q
git -C "${repo}" config user.email "agent@example.test"
git -C "${repo}" config user.name "Agent"
touch "${repo}/README.md"
git -C "${repo}" add README.md
git -C "${repo}" commit -q -m "test: seed"

codex="${TMPDIR}/bin/codex"
make_codex "${codex}"
make_script "${TMPDIR}/bin/script"

routing="${TMPDIR}/routing.json"
prompt="${TMPDIR}/prompt.md"
evidence="${TMPDIR}/evidence"
write_routing "${routing}"
write_prompt "${prompt}" "${routing}"

status="$(run_case valid --workdir "${repo}" --routing-artifact "${routing}" --prompt-file "${prompt}" --evidence-dir "${evidence}/valid" --report-room-id 123 --codex-bin "${codex}" --launch-mode dry-run -- --api-key TOKEN_SHOULD_NOT_LEAK)"
[[ "${status}" == "0" ]]
assert_json_field "${evidence}/valid/launch.json" "r.status === 'launched'"
assert_json_field "${evidence}/valid/launch.json" "r.launch.dry_run === true"
assert_file_not_contains "${evidence}/valid/launch.json" "TOKEN_SHOULD_NOT_LEAK"

status="$(run_pty_case pty --workdir "${repo}" --routing-artifact "${routing}" --prompt-file "${prompt}" --evidence-dir "${evidence}/pty" --report-room-id 123 --codex-bin "${codex}" --launch-mode pty -- --model test-model)"
[[ "${status}" == "0" ]]
assert_json_field "${evidence}/pty/launch.json" "r.status === 'launched'"
assert_json_field "${evidence}/pty/launch.json" "r.launch.dry_run === false"
assert_json_field "${TMPDIR}/pty-argv.json" "!r.includes('--prompt')"
assert_json_field "${TMPDIR}/pty-argv.json" "r.includes('--model')"
assert_json_field "${TMPDIR}/pty-argv.json" "r.includes('test-model')"
assert_json_field "${TMPDIR}/pty-argv.json" "r.includes(fs.readFileSync('${prompt}', 'utf8'))"
grep -Fx -- "${repo}" "${TMPDIR}/pty-pwd.txt" >/dev/null

status="$(run_case missing-routing --workdir "${repo}" --routing-artifact "${TMPDIR}/missing.json" --prompt-file "${prompt}" --evidence-dir "${evidence}/missing-routing" --report-room-id 123 --codex-bin "${codex}" --launch-mode dry-run)"
[[ "${status}" != "0" ]]
assert_json_field "${evidence}/missing-routing/blocked.json" "r.status === 'blocked_preflight'"

write_routing "${TMPDIR}/human-gate.json" true
write_prompt "${TMPDIR}/human-gate.md" "${TMPDIR}/human-gate.json"
status="$(run_case human-gate --workdir "${repo}" --routing-artifact "${TMPDIR}/human-gate.json" --prompt-file "${TMPDIR}/human-gate.md" --evidence-dir "${evidence}/human-gate" --report-room-id 123 --codex-bin "${codex}" --launch-mode dry-run)"
[[ "${status}" != "0" ]]
assert_json_field "${evidence}/human-gate/blocked.json" "r.status === 'blocked_preflight'"
assert_json_field "${evidence}/human-gate/blocked.json" "r.checks.routing_human_gate_blocker.ok === false"

write_prompt "${TMPDIR}/missing-wm.md" "${routing}" "wm"
status="$(run_case missing-wm --workdir "${repo}" --routing-artifact "${routing}" --prompt-file "${TMPDIR}/missing-wm.md" --evidence-dir "${evidence}/missing-wm" --report-room-id 123 --codex-bin "${codex}" --launch-mode dry-run)"
[[ "${status}" != "0" ]]
assert_json_field "${evidence}/missing-wm/blocked.json" "r.checks.prompt_wm_invocation.ok === false"

status="$(run_case nonnumeric-room --workdir "${repo}" --routing-artifact "${routing}" --prompt-file "${prompt}" --evidence-dir "${evidence}/nonnumeric-room" --report-room-id room-123 --codex-bin "${codex}" --launch-mode dry-run)"
[[ "${status}" != "0" ]]
assert_json_field "${evidence}/nonnumeric-room/blocked.json" "r.checks.report_room_id_numeric.ok === false"

write_prompt "${TMPDIR}/missing-reviewers.md" "${routing}" "\$wm" "wm-implementation-reviewer"
status="$(run_case missing-reviewers --workdir "${repo}" --routing-artifact "${routing}" --prompt-file "${TMPDIR}/missing-reviewers.md" --evidence-dir "${evidence}/missing-reviewers" --report-room-id 123 --codex-bin "${codex}" --launch-mode dry-run)"
[[ "${status}" != "0" ]]
assert_json_field "${evidence}/missing-reviewers/blocked.json" "r.checks.prompt_required_reviewers.ok === false"

status="$(run_case missing-prompt --workdir "${repo}" --routing-artifact "${routing}" --prompt-file "${TMPDIR}/missing-prompt.md" --evidence-dir "${evidence}/missing-prompt" --report-room-id 123 --codex-bin "${codex}" --launch-mode dry-run)"
[[ "${status}" != "0" ]]
assert_json_field "${evidence}/missing-prompt/blocked.json" "r.checks.prompt_file.ok === false"

touch "${TMPDIR}/not-dir"
status="$(run_case missing-evidence --workdir "${repo}" --routing-artifact "${routing}" --prompt-file "${prompt}" --evidence-dir "${TMPDIR}/not-dir/child" --report-room-id 123 --codex-bin "${codex}" --launch-mode dry-run)"
[[ "${status}" != "0" ]]

status="$(run_case missing-codex --workdir "${repo}" --routing-artifact "${routing}" --prompt-file "${prompt}" --evidence-dir "${evidence}/missing-codex" --report-room-id 123 --codex-bin "${TMPDIR}/bin/missing-codex" --launch-mode dry-run)"
[[ "${status}" != "0" ]]
assert_json_field "${evidence}/missing-codex/blocked.json" "r.status === 'codex_not_found'"

printf 'codex-run smoke self-test passed\n'
