#!/usr/bin/env node
import { readStdinJson, writeJson } from './shared.mjs';

const input = await readStdinJson();
const text = JSON.stringify(input).toLowerCase();
const toolInput = input.tool_input ?? input.toolInput ?? {};
const commandText = String(toolInput.command ?? toolInput.cmd ?? input.command ?? '').toLowerCase();
const normalizedCommand = commandText.replace(/\\(["'])/g, '$1');
const shellWrapper = normalizedCommand.match(/(?:^|\s)(?:bash|zsh|sh)\s+-[a-z]*c\s+(['"])(.*)\1$/);
const evalWrapper = normalizedCommand.match(/(?:^|\s)eval\s+(['"])(.*)\1$/);
const executableCommand = shellWrapper ? shellWrapper[2] : evalWrapper ? evalWrapper[2] : normalizedCommand;
const readOnlySearchCommand = /^\s*(rg|grep)\b/.test(executableCommand);
const commandForPolicy = readOnlySearchCommand
  ? executableCommand
    .replace(/(['"])(?!(?:[^'"]*\/)?\.env(?:\.|\s|$))[\s\S]*?\1/g, '""')
    .replace(/['"]/g, '')
  : executableCommand.replace(/['"]/g, '');

const denyPatterns = [
  /git\s+reset\s+--hard/,
  /git\s+clean\s+-[^\s]*f/,
  /rm\s+(?:-[^\s]+\s+)*(?:--\s+)?(\/|\$home|~|\.|apps\/mobile|\.codex|\.agents|packages\/contracts|evals|scripts)/,
  /(printenv|env|cat)\s+.*(token|secret|password|credential)/,
  /expo\s+prebuild\b.*--clean/,
  /\beas\s+(build|submit|update)\b.*\b(prod|production)\b/,
  /\b(npx|pnpm\s+dlx)\s+eas-cli\b.*\b(build|submit|update)\b.*\b(prod|production)\b/,
  /\b(npm|yarn)\s+(install|add|remove|update)\b/,
  /\b(cat|less|more|head|tail|sed|rg|grep)\b.*(^|\s|\/)\.env(\.|$|\s)/,
];

const matched = denyPatterns.find((pattern) => pattern.test(commandForPolicy));

if (matched) {
  writeJson({
    decision: 'block',
    reason: `Blocked by mobile-pretool-policy: ${matched.source}`,
  });
  process.exit(0);
}

if (/expo_public_/i.test(text)) {
  writeJson({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      additionalContext: 'EXPO_PUBLIC_* values are compiled into the client app. Do not treat them as private values.',
    },
  });
} else {
  writeJson({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
    },
  });
}
