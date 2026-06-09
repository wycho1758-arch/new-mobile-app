#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
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

const failures = [];

function exactJsonEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

for (const testCase of cases) {
  const input = testCase.input ? JSON.stringify(testCase.input) : fs.readFileSync(testCase.fixture, 'utf8');
  const result = spawnSync('node', [testCase.script], {
    input,
    encoding: 'utf8',
  });
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
  if (!exactJsonEqual(parsed, testCase.expect)) {
    failures.push(`${testCase.name}: stdout did not exactly match ${JSON.stringify(testCase.expect)}; got ${result.stdout}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Passed ${cases.length} hook fixture tests.`);
