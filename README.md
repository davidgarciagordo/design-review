**English** | [Español](README.es.md)

# 🎨 Design Review — Orchestrator

[![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-D97757)](https://github.com/davidgarciagordo/claude-code-setup-optimizer) [![skills.sh](https://img.shields.io/badge/skills.sh-skill-111111)](https://skills.sh) ![License MIT](https://img.shields.io/badge/license-MIT-2da44e) ![Version](https://img.shields.io/badge/version-2.3.0-blue)

> An executable, gated pipeline that cures **flat, lifeless, templated UI** — and ends with an explicit verdict: **alive / templated / flat**.

**design-review** turns a visual target — a component, screen, page, email, or dashboard — from *correct*
into *alive*. It is not a checklist you read; it is a set of **agents + a `/design-review:run` command + a
hook** that run an imperative pipeline: study real 2026 references, invoke the right design skills in
order, and refuse to call the result done while it still looks like a template.

It is a companion to [Forge Methodology](https://github.com/davidgarciagordo/forge-methodology): **Forge
structures what to build; design-review makes how it looks come alive**.

## The telos: alive, not just correct

Most design reviews optimise one question — *"does this have defects?"* — and hit a ceiling:
**correct-but-flat**. You can pass every contrast, spacing, and a11y check and still ship a 2024 template
with the life sanded off. Removing defects never adds vitality.

design-review asks a different question:

> ### Is this design ALIVE and unmistakably 2026 **against these specific references**?

- **Correctness is the floor, not the bar.** A target that passes everything and still reads as generic has **failed**.
- **The verdict is explicit:** every run ends with **`alive` / `templated` / `flat`**, judged against real references pulled live — not against the model's memory of "good design".
- **Vitality is built, not inspected** — via reference research and signature motion, added in, not filtered out.

**Seven root causes of "flat", and how v2.3 fixes each:**

| Root cause | Fix |
|---|---|
| **Wrong telos** — a defect-removal loop converges on "correct flat" | An explicit **vitality verdict** + a **vitality loop** that won't stop until it's `alive` |
| **No reference research** — designing from memory reproduces the training-data average (a template) | A non-skippable **reference-research gate**: Dribbble 2026 + 2–3 competitors + **`refero` real-product refs**, live, via agent-browser. *The #1 lever against flat.* |
| **Skills paraphrased or invoked bare** — bulleting "what impeccable would say" is a lossy echo; invoking bare (no args) stalls the skill in its router/setup | **Real and ROUTED invocation**: each lens agent **loads the actual skill routed to its correct command/mode** and is passed the correct input |
| **Components silently absent** — a missing skill/script is assumed present and skipped | **Preflight (step 0)**: `scripts/preflight.mjs` declares every component this run needs → ASKs to install missing → records skips EXPLICITLY. No silent gaps. |
| **Token waste in multi-lens analysis** — each lens independently re-scans the target | **Context-pack (step 2c)**: discover ONCE; every lens judges the same pack, never re-scans. Token lever. |
| **Edits scattered across lens passes** — writes between lenses create drift and conflicts | **Lenses are READ-ONLY** (no Edit/Write); all edits in a single apply pass after multi-select |
| **`Bash` in a "READ-ONLY" lens is a write vector** — `design-lens-taste`/`design-lens-motion` never needed `Bash` (dropped it); `design-lens-impeccable`/`design-lens-a11y` still need it for one narrow, documented shell call each (`context.mjs`, caching guidelines) that has no other tool to run through | Kept `Bash` only where a real call is documented. **Known limitation:** subagent `disallowedTools` only blocks whole tools, not command patterns (`sed -i`, redirects) — so for these two, read-only during diagnosis is **prompt-enforced, not tool-enforced**. For a hard guarantee, add a project-level `permissions.deny` (e.g. `Bash(sed -i:*)`, `Bash(rm:*)`) in `settings.json`. |
| **Verbose lens output** — walls of text from every lens drown actionable findings | **TERSE output**: each lens emits OK/KO + one-line finding. Full detail on request. |

### 🧩 Part of a family — same signature, four repos

| | Repo | Role |
|---|---|---|
| 🛠️ | [**claude-code-setup-optimizer**](https://github.com/davidgarciagordo/claude-code-setup-optimizer) | **The hub** — methodology + automations (hooks · subagents · commands) + `/optimize-my-setup` |
| 🔨 | [**forge-methodology**](https://github.com/davidgarciagordo/forge-methodology) | Structure *what to build* — align → spec → grill ×3 → plan → verify |
| 🎨 | [**design-review**](https://github.com/davidgarciagordo/design-review) · *you are here* | Make *how it looks* come alive — references → core skills → vitality verdict |
| 💸 | [**token-economy**](https://github.com/davidgarciagordo/token-economy) | Spend *less to do it* — the context-pack (step 2c) + read-only terse lenses this pipeline uses come from here; plus frugal output-style + pluggable memory. Complements [caveman](https://github.com/JuliusBrussee/caveman) (output) on the input/orchestration axis. |

## 📦 Install

```bash
# 🟢 As a skill (Claude Code + 20+ agents via skills.sh)
npx skills add davidgarciagordo/design-review

# 🔌 As a standalone Claude Code plugin (agents + /design-review:run command + gate hook)
/plugin marketplace add davidgarciagordo/design-review
/plugin install design-review@design-review

# 🛠️ Or get all three repos from the hub
/plugin marketplace add davidgarciagordo/claude-code-setup-optimizer
```

Or `git clone` it into `~/.claude/skills/` (skill only) — see [Install](#install) below.

---

## 🚀 How to use

```
/design-review:run <target>     # explicit command — a component, an app route, a Storybook story id, or an email
```

The pipeline also auto-triggers as the `design-review:design-review` skill from context/description (e.g.
"improve this design", "make this alive") — `/design-review:run <target>` is the explicit, argument-taking
entrypoint for the same pipeline.

It runs the gated pipeline below and **asks you** (multi-select, recommendations pre-marked) what to
apply — nothing changes without your pick — then renders the result live and emits a verdict
(`alive`/`templated`/`flat`). Worked examples → [examples/](examples/README.md).

```mermaid
flowchart TD
  P[0 · Preflight<br/>declare + ASK install + skip explicit] --> A{1 · audit-first<br/>redesigns only}
  A --> R[/2 · reference-research [GATE]<br/>Dribbble 2026 + refero + ui-ux-pro-max/]
  R --> PL[2b · plan<br/>tokens + signature element]
  PL --> CP[(2c · context-pack<br/>discover ONCE)]
  CP --> L1[3a impeccable] --> L2[3b taste<br/>anti-templated gate] --> L3[3c emil<br/>signature motion] --> L4[3d a11y AA]
  CP -. shared, read-only .-> L2 & L3 & L4
  L4 --> ASK{{4 · ASK — multi-select<br/>P1 + anti-templated + motion pre-marked}}
  ASK --> FIX[5 · apply + re-pass<br/>lenses read-only; mutate only here]
  FIX --> V{6 · vitality-verdict<br/>alive / templated / flat}
  V -- alive --> DONE([done])
  V -- templated / flat --> CP
```

## What's in the box (executable, not advisory)

| Piece | File | Role |
|---|---|---|
| Script · preflight | `${CLAUDE_PLUGIN_ROOT}/scripts/preflight.mjs` | Declares components → ASKs to install missing → records skips EXPLICITLY |
| Skill | `SKILL.md` | `design-review:design-review` — auto-triggers by description/context; the full methodology + telos |
| Command | `commands/run.md` | `/design-review:run <target>` — explicit entrypoint, runs the unified flow in order |
| Agent · audit-first | `agents/design-audit-first.md` | **[GATE]** redesigns only: screenshot current + "what to keep" |
| Agent · reference-research | `agents/design-reference-research.md` | **[GATE]** Dribbble 2026 + competitors + **`ui-ux-pro-max` vocabulary** + **`refero` real-product refs** → 3–5 patterns → copy+combine+house |
| Agent · context-pack | `agents/design-context-pack.md` | Discover target ONCE (files, tokens, DS, screenshot) — all lenses share this pack |
| Agent · lens impeccable | `agents/design-lens-impeccable.md` | **READ-ONLY** · **routes** `impeccable audit` + `critique` — structure / audit |
| Agent · lens taste | `agents/design-lens-taste.md` | **READ-ONLY** · **routes** `design-taste-frontend` §11 + §14 — **anti-templated gate** |
| Agent · lens motion | `agents/design-lens-motion.md` | **READ-ONLY** · **routes** `emil-design-eng` (concrete question inline) — **signature motion** |
| Agent · lens a11y | `agents/design-lens-a11y.md` | **READ-ONLY** · **WebFetch** guidelines → cache → `web-design-guidelines` — accessibility AA |
| Agent · vitality verdict | `agents/design-vitality-verdict.md` | **[GATE]** live check + diff vs references → `alive/templated/flat` |
| Hook | `hooks/design-review-gate.js` | PostToolUse on UI writes — warn/block unless the verdict is `alive` |

---

## The pipeline (imperative · gated · in order)

| Step | What happens | Skill / agent |
|------|-------------|--------|
| **0. Preflight** | `${CLAUDE_PLUGIN_ROOT}/scripts/preflight.mjs`: declare every component this run needs → ASK to install missing → record skips EXPLICITLY. Surface routing: detect landing / dashboard / non-web to route lenses. Pluggable memory: claude-mem \| other \| none→file artifact (cross-run accelerator, optional). | `${CLAUDE_PLUGIN_ROOT}/scripts/preflight.mjs` |
| **1. audit-first** **[GATE · redesigns]** | Screenshot the current state; write "what to keep". | `design-audit-first` |
| **2a. reference-research** **[GATE · always]** | Dribbble 2026 + 2–3 competitors + **`ui-ux-pro-max` vocabulary** + **`refero` real-product refs** → 3–5 stealable patterns → copy + combine + house layer. **The #1 lever against flat.** | `design-reference-research` + `agent-browser` |
| **2b. plan** | Author fix plan from the reference pack (`frontend-design`, folded here — no separate lens pass). | `frontend-design` (folded) |
| **2c. context-pack** | Discover target ONCE (files, DS tokens, live screenshot). **Every lens judges this pack — no lens re-scans.** Token lever. | `design-context-pack` |
| **3a–3d. Four lenses** **[READ-ONLY · GATE]** | Each lens runs against the context-pack. **No Edit/Write in any lens.** Output: **OK/KO + 1-line finding** (terse). Full detail on request. `review-animations` (motion gate) + `huashu-design` (asset-integrity + Playwright verify) wired alongside the four core lenses; surface routing selects which lenses apply. | **routes** `impeccable` · `design-taste-frontend` · `emil-design-eng` · `web-design-guidelines` |
| **4. multi-select** | One deduplicated P1/P2/P3 list (each tagged `[skill]`); anti-templated + motion + a11y items **pre-marked**. | — |
| **5. ONE apply pass** | All chosen fixes applied in a single pass. No incremental edits between lenses. | per skill |
| **6. vitality-verdict** **[GATE]** | Render live (light/dark/mobile), **diff vs the references**, Core Web Vitals → explicit `alive`/`templated`/`flat`. | `design-vitality-verdict` + `agent-browser` |
| **7. Vitality loop** **[GATE]** | If not `alive`, iterate 2a–6 (sharper reference, stronger house layer, real motion moment) up to N rounds. | — |

**Opt-in add-ons (not gates):** `seo` (**public targets only**) · `web-accessibility` (deeper WCAG) · a mobile-design skill (RN/Expo).

---

## Why design-review — with vs. without

| | Without | With design-review |
|---|---|---|
| **Telos** | "Remove defects" → ceiling at correct-but-flat | "Make it alive vs 2026 references" → an explicit verdict that won't pass `flat` |
| **References** | Design from memory → the training-data average → a template | A live Dribbble-2026 + competitor study before any pixel; patterns chosen, combined, reskinned |
| **Skill fidelity** | Skills paraphrased into bullets → lossy echo | Each skill **loaded** via the Skill tool — real reasoning, not a summary |
| **Motion** | Hover hygiene at best | A required **signature motion moment** |
| **Anti-slop** | A copy-tone pass | An **anti-templated gate** that fails generic output |
| **Done?** | "Looks fine, ship it" | Not done until the verdict reads `alive` — enforced by a hook on UI writes |

---

## Output: a checklist, then a verdict

All findings from every skill are gathered into one deduplicated list, grouped by priority, presented as a
**multi-select checklist** (P1 + the anti-templated and signature-motion items pre-selected). You choose
what to fix; the pipeline applies only that. Then it renders the result live, diffs it against the
references, and emits the verdict.

```
Which findings should I fix?  (multi-select · vitality items pre-selected)

P1 — Broken / identity / vitality
  [x] Templated: default card grid + hero/3-cards — no house layer (anti-templated gate FAILED) [design-taste-frontend]
  [x] No signature motion — only hover hygiene; reference called for a staggered card entrance   [emil-design-eng]
  [x] Secondary text contrast 2.85:1 — fails WCAG AA                                              [impeccable, web-design-guidelines]

P2 — Improvements
  [ ] Even, flat density — adopt the asymmetric bento from reference #2                            [impeccable]
  [ ] LCP 3.8s — hero image not preloaded                                                          [agent-browser]

P3 — Polish
  [ ] Hover transition 320ms feels sluggish → 150ms                                                [emil-design-eng]

────────────────────────────────────────────────────────────────────
Vitality verdict:  templated → (loop) → alive
  judged against .design-review/references.md — bento + display numerals + staggered entrance landed
```

---

## Attribution

This pipeline orchestrates skills authored by others — it **loads** them, never paraphrases them.
**The 4 core skills are mandatory; the rest are opt-in add-ons.** Verify URLs before installing.

| Skill | Role | Source |
|---|---|---|
| **`impeccable`** *(core)* | Structure, hierarchy, IA, tokens, scored audit | https://github.com/pbakaus/impeccable |
| **`design-taste-frontend`** *(core)* (a.k.a. `taste-skill`) | Anti-slop + anti-templated gate | https://github.com/Leonxlnx/taste-skill |
| **`emil-design-eng`** *(core)* | Polish + signature motion | https://github.com/emilkowalski/skills |
| **`web-design-guidelines`** *(core)* | Accessibility AA, keyboard, contrast | Anthropic — Web Interface Guidelines |
| **`ui-ux-pro-max`** *(wired — baseline + vocab)* | Style/palette/font-pair vocabulary · UX guidelines · fix generation | `claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill` |
| **`refero`** *(wired — real-product refs)* | Real-product reference imagery fed into the context-pack | `claude plugin install refero@refero` |
| **`frontend-design`** *(wired — folded into plan)* | Plan authoring from the reference pack (runs at step 2b, not a separate lens) | project-configured |
| **`review-animations`** *(wired — motion gate)* | Animation timing/easing/jank gate wired alongside lens-motion | https://github.com/emilkowalski/skills |
| **`huashu-design`** *(wired — asset-integrity + Playwright verify)* | Asset-integrity checks + Playwright-driven visual verify alongside lens passes | https://github.com/alchaincyf/huashu-design |
| `agent-browser` | Live browser: reference research + the vitality verdict | Claude Code built-in / project-configured |
| `web-accessibility` / `accessibility` *(add-on)* | Deeper WCAG 2.2 audit | https://github.com/addyosmani/web-quality-skills |
| `seo` *(add-on, public only)* | Search visibility | https://github.com/addyosmani/web-quality-skills |
| mobile design skill *(add-on)* | Mobile / RN screens | pick your own (e.g. Sleek — sleek.design) |

Full detail: [references/attribution.md](references/attribution.md).

---

## How to use

### Install

As a plugin (agents + command + hook), use the marketplace commands above. As a skill only:

```bash
git clone https://github.com/davidgarciagordo/design-review ~/.claude/skills/design-review
```

### Triggers

```
improve design
make this alive / less flat
design review
/design-review:run <target>
```

### Structured prompt

```
/design-review:run apps/web/app/settings/page.tsx

Target: settings page (authenticated — private; SEO add-on off)
Stack: Next.js App Router, Tailwind, design-system tokens
Live browser: available (dev server on port 3000)
```

### The enforcement hook

When a write/edit touches a UI file, the PostToolUse hook checks for an `alive` verdict in
`.design-review/verdict.json`. Modes via `DESIGN_REVIEW_GATE`: `warn` (default, advisory), `block` (exit 2
— the agent must run `/design-review:run` to `alive`), `off` (disabled).

### Without Claude Code

Read `SKILL.md` and `references/pipeline.md`. The pipeline works with any AI assistant — run each gate in
order, load each skill rather than summarising it, accumulate findings, and end with the explicit verdict.

---

## References

| Reference | Contents |
|-----------|----------|
| [SKILL.md](SKILL.md) | The telos + the imperative, gated pipeline |
| [references/pipeline.md](references/pipeline.md) | Step-by-step detail: what to do, what input to pass each skill, how findings chain |
| [references/attribution.md](references/attribution.md) | Core-vs-add-on skills, install, fallbacks |
| [templates/vitality-verdict.md](templates/vitality-verdict.md) | Verdict shape + references diff |
| [templates/findings-checklist.md](templates/findings-checklist.md) | Findings checklist |

---

## License

MIT — see [LICENSE](./LICENSE).

---
<sub>Made by [David García Gordo](https://github.com/davidgarciagordo) · MIT · part of the [claude-code-setup-optimizer](https://github.com/davidgarciagordo/claude-code-setup-optimizer) family</sub>
</content>
