---
name: design-review
description: "UNIFIED ORCHESTRATOR for design skills — groups ALL design skills and runs them in recommended order, ROUTING each to its correct command/mode, ACCUMULATES all suggestions into one prioritized list, ASKS the user (multi-select, P1 pre-marked) what to apply, and APPLIES the chosen ones by routing to the owning fix command. On top: vitality telos — audit-first (redesigns) → reference-research GATE (Dribbble 2026 + competitors + ui-ux-pro-max vocabulary) → 4 CORE skills REALLY invoked and ROUTED (impeccable→design-taste-frontend→emil-design-eng→web-design-guidelines) → explicit vitality-verdict (alive/templated/flat) → loop. Bootstrap: detects and INSTALLS referenced skills (never assumes 'not installed'). Trigger: 'improve design', 'make this alive / less flat', 'design review', '/design-review <target>'."
---

# design-review — UNIFIED ORCHESTRATOR (v2.1, 2026-06-29)

The canonical domain-agnostic methodology lives as the public repo
[`davidgarciagordo/design-review`](https://github.com/davidgarciagordo/design-review). Project-specific
instantiations reference this file and override where project identity differs.

---

## The grace of this skill (v2.1 — read this first)

design-review **groups ALL design skills and orchestrates them in a UNIFIED flow**: runs each in recommended
order **routing to its correct command/mode**, **ACCUMULATES** all their suggestions into a single
prioritized list, **ASKS the user** (multi-select, P1 pre-marked) what to apply, and **APPLIES** the chosen
ones by routing to the owning fix command. On top of that accumulate→ask→apply loop (inherited from v1)
comes the **vitality layer** from v2: reference-research gate + vitality-verdict + loop.

- **v1** = accumulate + multi-select.
- **v2** = vitality (but invoked skills **bare**).
- **v2.1** = fuses both **and fixes the bare-invocation bug**: each skill is **routed** to its
  command/mode and passed the correct input.

---

## The telos (changes everything)

The old question — *"does this design have defects?"* — has a ceiling: **correct-but-flat**. You can pass
every contrast check, every spacing rule, every a11y criterion and still ship a screen that looks like a
2024 template with the life sanded off. Removing defects never adds vitality.

This pipeline asks a different question:

> ### Is this design ALIVE and unmistakably 2026 **against these specific references**?

- **Correctness is the floor, not the bar.** WCAG AA, token usage, no overflow — table stakes. A target
  that passes all of them and still reads as generic has **FAILED** this pipeline.
- **The verdict is explicit:** every run ends with **`alive` / `templated` / `flat`**, judged against
  real 2026 references pulled live in step 2 — not against the agent's memory of "good design".
- **Vitality is built, not inspected.** The lever is *reference-driven design* (copy + combine +
  house layer) and *signature motion* (a memorable moment, not just hover hygiene) — added in, not
  filtered out.

If you only have time for one idea: **a flat design is a bug, even when nothing is "wrong".**

---

## Why it failed before (the four root causes v2.1 fixes)

1. **Wrong telos.** A defect-removal loop converges on "correct flat". → Fixed by **vitality-verdict**
   (step 6) and **vitality loop** (step 7): the run is not done until the verdict is `alive`.
2. **No reference research.** Designing from memory reproduces the average of training data — i.e. a
   template. → Fixed by **reference-research (step 2), a non-skippable gate**: Dribbble 2026 popular +
   2–3 domain competitors, live, via agent-browser + `ui-ux-pro-max` vocabulary. *This is the #1 lever
   against flat.*
3. **Skills paraphrased OR invoked bare.** Bulleting "what impeccable would say" gets a lossy echo;
   invoking `skill: "impeccable"` bare (no args) stalls the skill in its router/menu/setup/network. →
   Fixed by **REAL and ROUTED invocation**: each lens agent **loads the actual SKILL.md via the Skill
   tool routed to its command/mode** and is passed the correct input.
4. **Skills assumed "not installed".** → Fixed by **Bootstrap (step 0)**: detect → install →
   (temp-clone fallback if needed) → use. No referenced skill is ever skipped silently.

---

## How the pipeline is built (executable, not advisory)

This is a set of **agents + a `/design-review` command + a hook**:

| Piece | File | Role |
|---|---|---|
| Orchestrator command | `commands/design-review.md` | `/design-review <target>` — runs the unified flow IN ORDER |
| Audit-first gate | `agents/design-audit-first.md` | Redesigns only: screenshot current + "what to keep" |
| **Reference-research gate** | `agents/design-reference-research.md` | **[GATE]** Dribbble 2026 + competitors + `ui-ux-pro-max` vocabulary; 3–5 patterns; copy+combine+house |
| Lens: structure/audit | `agents/design-lens-impeccable.md` | **routes** `impeccable audit` + `critique` |
| Lens: anti-templated | `agents/design-lens-taste.md` | **routes** `design-taste-frontend` §11 redesign-audit + §14; gate that FAILS generic output |
| Lens: signature motion | `agents/design-lens-motion.md` | **routes** `emil-design-eng` (concrete question inline) |
| Lens: accessibility | `agents/design-lens-a11y.md` | **WebFetch** guidelines → cache → `web-design-guidelines` |
| Vitality verdict | `agents/design-vitality-verdict.md` | Live check + diff vs references → `alive/templated/flat` |
| Enforcement | `hooks/design-review-gate.js` | PostToolUse: UI write with no `alive` verdict → warn/block |

**Rule for every lens agent:** *load the skill ROUTED to its command/mode, pass it the target + the step-2
references, return its findings.* **Never** summarise the skill or invoke it bare.

---

## Step 0 — Bootstrap of external skills (FIRST · non-negotiable)

Before running, **detect** the skills the pipeline references and **ensure they are installed**. Never
assume "not installed" and never skip silently. Mechanism in priority order:

1. **Available as plugin/skill** (in `~/.claude/skills`, marketplace, or `.claude/skills`) → use it.
2. **Missing → install it** (`npx skills add <author/repo>` or `claude plugin install <plugin>@<marketplace>`).
3. **Fallback if it cannot be installed formally** → **clone the repo to a temp dir and read/use its
   `SKILL.md` directly** ("at a minimum, know how to use it by installing it in a temp location or
   similar"). Document the exact command per skill:

| Skill | Role | Detect / install |
|---|---|---|
| `impeccable` *(core)* | structure / audit | `git clone https://github.com/pbakaus/impeccable ~/.claude/skills/impeccable` |
| `design-taste-frontend` / `taste-skill` *(core)* | anti-templated | `git clone https://github.com/Leonxlnx/taste-skill ~/.claude/skills/taste-skill` |
| `emil-design-eng` *(core)* | signature motion | `git clone https://github.com/emilkowalski/skills` (use `emil-design-eng` dir) |
| `web-design-guidelines` *(core)* | a11y AA | Claude Code default skill library |
| `ui-ux-pro-max` *(wired intelligence)* | styles/palettes/font-pairings/UX guidelines | `claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill` |
| `agent-browser` | reference + verdict live | Claude Code built-in / project-configured |
| `huashu-design` *(add-on)* | 2nd anti-slop | `git clone https://github.com/alchaincyf/huashu-design` |

> **`review-animations` does NOT exist as a standalone skill/command** — it is **optional, only if
> installed** (lives in the `emilkowalski/skills` repo). Treat it gracefully — never break the pipeline
> on its absence.

---

## The skills this orchestrates (CORE mandatory + design intelligence + add-ons)

### 4 CORE skills (gates · routed in this exact order)

1. **`impeccable`** → `audit` (technical) + `critique` (heuristic). Structure, hierarchy, IA, cognitive
   load, tokens. *(Lead lens.)*
2. **`design-taste-frontend`** (`taste-skill`) → **redesign-audit mode (§11.A detect, §11.B audit) +
   §14 pre-flight**. Anti-slop **and anti-templated**: the lens that refuses generic. Carries the
   anti-templated gate.
3. **`emil-design-eng`** → review with the concrete question inline. Polish **and signature motion**.
4. **`web-design-guidelines`** → guidelines fetched via WebFetch + cached + passed as input → a11y AA,
   keyboard, focus, contrast.

### Design intelligence (wired, not an add-on)

- **`ui-ux-pro-max`** — 50+ styles, 161 palettes, 57 font-pairings, 99 UX guidelines, 25 chart types.
  Wired across three phases:
  - **Reference-research (step 2):** vocabulary to name styles/palettes/font-pairings precisely.
  - **Diagnosis (step 3e):** UX guidelines as an extra UX lens.
  - **Fix (step 5):** generation/style reference — namespaces `ui-ux-pro-max:design` / `:design-system`
    / `:ui-styling`.

### Add-ons (optional · opt-in · not gates)

`huashu-design` (2nd anti-slop — if used, **force review mode** and grant `WebSearch`) ·
`review-animations` (**only if installed**) · `seo` (public targets only) ·
`design-mobile-apps` (RN/Expo) · `web-accessibility` (WCAG 2.2 extra alongside step 3d).

---

## Suite → phase mapping (what each owning command routes to)

| Skill | DIAGNOSIS (step 3 — run) | FIX (step 5 — route chosen items) |
|---|---|---|
| `impeccable` | `audit`, `critique` | `polish` · `layout` · `colorize` · `animate` · `typeset` · `harden` · `bolder` · `quieter` · `distill` · `delight` · `clarify` · `adapt` · `optimize` |
| `design-taste-frontend` | §11 redesign-audit (§11.A detect, §11.B audit) | §11.D modernisation levers + §14 pre-flight (close) |
| `emil-design-eng` | review (motion diagnosis, concrete question inline) | motion framework (staggered entrance / reveal / depth / delight) |
| `web-design-guidelines` | review vs cached guidelines | fixes to `impeccable harden`/`clarify` or direct corrections |
| `ui-ux-pro-max` | UX guidelines + style/palette/font vocabulary (also in step 2) | generation/style reference (`:design` / `:ui-styling` / `:design-system`) |

---

## Pre-requisite (design-system-first)

BEFORE touching anything: check the project's design system / component library / Storybook for existing
reusable components. Reuse > reinvent. If a reusable piece is missing → create it **in the design system**
(never duplicate it loosely in a screen).

---

## The unified flow (imperative · gated · in order)

> Every step accumulates findings (never drop earlier ones) and cites `file:line`. Gates marked
> **[GATE]** cannot be skipped; the run does not proceed past a failed gate.

### 0. Bootstrap & frame

**Bootstrap** (above): detect + install referenced skills (temp-clone fallback if needed). **Context
setup:** ensure `PRODUCT.md`/`DESIGN.md` for impeccable (run `scripts/context.mjs`; if `NO_PRODUCT_MD`,
generate minimal docs from the project's design doc — do NOT let impeccable fall into its `init` flow).
**Frame:** read the target, its design doc, and brief; detect design system/tokens, Storybook, platform,
public vs private (private → SEO off), live browser. Resolve only owner-only decisions in **one**
`AskUserQuestion` batch (≤4). State what is skipped and why.

### 1. `audit-first` **[GATE — redesigns only]**

Dispatch **`design-audit-first`**: screenshot the current state + write `.design-review/audit-first.md`
("what to keep" equity + "what to attack"). The taste lens uses this in its §11.B. Skip only for
greenfield — say so explicitly.

### 2. `reference-research` **[GATE — ALWAYS · the #1 lever against flat]**

Dispatch **`design-reference-research`**: agent-browser over `dribbble.com/shots/popular/web-design` + 2–3
domain competitors, **+ `ui-ux-pro-max` as vocabulary** (styles/palettes/font-pairings). Extract **3–5
patterns** and write the **copy+combine+house-layer** decision in `.design-review/references.md` (includes
the "alive vs flat" bar for this target, and the **dials** the taste lens will use). Without that artifact,
**stop**.

### 3. DIAGNOSIS — CORE skills, ROUTED, in order **[GATE]**

Dispatch each lens in turn, passing it the target + `.design-review/references.md` (+ audit-first).
Each one **loads its skill ROUTED to its command/mode** and returns findings (cite `file:line`).
**Accumulate into ONE single prioritized list, each item tagged `[skill]`.** Drop nothing.

- **3a · `design-lens-impeccable`** → `impeccable audit` + `critique`.
- **3b · `design-lens-taste`** → `design-taste-frontend` §11 redesign-audit + §14. **Anti-templated
  gate** (FAILS if the output could be any SaaS template). Exit criterion: *"this could only be THIS
  product."*
- **3c · `design-lens-motion`** → `emil-design-eng` review (concrete question inline) + **one
  memorable motion moment**.
- **3d · `design-lens-a11y`** → WebFetch guidelines → cache → `web-design-guidelines` (AA).
- **3e · `ui-ux-pro-max` (UX guidelines)** → UX guidelines pass as an extra lens (wired, not gate).
  Opt-in add-ons (`huashu-design`, `web-accessibility`, `review-animations` if installed) run here.

### 4. ASK — multi-select **[the heart of the orchestrator]**

Merge ALL findings into the single deduplicated prioritized list (P1 broken/identity/a11y · P2
improvement · P3 polish), each item tagged `[skill]` with its **owning fix command** and recommended fix.
Present a **multi-select checklist** (`AskUserQuestion`, `multiSelect: true`) with **P1 + anti-templated
+ signature-motion PRE-MARKED** (those are why the target was flat; they are not optional polish). Apply
only what is chosen.

### 5. APPLY (FIX) + informed re-pass

Apply each chosen item **routing to its owning fix command** (suite→phase mapping table above):
impeccable `polish`/`layout`/`animate`/… · taste §11.D + §14 · emil motion framework ·
ui-ux-pro-max `:design`/`:ui-styling`. Then re-run only the lenses touched by the chosen fixes;
surface genuinely new findings in a short follow-up batch — do not re-litigate settled items.

### 6. `vitality-verdict` **[GATE]**

Dispatch **`design-vitality-verdict`**: live render (light/dark/mobile via agent-browser), **diff against
references.md**, house layer / density-bento / motion-fires / typography-with-a-point-of-view checks,
Core Web Vitals, and verdict **`alive`/`templated`/`flat`** written to `.design-review/verdict.json`.

### 7. Vitality loop **[GATE — until the bar is met]**

If not `alive`, **iterate steps 3–6** (sharper reference, stronger house layer, higher density, real
motion moment) up to **N rounds (default 3)**. Each loop must move the verdict toward `alive` or explain
why the bar cannot be met (then the owner decides). **Never report done on `templated`/`flat`.**

---

## Output

A single deduplicated findings list (P1/P2/P3, tagged `[skill]`, owning fix command + recommended fix
first), applied via multi-select, **plus the explicit vitality verdict and the reference it was judged
against**. Then verify: typecheck, token usage (no hardcoded color/spacing/typography), identity
consistency, closing screenshots (light/dark/mobile), Core Web Vitals — and the verdict reads `alive`.

See `references/pipeline.md` for step-by-step detail, `templates/vitality-verdict.md` for the verdict
shape, `templates/findings-checklist.md` for the checklist template, and `references/attribution.md`
for skills and install commands.

---

## Rules

- **Skills loaded and ROUTED, never paraphrased or invoked bare.** If you find yourself writing
  "impeccable would say…" or invoking a skill with no `args`, stop and route it to a command.
- Project-specific design law (brand tokens, product identity, density rules) lives in the project's own
  design doc — reference it, don't duplicate it here.
- Work in an isolated branch/worktree. Run all live/browser steps sequentially (one browser thread),
  never in parallel.
- The live visual check + reference diff is always last. It is the reality test static skills cannot
  give — and the only place "alive vs flat" is actually decided.
- When delegating to a sub-agent that touches UI: pass it "apply this pipeline + the project's design doc".
