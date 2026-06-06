#!/usr/bin/env node
import { readStdinJson, writeJson } from './shared.mjs';

await readStdinJson();

writeJson({
  decision: 'approve',
  advisory: 'Mobile custom agents are narrow by default: reviewers/researchers stay read-only, cite sources, and do not recursively delegate.',
});
