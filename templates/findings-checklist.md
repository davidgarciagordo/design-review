# Findings checklist — template

Copy this template after running the design-review pipeline. Fill in the findings, present it to the user, and apply only the selected items.

---

## Pipeline run summary

**Target:** <!-- file path, route, or component name -->
**Date:** <!-- YYYY-MM-DD -->
**Stack:** <!-- framework, CSS method, design system -->

**Steps run:**
- [ ] 0 — Capability detection
- [ ] 0b — Reuse-first *(skip if no design system)*
- [ ] 1 — Baseline structure (`ui-ux-pro-max` / `frontend-design`)
- [ ] 2 — Scored audit (`impeccable`)
- [ ] 3 — Second anti-slop lens (`huashu-design`)
- [ ] 4 — Taste / transversal (`taste-skill`)
- [ ] 5 — Motion & polish (`emil-design-eng` + `review-animations`)
- [ ] 6 — Accessibility (`web-design-guidelines` + `web-accessibility`)
- [ ] 6b — SEO (`seo`) *(public targets only)*
- [ ] 7 — Live visual check (`agent-browser`)

**Steps skipped:** <!-- list each skipped step and reason, e.g. "6b SEO — private/authenticated target" -->

---

## Findings (multi-select)

Present this list to the user. Pre-select P1 items. Apply only what the user selects.

### P1 — Broken / identity / accessibility

Items that fail a published standard (WCAG AA, heading structure, keyboard access) or break visual identity. Fix these first.

- [ ] <!-- one-line plain-language description -->  `[skill]`
- [ ] <!-- one-line plain-language description -->  `[skill, skill]`
- [ ] <!-- one-line plain-language description -->  `[skill]`

### P2 — Improvements

Items that degrade usability, clarity, or performance but do not fail a standard outright.

- [ ] <!-- one-line plain-language description -->  `[skill]`
- [ ] <!-- one-line plain-language description -->  `[skill]`
- [ ] <!-- one-line plain-language description -->  `[skill]`

### P3 — Polish

Refinements that elevate the experience: timing, copy tone, subtle spacing corrections.

- [ ] <!-- one-line plain-language description -->  `[skill]`
- [ ] <!-- one-line plain-language description -->  `[skill]`
- [ ] <!-- one-line plain-language description -->  `[skill]`

---

## Quick-select shortcuts (for lists with more than 6 items)

- **Select all P1** — apply all items in the P1 section
- **Select all P1 + P2** — apply P1 and P2 sections
- **Select all** — apply everything
- **Per-item** — user selects manually (default)

---

## Applied items

Record what was selected and applied here, for closing verification.

| Finding | Priority | Skills | Status |
|---------|----------|--------|--------|
| <!-- description --> | P1 | <!-- skill --> | Applied |
| <!-- description --> | P2 | <!-- skill --> | Applied |

---

## Closing verification

- [ ] Typecheck passes (`tsc --noEmit` or equivalent)
- [ ] No hardcoded color / spacing / typography values introduced by the fixes
- [ ] Brand and identity consistency confirmed
- [ ] Screenshot — light mode
- [ ] Screenshot — dark mode
- [ ] Screenshot — mobile (375px)
- [ ] Core Web Vitals: LCP <= 2.5s / CLS <= 0.1 / INP <= 200ms
- [ ] Visual regression diff against baseline *(redesigns and audits only)*

**Notes:** <!-- deferred items, follow-up tasks, blockers -->

---

## Skills not installed

| Skill | Step | Install |
|-------|------|---------|
| <!-- skill name --> | <!-- step # --> | See references/attribution.md |

---

Back to [design-review](../README.md)
