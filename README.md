**English** | [Español](README.es.md)

# design-review

AI-generated UIs pass every check and still look like every other AI-generated page. design-review makes **"looks generic" a failing, machine-checkable verdict**: a gated Claude Code pipeline that studies real current references, runs 4 third-party design skills as read-only lenses, and refuses to report done until the live-rendered result is judged **`alive`** — not `templated`, not `flat`.

Companion to [forge-methodology](https://github.com/davidgarciagordo/forge-methodology): Forge structures *what to build*; design-review makes *how it looks* come alive.

## What's inside

| Piece | What it is |
|---|---|
| [`SKILL.md`](SKILL.md) | The orchestrator skill — telos, gates, rules. Auto-triggers on "improve this design" / "make this alive". |
| [`commands/run.md`](commands/run.md) | `/design-review:run <target>` — the explicit entrypoint (same pipeline). |
| [`agents/`](agents/) | 8 agents: audit-first, reference-research, context-pack, the 4 lenses, vitality-verdict. |
| [`references/skills/`](references/skills/) | **The 7 verified playbooks** — one per orchestrated skill, checked against each skill's real source at a pinned commit: [impeccable](references/skills/impeccable.md) · [taste-skill](references/skills/taste-skill.md) · [emil-design-eng](references/skills/emil-design-eng.md) · [review-animations](references/skills/review-animations.md) · [web-design-guidelines](references/skills/web-design-guidelines.md) · [ui-ux-pro-max](references/skills/ui-ux-pro-max.md) · [huashu-design](references/skills/huashu-design.md). Exact invocation, gotchas, and corrections to common false claims about each skill. |
| [`examples/`](examples/README.md) | Two full illustrative runs (a settings page, a design-system button) showing every step's real artifacts and outputs. |
| [`hooks/design-review-gate.js`](hooks/design-review-gate.js) | PostToolUse enforcement: a UI write without an `alive` verdict warns (default), blocks, or stays off — `DESIGN_REVIEW_GATE=warn\|block\|off`. |
| [`scripts/preflight.mjs`](scripts/preflight.mjs) | The component manifest + detector (also catches "plugin on disk but disabled this session"). |
| [`templates/`](templates/) | [findings-checklist](templates/findings-checklist.md) · [vitality-verdict](templates/vitality-verdict.md) shapes. |
| [`references/pipeline.md`](references/pipeline.md) · [`references/attribution.md`](references/attribution.md) | Step-by-step reference · who wrote what + full install matrix. |

## Install & quick start

```bash
/plugin marketplace add davidgarciagordo/design-review
/plugin install design-review
```

Or the whole suite (this + token-economy, forge-methodology, working-methods, automations) from [one catalog](https://github.com/davidgarciagordo/claude-plugins):

```bash
/plugin marketplace add davidgarciagordo/claude-plugins
/plugin install design-review@davidgarciagordo-plugins
```

> **Honest note:** the `/design-review:run` command, the 8 agents, and the enforcement hook only
> exist in your session once the plugin is **installed and enabled**
> (`/plugin install design-review@davidgarciagordo-plugins`). Reading this repo without installing
> gives you the methodology as prose — no gate runs.

Then point it at a target:

```
/design-review:run apps/web/app/settings/page.tsx
```

The pipeline runs end-to-end and asks you exactly **one** thing — which findings to apply. This is what that interaction looks like (from [`examples/`](examples/README.md), example 1):

```
Which findings should I fix?  (multi-select · vitality items pre-selected)

P1 — Broken / identity / vitality
  [x] Anti-templated gate FAILED: stacked-section default, no house layer → sidebar+bento+teal bg  [design-taste-frontend]
  [x] No signature motion: staggered section entrance (100ms, ease-out, 12px slide) from ref #3    [emil-design-eng]
  [x] Secondary text contrast 2.85:1 — fails WCAG AA (#9ca3af on white)                           [impeccable, web-design-guidelines]
  [x] Section titles are <div>, not <h2> — heading structure broken                                [impeccable, web-design-guidelines]
  [x] Notification toggles not keyboard accessible (missing role="switch")                         [web-design-guidelines]
  [x] prefers-reduced-motion not honored by staggered entrance                                     [emil-design-eng, web-design-guidelines]

P2 — Improvements
  [ ] Three competing "Save changes" primaries on one page                                         [impeccable]
  [ ] Body text 13px — below comfortable reading threshold (target: 14–16px)                       [impeccable]
  [ ] Save button needs loading/confirmation state (800ms silence after click)                     [emil-design-eng]
  [ ] Toggles snap instant — add 200ms ease transition                                             [emil-design-eng]

P3 — Polish
  [ ] Section heading "BILLING INFORMATION" — use title case                                       [design-taste-frontend]
  [ ] Placeholder "Enter your full name here" — redundant; shorten                                 [design-taste-frontend]
  [ ] Toggle enabled/disabled text labels are noise — remove                                       [design-taste-frontend]
```

…and every run ends with an explicit verdict written to `.design-review/verdict.json`:

```
Vitality verdict:  templated → (loop) → alive
  judged against .design-review/references.md
  bento density + teal identity layer + staggered entrance landed
```

## The pipeline

Gates cannot be skipped or reordered. Every phase leaves an artifact under `.design-review/`:

| # | Phase | Agent / owner | Artifact (`.design-review/`) | Gate |
|---|---|---|---|---|
| 0 | Preflight — declare, **ask**, install-or-skip explicitly | orchestrator + `scripts/preflight.mjs` | `preflight.md` | never installs silently; skips are recorded and announced |
| 1 | audit-first — screenshot current state, "what to keep" | `design-audit-first` | `audit-first.md` | **GATE** — redesigns only |
| 2 | reference-research — current Dribbble popular + refero + 2-3 domain competitors, live | `design-reference-research` | `references.md` (+ the 2b authoring plan) | **GATE, always** — no artifact → STOP |
| 3 | context-pack — discover the target ONCE (file:line map, tokens, screenshots) | `design-context-pack` | `context-pack.md` | feeds every lens; kills re-scanning |
| 4 | 4 lenses, read-only, routed | `design-lens-impeccable` · `-taste` · `-motion` · `-a11y` | terse findings, merged into one list | **GATE** — all 4 return `OK`/`KO`; no edits during diagnosis |
| 5 | multi-select — one deduplicated P1/P2/P3 checklist | orchestrator (`AskUserQuestion`) | the chosen checklist | the owner's ONE decision; nothing applies unpicked |
| 6 | apply + informed re-pass | orchestrator → each finding's owning fix command | the diff | one pass, only after the ask |
| 7 | vitality-verdict — live render (light/dark/mobile), diff vs references | `design-vitality-verdict` | `verdict.json` | **GATE** — `alive`, or loop back to 3 (≤3 rounds) |

**Enforcement hook:** a `PostToolUse` hook checks `verdict.json` whenever a UI file is written — `warn` (default), `block` (exit 2), or `off` via `DESIGN_REVIEW_GATE`.

## Why not just ask the model to "review the design"?

Because the third-party skills that actually carry the design judgment fail in specific, verified ways when driven naively. The [7 playbooks](references/skills/) were checked line-by-line against each skill's source at a pinned commit; the pipeline exists to prevent these failure modes:

1. **`impeccable` invoked bare is a recommender that waits** — it suggests 2-3 commands and stalls for confirmation. The pipeline always routes it to `audit` + `critique` and runs its mandatory 5-step setup first (skipping the brand/product register produces exactly the generic output this pipeline kills).
2. **The taste skill is a GENERATOR** — un-routed, it builds a new page instead of auditing yours; and its registered name varies by install dir (`taste-skill` vs `design-taste-frontend`). The pipeline routes it to §11 redesign-audit + §14 pre-flight, forbids generation, and resolves both names.
3. **`review-animations` can never be invoked by the model** (`disable-model-invocation: true`) — a naive orchestrator silently loses the motion gate. The pipeline READS its SKILL.md + STANDARDS.md from disk and applies them as prompt content.
4. **Vercel's fetched `command.md` contains NO WCAG/contrast-ratio checks** — an a11y "review" from it alone misses contrast entirely. The pipeline injects the repo's `AGENTS.md` (APCA contrast, hit targets) alongside, and never claims formal contrast numbers from a prompt (that needs a measuring tool).
5. **`emil-design-eng` greets and waits when invoked without a question** — and its Before/After table omits file:line by design. The pipeline passes the concrete question in the same invocation and demands file:line in the prompt.
6. **`huashu-design` is entirely in Chinese and does not self-limit** — and its Concept veto (score ≤5 caps the total at 6.0) is a machine-usable `templated` signal a casual invocation never surfaces. The pipeline invokes it by name, fixes the output language, and pins it to its Step-10 review mode, read-only.

Two more failure modes no single skill covers get their own gates: **designing from memory** (step 2 forces live reference research before anything is designed) and **declaring done from code** (step 7 renders the real target in a browser before any verdict).

## Requirements — the honest version

- **Claude Code.** The executable pieces (Skill-tool routing, agents, `AskUserQuestion`, the hook) are Claude Code features. Outside Claude Code you can follow [`SKILL.md`](SKILL.md) + [`references/pipeline.md`](references/pipeline.md) manually as a methodology, but nothing here runs itself elsewhere.
- **The 4 core skills are third-party and NOT bundled** — [`impeccable`](https://github.com/pbakaus/impeccable) (Paul Bakaus), [`design-taste-frontend`](https://github.com/Leonxlnx/taste-skill) (Leonxlnx), [`emil-design-eng`](https://github.com/emilkowalski/skills) (Emil Kowalski), [`web-design-guidelines`](https://github.com/vercel-labs/web-interface-guidelines) (Vercel). Step 0 detects what's missing and **asks per item before installing** — it never installs silently, and it never skips silently either: a skipped core skill fails its lens loudly (`Unknown skill` / an announced degrade), it does not quietly produce a weaker review. Install commands: [references/attribution.md](references/attribution.md); `node scripts/preflight.mjs` shows what's present in your environment.
- **`agent-browser` is quasi-required — and it must be Vercel Labs' one.** It is [Vercel Labs' browser-automation CLI](https://github.com/vercel-labs/agent-browser), purpose-built and optimized for agent-driven browsing (`npx -y skills@latest add vercel-labs/agent-browser`) — **not a Claude Code built-in, and not interchangeable with a generic browser-automation tool**. Both browser gates (reference-research and the final verdict) depend on it — without it the verdict is **provisional only**: `alive` cannot be claimed for a design no one rendered.
- **Network access** (Dribbble/competitor research, Vercel guideline fetches), `node` for the repo scripts, `python3` only if you use `ui-ux-pro-max`.

## Mini-glossary

- **`alive` / `templated` / `flat`** — the three verdict values. `alive` = the referenced patterns landed and the result could only be this product; `templated` = correct but interchangeable with any SaaS template; `flat` = lifeless even before considering identity.
- **house layer** — the re-skinning of borrowed reference patterns with the project's own identity and tokens, so the combination reads as *this* product, not as the references glued together.
- **signature motion** — one memorable motion moment on a rare/first-run surface. This pipeline's doctrine, deliberately in tension with Emil's remove-motion bias — his framework still vetoes motion on high-frequency interactions.
- **dials** — the taste skill's 3 knobs (`DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`), pre-set from `references.md` instead of asked conversationally.
- **context-pack** — the discover-once artifact: component tree, tokens-in-use, `file:line` map, screenshots, already-known findings. Lenses judge this pack instead of each re-scanning the whole surface.

## Limitations & costs

- **A full run is heavy**: 8+ agent dispatches, live browsing, screenshots, up to 3 verdict loops. For one lens on one file, invoke that skill directly (see [examples](examples/README.md#one-prompt-for-all-or-one-core-lens-standalone)).
- **Needs the network**: reference research and the a11y guideline fetches are live; offline, step 2 degrades and the verdict can only be provisional.
- **Dashboards relax the landing rules**: surface routing keeps the anti-templated bar everywhere, but the taste skill's landing-specific rubric (hero/eyebrow/marquee) does not apply to dense product UI — expect softer taste findings there by design.
- **The hook's UI-file heuristic is conservative but still a heuristic** — use `DESIGN_REVIEW_GATE=off` for edits that aren't design-bearing.

## Attribution

Orchestrates skills authored by others — loads them, never paraphrases. Core (mandatory, third-party — see [Requirements](#requirements--the-honest-version)): [`impeccable`](https://github.com/pbakaus/impeccable) (Paul Bakaus), [`design-taste-frontend`](https://github.com/Leonxlnx/taste-skill) (Leonxlnx), [`emil-design-eng`](https://github.com/emilkowalski/skills) (Emil Kowalski), [`web-design-guidelines`](https://github.com/vercel-labs/web-interface-guidelines) (Vercel). Wired add-ons: `ui-ux-pro-max`, `refero`, `frontend-design` (official Anthropic plugin — plan criterion), `building-components` (Vercel standard — component-authoring criterion in the apply pass), [`agent-browser`](https://github.com/vercel-labs/agent-browser) (Vercel Labs — THE tester: live render for research and the final verdict; optimized for agent-driven browsing, never a generic substitute), `review-animations`, `huashu-design`, `web-accessibility`, `seo`. Full detail: [references/attribution.md](references/attribution.md).

Alternative: clone into `~/.claude/skills/design-review` to load as a local plugin without a marketplace.

## License

MIT — see [LICENSE](./LICENSE).
