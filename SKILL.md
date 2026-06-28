---
name: design-review
description: "Domain-agnostic design review/improvement pipeline. Runs design skills IN ORDER over a target (component, screen, page, email), accumulates findings from all of them, presents them as a multi-select checklist for the user to choose what to fix, and closes with a LIVE visual check (agent-browser). Adapts to the project's capabilities (Storybook? design system? public or private? web or mobile?). Trigger: \"improve design\", \"design review\", \"run the design skills\", \"/design-review <target>\"."
---

# design-review — a portable design pipeline for AI agents

**"Run it through design-review"** = apply this pipeline. It orchestrates several focused design
skills (most authored by others — see Attribution) into one ordered pass: structure → audit →
anti-slop → polish → accessibility → (SEO if public) → **live visual reality-check**.

It is self-contained and works with any AI assistant. It does NOT replace the individual skills;
it sequences them and tells you which to install if one is missing.

---

## Step 0 — Detect project capabilities (adapt the pipeline)

Before running, detect (or ask) and **skip the steps that don't apply**:

| Capability | How to detect | If absent |
|---|---|---|
| **Design system / tokens** | `packages/*design-system*`, a tokens file, a Tailwind/theme config | Skip "reuse existing components"; treat colors/spacing as ad-hoc but still flag inconsistency |
| **Storybook / component explorer** | `.storybook/`, `*.stories.*` | Skip the Storybook-first step; render in the app/route instead |
| **Public-facing target** | landing/marketing/docs route, indexable | If **private/internal** (admin, dashboard, authed app) → **skip the SEO step** |
| **Platform** | web vs React Native / mobile | Mobile → use a mobile-design skill; web-only skills (DOM/iframe/maps) don't apply |
| **Live browser available** | a dev server / built target + a browser-automation CLI | If none → do a static review and clearly state the live visual check was NOT run |

State explicitly which steps you skipped and why.

---

## Step 0.5 — Preflight: detect missing skills and OFFER to install (user decides)

Before running the pipeline, check which orchestrated skills are actually available, and let the
user choose what to install. **GOLDEN RULE: the user always decides — never install, run, or skip a
dependency without an explicit pick. No silent install, no auto-run, no blocking.**

Note: a skill is content the agent loads, not a throwaway executable — there is no ephemeral run.
`npx skills add <source>` *installs* it (persists). "On the fly" just means running that install at
this moment, only after the user picks it. Optional skills have fallbacks (e.g. `ui-ux-pro-max` →
`frontend-design`), so declining an install never breaks the pipeline.

1. **Detect** which pipeline skills (see Attribution) are present (skill registry / `~/.claude/skills/` / installed plugins).
2. **Classify the missing ones:**
   - **Installable via skills.sh** → `npx skills add <owner/repo>` (e.g. `taste-skill`, `huashu-design`, `web-accessibility`, `seo`).
   - **Built-in / vendor** (e.g. `frontend-design` by Anthropic) → already available; note it.
   - **No public / commercial source** (e.g. a paid mobile-design skill) → flag, cannot auto-install.
3. **Present a multi-select checklist** of the installable missing skills and ask which to install now. Run the install command only for the ones the user picks.
4. **MCP / tools:** the live check (step 7) needs a browser-automation CLI (e.g. `agent-browser`). If absent, say so and offer the install command; if declined, the pipeline still runs and clearly states the live visual check was NOT run.
5. Whatever stays missing → the pipeline **degrades gracefully**: skip that step, keep the rest, and say which steps were skipped for lack of a skill/tool.

Same philosophy as the final fix-checklist: dependencies explicit, user in control, nothing fails silently.

---

## Step 0.6 — Entry gate: grounded clarifiers before the pipeline runs

Before running the lenses, resolve what only the owner can answer — and **nothing the code can answer
for you**. Read the target (component/screen/page/email), its design doc, and the brief first; anything
verifiable by exploration is verified, not asked. Then surface the remaining high-impact decisions as a
**single multi-select batch**:

- Each question carries 2–4 candidate answers, **your recommended one first and marked "(recommended)"**,
  with the host's "other" field for the owner to add their own.
- Ask only what changes the review's direction — scope (which surface/state/breakpoint), intent (light
  fix vs. full redesign), brand/identity constraints, target audience, what's explicitly out of scope.
- A handful of questions, one batch — not an interrogation. In Claude Code use `AskUserQuestion`
  (≤4 questions, 2–4 options each). If no interactive prompt exists, state your assumed answers and proceed.

The answers steer the whole pipeline (which steps apply, how aggressive the changes are, what "good" means).

---

## The pipeline (fixed order: structure → audit → polish → a11y → live)

Run each step, **accumulating findings** (don't drop earlier ones). Cite file:line. If a skill is
not installed, say so and link its repo (Attribution) so the user can install it; continue with the rest.

0. **Reuse-first** — consult existing components (Storybook/design system) before designing. New
   reusable piece → put it in the design system with a story. *(Skip if no design system.)*
1. **Baseline structure** — visual hierarchy, information architecture, layout, cognitive load.
   Skills: `ui-ux-pro-max` (if installed) or `frontend-design`.
2. **Scored audit + anti-slop** — `impeccable`: 5-dimension scored audit; applies fixes. (Lead skill.)
3. **Second anti-slop lens** — `huashu-design`: independent 5-dimension critique; catches what (2) missed.
4. **Taste / transversal anti-slop** — `taste-skill`: em-dash ban, eyebrow restraint, fake numbers,
   consistency locks. (For dashboards, apply only its transversal rules.)
5. **Motion & polish** — `emil-design-eng`: purposeful animation, press feedback, transitions,
   skeletons, reduced-motion. Then **`review-animations`**: dedicated review of the animations
   (timing, easing, purpose, jank) — the critique counterpart to emil's application.
6. **Accessibility** — `web-design-guidelines` + an a11y skill (`web-accessibility`/`accessibility`):
   WCAG AA (contrast ≥ 4.5:1), keyboard, visible focus, roles/labels, reduced-motion.
6b. **SEO** *(PUBLIC targets only — skip for private/internal UI)* — semantic headings, meta/OG,
   structured data. Skill: `seo`.
7. **Live visual reality-check** — render the real target (Storybook and/or app route) in
   **light, dark, and mobile**; screenshot; verify it actually looks right end-to-end (real spacing,
   overflow, perceived contrast, motion). Tool: a browser-automation CLI such as **agent-browser**
   (deterministic, scriptable). Also run:
   - **Core Web Vitals** (LCP/CLS/INP/TTFB) — performance is a UX quality gate (agent-browser `vitals`).
   - **Visual regression** on redesigns/audits (`diff screenshot --baseline`).
   Run sequentially (one browser thread); never in parallel. *(Skip if no live browser; state it.)*

---

## Output — collect every finding, then let the user choose (interactive checklist)

After running the pipeline, **gather ALL findings from every skill** into one deduplicated list.
Each item: a one-line plain-language description, its **priority** (P1 broken/identity/a11y · P2
improvement · P3 polish), the **skill(s)** that flagged it (e.g. `[impeccable, huashu]`), and — when
there's more than one sensible way to resolve it — your **recommended fix first** plus the live
alternatives (so the choice isn't just fix / don't-fix, it's *how*).

Then **present them to the user as a multi-select checklist and ask which to fix, and how** — do NOT
silently auto-apply. Use your assistant's multi-select prompt (in Claude Code: `AskUserQuestion`
with `multiSelect: true`; its "Other" field lets the owner **add their own fix or dispute** a finding).
Recommended default: pre-select the P1 items and the recommended fix for each. Group by priority so the
list is scannable. Example shape:

```
Which findings should I fix? (multi-select · recommended fix pre-selected · "Other" = add yours / dispute)
  [x] P1 · Contrast 3.1:1 on primary button label — fails AA         [impeccable, web-accessibility]
        → rec: darken label to token `--fg-on-primary` (4.8:1) · alt: lighten button bg · alt: keep, waive
  [x] P1 · No visible focus ring on nav links                        [web-accessibility]
        → rec: add 2px token focus ring · alt: underline-on-focus
  [ ] P2 · CTA hierarchy: two competing primary buttons              [impeccable, huashu]
        → rec: demote the second to secondary · alt: merge into one · alt: keep (intentional)
  [ ] P3 · Hover transition 320ms feels sluggish                     [emil, review-animations]
        → rec: 150ms · alt: 200ms · alt: remove the transition
```

Apply **only the selected items, with the chosen fix**. For large lists, offer "select all P1",
"all P1+P2", or per-item. If the environment has no interactive prompt, fall back to: apply P1 with the
recommended fix, list P2/P3 for the user to pick later.

**Informed re-pass.** After the owner decides, **re-run only the pipeline steps the chosen fixes touch**
(e.g. a contrast change re-checks a11y + the live visual step; a layout change re-checks structure +
live). This catches the seams the fixes open — the design counterpart of the grill's informed re-grill —
without re-running the whole pipeline. Surface any genuinely new finding in a short follow-up batch; don't
re-litigate settled items.

Then verify: typecheck (if code), design-token usage (no hardcoded color/spacing/type), brand/identity
consistency, and the closing screenshots (light/dark/mobile) + Core Web Vitals.

---

## Attribution (install these if missing)

This pipeline ORCHESTRATES skills authored by others. Install the missing ones from their source.
**Verify the URL before installing** — entries marked ⚠️ are best-effort and should be confirmed.

| Skill | Purpose | Author / source |
|---|---|---|
| `ui-ux-pro-max` | Baseline UX / structure (step 1) | https://ui-ux-pro-max-skill.nextlevelbuilder.io/ |
| `frontend-design` | Distinctive, non-generic baseline UI (step 1 fallback) | Anthropic |
| `impeccable` | Scored audit + anti-slop + live iteration | https://github.com/pbakaus/impeccable |
| `huashu-design` (花叔Design) | Hi-fi prototypes + anti-slop + 5-dim review | https://github.com/alchaincyf/huashu-design |
| `taste-skill` | Anti-slop / design taste | https://github.com/Leonxlnx/taste-skill |
| `emil-design-eng` | Motion/interaction polish | https://github.com/emilkowalski/skills |
| `review-animations` | Dedicated animation review (timing/easing/jank) | https://github.com/emilkowalski/skills |
| `web-design-guidelines` | Web Interface Guidelines (AA, keyboard, contrast) | Anthropic — Web Interface Guidelines |
| `web-accessibility` / `accessibility` | WCAG 2.2 audit | https://github.com/addyosmani/web-quality-skills |
| `seo` | Search visibility (public targets) | https://github.com/addyosmani/web-quality-skills |
| mobile design skill | Mobile/RN screens (mobile targets) | pick your own (e.g. Sleek — sleek.design, commercial) |

If a skill is missing and has no public source, the pipeline degrades gracefully: run the available
steps and note which lenses were skipped.

---

## Notes

- This is the portable core. Project-specific design law (brand tokens, product identity, density
  rules) lives in the project's own design doc — reference it, don't duplicate it here.
- Work in an isolated branch/worktree.
- The pipeline is a sequence, not a monolith: reorder or trim per project, but keep the live
  visual check last (it's the reality test the static skills can't give).
