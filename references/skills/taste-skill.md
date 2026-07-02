# taste-skill / design-taste-frontend — verified playbook (source: Leonxlnx/taste-skill @ 06d6028)

> Verified against the real 1206-line SKILL.md. Line refs are to that source.

## ⚠️ Skill name is INSTALL-DEPENDENT — resolve it, never hardcode
Frontmatter says `name: design-taste-frontend` (SKILL.md:2) but Claude Code registers the skill by
its **install directory basename**. A `git clone …/taste-skill ~/.claude/skills/taste-skill` install
registers as **`taste-skill`**; the official CLI install name is `design-taste-frontend`.
**Resolution rule for agents:** try `skill: "taste-skill"` first; on Unknown-skill, try
`skill: "design-taste-frontend"`; report a finding if neither resolves.

## Install
```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"   # documented form (README.md:60,70 — full URL required)
```
Also installable as a Claude Code plugin (`taste-skill` — repo has .claude-plugin/).

## ⚠️ This is a GENERATOR, not a reviewer
Invoked without routing it tends to BUILD a page, not audit one (its telos is shipping code).
An ambiguous brief triggers exactly 1 blocking question (§0.C:33-36) — there is no menu.
"Every rule below is contextual. None of it fires automatically" (SKILL.md:8-9) — the orchestrator
must name the sections to apply. **As a lens: route to §11 + §14, forbid generation explicitly.**

## Invoke (as diagnosis lens)
Skill tool, one invocation carrying everything:
- force **§11 REDESIGN PROTOCOL**: §11.A "Detect the Mode (first action)" (:787 — Greenfield /
  Preserve / Overhaul) then §11.B "Audit Before Touching" (:794);
- pass the current-state audit (`.design-review/audit-first.md`) and the references;
- fix the **THREE DIALS** (§1:47-49: `DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`,
  baseline 8/6/4) from references.md — the skill itself says overrides happen conversationally,
  never by editing files (:51), and prescribes inferring them (§1.A) instead of asking;
- state explicitly: *review only — do not generate or modify code*.

## Invoke (as final gate)
Instruct it to run **§14 FINAL PRE-FLIGHT CHECK** (:910-979) over the result and list every failed
checkbox as a finding. Honest framing: §14 is ~60 JUDGMENT checkboxes self-checked by the model —
**the skill does not emit a verdict; the gate is constructed by this pipeline** ("If a single
checkbox cannot be honestly ticked, the page is not done", :979).
Only 2 checks are truly mechanical → run them as deterministic grep, no model:
- em-dash count = 0 (§9.G:685-701, check :920)
- eyebrow count ≤ ceil(sections/3) (:256, :933)

## Scope (verified — stricter than "advisory")
Dashboards/tables/wizards are **declared OUT OF SCOPE** (§13:896-906): the skill says to route
product-UI to Fluent/Carbon/Polaris (§2.A) and apply only its marketing-page parts to the surfaces
where they apply. On dashboards: apply ONLY the cross-cutting rules (em-dash §9.G, fake numbers
:327-330/:618, consistency locks :190/:217/:341, AI-tells §9) and say so; do not fail the gate on
landing-only rules (hero §4.7:236-246, eyebrow :253-257, marquee-max-1 :361, mandatory images §4.8).

## Unused capabilities worth knowing
§10 vocabulary of ~50 named patterns (:705-779) — feed reference-research briefs. §11.D
modernisation levers in priority order + §11.F "never change silently" list — feed the fix phase.
§5 canonical GSAP skeletons (:352-515). §6 Core Web Vitals targets. Appendix A: real install
commands per design system (:987-1031). Sibling skills in the same repo: `redesign-skill`
(audit-then-fix for existing projects — overlaps this pipeline's mission), `output-skill`,
`image-to-code`, `stitch-skill`.
