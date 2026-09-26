// Behaviour of hooks/design-review-gate.js across modes, verdict states and dedupe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HOOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'hooks', 'design-review-gate.js');

function project() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'drg-'));
  fs.mkdirSync(path.join(dir, '.git'));
  fs.mkdirSync(path.join(dir, 'src'));
  const file = path.join(dir, 'src', 'Button.tsx');
  fs.writeFileSync(file, 'export {}');
  return { dir, file };
}

function run(payload, env = {}) {
  const r = spawnSync('node', [HOOK], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: { ...process.env, DESIGN_REVIEW_GATE: '', ...env },
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

const sid = () => `test-${process.pid}-${Math.random().toString(36).slice(2)}`;
const edit = (file, session_id = sid(), tool = 'Edit') => ({ tool_name: tool, tool_input: { file_path: file }, session_id });

test('non-UI file is silent', () => {
  const { dir } = project();
  const f = path.join(dir, 'server.php');
  fs.writeFileSync(f, '<?php');
  assert.deepEqual(run(edit(f)), { code: 0, out: '', err: '' });
});

test('non-write tool is silent', () => {
  const { file } = project();
  assert.equal(run(edit(file, sid(), 'Read')).out, '');
});

test('warn: UI file without verdict injects short additionalContext', () => {
  const { file } = project();
  const r = run(edit(file));
  assert.equal(r.code, 0);
  const ctx = JSON.parse(r.out).hookSpecificOutput.additionalContext;
  assert.match(ctx, /design-review-gate/);
  assert.ok(ctx.length < 400, `message ${ctx.length} chars`);
});

test('warn: fires once per file per session', () => {
  const { file } = project();
  const s = sid();
  assert.notEqual(run(edit(file, s)).out, '');
  assert.equal(run(edit(file, s)).out, '');
});

test('block: exit 2 with stderr feedback', () => {
  const { file } = project();
  const r = run(edit(file), { DESIGN_REVIEW_GATE: 'block' });
  assert.equal(r.code, 2);
  assert.match(r.err, /design-review-gate/);
});

test('off: silent', () => {
  const { file } = project();
  assert.deepEqual(run(edit(file), { DESIGN_REVIEW_GATE: 'off' }), { code: 0, out: '', err: '' });
});

test('alive verdict newer than the edit passes', () => {
  const { dir, file } = project();
  fs.mkdirSync(path.join(dir, '.design-review'));
  fs.writeFileSync(path.join(dir, '.design-review', 'verdict.json'), '{"verdict":"alive"}');
  assert.equal(run(edit(file), { DESIGN_REVIEW_GATE: 'block' }).code, 0);
});

test('run in progress (references.md newer than verdict) is silent, even in block mode', () => {
  const { dir, file } = project();
  const dr = path.join(dir, '.design-review');
  fs.mkdirSync(dr);
  const verdict = path.join(dr, 'verdict.json');
  fs.writeFileSync(verdict, '{"verdict":"templated"}');
  const past = new Date(Date.now() - 60_000);
  fs.utimesSync(verdict, past, past);
  fs.writeFileSync(path.join(dr, 'references.md'), '# refs');
  assert.deepEqual(run(edit(file), { DESIGN_REVIEW_GATE: 'block' }), { code: 0, out: '', err: '' });
});

test('templated verdict with no run in progress blocks', () => {
  const { dir, file } = project();
  const dr = path.join(dir, '.design-review');
  fs.mkdirSync(dr);
  fs.writeFileSync(path.join(dr, 'references.md'), '# refs');
  const past = new Date(Date.now() - 60_000);
  fs.utimesSync(path.join(dr, 'references.md'), past, past);
  fs.writeFileSync(path.join(dr, 'verdict.json'), '{"verdict":"templated"}');
  const r = run(edit(file), { DESIGN_REVIEW_GATE: 'block' });
  assert.equal(r.code, 2);
  assert.match(r.err, /templated/);
});

test('malformed stdin never breaks the session', () => {
  const r = spawnSync('node', [HOOK], { input: '{not json', encoding: 'utf8' });
  assert.equal(r.status, 0);
});
