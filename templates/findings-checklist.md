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
- [ ] 0 — **Preflight** (`scripts/preflight.mjs`: declare components → ASK to install missing → install
  chosen + reload → record skips EXPLICITLY) & **frame** & **surface routing** (landing/dashboard/non-web)
  & context setup (PRODUCT.md/DESIGN.md for impeccable)
- [ ] 1 — **[GATE]** `audit-first` *(redesigns only)* — `.design-review/audit-first.md`
- [ ] 2 — **[GATE]** `reference-research` (Dribbble 2026 + **`refero`** real shipped products + competitors
  + `ui-ux-pro-max` vocabulary) + **asset-integrity** (`huashu` brand-spec, if a brand is named) —
  `.design-review/references.md`
- [ ] 2b — **Plan** (folds in `frontend-design`: 4–6 hex token-plan + signature element + "3 AI-defaults to
  avoid" + UX-writing)
- [ ] 3 — **[GATE]** DIAGNOSIS: CORE skills ROUTED, in order, accumulating into a single `[skill]`-tagged list:
  - [ ] 3a — `impeccable audit` + `critique` (structure / scored audit)
  - [ ] 3b — `design-taste-frontend` §11 redesign-audit + §14 (**anti-templated gate**)
  - [ ] 3c — `emil-design-eng` review, concrete question inline (**signature motion**) + `review-animations`
    Block/Approve gate *(if present)*
  - [ ] 3d — WebFetch guidelines → cache → `web-design-guidelines` (a11y AA · last lens)
  - [ ] 3e — `ui-ux-pro-max` UX guidelines lens (+ opt-in add-ons)
- [ ] 4 — **ASK** — multi-select checklist (P1 + anti-templated + signature-motion PRE-MARKED)
- [ ] 5 — **APPLY (FIX)** — routing to owning fix command per suite→phase mapping + informed re-pass
- [ ] 6 — **[GATE]** `vitality-verdict` (alive / templated / flat) reinforced by `review-animations` +
  taste §14 + `huashu` Playwright — `.design-review/verdict.json`
- [ ] 7 — **[GATE]** Vitality loop *(until verdict is `alive`, max N rounds)*

**Wired:** `ui-ux-pro-max` · `refero` · `frontend-design` (folded into plan) · `review-animations`.
**Add-ons (opt-in):** `huashu-design` *(also asset-integrity + Playwright verify)* · `seo` *(public only)* ·
`web-accessibility` · mobile-design skill.

**Steps skipped:** <!-- list each skipped step and reason, e.g. "seo — private/authenticated target" -->

---

## Findings (multi-select)

Present this list to the user. Pre-select P1 items **and** anti-templated + signature-motion vitality
items. Apply only what the user selects.

### P1 — Broken / identity / accessibility

Items that fail a published standard (WCAG AA, heading structure, keyboard access) or break visual
identity, or that are the reason the target was flat (anti-templated gate fail, missing signature motion).
Fix these first.

- [ ] <!-- one-line plain-language description -->  `[skill]`  *(owning fix command: <!-- e.g. impeccable harden -->)*
- [ ] <!-- one-line plain-language description -->  `[skill, skill]`  *(owning fix command: <!-- ... -->)*
- [ ] <!-- one-line plain-language description -->  `[skill]`  *(owning fix command: <!-- ... -->)*

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

| Finding | Priority | Skills | Owning fix command | Status |
|---------|----------|--------|--------------------|--------|
| <!-- description --> | P1 | <!-- skill --> | <!-- e.g. impeccable harden --> | Applied |
| <!-- description --> | P2 | <!-- skill --> | <!-- e.g. taste §11.D --> | Applied |

---

## Closing verification

- [ ] Typecheck passes (`tsc --noEmit` or equivalent)
- [ ] No hardcoded color / spacing / typography values introduced by the fixes (token variables only)
- [ ] Brand and identity consistency confirmed (house layer present)
- [ ] Screenshot — light mode
- [ ] Screenshot — dark mode
- [ ] Screenshot — mobile (375px)
- [ ] Core Web Vitals: LCP <= 2.5s / CLS <= 0.1 / INP <= 200ms
- [ ] Visual regression diff against baseline *(redesigns and audits only)*
- [ ] **Vitality verdict reads `alive`** (see `templates/vitality-verdict.md` / `.design-review/verdict.json`) — otherwise the run **failed**

**Final verdict:** <!-- alive / templated / flat --> · **judged against:** <!-- reference -->

**Notes:** <!-- deferred items, follow-up tasks, blockers -->

---

## Skills not installed / skipped

| Skill | Step | Install | Impact if skipped |
|-------|------|---------|-------------------|
| <!-- skill name --> | <!-- step # --> | See references/attribution.md | <!-- e.g. motion critique not run --> |

---

Back to [design-review](../README.md)
