---
name: design-review
description: "Executable design-VITALITY pipeline for AI agents. Cures flat, lifeless, templated UI. Imperative, gated orchestration: audit-first → reference-research (Dribbble 2026 + competitors) → REAL invocation of 4 core design skills in order (impeccable → design-taste-frontend → emil-design-eng → web-design-guidelines, each LOADED via the Skill tool, never paraphrased) → apply fixes → vitality-verdict (alive / templated / flat) → vitality loop. Closes with a live visual check + a diff against the references. Trigger: \"improve design\", \"make this alive / less flat\", \"design review\", \"/design-review <target>\"."
---

# design-review — a design-VITALITY pipeline for AI agents

**"Run it through design-review"** = put a visual target through an imperative, gated pipeline whose
job is not "remove defects" but **make the design ALIVE and unmistakably 2026**.

## The telos (read this first — it changes everything)

The old question — *"does this design have defects?"* — has a ceiling: **correct-but-flat**. You can
pass every contrast check, every spacing rule, every a11y criterion and still ship a screen that looks
like a 2024 template with the life sanded off. Removing defects never adds vitality.

This pipeline asks a different question:

> ### Is this design ALIVE and unmistakably 2026 **against these specific references**?

- **Correctness is the floor, not the bar.** WCAG AA, token usage, no overflow — table stakes. A
  target that passes all of them and still reads as generic has **FAILED** this pipeline.
- **The verdict is explicit:** every run ends with **`alive` / `templated` / `flat`**, judged against
  real 2026 references pulled live in step 2 — not against the agent's memory of "good design".
- **Vitality is built, not inspected.** The lever is *reference-driven design* (copy + combine +
  house layer) and *signature motion* (a memorable moment, not just hover hygiene) — added in, not
  filtered out.

If you only have time for one idea: **a flat design is a bug, even when nothing is "wrong".**

---

## The three root causes of "flat" this pipeline fixes

1. **Wrong telos.** A defect-removal loop converges on "correct flat". → Fixed by the **vitality
   verdict** (step 6) and the **vitality loop** (step 7): the run is not done until the verdict is
   `alive`.
2. **No reference research.** Designing from memory reproduces the average of training data — i.e. a
   template. → Fixed by **reference-research (step 2), a non-skippable gate**: Dribbble 2026 popular +
   2–3 domain competitors, live, via agent-browser. *This is the #1 lever against flat.*
3. **Skills paraphrased, not invoked.** Bulleting "what impeccable would say" gets a lossy echo of the
   skill. → Fixed by **REAL invocation**: each lens agent **loads the actual SKILL.md via the Skill
   tool**. This file never restates a skill's content — it only says *what input to pass it*.

---

## How the pipeline is built (executable, not advisory)

This is not a checklist you read — it is a set of **agents + a `/design-review` command + a hook**:

| Piece | File | Role |
|---|---|---|
| Orchestrator command | `commands/design-review.md` | `/design-review <target>` — runs the gates IN ORDER |
| Audit-first gate | `agents/design-audit-first.md` | redesigns only: screenshot current + "what to keep" |
| **Reference-research gate** | `agents/design-reference-research.md` | **NEW** — Dribbble 2026 + competitors; 3–5 patterns; copy+combine+house decision |
| Lens: structure/audit | `agents/design-lens-impeccable.md` | **loads** `impeccable` via Skill tool |
| Lens: anti-templated | `agents/design-lens-taste.md` | **loads** `design-taste-frontend`; **gate that FAILS generic output** |
| Lens: signature motion | `agents/design-lens-motion.md` | **loads** `emil-design-eng`; demands a memorable motion moment |
| Lens: accessibility | `agents/design-lens-a11y.md` | **loads** `web-design-guidelines` |
| Vitality verdict | `agents/design-vitality-verdict.md` | **NEW** — live check + diff vs references → `alive/templated/flat` |
| Enforcement | `hooks/design-review-gate.js` | PostToolUse: front diff with no `alive` verdict → warn/block |

**Rule for every lens agent:** *load the skill, pass it the target + the references from step 2, return
its findings.* Do **not** summarise the skill in the pipeline. Skills are reasoning an agent **loads**,
never prose the orchestrator parrots.

---

## The 4 CORE skills (mandatory · non-skippable · invoked in this exact order)

These are David's canonical design skills. The pipeline does not run without them; if one is missing,
offer to install it (Attribution) — do not silently skip a core lens.

1. **`impeccable`** — structure, visual hierarchy, information architecture, cognitive load, tokens,
   the scored audit. *(Lead lens.)*
2. **`design-taste-frontend`** (a.k.a. `taste-skill`) — anti-slop **and anti-templated**: the lens that
   refuses generic. Carries the **anti-templated gate** (below).
3. **`emil-design-eng`** — polish **and signature motion**: staggered entrances, reveals, depth,
   one memorable moment — not just micro-hover hygiene.
4. **`web-design-guidelines`** — accessibility AA, keyboard, visible focus, contrast.

**Add-ons (skippable, opt-in):** `seo` (public targets only), a mobile-design skill (RN/Expo targets),
and optional extra lenses (`huashu-design` second anti-slop, `review-animations` motion critique). These
sharpen the result but are not gates.

---

## The pipeline (imperative · gated · in order)

> Every step accumulates findings (never drop earlier ones) and cites `file:line`. Gates marked
> **[GATE]** cannot be skipped; the run does not proceed past a failed gate.

### 1. `audit-first` **[GATE — redesigns only]**
Before changing anything on an existing surface: render it, **screenshot the current state**, and write
**"what to keep"** (the equity — the parts already working). Skip only for greenfield (nothing to keep).
→ agent `design-audit-first`.

### 2. `reference-research` **[GATE — ALWAYS · the #1 lever against flat]**
**You may not design until this runs.** Via **agent-browser**:
- Open **`dribbble.com/shots/popular/web-design`** (2026 popular) and **2–3 real competitors** in the
  target's domain.
- Extract **3–5 concrete patterns** worth stealing (layout move, type treatment, color/contrast idea,
  density/bento structure, a signature motion moment).
- Decide explicitly: **copy + combine (≈5-in-1) + house layer** — what to take from each, how they
  combine, and how the project's own identity/tokens reskin them.
- **Output a `references` artifact** (saved to `.design-review/references.md`) — step 6 diffs the final
  result against it.

→ agent `design-reference-research`. Without this artifact, **stop**: there is nothing to be "alive"
against.

### 3. REAL invocation of the 4 core skills **[GATE — in order]**
Each lens is a separate agent that **loads the real SKILL.md via the Skill tool** and is passed *the
target + the step-2 references*. The orchestrator never paraphrases the skill.

- **3a · `impeccable`** → structure, hierarchy, IA, cognitive load, tokens, scored audit.
- **3b · `design-taste-frontend`** → anti-slop + **anti-templated gate (FAILS the run on generic
  output)**: if the result could be any SaaS template — default shadcn card grid, hero + 3 feature
  cards, stock spacing, no point of view — it is **rejected**, not noted. The gate's exit criterion is
  *"this could only be THIS product"*.
- **3c · `emil-design-eng`** → polish **+ signature motion**: the agent must land **at least one
  memorable motion moment** — staggered entrance, a reveal on scroll/load, depth/parallax, a moment of
  delight — not merely `transition-colors` on hover. Hover hygiene is necessary, not sufficient.
- **3d · `web-design-guidelines`** → AA contrast, keyboard, visible focus, roles/labels, reduced-motion.

### 4. Apply fixes
Gather all findings into one deduplicated, prioritised list (P1 broken/identity/a11y · P2 improvement ·
P3 polish), each tagged with the skill(s) that flagged it and a recommended fix. Present a **multi-select
checklist** (P1 + "vitality" items pre-selected) and apply only what's chosen. Multi-select is fine —
but the **anti-templated** and **signature-motion** items are not optional polish; they are why the
target was flat.

### 5. *(implicit)* informed re-pass
Re-run only the lenses the chosen fixes touch (a layout change re-checks impeccable + live; a motion
change re-checks emil + verdict). Catch the seams the fixes open.

### 6. `vitality-verdict` **[GATE — NEW]**
Render the real target (Storybook and/or app route) **live** in light, dark, and mobile via
agent-browser. Then:
- **Diff the result against the step-2 references** — did the chosen patterns actually land, or did the
  design regress to the mean during implementation?
- Check: house layer present? density/bento (no scroll for the key content)? **a memorable motion
  moment** that fires? typography with a point of view?
- Emit an **explicit verdict: `alive` / `templated` / `flat`**, with the one-line reason and the
  reference it's measured against. Also run Core Web Vitals (perf is a UX gate).

→ agent `design-vitality-verdict`. The verdict is written to `.design-review/verdict.json` (machine-
checkable — the hook reads it).

### 7. Vitality loop **[GATE — until the bar is met]**
If the verdict is **not `alive`** (i.e. `templated` or `flat`), **iterate steps 3–6** (pull a sharper
reference, push the house layer, raise density, land the motion moment) — up to **N rounds** (default
3). Each loop must move the verdict toward `alive` or explain why the bar can't be met (then the owner
decides). A run that ends `templated`/`flat` is a **failed** run, surfaced as such.

---

## Output

A single deduplicated findings list (P1/P2/P3, skill-tagged, recommended fix first), applied via
multi-select, **plus the explicit vitality verdict and the reference it was judged against**. Then
verify: typecheck, token usage (no hardcoded color/spacing/type), identity consistency, closing
screenshots (light/dark/mobile), Core Web Vitals — and the verdict reads `alive`.

See `references/pipeline.md` for the per-step reference, `templates/vitality-verdict.md` for the verdict
shape, and `references/attribution.md` for the skills and where to install them.

---

## Notes

- **Skills are loaded, never paraphrased.** If you find yourself writing "impeccable would say…",
  stop and invoke the skill instead.
- Project-specific design law (brand tokens, product identity, density rules) lives in the project's own
  design doc — reference it, don't duplicate it here.
- Work in an isolated branch/worktree. Run the live steps sequentially (one browser thread), never in
  parallel.
- The live visual check + reference diff is always last. It is the reality test static skills cannot give
  — and the only place "alive vs flat" is actually decided.
</content>
</invoke>
