// preflight.mjs output shape and CLAUDE_CONFIG_DIR handling.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SCRIPT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'preflight.mjs');

function preflight(env, cwd) {
  const r = spawnSync('node', [SCRIPT, '--json'], { cwd, encoding: 'utf8', env: { ...process.env, ...env } });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}

test('--json reports present/missing with install commands', () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-'));
  const out = preflight({ CLAUDE_CONFIG_DIR: path.join(cwd, 'empty') }, cwd);
  assert.ok(Array.isArray(out.present) && Array.isArray(out.missing));
  for (const c of out.missing) assert.ok(c.id && c.tier && typeof c.install === 'string', c.id);
});

test('detects skills under CLAUDE_CONFIG_DIR', () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-'));
  const cfg = path.join(cwd, 'cfg');
  fs.mkdirSync(path.join(cfg, 'skills', 'impeccable'), { recursive: true });
  fs.writeFileSync(path.join(cfg, 'skills', 'impeccable', 'SKILL.md'), '---\nname: impeccable\n---\n');
  const out = preflight({ CLAUDE_CONFIG_DIR: cfg, HOME: path.join(cwd, 'home') }, cwd);
  assert.ok(out.present.some((c) => c.id === 'impeccable'));
  assert.ok(out.missing.some((c) => c.id === 'emil-design-eng'));
});
