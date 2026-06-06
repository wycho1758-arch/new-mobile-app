#!/usr/bin/env node
import { readStdinJson, writeJson } from './shared.mjs';

const input = await readStdinJson();
const text = JSON.stringify(input).toLowerCase();

const denyPatterns = [
  /git\s+reset\s+--hard/,
  /git\s+clean\s+-[^\s]*f/,
  /rm\s+-rf\s+(\/|\$home|~|\.)/,
  /(printenv|env|cat)\s+.*(token|secret|password|credential)/,
  /openclaw-cloud/,
];

const matched = denyPatterns.find((pattern) => pattern.test(text));

if (matched) {
  writeJson({
    decision: 'deny',
    reason: `Blocked by mobile-pretool-policy: ${matched.source}`,
  });
  process.exit(2);
}

writeJson({ decision: 'approve' });
