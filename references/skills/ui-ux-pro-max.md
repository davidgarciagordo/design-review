# ui-ux-pro-max — verified playbook (source: nextlevelbuilder/ui-ux-pro-max-skill @ d7e37dd, v2.6.2)

## Install (marketplace add FIRST — the install id alone fails)
```bash
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
# or CLI ("Recommended" per README): npm install -g ui-ux-pro-max-cli && uipro init --ai claude [--global]
# (old package `uipro-cli` is stale — do not use)
```
The plugin ships 7 skills: `ui-ux-pro-max` (the searchable DB) + sibling skills namespaced
`ui-ux-pro-max:design`, `ui-ux-pro-max:ui-styling`, `ui-ux-pro-max:design-system`,
`:banner-design`, `:brand`, `:slides`. **`:design`/`:ui-styling`/`:design-system` are separate
skills, NOT modes of the search script** — invoke them via the Skill tool by their namespaced name.

## What it actually is
A BM25-searchable design database (python3 stdlib only, no pip): **84 styles · 161 palettes ·
73 font-pairings** (counted from the shipped CSVs — the "50+/57" figures floating around come from
a stale SKILL.md description) · 25 charts · 161 product types · 99 UX guidelines · 1923 google-fonts
· 16 stacks. It is a CONSULTATION tool — there is no fix command.

## Invoke (script path: `<skill-dir>/scripts/search.py`; Windows: `python` not `python3`)
- **Design-system baseline** (its SKILL.md prescribes this as a mandatory step, :363-379):
  ```bash
  python3 <skill-dir>/scripts/search.py "<product industry keywords>" --design-system -p "Name" [-f markdown]
  ```
  Returns pattern + style + full 17-role palette (hex + CSS vars) + typography + effects +
  anti-patterns. Add `--persist [--page "dashboard"] [-o dir]` → writes
  `design-system/<slug>/MASTER.md` + `pages/*.md` (Master+Overrides pattern) — a reusable
  cross-run artifact; persist it once and reuse.
- **Vocabulary for reference-research**:
  ```bash
  python3 <skill-dir>/scripts/search.py "glassmorphism dark" --domain style -n 5
  python3 <skill-dir>/scripts/search.py "fintech vibrant" --domain color
  python3 <skill-dir>/scripts/search.py "elegant luxury" --domain typography
  ```
  Style rows carry "AI Prompt Keywords" + "CSS/Technical Keywords" + an implementation checklist —
  paste-ready for references.md.
- **UX-guidelines pass** (pre-delivery, its SKILL.md:571):
  ```bash
  python3 <skill-dir>/scripts/search.py "animation accessibility z-index loading" --domain ux
  ```
- Valid `--domain` values (11): style, color, chart, landing, product, ux, typography, icons,
  react, web, google-fonts. Valid `--stack` (16 shipped): react, nextjs, vue, svelte, astro,
  swiftui, react-native, flutter, nuxtjs, nuxt-ui, html-tailwind, shadcn, jetpack-compose, threejs,
  angular, laravel. (The script's own docstring lists stale/extra values — trust this list.)
- Other flags: `--json` · `-n/--max-results` (default 3) · `-f {ascii,markdown}`.

## Deps
python3 (any 3.x, stdlib only — BM25 is inline). The `design-system` sibling skill uses node
(`generate-tokens.cjs`/`validate-tokens.cjs`).

## Role in this pipeline
Deterministic tool, no model in front of it: baseline before the lenses (3a-pre), vocabulary during
reference-research, UX pass at 3e, `--persist` MASTER.md as cross-run memory. Raw palettes/fonts are
reference only — project tokens always win.
