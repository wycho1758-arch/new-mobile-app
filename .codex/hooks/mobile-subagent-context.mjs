#!/usr/bin/env node
import { readStdinJson, writeJson } from './shared.mjs';

await readStdinJson();

writeJson({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: 'Mobile custom agents are narrow by default: reviewers/researchers stay read-only, cite sources, and do not recursively delegate.',
  },
});
