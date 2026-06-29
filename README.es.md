[English](README.md) | **Español**

# 🎨 design-review

[![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-D97757)](https://github.com/davidgarciagordo/claude-code-setup-optimizer) [![skills.sh](https://img.shields.io/badge/skills.sh-skill-111111)](https://skills.sh) ![License MIT](https://img.shields.io/badge/license-MIT-2da44e) ![Version](https://img.shields.io/badge/version-2.0.0-blue)

> Un pipeline ejecutable y con gates que cura la **UI plana, sin vida y plantillada** — y termina con un veredicto explícito: **`alive` / `templated` / `flat`**.

**design-review** convierte un target visual — un componente, pantalla, página, email o dashboard — de *correcto* a *vivo*. No es un checklist que se lee; es un conjunto de **agentes + un comando `/design-review` + un hook** que ejecutan un pipeline imperativo: estudian referencias reales de 2026, invocan las skills de diseño correctas en orden y se niegan a dar el trabajo por terminado mientras el resultado siga pareciendo una plantilla.

Es compañero de [Forge Methodology](https://github.com/davidgarciagordo/forge-methodology): **Forge estructura qué construir; design-review hace que cómo se ve cobre vida**.

## El telos: vivo, no solo correcto

La mayoría de las revisiones de diseño optimizan una única pregunta — *"¿tiene defectos este diseño?"* — y alcanzan un techo: **correcto pero plano**. Puedes pasar cada check de contraste, espaciado y accesibilidad y aun así entregar una plantilla de 2024 con la vida lijada. Eliminar defectos nunca añade vitalidad.

design-review hace una pregunta diferente:

> ### ¿Está este diseño VIVO y es inconfundiblemente 2026 **contra estas referencias concretas**?

- **La corrección es el suelo, no el listón.** Un target que lo supera todo y aun así se lee como genérico ha **fallado**.
- **El veredicto es explícito:** cada ejecución termina con **`alive` / `templated` / `flat`**, juzgado contra referencias reales obtenidas en vivo — no contra la memoria del modelo de "buen diseño".
- **La vitalidad se construye, no se inspecciona** — mediante investigación de referencias y motion de firma, añadidos al diseño, no filtrados.

**Tres causas raíz de "plano", y cómo el pipeline las resuelve:**

| Causa raíz | Solución |
|---|---|
| **Telos equivocado** — un bucle de eliminación de defectos converge en "correcto plano" | Un **veredicto de vitalidad** explícito + un **bucle de vitalidad** que no se detiene hasta que el resultado es `alive` |
| **Sin investigación de referencias** — diseñar de memoria reproduce la media de los datos de entrenamiento (una plantilla) | Un **gate de investigación de referencias** no saltable: Dribbble 2026 + 2–3 competidores, en vivo, con agent-browser. *El palanca #1 contra lo plano.* |
| **Skills parafraseadas, no invocadas** — resumir "lo que diría impeccable" es un eco con pérdida | **Invocación real**: cada agente lente **carga el skill real** con la herramienta Skill. El pipeline solo dice qué input pasarle. |

### 🧩 Parte de una familia — misma firma, tres repos

| | Repo | Rol |
|---|---|---|
| 🛠️ | [**claude-code-setup-optimizer**](https://github.com/davidgarciagordo/claude-code-setup-optimizer) | **El hub** — metodología + automatizaciones (hooks · subagents · comandos) + `/optimize-my-setup` |
| 🔨 | [**forge-methodology**](https://github.com/davidgarciagordo/forge-methodology) | Estructura *qué construir* — alinear → spec → grill ×3 → plan → verificar |
| 🎨 | [**design-review**](https://github.com/davidgarciagordo/design-review) · *estás aquí* | Hace que *cómo se ve* cobre vida — referencias → skills core → veredicto de vitalidad |

## 📦 Instalación

```bash
# 🟢 Como skill (Claude Code + 20+ agentes vía skills.sh)
npx skills add davidgarciagordo/design-review

# 🔌 Como plugin standalone de Claude Code (agentes + comando /design-review + hook gate)
/plugin marketplace add davidgarciagordo/design-review
/plugin install design-review@design-review

# 🛠️ O todos los repos desde el hub
/plugin marketplace add davidgarciagordo/claude-code-setup-optimizer
```

También puedes `git clone` en `~/.claude/skills/` (solo el skill) — ver [Instalación](#instalación) más abajo.

---

## Qué hay en la caja (ejecutable, no solo orientativo)

| Pieza | Fichero | Rol |
|---|---|---|
| Comando | `commands/design-review.md` | `/design-review <target>` — orquesta los gates en orden |
| Agente · audit-first | `agents/design-audit-first.md` | **[GATE]** solo rediseños: captura el estado actual + "qué conservar" |
| Agente · reference-research | `agents/design-reference-research.md` | **[GATE]** Dribbble 2026 + competidores → 3–5 patrones → copiar+combinar+capa propia |
| Agente · lente impeccable | `agents/design-lens-impeccable.md` | **carga** `impeccable` — estructura / auditoría |
| Agente · lente taste | `agents/design-lens-taste.md` | **carga** `design-taste-frontend` — **gate anti-plantilla** |
| Agente · lente motion | `agents/design-lens-motion.md` | **carga** `emil-design-eng` — **motion de firma** |
| Agente · lente a11y | `agents/design-lens-a11y.md` | **carga** `web-design-guidelines` — accesibilidad AA |
| Agente · vitality verdict | `agents/design-vitality-verdict.md` | **[GATE]** check en vivo + diff vs referencias → `alive/templated/flat` |
| Hook | `hooks/design-review-gate.js` | PostToolUse en escrituras de UI — avisa/bloquea si el veredicto no es `alive` |

---

## El pipeline (imperativo · con gates · en orden)

| Paso | Qué ocurre | Skill / agente |
|------|------------|----------------|
| **0. Encuadre** | Detectar design system, Storybook, plataforma, público/privado, navegador en vivo. Una sola tanda de preguntas al responsable. | — |
| **1. audit-first** **[GATE · solo rediseños]** | Captura del estado actual; escribir "qué conservar". | `design-audit-first` |
| **2. reference-research** **[GATE · siempre]** | Dribbble 2026 + 2–3 competidores → 3–5 patrones robables → copiar + combinar + capa propia. **La palanca #1 contra lo plano.** | `design-reference-research` + `agent-browser` |
| **3a. estructura / auditoría** **[GATE]** | Jerarquía, IA, carga cognitiva, tokens, auditoría puntuada. | **carga** `impeccable` |
| **3b. anti-plantilla** **[GATE]** | Anti-slop **+ un gate que FALLA la salida genérica**. Criterio de salida: "esto solo podría ser ESTE producto." | **carga** `design-taste-frontend` |
| **3c. motion de firma** **[GATE]** | Al menos un momento de motion memorable (entrada escalonada, reveal, profundidad, deleite) — no solo higiene de hover. | **carga** `emil-design-eng` |
| **3d. accesibilidad** **[GATE]** | Contraste AA, teclado, focus visible, roles/labels, reduced-motion. La vitalidad nunca cuesta a11y. | **carga** `web-design-guidelines` |
| **4. Aplicar arreglos** | Una lista deduplicada P1/P2/P3; multi-select; ítems anti-plantilla + motion preseleccionados. | — |
| **5. Re-pasada informada** | Re-ejecutar solo las lentes que tocan los arreglos elegidos. | — |
| **6. vitality-verdict** **[GATE]** | Renderizar en vivo (claro/oscuro/móvil), **diff vs las referencias**, Core Web Vitals → `alive`/`templated`/`flat` explícito. | `design-vitality-verdict` + `agent-browser` |
| **7. Bucle de vitalidad** **[GATE]** | Si no es `alive`, iterar los pasos 3–6 (referencia más nítida, capa propia más fuerte, motion real) hasta N rondas. | — |

**Add-ons (opcionales, no son gates):** `huashu-design` (2ª lente anti-slop) · `review-animations` (crítica de motion) · `seo` (**solo targets públicos**) · `web-accessibility` (WCAG más profundo) · skill de diseño móvil (RN/Expo).

---

## Por qué design-review — con y sin

| | Sin design-review | Con design-review |
|---|---|---|
| **Telos** | "Eliminar defectos" → techo en correcto-pero-plano | "Hacerlo vivo vs referencias de 2026" → un veredicto explícito que no aprueba `flat` |
| **Referencias** | Diseñar de memoria → la media de los datos de entrenamiento → una plantilla | Un estudio en vivo de Dribbble 2026 + competidores antes de cualquier pixel; patrones elegidos, combinados, reskinned |
| **Fidelidad al skill** | Skills parafraseadas en bullets → eco con pérdida | Cada skill **cargada** con la herramienta Skill — razonamiento real, no un resumen |
| **Motion** | Higiene de hover en el mejor caso | Un **momento de motion de firma** obligatorio |
| **Anti-slop** | Una pasada de tono/copia | Un **gate anti-plantilla** que falla la salida genérica |
| **¿Terminado?** | "Se ve bien, a producción" | No terminado hasta que el veredicto diga `alive` — aplicado por un hook en escrituras de UI |

---

## Salida: un checklist y luego un veredicto

Todos los hallazgos de cada skill se reúnen en una lista deduplicada, agrupada por prioridad, y se presentan como un **checklist multi-select** (P1 + los ítems anti-plantilla y de motion de firma preseleccionados). Tú eliges qué corregir; el pipeline aplica solo eso. Luego renderiza el resultado en vivo, lo compara contra las referencias y emite el veredicto.

```
¿Qué hallazgos debo corregir?  (multi-select · ítems de vitalidad preseleccionados)

P1 — Roto / identidad / vitalidad
  [x] Plantillado: card grid por defecto + hero/3-tarjetas — sin capa propia (gate anti-plantilla FALLADO) [design-taste-frontend]
  [x] Sin motion de firma — solo higiene de hover; la referencia pedía una entrada de tarjetas escalonada   [emil-design-eng]
  [x] Contraste texto secundario 2,85:1 — falla WCAG AA                                                    [impeccable, web-design-guidelines]

P2 — Mejoras
  [ ] Densidad plana y uniforme — adoptar el bento asimétrico de la referencia #2                          [impeccable]
  [ ] LCP 3,8s — imagen hero no precargada                                                                  [agent-browser]

P3 — Pulido
  [ ] Transición de hover a 320ms se siente lenta → 150ms                                                   [emil-design-eng]

────────────────────────────────────────────────────────────────────
Veredicto de vitalidad:  templated → (bucle) → alive
  juzgado contra .design-review/references.md — bento + numerales display + entrada escalonada implantados
```

---

## Atribución

Este pipeline orquesta skills de terceros — las **carga**, nunca las parafrasea. **Los 4 skills core son obligatorios; el resto son add-ons opcionales.** Verifica las URLs antes de instalar.

| Skill | Rol | Fuente |
|---|---|---|
| **`impeccable`** *(core)* | Estructura, jerarquía, IA, tokens, auditoría puntuada | https://github.com/pbakaus/impeccable |
| **`design-taste-frontend`** *(core)* (a.k.a. `taste-skill`) | Anti-slop + gate anti-plantilla | https://github.com/Leonxlnx/taste-skill |
| **`emil-design-eng`** *(core)* | Pulido + motion de firma | https://github.com/emilkowalski/skills |
| **`web-design-guidelines`** *(core)* | Accesibilidad AA, teclado, contraste | Anthropic — Web Interface Guidelines |
| `agent-browser` | Navegador en vivo: investigación de referencias + el veredicto de vitalidad | Integrado en Claude Code / configurado por proyecto |
| `huashu-design` *(add-on)* | 2ª lente anti-slop independiente | https://github.com/alchaincyf/huashu-design |
| `review-animations` *(add-on)* | Crítica de timing/easing/jank de animaciones | https://github.com/emilkowalski/skills |
| `web-accessibility` / `accessibility` *(add-on)* | Auditoría WCAG 2.2 en profundidad | https://github.com/addyosmani/web-quality-skills |
| `seo` *(add-on, solo públicos)* | Visibilidad en buscadores | https://github.com/addyosmani/web-quality-skills |
| skill de diseño móvil *(add-on)* | Pantallas móviles / RN | elige la tuya (p. ej. Sleek — sleek.design) |

Detalle completo: [references/attribution.md](references/attribution.md).

---

## Cómo usarlo

### Instalación

Como plugin (agentes + comando + hook), usa los comandos del marketplace anteriores. Solo como skill:

```bash
git clone https://github.com/davidgarciagordo/design-review ~/.claude/skills/design-review
```

### Disparadores

```
improve design
make this alive / less flat
design review
/design-review <target>
```

### Prompt estructurado

```
/design-review apps/web/app/settings/page.tsx

Target: página de ajustes (autenticada — privada; add-on SEO desactivado)
Stack: Next.js App Router, Tailwind, tokens del design system
Navegador en vivo: disponible (dev server en puerto 3000)
```

### El hook de aplicación

Cuando una escritura/edición toca un fichero de UI, el hook PostToolUse comprueba si hay un veredicto `alive` en `.design-review/verdict.json`. Modos mediante `DESIGN_REVIEW_GATE`: `warn` (por defecto, orientativo), `block` (exit 2 — el agente debe ejecutar `/design-review` hasta `alive`), `off` (desactivado).

### Sin Claude Code

Lee `SKILL.md` y `references/pipeline.md`. El pipeline funciona con cualquier asistente de IA — ejecuta cada gate en orden, carga cada skill en lugar de resumirla, acumula hallazgos y termina con el veredicto explícito.

---

## Referencias

| Referencia | Contenido |
|-----------|----------|
| [SKILL.md](SKILL.md) | El telos + el pipeline imperativo y con gates |
| [references/pipeline.md](references/pipeline.md) | Detalle paso a paso: qué hacer, qué input pasar a cada skill, cómo encadenan los hallazgos |
| [references/attribution.md](references/attribution.md) | Skills core vs add-on, instalación, fallbacks |
| [templates/vitality-verdict.md](templates/vitality-verdict.md) | Forma del veredicto + diff de referencias |
| [templates/findings-checklist.md](templates/findings-checklist.md) | Checklist de hallazgos |

---

## Licencia

MIT — ver [LICENSE](./LICENSE).

---
<sub>Hecho por [David García Gordo](https://github.com/davidgarciagordo) · MIT · parte de la familia [claude-code-setup-optimizer](https://github.com/davidgarciagordo/claude-code-setup-optimizer)</sub>
