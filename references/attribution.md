# Attribution & skills — what's mandatory, what's an add-on

> The pipeline ORCHESTRATES skills authored by others. It does not replace them — it **loads** them via
> the Skill tool (never paraphrases them) and sequences them around two new gates of its own
> (reference-research and the vitality verdict).

**Verify every URL before installing.** Entries marked ⚠️ are best-effort.

---

## The 4 CORE skills — mandatory · non-skippable · invoked in this exact order

If a core skill is missing, **offer to install it — do not silently skip a core lens**. The pipeline's
vitality telos depends on all four.

| # | Skill | Lens / agent | What it contributes | Author / source | Install |
|---|---|---|---|---|---|
| 1 | `impeccable` | `design-lens-impeccable` | Structure, visual hierarchy, IA, cognitive load, tokens, scored audit | Paul Bakaus (pbakaus) | `git clone https://github.com/pbakaus/impeccable ~/.claude/skills/impeccable` |
| 2 | `design-taste-frontend` (a.k.a. `taste-skill`) | `design-lens-taste` | Anti-slop **and anti-templated** — the lens that refuses generic; carries the gate that FAILS the run | Leonxlnx | `git clone https://github.com/Leonxlnx/taste-skill ~/.claude/skills/taste-skill` |
| 3 | `emil-design-eng` | `design-lens-motion` | Polish **and signature motion** — staggered entrances, reveals, depth, a memorable moment | Emil Kowalski | `git clone https://github.com/emilkowalski/skills ~/.claude/skills/emil-skills` (use the `emil-design-eng` dir) |
| 4 | `web-design-guidelines` | `design-lens-a11y` | Accessibility AA, keyboard, visible focus, contrast, roles/labels | Anthropic — Web Interface Guidelines | Available in Claude Code's default skill library |

`agent-browser` is also effectively required for the two browser gates (reference-research and the vitality
verdict). It is the browser-automation CLI — Claude Code built-in or project-configured. Without it, those
steps degrade: the verdict can only be **provisional** (you cannot claim `alive` for a design no one
rendered).

---

## Add-ons — skippable · opt-in · sharpen but don't gate

| Skill | When | What it adds | Source | If missing |
|---|---|---|---|---|
| `huashu-design` (花叔Design) | optional 2nd anti-slop lens | Independent 5-dim critique; catches what impeccable + taste missed | https://github.com/alchaincyf/huashu-design | Skipped — note it; one extra lens lost |
| `review-animations` | after `emil-design-eng` | Dedicated animation critique: timing, easing, purpose, jank | Same repo as `emil-design-eng` — https://github.com/emilkowalski/skills | Skipped — motion critique not run |
| `seo` | **public targets only** | Semantic headings, meta/OG, canonical, structured data, indexability | https://github.com/addyosmani/web-quality-skills | Skipped (or N/A for private targets) |
| `web-accessibility` / `accessibility` | deeper WCAG 2.2 audit | Full A/AA success criteria beyond the core a11y lens | https://github.com/addyosmani/web-quality-skills | Core lens (`web-design-guidelines`) still covers AA essentials |
| `ui-ux-pro-max` / `frontend-design` | optional baseline before lens 1 | Extra structure/baseline pass | nextlevelbuilder.io ⚠️ / Anthropic | Skipped — `impeccable` covers structure |
| mobile design skill | RN / Expo targets | Touch targets, safe areas, platform conventions | pick your own (e.g. Sleek — sleek.design ⚠️ commercial) | Web lenses still apply; note mobile rules not run |

---

## The two NEW gates this repo adds (no external skill)

These are the levers against "flat", implemented as agents in this repo:

| Gate | Agent | Role |
|---|---|---|
| **reference-research** | `design-reference-research` | The #1 lever: Dribbble 2026 + competitors → 3–5 patterns → copy+combine+house. Writes `.design-review/references.md`. |
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
Offer to install it. The pipeline can degrade (skip an add-on), but skipping a **core** lens means the
vitality telos isn't fully tested — say so explicitly in the verdict.

### Verifying URLs
Repos move. Before installing: open the URL, confirm the repo is active, read its README for the current
install method and (for multi-skill repos like `emilkowalski/skills`) which directory holds the skill.

→ Back to [design-review](../README.md)
</content>
