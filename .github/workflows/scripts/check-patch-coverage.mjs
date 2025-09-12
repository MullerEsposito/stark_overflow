#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = new Map(process.argv.slice(2).map((a, i, arr) => {
  if (a.startsWith('--')) return [a.replace(/^--/, ''), arr[i + 1]];
  return null;
}).filter(Boolean));

const coverageFile = args.get('coverage-file') || 'frontend/react/coverage/coverage-final.json';
const threshold = Number(args.get('threshold') || 80);
const workspace = args.get('workspace') || process.cwd();
const changed = (args.get('changed') || '')
  .split(/\r?\n/)
  .map(s => s.trim())
  .filter(Boolean);

const codeExt = new Set(['.ts','.tsx','.js','.jsx']);
const changedCode = changed.filter(p =>
  p.startsWith('frontend/react/src/') && codeExt.has(path.extname(p))
);

if (changedCode.length === 0) {
  console.log('No changed source files under frontend/react/src — skipping patch coverage check.');
  process.exit(0);
}

const json = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'));

const toRel = p => {
  if (!p) return p;
  const norm = p.replaceAll('\\','/');
  const ws = workspace.replaceAll('\\','/');
  return norm.startsWith(ws) ? norm.slice(ws.length+1) : norm;
};

let covered = 0, total = 0;
const missing = [];

for (const fileAbs in json) {
  const fileRel = toRel(fileAbs);
  json[fileRel] = json[fileAbs];
}

for (const f of changedCode) {
  const entry = json[f] || json[path.resolve(workspace, f)] || null;
  if (!entry || !entry.lines) {
        missing.push(f);
    continue;
  }
  covered += entry.lines.covered ?? 0;
  total += entry.lines.total ?? 0;
}

if (total === 0) {
  console.log('Changed files had no measurable lines for coverage (total=0). Counting as 0%.');
  total = 1;
}

const pct = (covered / total) * 100;
const pctFmt = pct.toFixed(2);

if (missing.length) {
  console.log('Changed files with no recorded coverage (count as 0%):');
  for (const m of missing) console.log(' - ' + m);
}
console.log(`Patch coverage (lines) = ${covered}/${total} = ${pctFmt}%  (threshold=${threshold}%)`);

if (pct + 1e-9 < threshold) {
  console.error(`❌ Patch coverage below minimum: ${pctFmt}% < ${threshold}%`);
  process.exit(1);
} else {
  console.log(`✅ Patch coverage OK: ${pctFmt}% ≥ ${threshold}%`);
}
