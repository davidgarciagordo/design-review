# emil-design-eng — verified playbook (source: emilkowalski/skills @ 1274a05)

> Verified against the real 680-line SKILL.md. The repo ships 3 skills: `emil-design-eng`,
> `review-animations` (see its own playbook), and `animation-vocabulary` (motion glossary — useful
> vocabulary for reference-research briefs).

## Install
```bash
npx skills@latest add emilkowalski/skills --skill emil-design-eng
```

## Invoke
Skill tool: `skill: "emil-design-eng"` with the **concrete question in the same invocation**
(e.g. "review the motion of <target>; compare against <ref>; cite file:line for every issue").
Without a specific question it replies ONLY with a ready-greeting and waits (SKILL.md:8-14) — any
specific question bypasses this; no magic phrase needed.
No preconditions: single SKILL.md, no scripts, no setup.

## Output contract (real)
A mandatory markdown table `| Before | After | Why |`, one row per issue (SKILL.md:38-60 — it
explicitly forbids "Before:/After:" lists). **No native severities** — P1/P2/P3 mapping is THIS
pipeline's layer, own it as such. The table carries no file:line by design → demand it in the prompt.

## Philosophy friction — declare it, don't hide it
The skill's bias is REMOVING motion: 100+ interactions/day = "No animation. Ever." (SKILL.md:68-79);
"If the purpose is just 'it looks cool'… don't animate" (:93). The delight window is
"Rare/first-time" moments (:75). **"Signature motion moment" is THIS pipeline's doctrine, not
Emil's** — when demanding one, target rare/first-run/key-action surfaces where his framework
actually permits delight, and let his framework veto motion on high-frequency interactions.

## Diagnosis order
After context-pack/audit, BEFORE the strict gate — this is the judgment lens (should it animate?,
easing, duration, origin, springs, gestures, perf, a11y). Its final checklist (SKILL.md:663-679)
doubles as a cheap pre-pass before invoking the review-animations gate.

## Unused capabilities worth knowing
Springs + interruptibility (:147-195) · gestures/drag with velocity-dismiss (:444-480) · clip-path
techniques (:398-442) · performance rules (Framer Motion x/y not GPU-accelerated, CSS-var recalc
storms, WAAPI — :482-528) · slow-motion/frame-by-frame/fresh-eyes debugging (:642-661, fits the
vitality-verdict) · Sonner component-building principles (:562-606).
