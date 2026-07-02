# review-animations — verified playbook (source: emilkowalski/skills @ 1274a05)

> Two files: SKILL.md + STANDARDS.md (catalog of exact values: cubic-bezier curves, duration table,
> spring configs). Scope: motion code ONLY — it declines general reviews (SKILL.md:9).

## ⚠️ NOT invocable via the Skill tool — by the model, ever
Frontmatter `disable-model-invocation: true` (SKILL.md:4). This does not just mean "no
auto-trigger": the model cannot invoke it explicitly either. Real routes:
1. The USER types `/review-animations` (slash command).
2. An orchestrator/agent **Reads SKILL.md + STANDARDS.md from the installed skill directory and
   applies them as prompt content** — this is what this pipeline does. Never call
   `Skill(review-animations)`; it will fail.

## Install (it IS standalone-installable — a prior claim here said otherwise; that was false)
```bash
npx skills@latest add emilkowalski/skills --skill review-animations
# one-shot without installing: npx skills use emilkowalski/skills@review-animations
```

## Contract (real)
- Substantive bar: the "Ten Non-Negotiable Standards" (SKILL.md:19-41). STANDARDS.md is the citable
  value catalog loaded "whenever a finding needs a precise value" (SKILL.md:17,107).
- Output, two mandatory parts: (1) `| Before | After | Why |` table (SKILL.md:80-89);
  (2) verdict grouped in **6 impact tiers**, most severe first (:91-100), closing with an explicit
  **Block** or **Approve** (:102-105), citing file:line (:107).
- Posture: "Default to flagging. Approval is earned, not assumed" (SKILL.md:13).

## Use in this pipeline
- Position: LAST motion gate, after emil-design-eng fixes are applied — the binary judge, not the
  creative lens.
- The **6 impact tiers are the native severity source** — map tiers 1-2 → P1, 3-4 → P2, 5-6 → P3
  instead of inventing priorities.
- The 14 escalation triggers (SKILL.md:45-60) are grep-able → run them as a cheap deterministic
  pre-check before spending model tokens.
- The Remedial Preference Hierarchy (SKILL.md:62-74: delete > reduce > fix easing > origin >
  interruptible > GPU > asym > polish > a11y) orders the fix phase.
- Known false positive: modals are exempt from origin-aware animation (STANDARDS.md:59).
