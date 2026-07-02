# web-design-guidelines — verified playbook (source: vercel-labs/agent-skills @ f8a72b9 · web-interface-guidelines @ 4e799d4)

> The skill is a SINGLE 39-line SKILL.md — pure prompt, no scripts, no embedded rules. All capability
> comes from the remote command.md it fetches.

## Install
```bash
npx skills add vercel-labs/agent-skills                                    # documented form (README.md:197)
npx -y skills@latest add vercel-labs/agent-skills --skill web-design-guidelines   # works too (verified), undocumented
```
⚠️ `curl -fsSL https://vercel.com/design/guidelines/install | bash` installs a DIFFERENT thing: the
`/web-interface-guidelines` slash command (copies command.md to ~/.claude/commands/), NOT this skill.
They are not interchangeable.

## Invoke
Skill tool: `skill: "web-design-guidelines"`, `args: "<file-or-pattern>"` (argument-hint,
SKILL.md:7). With no argument it asks the user which files to review (SKILL.md:39) — always pass the
target.

## Guidelines source + caching
Fetches `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
via WebFetch (SKILL.md:26,29). command.md is self-contained (~180 lines: rules + output format), so
caching it to `.design-review/web-guidelines.md` and passing it as input works — BUT SKILL.md:23
says "fetch fresh guidelines before each review", so the invocation must state explicitly
*"guidelines already fetched at <path>, do not re-fetch"*, and the cache should be revalidated
against `main` periodically (it is a living file).

## ⚠️ Real coverage — NO WCAG/AA, NO contrast ratios
command.md covers: a11y semantics (aria-label, labels, keyboard handlers, semantic-HTML-first,
aria-live, headings/skip-link), focus states (`:focus-visible`, never `outline-none`), forms,
animation (`prefers-reduced-motion`, transform/opacity), typography, overflow, images, performance,
touch/safe-areas, dark mode, i18n (`Intl.*`), hydration, copy, 12 anti-patterns. Output format:
terse `file:line`, `✓ pass` (command.md:158-180) — adopt it as the lens findings contract.

**It does NOT check WCAG conformance or contrast ratios** — the only "contrast" mention is about
interactive-state prominence (command.md:131). If this pipeline promises AA/contrast, it must come
from elsewhere: the same repo's **AGENTS.md** (7KB, MUST/SHOULD/NEVER — includes APCA contrast,
hit targets ≥24px/44px, mobile inputs ≥16px, focus trap/return, `inert`, virtualization). Fetch
`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/AGENTS.md`, cache to
`.design-review/web-guidelines-agents.md`, and inject BOTH files into the lens invocation. Numeric
contrast verification beyond that needs a real tool (axe/Lighthouse), not a prompt.
