**English** | [Español](README.es.md)

# 🎨 design-review

[![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-D97757)](https://github.com/davidgarciagordo/claude-code-setup-optimizer) [![skills.sh](https://img.shields.io/badge/skills.sh-skill-111111)](https://skills.sh) ![License MIT](https://img.shields.io/badge/license-MIT-2da44e) ![Version](https://img.shields.io/badge/version-2.1.0-blue)

> An executable, gated pipeline that cures **flat, lifeless, templated UI** — and ends with an explicit verdict: **alive / templated / flat**.

**design-review** turns a visual target — a component, screen, page, email, or dashboard — from *correct*
into *alive*. It is not a checklist you read; it is a set of **agents + a `/design-review` command + a
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

**Four root causes of "flat", and how v2.1 fixes each:**

| Root cause | Fix |
|---|---|
| **Wrong telos** — a defect-removal loop converges on "correct flat" | An explicit **vitality verdict** + a **vitality loop** that won't stop until it's `alive` |
| **No reference research** — designing from memory reproduces the training-data average (a template) | A non-skippable **reference-research gate**: Dribbble 2026 + 2–3 competitors, live, via agent-browser + **`ui-ux-pro-max` vocabulary**. *The #1 lever against flat.* |
| **Skills paraphrased or invoked bare** — bulleting "what impeccable would say" is a lossy echo; invoking bare (no args) stalls the skill in its router/setup | **Real and ROUTED invocation**: each lens agent **loads the actual skill routed to its correct command/mode** and is passed the correct input |
| **Skills assumed "not installed"** — a missing skill is silently skipped | **Bootstrap (step 0)**: detect → install → temp-clone fallback → use. No referenced skill is ever skipped silently |

### 🧩 Part of a family — same signature, three repos

| | Repo | Role |
|---|---|---|
| 🛠️ | [**claude-code-setup-optimizer**](https://github.com/davidgarciagordo/claude-code-setup-optimizer) | **The hub** — methodology + automations (hooks · subagents · commands) + `/optimize-my-setup` |
| 🔨 | [**forge-methodology**](https://github.com/davidgarciagordo/forge-methodology) | Structure *what to build* — align → spec → grill ×3 → plan → verify |
| 🎨 | [**design-review**](https://github.com/davidgarciagordo/design-review) · *you are here* | Make *how it looks* come alive — references → core skills → vitality verdict |

## 📦 Install

```bash
# 🟢 As a skill (Claude Code + 20+ agents via skills.sh)
npx skills add davidgarciagordo/design-review

# 🔌 As a standalone Claude Code plugin (agents + /design-review command + gate hook)
/plugin marketplace add davidgarciagordo/design-review
/plugin install design-review@design-review

# 🛠️ Or get all three repos from the hub
/plugin marketplace add davidgarciagordo/claude-code-setup-optimizer
```

Or `git clone` it into `~/.claude/skills/` (skill only) — see [Install](#install) below.

---

## What's in the box (executable, not advisory)

| Piece | File | Role |
|---|---|---|
| Command | `commands/design-review.md` | `/design-review <target>` — runs the unified flow in order |
| Agent · audit-first | `agents/design-audit-first.md` | **[GATE]** redesigns only: screenshot current + "what to keep" |
| Agent · reference-research | `agents/design-reference-research.md` | **[GATE]** Dribbble 2026 + competitors + **`ui-ux-pro-max` vocabulary** → 3–5 patterns → copy+combine+house |
| Agent · lens impeccable | `agents/design-lens-impeccable.md` | **routes** `impeccable audit` + `critique` — structure / audit |
| Agent · lens taste | `agents/design-lens-taste.md` | **routes** `design-taste-frontend` §11 + §14 — **anti-templated gate** |
| Agent · lens motion | `agents/design-lens-motion.md` | **routes** `emil-design-eng` (concrete question inline) — **signature motion** |
| Agent · lens a11y | `agents/design-lens-a11y.md` | **WebFetch** guidelines → cache → `web-design-guidelines` — accessibility AA |
| Agent · vitality verdict | `agents/design-vitality-verdict.md` | **[GATE]** live check + diff vs references → `alive/templated/flat` |
| Hook | `hooks/design-review-gate.js` | PostToolUse on UI writes — warn/block unless the verdict is `alive` |

---

## The pipeline (imperative · gated · in order)

| Step | What happens | Skill / agent |
|------|-------------|--------|
| **0. Bootstrap & frame** | Detect + install referenced skills (temp-clone fallback). Setup PRODUCT.md/DESIGN.md for impeccable. Detect design system, Storybook, platform, public/private, live browser. One batch of owner-only questions. | — |
| **1. audit-first** **[GATE · redesigns]** | Screenshot the current state; write "what to keep". | `design-audit-first` |
| **2. reference-research** **[GATE · always]** | Dribbble 2026 + 2–3 competitors + **`ui-ux-pro-max` vocabulary** → 3–5 stealable patterns → copy + combine + house layer. **The #1 lever against flat.** | `design-reference-research` + `agent-browser` |
| **3a. structure / audit** **[GATE]** | Hierarchy, IA, cognitive load, tokens, scored audit. **Routed** to `impeccable audit` + `critique`. | **routes** `impeccable` |
| **3b. anti-templated** **[GATE]** | Anti-slop **+ gate that FAILS generic output**. **Routed** to §11 redesign-audit + §14; dials pre-set from references. Exit criterion: "this could only be THIS product." | **routes** `design-taste-frontend` |
| **3c. signature motion** **[GATE]** | At least one memorable motion moment. Concrete question **in the same invocation** (bypasses "Initial Response wait"). Before/After → P1/P2/P3. | **routes** `emil-design-eng` |
| **3d. accessibility** **[GATE]** | AA contrast, keyboard, visible focus, roles/labels, reduced-motion. Guidelines **WebFetch**-cached first (avoids "which files?" prompt). | **routes** `web-design-guidelines` |
| **3e. UX guidelines** | Extra UX lens via `ui-ux-pro-max` guidelines (wired). Opt-in add-ons run here too. | `ui-ux-pro-max` |
| **4. ASK** | One deduplicated P1/P2/P3 list (each tagged `[skill]` + owning fix command); **multi-select**; anti-templated + motion items **pre-marked**. | — |
| **5. APPLY + re-pass** | Route chosen items to their **owning fix command** (suite→phase mapping). Re-run only the lenses the fixes touch. | per skill |
| **6. vitality-verdict** **[GATE]** | Render live (light/dark/mobile), **diff vs the references**, Core Web Vitals → explicit `alive`/`templated`/`flat`. | `design-vitality-verdict` + `agent-browser` |
| **7. Vitality loop** **[GATE]** | If not `alive`, iterate 3–6 (sharper reference, stronger house layer, real motion moment) up to N rounds. | — |

**Add-ons (opt-in, not gates):** `huashu-design` (2nd anti-slop) · `review-animations` (**only if installed**) ·
`seo` (**public targets only**) · `web-accessibility` (deeper WCAG) · a mobile-design skill (RN/Expo).

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
| **`ui-ux-pro-max`** *(wired design intelligence)* | Style/palette/font-pair vocabulary · UX guidelines · fix generation | `claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill` |
| `agent-browser` | Live browser: reference research + the vitality verdict | Claude Code built-in / project-configured |
| `huashu-design` *(add-on)* | Independent 2nd anti-slop lens | https://github.com/alchaincyf/huashu-design |
| `review-animations` *(add-on — only if installed)* | Animation timing/easing/jank critique | https://github.com/emilkowalski/skills |
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
/design-review <target>
```

### Structured prompt

```
/design-review apps/web/app/settings/page.tsx

Target: settings page (authenticated — private; SEO add-on off)
Stack: Next.js App Router, Tailwind, design-system tokens
Live browser: available (dev server on port 3000)
```

### The enforcement hook

When a write/edit touches a UI file, the PostToolUse hook checks for an `alive` verdict in
`.design-review/verdict.json`. Modes via `DESIGN_REVIEW_GATE`: `warn` (default, advisory), `block` (exit 2
— the agent must run `/design-review` to `alive`), `off` (disabled).

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
