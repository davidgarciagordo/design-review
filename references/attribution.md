# Attribution & skills — what's mandatory, what's wired intelligence, and what's an add-on

> The pipeline ORCHESTRATES skills authored by others. It does not replace them — it **loads** them via
> the Skill tool (never paraphrases them) and sequences them around two new gates of its own
> (reference-research and the vitality verdict).

> **None of the 4 core skills below ship with Claude Code by default.** They are third-party skills
> (credited to their authors in the table) that you must install separately — see
> [Requires](../README.md#requires) — before the 4 lenses can run. Without them, each lens fails with
> `Unknown skill` (confirmed in testing); there is no built-in fallback.

**Verify every URL before installing.** Entries marked ⚠️ are best-effort.

---

## The 4 CORE skills — mandatory · non-skippable · invoked in this exact order

If a core skill is missing, **offer to install it — do not silently skip a core lens**. The pipeline's
vitality telos depends on all four. Step 0 (Bootstrap) detects → installs → (temp-clone fallback) → uses
each skill; no referenced skill is ever assumed "not installed".

| # | Skill | Lens / agent | What it contributes | Author / source | Install |
|---|---|---|---|---|---|
| 1 | `impeccable` | `design-lens-impeccable` | Structure, visual hierarchy, IA, cognitive load, tokens, scored audit. **Routed** to `impeccable audit` + `critique` (never bare) | Paul Bakaus (pbakaus) | `git clone https://github.com/pbakaus/impeccable ~/.claude/skills/impeccable` |
| 2 | `design-taste-frontend` (a.k.a. `taste-skill`) | `design-lens-taste` | Anti-slop **and anti-templated** — **routed** to §11 redesign-audit + §14 pre-flight; dials pre-set from references.md | Leonxlnx | `git clone https://github.com/Leonxlnx/taste-skill ~/.claude/skills/taste-skill` |
| 3 | `emil-design-eng` | `design-lens-motion` | Polish **and signature motion** — concrete question **in the same invocation** (bypasses "Initial Response wait"); Before/After output → P1/P2/P3 | Emil Kowalski | `git clone https://github.com/emilkowalski/skills ~/.claude/skills/emil-skills` (use the `emil-design-eng` dir) |
| 4 | `web-design-guidelines` | `design-lens-a11y` | Accessibility AA, keyboard, visible focus, contrast, roles/labels. **WebFetch** guidelines → cached to `.design-review/web-guidelines.md` → passed as input (avoids "which files?" prompt) | Vercel (`vercel-labs/web-interface-guidelines`, packaged as a skill in `vercel-labs/agent-skills`) | `npx -y skills@latest add vercel-labs/agent-skills --skill web-design-guidelines` (alt: `curl -fsSL https://vercel.com/design/guidelines/install | bash`) |

`agent-browser` is also effectively required for the two browser gates (reference-research and the vitality
verdict). It is the browser-automation CLI — Claude Code built-in or project-configured. Without it, those
steps degrade: the verdict can only be **provisional** (you cannot claim `alive` for a design no one
rendered).

---

## Design intelligence (wired, not an add-on)

| Skill | Role in the pipeline | Source / Install |
|---|---|---|
| **`ui-ux-pro-max`** | **Wired across phases** — 3a-pre baseline (`search.py --design-system`), reference-research vocabulary (84 styles, 161 palettes, font-pairings), UX-guidelines lens (3e), fix (`:design`/`:ui-styling`/`:design-system`). Raw palettes/fonts = reference only; project tokens win. Needs `python3` | `claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill` |
| **`refero`** | **Reference-research (step 2)** — real products **in production** (gallery via agent-browser; `DESIGN.md` token specs via MCP). Complements Dribbble (trend) with shipped-product references. Tokens = reference only | Refero MCP (opt-in) ⚠️; default = agent-browser over `refero.design` |
| **`frontend-design`** | **Plan (2b) + fix (5)** — authoring criterion **folded into taste/plan**, not a 5th lens (overlaps taste): 4–6 hex token-plan + one signature element + "3 AI-default looks to avoid" + UX-writing | Anthropic agent-skills marketplace |
| **`review-animations`** | **Motion gate (3c + verdict 6)** — Block/Approve on animation vs `STANDARDS.md`. `disable-model-invocation=true` → invoke explicitly; degrades gracefully if absent | `npx -y skills@latest add emilkowalski/skills --skill review-animations` |

> Single source of truth for the full manifest (detect + install per component) is **`scripts/preflight.mjs`**.

---

## Bootstrap — detect → install → fallback → use (step 0, non-negotiable)

No referenced skill is ever assumed "not installed" and no skill is ever silently skipped. Mechanism:

1. **Available as plugin/skill** (in `~/.claude/skills`, marketplace, or `.claude/skills` in the project) → use it.
2. **Missing → install it** (`npx skills add <author/repo>` or `claude plugin install <plugin>@<marketplace>`).
3. **Fallback if it cannot be installed formally** → clone the repo to a temp dir and read/use its
   `SKILL.md` directly. ("At a minimum, know how to use it by installing it in a temp location.")

| Skill | Detect / install command |
|---|---|
| `impeccable` *(core)* | `git clone https://github.com/pbakaus/impeccable ~/.claude/skills/impeccable` |
| `design-taste-frontend` / `taste-skill` *(core)* | `git clone https://github.com/Leonxlnx/taste-skill ~/.claude/skills/taste-skill` |
| `emil-design-eng` *(core)* | `git clone https://github.com/emilkowalski/skills` (use `emil-design-eng` dir) |
| `web-design-guidelines` *(core)* | `npx -y skills@latest add vercel-labs/agent-skills --skill web-design-guidelines` (third-party, Vercel — not bundled with Claude Code) |
| `ui-ux-pro-max` *(wired intelligence)* | `claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill` |
| `agent-browser` | Claude Code built-in / project-configured |
| `huashu-design` *(add-on)* | `git clone https://github.com/alchaincyf/huashu-design` |

> **`review-animations` does NOT exist as a standalone skill/command.** It is optional — only if
> installed (lives in the `emilkowalski/skills` repo). Treat it gracefully: if absent, the pipeline
> continues; note that a dedicated animation timing/easing critique was not run.

---

## Add-ons — skippable · opt-in · sharpen but don't gate

| Skill | When | What it adds | Source | If missing |
|---|---|---|---|---|
| `huashu-design` (花叔Design) | optional 2nd anti-slop lens (run step 3 with `WebSearch` granted) | Independent 5-dim critique; catches what impeccable + taste missed | https://github.com/alchaincyf/huashu-design | Skipped — note it; one extra lens lost |
| `review-animations` | **OPTIONAL — only if installed** (after `emil-design-eng`) | Dedicated animation critique: timing, easing, purpose, jank | Same repo as `emil-design-eng` — https://github.com/emilkowalski/skills | Skipped gracefully — motion critique not run; pipeline does not break |
| `seo` | **public targets only** | Semantic headings, meta/OG, canonical, structured data, indexability | https://github.com/addyosmani/web-quality-skills | Skipped (or N/A for private targets) |
| `web-accessibility` / `accessibility` | deeper WCAG 2.2 audit | Full A/AA success criteria beyond the core a11y lens | https://github.com/addyosmani/web-quality-skills | Core lens (`web-design-guidelines`) still covers AA essentials |
| mobile design skill | RN / Expo targets | Touch targets, safe areas, platform conventions | pick your own (e.g. Sleek — sleek.design ⚠️ commercial) | Web lenses still apply; note mobile rules not run |

---

## The two NEW gates this repo adds (no external skill)

These are the levers against "flat", implemented as agents in this repo:

| Gate | Agent | Role |
|---|---|---|
| **reference-research** | `design-reference-research` | The #1 lever: Dribbble 2026 + competitors + ui-ux-pro-max vocabulary → 3–5 patterns → copy+combine+house. Writes `.design-review/references.md`. |
| **vitality verdict** | `design-vitality-verdict` | Live check + diff vs references → explicit `alive`/`templated`/`flat`. Writes `.design-review/verdict.json` (the hook reads it). |

---

## Installation notes

### Claude Code skills directory
Skills load from `~/.claude/skills/`, each in its own subdir with a `SKILL.md`. Project-level skills in
`.claude/skills/` override global ones of the same name. Claude Code detects them on session start.

### Loaded, never paraphrased
A skill is content the agent **loads** (via the Skill tool), not prose the pipeline restates. If a lens
agent is summarising a skill instead of invoking it, that's the bug — invoke the Skill tool.

### When a core skill is missing
Step 0 (Bootstrap) offers to install it. The pipeline can degrade (skip an add-on), but skipping a
**core** lens means the vitality telos isn't fully tested — say so explicitly in the verdict.

### Verifying URLs
Repos move. Before installing: open the URL, confirm the repo is active, read its README for the current
install method and (for multi-skill repos like `emilkowalski/skills`) which directory holds the skill.

→ Back to [design-review](../README.md)
