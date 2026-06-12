import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('runtime export points at built JavaScript, not TypeScript source', () => {
  const rootExport = packageJson.exports?.['.'];

  assert.equal(typeof rootExport, 'object');
  assert.equal(rootExport.import, './dist/index.js');
  assert.equal(rootExport.types, './src/index.ts');
});

