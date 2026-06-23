**English** | [Español](README.es.md)

# design-review — Usage Examples

> Concrete worked examples showing what the pipeline finds, what the checklist looks like, and what gets applied.

These are realistic examples — not synthetic. Each one shows the target, which steps ran (and which were skipped), the findings each skill surfaced, the checklist the user saw, and what was applied.

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

## One prompt for all, or one skill standalone

`/design-review` is the **one prompt for all** — it runs every applicable skill in order and merges the findings into a single checklist. But each orchestrated skill is independent and can be invoked on its own when you only want that lens:

| Want only… | Invoke standalone |
|---|---|
| Structure / hierarchy / IA | `impeccable` (scored audit) or `ui-ux-pro-max` |
| Anti-slop / taste pass | `taste-skill` · `huashu-design` |
| Motion & interaction polish | `emil-design-eng` (+ `review-animations` to critique it) |
| Accessibility (WCAG AA) | `web-design-guidelines` + `web-accessibility` |
| SEO (public pages) | `seo` |

```
# one skill standalone
Run impeccable on apps/web/app/settings/page.tsx — scored audit only, no other steps.

# everything, orchestrated, one checklist
/design-review apps/web/app/settings/page.tsx
```

Each skill is by its original author (see *Attribution* in the main README) and installs from its own source — the pipeline only sequences them. Missing one? Step 0.5 preflight offers to install it (you choose).

---

## Example 1 — Settings page (authenticated web app)

**Target:** `apps/web/app/settings/page.tsx` — a multi-section settings page (profile, notifications, billing) in an authenticated Next.js app.

**Stack:** Next.js App Router, Tailwind CSS with design system tokens, Storybook available, dev server running.

### Step 0 — Capability detection

```
Design system: yes (packages/design-system — tokens at design-system/tokens.ts)
Storybook: yes (localhost:6006)
Platform: web
Target visibility: private/authenticated → SEO step SKIPPED
Live browser: yes (dev server at localhost:3000)
```

### What each skill found

**Step 1 — Baseline structure (`ui-ux-pro-max`)**
- Three sections (Profile / Notifications / Billing) share the same visual weight; no hierarchy guides the user to the most-used section first.
- "Save changes" button is at the bottom of each section independently — three identical primary buttons compete on the same scroll view.
- The page title "Settings" is an `<h1>` but the section titles are `<div>` with a bold class, not `<h2>` — heading structure is broken.

**Step 2 — Scored audit (`impeccable`)**
- Typography score: 6/10. Body text is 13px on a white background — below the comfortable reading threshold.
- Spacing score: 5/10. Sections use 24px padding internally but only 8px gap between sections — compressed rhythm.
- Contrast score: 4/10. Secondary text (#9ca3af on white) = 2.85:1 — fails WCAG AA for normal text.
- CTA score: 7/10. Save button is correct in isolation; the problem is multiplicity (three primaries).
- Layout score: 7/10. Single-column layout is adequate; no overflow at tested widths.

**Step 3 — Second anti-slop lens (`huashu-design`)**
- The Notifications section has 11 toggle switches with no grouping — high cognitive load, no visual separation between "Email" and "Push" categories.
- The Billing section shows a plan name but no renewal date, no usage bar, and no upgrade path — incomplete information architecture for a billing surface.
- Form labels sit above their inputs but the gap is 4px — labels feel disconnected from inputs at a glance.

**Step 4 — Taste / transversal anti-slop (`taste-skill`)**
- Section heading "BILLING INFORMATION" is all-caps — reads as shouting; use title case.
- The placeholder in the "Full name" input is "Enter your full name here" — redundant with the label; remove or shorten to "Jane Smith".
- Notification toggles show "Enabled" / "Disabled" text next to each toggle — the toggle state already communicates this; the text is noise.

**Step 5 — Motion & polish (`emil-design-eng` + `review-animations`)**
- Save button has no press/loading state — after clicking, nothing confirms the action was received for ~800ms (API round trip).
- Toggles have no transition (instant snap between on/off states).
- `review-animations`: No jank detected (no existing animations), but the absence of feedback on the save action is a motion gap.

**Step 6 — Accessibility (`web-design-guidelines` + `web-accessibility`)**
- Secondary text fails contrast AA (2.85:1 — confirmed from step 2).
- Section titles are not headings — screen readers cannot navigate by heading.
- Notification toggles are `<div>` elements with click handlers, not `<input type="checkbox">` or `role="switch"` — not keyboard accessible.
- No `aria-describedby` on any input — screen readers announce label only, not helper text.

### Checklist presented to user

```
Which findings should I fix?  (multi-select)

P1 — Broken / identity / accessibility
  [x] Secondary text contrast 2.85:1 — fails WCAG AA (#9ca3af on white)          [impeccable, web-accessibility]
  [x] Section titles are <div>, not <h2> — heading structure broken               [ui-ux-pro-max, web-accessibility]
  [x] Notification toggles are not keyboard accessible (missing role="switch")    [web-accessibility]

P2 — Improvements
  [ ] Three competing "Save changes" primary buttons on one page                  [ui-ux-pro-max, impeccable]
  [ ] Notification toggles need grouping (Email vs Push) — 11 unsorted toggles   [huashu-design]
  [ ] Body text is 13px — below comfortable reading threshold (target: 14–16px)   [impeccable]
  [ ] Save button needs loading/confirmation state (800ms dead silence after click) [emil-design-eng]
  [ ] Label-to-input gap is 4px — increase to 8px for visual connection           [huashu-design]

P3 — Polish
  [ ] Section heading "BILLING INFORMATION" — use title case                      [taste-skill]
  [ ] Placeholder "Enter your full name here" — redundant; shorten                [taste-skill]
  [ ] Toggle enabled/disabled text labels are noise — remove                      [taste-skill]
  [ ] Add 200ms ease transition to toggles                                        [emil-design-eng, review-animations]
```

**User selected:** all P1 + "Three competing Save buttons" (P2) + "Save button loading state" (P2).

### What was applied

1. Secondary text color changed to `#6b7280` (contrast 4.63:1 — passes AA).
2. Section titles converted from `<div className="font-bold">` to `<h2>` with design system heading token.
3. Notification toggles refactored to `<button role="switch" aria-checked={...}>` with keyboard handler.
4. Page restructured to one "Save all changes" button at the bottom of the page (single primary CTA).
5. Save button gained a loading state (`isLoading` prop → spinner + "Saving…" label → "Saved" confirmation for 2s).

### Closing verification

Screenshots (light/dark/mobile) confirmed:
- Secondary text readable in both themes.
- Heading structure visible in browser accessibility tree.
- Toggles navigable and togglable via keyboard.
- Single primary CTA visible at page bottom.

Core Web Vitals: LCP 1.2s / CLS 0.01 / INP 62ms — all green.

---

## Example 2 — Primary CTA button (component-level review)

**Target:** `packages/design-system/src/components/Button/Button.tsx` — the `Button` component, specifically the `variant="primary"` style.

**Stack:** React, Tailwind CSS, design system tokens, Storybook at localhost:6006.

**Target visibility:** component (not a page) — SEO step SKIPPED. Live browser via Storybook.

### Step 0 — Capability detection

```
Design system: yes (this IS the design system component)
Storybook: yes (localhost:6006 — Button.stories.tsx exists)
Platform: web
Target visibility: component / internal → SEO step SKIPPED
Live browser: Storybook
```

### What each skill found

**Step 1 — Baseline structure (`ui-ux-pro-max`)**
- The button renders correctly in the default state.
- No `disabled` variant is defined in the stories — the disabled state is untested and visually unverified.
- No `size` variants beyond the default — a common gap that forces consumers to override styles.

**Step 2 — Scored audit (`impeccable`)**
- Contrast (primary): teal `#0f7e74` background with white label = 4.61:1 — passes AA (barely).
- Hover state: background darkens to `#0a5e56` — good, but the transition is 0ms (instant).
- Active/pressed state: no visual change beyond the hover state — the press moment is invisible.
- Focus ring: present but uses `outline: 2px solid #0f7e74` on a teal background — the ring is nearly invisible.

**Step 3 — Second anti-slop lens (`huashu-design`)**
- The button's border-radius is `rounded-md` (6px) — feels slightly utilitarian for a primary brand action.
- Padding is `px-4 py-2` (16px / 8px) — on the tighter side for a primary CTA; `px-5 py-2.5` would feel more premium.

**Step 4 — Taste / transversal anti-slop (`taste-skill`)**
- No issues (button component does not have text content — anti-copy rules do not apply).
- Consistency check: the `size` gap from step 1 is a consistency risk — consumers are likely hardcoding overrides.

**Step 5 — Motion & polish (`emil-design-eng` + `review-animations`)**
- Hover transition is 0ms — add `transition-colors duration-150 ease-out`.
- Active (press) state needs a subtle scale: `active:scale-[0.97]` gives tactile press feedback.
- Loading state: no `isLoading` prop or spinner — the button goes silent during async actions.
- `review-animations`: the scale-on-press timing should match the hover transition (150ms) for coherence.

**Step 6 — Accessibility (`web-design-guidelines` + `web-accessibility`)**
- Focus ring nearly invisible on teal background — change to `outline: 2px solid white` with `outline-offset: 2px` (or use a high-contrast ring).
- `disabled` variant needs `aria-disabled` and a muted visual state — currently not defined.
- Loading state (when added) must announce to screen readers: `aria-busy="true"` + visually hidden "Loading…" text.

### Checklist presented to user

```
Which findings should I fix?  (multi-select)

P1 — Broken / identity / accessibility
  [x] Focus ring nearly invisible on teal background — keyboard users lose orientation [impeccable, web-accessibility]
  [x] No disabled variant — consumers cannot render a disabled primary button correctly [ui-ux-pro-max, web-accessibility]

P2 — Improvements
  [ ] Hover transition is 0ms — add duration-150 ease-out                            [emil-design-eng]
  [ ] No active/press state — users get no tactile confirmation                       [impeccable, emil-design-eng]
  [ ] No loading state — button goes silent during async actions                      [emil-design-eng]
  [ ] Padding feels tight for primary CTA (px-4 py-2 → px-5 py-2.5)                  [huashu-design]

P3 — Polish
  [ ] Border-radius could be slightly larger (rounded-md → rounded-lg)                [huashu-design]
  [ ] Scale on press: active:scale-[0.97] for tactile feel                           [emil-design-eng, review-animations]
```

**User selected:** all P1 + hover transition (P2) + press state (P2) + loading state (P2).

### What was applied

1. Focus ring changed to `outline: 2px solid white; outline-offset: 2px` (always visible regardless of button color).
2. `disabled` prop added: muted background (`#9ca3af`), `cursor-not-allowed`, `aria-disabled="true"`, and a story added to Storybook.
3. Hover transition: `transition-colors duration-150 ease-out` added.
4. Active/press: `active:scale-[0.97] active:transition-transform active:duration-75` added.
5. Loading state: `isLoading` prop → spinner (animated SVG from DS icon set) + visually hidden "Loading" text + `aria-busy="true"`.

### Closing verification (Storybook)

Screenshots of: default / hover / active / focused / disabled / loading — in light and dark mode. All states render correctly. Keyboard navigation confirmed: Tab to focus → ring visible → Enter triggers action → loading state visible.

---

## Summary

| # | Target | Type | Skipped steps | P1 fixes applied |
|---|--------|------|--------------|-----------------|
| 1 | Settings page | Authenticated page | SEO | Contrast, headings, keyboard toggles |
| 2 | Primary Button component | DS component | SEO | Focus ring, disabled variant |

→ Back to [design-review](../README.md)
