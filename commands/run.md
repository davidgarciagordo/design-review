---
description: "Run the design-VITALITY pipeline on a target. Gated, imperative: auto-provision skills → audit-first → reference-research → 4 core lenses in order → ONE multi-select (the user's only decision) → apply → vitality verdict (alive/templated/flat) → loop. Cures flat, templated UI. Usage: /design-review:run <target>"
argument-hint: "<target — file path, route, component, story, or email>"
---

# /design-review:run — orchestrate the design-vitality pipeline

**Target:** `$ARGUMENTS` (a file path, app route, component, Storybook story, or email).

You are the **orchestrator**. Your telos is not "remove defects" but **make this target ALIVE and
unmistakably 2026** — judged against real references, ending in an explicit verdict. A target that
passes every correctness check and still looks templated has **failed**. Read `SKILL.md` for the
full telos; this command is its executable spine.

**UX contract with the owner: ONE decision.** The pipeline runs end-to-end on its own — detecting,
installing, diagnosing — and asks the owner exactly ONE thing: the multi-select of which changes to
apply (step 4). Scope/brand questions fold into that same interaction when possible. Everything
else is announced, never asked.

**Hard rules**
- Run the steps **IN ORDER**. Steps marked **[GATE]** cannot be skipped or reordered.
- Each lens agent **loads the real skill via the Skill tool** — EXCEPT `review-animations`, which
  is NEVER Skill-invocable (`disable-model-invocation: true`): it is applied by READING its
  SKILL.md + STANDARDS.md. Never paraphrase a skill in your own words — dispatch the agent that
  loads it, and each agent follows its verified playbook in `references/skills/<name>.md`.
- Run all browser/live steps **sequentially** (one browser thread), never in parallel.
- Work in an isolated branch/worktree.

---

## Step 0 — Auto-provision + frame the target (announce, don't ask)

**Provision (detect → auto-install → announce):** run
`node "${CLAUDE_PLUGIN_ROOT}/scripts/preflight.mjs" --write`.
- For each MISSING **core** component (`impeccable`, taste skill, `emil-design-eng`,
  `web-design-guidelines`): **install it automatically** using the verified command from the
  manifest / `references/skills/<name>.md` — do not ask first, do not install silently either:
  announce each install as you do it ("installing `impeccable` (MIT, pbakaus) — required by lens 1").
  After installing, `/reload-skills` (or note a restart is needed).
- For missing **optional** components (`ui-ux-pro-max`, `huashu-design`, `review-animations`,
  `refero`): install the free no-side-effect ones the same way if the surface needs them; skip the
  rest EXPLICITLY, recording each skip in `.design-review/preflight.md`
  ("SKIPPED `<id>` → lens `<x>` degraded").
- If an install FAILS, that is the only provisioning case worth surfacing to the owner — fold it
  into the step-4 question rather than stopping, unless a core lens is impossible without it.
- ⚠️ preflight checks enablement only for plugin-type components; a skill can be on disk yet the
  session may still need `/reload-skills` — if a lens later reports Unknown-skill, reload and retry
  once before reporting failure.
- **Skill-name resolution:** the taste skill registers by install dir (`taste-skill` or
  `design-taste-frontend`) — the lens agent resolves it; never hardcode one name in your dispatches.

**Frame:** read the target, its design doc, and brief. Detect: design system/tokens, Storybook,
platform (web/mobile), public vs private (private → SEO add-on off), live browser. **Surface
routing:** classify landing/portfolio vs dashboard/dense vs non-web → set density regime + primary
lens/builder. Note: on dashboards/product-UI the taste skill's landing rules are OUT OF SCOPE (its
§13) — only its cross-cutting rules apply; tell the taste lens which case it is. Owner-only
decisions (scope, light-fix vs full redesign, brand) — resolve what a minimal check answers, and
fold the rest into the step-4 multi-select instead of a separate interrogation.

## Step 1 — `audit-first` **[GATE · redesigns only]**
If the target already exists, dispatch the **`design-audit-first`** agent: screenshot the current
state and write "what to keep" to `.design-review/audit-first.md`. Skip only for greenfield (say so).

## Step 2 — `reference-research` **[GATE · ALWAYS · #1 lever against flat]**
Dispatch the **`design-reference-research`** agent. agent-browser over Dribbble 2026 popular +
`refero` (real shipped products) + 2-3 domain competitors + **ui-ux-pro-max vocabulary via its
search.py run deterministically (Bash — 84 styles / 161 palettes / 73 font-pairings)** + optionally
a pre-extracted DESIGN.md from `VoltAgent/awesome-design-md` when a reference brand is in its free
catalog (steal patterns, never clone the brand). Extract **3-5 concrete patterns** → write the
**copy + combine + house-layer** decision AND the 3 taste dials to `.design-review/references.md`.
**Do not proceed until this artifact exists.** If a brand/product is named, run **asset-integrity**
first (huashu-design audited AGAINST its brand-asset-protocol.md / real client assets — never
invent logos or data).

## Step 2b — Plan (authoring · folds in `frontend-design`)
Appended by the research agent to `references.md`: 4-6 hex token-plan (subordinate to project
tokens), 2+ typographic roles, **one signature element**, the "3 AI-default looks to avoid", and
the UX-writing checklist. Authoring criterion, not a lens.

## Step 3 — The 4 core lenses, REAL invocation **[GATE · in order]**
Dispatch each lens agent in turn, passing target + `.design-review/references.md` (+
`.design-review/audit-first.md` to the taste lens). Each loads its real skill per its playbook and
returns findings (cite `file:line`). Accumulate; drop nothing.

1. **`design-lens-impeccable`** → full 5-step setup, detect.mjs pre-pass, then routed
   `audit` + `critique` (expects critique's dual-sub-agent fan-out or surfaces its DEGRADED banner).
2. **`design-lens-taste`** → resolves the skill name, routes §11 + §14, forbids generation,
   runs the 2 mechanical greps itself. **The anti-templated gate is constructed by the pipeline**
   from the skill's output. If the output could be any SaaS template, this gate **FAILS** — the
   target is rejected, not noted. Exit criterion: *"this could only be THIS product."*
3. **`design-lens-motion`** → emil-design-eng with the question inline (+ file:line demanded);
   at least one signature motion moment on a rare/first-run surface (pipeline doctrine — Emil's
   framework vetoes motion on high-frequency interactions, both outputs are findings). If
   `review-animations` is installed, the lens runs it BY READING as the motion Block/Approve gate.
4. **`design-lens-a11y`** → fetches BOTH Vercel guideline files (command.md has NO WCAG/contrast
   checks; AGENTS.md carries APCA contrast + hit targets), caches, passes them with a no-re-fetch
   instruction. Never claims formal WCAG-AA from prompt alone. (Last lens — nets the motion just
   added.)
5. *(wired)* **ui-ux-pro-max UX pass** — `search.py --domain ux` deterministically; opt-in
   `huashu-design` Step-10 review / `web-accessibility` here.

## Step 4 — THE owner decision (one multi-select)
Merge all findings into one deduplicated list: P1 (broken/identity/a11y) · P2 (improvement) · P3
(polish), each skill-tagged with a recommended fix. Present **ONE multi-select checklist**
(`AskUserQuestion`, `multiSelect: true`) with P1 **and the anti-templated + signature-motion items
pre-selected** — those are why the target was flat; they are not optional polish. Fold any pending
owner-only decisions (scope/brand, failed installs) into this same batch. Apply only what's chosen.
This is the owner's ONLY required interaction in the whole run.

## Step 5 — Informed re-pass
Re-run only the lenses the chosen fixes touch (layout → impeccable + live; motion → emil +
verdict). impeccable's `polish` closes the fix pass (it consumes the critique snapshot as its
backlog). Surface genuinely new findings briefly; don't re-litigate settled items.

## Step 6 — `vitality-verdict` **[GATE]**
Dispatch the **`design-vitality-verdict`** agent: render the real target live (light/dark/mobile
via agent-browser — huashu's verify.py cannot do color-scheme), **diff against
`.design-review/references.md`**, check house layer / density-bento / a fired motion moment /
typographic point of view, run Core Web Vitals, and emit an explicit
**`alive` / `templated` / `flat`** verdict written to `.design-review/verdict.json`. Reinforced
when present by: **review-animations Block/Approve (by reading)**, **taste §14** (judgment
checklist + the 2 mechanical greps), **huashu Step-10 review** (its Concept veto ≤5 = `templated`
by definition), and **huashu verify.py** (console-error exit-code gate, local HTML only). A motion
`Block`, a failed §14 box, or a Concept veto holds the verdict below `alive`.

## Step 7 — Vitality loop **[GATE · until the bar is met]**
If the verdict is not `alive`, **iterate steps 3-6** (sharper reference, stronger house layer,
higher density, a real motion moment) up to **N rounds (default 3)**. If stuck at `flat`, consider
huashu's 3-parallel-subagents anti-convergence pattern as a variant generator. Each loop must move
the verdict toward `alive` or explain why the bar can't be met — then the owner decides. **Never
report done on a `templated`/`flat` verdict**; surface it as a failed run.

---

## Closing report
Return: the findings applied, the **final verdict** (`alive`/`templated`/`flat`) and the reference
it was judged against, the closing screenshots (light/dark/mobile), Core Web Vitals, which
components were auto-installed or skipped in step 0, and which add-ons ran or were skipped and why.
