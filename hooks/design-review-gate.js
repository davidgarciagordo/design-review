#!/usr/bin/env node
/**
 * design-review-gate — PostToolUse hook.
 *
 * Telos enforcement, machine-checkable: when a write/edit touches a front-end (UI) file,
 * remind (or block) if the design-vitality pipeline hasn't produced an "alive" verdict for it.
 * Correctness is the floor; this gate is about VITALITY — a flat/templated diff should not pass
 * as "done".
 *
 * Mode via env DESIGN_REVIEW_GATE:
 *   - "off"   → silent (disabled)
 *   - "warn"  → advisory: surfaces a reminder to the agent (non-blocking)   [default]
 *   - "block" → blocks (exit 2): the agent must run /design-review to verdict "alive"
 *
 * Reads .design-review/verdict.json (written by the design-vitality-verdict agent). A verdict of
 * "alive" newer than the edited file → pass. Anything else → warn/block.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const MODE = (process.env.DESIGN_REVIEW_GATE || 'warn').toLowerCase();
if (MODE === 'off') process.exit(0);

// UI file detection — conservative, to avoid false positives on backend code.
const ALWAYS_UI_EXT = new Set(['.tsx', '.jsx', '.vue', '.svelte', '.astro', '.mjml', '.css', '.scss', '.less']);
const MAYBE_UI_EXT = new Set(['.ts', '.js', '.mjs', '.html']);
const UI_PATH_HINT = /(^|\/)(components?|ui|design-system|styles?|app|pages|views|screens|emails?|apps\/(web|hq|marketing|mobile))(\/|$)/i;

function isUiFile(file) {
  if (!file) return false;
  const ext = path.extname(file).toLowerCase();
  if (ALWAYS_UI_EXT.has(ext)) return true;
  if (MAYBE_UI_EXT.has(ext)) return UI_PATH_HINT.test(file.replace(/\\/g, '/'));
  return false;
}

function findRoot(start) {
  let dir = start;
  for (let i = 0; i < 25 && dir; i++) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return start;
}

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function main() {
  let payload = {};
  try {
    payload = JSON.parse(readStdin() || '{}');
  } catch {
    process.exit(0); // never break the session on a parse error
  }

  const tool = payload.tool_name || '';
  if (!['Write', 'Edit', 'MultiEdit'].includes(tool)) process.exit(0);

  const input = payload.tool_input || {};
  const file = input.file_path || input.path || '';
  if (!isUiFile(file)) process.exit(0);

  const cwd = payload.cwd || process.cwd();
  const root = findRoot(path.isAbsolute(file) ? path.dirname(file) : cwd);
  const verdictPath = path.join(root, '.design-review', 'verdict.json');

  let verdict = null;
  let verdictMtime = 0;
  try {
    verdict = JSON.parse(fs.readFileSync(verdictPath, 'utf8'));
    verdictMtime = fs.statSync(verdictPath).mtimeMs;
  } catch {
    /* no verdict yet */
  }

  // Pass: an "alive" verdict exists and is at least as new as this edit.
  let fileMtime = 0;
  try {
    fileMtime = fs.statSync(path.isAbsolute(file) ? file : path.join(cwd, file)).mtimeMs;
  } catch {
    /* ignore */
  }
  if (verdict && verdict.verdict === 'alive' && verdictMtime >= fileMtime - 1000) {
    process.exit(0);
  }

  const state = !verdict
    ? 'design-review has NOT been run on this surface (no .design-review/verdict.json).'
    : `the latest design-review verdict is "${verdict.verdict}", not "alive"` +
      (verdict.reason ? ` — ${verdict.reason}.` : '.');

  const msg =
    `[design-review-gate] UI file changed: ${file}\n` +
    `${state}\n` +
    `Telos: a front-end change isn't done when it's merely correct — it must be ALIVE and 2026, ` +
    `not flat/templated. Run "/design-review ${file}" and iterate until the verdict is "alive" ` +
    `(reference-research + the 4 core skills + vitality loop). Override per-edit with ` +
    `DESIGN_REVIEW_GATE=off if this isn't a design-bearing change.`;

  if (MODE === 'block') {
    process.stderr.write(msg + '\n');
    process.exit(2); // PostToolUse: exit 2 feeds stderr back to the agent as a blocking signal.
  }

  // warn (default): non-blocking, but surface to the agent via additionalContext.
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: msg,
      },
    }) + '\n',
  );
  process.exit(0);
}

main();
