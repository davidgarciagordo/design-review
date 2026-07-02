# impeccable — verified playbook (source: pbakaus/impeccable @ 44c27a7, skill v3.9.1)

> Verified against the real SKILL.md + reference/*.md + scripts/. Line refs are to that source.
> Agents: follow THIS file, not memory. If the installed version differs wildly, say so in your findings.

## Install
```bash
npx impeccable install            # from the project root; detects harnesses (README.md:103)
npx impeccable update             # refresh
```
Then `/impeccable init` once per project if there is no PRODUCT.md.

## Invoke
Skill tool, ALWAYS routed to a command: `skill: "impeccable"`, `args: "<command> <target>"`.
First word routes via the command table and loads `reference/<command>.md`; the rest is the target
(SKILL.md:147). Intent phrases also route ("fix the spacing" → layout).

**Bare invocation is NOT a static menu**: it runs a context-aware recommender (context-signals.mjs +
detect.mjs) that suggests 2-3 commands and WAITS for confirmation — a stall for any orchestrator.
Always pass a command.

## Mandatory setup (5 steps, SKILL.md:17-23 — skipping any produces GENERIC output)
1. `node <skill-dir>/scripts/context.mjs` once per session (monorepo: add `--target <path>`).
   Prints PRODUCT.md (+DESIGN.md if present) or `NO_PRODUCT_MD`.
   - `NO_PRODUCT_MD` → the skill demands init (an AskUserQuestion INTERVIEW, init.md:48-63). In an
     automated pipeline: pre-create a minimal PRODUCT.md with a bare `## Register` line
     (`brand` for marketing/landing, `product` for app UI — init.md:100-102,123). Only PRODUCT.md
     blocks; DESIGN.md is optional.
   - Monorepo without `--target` → `MONOREPO_TARGET_REQUIRED` stall (context.mjs:930).
2. Read `reference/<command>.md` for the command you are about to run (not optional, SKILL.md:20).
3. Read at least 1 real project file (tokens/CSS/a component) before judging (SKILL.md:21).
4. Read the register reference: `reference/brand.md` (marketing/landing) or `reference/product.md`
   (app UI) (SKILL.md:22).
5. No tokens/brand in the project → `scripts/palette.mjs` for a color seed (SKILL.md:23).

## Commands (23 total, SKILL.md:104-128)
- Evaluate: `critique` (heuristic UX review, scored Nielsen-10 ×0-4 = /40, dual-sub-agent — see below)
  · `audit` (technical: A11y · Performance · Theming/tokens · Responsive · Anti-Patterns, scored 0-4 each = /20)
- Refine: `polish` (final pre-ship pass — reads the latest critique snapshot as backlog, polish.md:38-43)
  · `bolder` · `quieter` · `distill` · `harden` · `onboard`
- Enhance: `animate` · `colorize` · `typeset` · `layout` · `delight` · `overdrive`
- Fix: `clarify` · `adapt` · `optimize`
- Build: `craft` · `shape` · `init` · `document` · `extract` — Iterate: `live` — Mgmt: `pin`/`unpin` · `hooks`

## Diagnosis order (from the source, audit.md:112-123)
setup → `critique <target>` + `audit <target>` (independent; audit documents, never fixes) →
fixes routed per finding P0→P1→P2 → **`polish` ALWAYS as the closing pass** → re-run `audit` to see
the score move.

## Gotchas (verified)
- `critique` REQUIRES two isolated sub-agents (Assessment A design-review + B detector) when a Task
  tool exists; inline = degraded run with a mandatory `⚠️ DEGRADED` banner (critique.md:7-9,31-37).
  Expect that fan-out or accept the banner — do not silently absorb it.
- `detect.mjs --json`: 45 deterministic rules, no LLM, no network. Exit 0 = clean, exit 2 = findings
  (NOT an error). Run it as a cheap pre-lens tool pass — never put a model in front of it.
- `.impeccable/critique/ignore.md` suppresses false positives across runs; `critique-storage.mjs
  trend <slug> 5` shows the score trend — both are free cross-run memory.
- `context-signals.mjs` emits JSON (setup state, latest critique, git changed files, dev server) —
  use it to scope audit/polish to changed files only.
