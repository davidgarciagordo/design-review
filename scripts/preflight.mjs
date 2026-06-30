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
    install: 'git clone https://github.com/pbakaus/impeccable ~/.claude/skills/impeccable',
    notes: 'Needs PRODUCT.md (+ DESIGN.md) in cwd/.agents/context/docs, else it blocks with NO_PRODUCT_MD.',
  },
  {
    id: 'taste-skill',
    aka: 'design-taste-frontend',
    tier: 'core',
    role: 'anti-templated / composition (landing/portfolio); §14 pre-flight',
    phase: '3b diagnosis + 1 audit-first (§11) + 6 verdict (§14)',
    kind: 'skill',
    detect: ['~/.claude/skills/taste-skill/SKILL.md', '.claude/skills/taste-skill/SKILL.md', '.agents/skills/taste-skill/SKILL.md'],
    install: 'npx -y skills@latest add Leonxlnx/taste-skill --skill design-taste-frontend',
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
    role: 'accessibility AA / keyboard / focus / contrast (file:line)',
    phase: '3d diagnosis (last lens — net over motion added by emil)',
    kind: 'skill',
    detect: ['~/.claude/skills/web-design-guidelines/SKILL.md', '.claude/skills/web-design-guidelines/SKILL.md'],
    install: 'Claude Code default skill library (or git clone the Vercel web-interface-guidelines repo)',
    notes: 'Fetches the live Vercel rules each run — needs network; cache as fallback.',
  },
  {
    id: 'ui-ux-pro-max',
    tier: 'wired',
    role: 'design-intelligence DB: 84 styles / 161 palettes / font-pairings / 99 UX rules / charts',
    phase: '3a-pre baseline + 2 reference vocabulary + 3e UX lens + 5 generation',
    kind: 'plugin',
    detect: [
      '~/.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/*/.claude/skills/ui-ux-pro-max/SKILL.md',
      '~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/SKILL.md',
    ],
    install: 'claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill',
    notes: 'Needs python3 (search.py). Its raw palettes/fonts are REFERENCE only — the project design-system tokens win.',
  },
  {
    id: 'review-animations',
    tier: 'wired',
    role: 'motion Block/Approve gate (STANDARDS.md)',
    phase: '3c + 6 verdict (motion gate)',
    kind: 'skill',
    detect: ['~/.claude/skills/review-animations/SKILL.md', '.claude/skills/review-animations/SKILL.md', '.agents/skills/review-animations/SKILL.md'],
    install: 'npx -y skills@latest add emilkowalski/skills --skill review-animations',
    notes: 'Lives in the emilkowalski/skills repo; disable-model-invocation=true → invoke explicitly.',
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
    install: 'claude plugin install (Anthropic agent-skills marketplace) — frontend-design',
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
    role: 'asset-integrity (WebSearch facts + brand-spec) + Playwright verify + multi-format builder (PPT/video/mockup/dense dashboard)',
    phase: '2 pre-build (assets) + 6 verify + primary builder for non-landing surfaces',
    kind: 'skill',
    detect: ['~/.claude/skills/huashu-design/SKILL.md', '.claude/skills/huashu-design/SKILL.md'],
    install: 'git clone https://github.com/alchaincyf/huashu-design ~/.claude/skills/huashu-design',
    notes: 'When used, force review mode + grant WebSearch. Density exception (≥3 dense elements) for dashboards.',
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

const result = MANIFEST.map((c) => ({
  id: c.id,
  tier: c.tier,
  kind: c.kind,
  role: c.role,
  phase: c.phase,
  present: isPresent(c),
  install: c.install,
  notes: c.notes || '',
}));

const present = result.filter((r) => r.present);
const missing = result.filter((r) => !r.present);

const args = process.argv.slice(2);
if (args.includes('--json')) {
  process.stdout.write(JSON.stringify({ present, missing }, null, 2) + '\n');
} else {
  const line = (r) => `  ${r.present ? '✓' : '✗'} [${r.tier}] ${r.id} — ${r.role}`;
  process.stdout.write('design-review preflight — components it orchestrates\n\n');
  process.stdout.write('PRESENT:\n' + present.map(line).join('\n') + '\n\n');
  process.stdout.write('MISSING (ask user → install or skip EXPLICITLY):\n');
  process.stdout.write(missing.map((r) => `${line(r)}\n      install: ${r.install}`).join('\n') + '\n');
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
    ...present.map((r) => `- ✓ **${r.id}** [${r.tier}] — ${r.role} _(phase: ${r.phase})_`),
    '',
    '## Missing — decide per item (install / skip)',
    ...missing.map((r) => `- ✗ **${r.id}** [${r.tier}] — ${r.role}\n  - install: \`${r.install}\`\n  - if skipped: ${r.notes || 'this lens/phase is degraded; announce it.'}`),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dir, 'preflight.md'), md);
}

process.exit(0);
