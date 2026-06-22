---
name: design-review
description: Domain-agnostic design review/improvement pipeline. Runs design skills IN ORDER over a target (component, screen, page, email), accumulates findings, produces a prioritized P1/P2/P3 list, auto-applies P1, and closes with a LIVE visual check (agent-browser). Adapts to the project's capabilities (Storybook? design system? public or private? web or mobile?). Trigger: "improve design", "design review", "run the design skills", "/design-review <target>".
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

## Output (required format)

One **consolidated, prioritized, plain-language list**, tagging which skill(s) flagged each finding:
- **P1** (broken / identity / a11y / critical) → **auto-apply** in this pass.
- **P2 / P3** (improvement / invasive) → **ask before applying**.

Then verify: typecheck (if code), design-token usage (no hardcoded color/spacing/type), brand/identity
consistency, and the closing screenshots (light/dark/mobile).

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
