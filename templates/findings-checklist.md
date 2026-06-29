# Findings checklist — template

Copy this template after running the design-review pipeline. Fill in the findings, present it to the user, and apply only the selected items.

---

## Pipeline run summary

**Target:** <!-- file path, route, or component name -->
**Date:** <!-- YYYY-MM-DD -->
**Stack:** <!-- framework, CSS method, design system -->

**Telos:** not "does it have defects?" but **"is it ALIVE and 2026 vs the references?"** A correct-but-flat
result is a **failed** run.

**Gates run (in order):**
- [ ] 0 — Frame the target
- [ ] 1 — **[GATE]** `audit-first` *(redesigns only)* — `.design-review/audit-first.md`
- [ ] 2 — **[GATE]** `reference-research` (Dribbble 2026 + competitors) — `.design-review/references.md`
- [ ] 3 — **[GATE]** 4 core skills, REAL invocation, in order:
  - [ ] 3a — `impeccable` (structure / audit)
  - [ ] 3b — `design-taste-frontend` (**anti-templated gate**)
  - [ ] 3c — `emil-design-eng` (**signature motion**)
  - [ ] 3d — `web-design-guidelines` (a11y AA)
- [ ] 4 — Apply fixes (multi-select)
- [ ] 5 — Informed re-pass
- [ ] 6 — **[GATE]** `vitality-verdict` (alive / templated / flat) — `.design-review/verdict.json`
- [ ] 7 — **[GATE]** Vitality loop *(until verdict is `alive`, max N rounds)*

**Add-ons (opt-in):** `huashu-design` · `review-animations` · `seo` *(public only)* ·
`web-accessibility` · mobile-design skill.

**Steps skipped:** <!-- list each skipped step and reason, e.g. "seo — private/authenticated target" -->

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
- [ ] **Vitality verdict reads `alive`** (see `templates/vitality-verdict.md` / `.design-review/verdict.json`) — otherwise the run **failed**

**Final verdict:** <!-- alive / templated / flat --> · **judged against:** <!-- reference -->

**Notes:** <!-- deferred items, follow-up tasks, blockers -->

---

## Skills not installed

| Skill | Step | Install |
|-------|------|---------|
| <!-- skill name --> | <!-- step # --> | See references/attribution.md |

---

Back to [design-review](../README.md)
