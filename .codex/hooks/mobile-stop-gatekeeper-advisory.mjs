#!/usr/bin/env node
import { readStdinJson, writeJson } from './shared.mjs';

const input = await readStdinJson();
const text = JSON.stringify(input);
const hasEvidence = /(\.evidence|evals\/.+\/results|mobile-gatekeeper|npm test|pnpm test)/.test(text);

writeJson({
  decision: 'approve',
  advisory: hasEvidence
    ? 'Final mobile evidence appears to be referenced. Report commands and residual risks.'
    : 'Before stopping, report missing mobile evidence or run the relevant test/gate command.',
});
