---
name: design-review
description: "UNIFIED ORCHESTRATOR for design skills — groups ALL design skills and runs them in recommended order, ROUTING each to its correct command/mode, ACCUMULATES all suggestions into one prioritized list, ASKS the user (multi-select, P1 pre-marked) what to apply, and APPLIES the chosen ones by routing to the owning fix command. On top: vitality telos — audit-first (redesigns) → reference-research GATE (Dribbble 2026 + competitors + ui-ux-pro-max vocabulary) → 4 CORE skills REALLY invoked and ROUTED (impeccable→design-taste-frontend→emil-design-eng→web-design-guidelines) → explicit vitality-verdict (alive/templated/flat) → loop. Bootstrap: detects and INSTALLS referenced skills (never assumes 'not installed'). Trigger: 'improve design', 'make this alive / less flat', 'design review'; explicit command: '/design-review:run <target>'."
---

# design-review — UNIFIED ORCHESTRATOR (v2.2, 2026-06-30)

> v2.2 adds: a **preflight** that declares every component it uses, ASKS before installing, and records
> skips EXPLICITLY (`scripts/preflight.mjs`); wires **refero** (real-product references), **frontend-design**
> (authoring, folded into the plan), **review-animations** (motion Block/Approve gate), and **huashu-design**
> (asset-integrity + Playwright verify + non-landing builder); and adds **surface routing** (landing vs
> dashboard vs non-web) to resolve the density conflict.

The canonical domain-agnostic methodology lives as the public repo
[`davidgarciagordo/design-review`](https://github.com/davidgarciagordo/design-review). Project-specific
instantiations reference this file and override where project identity differs.

---

## Requires (read before using)

This skill **orchestrates 4 third-party skills — none of them ship with Claude Code by default**. Install
all 4 first, or each of the 4 core lenses fails with `Unknown skill` (confirmed in testing — no silent
degrade for a missing core skill):

| Skill | Author | Install |
|---|---|---|
| `impeccable` | Paul Bakaus (pbakaus) | `git clone https://github.com/pbakaus/impeccable ~/.claude/skills/impeccable` |
| `design-taste-frontend` (`taste-skill`) | Leonxlnx | `npx -y skills@latest add Leonxlnx/taste-skill --skill design-taste-frontend` |
| `emil-design-eng` | Emil Kowalski | `npx -y skills@latest add emilkowalski/skills --skill emil-design-eng` |
| `web-design-guidelines` | Vercel (`vercel-labs/web-interface-guidelines`) | `npx -y skills@latest add vercel-labs/agent-skills --skill web-design-guidelines` (alt: `curl -fsSL https://vercel.com/design/guidelines/install \| bash`) |

`node scripts/preflight.mjs` reports what's present in your environment; full attribution and add-ons in
[references/attribution.md](references/attribution.md).

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

This is a set of **agents + a `/design-review:run` command + a hook**. This skill (`design-review:design-review`)
auto-triggers by description/context (methodology + telos); `/design-review:run <target>` is the explicit,
step-by-step entrypoint — they share the same pipeline, invoked two different ways:

| Piece | File | Role |
|---|---|---|
| Orchestrator command | `commands/run.md` | `/design-review:run <target>` — runs the unified flow IN ORDER |
| Audit-first gate | `agents/design-audit-first.md` | Redesigns only: screenshot current + "what to keep" |
| **Reference-research gate** | `agents/design-reference-research.md` | **[GATE]** Dribbble 2026 + competitors + `ui-ux-pro-max` vocabulary; 3–5 patterns; copy+combine+house |
| **Context-pack** | `agents/design-context-pack.md` | **discover ONCE** — source map + file:line + shared-found; lenses judge this, not re-scan (token lever) |
| Lens: structure/audit | `agents/design-lens-impeccable.md` | **routes** `impeccable audit` + `critique` (READ-ONLY) |
| Lens: anti-templated | `agents/design-lens-taste.md` | **routes** `design-taste-frontend` §11 redesign-audit + §14; gate that FAILS generic output |
| Lens: signature motion | `agents/design-lens-motion.md` | **routes** `emil-design-eng` (concrete question inline) |
| Lens: accessibility | `agents/design-lens-a11y.md` | **WebFetch** guidelines → cache → `web-design-guidelines` |
| Vitality verdict | `agents/design-vitality-verdict.md` | Live check + diff vs references → `alive/templated/flat` |
| Enforcement | `hooks/design-review-gate.js` | PostToolUse: UI write with no `alive` verdict → warn/block |

**Rule for every lens agent:** *load the skill ROUTED to its command/mode, pass it the target + the step-2
references, return its findings.* **Never** summarise the skill or invoke it bare.

---

## Step 0 — Preflight: declare what it uses, ASK, install-or-skip-EXPLICITLY (FIRST · non-negotiable)

The orchestrator **declares every component it uses and how to install it** — single source of truth is
**`scripts/preflight.mjs`** (the MANIFEST). It NEVER installs silently and NEVER assumes "not installed".

1. **Detect** — run `node "${CLAUDE_PLUGIN_ROOT}/scripts/preflight.mjs" --write`: prints present/missing + writes
   `.design-review/preflight.md`. Read-only (filesystem globs + MCP-config content + `which`).
2. **Ask** — for MISSING components, present **one** `AskUserQuestion` batch: per item *install now* or
   *skip*, showing the manifest's exact install command. Never decide for the user.
3. **Install chosen** → run the command, then **`/reload-plugins` + `/reload-skills`** (if the build lacks
   them, tell the user to restart — skills/plugins/MCP load at session start).
4. **Skip = EXPLICIT** → recorded in `.design-review/preflight.md` AND announced in the run output
   ("SKIPPED `<id>` → lens/phase `<x>` degraded"). No silent skips, ever.
5. **Fallback** → if a chosen component can't be installed formally, clone its repo to a temp dir and read
   its `SKILL.md` directly so the pipeline still knows how to use it.

Manifest summary (`tier`: **core** gate · **wired** integrated · **addon** optional):

| Component | tier | Role | Install |
|---|---|---|---|
| `impeccable` | core | structure / audit / scored critique | `git clone https://github.com/pbakaus/impeccable ~/.claude/skills/impeccable` |
| `taste-skill` (`design-taste-frontend`) | core | anti-templated / composition | `npx -y skills@latest add Leonxlnx/taste-skill --skill design-taste-frontend` |
| `emil-design-eng` | core | signature motion / polish | `npx -y skills@latest add emilkowalski/skills --skill emil-design-eng` |
| `web-design-guidelines` | core | a11y AA (file:line) | `npx -y skills@latest add vercel-labs/agent-skills --skill web-design-guidelines` (third-party, Vercel) |
| `ui-ux-pro-max` | wired | styles/palettes/font-pairings/UX/charts DB | `claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill` (needs `python3`) |
| `review-animations` | wired | motion Block/Approve gate (STANDARDS.md) | `npx -y skills@latest add emilkowalski/skills --skill review-animations` |
| `frontend-design` (Anthropic) | wired | authoring: token-plan + signature + UX-writing (**folded into taste/plan**) | Anthropic agent-skills marketplace |
| `refero` | wired | real-product reference (gallery + DESIGN.md tokens) | Refero MCP (opt-in); default = agent-browser over refero.design |
| `huashu-design` | addon | asset-integrity + Playwright verify + non-landing builder | `git clone https://github.com/alchaincyf/huashu-design ~/.claude/skills/huashu-design` |
| `agent-browser` | wired | live reference + live verdict | Claude Code built-in |

> `review-animations` and `refero` raw tokens **degrade gracefully** — never break the pipeline on their
> absence; announce the degraded lens and continue.

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

### Design intelligence (wired, not add-ons)

- **`ui-ux-pro-max`** — 84 styles, 161 palettes, font-pairings, 99 UX guidelines, charts. Wired in:
  - **3a-pre baseline:** `search.py --design-system/--domain/--stack` → style archetype + UX rules +
    anti-patterns for this product type. Its raw palettes/fonts are **reference only** (project tokens win).
  - **Reference-research (step 2):** vocabulary to name styles/palettes/font-pairings precisely.
  - **Diagnosis (step 3e):** UX guidelines as an extra UX lens.
  - **Fix (step 5):** generation/style reference (`:design` / `:design-system` / `:ui-styling`).
- **`refero`** — real products **in production** (Vercel, Mercury, Linear…). Wired in **step 2** beside
  Dribbble: gallery via agent-browser (domain competitors that actually shipped) + `DESIGN.md` token specs
  (MCP, opt-in). Tokens are **reference only** → re-translate to the house layer. Default without MCP =
  agent-browser over refero.design.
- **`frontend-design`** (Anthropic) — authoring criterion, **folded into the plan / taste**, not a 5th
  lens (it overlaps taste): a 4–6 hex token-plan + **one signature element** + the explicit "3 AI-default
  looks to avoid" + the UX-writing checklist. Feeds step 2b (plan) and step 5 (fix).
- **`review-animations`** (in `emilkowalski/skills`) — the **motion Block/Approve gate** (`STANDARDS.md`).
  When present, runs in **3c** and feeds the **verdict (6)** as a binary motion gate. `disable-model-
  invocation=true` → invoke explicitly. Degrades gracefully if absent.

### Surface routing (resolves the density conflict — decide in step 0)

The lenses disagree on density by design; **route by surface**:
- **landing / portfolio / marketing** → taste discipline ("cut ruthlessly"); taste is the primary lens.
- **dashboard / app / copilot / data-dense** → huashu **density exception** (≥3 dense elements) + house
  bento; taste's landing-only rules relax.
- **non-web (slides / narrated video / app mockup)** → **`huashu-design` is the primary builder** (taste
  declares these out of scope); the lenses become a review pass over its output.

### Add-ons (optional · opt-in · not gates)

`huashu-design` *(also: asset-integrity pre-build + Playwright verify — see steps 2 & 6)* ·
`seo` (public targets only) · `design-mobile-apps` (RN/Expo) · `web-accessibility` (WCAG 2.2 extra).

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

### 0. Preflight & frame

**Preflight** (above): `node "${CLAUDE_PLUGIN_ROOT}/scripts/preflight.mjs" --write` → ASK to install missing (one batch) →
install chosen + reload → record skips EXPLICITLY. **Context setup:** ensure `PRODUCT.md`/`DESIGN.md` for
impeccable (run its `scripts/context.mjs`; if `NO_PRODUCT_MD`, generate minimal docs from the project's
design doc — do NOT let impeccable fall into its `init` flow). **Frame:** read the target, its design doc,
and brief; detect design system/tokens, Storybook, platform, public vs private (private → SEO off), live
browser. **Surface routing:** classify the target (landing/portfolio · dashboard/dense · non-web) and set
the density regime + primary lens/builder accordingly (see "Surface routing"). Resolve only owner-only
decisions in **one** `AskUserQuestion` batch (≤4). State what is skipped and why.

### 1. `audit-first` **[GATE — redesigns only]**

Dispatch **`design-audit-first`**: screenshot the current state + write `.design-review/audit-first.md`
("what to keep" equity + "what to attack"). The taste lens uses this in its §11.B. Skip only for
greenfield — say so explicitly.

### 2. `reference-research` **[GATE — ALWAYS · the #1 lever against flat]**

Dispatch **`design-reference-research`**: agent-browser over `dribbble.com/shots/popular/web-design`
(2026 trend) **+ `refero`** (real products in production — domain competitors that shipped: gallery via
agent-browser, or `DESIGN.md` token specs via MCP if present) **+ `ui-ux-pro-max` as vocabulary**
(styles/palettes/font-pairings). Extract **3–5 patterns** → write the **copy+combine+house-layer** decision
in `.design-review/references.md` (includes the "alive vs flat" bar and the **dials** the taste lens uses).
Without that artifact, **stop**. **Asset-integrity (if a brand/product is named):** before generating,
verify facts and pull REAL assets (`huashu-design` §1.a brand-spec + WebSearch / the project's own client
assets) — never invent logos/screenshots/data.

### 2b. Plan (authoring) — folds in `frontend-design`

Write the design plan into `.design-review/references.md`: a **4–6 hex token-plan** (subordinate to the
project design-system tokens — those win), **2+ typographic roles**, **one signature element** that
embodies the brief, and the explicit **"3 AI-default looks to avoid"** + UX-writing checklist (from
`frontend-design`). This is authoring criterion, not a lens.

### 2c. Context-pack — discover ONCE (token lever · the fix for "every agent rediscovers")

Build **`.design-review/context-pack.md`** with ONE agent (`design-context-pack`): the source map
(component tree, props, tokens-in-use, **file:line** of every point of interest), the relevant source
excerpts, the cached baseline screenshots (from audit-first), the cached a11y guidelines, and the
**already-known shared findings** (the audit-first attack list). This is the unified working memory.
Without it, each of the 4+ lenses re-reads the whole surface and independently re-derives the same bugs
(measured: ~80% overlap, ~100k tokens each). With it, lenses **judge a prepared map**, not re-scan.

### 3. DIAGNOSIS — CORE skills, ROUTED, in order **[GATE]**

Dispatch each lens in turn, passing it **`.design-review/context-pack.md` + `references.md`**. Each
**loads its skill ROUTED to its command/mode** and returns findings (cite `file:line`).
Three hard rules (the fixes for the token-waste + control bugs):
1. **Lenses are READ-ONLY** — they have NO Edit/Write; they return findings, NEVER mutate source. (A lens
   that edits during diagnosis bypasses the step-4 ASK gate — the bug this fixes.) All edits happen in
   step 5, in ONE apply pass, after the user's multi-select.
2. **Do NOT re-read source** — everything is in the context-pack. Read source only to confirm a specific
   line the pack lacks.
3. **Do NOT re-report shared findings** — the context-pack lists what audit-first + earlier lenses already
   found; add only YOUR lens's unique angle. Terse output (see Rules).

**Accumulate into ONE single prioritized list, each item tagged `[skill]`.** Drop nothing.

- **3a · `design-lens-impeccable`** → `impeccable audit` + `critique`.
- **3b · `design-lens-taste`** → `design-taste-frontend` §11 redesign-audit + §14. **Anti-templated
  gate** (FAILS if the output could be any SaaS template). Exit criterion: *"this could only be THIS
  product."*
- **3c · `design-lens-motion`** → `emil-design-eng` review (concrete question inline) + **one
  memorable motion moment**. If `review-animations` is present, run it here as the **motion Block/Approve
  gate** (feeds the verdict).
- **3d · `design-lens-a11y`** → WebFetch guidelines → cache → `web-design-guidelines` (AA). Runs **last**
  so it nets the motion `emil` just added.
- **3e · `ui-ux-pro-max` (UX guidelines)** → UX guidelines pass as an extra lens (wired, not gate).
  Opt-in add-ons (`huashu-design`, `web-accessibility`) run here.

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
Reinforced by, when present: **taste §14 pre-flight** (mechanical binary checks), **`review-animations`**
Block/Approve (motion gate), and **`huashu-design` Playwright verify** (screenshots light/dark + console
errors). A motion `Block` or a failed §14 check keeps the verdict below `alive`.

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
- **Lenses are READ-ONLY (diagnosis ≠ apply).** The 4 lens agents carry NO Edit/Write — they return
  findings only. ALL mutation happens in step 5, in ONE apply pass, after the user's multi-select. A lens
  that edits source during diagnosis silently bypasses the ASK gate.
- **Terse output (token-frugal) — enforce on EVERY dispatched agent.** When dispatching any lens/agent,
  append this to its prompt: *"Output TERSE: line 1 = `OK` (clean) or `KO` + ≤8-word why; then findings
  one line each `P# [skill] file:line — problem → fix`. NO prose, no preamble, no restating the skill, no
  summary tables, no Before/After essays."* Verbose agent reports are the #1 output-token waste.
- **Discover once, judge many.** Build the context-pack (step 2c) before the lenses; pass it to each; tell
  each "don't re-read source, don't re-report shared findings." This is the #1 input-token lever.
- Project-specific design law (brand tokens, product identity, density rules) lives in the project's own
  design doc — reference it, don't duplicate it here.
- Work in an isolated branch/worktree. Run all live/browser steps sequentially (one browser thread),
  never in parallel.
- The live visual check + reference diff is always last. It is the reality test static skills cannot
  give — and the only place "alive vs flat" is actually decided.
- When delegating to a sub-agent that touches UI: pass it "apply this pipeline + the project's design doc".

## Memory adapter (pluggable · optional accelerator · NEVER required)

The pipeline works with **no memory tool at all** — the context-pack (a file artifact) is the within-run
memory. A persistent memory tool only *accelerates cross-run* (skip rediscovery on re-runs and the
vitality loop). It is detected, never assumed:

1. **Detect** (orchestrator, step 0): is `claude-mem` present? else any other memory MCP/skill
   (`mem-search`/`get_observations`-style)? else **none**.
2. **Use if present** — step 0: `mem-search "design-review <target|domain>"` → seed the context-pack +
   skip rediscovery of confirmed prior findings + reuse cached domain references (Dribbble/competitors).
   Close: the **orchestrator** (not each agent — avoids write races) writes confirmed findings + verdict
   + domain references to memory.
3. **None → degrade gracefully** — rely on `.design-review/*.md` artifacts only; announce "no persistent
   memory — cross-run rediscovery not cached." Never block, never error.

The interface is generic (search-before / write-after); the orchestrator owns memory I/O so agents stay
stateless and don't repeat each other.
