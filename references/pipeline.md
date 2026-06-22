# Pipeline — step-by-step reference

> What each step does, what to look for, and how to chain findings forward.

This document expands on the summary table in the README. Use it when running the pipeline manually, when adapting it to a new project, or when deciding which steps to include or skip.

---

## Before you start: define the target clearly

State the target explicitly before running step 0:

- **What**: a specific file, route, component, or page (not "the app")
- **Stack**: framework, CSS method, design system (if any), Storybook (if any)
- **Platform**: web, mobile (React Native / Expo), or both
- **Visibility**: public (indexable) or private/internal (authenticated, admin, dashboard)
- **Live browser**: available (dev server / Storybook) or not

A clear target prevents the pipeline from making assumptions that cause the wrong steps to run.

---

## Step 0 — Detect project capabilities

**Purpose:** adapt the pipeline to the project before running a single skill.

**What to detect:**

| Signal | How | Effect |
|--------|-----|--------|
| Design system / tokens | `packages/*design-system*`, `tokens.ts`, `tailwind.config.*` with custom colors, `theme.ts` | Enables reuse-first step (0b); flags deviations from tokens in later steps |
| Storybook | `.storybook/`, `*.stories.tsx`, `*.stories.mdx` | Enables Storybook-first rendering in step 7; adds a "story exists?" check |
| Public target | Landing page, marketing route, static export, no auth guard | Enables SEO step (6b) |
| Platform | `package.json` for `react-native`, `expo`; `android/`, `ios/` directories | Switches step 1 to a mobile-design skill; skips DOM-only skills |
| Live browser | Dev server running (`pnpm dev`, `next dev`), Storybook running, or a browser-automation CLI (`agent-browser`) available | Enables step 7; without it, step 7 is skipped and stated |

**Output of step 0:** a short list of what was found and what will be skipped. Example:

```
Design system: yes (packages/design-system)
Storybook: yes (localhost:6006)
Platform: web
Public target: no (authenticated app) → SEO step SKIPPED
Live browser: yes (localhost:3000)
```

State skipped steps immediately. Do not silently run them.

---

## Step 0b — Reuse-first

**Purpose:** prevent duplicate components and hardcoded values before designing anything new.

**What to do:**
1. Open Storybook (or browse the design system source) and look for an existing component that solves the problem.
2. If one exists: use it, or compose it with other existing atoms/molecules.
3. If none exists and the new piece is reusable (used in ≥2 places or likely to be): design it in the design system with a `.stories.tsx` file, not inline in the app.
4. If the piece is specific to a single screen: compose it from design system atoms inside the app.

**Skip if:** no design system in the project.

**Finding format:** `[reuse-first] Existing <ComponentName> at <path> — use instead of implementing new`.

---

## Step 1 — Baseline structure

**Purpose:** establish the structural foundation — layout, visual hierarchy, information architecture, and cognitive load — before auditing any details.

**Primary skill:** `ui-ux-pro-max`
**Fallback (if not installed):** `frontend-design`

**What to look for:**
- Visual hierarchy: does the most important element command the most visual weight? Are there competing primaries?
- Layout: is the grid or column structure consistent? Does content overflow at any standard breakpoint?
- Information architecture: are related items grouped? Is the page scannable (F-pattern, Z-pattern)?
- Cognitive load: how many decisions does the user face at once? Are there too many options, toggles, or actions in one view?
- Heading structure: does the heading hierarchy (`h1` → `h2` → `h3`) reflect the visual hierarchy?

**Findings:** structural issues are usually P1 or P2. A broken heading structure is always P1 (accessibility). Competing CTAs are P2.

**Chain to step 2:** pass the layout and hierarchy issues forward so the audit in step 2 can confirm whether the scoring reflects structural problems or purely visual ones.

---

## Step 2 — Scored audit + anti-slop (lead skill)

**Purpose:** a systematic, scored audit across the five visual dimensions. This is the lead skill — it sets the baseline score that subsequent steps improve.

**Skill:** `impeccable`

**Five dimensions:**
1. **Typography** — size scale, line height, weight contrast, readability at small sizes
2. **Spacing** — rhythm consistency, padding/margin scale, density vs. breathing room
3. **Contrast** — text/background ratios (WCAG AA: 4.5:1 normal, 3:1 large text/UI components), icon legibility
4. **CTAs** — clarity of primary action, visual weight hierarchy, number of competing primaries
5. **Layout** — alignment, grid consistency, overflow, responsiveness

**What to do:**
- Score each dimension 1–10.
- Flag deviations from the design system tokens (hardcoded colors, one-off spacing values).
- Apply live fixes for issues where the fix is obvious and small (impeccable's strength).

**Findings:** contrast below AA is always P1. Hardcoded tokens are P2. Score < 6 in any dimension is P2.

**Chain to step 3:** pass scores and findings forward. Step 3 operates independently to catch what this step missed — do not filter findings between steps.

---

## Step 3 — Second anti-slop lens

**Purpose:** an independent second opinion. Runs after step 2 so it has context, but does not see step 2's scores until it has formed its own assessment.

**Skill:** `huashu-design`

**Five dimensions (same structure, independent eye):**
1. **Clarity** — is the purpose of each element immediately obvious?
2. **Visual balance** — whitespace distribution, element weight distribution
3. **Consistency** — do like elements look alike? Do unlike elements look different?
4. **Information hierarchy** — what does the user see first, second, third?
5. **Completeness** — is any piece of information the user needs missing from the surface?

**What to do:**
- Run independently of step 2's findings.
- After running, merge with step 2's findings: deduplicate items flagged by both (mark them `[impeccable, huashu-design]`), keep items found by only one.

**Findings:** items found by both skills are higher confidence. Items found by only one are worth including but flagged with a single skill.

---

## Step 4 — Taste / transversal anti-slop

**Purpose:** catch surface-level design slop that scored audits often miss — copy choices, all-caps, redundant labels, fake precision numbers, decorative elements that add noise.

**Skill:** `taste-skill`

**What to look for:**
- **Em-dash ban** — em-dashes in UI labels or callouts (use a comma, colon, or rewrite the sentence)
- **Eyebrow restraint** — all-caps section labels ("FEATURES", "ABOUT US") that read as shouting; use title case or remove
- **Fake/round numbers** — "5000+ happy customers" (unverifiable); "99.9% uptime" without a source
- **Redundant labels** — placeholder text that repeats the label ("Enter your email address" when the label already says "Email")
- **State text redundancy** — "Enabled / Disabled" next to a toggle (the visual state communicates this)
- **Consistency locks** — ensure all headings use the same case style, all CTAs use the same verb tense, all empty states follow the same pattern

**For dashboards:** apply transversal rules (consistency locks, eyebrow restraint) only. Skip copy-specific rules that do not apply to data surfaces.

**Findings:** em-dash and redundant labels are P3. All-caps headings are P2. Fake numbers are P2 (trust and legal risk).

---

## Step 5 — Motion & polish

**Purpose:** add purposeful interaction feedback; remove motion that distracts or performs.

**Skills:** `emil-design-eng` (application) + `review-animations` (critique)

**What to look for (emil-design-eng):**
- **Hover transitions** — interactive elements should have a `transition-colors` or `transition-all` (typically 100–200ms ease-out)
- **Press/active state** — buttons and interactive cards need a subtle scale (e.g. `active:scale-[0.97]`) or color shift to confirm the press moment
- **Loading states** — any async action needs a loading indicator; the UI must not go silent for >300ms
- **Skeleton screens** — data-heavy components should show a skeleton on first load, not a blank state
- **Reduced motion** — all motion must respect `prefers-reduced-motion: reduce`
- **Transitions between views/states** — page transitions, modal open/close, and list item add/remove should have a transition

**What to look for (review-animations — critique pass):**
- **Timing** — is each transition at the right speed for its purpose? (Micro: 100–150ms; page-level: 200–300ms; decorative: 300–500ms)
- **Easing** — is the easing function appropriate? (Entrances: ease-out; exits: ease-in; cross-fades: ease-in-out)
- **Purpose** — does each animation communicate something (state change, direction, hierarchy) or is it decorative?
- **Jank** — are there dropped frames? Does the animation use GPU-composited properties (transform, opacity) or layout-triggering ones (width, margin)?

**Findings:** missing loading state is P1 if it would leave users waiting >500ms without feedback. Missing hover state is P2. Jank on a layout property is P2. Easing mismatch is P3. Timing slightly off is P3.

---

## Step 6 — Accessibility

**Purpose:** verify the target meets WCAG AA and is fully usable by keyboard and screen reader users.

**Skills:** `web-design-guidelines` (structure and Web Interface Guidelines) + `web-accessibility` or `accessibility` (WCAG 2.2 audit)

**What to check:**

| Check | Standard | Failure level |
|-------|----------|---------------|
| Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large / UI) | WCAG 1.4.3 AA | P1 |
| Visible focus ring on all interactive elements | WCAG 2.4.7 AA | P1 |
| All interactive elements reachable by Tab | WCAG 2.1.1 A | P1 |
| Correct ARIA roles (buttons are `<button>`, switches are `role="switch"`) | WCAG 4.1.2 A | P1 |
| Images have meaningful `alt` text | WCAG 1.1.1 A | P1 |
| Form inputs have `<label>` or `aria-label` | WCAG 1.3.1 A | P1 |
| Heading structure (`h1` → `h2` → `h3`) is logical | WCAG 1.3.1 A | P1 |
| Motion respects `prefers-reduced-motion` | WCAG 2.3.3 AAA (best practice) | P2 |
| Color is not the only means of conveying information | WCAG 1.4.1 A | P2 |
| Error messages are accessible (not only color) | WCAG 3.3.1 A | P2 |

**Note:** contrast from step 2 is carried forward here — no need to re-check values already caught by impeccable. Mark them with `[impeccable, web-accessibility]` to show both skills agree.

**Findings:** all WCAG A and AA failures are P1. AAA items are P2 or P3 depending on user impact.

---

## Step 6b — SEO (public targets only)

**Purpose:** ensure the target is discoverable and correctly indexed.

**Skill:** `seo`

**Skip:** authenticated apps, admin panels, dashboards — any target that is not publicly indexable.

**What to check:**
- `<title>` and `<meta name="description">` present and unique per page
- `<h1>` exactly one per page, descriptive
- Open Graph tags (`og:title`, `og:description`, `og:image`) for shareable pages
- Canonical URL set
- Structured data (`schema.org`) where relevant (articles, products, FAQs, events)
- No `noindex` on pages that should be indexed
- Image `alt` attributes (also required for accessibility — double credit)

**Findings:** missing `<title>` or duplicate headings are P1. Missing OG tags are P2. Missing structured data is P3.

---

## Step 7 — Live visual reality-check

**Purpose:** verify the target as it actually renders — not as the code suggests it should render. Screenshots are the ground truth.

**Tool:** `agent-browser` (or equivalent browser-automation CLI)

**What to do:**
1. Render the target in **light mode** — screenshot.
2. Render in **dark mode** — screenshot.
3. Render at **mobile viewport** (375px width) — screenshot.
4. Visually inspect each screenshot: spacing, overflow, contrast on real colors (not computed values), dark mode correctness.
5. Run **Core Web Vitals**: LCP, CLS, INP, TTFB. Flag any metric outside the "Good" threshold (LCP > 2.5s, CLS > 0.1, INP > 200ms).
6. For redesigns / audits: run a **visual regression diff** against the baseline screenshot to confirm only intended changes were made.

**Run sequentially** — never parallel (browser threads share state; parallel runs produce unreliable screenshots).

**Skip if:** no live browser available. State explicitly: "Live visual check: SKIPPED — no dev server running."

**Findings:** visible overflow at mobile is P1. Dark mode showing white text on white background is P1. LCP > 4s is P2. Minor spacing discrepancy is P3.

---

## Chaining findings: the rule

Every finding flows forward. Steps do not discard findings from earlier steps. The final list is a union of all steps, deduplicated by description.

When two steps flag the same issue (e.g. contrast caught by both `impeccable` and `web-accessibility`), merge them into one item and list both skills: `[impeccable, web-accessibility]`. The merged item carries higher confidence and should be pre-selected in the checklist.

When merging, keep the more specific description (the one with the actual ratio, file path, or component name).

---

## After the checklist: verification

After applying the selected fixes:

1. **Typecheck** (if code was changed) — `tsc --noEmit` or equivalent.
2. **Design token audit** — no hardcoded color, spacing, or typography values introduced by the fixes.
3. **Brand / identity consistency** — the fixed target still looks like it belongs to the product family.
4. **Closing screenshots** — light, dark, and mobile. The screenshots are the evidence that the fixes were applied and did not break anything.
5. **Core Web Vitals** — re-run after any performance-related fix to confirm improvement.

→ Back to [design-review](../README.md)
