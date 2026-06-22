#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';

const envFileDenyReason = [
  'Blocked by mobile-pretool-policy: \\b(cat|less|more|head|tail|sed|rg|grep)\\b.*(^|\\s|\\/)',
  '\\.',
  'env',
  '(\\.|$|\\s)',
].join('');
const protectedRmDenyReason = 'Blocked by mobile-pretool-policy: rm\\s+(?:-[^\\s]+\\s+)*(?:--\\s+)?(\\/|\\$home|~|\\.|apps\\/mobile|\\.codex|\\.agents|packages\\/contracts|evals|scripts)';

const cases = [
  {
    name: 'pretool denies destructive git',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    fixture: 'evals/hooks/fixtures/pretool-deny.json',
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: git\\s+reset\\s+--hard',
    },
  },
  {
    name: 'pretool allows npm test',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    fixture: 'evals/hooks/fixtures/pretool-allow.json',
    exitCode: 0,
    expect: {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
      },
    },
  },
  {
    name: 'pretool denies clean native regeneration',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    fixture: 'evals/hooks/fixtures/pretool-deny-prebuild-clean.json',
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: expo\\s+prebuild\\b.*--clean',
    },
  },
  {
    name: 'pretool denies quoted clean native regeneration',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: ['npx', 'expo', 'prebuild', `--"${'clean'}"`].join(' '),
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: `Blocked by mobile-pretool-policy: expo\\s+prebuild\\b.*--${'clean'}`,
    },
  },
  {
    name: 'pretool denies production EAS operation',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    fixture: 'evals/hooks/fixtures/pretool-deny-eas-production.json',
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\beas\\s+(build|submit|update)\\b.*\\b(prod|production)\\b',
    },
  },
  {
    name: 'pretool denies quoted production EAS operation',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: ['eas', 'build', '--profile', `"${'production'}"`, '--platform', 'ios'].join(' '),
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\beas\\s+(build|submit|update)\\b.*\\b(prod|production)\\b',
    },
  },
  {
    name: 'pretool denies production EAS operation through npx eas-cli wrapper',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: 'npx eas-cli build --profile production --platform ios',
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(npx|pnpm\\s+dlx)\\s+eas-cli\\b.*\\b(build|submit|update)\\b.*\\b(prod|production)\\b',
    },
  },
  {
    name: 'pretool denies production EAS operation through pnpm dlx eas-cli wrapper',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: 'pnpm dlx eas-cli submit --profile production',
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(npx|pnpm\\s+dlx)\\s+eas-cli\\b.*\\b(build|submit|update)\\b.*\\b(prod|production)\\b',
    },
  },
  {
    name: 'pretool denies package-manager mixing',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    fixture: 'evals/hooks/fixtures/pretool-deny-npm-install.json',
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(npm|yarn)\\s+(install|add|remove|update)\\b',
    },
  },
  {
    name: 'pretool denies quoted destructive git',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: ['git', 'reset', `--"${'hard'}"`, 'HEAD'].join(' '),
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: `Blocked by mobile-pretool-policy: git\\s+reset\\s+--${'hard'}`,
    },
  },
  {
    name: 'pretool denies destructive repo path removal',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: 'rm -rf apps/mobile',
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: protectedRmDenyReason,
    },
  },
  {
    name: 'pretool denies destructive repo path removal with reordered flags',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: ['rm', '-fr', 'apps/mobile'].join(' '),
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: protectedRmDenyReason,
    },
  },
  {
    name: 'pretool denies destructive repo path removal with split flags',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: ['rm', '-r', '-f', 'apps/mobile'].join(' '),
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: protectedRmDenyReason,
    },
  },
  {
    name: 'pretool denies destructive repo path removal with option terminator',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: ['rm', '-rf', '--', 'apps/mobile'].join(' '),
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: protectedRmDenyReason,
    },
  },
  {
    name: 'pretool denies package-manager mixing through shell wrapper',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: `bash -lc "${'npm'} ${'install'} nativewind"`,
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(npm|yarn)\\s+(install|add|remove|update)\\b',
    },
  },
  {
    name: 'pretool denies package-manager mixing through eval wrapper',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: `eval "${'npm'} ${'install'} nativewind"`,
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(npm|yarn)\\s+(install|add|remove|update)\\b',
    },
  },
  {
    name: 'pretool denies quoted package-manager verb',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: `npm "${'install'}" nativewind`,
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(npm|yarn)\\s+(install|add|remove|update)\\b',
    },
  },
  {
    name: 'pretool denies env file read',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    fixture: 'evals/hooks/fixtures/pretool-deny-env-read.json',
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(cat|less|more|head|tail|sed|rg|grep)\\b.*(^|\\s|\\/)\\.env(\\.|$|\\s)',
    },
  },
  {
    name: 'pretool denies root env file read',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: 'cat .env',
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(cat|less|more|head|tail|sed|rg|grep)\\b.*(^|\\s|\\/)\\.env(\\.|$|\\s)',
    },
  },
  {
    name: 'pretool denies root env file read through sed',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: 'sed -n 1,20p .env.production',
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(cat|less|more|head|tail|sed|rg|grep)\\b.*(^|\\s|\\/)\\.env(\\.|$|\\s)',
    },
  },
  {
    name: 'pretool denies env file read through eval wrapper',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: 'eval "cat apps/mobile/.env.production"',
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(cat|less|more|head|tail|sed|rg|grep)\\b.*(^|\\s|\\/)\\.env(\\.|$|\\s)',
    },
  },
  {
    name: 'pretool denies quoted env file read',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: 'cat "apps/mobile/.env.production"',
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(cat|less|more|head|tail|sed|rg|grep)\\b.*(^|\\s|\\/)\\.env(\\.|$|\\s)',
    },
  },
  {
    name: 'pretool denies env file read through rg',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: 'rg -n . apps/mobile/.env.production',
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(cat|less|more|head|tail|sed|rg|grep)\\b.*(^|\\s|\\/)\\.env(\\.|$|\\s)',
    },
  },
  {
    name: 'pretool denies quoted env file read through rg',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: ['rg -n . "apps/mobile/', 'env.production"'].join('.'),
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: envFileDenyReason,
    },
  },
  {
    name: 'pretool denies env file read through grep',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: 'grep -n . .env.production',
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Blocked by mobile-pretool-policy: \\b(cat|less|more|head|tail|sed|rg|grep)\\b.*(^|\\s|\\/)\\.env(\\.|$|\\s)',
    },
  },
  {
    name: 'pretool denies quoted env file read through grep',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: ['grep -n . "', 'env.production"'].join('.'),
      },
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: envFileDenyReason,
    },
  },
  {
    name: 'pretool allows policy text search',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    input: {
      tool_name: 'Bash',
      tool_input: {
        command: `rg -n "${'npm'} ${'install'}|expo prebuild|production" docs`,
      },
    },
    exitCode: 0,
    expect: {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
      },
    },
  },
  {
    name: 'posttool emits evidence reminder',
    script: '.codex/hooks/mobile-posttool-evidence-reminder.mjs',
    fixture: 'evals/hooks/fixtures/posttool-evidence.json',
    exitCode: 0,
    expect: {
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: 'Mobile task files changed. Capture test/build/evidence output before final response.',
      },
    },
  },
  {
    name: 'posttool ignores read-only path output',
    script: '.codex/hooks/mobile-posttool-evidence-reminder.mjs',
    fixture: 'evals/hooks/fixtures/posttool-readonly-output.json',
    exitCode: 0,
    expect: {
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
      },
    },
  },
  {
    name: 'posttool emits runtime evidence reminder',
    script: '.codex/hooks/mobile-posttool-evidence-reminder.mjs',
    input: {
      tool_name: 'apply_patch',
      tool_input: {
        patch: [
          '*** Begin Patch',
          '*** Update File: .codex/hooks/mobile-pretool-policy.mjs',
          '@@',
          '-old',
          '+new',
          '*** End Patch',
          '',
        ].join('\n'),
      },
    },
    exitCode: 0,
    expect: {
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: 'Mobile task files changed. Capture test/build/evidence output before final response.',
      },
    },
  },
  {
    name: 'stop continues when final evidence is missing',
    script: '.codex/hooks/mobile-stop-gatekeeper-advisory.mjs',
    fixture: 'evals/hooks/fixtures/stop-missing-evidence.json',
    exitCode: 0,
    expect: {
      decision: 'block',
      reason:
        'Mobile final response is missing test/build/evidence output. Continue once, then include commands run and key results, or explicitly state what was not run and why.',
    },
  },
  {
    name: 'stop blocks review wording without evidence',
    script: '.codex/hooks/mobile-stop-gatekeeper-advisory.mjs',
    fixture: 'evals/hooks/fixtures/stop-review-bypass.json',
    exitCode: 0,
    expect: {
      decision: 'block',
      reason:
        'Mobile final response is missing test/build/evidence output. Continue once, then include commands run and key results, or explicitly state what was not run and why.',
    },
  },
  {
    name: 'stop blocks added wording without evidence',
    script: '.codex/hooks/mobile-stop-gatekeeper-advisory.mjs',
    fixture: 'evals/hooks/fixtures/stop-added-bypass.json',
    exitCode: 0,
    expect: {
      decision: 'block',
      reason:
        'Mobile final response is missing test/build/evidence output. Continue once, then include commands run and key results, or explicitly state what was not run and why.',
    },
  },
  {
    name: 'stop blocks completed wording without evidence',
    script: '.codex/hooks/mobile-stop-gatekeeper-advisory.mjs',
    fixture: 'evals/hooks/fixtures/stop-completed-bypass.json',
    exitCode: 0,
    expect: {
      decision: 'block',
      reason:
        'Mobile final response is missing test/build/evidence output. Continue once, then include commands run and key results, or explicitly state what was not run and why.',
    },
  },
  {
    name: 'stop blocks reviewed wording without evidence',
    script: '.codex/hooks/mobile-stop-gatekeeper-advisory.mjs',
    fixture: 'evals/hooks/fixtures/stop-reviewed-bypass.json',
    exitCode: 0,
    expect: {
      decision: 'block',
      reason:
        'Mobile final response is missing test/build/evidence output. Continue once, then include commands run and key results, or explicitly state what was not run and why.',
    },
  },
  {
    name: 'stop blocks finished wording without evidence',
    script: '.codex/hooks/mobile-stop-gatekeeper-advisory.mjs',
    input: {
      last_assistant_message: 'I finished the mobile implementation.',
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason:
        'Mobile final response is missing test/build/evidence output. Continue once, then include commands run and key results, or explicitly state what was not run and why.',
    },
  },
  {
    name: 'stop blocks shipped wording without evidence',
    script: '.codex/hooks/mobile-stop-gatekeeper-advisory.mjs',
    input: {
      last_assistant_message: 'I shipped the mobile change.',
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason:
        'Mobile final response is missing test/build/evidence output. Continue once, then include commands run and key results, or explicitly state what was not run and why.',
    },
  },
  {
    name: 'stop blocks ready wording without evidence',
    script: '.codex/hooks/mobile-stop-gatekeeper-advisory.mjs',
    input: {
      last_assistant_message: 'Implementation is ready.',
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason:
        'Mobile final response is missing test/build/evidence output. Continue once, then include commands run and key results, or explicitly state what was not run and why.',
    },
  },
  {
    name: 'stop allows final response with evidence',
    script: '.codex/hooks/mobile-stop-gatekeeper-advisory.mjs',
    fixture: 'evals/hooks/fixtures/stop-with-evidence.json',
    exitCode: 0,
    expect: {
      continue: true,
    },
  },
  {
    name: 'stop call check no-ops unless enabled',
    script: '.codex/hooks/mobile-stop-call-check.mjs',
    input: {
      hook_event_name: 'Stop',
      last_assistant_message: 'Done with evidence: pnpm run test:hooks passed.',
    },
    exitCode: 0,
    expect: {
      continue: true,
    },
  },
  {
    name: 'stop call check reports missing configured calls',
    script: '.codex/hooks/mobile-stop-call-check.mjs',
    env: {
      WM_STOP_CALL_CHECK_ENABLE: '1',
    },
    input: {
      hook_event_name: 'Stop',
    },
    exitCode: 0,
    expect: {
      continue: true,
      systemMessage: 'Stop call check skipped: no WM_STOP_CALL_CHECK_HTTP_URL or WM_STOP_CALL_CHECK_MCP_TOOL configured.',
    },
  },
  {
    name: 'stop call check reports mcp spawn failure as json',
    script: '.codex/hooks/mobile-stop-call-check.mjs',
    env: {
      WM_STOP_CALL_CHECK_ENABLE: '1',
      WM_STOP_CALL_CHECK_MCP_TOOL: 'mobile_list_available_devices',
      WM_STOP_CALL_CHECK_MCP_COMMAND: 'definitely-not-a-real-mcp-command',
    },
    input: {
      hook_event_name: 'Stop',
    },
    exitCode: 0,
    expect: {
      decision: 'block',
      reason: 'Stop call check failed: spawn definitely-not-a-real-mcp-command ENOENT',
    },
  },
  {
    name: 'session start emits mobile runtime context',
    script: '.codex/hooks/mobile-subagent-context.mjs',
    fixture: 'evals/hooks/fixtures/session-start.json',
    exitCode: 0,
    expect: {
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: 'Mobile custom agents are narrow by default: reviewers/researchers stay read-only, cite sources, and do not recursively delegate.',
      },
    },
  },
];

const completionDmCaptureFile = `/tmp/wm-stop-completion-dm-${process.pid}.json`;
fs.rmSync(completionDmCaptureFile, { force: true });

const httpServer = spawn('node', ['evals/hooks/fixtures/http-livez-server.mjs'], {
  stdio: ['ignore', 'pipe', 'inherit'],
  env: { ...process.env, HTTP_CAPTURE_FILE: completionDmCaptureFile },
});
process.once('exit', () => httpServer.kill('SIGTERM'));

const port = await new Promise((resolve, reject) => {
  let buffer = '';
  httpServer.stdout.on('data', (chunk) => {
    buffer += chunk.toString('utf8');
    const line = buffer.split('\n')[0]?.trim();
    if (line) resolve(line);
  });
  httpServer.on('error', reject);
  httpServer.on('exit', (code) => reject(new Error(`http fixture server exited early with code ${code}`)));
});

cases.push({
  name: 'stop completion dm dry-run includes task and run identifiers',
  script: '.codex/hooks/mobile-stop-call-check.mjs',
  env: {
    WM_STOP_COMPLETION_DM_ENABLE: '1',
    WM_STOP_COMPLETION_DM_DRY_RUN: '1',
    WM_STOP_COMPLETION_DM_ROLE: 'sohee',
    WM_STOP_COMPLETION_DM_TASK_ID: 'TASK-1',
    WM_STOP_COMPLETION_DM_RUN_ID: 'fixture-run',
  },
  input: {
    hook_event_name: 'Stop',
    last_assistant_message: 'Done with evidence: pnpm run test:hooks passed.',
  },
  exitCode: 0,
  expect: {
    continue: true,
    systemMessage: 'Stop call check passed: completion DM dry-run prepared for sohee task=TASK-1 run=fixture-run.',
  },
});

cases.push({
  name: 'stop completion dm reads local ignored env file',
  script: '.codex/hooks/mobile-stop-call-check.mjs',
  setupCompletionDmEnvFile: [
    'export WM_STOP_COMPLETION_DM_ENABLE=1',
    'export WM_STOP_COMPLETION_DM_DRY_RUN=1',
    'export WM_STOP_COMPLETION_DM_ROLE=sohee',
    'export WM_STOP_COMPLETION_DM_TASK_ID=TASK-1',
    'export WM_STOP_COMPLETION_DM_RUN_ID=env-file-run',
    '',
  ].join('\n'),
  input: {
    hook_event_name: 'Stop',
    last_assistant_message: 'Done with evidence: local env dry run.',
  },
  exitCode: 0,
  expect: {
    continue: true,
    systemMessage: 'Stop call check passed: completion DM dry-run prepared for sohee task=TASK-1 run=env-file-run.',
  },
});

cases.push({
  name: 'stop completion dm posts local payload with runbook',
  script: '.codex/hooks/mobile-stop-call-check.mjs',
  env: {
    WM_STOP_COMPLETION_DM_ENABLE: '1',
    WM_STOP_COMPLETION_DM_ROLE: 'sohee',
    WM_STOP_COMPLETION_DM_TASK_ID: 'TASK-1',
    WM_STOP_COMPLETION_DM_RUN_ID: 'fixture-run',
    WM_STOP_COMPLETION_DM_ENDPOINT: `http://127.0.0.1:${port}/messages`,
    WM_STOP_COMPLETION_DM_ROOM_ID: '637',
    WM_STOP_COMPLETION_DM_GATEWAY_TOKEN: 'fixture-token',
    WM_STOP_COMPLETION_DM_FROM_AGENT_ID: 'sohee-fixture',
    WM_STOP_COMPLETION_DM_RUNBOOK_JSON: JSON.stringify(['Update TASK-1.', 'Hand off TASK-2.']),
  },
  input: {
    hook_event_name: 'Stop',
    last_assistant_message: 'Implemented the hook. Verification: pnpm run test:hooks passed.',
  },
  exitCode: 0,
  expect: {
    continue: true,
    systemMessage: 'Stop call check passed: completion DM delivered to configured sohee direct room.',
  },
  expectCapturedPayload: {
    from_agent_id: 'sohee-fixture',
    room_id: 637,
    contentIncludes: [
      '[Codex Stop Hook] Sohee pod 작업 완료 알림',
      'Task/run identifier: task=TASK-1; run=fixture-run',
      'Implemented the hook. Verification: pnpm run test:hooks passed.',
      'Next-step runbook:',
      '1. Update TASK-1.',
      '2. Hand off TASK-2.',
    ],
  },
});

cases.push({
  name: 'stop call check performs curl and mcp tool call',
  script: '.codex/hooks/mobile-stop-call-check.mjs',
  env: {
    WM_STOP_CALL_CHECK_ENABLE: '1',
    WM_STOP_CALL_CHECK_HTTP_URL: `http://127.0.0.1:${port}/livez`,
    WM_STOP_CALL_CHECK_MCP_TOOL: 'mobile_list_available_devices',
    WM_STOP_CALL_CHECK_MCP_COMMAND: 'node',
    WM_STOP_CALL_CHECK_MCP_ARGS_JSON: JSON.stringify(['evals/hooks/fixtures/mcp-list-devices-server.mjs']),
  },
  input: {
    hook_event_name: 'Stop',
  },
  exitCode: 0,
  expect: {
    continue: true,
    systemMessage:
      'Stop call check passed: curl http://127.0.0.1:<port>/livez returned 200; MCP tool mobile_list_available_devices returned result.',
  },
});

const failures = [];

function exactJsonEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

const defaultCompletionDmEnvFile = `/tmp/wm-stop-completion-dm-env-missing-${process.pid}.env`;
fs.rmSync(defaultCompletionDmEnvFile, { force: true });

function hookTestEnv(testCase, completionDmEnvFile) {
  const baseEnv = Object.fromEntries(
    ['PATH', 'HOME', 'USER', 'TMPDIR', 'TEMP', 'TMP', 'SystemRoot', 'ComSpec']
      .map((name) => [name, process.env[name]])
      .filter(([, value]) => typeof value === 'string'),
  );

  return {
    ...baseEnv,
    WM_STOP_COMPLETION_DM_CONFIG_PATH: completionDmEnvFile ?? defaultCompletionDmEnvFile,
    ...(testCase.env ?? {}),
  };
}

for (const testCase of cases) {
  const testCompletionDmEnvFile = `/tmp/wm-stop-completion-dm-env-${process.pid}.env`;
  if (testCase.setupCompletionDmEnvFile) fs.writeFileSync(testCompletionDmEnvFile, testCase.setupCompletionDmEnvFile);
  const input = testCase.input ? JSON.stringify(testCase.input) : fs.readFileSync(testCase.fixture, 'utf8');
  const result = spawnSync('node', [testCase.script], {
    input,
    encoding: 'utf8',
    env: hookTestEnv(testCase, testCase.setupCompletionDmEnvFile ? testCompletionDmEnvFile : undefined),
  });
  if (testCase.setupCompletionDmEnvFile) fs.rmSync(testCompletionDmEnvFile, { force: true });
  if (result.status !== testCase.exitCode) {
    failures.push(`${testCase.name}: expected exit ${testCase.exitCode}, got ${result.status}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    failures.push(`${testCase.name}: stdout was not valid JSON; got ${result.stdout}`);
    continue;
  }
  const expected = JSON.parse(
    JSON.stringify(testCase.expect).replaceAll('http://127.0.0.1:<port>', `http://127.0.0.1:${port}`),
  );
  if (!exactJsonEqual(parsed, expected)) {
    failures.push(`${testCase.name}: stdout did not exactly match ${JSON.stringify(testCase.expect)}; got ${result.stdout}`);
  }
  if (testCase.expectCapturedPayload) {
    if (!fs.existsSync(completionDmCaptureFile)) {
      failures.push(`${testCase.name}: expected captured completion DM payload file`);
      continue;
    }
    const captured = JSON.parse(fs.readFileSync(completionDmCaptureFile, 'utf8'));
    for (const [key, value] of Object.entries(testCase.expectCapturedPayload)) {
      if (key === 'contentIncludes') continue;
      if (captured[key] !== value) failures.push(`${testCase.name}: captured payload ${key} expected ${value}; got ${captured[key]}`);
    }
    for (const expectedText of testCase.expectCapturedPayload.contentIncludes ?? []) {
      if (!String(captured.content ?? '').includes(expectedText)) {
        failures.push(`${testCase.name}: captured payload content missing ${expectedText}`);
      }
    }
    fs.rmSync(completionDmCaptureFile, { force: true });
  }
}

httpServer.kill('SIGTERM');
fs.rmSync(completionDmCaptureFile, { force: true });

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Passed ${cases.length} hook fixture tests.`);
