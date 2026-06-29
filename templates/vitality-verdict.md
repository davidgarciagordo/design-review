# Vitality verdict — template

The closing gate of the pipeline. Judge the **rendered** target against the **references** from step 2,
not against an abstract ideal. Correctness is assumed by now — this measures **vitality**.

The machine-checkable artifact is `.design-review/verdict.json` (the hook reads it); this markdown is the
human-readable companion.

---

## Run

**Target:** <!-- file path / route / component / story -->
**Date:** <!-- YYYY-MM-DD -->
**References:** `.design-review/references.md`
**Loop round:** <!-- 1 of N -->

---

## Render (ground truth — screenshots, not code)

- [ ] Light — <!-- screenshot path -->
- [ ] Dark — <!-- screenshot path -->
- [ ] Mobile (375px) — <!-- screenshot path -->

---

## Diff against the references

For each pattern that was meant to land (from step 2), did it land or regress to the mean?

| Pattern (from references) | Tag | Landed? | Note |
|---|---|---|---|
| <!-- e.g. asymmetric bento hero + stat tiles --> | layout | ✅ / ⚠️ / ❌ | |
| <!-- e.g. display-weight numerals --> | type | | |
| <!-- e.g. teal→amber focal accent --> | color | | |
| <!-- e.g. useful density, no key-content scroll --> | density | | |
| <!-- e.g. staggered card entrance on load --> | motion | | |

---

## The vitality bar

- [ ] **House layer** — reads unmistakably as *this* product (identity/tokens), not a default kit
- [ ] **Density / bento** — useful density, focal hierarchy, no scroll for the key content
- [ ] **Signature motion moment FIRES** — verified live (load/interaction), not inferred from code
- [ ] **Typography with a point of view** — not stock system defaults
- [ ] **Core Web Vitals "Good"** — LCP ≤ 2.5s / CLS ≤ 0.1 / INP ≤ 200ms / TTFB ok

---

## Verdict (pick exactly one)

- [ ] **`alive`** — hits the references, house layer present, useful density, a motion moment that fires,
      a typographic point of view. **Passes.**
- [ ] **`templated`** — correct and clean but generic; reference patterns didn't land or were sanded off.
      **Fails → loop (steps 3–6).**
- [ ] **`flat`** — lifeless: no motion, no focal hierarchy, no identity. **Fails → loop.**

**Reason (one line, vs the references):** <!-- what landed / what's missing -->

**If not `alive` — the 2–3 specific moves to get there (from the references):**
1. <!-- -->
2. <!-- -->
3. <!-- -->

---

## verdict.json (write this)

```json
{
  "verdict": "alive | templated | flat",
  "target": "",
  "reference": ".design-review/references.md",
  "reason": "",
  "patterns_landed": [],
  "patterns_missing": [],
  "motion_moment_fires": false,
  "core_web_vitals": { "lcp": "", "cls": "", "inp": "", "ttfb": "" },
  "screenshots": { "light": "", "dark": "", "mobile": "" },
  "timestamp": ""
}
```

→ Back to [design-review](../README.md)
</content>
