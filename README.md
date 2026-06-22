**English** | [Español](README.es.md)

# design-review

> An ordered pipeline that runs focused design skills in sequence, collects every finding, and gives you a checklist to choose what to fix.

**design-review** is a named workflow for polishing any visual target — a component, screen, page, email, or dashboard — with an AI assistant. It sequences established design skills (most authored by third parties — see [Attribution](#attribution)) into one disciplined pass: structure → audit → anti-slop → polish → accessibility → live reality-check. You pick the fixes; it applies only what you select.

It is a companion to [Forge Methodology](https://github.com/davidgarciagordo/forge-methodology): **Forge structures what to build; design-review polishes how it looks**.

---

## Why design-review?

Running design skills ad hoc means running them in the wrong order, dropping findings between steps, and applying changes without a checkpoint. The result is an audit that feels thorough but misses the interaction between layers — contrast issues that only appear after the layout is tightened, motion that looks fine in isolation but distracts on the real screen.

design-review solves this by:

- **Fixing the order** — structure before audit, audit before polish, polish before accessibility, always live check last
- **Accumulating findings** across all skills into one deduplicated list (nothing dropped)
- **Giving you control** — presents findings as a multi-select checklist; applies only what you approve
- **Adapting to your project** — skips steps that don't apply (no design system, private target, mobile context)

---

## Why design-review — with vs. without

| | Without design-review | With design-review |
|---|---|---|
| **Skill ordering** | Skills run in whatever order they are invoked; structure problems are layered on top of a bad layout | Fixed pipeline: layout and hierarchy first, scored audit second, polish only after the structure is right |
| **Finding loss** | Each skill reports independently; earlier findings get lost by the time the next skill runs | Single accumulated list — every finding from every skill, deduplicated, prioritised |
| **User control** | Fixes applied silently or in bulk; no checkpoint between "what was found" and "what was changed" | Multi-select checklist: you see every finding and choose what to apply before anything changes |
| **Coverage gaps** | Skills run in isolation miss interactions (contrast after layout tightening, motion after dark-mode fix) | Ordered pipeline catches cross-skill interactions; live check at the end catches what static analysis never sees |
| **Wasted effort** | SEO run on an admin panel; Storybook step run on a project without stories | Capability detection at step 0 skips inapplicable steps explicitly and tells you which were skipped |
| **No ground truth** | Review happens against the code, not the rendered artifact | Closing visual check (light/dark/mobile screenshots + Core Web Vitals) gives objective evidence |

**The practical difference:** fewer overlooked interactions, no silent bulk changes, findings that survive the full pipeline, and a final screenshot that proves the result is what you think it is.

---

## The pipeline

The pipeline runs in fixed order. Each step accumulates findings; nothing is dropped.

| Step | What happens | Skills |
|------|-------------|--------|
| **0. Detect capabilities** | Detect design system, Storybook, platform (web/mobile), live browser, and whether the target is public. Skip inapplicable steps and state which were skipped. | — |
| **0b. Reuse-first** | Consult existing components before designing. New reusable pieces go into the design system with a story. *(Skip if no design system.)* | — |
| **1. Baseline structure** | Visual hierarchy, information architecture, layout, cognitive load. | `ui-ux-pro-max` (primary) or `frontend-design` (fallback) |
| **2. Scored audit + anti-slop** | 5-dimension scored audit with live iteration. Lead skill. | `impeccable` |
| **3. Second anti-slop lens** | Independent 5-dimension critique; catches what step 2 missed. | `huashu-design` |
| **4. Taste / transversal anti-slop** | Em-dash ban, eyebrow restraint, fake numbers, consistency locks. On dashboards: transversal rules only. | `taste-skill` |
| **5. Motion & polish** | Purposeful animation, press feedback, transitions, skeletons, reduced-motion. Then a dedicated animation review (timing, easing, jank). | `emil-design-eng` + `review-animations` |
| **6. Accessibility** | WCAG AA (contrast ≥ 4.5:1), keyboard, visible focus rings, roles, labels, reduced-motion. | `web-design-guidelines` + `web-accessibility` / `accessibility` |
| **6b. SEO** | Semantic headings, meta/OG tags, structured data. **Public targets only — skip for private/internal UI.** | `seo` |
| **7. Live visual check** | Render the real target (Storybook and/or app route) in light, dark, and mobile. Screenshot. Core Web Vitals (LCP/CLS/INP/TTFB). Visual regression diff on redesigns. Run sequentially. *(Skip if no live browser; state it.)* | `agent-browser` |

The live check is always last. It is the reality test that static analysis cannot provide.

---

## Adapts to your project

Before running, the pipeline checks four things:

| If your project has… | The pipeline… |
|---|---|
| No design system or tokens file | Skips the reuse-first step; flags color/spacing inconsistencies ad hoc |
| No Storybook | Skips the Storybook-first step; renders in the app route instead |
| A private/internal target (admin, dashboard, authenticated app) | **Skips the SEO step entirely** |
| Mobile (React Native / Expo) instead of web | Uses a mobile-design skill; skips DOM-only skills |
| No live browser or dev server | Does a static review; explicitly states the live visual check was not run |

Every skipped step is stated explicitly with the reason.

---

## Output: a checklist you choose from

After the pipeline runs, all findings from every skill are gathered into one deduplicated list, grouped by priority, and presented as a **multi-select checklist**. P1 items are pre-selected. You choose what to fix; the pipeline applies only the selected items.

```
Which findings should I fix?  (multi-select)

P1 — Broken / identity / accessibility
  [x] Contrast 3.1:1 on primary button label — fails WCAG AA                [impeccable, web-accessibility]
  [x] No visible focus ring on nav links — keyboard users cannot orient      [web-design-guidelines]
  [x] Icon-only action in mobile nav has no accessible label                 [web-accessibility]

P2 — Improvements
  [ ] CTA hierarchy: two competing primary buttons on the same screen        [impeccable, huashu-design]
  [ ] Card spacing rhythm breaks at the 3rd row (8px gap inconsistency)      [taste-skill]
  [ ] LCP 3.8s — hero image not preloaded                                    [agent-browser]

P3 — Polish
  [ ] Hover transition 320ms feels sluggish → target 150ms                   [emil-design-eng, review-animations]
  [ ] Section eyebrow "FEATURES" in all-caps adds no meaning                 [taste-skill]
  [ ] Dark mode card border barely visible (1px solid rgba(255,255,255,0.06)) [impeccable]
```

For large lists, shortcuts are offered: "select all P1", "all P1+P2", or per-item selection.

After applying: typecheck (if code), design-token usage (no hardcoded color/spacing/type), brand/identity consistency, and closing screenshots (light/dark/mobile) + Core Web Vitals.

---

## Attribution

This pipeline orchestrates skills authored by others. **Verify URLs before installing.**

| Skill | Purpose | Source |
|---|---|---|
| `ui-ux-pro-max` | Baseline UX / structure (step 1) | https://ui-ux-pro-max-skill.nextlevelbuilder.io/ |
| `frontend-design` | Distinctive, non-generic baseline UI (step 1 fallback) | Anthropic |
| `impeccable` | Scored audit + anti-slop + live iteration | https://github.com/pbakaus/impeccable |
| `huashu-design` | Hi-fi prototypes + anti-slop + 5-dimension review | https://github.com/alchaincyf/huashu-design |
| `taste-skill` | Anti-slop / design taste | https://github.com/Leonxlnx/taste-skill |
| `emil-design-eng` | Motion and interaction polish | https://github.com/emilkowalski/skills |
| `review-animations` | Dedicated animation review (timing / easing / jank) | https://github.com/emilkowalski/skills |
| `web-design-guidelines` | Web Interface Guidelines (AA, keyboard, contrast) | Anthropic — Web Interface Guidelines |
| `web-accessibility` / `accessibility` | WCAG 2.2 audit | https://github.com/addyosmani/web-quality-skills |
| `seo` | Search visibility (public targets only) | https://github.com/addyosmani/web-quality-skills |
| mobile design skill | Mobile / RN screens | pick your own (e.g. Sleek — sleek.design) |

If a skill is missing and has no public source, the pipeline degrades gracefully: run the available steps and note which lenses were skipped.

Full install and attribution details: [references/attribution.md](references/attribution.md)

---

## How to use

### Install

Drop `SKILL.md` into your Claude Code skills directory:

```bash
git clone https://github.com/davidgarciagordo/design-review-pipeline ~/.claude/skills/design-review
```

Claude Code picks it up automatically.

### Triggers

```
improve design
design review
run the design skills
/design-review <target>
```

### Structured prompt

```
/design-review apps/web/app/settings/page.tsx

Target: settings page (authenticated — skip SEO)
Stack: Next.js App Router, Tailwind, design-system tokens
Live browser: available (dev server on port 3000)
```

### Without Claude Code

Read `SKILL.md` directly. The pipeline works with any AI assistant. Run each step manually in order, accumulate findings in a shared document, and present the checklist before applying changes.

---

## Companion: Forge

design-review is a companion to [Forge Methodology](https://github.com/davidgarciagordo/forge-methodology).

**Forge** structures the work: align intent → spec → adversarial grill → global plan → optimal execution → verified done → owner sign-off. It answers "are we building the right thing, in the right way?"

**design-review** polishes the result: once the screen or component exists, run it through the pipeline to make it visually right — correct hierarchy, zero a11y regressions, purposeful motion, real performance numbers.

They compose naturally: use Forge to plan and execute a feature, then run design-review on the UI deliverable before the owner sign-off gate.

---

## Examples

Real worked examples with findings and checklists:

→ [examples/](examples/README.md)

---

## References

| Reference | Contents |
|-----------|----------|
| [references/pipeline.md](references/pipeline.md) | Step-by-step pipeline detail: what each skill does, what to look for, how to chain findings |
| [references/attribution.md](references/attribution.md) | Full attribution table with install instructions and fallback notes |

---

## Templates

| Template | Use for |
|----------|---------|
| [templates/findings-checklist.md](templates/findings-checklist.md) | Copy-paste checklist template for recording findings from the pipeline |

---

## License

MIT — see [LICENSE](./LICENSE).
