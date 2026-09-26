// Structural checks for the plugin: manifests, frontmatter, README anchors, no personal paths.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_DESC = { skill: 400, agent: 300, command: 400 };

function frontmatter(rel) {
  const m = read(rel).match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(m, `${rel}: missing frontmatter`);
  const fields = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z-]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
  }
  return fields;
}

test('JSON manifests parse', () => {
  for (const rel of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', 'hooks/hooks.json']) {
    assert.doesNotThrow(() => JSON.parse(read(rel)), rel);
  }
});

test('marketplace has no stale top-level version', () => {
  assert.equal(JSON.parse(read('.claude-plugin/marketplace.json')).version, undefined);
});

test('plugin.json name and semver version', () => {
  const p = JSON.parse(read('.claude-plugin/plugin.json'));
  assert.match(p.name, NAME_RE);
  assert.match(p.version, /^\d+\.\d+\.\d+$/);
});

test('SKILL.md frontmatter', () => {
  const fm = frontmatter('SKILL.md');
  assert.match(fm.name, NAME_RE);
  assert.ok(fm.description.length <= MAX_DESC.skill, `description ${fm.description.length} chars`);
  assert.match(fm.description, /Use when/);
});

test('agents frontmatter', () => {
  const files = fs.readdirSync(path.join(ROOT, 'agents')).filter((f) => f.endsWith('.md'));
  assert.equal(files.length, 8);
  for (const f of files) {
    const fm = frontmatter(`agents/${f}`);
    assert.equal(fm.name, f.replace(/\.md$/, ''), f);
    assert.match(fm.name, NAME_RE, f);
    assert.ok(fm.description && fm.description.length <= MAX_DESC.agent, `${f}: description ${fm.description?.length}`);
    assert.ok(['sonnet', 'opus', 'haiku', 'inherit'].includes(fm.model), `${f}: model ${fm.model}`);
  }
});

test('command frontmatter', () => {
  const fm = frontmatter('commands/run.md');
  assert.ok(fm.description && fm.description.length <= MAX_DESC.command);
});

// GitHub heading slug: lowercase, strip punctuation/emoji (keep letters, digits, spaces, hyphens), spaces → '-'.
const slug = (h) => h.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/ /g, '-');

test('README in-page anchors resolve', () => {
  for (const rel of ['README.md', 'README.es.md']) {
    const text = read(rel);
    const slugs = new Set([...text.matchAll(/^#{1,6} (.+)$/gm)].map((m) => slug(m[1])));
    for (const [, anchor] of text.matchAll(/\]\(#([^)]+)\)/g)) {
      assert.ok(slugs.has(decodeURIComponent(anchor)), `${rel}: broken anchor #${anchor}`);
    }
  }
});

test('relative links in READMEs resolve', () => {
  for (const rel of ['README.md', 'README.es.md']) {
    for (const [, target] of read(rel).matchAll(/\]\(((?!https?:|#|mailto:)[^)#\s]+)(?:#[^)]*)?\)/g)) {
      assert.ok(fs.existsSync(path.join(ROOT, target)), `${rel}: missing ${target}`);
    }
  }
});

test('no personal absolute paths in tracked files', () => {
  const files = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
  for (const f of files) {
    if (f.startsWith('tests/')) continue;
    const text = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert.ok(!/\/Users\/[a-z]|\/home\/[a-z]+\//.test(text), `${f}: personal absolute path`);
  }
});
