#!/usr/bin/env node
import { changedPathHints, readStdinJson, writeJson } from './shared.mjs';

const input = await readStdinJson();
const hints = changedPathHints(input);
const needsEvidence = hints.some((path) =>
  /(^|\/)(apps\/mobile|src\/app|src\/components|packages\/contracts|tests?|__tests__|maestro|\.maestro|\.evidence|evals|\.agents|\.codex|scripts)\b/.test(path),
);

if (!needsEvidence) {
  writeJson({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
    },
  });
} else {
  writeJson({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: 'Mobile task files changed. Capture test/build/evidence output before final response.',
    },
  });
}
