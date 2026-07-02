#!/usr/bin/env node
/**
 * preflight.mjs — single source of truth for WHAT design-review orchestrates and
 * HOW to install each piece. Detects presence; NEVER installs by itself.
 *
 * The orchestrator (step 0) runs this, then for each MISSING component ASKS the
 * user (one batch) whether to install or skip — and records skipped ones
 * EXPLICITLY (no silent skips). This script only reports; the human decides.
 *
 * Usage:
 *   node scripts/preflight.mjs            # human table to stdout
 *   node scripts/preflight.mjs --json     # machine-readable {present,missing}
 *   node scripts/preflight.mjs --write    # also write .design-review/preflight.md
 *
 * Detection is best-effort and read-only: filesystem globs + `which` for binaries.
 * A component absent here is NOT an error — it degrades the matching lens, which
 * the orchestrator must announce.
 */
'use strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

const HOME = os.homedir();
const CWD = process.cwd();

/**
 * THE MANIFEST — every component the pipeline uses, its role, the phase it runs
 * in, how to detect it, and the exact install command. `tier`:
 *   core   = a gate lens (pipeline degrades hard without it)
 *   wired  = integrated intelligence/source (degrades a phase)
 *   addon  = optional enhancement (safe to skip)
 */
export const MANIFEST = [
  {
    id: 'impeccable',
    tier: 'core',
    role: 'structure / hierarchy / IA / tokens / scored audit',
    phase: '3a diagnosis (lead lens) + 1 audit-first + 5 fix',
    kind: 'skill',
    detect: ['~/.claude/skills/impeccable/SKILL.md', '.claude/skills/impeccable/SKILL.md'],
    install: 'git clone https://github.com/pbakaus/impeccable /tmp/impeccable && cp -r /tmp/impeccable/.claude/skills/impeccable ~/.claude/skills/impeccable (documented interactive form: npx impeccable install)',
    notes: 'Needs PRODUCT.md (only PRODUCT.md blocks with NO_PRODUCT_MD; DESIGN.md optional). Mandatory 5-step setup incl. the brand/product register — see references/skills/impeccable.md. Monorepo: context.mjs needs --target.',
  },
  {
    id: 'taste-skill',
    aka: 'design-taste-frontend',
    tier: 'core',
    role: 'anti-templated / composition (landing/portfolio); §14 pre-flight',
    phase: '3b diagnosis + 1 audit-first (§11) + 6 verdict (§14)',
    kind: 'skill',
    detect: [
      '~/.claude/skills/taste-skill/SKILL.md', '.claude/skills/taste-skill/SKILL.md', '.agents/skills/taste-skill/SKILL.md',
      '~/.claude/skills/design-taste-frontend/SKILL.md', '.claude/skills/design-taste-frontend/SKILL.md',
    ],
    install: 'npx -y skills@latest add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend',
    notes: 'Registered name depends on install dir (taste-skill OR design-taste-frontend) — agents must try both. It is a GENERATOR: always route to §11/§14, forbid generation.',
  },
  {
    id: 'emil-design-eng',
    tier: 'core',
    role: 'signature motion / polish',
    phase: '3c diagnosis',
    kind: 'skill',
    detect: ['~/.claude/skills/emil-design-eng/SKILL.md', '.claude/skills/emil-design-eng/SKILL.md', '.agents/skills/emil-design-eng/SKILL.md'],
    install: 'npx -y skills@latest add emilkowalski/skills --skill emil-design-eng',
  },
  {
    id: 'web-design-guidelines',
    tier: 'core',
    role: 'a11y semantics / keyboard / focus-visible / reduced-motion (file:line) — NO WCAG-AA/contrast ratios (those need AGENTS.md injection + a measuring tool)',
    phase: '3d diagnosis (last lens — net over motion added by emil)',
    kind: 'skill',
    detect: ['~/.claude/skills/web-design-guidelines/SKILL.md', '.claude/skills/web-design-guidelines/SKILL.md'],
    install: 'npx -y skills@latest add vercel-labs/agent-skills --skill web-design-guidelines',
    notes: 'Third-party (Vercel) — NOT bundled with Claude Code. Its command.md has no WCAG/contrast-ratio checks; the a11y lens also fetches the repo AGENTS.md (APCA contrast, hit targets). Needs network; cache as fallback.',
  },
  {
    id: 'ui-ux-pro-max',
    tier: 'wired',
    role: 'design-intelligence DB: 84 styles / 161 palettes / 73 font-pairings / 99 UX rules / charts (BM25 search.py, deterministic — run with Bash, no model)',
    phase: '3a-pre baseline + 2 reference vocabulary + 3e UX lens + 5 generation',
    kind: 'plugin',
    pluginKey: 'ui-ux-pro-max@ui-ux-pro-max-skill',
    detect: [
      '~/.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/*/.claude/skills/ui-ux-pro-max/SKILL.md',
      '~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/SKILL.md',
    ],
    install: 'claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill && claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill',
    notes: 'Needs python3 (search.py, stdlib-only). Marketplace add REQUIRED before install. :design/:ui-styling/:design-system are sibling skills, not modes. Raw palettes/fonts are REFERENCE only — project tokens win.',
  },
  {
    id: 'review-animations',
    tier: 'wired',
    role: 'motion Block/Approve gate (STANDARDS.md)',
    phase: '3c + 6 verdict (motion gate)',
    kind: 'skill',
    detect: ['~/.claude/skills/review-animations/SKILL.md', '.claude/skills/review-animations/SKILL.md', '.agents/skills/review-animations/SKILL.md'],
    install: 'npx -y skills@latest add emilkowalski/skills --skill review-animations',
    notes: 'disable-model-invocation=true → the model can NEVER Skill-invoke it (not even explicitly). Routes: user types /review-animations, or an agent READS its SKILL.md + STANDARDS.md and applies them. Its 6 impact tiers are the native P1/P2/P3 source.',
  },
  {
    id: 'frontend-design',
    tier: 'wired',
    role: 'authoring criterion: 4-6 hex token-plan + signature element + 3 AI-defaults-to-avoid + UX-writing',
    phase: '2b plan + 5 fix (MERGED into taste/plan — not a separate lens)',
    kind: 'skill',
    detect: [
      '~/.claude/plugins/marketplaces/anthropic-agent-skills/skills/frontend-design/SKILL.md',
      '~/.claude/skills/frontend-design/SKILL.md',
    ],
    install: 'claude plugin install frontend-design@claude-plugins-official',
    notes: 'Overlaps taste; fold its token-plan + avoid-list + UX-writing into the plan, do not run as a 5th lens.',
  },
  {
    id: 'refero',
    tier: 'wired',
    role: 'real-product reference: gallery (agent-browser) + DESIGN.md tokens (MCP)',
    phase: '2 reference-research (real products in production, complements Dribbble)',
    kind: 'mcp',
    detect: ['~/.cursor/mcp.json', '.mcp.json', '~/.claude/mcp.json'],
    install: 'Refero MCP (opt-in setup) — default mode = agent-browser over refero.design',
    notes: 'MCP needs config/account; without it, browse refero.design with agent-browser. Tokens are REFERENCE only.',
  },
  {
    id: 'huashu-design',
    tier: 'addon',
    role: 'asset-integrity (WebSearch facts + brand-spec) + Step-10 review (6-dim rubric, Concept veto ≤5 = templated) + verify.py console gate + multi-format builder',
    phase: '2 pre-build (assets) + 3e/6 review (Concept veto feeds the verdict) + 6 verify + primary builder for non-landing surfaces',
    kind: 'skill',
    detect: ['~/.claude/skills/huashu-design/SKILL.md', '.claude/skills/huashu-design/SKILL.md'],
    install: 'npx -y skills@latest add alchaincyf/huashu-design',
    notes: 'All content in Chinese — invoke by name, fix output language. Review = its Step 10 ONLY (read-only pinned, scene declared) or it generates/asks. verify.py: file:// only, NO dark mode (agent-browser owns that); needs pip playwright + chromium.',
  },
  {
    id: 'agent-browser',
    tier: 'wired',
    role: 'live reference + live verdict (light/dark/mobile)',
    phase: '2 reference-research + 6 verdict',
    kind: 'skill',
    detect: ['~/.claude/skills/agent-browser/SKILL.md', '.claude/skills/agent-browser/SKILL.md'],
    install: 'Claude Code built-in / project-configured browser automation',
  },
];

// Not in the manifest (nothing to install/detect): `VoltAgent/awesome-design-md` — a free MIT
// catalog of 73 pre-extracted DESIGN.md brand design languages, used on demand by the
// reference-research agent as an optional source. Steal patterns, never clone the brand.

function expand(p) {
  return p.startsWith('~/') ? path.join(HOME, p.slice(2)) : path.resolve(CWD, p);
}

function globExists(pattern) {
  // Minimal glob: supports a single '*' segment (used for plugin version dirs).
  if (!pattern.includes('*')) return fs.existsSync(expand(pattern));
  const abs = expand(pattern);
  const star = abs.indexOf('*');
  const base = abs.slice(0, star).replace(/\/[^/]*$/, (m) => m); // dir before '*'
  const dir = path.dirname(abs.slice(0, star) + 'x');
  const tailParts = abs.slice(star + 1).split('/').filter(Boolean);
  try {
    for (const entry of fs.readdirSync(dir)) {
      const candidate = path.join(dir, entry, ...tailParts);
      if (fs.existsSync(candidate)) return true;
    }
  } catch {
    /* dir missing */
  }
  return false;
}

function binExists(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function fileContains(pattern, needle) {
  const abs = expand(pattern);
  try {
    return fs.readFileSync(abs, 'utf8').toLowerCase().includes(needle.toLowerCase());
  } catch {
    return false;
  }
}

function isPresent(c) {
  if (c.kind === 'binary') return binExists(c.id);
  // MCP servers: the config file must actually reference the server id, not just exist.
  if (c.kind === 'mcp') return (c.detect || []).some((p) => fileContains(p, c.id));
  return (c.detect || []).some(globExists);
}

/**
 * Session-enablement check — LIMITED SCOPE, see the printed caveat below.
 *
 * "On disk" and "enabled this session" are different things: a plugin can be
 * present in ~/.claude/plugins and still be disabled via `enabledPlugins` in a
 * settings file (confirmed real case: ui-ux-pro-max on disk with
 * `enabledPlugins: {}` → every invocation threw `Unknown skill`, while a
 * presence-only check reported it as "✓ present"). This only resolves that for
 * `kind: 'plugin'` MANIFEST entries that declare a `pluginKey`
 * (`"name@marketplace"`, the key format `enabledPlugins` uses) — see
 * docs.claude.com/en/docs/claude-code/plugins-reference. Skills installed as
 * loose directories under `~/.claude/skills/<name>` (the 4 core skills this
 * pipeline routes to) have no separate per-skill enable flag, so for those
 * "present" is the only signal this script can give — see the printed note.
 */
const SETTINGS_SCOPES = [
  // Highest precedence first: managed cannot be overridden by anything below it;
  // after that the documented order is local > project > user.
  { scope: 'managed', path: '/Library/Application Support/ClaudeCode/managed-settings.json' }, // macOS
  { scope: 'managed', path: '/etc/claude-code/managed-settings.json' }, // Linux/WSL
  { scope: 'local', path: path.join(CWD, '.claude', 'settings.local.json') },
  { scope: 'project', path: path.join(CWD, '.claude', 'settings.json') },
  { scope: 'user', path: path.join(HOME, '.claude', 'settings.json') },
];

function readJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

/** Returns { enabled: true|false|undefined, source: string|null }. */
function pluginEnabledState(pluginKey) {
  for (const { scope, path: p } of SETTINGS_SCOPES) {
    const settings = readJSON(p);
    const value = settings?.enabledPlugins?.[pluginKey];
    if (typeof value === 'boolean') return { enabled: value, source: scope };
  }
  return { enabled: undefined, source: null }; // no explicit setting at any checked scope
}

function statusOf(c, present) {
  if (!present) return { symbol: '✗', label: 'not found' };
  if (c.kind === 'plugin' && c.pluginKey) {
    const { enabled, source } = pluginEnabledState(c.pluginKey);
    if (enabled === false) return { symbol: '⚠', label: `present but DISABLED (enabledPlugins:${source})` };
    if (enabled === true) return { symbol: '✓', label: `present and enabled (enabledPlugins:${source})` };
    return { symbol: '✓', label: 'present (no explicit enabledPlugins entry found — falls back to plugin default)' };
  }
  return { symbol: '✓', label: 'present (enablement not checked — see note below)' };
}

const result = MANIFEST.map((c) => {
  const present = isPresent(c);
  return {
    id: c.id,
    tier: c.tier,
    kind: c.kind,
    role: c.role,
    phase: c.phase,
    present,
    status: statusOf(c, present),
    install: c.install,
    notes: c.notes || '',
  };
});

const present = result.filter((r) => r.present);
const missing = result.filter((r) => !r.present);
const disabled = present.filter((r) => r.status.symbol === '⚠');

const ENABLEMENT_NOTE =
  'Note: enablement is only verified for plugin-kind components with a known `enabledPlugins` key ' +
  '(currently: ui-ux-pro-max), checked against settings.local.json / settings.json (project) and ' +
  '~/.claude/settings.json (user), plus the two common managed-settings.json OS paths — not every ' +
  'possible scope or override mechanism. Loose skills under ~/.claude/skills/<name> (impeccable, ' +
  'taste-skill, emil-design-eng, web-design-guidelines) have no separate per-skill enable flag, so ' +
  '"present" is the best signal this script can give for them. If a lens still throws `Unknown skill` ' +
  "despite a ✓ here, run `/plugin list` to confirm it's actually enabled this session.";

const args = process.argv.slice(2);
if (args.includes('--json')) {
  process.stdout.write(JSON.stringify({ present, missing, disabled, note: ENABLEMENT_NOTE }, null, 2) + '\n');
} else {
  const line = (r) => `  ${r.status.symbol} [${r.tier}] ${r.id} — ${r.role} (${r.status.label})`;
  process.stdout.write('design-review preflight — components it orchestrates\n\n');
  process.stdout.write('PRESENT:\n' + present.map(line).join('\n') + '\n\n');
  process.stdout.write('MISSING (ask user → install or skip EXPLICITLY):\n');
  process.stdout.write(missing.map((r) => `${line(r)}\n      install: ${r.install}`).join('\n') + '\n');
  if (disabled.length) {
    process.stdout.write('\n⚠ DISABLED THIS SESSION (on disk but will still throw `Unknown skill`):\n');
    process.stdout.write(disabled.map((r) => `  ⚠ ${r.id} — enable with: claude plugin enable ${r.id}`).join('\n') + '\n');
  }
  process.stdout.write('\n' + ENABLEMENT_NOTE + '\n');
}

if (args.includes('--write')) {
  const dir = path.resolve(CWD, '.design-review');
  fs.mkdirSync(dir, { recursive: true });
  const md = [
    '# design-review preflight',
    '',
    '> What the orchestrator uses, and what is present in this environment. Missing pieces are',
    "> NOT auto-installed: the orchestrator asks the user, and records skips here EXPLICITLY.",
    '',
    '## Present',
    ...present.map((r) => `- ${r.status.symbol} **${r.id}** [${r.tier}] — ${r.role} _(phase: ${r.phase})_ — ${r.status.label}`),
    '',
    '## Missing — decide per item (install / skip)',
    ...missing.map((r) => `- ✗ **${r.id}** [${r.tier}] — ${r.role}\n  - install: \`${r.install}\`\n  - if skipped: ${r.notes || 'this lens/phase is degraded; announce it.'}`),
    '',
    '## Note on enablement checking',
    ENABLEMENT_NOTE,
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dir, 'preflight.md'), md);
}

process.exit(0);
