---
description: "Run the design-VITALITY pipeline on a target. Gated, imperative: audit-first → reference-research → 4 core skills invoked in order → apply fixes → vitality verdict (alive/templated/flat) → loop. Cures flat, templated UI. Usage: /design-review <target>"
argument-hint: "<target — file path, route, component, story, or email>"
---

# /design-review — orchestrate the design-vitality pipeline

**Target:** `$ARGUMENTS` (a file path, app route, component, Storybook story, or email).

You are the **orchestrator**. Your telos is not "remove defects" but **make this target ALIVE and
unmistakably 2026** — judged against real references, ending in an explicit verdict. A target that
passes every correctness check and still looks templated has **failed**. Read `SKILL.md` for the full
telos; this command is its executable spine.

**Hard rules**
- Run the steps **IN ORDER**. Steps marked **[GATE]** cannot be skipped or reordered.
- Each lens agent **loads the real skill via the Skill tool** and is passed the target + the step-2
  references. **Never paraphrase a skill** in your own words — dispatch the agent that loads it.
- Run all browser/live steps **sequentially** (one browser thread), never in parallel.
- Work in an isolated branch/worktree.

---

## Step 0 — Frame the target (no questions the code can answer)
Read the target, its design doc, and brief. Detect: design system/tokens, Storybook, platform
(web/mobile), public vs private (private → SEO add-on off), live browser available. Then resolve only
owner-only decisions (scope, light-fix vs full redesign, brand constraints) in **one** `AskUserQuestion`
batch (≤4 questions). State anything you skipped and why.

## Step 1 — `audit-first` **[GATE · redesigns only]**
If the target already exists, dispatch the **`design-audit-first`** agent: screenshot the current state
and write "what to keep" to `.design-review/audit-first.md`. Skip only for greenfield (say so).

## Step 2 — `reference-research` **[GATE · ALWAYS · #1 lever against flat]**
Dispatch the **`design-reference-research`** agent. It uses agent-browser to open
`dribbble.com/shots/popular/web-design` (2026) + 2–3 domain competitors, extracts **3–5 patterns**, and
writes the **copy + combine + house-layer** decision to `.design-review/references.md`.
**Do not proceed to design until this artifact exists.** No references → nothing to be "alive" against.

## Step 3 — The 4 core skills, REAL invocation **[GATE · in order]**
Dispatch each lens agent in turn, passing it the target + `.design-review/references.md`. Each one
**loads its SKILL.md via the Skill tool** and returns findings (cite `file:line`). Accumulate; drop
nothing.

1. **`design-lens-impeccable`** → structure, hierarchy, IA, cognitive load, tokens, scored audit.
2. **`design-lens-taste`** → anti-slop **+ anti-templated gate**. If the output could be any SaaS
   template, this gate **FAILS** — the target is rejected, not noted. Exit criterion: *"this could only
   be THIS product."*
3. **`design-lens-motion`** → polish **+ at least one signature motion moment** (staggered entrance,
   reveal, depth, delight) — hover hygiene alone does not pass.
4. **`design-lens-a11y`** → AA contrast, keyboard, visible focus, roles/labels, reduced-motion.

## Step 4 — Apply fixes
Merge all findings into one deduplicated list: P1 (broken/identity/a11y) · P2 (improvement) · P3
(polish), each skill-tagged with a recommended fix first. Present a **multi-select checklist**
(`AskUserQuestion`, `multiSelect: true`) with P1 **and the anti-templated + signature-motion items
pre-selected** — those are why the target was flat; they are not optional polish. Apply only what's
chosen.

## Step 5 — Informed re-pass
Re-run only the lenses the chosen fixes touch (layout → impeccable + live; motion → emil + verdict).
Surface genuinely new findings in a short follow-up batch; don't re-litigate settled items.

## Step 6 — `vitality-verdict` **[GATE]**
Dispatch the **`design-vitality-verdict`** agent: render the real target live (light/dark/mobile),
**diff it against `.design-review/references.md`**, check house layer / density-bento / a fired motion
moment / typographic point of view, run Core Web Vitals, and emit an explicit
**`alive` / `templated` / `flat`** verdict written to `.design-review/verdict.json`.

## Step 7 — Vitality loop **[GATE · until the bar is met]**
If the verdict is not `alive`, **iterate steps 3–6** (sharper reference, stronger house layer, higher
density, a real motion moment) up to **N rounds (default 3)**. Each loop must move the verdict toward
`alive` or explain why the bar can't be met — then the owner decides. **Never report done on a
`templated`/`flat` verdict**; surface it as a failed run.

---

## Closing report
Return: the findings applied, the **final verdict** (`alive`/`templated`/`flat`) and the reference it was
judged against, the closing screenshots (light/dark/mobile), Core Web Vitals, and which add-ons (seo /
mobile / extra lenses) ran or were skipped and why.
</content>
