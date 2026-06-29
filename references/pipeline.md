# Pipeline — step-by-step reference (executable, gated, vitality-first)

> The telos is **vitality**, not correctness. Each step says *what to do* and *what input to pass the
> skill* — it never paraphrases a skill's content. Skills are reasoning an agent **loads** via the Skill
> tool; restating them in bullets is the bug this rewrite fixes.

This document expands the imperative pipeline in `SKILL.md` and the `/design-review` command. Use it when
running the pipeline manually or adapting it to a new project.

---

## The telos (why the steps are shaped this way)

The old pipeline optimised *"does this have defects?"* and converged on **correct-but-flat**. This one
optimises:

> **Is this design ALIVE and unmistakably 2026 against these specific references?**

Three structural fixes, mapped to steps:

| Root cause of "flat" | Fix | Step |
|---|---|---|
| Wrong telos (defect-removal ceiling) | Explicit **vitality verdict** + **loop** | 6, 7 |
| No reference research (designing from memory = template) | **reference-research GATE** | 2 |
| Skills paraphrased, not invoked | **REAL invocation** via the Skill tool | 3 |

---

## Before you start: define the target

State explicitly: **what** (file/route/component/story/email), **stack** (framework, CSS method, design
system, Storybook), **platform** (web / RN-Expo), **visibility** (public/indexable vs private), **live
browser** (available or not). A vague target makes the wrong steps run.

---

## Step 0 — Frame the target

Read the target, its design doc, and the brief. Detect design-system/tokens, Storybook, platform,
public-vs-private (private → `seo` add-on off), live browser. Resolve only owner-only decisions (scope,
light-fix vs full redesign, brand constraints) in one `AskUserQuestion` batch. State what you skip and
why. **Do not ask anything the code can answer.**

---

## Step 1 — `audit-first` **[GATE · redesigns only]**

**Agent:** `design-audit-first`. **Purpose:** record equity before destroying it.

Render the existing surface, screenshot it (light/dark/mobile via `agent-browser`), and write
`.design-review/audit-first.md` with **Keep** (what already works, `file:line`) and **Attack** (first-read
flatness hypotheses). Skip only for greenfield — and say so.

---

## Step 2 — `reference-research` **[GATE · ALWAYS · the #1 lever against flat]**

**Agent:** `design-reference-research`. **Purpose:** ground the design in live 2026 references so it can't
regress to the training-data average.

1. Load `agent-browser`; open `https://dribbble.com/shots/popular/web-design` (2026 popular) and **2–3
   real domain competitors**; screenshot relevant surfaces.
2. Extract **3–5 concrete, reproducible patterns** — each tagged `[layout|type|color|density|motion]`,
   named specifically (a move you can implement, not a vibe).
3. Decide **copy + combine + house layer (≈5-in-1)**: what to take from each, how they combine, how the
   project's identity/tokens reskin them so the result could only be *this* product.
4. Write `.design-review/references.md` (sources, patterns, combined direction, and a one-line "bar" for
   what alive-vs-flat means *for this target*).

**Without this artifact, stop.** There is nothing for the verdict to judge "alive" against.

---

## Step 3 — The 4 core skills, REAL invocation **[GATE · in order]**

Each lens is an agent that **loads the real SKILL.md via the Skill tool** and is passed *the target +
`.design-review/references.md` + the project tokens*. The orchestrator never summarises the skill. Findings
accumulate (drop nothing) and cite `file:line`.

### 3a — `design-lens-impeccable` (loads `impeccable`)
Structure, visual hierarchy, IA, cognitive load, spacing/typography, token deviations, the scored audit.
Apply the small obvious fixes the skill owns. **Flag correct-but-generic structure** as a vitality finding
(it feeds 3b).

### 3b — `design-lens-taste` (loads `design-taste-frontend` / `taste-skill`) — **anti-templated GATE**
Run the skill's anti-slop/taste rules **and** apply the **anti-templated gate**: if the output could be any
SaaS template (default card grid, hero + 3 feature cards, untouched shadcn radii/shadows, no house layer,
evenly-flat density, decorative/absent motion), the gate **FAILS** — return verdict `TEMPLATED` with the
2–3 specific moves (from step 2) that make it singular. **Exit criterion: "this could only be THIS
product."** Anti-templated items are **P1 vitality findings**, pre-selected.

### 3c — `design-lens-motion` (loads `emil-design-eng`) — **signature motion**
Two tiers. **Hygiene (necessary):** press/active feedback, hover transitions, loading/skeleton,
view/state transitions, `prefers-reduced-motion`. **Signature (the bar):** land **at least one memorable
motion moment** tied to a step-2 reference (staggered entrance, scroll reveal, depth/parallax, count-up,
delight on the key action). Hover-only is a fail. The signature moment is a **P1 vitality finding**.

### 3d — `design-lens-a11y` (loads `web-design-guidelines`)
AA contrast (≥4.5:1, ≥3:1 large/UI), visible focus, full keyboard reach, correct roles/labels, logical
headings, meaningful `alt`, reduced-motion honored by the new signature motion. **Every WCAG A/AA failure
is P1.** Watch the seams the vitality work opened (bold colors dropping contrast, motion ignoring
reduced-motion). a11y is never traded for "alive".

> **Add-ons (skippable, opt-in), run here if installed/relevant:** `huashu-design` (independent second
> anti-slop lens), `review-animations` (motion timing/easing/jank critique), `seo` (**public targets
> only**), a mobile-design skill (RN/Expo). These sharpen the result but are not gates.

---

## Step 4 — Apply fixes (multi-select)

Merge all findings into one deduplicated list: **P1** broken/identity/a11y · **P2** improvement · **P3**
polish. Each item: one-line description, skill tag(s) (`[impeccable, web-design-guidelines]`), `file:line`,
**recommended fix first** + live alternatives. Present a multi-select checklist (`AskUserQuestion`,
`multiSelect: true`) with **P1 + the anti-templated and signature-motion items pre-selected** — those are
why the target was flat; they are not optional polish. Apply only what's chosen.

---

## Step 5 — Informed re-pass

Re-run only the lenses the chosen fixes touch (layout → 3a + live; motion → 3c + verdict; contrast → 3d +
verdict). Catch the new seams. Surface genuinely new findings in a short follow-up batch; don't re-litigate
settled items.

---

## Step 6 — `vitality-verdict` **[GATE]**

**Agent:** `design-vitality-verdict`. **Purpose:** decide alive vs flat against the render and the
references — the only place vitality is actually settled.

1. Render the real target live (light/dark/mobile) via `agent-browser`. Screenshots are ground truth.
2. **Diff against `.design-review/references.md`:** for each pattern that was meant to land, did it land or
   regress to the mean during build?
3. Check the bar: **house layer** present? **density/bento** (no scroll for the key content)? **signature
   motion moment fires** (verify live, not from code)? **typography with a point of view**?
4. Core Web Vitals (LCP/CLS/INP/TTFB) — perf is a UX gate.
5. Emit an explicit **`alive` / `templated` / `flat`** verdict → `.design-review/verdict.json` (the hook
   reads it). If no live browser, the verdict is provisional and conservatively `templated` (you can't claim
   "alive" for a design no one looked at).

---

## Step 7 — Vitality loop **[GATE · until the bar is met]**

If the verdict is not `alive`, **iterate steps 3–6** — pull a sharper reference, push the house layer, raise
density, land the motion moment — up to **N rounds (default 3)**. Each loop must move the verdict toward
`alive` or explain why the bar can't be met (then the owner decides). **Never report done on a
`templated`/`flat` verdict.**

---

## Chaining findings

Every finding flows forward; nothing is discarded between steps. When two skills flag the same issue, merge
into one item and list both (`[impeccable, web-design-guidelines]`) — higher confidence, pre-selected. Keep
the most specific description (actual ratio, path, component).

---

## After the checklist: verification

1. **Typecheck** (if code changed).
2. **Token audit** — no hardcoded color/spacing/type introduced.
3. **Identity consistency** — still reads as this product's family.
4. **Closing screenshots** — light/dark/mobile (the evidence).
5. **Core Web Vitals** — re-run after any perf-related fix.
6. **The verdict reads `alive`** — otherwise the run failed; surface it as such.

→ Back to [design-review](../README.md)
</content>
