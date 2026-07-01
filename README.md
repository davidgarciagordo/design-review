**English** | [Español](README.es.md)

# design-review

Claude Code plugin. A gated pipeline that cures **flat, templated UI** — studies real 2026 references, runs 4 design lenses in order, and ends every run with an explicit verdict: **alive / templated / flat**.

Companion to [forge-methodology](https://github.com/davidgarciagordo/forge-methodology): Forge structures *what to build*; design-review makes *how it looks* come alive.

## Install

Just this plugin:

```bash
/plugin marketplace add davidgarciagordo/design-review
/plugin install design-review
```

Or the whole suite (this + token-economy, forge-methodology, working-methods, automations) from one catalog:

```bash
/plugin marketplace add davidgarciagordo/claude-plugins
/plugin install design-review@davidgarciagordo-plugins
```

## How it works

Run explicitly with `/design-review:run <target>` (a component, app route, Storybook story, or email), or let it auto-trigger from context ("improve this design", "make this alive").

**Pipeline (in order, gates cannot be skipped):**

1. **Preflight** — declares every component the run needs, asks before installing, records skips explicitly.
2. **audit-first** *(redesigns only)* — screenshots the current state, writes "what to keep".
3. **reference-research** *(gate, always)* — Dribbble 2026 + 2-3 competitors, live via `agent-browser`. The #1 lever against flat.
4. **context-pack** — discovers the target ONCE (files, tokens, screenshot); every lens judges this pack instead of re-scanning.
5. **4 lenses** *(read-only)* — `impeccable` (structure/IA), `design-taste-frontend` (anti-templated gate), `emil-design-eng` (signature motion), `web-design-guidelines` (accessibility AA). Each emits terse OK/KO + one-line findings, tagged `[skill]`.
6. **Multi-select** — one deduplicated P1/P2/P3 checklist; nothing changes without your pick.
7. **Apply** — one pass, all chosen fixes.
8. **vitality-verdict** *(gate)* — renders live (light/dark/mobile), diffs against the references, emits `alive` / `templated` / `flat`. Not `alive` → loops back to step 3.

**Enforcement hook:** a `PostToolUse` hook checks `.design-review/verdict.json` whenever a UI file is written. Modes via `DESIGN_REVIEW_GATE`: `warn` (default, advisory), `block` (exit 2 — must reach `alive`), `off`.

**Structured prompt example:**

```
/design-review:run apps/web/app/settings/page.tsx

Target: settings page (authenticated — private; SEO add-on off)
Stack: Next.js App Router, Tailwind, design-system tokens
Live browser: available (dev server on port 3000)
```

**Without Claude Code:** read `SKILL.md` and `references/pipeline.md` — the pipeline works with any AI assistant: run each gate in order, load each skill rather than summarizing it, accumulate findings, end with the explicit verdict.

## Advantages

- Won't pass "correct but flat" — the verdict gate forces vitality, not just defect-removal.
- Token-frugal: discover-once context-pack + terse read-only lenses (no re-scanning per lens).
- Nothing ships silently: preflight asks before installing, the hook warns/blocks on ungated UI writes.

## Attribution

Orchestrates skills authored by others — loads them, never paraphrases. Core (mandatory): [`impeccable`](https://github.com/pbakaus/impeccable), [`design-taste-frontend`](https://github.com/Leonxlnx/taste-skill), [`emil-design-eng`](https://github.com/emilkowalski/skills), `web-design-guidelines` (Anthropic). Wired add-ons: `ui-ux-pro-max`, `refero`, `frontend-design`, `review-animations`, `huashu-design`, `web-accessibility`, `seo`. Full detail: [references/attribution.md](references/attribution.md).

Alternative: clone into `~/.claude/skills/design-review` to load as a local plugin without a marketplace.

## License

MIT — see [LICENSE](./LICENSE).
