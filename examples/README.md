**English** | [Español](README.es.md)

# design-review — Usage Examples

> Concrete worked examples showing the gated pipeline in action: reference research, the 4 core lenses loaded via the Skill tool, the anti-templated gate failing and recovering, and an explicit vitality verdict.

These are realistic examples — not synthetic. Each shows the target, which steps ran (and which were skipped), what each lens found, the checklist presented, what was applied, and the final vitality verdict judged against the live references.

---

## How to invoke

**Short** — let the pipeline detect capabilities and run:

```
/design-review apps/web/app/settings/page.tsx
```

**Structured** — provide context upfront to skip detection questions:

```
/design-review apps/web/app/settings/page.tsx

Target: account settings page (authenticated — private)
Stack: Next.js App Router, Tailwind CSS, @acme/design-system tokens
Storybook: available at localhost:6006
Live browser: available (dev server on port 3000)
```

Both work. The structured form gives the pipeline everything it needs to skip detection and go straight to step 1.

---

## One prompt for all, or one core lens standalone

`/design-review` is the **one prompt for all** — it runs every applicable lens in order, merges findings into a single checklist, and ends with a vitality verdict. Each of the 4 core lenses is independent and can be invoked on its own when you only want that lens:

| Want only… | Invoke standalone |
|---|---|
| Structure / hierarchy / IA / scored audit | `impeccable` |
| Anti-slop + anti-templated gate | `design-taste-frontend` (a.k.a. `taste-skill`) |
| Signature motion + polish | `emil-design-eng` |
| Accessibility (WCAG AA) | `web-design-guidelines` |
| Real-product references (gallery + tokens) *(wired)* | `refero` (via agent-browser or MCP) |
| Authoring: token-plan + signature + UX-writing *(wired, folded into plan)* | `frontend-design` |
| Motion Block/Approve gate *(wired)* | `review-animations` |
| 2nd anti-slop lens *(add-on)* | `huashu-design` |
| SEO *(add-on, public pages only)* | `seo` |

```
# one core lens standalone
Run impeccable on apps/web/app/settings/page.tsx — scored audit only, no other steps.

# everything, orchestrated, one checklist, one vitality verdict
/design-review apps/web/app/settings/page.tsx
```

Each core lens is by its original author (see *Attribution* in the main README). The pipeline only sequences them — it does not paraphrase them. Missing one? Step 0 offers to install it.

---

## Example 1 — Settings page (authenticated web app)

**Target:** `apps/web/app/settings/page.tsx` — a multi-section settings page (profile, notifications, billing) in an authenticated Next.js app.

**Stack:** Next.js App Router, Tailwind CSS with design system tokens, Storybook available, dev server running.

### Step 0 — Preflight & frame

**Preflight** (`node scripts/preflight.mjs --write`):

```
✓ impeccable            present (~/.claude/skills/impeccable)
✓ design-taste-frontend present (autoskills)
✓ emil-design-eng       present (autoskills)
✓ web-design-guidelines present (Claude Code default)
✓ ui-ux-pro-max         present (plugin)
✓ review-animations     present (autoskills)
✓ frontend-design       present (marketplace)
✗ refero                missing — install: Refero MCP (npx refero-mcp) or default to agent-browser
✗ huashu-design         missing — install: git clone https://github.com/alchaincyf/huashu-design ~/.claude/skills/huashu-design
✓ agent-browser         present (Claude Code built-in)
```

[AskUserQuestion — one batch for all missing]:
- `refero`: install Refero MCP now, or skip? → **skip**
- `huashu-design`: install now, or skip? → **skip**

SKIPPED `refero` → reference-research degrades to agent-browser over refero.design (no DESIGN.md token specs).
SKIPPED `huashu-design` → asset-integrity brand-spec + Playwright verify unavailable; verdict uses agent-browser screenshots only.

**Frame:**

```
Design system: yes (packages/design-system — tokens at design-system/tokens.ts)
Storybook: yes (localhost:6006)
Platform: web
Target visibility: private/authenticated → SEO add-on SKIPPED
Live browser: yes (dev server at localhost:3000)
Type: redesign of existing surface → audit-first RUNS
```

**Surface routing:** authenticated multi-section settings page → **dashboard/dense** regime. Primary lens: impeccable + density rules (huashu SKIPPED → density via impeccable). Taste's landing-only rules relax.

### Step 1 — audit-first [GATE · redesigns only]

Agent `design-audit-first` renders the current settings page (light/dark/mobile) and writes `.design-review/audit-first.md`:

**Keep:** the three-section structure (Profile / Notifications / Billing) is a recognized mental model; the teal left-border on the active nav item reads as "on-brand". **Attack:** equal visual weight across all three sections; save button per section (three competing primaries); heading markup broken; flat density with no bento rhythm.

### Step 2 — reference-research [GATE · always · the #1 lever against flat]

Agent `design-reference-research` opens `dribbble.com/shots/popular/web-design` (2026 popular), three competitor settings pages (Linear, Vercel dashboard, Notion settings) via `agent-browser`, **`refero`** (gallery via agent-browser over refero.design — MCP SKIPPED; real shipped products: Mercury, Vercel, Linear listed there), and uses **`ui-ux-pro-max` vocabulary** to name styles/palettes/font-pairings precisely. It extracts 5 concrete patterns and writes `.design-review/references.md`:

1. **[layout]** Two-column: sticky sidebar nav + content pane — Linear. Eliminates repetitive section headings.
2. **[density]** Asymmetric bento within each section — tighter data rows, airier headings — Vercel dashboard.
3. **[motion]** Staggered section entrance on first load (100ms stagger per section) — Dribbble shot #1.
4. **[type]** Display numerals for billing usage stats (plan usage %, seats used) — Notion billing.
5. **[color]** Teal left-border on active nav item graduates to a teal-tinted section background — unique to this product.

**Bar for this target:** *"The page reads as a Plexum product settings surface, not a generic shadcn template — bento density, staggered sections, and the teal identity marker land."*

### Step 2b — Plan (authoring · folds in `frontend-design`)

Appended to `.design-review/references.md`:

**Token-plan (4-hex, subordinate to `packages/design-system` tokens — those win):**
- Accent fill: `#0f7e74` (teal-700 — DS `color-brand-primary`)
- Surface brand-subtle: `#f0faf9` (6% teal tint — DS `surface-brand-subtle`)
- Text emphasis: `#111827` (DS `text-primary`)
- Separator/muted: `#e5e7eb` (DS `border-subtle`)

**Typographic roles (2+):** display numerals for billing stats (`font-variant-numeric: tabular-nums`); body readable (14px / 1.5 — corrects the 3a finding).

**Signature element:** teal-tinted active-section background graduating from the left-border nav marker — the one detail that could only be this product.

**3 AI-default looks to avoid:** (1) uniform card grid with identical shadow/radius on every section; (2) centered full-width form with excessive blank space; (3) muted gray palette + blue accent (generic SaaS default).

**UX-writing checklist:** ✓ no redundant placeholder text · ✓ toggle state self-describes (no "Enabled/Disabled" label) · ✓ single CTA per view · ✓ section headings sentence-case.

### Step 3a — lens: impeccable [GATE]

Agent `design-lens-impeccable` **loads the `impeccable` skill via the Skill tool** and passes it the target + the step-2 references.

Findings:
- Typography score 6/10. Body text 13px on white — below comfortable reading threshold.
- Spacing score 5/10. Sections share equal 24px padding, only 8px between them — compressed, undifferentiated rhythm.
- Contrast score 4/10. Secondary text `#9ca3af` on white = 2.85:1 — fails WCAG AA for normal text.
- CTA score 5/10. Three identical "Save changes" primaries on one scroll view. (Also flagged: correct-but-generic structure — feeds 3b.)
- Layout score 7/10. Single-column adequate; no overflow at tested widths.

### Step 3b — lens: design-taste-frontend [GATE — anti-templated]

Agent `design-lens-taste` **loads the `design-taste-frontend` skill via the Skill tool** and passes it the target + the step-2 references.

**Anti-templated gate: FAILED.** The current surface is a default stacked-section layout — equal-weight sections, a save button per section, no house layer, no point of view. It could be any SaaS settings page. The skill's gate rejects it with verdict `TEMPLATED` and names the 2 moves from step 2 that would make it singular:

- Apply the two-column sidebar + bento density (references #1 and #2).
- Graduate the teal left-border to a teal-tinted section background (reference #5).

These are **P1 vitality findings**, pre-selected. The run does not continue without them.

Additional findings:
- Section heading "BILLING INFORMATION" in all-caps — reads as shouting; title case.
- Placeholder "Enter your full name here" — redundant with label; shorten to "Jane Smith".
- "Enabled / Disabled" text beside each toggle — the toggle state already communicates this; remove.

### Step 3c — lens: emil-design-eng + `review-animations` gate [GATE — signature motion]

Agent `design-lens-motion` **loads the `emil-design-eng` skill via the Skill tool** and passes it the target + the step-2 references.

**Signature motion (P1 vitality finding):** reference #3 calls for a staggered entrance of the three content sections on first load — 100ms stagger, `ease-out`, content slides up 12px and fades in. This is a **memorable moment tied to the reference**; hover-only is not sufficient. Pre-selected.

Hygiene findings:
- Save button has no press/loading state — 800ms silence after click.
- Toggles snap instant between on/off — add 200ms `ease` transition.
- No `prefers-reduced-motion` guard on the staggered entrance.

**`review-animations` motion gate** (runs here — Block/Approve against `STANDARDS.md`): staggered entrance evaluated — duration 400ms max, easing `ease-out`, `prefers-reduced-motion` guard missing. Gate: **APPROVE** (100ms stagger within standards; guard will be added in step 5 — the missing guard is already a P1 a11y finding). Feeds verdict in step 6.

### Step 3d — lens: web-design-guidelines [GATE — accessibility]

Agent `design-lens-a11y` **loads the `web-design-guidelines` skill via the Skill tool** and passes it the target + the step-2 references.

Findings (every WCAG A/AA failure is P1):
- Secondary text contrast 2.85:1 — fails AA (confirmed from 3a).
- Section titles are `<div>` with bold class, not `<h2>` — heading structure broken; screen readers cannot navigate by heading.
- Notification toggles are `<div>` with click handlers, not `<button role="switch">` — not keyboard accessible.
- `prefers-reduced-motion` not honored by the new staggered entrance (the motion lens already flagged this — merged item, both tags).
- No `aria-describedby` on inputs — screen readers announce label only, not helper text.

### Step 4 — Checklist presented to user

```
Which findings should I fix?  (multi-select · vitality items pre-selected)

P1 — Broken / identity / vitality
  [x] Anti-templated gate FAILED: stacked-section default layout, no house layer — apply sidebar+bento+teal bg  [design-taste-frontend]
  [x] No signature motion: staggered section entrance (100ms stagger, ease-out, 12px slide) from reference #3  [emil-design-eng]
  [x] Secondary text contrast 2.85:1 — fails WCAG AA (#9ca3af on white)                                        [impeccable, web-design-guidelines]
  [x] Section titles are <div>, not <h2> — heading structure broken                                             [impeccable, web-design-guidelines]
  [x] Notification toggles not keyboard accessible (missing role="switch")                                      [web-design-guidelines]
  [x] prefers-reduced-motion not honored by staggered entrance                                                  [emil-design-eng, web-design-guidelines]

P2 — Improvements
  [ ] Three competing "Save changes" primaries on one page                                                      [impeccable]
  [ ] Body text 13px — below comfortable reading threshold (target: 14–16px)                                    [impeccable]
  [ ] Save button needs loading/confirmation state (800ms silence after click)                                  [emil-design-eng]
  [ ] Toggles snap instant — add 200ms ease transition                                                          [emil-design-eng]

P3 — Polish
  [ ] Section heading "BILLING INFORMATION" — use title case                                                    [design-taste-frontend]
  [ ] Placeholder "Enter your full name here" — redundant; shorten                                              [design-taste-frontend]
  [ ] Toggle enabled/disabled text labels are noise — remove                                                    [design-taste-frontend]
```

**User selected:** all P1 + "Three competing Save buttons" (P2) + "Save button loading state" (P2).

### Step 5 — Informed re-pass

Layout changed (3a re-run) + motion added (3c re-run) + a11y re-checked for the new structure (3d re-run). `prefers-reduced-motion` guard added to the staggered entrance (fixes the P1 a11y finding; `review-animations` gate remains APPROVE). New finding: the teal-tinted section background introduces a color that references no DS token — swapped to `surface-brand-subtle` (existing token, 6% teal tint).

### Step 6 — vitality-verdict [GATE]

Agent `design-vitality-verdict` renders the updated page live in light, dark, and mobile via `agent-browser`. It diffs the result against `.design-review/references.md`:

- Sidebar nav + bento density: **landed** — reference #1 and #2 patterns present.
- Teal-tinted active section background: **landed** — reference #5 applied via DS token.
- Staggered section entrance: **landed** — sections slide in at 100ms stagger; `prefers-reduced-motion` disables it.
- Display numerals for billing usage: **not yet applied** (not in selected fixes) — noted, not blocking.
- Motion moment fires? **Yes** — entrance fires on first load, transitions off on second load (cached).

Core Web Vitals: LCP 1.3s / CLS 0.02 / INP 58ms — all green.

Reinforced by: **taste §14 pre-flight** (mechanical binary checks — all pass: no all-caps headings, no redundant placeholders, toggle self-describes); **`review-animations`** Block/Approve: **APPROVE** (staggered entrance within STANDARDS.md, reduced-motion guard applied); **`huashu-design` Playwright verify**: SKIPPED (not installed) — agent-browser screenshots used instead.

**Verdict written to `.design-review/verdict.json`:**

```
Vitality verdict:  templated → (loop) → alive
  judged against .design-review/references.md
  bento density + teal identity layer + staggered entrance landed
```

### Step 7 — Vitality loop

Not needed — verdict is `alive` on first loop.

### Closing verification

Screenshots (light/dark/mobile) confirmed: sidebar nav renders; bento rhythm visible; staggered entrance fires; secondary text readable; heading structure in browser accessibility tree; toggles keyboard accessible; single primary CTA at section footer.

---

## Example 2 — Primary CTA button (component-level review)

**Target:** `packages/design-system/src/components/Button/Button.tsx` — the `Button` component, specifically the `variant="primary"` style.

**Stack:** React, Tailwind CSS, design system tokens, Storybook at localhost:6006.

**Target visibility:** component (not a page) — SEO add-on SKIPPED. Live browser via Storybook.

### Step 0 — Preflight & frame

**Preflight** (`node scripts/preflight.mjs --write`): all core components present (impeccable, design-taste-frontend, emil-design-eng, web-design-guidelines, review-animations, frontend-design, agent-browser, ui-ux-pro-max). `refero` MCP not configured → SKIPPED `refero` → reference-research via agent-browser over refero.design only (no DESIGN.md token specs). `huashu-design`: SKIPPED — Playwright verify unavailable. No `AskUserQuestion` batch needed (no installs chosen).

**Frame:**

```
Design system: yes (this IS the design system component)
Storybook: yes (localhost:6006 — Button.stories.tsx exists)
Platform: web
Target visibility: component / internal → SEO add-on SKIPPED
Live browser: Storybook
Type: redesign of existing component → audit-first RUNS
```

**Surface routing:** DS component (not a page, not a landing) → **standard** regime. Taste's landing-only rules relax; this is a component review, not a page-level density audit.

### Step 1 — audit-first [GATE · redesigns only]

Agent `design-audit-first` renders the Button stories (default / hover / focus / disabled) and writes `.design-review/audit-first.md`:

**Keep:** teal `#0f7e74` brand color — unmistakably Plexum; white label on teal passes AA; rounded-md radius is consistent with the form-field family. **Attack:** no press/active state visible; focus ring invisible on teal; no loading state; hover transition is 0ms; no disabled variant in stories.

### Step 2 — reference-research [GATE · always · the #1 lever against flat]

Agent `design-reference-research` opens `dribbble.com/shots/popular/web-design` (2026 popular), three competitor primary buttons (Stripe Checkout, Linear, Vercel Deploy) via `agent-browser`, **`refero`** (gallery via agent-browser over refero.design — MCP SKIPPED; real shipped button components from Stripe, Linear, Vercel listed there), and uses **`ui-ux-pro-max` vocabulary** to name motion styles and color semantics precisely. It extracts 4 patterns and writes `.design-review/references.md`:

1. **[motion]** Micro-spring press: `scale(0.96)` + shadow collapse in 80ms `cubic-bezier(0.34, 1.56, 0.64, 1)` — Stripe.
2. **[motion]** Brand ripple on click: a circular teal wave expands from the click point and fades in 350ms — Dribbble shot #2.
3. **[type/color]** Loading state replaces label text with a spinner + "Loading…" that inherits button color — Linear.
4. **[color]** Focus ring is white with a 2px gap (offset) regardless of button background — Vercel.

**Bar for this target:** *"The button's press and load moments feel unmistakably Plexum — the teal ripple on click is the signature; hover hygiene alone is not alive."*

### Step 2b — Plan (authoring · folds in `frontend-design`)

Appended to `.design-review/references.md`:

**Token-plan (3-hex, subordinate to `packages/design-system` tokens — those win):**
- Brand fill: `#0f7e74` (teal-700 — DS `color-brand-primary`)
- Brand-dark (hover): `#0a5e56` (DS `color-brand-primary-dark`)
- Focus ring: `#ffffff` (white — universal, works over any button color variant)

**Typographic roles (2+):** button label (14px / medium / slight letter-spacing for CTAs); loading text (visually hidden, SR-only via `sr-only`).

**Signature element:** teal radial ripple from pointer position on click — the one motion moment that makes this unmistakably a Plexum button, not a React default.

**3 AI-default looks to avoid:** (1) solid fill + white text with only hover darken (generic shadcn default); (2) outline-only variant as the primary (under-weighted); (3) border-radius so large it becomes a pill on short labels (trendy but brand-less).

**UX-writing checklist:** ✓ button label is a verb ("Save", "Deploy") · ✓ loading text screen-reader-announced · ✓ no tooltip needed on disabled (action self-explains).

### Step 3a — lens: impeccable [GATE]

Agent `design-lens-impeccable` **loads the `impeccable` skill via the Skill tool** and passes it the target + the step-2 references.

Findings:
- Contrast (primary): teal `#0f7e74` background with white label = 4.61:1 — passes AA (barely).
- Hover state: background darkens to `#0a5e56` — correct, but transition is 0ms (instant).
- Active/pressed state: no visual change beyond the hover state — press moment invisible.
- Focus ring: `outline: 2px solid #0f7e74` on teal background — near-invisible (also flagged: correct-but-generic, feeds 3b).
- No `disabled` variant in stories — untested state.

### Step 3b — lens: design-taste-frontend [GATE — anti-templated]

Agent `design-lens-taste` **loads the `design-taste-frontend` skill via the Skill tool** and passes it the target + the step-2 references.

**Anti-templated gate: FAILED.** The current button is an unmodified default implementation — `rounded-md`, `px-4 py-2`, 0ms hover, no brand motion moment, no press feedback. It is a generic shadcn/Tailwind button with a teal hex. The gate rejects it with verdict `TEMPLATED` and names the 1 move that makes it singular:

- Add the teal ripple on click (reference #2) — this is the one motion that could only be a Plexum button.

This is a **P1 vitality finding**, pre-selected.

Additional findings (no text content on a button component, so copy rules do not apply):
- Consistency risk: no `size` variants beyond default — consumers are likely hardcoding overrides, drifting from the design system.

### Step 3c — lens: emil-design-eng + `review-animations` gate [GATE — signature motion]

Agent `design-lens-motion` **loads the `emil-design-eng` skill via the Skill tool** and passes it the target + the step-2 references.

**Signature motion (P1 vitality finding):** the teal ripple on click (reference #2) — a `radial-gradient` or `clip-path circle` expands from the pointer position and fades in 350ms. This is the **memorable moment**; it is what makes the button feel like a Plexum button rather than a React component. Pre-selected.

Hygiene findings:
- Hover transition 0ms — add `transition-colors duration-150 ease-out`.
- Active/press: add micro-spring `scale(0.97)` at 80ms (`cubic-bezier(0.34, 1.56, 0.64, 1)`) — reference #1.
- No loading state — button goes silent during async actions.
- No `prefers-reduced-motion` guard on the ripple.

**`review-animations` motion gate** (runs here — Block/Approve against `STANDARDS.md`): teal ripple evaluated — 350ms fade, easing acceptable, but `prefers-reduced-motion` guard missing. Gate: **BLOCK** (missing reduced-motion guard). The guard must be added before the verdict can reach `alive`. Feeds verdict in step 6.

### Step 3d — lens: web-design-guidelines [GATE — accessibility]

Agent `design-lens-a11y` **loads the `web-design-guidelines` skill via the Skill tool** and passes it the target + the step-2 references.

Findings (every WCAG A/AA failure is P1):
- Focus ring near-invisible on teal background — change to `outline: 2px solid white; outline-offset: 2px` (reference #4). P1.
- `disabled` variant missing — consumers cannot render a disabled primary button correctly; needs `aria-disabled` + muted visual state.
- Loading state (when added) must announce to screen readers: `aria-busy="true"` + visually hidden "Loading…" text.
- Ripple animation must respect `prefers-reduced-motion` — collapse to an instant opacity fade if so (motion lens already flagged; merged item).

### Step 4 — Checklist presented to user

```
Which findings should I fix?  (multi-select · vitality items pre-selected)

P1 — Broken / identity / vitality
  [x] Anti-templated gate FAILED: generic default button, no brand motion — add teal ripple on click (ref #2)  [design-taste-frontend]
  [x] No signature motion: teal radial ripple from click point, 350ms fade (reference #2)                      [emil-design-eng]
  [x] Focus ring near-invisible on teal background — outline: 2px solid white; outline-offset: 2px (ref #4)   [impeccable, web-design-guidelines]
  [x] No disabled variant — consumers cannot render a disabled primary button correctly                        [impeccable, web-design-guidelines]
  [x] prefers-reduced-motion not honored by ripple                                                             [emil-design-eng, web-design-guidelines]

P2 — Improvements
  [ ] Hover transition 0ms — add duration-150 ease-out                                                         [emil-design-eng]
  [ ] No active/press state — add scale(0.97) micro-spring at 80ms (reference #1)                             [impeccable, emil-design-eng]
  [ ] No loading state — button goes silent during async actions (reference #3)                                [emil-design-eng]
  [ ] No size variants — consumers hardcoding overrides; add sm/md/lg                                          [design-taste-frontend]

P3 — Polish
  [ ] Border-radius: rounded-md → rounded-lg for a slightly softer primary feel                                [impeccable]
```

**User selected:** all P1 + hover transition (P2) + press state (P2) + loading state (P2).

### Step 5 — Informed re-pass

Motion added (3c re-run) + a11y re-checked for ripple + loading (3d re-run). `prefers-reduced-motion` guard added to the ripple (collapses to instant opacity fade) — `review-animations` gate cleared (BLOCK → APPROVE). New finding: the loading spinner SVG uses a hardcoded `stroke="#ffffff"` — replaced with `currentColor` so it inherits label color, which in a future `variant="secondary"` would be correct automatically.

### Step 6 — vitality-verdict [GATE]

Agent `design-vitality-verdict` renders the Button stories live via `agent-browser` — all states: default / hover / active / focused / disabled / loading — in light and dark mode.

Diff against `.design-review/references.md`:
- Teal ripple on click: **landed** — fires from pointer position, 350ms fade, `prefers-reduced-motion` collapses it to instant opacity.
- Micro-spring press: **landed** — `scale(0.97)` at 80ms spring easing.
- White focus ring with offset: **landed** — reference #4 applied; visible on teal and on any future color variant.
- Loading state: **landed** — spinner + "Loading" visually hidden text + `aria-busy`.
- Disabled variant: **landed** — muted background, `cursor-not-allowed`, `aria-disabled="true"`, story added.

Core Web Vitals: N/A — component, not a page. Storybook render time 110ms.

Reinforced by: **taste §14 pre-flight** (mechanical binary checks — pass: label is a verb, no redundant copy); **`review-animations`** Block/Approve: **APPROVE** (reduced-motion guard applied in step 5; ripple collapses to instant opacity fade — within STANDARDS.md); **`huashu-design` Playwright verify**: SKIPPED (not installed) — Storybook story renders used instead.

**Verdict written to `.design-review/verdict.json`:**

```
Vitality verdict:  templated → (loop) → alive
  judged against .design-review/references.md
  teal ripple (signature moment) + white focus ring + loading state landed
```

### Step 7 — Vitality loop

Not needed — verdict is `alive` on first loop.

### Closing verification (Storybook)

Screenshots of: default / hover / active / focused / disabled / loading — in light and dark mode. All states render correctly. Keyboard navigation confirmed: Tab to focus → white ring visible → Enter triggers action → loading state visible → `aria-busy` announced.

---

## Summary

| # | Target | Type | Skipped steps | Verdict |
|---|--------|------|--------------|---------|
| 1 | Settings page | Authenticated page | SEO | `templated` → `alive` (1 loop) |
| 2 | Primary Button component | DS component | SEO | `templated` → `alive` (1 loop) |

→ Back to [design-review](../README.md)
