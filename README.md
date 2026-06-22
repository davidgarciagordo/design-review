# design-review

A **domain-agnostic design review/improvement pipeline** for AI coding agents.

It orchestrates several focused design skills (most authored by others) into one ordered pass:

> structure → scored audit → anti-slop → motion/polish → accessibility → (SEO if public) → **live visual reality-check**

…then emits a prioritized **P1/P2/P3** list, auto-applies P1, and asks before the rest.

It **adapts to your project**: no design system, no Storybook, private vs public (skips SEO), web
vs mobile, no live browser — each step is skipped gracefully and stated explicitly.

## Use it

Drop [`SKILL.md`](./SKILL.md) into your agent's skills directory (e.g. `~/.claude/skills/design-review/`)
and trigger with **"run it through design-review"**, **"design review"**, or `/design-review <target>`.

## It does not replace the skills it sequences

This is an **orchestrator**. The actual design work is done by skills authored by others — see the
**Attribution** table in [`SKILL.md`](./SKILL.md) for each skill, what it does, and where to install it.
If one is missing, the pipeline tells you which and links its source, then continues with the rest.

## Companion

Pairs with the [Forge methodology](https://github.com/davidgarciagordo/forge-methodology) (spec → grill →
plan → execute → verify → sign-off). Forge structures *what* you build; design-review polishes *how it looks*.

## License

MIT — see [LICENSE](./LICENSE).
