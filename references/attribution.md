# Attribution — full table

> Every skill this pipeline orchestrates, what it contributes, who authored it, where to get it, and what to do if it is missing.

design-review does not replace these skills. It sequences them. The quality of the output depends on installing the skills you need for your project.

**Verify all URLs before installing.** Entries marked ⚠️ are best-effort and should be confirmed.

---

## Full attribution table

| Skill | Step | What it contributes | Author / source | Install command | If missing |
|---|---|---|---|---|---|
| `ui-ux-pro-max` | 1 (primary) | Baseline UX audit: visual hierarchy, IA, layout structure, cognitive load, accessibility scaffolding | nextlevelbuilder.io | See https://ui-ux-pro-max-skill.nextlevelbuilder.io/ for install instructions | Fall back to `frontend-design` (step 1 fallback) |
| `frontend-design` | 1 (fallback) | Distinctive, non-generic baseline UI; anti-templated layout and structure | Anthropic | Available in Claude Code's default skill library | Run step 1 with reduced coverage — note it in findings |
| `impeccable` | 2 (lead) | 5-dimension scored audit (typography, spacing, contrast, CTAs, layout); live iteration; anti-slop fixes | Paul Bakaus (pbakaus) | `git clone https://github.com/pbakaus/impeccable ~/.claude/skills/impeccable` | Step 2 SKIPPED — note it; the pipeline loses its lead scoring layer |
| `huashu-design` (花叔Design) | 3 | Hi-fi prototype thinking; independent 5-dimension critique (clarity, balance, consistency, hierarchy, completeness); catches what impeccable missed | alchaincyf | `git clone https://github.com/alchaincyf/huashu-design ~/.claude/skills/huashu-design` | Step 3 SKIPPED — note it; second-opinion coverage is lost |
| `taste-skill` | 4 | Anti-slop / design taste: em-dash ban, eyebrow restraint, fake numbers, redundant labels, consistency locks | Leonxlnx | `git clone https://github.com/Leonxlnx/taste-skill ~/.claude/skills/taste-skill` | Step 4 SKIPPED — note it; surface copy and consistency checks are not run |
| `emil-design-eng` | 5 (application) | Motion and interaction polish: hover transitions, press/active states, loading states, skeleton screens, reduced-motion | Emil Kowalski | `git clone https://github.com/emilkowalski/skills ~/.claude/skills/emil-skills` then symlink or copy `emil-design-eng` | Step 5a SKIPPED — motion gaps are not fixed |
| `review-animations` | 5 (critique) | Dedicated animation review: timing correctness, easing function appropriateness, purpose (communicative vs. decorative), jank detection | Emil Kowalski | Same repo as `emil-design-eng` — see https://github.com/emilkowalski/skills | Step 5b SKIPPED — animation timing/easing critique is not run |
| `web-design-guidelines` | 6 (structure) | Web Interface Guidelines: keyboard navigability, visible focus rings, ARIA roles, accessible form patterns, color contrast | Anthropic — Web Interface Guidelines | Available in Claude Code's default skill library | Step 6 runs with reduced coverage — note missing structural checks |
| `web-accessibility` / `accessibility` | 6 (WCAG audit) | WCAG 2.2 full audit: all A and AA success criteria, screen reader patterns, keyboard interaction, color / motion / cognitive accessibility | Addy Osmani | `git clone https://github.com/addyosmani/web-quality-skills ~/.claude/skills/web-quality-skills` then use `web-accessibility` or `accessibility` | Step 6 runs with reduced coverage — note WCAG audit was not run |
| `seo` | 6b (public only) | Search visibility: semantic headings, meta/OG tags, canonical URLs, structured data, indexability | Addy Osmani | Same repo as `web-accessibility` — see https://github.com/addyosmani/web-quality-skills | Step 6b SKIPPED (or not applicable for private targets) |
| mobile design skill | 1 (mobile) | Mobile-specific layout, touch target sizes, safe areas, platform conventions (iOS/Android) | pick your own | e.g. Sleek — see https://sleek.design (⚠️ commercial; verify availability) | Step 1 runs with `frontend-design` as a partial fallback — note mobile-specific rules were not applied |
| `agent-browser` | 7 | Live browser automation: screenshots in light/dark/mobile, Core Web Vitals (LCP/CLS/INP/TTFB), visual regression diff | Claude Code built-in (or project-configured) | Available when Claude Code has browser access configured | Step 7 SKIPPED — state explicitly: "Live visual check: SKIPPED — no dev server / browser available" |

---

## Notes on installation

### Claude Code skills directory

By default, Claude Code loads skills from `~/.claude/skills/`. Each skill should be in its own subdirectory with a `SKILL.md` file:

```
~/.claude/skills/
  impeccable/
    SKILL.md
  huashu-design/
    SKILL.md
  taste-skill/
    SKILL.md
  ...
```

Claude Code detects skills automatically when you start or restart a session.

### Project-level skills

You can also install skills per-project by placing them in `.claude/skills/` at the project root. Project-level skills override global ones with the same name.

### When a skill is not installed

The pipeline degrades gracefully. When a step's skill is missing:

1. The pipeline states which step was skipped and why (skill not found).
2. The pipeline continues with the remaining steps.
3. The final checklist is marked with a note: "Note: step N was skipped (skill `<name>` not installed — see references/attribution.md for install instructions)."

No finding is silently dropped because a skill was unavailable. The gap is always visible.

### Verifying URLs

Skill repositories move or become unavailable. Before installing any skill from this table:

1. Open the URL in a browser and confirm the repo exists and is active.
2. Check the repo's README for the current recommended install method.
3. For skills from multi-skill repos (e.g. `emilkowalski/skills` contains multiple skills), read the repo README to understand which directory contains each skill.

→ Back to [design-review](../README.md)
