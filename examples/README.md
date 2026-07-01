**English** | [Español](README.es.md)

# design-review — Usage Examples

> Concrete worked examples showing the gated pipeline in action: preflight, reference research, context-pack (discover-once), the 4 core lenses loaded READ-ONLY via the Skill tool, the anti-templated gate failing and recovering, and an explicit vitality verdict.

These are realistic examples — not synthetic. Each shows the target, which steps ran (and which were skipped), what each lens found (terse), the checklist presented, what was applied, and the final vitality verdict judged against the live references.

---

## How to invoke

**Short** — let the pipeline detect capabilities and run:

```
/design-review:run apps/web/app/settings/page.tsx
```

**Structured** — provide context upfront to skip detection questions:

```
/design-review:run apps/web/app/settings/page.tsx

Target: account settings page (authenticated — private)
Stack: Next.js App Router, Tailwind CSS, @acme/design-system tokens
Storybook: available at localhost:6006
Live browser: available (dev server on port 3000)
```

Both work. The structured form gives the pipeline everything it needs to skip detection and go straight to step 1.

---

## One prompt for all, or one core lens standalone

`/design-review:run` (or the auto-triggered `design-review:design-review` skill) is the **one prompt for all** — it runs every applicable lens in order, merges findings into a single checklist, and ends with a vitality verdict. Each of the 4 core lenses is independent and can be invoked on its own when you only want that lens:

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
/design-review:run apps/web/app/settings/page.tsx
```

Each core lens is by its original author (see *Attribution* in the main README). The pipeline only sequences them — it does not paraphrase them. Missing one? Step 0 offers to install it.

---

## Example 1 — Settings page (authenticated web app)

**Target:** `apps/web/app/settings/page.tsx` — a multi-section settings page (profile, notifications, billing) in an authenticated Next.js app.

**Stack:** Next.js App Router, Tailwind CSS with design system tokens, Storybook available, dev server running.

### Step 0 — Preflight & frame

**Preflight** (`node "${CLAUDE_PLUGIN_ROOT}/scripts/preflight.mjs" --write`):

```
✓ impeccable            present (~/.claude/skills/impeccable)
✓ design-taste-frontend present (autoskills)
✓ emil-design-eng       present (autoskills)
✓ web-design-guidelines present (autoskills — third-party, Vercel)
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

**Memory adapter:** none detected — relying on `.design-review/*.md` artifacts for within-run memory; no cross-run cache.

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

Agent `design-reference-research` opens `dribbble.com/shots/popular/web-design` (2026 popular), three competitor settings pages (Linear, Vercel dashboard, Notion settings) via `agent-browser`, **`refero`** (gallery via agent-browser over refero.design — MCP SKIPPED; real shipped products: Mercury, Vercel, Linear listed there), and uses **`ui-ux-pro-max` vocabulary** to name styles/palettes/font-pairings precisely. Extracts 5 concrete patterns → writes `.design-review/references.md`:

1. **[layout]** Two-column: sticky sidebar nav + content pane — Linear. Eliminates repetitive section headings.
2. **[density]** Asymmetric bento within each section — tighter data rows, airier headings — Vercel dashboard.
3. **[motion]** Staggered section entrance on first load (100ms stagger per section) — Dribbble shot #1.
4. **[type]** Display numerals for billing usage stats (plan usage %, seats used) — Notion billing.
5. **[color]** Teal left-border on active nav item graduates to a teal-tinted section background — unique to this product.

**Bar:** *"The page reads as a Plexum product settings surface, not a generic shadcn template — bento density, staggered sections, and the teal identity marker land."*

### Step 2b — Plan (authoring · folds in `frontend-design`)

Appended to `.design-review/references.md`:

**Token-plan (4-hex, subordinate to `packages/design-system` tokens — those win):**
- Accent fill: `#0f7e74` (teal-700 — DS `color-brand-primary`)
- Surface brand-subtle: `#f0faf9` (6% teal tint — DS `surface-brand-subtle`)
- Text emphasis: `#111827` (DS `text-primary`)
- Separator/muted: `#e5e7eb` (DS `border-subtle`)

**Typographic roles (2+):** display numerals for billing stats (`font-variant-numeric: tabular-nums`); body readable (14px / 1.5 — corrects the 3a finding).

**Signature element:** teal-tinted active-section background graduating from the left-border nav marker.

**3 AI-default looks to avoid:** (1) uniform card grid with identical shadow/radius; (2) centered full-width form with excessive blank space; (3) muted gray + blue accent.

**UX-writing checklist:** ✓ no redundant placeholder · ✓ toggle self-describes · ✓ single CTA per view · ✓ section headings sentence-case.

### Step 2c — Context-pack [discover ONCE · token lever]

Agent `design-context-pack` builds `.design-review/context-pack.md` in one pass: component tree, props, tokens-in-use, **file:line** anchors for every point of interest, baseline screenshots from audit-first, cached a11y guidelines, and the audit-first attack list as pre-known shared findings. All lenses that follow receive this pack — they judge a prepared map, not the raw source. No lens re-reads source or re-derives what an earlier lens already found.

### Step 3 — DIAGNOSIS — CORE skills, ROUTED, in order [GATE]

Each lens receives `.design-review/context-pack.md` + `references.md`. **READ-ONLY** — no edits during diagnosis; all mutation happens in step 5, in one apply pass, after the user's multi-select. Output TERSE: line 1 `OK`/`KO` + ≤8-word why; then one finding per line `P# [skill] file:line — problem → fix`.

### Step 3a — lens: impeccable [GATE]

Agent `design-lens-impeccable` **loads the `impeccable` skill via the Skill tool**, routed to `audit` + `critique`. READ-ONLY.

```
KO — scored audit: typography 6/10, contrast 4/10, spacing 5/10
P1 [impeccable] settings/page.tsx:156 — secondary text #9ca3af = 2.85:1 → raise to #6b7280 (4.5:1)
P2 [impeccable] settings/page.tsx:24 — body 13px → 14–16px
P2 [impeccable] settings/page.tsx:67 — sections share 24px padding, 8px gap → bento rhythm
P2 [impeccable] settings/page.tsx:89 — 3 identical Save primaries in one view (also feeds 3b)
P3 [impeccable] settings/page.tsx:12 — single-column OK; no overflow at tested widths
```

### Step 3b — lens: design-taste-frontend [GATE — anti-templated]

Agent `design-lens-taste` **loads the `design-taste-frontend` skill via the Skill tool**, routed to §11 redesign-audit + §14. READ-ONLY.

```
KO — anti-templated gate FAILED
P1 [design-taste-frontend] settings/page.tsx:1 — stacked sections, no house layer → sidebar+bento+teal section bg (refs #1 #2 #5) [VITALITY · pre-selected]
P3 [design-taste-frontend] settings/page.tsx:42 — "BILLING INFORMATION" all-caps → title case
P3 [design-taste-frontend] settings/page.tsx:78 — placeholder "Enter your full name here" → "Jane Smith"
P3 [design-taste-frontend] settings/page.tsx:94 — toggle "Enabled/Disabled" label → remove (state self-describes)
```

Gate names the 2 structural moves from step 2 that make it singular: sidebar+bento (refs #1 #2) + teal section bg (ref #5). P1 vitality findings pre-selected. Run does not continue without them.

### Step 3c — lens: emil-design-eng + `review-animations` gate [GATE — signature motion]

Agent `design-lens-motion` **loads the `emil-design-eng` skill via the Skill tool** with the concrete question inline. READ-ONLY.

```
KO — no signature motion moment
P1 [emil-design-eng] settings/page.tsx:1 — no staggered entrance → 100ms stagger, ease-out, 12px slide-up (ref #3) [VITALITY · pre-selected]
P2 [emil-design-eng] settings/page.tsx:89 — Save button no loading/confirmation state → 800ms silent click
P2 [emil-design-eng] settings/page.tsx:94 — toggle instant snap → 200ms ease transition
P1 [emil-design-eng, web-design-guidelines] settings/page.tsx:1 — no prefers-reduced-motion guard on entrance → add
```

**`review-animations` gate:** staggered entrance within STANDARDS.md (100ms, ease-out, ≤400ms); guard missing → P1 a11y finding (added in step 5). Gate: **APPROVE** (provisional). Feeds verdict step 6.

### Step 3d — lens: web-design-guidelines [GATE — accessibility · last lens]

Agent `design-lens-a11y` WebFetch guidelines → cache → **loads the `web-design-guidelines` skill via the Skill tool** (AA). READ-ONLY.

```
KO — 4 WCAG A/AA failures
P1 [web-design-guidelines] settings/page.tsx:156 — #9ca3af on white 2.85:1 → confirmed AA fail (merged with 3a)
P1 [web-design-guidelines] settings/page.tsx:31 — section titles <div class=bold> → <h2> (heading structure broken)
P1 [web-design-guidelines] settings/page.tsx:94 — toggles <div onClick> → <button role="switch"> (keyboard inaccessible)
P1 [emil-design-eng, web-design-guidelines] settings/page.tsx:1 — prefers-reduced-motion not honored (merged with 3c)
P2 [web-design-guidelines] settings/page.tsx:78 — inputs missing aria-describedby → add for helper text
```

### Step 3e — `ui-ux-pro-max` UX guidelines (wired extra lens)

```
OK — no UX blockers beyond already-found items
P2 [ui-ux-pro-max] settings/page.tsx:89 — no save confirmation feedback → covered by 3c loading-state finding
```

### Step 4 — Checklist presented to user

```
Which findings should I fix?  (multi-select · vitality items pre-selected)

P1 — Broken / identity / vitality
  [x] Anti-templated gate FAILED: stacked-section default, no house layer → sidebar+bento+teal bg  [design-taste-frontend]
  [x] No signature motion: staggered section entrance (100ms, ease-out, 12px slide) from ref #3    [emil-design-eng]
  [x] Secondary text contrast 2.85:1 — fails WCAG AA (#9ca3af on white)                           [impeccable, web-design-guidelines]
  [x] Section titles are <div>, not <h2> — heading structure broken                                [impeccable, web-design-guidelines]
  [x] Notification toggles not keyboard accessible (missing role="switch")                         [web-design-guidelines]
  [x] prefers-reduced-motion not honored by staggered entrance                                     [emil-design-eng, web-design-guidelines]

P2 — Improvements
  [ ] Three competing "Save changes" primaries on one page                                         [impeccable]
  [ ] Body text 13px — below comfortable reading threshold (target: 14–16px)                       [impeccable]
  [ ] Save button needs loading/confirmation state (800ms silence after click)                     [emil-design-eng]
  [ ] Toggles snap instant — add 200ms ease transition                                             [emil-design-eng]

P3 — Polish
  [ ] Section heading "BILLING INFORMATION" — use title case                                       [design-taste-frontend]
  [ ] Placeholder "Enter your full name here" — redundant; shorten                                 [design-taste-frontend]
  [ ] Toggle enabled/disabled text labels are noise — remove                                       [design-taste-frontend]
```

**User selected:** all P1 + "Three competing Save buttons" (P2) + "Save button loading state" (P2).

### Step 5 — Informed re-pass

Layout changed (3a re-run) + motion added (3c re-run) + a11y re-checked for new structure (3d re-run). `prefers-reduced-motion` guard added to the staggered entrance (fixes P1 a11y finding; `review-animations` gate remains APPROVE). New finding: teal-tinted section background references no DS token → swapped to `surface-brand-subtle` (existing token, 6% teal tint).

### Step 6 — vitality-verdict [GATE]

Agent `design-vitality-verdict` renders the updated page live in light, dark, and mobile via `agent-browser`. Diffs against `.design-review/references.md`:

- Sidebar nav + bento density: **landed** — refs #1 #2 present.
- Teal-tinted active section background: **landed** — ref #5 applied via DS token.
- Staggered section entrance: **landed** — `prefers-reduced-motion` disables it.
- Display numerals for billing usage: not yet applied (not selected) — noted, not blocking.
- Motion moment fires? **Yes** — on first load, off on second (cached).

Core Web Vitals: LCP 1.3s / CLS 0.02 / INP 58ms — all green.

Reinforced by: **taste §14 pre-flight** (all pass: no all-caps headings, no redundant placeholders, toggle self-describes); **`review-animations`** APPROVE (guard applied); **`huashu-design` Playwright verify** SKIPPED — agent-browser screenshots used.

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

**Preflight** (`node "${CLAUDE_PLUGIN_ROOT}/scripts/preflight.mjs" --write`): all core components present (impeccable, design-taste-frontend, emil-design-eng, web-design-guidelines, review-animations, frontend-design, agent-browser, ui-ux-pro-max). `refero` MCP not configured → SKIPPED `refero` → reference-research via agent-browser over refero.design only (no DESIGN.md token specs). `huashu-design`: SKIPPED — Playwright verify unavailable. No `AskUserQuestion` batch needed (no installs chosen).

**Memory adapter:** none detected — relying on `.design-review/*.md` artifacts; no cross-run cache.

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

**Keep:** teal `#0f7e74` brand color — unmistakably Plexum; white label on teal passes AA; rounded-md radius is consistent with the form-field family. **Attack:** no press/active state visible; focus ring invisible on teal; no loading state; hover transition 0ms; no disabled variant in stories.

### Step 2 — reference-research [GATE · always · the #1 lever against flat]

Agent `design-reference-research` opens `dribbble.com/shots/popular/web-design` (2026 popular), three competitor primary buttons (Stripe Checkout, Linear, Vercel Deploy) via `agent-browser`, **`refero`** (gallery via agent-browser over refero.design — MCP SKIPPED; real shipped button components: Stripe, Linear, Vercel listed there), and uses **`ui-ux-pro-max` vocabulary** to name motion styles and color semantics precisely. Extracts 4 patterns → writes `.design-review/references.md`:

1. **[motion]** Micro-spring press: `scale(0.96)` + shadow collapse in 80ms `cubic-bezier(0.34, 1.56, 0.64, 1)` — Stripe.
2. **[motion]** Brand ripple on click: a circular teal wave expands from the click point and fades in 350ms — Dribbble shot #2.
3. **[type/color]** Loading state replaces label text with a spinner + "Loading…" that inherits button color — Linear.
4. **[color]** Focus ring: white, 2px offset, regardless of button background — Vercel.

**Bar:** *"The button's press and load moments feel unmistakably Plexum — the teal ripple on click is the signature; hover hygiene alone is not alive."*

### Step 2b — Plan (authoring · folds in `frontend-design`)

Appended to `.design-review/references.md`:

**Token-plan (3-hex, subordinate to `packages/design-system` tokens — those win):**
- Brand fill: `#0f7e74` (DS `color-brand-primary`)
- Brand-dark (hover): `#0a5e56` (DS `color-brand-primary-dark`)
- Focus ring: `#ffffff` (universal over any button color variant)

**Typographic roles (2+):** button label (14px / medium / slight letter-spacing for CTAs); loading text (SR-only via `sr-only`).

**Signature element:** teal radial ripple from pointer position on click.

**3 AI-default looks to avoid:** (1) solid fill + white text, hover-darken only; (2) outline-only as primary (under-weighted); (3) pill radius on short labels (trendy, brand-less).

**UX-writing checklist:** ✓ label is a verb · ✓ loading text announced to SR · ✓ no tooltip needed on disabled.

### Step 2c — Context-pack [discover ONCE · token lever]

Agent `design-context-pack` builds `.design-review/context-pack.md` in one pass: component tree, props interface, tokens-in-use, **file:line** anchors for every variant and state, Storybook story names, and the audit-first attack list as pre-known shared findings. All lenses that follow receive this pack.

### Step 3 — DIAGNOSIS — CORE skills, ROUTED, in order [GATE]

Each lens receives `.design-review/context-pack.md` + `references.md`. **READ-ONLY** — no edits during diagnosis; all mutation happens in step 5, in one apply pass, after the user's multi-select. Output TERSE.

### Step 3a — lens: impeccable [GATE]

Agent `design-lens-impeccable` **loads the `impeccable` skill via the Skill tool**, routed to `audit` + `critique`. READ-ONLY.

```
KO — contrast/state issues
P2 [impeccable] Button.tsx:23 — contrast 4.61:1, passes AA (barely); hover transition 0ms
P1 [impeccable] Button.tsx:31 — no active/pressed state → press moment invisible
P1 [impeccable] Button.tsx:41 — focus ring #0f7e74 on teal → near-invisible (also feeds 3b)
P2 [impeccable] Button.tsx:1 — no disabled variant in stories → untested state
```

### Step 3b — lens: design-taste-frontend [GATE — anti-templated]

Agent `design-lens-taste` **loads the `design-taste-frontend` skill via the Skill tool**, routed to §11 redesign-audit + §14. READ-ONLY.

```
KO — anti-templated gate FAILED
P1 [design-taste-frontend] Button.tsx:1 — generic shadcn/Tailwind with teal hex, no brand motion → add teal ripple (ref #2) [VITALITY · pre-selected]
P2 [design-taste-frontend] Button.tsx:1 — no size variants → consumers hardcoding overrides, drifting from DS
```

Gate names the 1 move from step 2 that makes it singular: teal ripple on click (ref #2). P1 vitality finding pre-selected.

### Step 3c — lens: emil-design-eng + `review-animations` gate [GATE — signature motion]

Agent `design-lens-motion` **loads the `emil-design-eng` skill via the Skill tool** with the concrete question inline. READ-ONLY.

```
KO — no signature motion, hygiene gaps
P1 [emil-design-eng] Button.tsx:1 — no ripple on click → teal radial ripple from pointer, 350ms fade (ref #2) [VITALITY · pre-selected]
P2 [emil-design-eng] Button.tsx:23 — hover transition 0ms → transition-colors duration-150 ease-out
P2 [emil-design-eng] Button.tsx:31 — no micro-spring press → scale(0.97) 80ms cubic-bezier(0.34,1.56,0.64,1) (ref #1)
P2 [emil-design-eng] Button.tsx:1 — no loading state → button silent during async actions (ref #3)
P1 [emil-design-eng, web-design-guidelines] Button.tsx:1 — no prefers-reduced-motion guard on ripple → add
```

**`review-animations` gate:** ripple 350ms fade, easing acceptable, `prefers-reduced-motion` guard missing. Gate: **BLOCK** — guard must be added before verdict can reach `alive`. Feeds verdict step 6.

### Step 3d — lens: web-design-guidelines [GATE — accessibility · last lens]

Agent `design-lens-a11y` WebFetch guidelines → cache → **loads the `web-design-guidelines` skill via the Skill tool** (AA). READ-ONLY.

```
KO — 2 WCAG A/AA failures
P1 [web-design-guidelines] Button.tsx:41 — focus ring near-invisible on teal → outline: 2px solid white; outline-offset: 2px (ref #4)
P2 [web-design-guidelines] Button.tsx:1 — no disabled variant → needs aria-disabled + muted visual state
P2 [web-design-guidelines] Button.tsx:1 — loading state (future) → aria-busy="true" + SR-only "Loading…"
P1 [emil-design-eng, web-design-guidelines] Button.tsx:1 — prefers-reduced-motion guard missing (merged with 3c)
```

### Step 3e — `ui-ux-pro-max` UX guidelines (wired extra lens)

```
OK — no UX blockers beyond already-found items
```

### Step 4 — Checklist presented to user

```
Which findings should I fix?  (multi-select · vitality items pre-selected)

P1 — Broken / identity / vitality
  [x] Anti-templated gate FAILED: generic default button, no brand motion → add teal ripple (ref #2)  [design-taste-frontend]
  [x] No signature motion: teal radial ripple from click point, 350ms fade (ref #2)                   [emil-design-eng]
  [x] No active/pressed state — press moment invisible                                                 [impeccable]
  [x] Focus ring near-invisible on teal → outline: 2px solid white; outline-offset: 2px (ref #4)      [impeccable, web-design-guidelines]
  [x] prefers-reduced-motion not honored by ripple                                                     [emil-design-eng, web-design-guidelines]

P2 — Improvements
  [ ] Hover transition 0ms — add duration-150 ease-out                                                [emil-design-eng]
  [ ] No micro-spring press state — add scale(0.97) at 80ms (ref #1)                                  [impeccable, emil-design-eng]
  [ ] No loading state — button silent during async actions (ref #3)                                   [emil-design-eng]
  [ ] No disabled variant — consumers cannot render disabled primary correctly                         [impeccable, web-design-guidelines]
  [ ] No size variants — consumers hardcoding overrides; add sm/md/lg                                  [design-taste-frontend]

P3 — Polish
  [ ] Border-radius: rounded-md → rounded-lg for slightly softer primary feel                          [impeccable]
```

**User selected:** all P1 + hover transition (P2) + press state (P2) + loading state (P2).

### Step 5 — Informed re-pass

Motion added (3c re-run) + a11y re-checked for ripple + loading (3d re-run). `prefers-reduced-motion` guard added to the ripple (collapses to instant opacity fade) — `review-animations` gate cleared (BLOCK → APPROVE). New finding: loading spinner SVG `stroke="#ffffff"` hardcoded → replaced with `currentColor` so it inherits label color correctly for future variants.

### Step 6 — vitality-verdict [GATE]

Agent `design-vitality-verdict` renders the Button stories live via `agent-browser` — all states: default / hover / active / focused / disabled / loading — in light and dark.

Diff against `.design-review/references.md`:
- Teal ripple on click: **landed** — fires from pointer position, 350ms fade, `prefers-reduced-motion` collapses to instant opacity.
- Micro-spring press: **landed** — `scale(0.97)` at 80ms spring easing.
- White focus ring with offset: **landed** — visible on teal and any future color variant (ref #4).
- Loading state: **landed** — spinner + SR-only "Loading" + `aria-busy`.
- Disabled variant: **deferred** (not selected) — noted, not blocking.

Storybook render time: 110ms.

Reinforced by: **taste §14 pre-flight** (pass: label is a verb, no redundant copy); **`review-animations`** APPROVE (reduced-motion guard applied; ripple collapses to instant opacity — within STANDARDS.md); **`huashu-design` Playwright verify** SKIPPED — Storybook story renders used.

**Verdict written to `.design-review/verdict.json`:**

```
Vitality verdict:  templated → (loop) → alive
  judged against .design-review/references.md
  teal ripple (signature moment) + white focus ring + loading state landed
```

### Step 7 — Vitality loop

Not needed — verdict is `alive` on first loop.

### Closing verification (Storybook)

Screenshots: default / hover / active / focused / disabled / loading — light and dark. All states correct. Keyboard: Tab → white ring visible → Enter → loading state visible → `aria-busy` announced.

---

## Summary

| # | Target | Type | Skipped steps | Verdict |
|---|--------|------|--------------|---------|
| 1 | Settings page | Authenticated page | SEO, huashu-design, refero (MCP) | `templated` → `alive` (1 loop) |
| 2 | Primary Button component | DS component | SEO, huashu-design, refero (MCP) | `templated` → `alive` (1 loop) |

→ Back to [design-review](../README.md)
