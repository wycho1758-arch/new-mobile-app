#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outRoot = path.join(root, '.generated/openclaw-skill-packages');
const skillRoot = path.join(root, '.agents/skills');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name.includes('..') || path.isAbsolute(entry.name)) {
      throw new Error(`unsafe package entry: ${entry.name}`);
    }
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });

const slugs = fs.readdirSync(skillRoot).filter((name) => fs.statSync(path.join(skillRoot, name)).isDirectory());

for (const slug of slugs) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`invalid slug: ${slug}`);
  copyDir(path.join(skillRoot, slug), path.join(outRoot, slug));
  const skillFile = path.join(outRoot, slug, 'SKILL.md');
  if (!fs.existsSync(skillFile)) throw new Error(`missing packaged SKILL.md for ${slug}`);
}

console.log(`Packaged ${slugs.length} OpenClaw generated-agent skill directories into ${path.relative(root, outRoot)}.`);
