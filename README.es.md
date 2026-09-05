[English](README.md) | **Español**

# 🎨 design-review

Las UIs generadas por IA pasan todos los checks y aun así se parecen a cualquier otra página hecha con IA. design-review convierte **"se ve genérico" en un veredicto suspenso y verificable por máquina**: un pipeline con gates para Claude Code que estudia referencias reales actuales, ejecuta 4 skills de diseño de terceros como lentes read-only, y se niega a darse por terminado hasta que el resultado, renderizado en vivo, se juzga **`alive`** — ni `templated`, ni `flat`.

Compañero de [forge-methodology](https://github.com/davidgarciagordo/forge-methodology): Forge estructura *qué construir*; design-review hace que *cómo se ve* cobre vida.

## 🧩 Qué hay dentro

| Pieza | Qué es |
|---|---|
| [`SKILL.md`](SKILL.md) | El skill orquestador — telos, gates, reglas. Se auto-dispara con "mejora este diseño" / "hazlo vivo". |
| [`commands/run.md`](commands/run.md) | `/design-review:run <target>` — el punto de entrada explícito (mismo pipeline). |
| [`agents/`](agents/) | 8 agentes: audit-first, reference-research, context-pack, las 4 lentes, vitality-verdict. |
| [`references/skills/`](references/skills/) | **Los 7 playbooks verificados** — uno por skill orquestada, comprobados contra el source real de cada skill en un commit pineado: [impeccable](references/skills/impeccable.md) · [taste-skill](references/skills/taste-skill.md) · [emil-design-eng](references/skills/emil-design-eng.md) · [review-animations](references/skills/review-animations.md) · [web-design-guidelines](references/skills/web-design-guidelines.md) · [ui-ux-pro-max](references/skills/ui-ux-pro-max.md) · [huashu-design](references/skills/huashu-design.md). Invocación exacta, gotchas y correcciones a afirmaciones falsas habituales sobre cada skill. |
| [`examples/`](examples/README.es.md) | Dos ejecuciones ilustrativas completas (una página de ajustes, un botón de design system) con los artefactos y outputs reales de cada paso. |
| [`hooks/design-review-gate.js`](hooks/design-review-gate.js) | Enforcement PostToolUse: una escritura de UI sin veredicto `alive` avisa (por defecto), bloquea, o se apaga — `DESIGN_REVIEW_GATE=warn\|block\|off`. |
| [`scripts/preflight.mjs`](scripts/preflight.mjs) | El manifiesto de componentes + detector (también caza "plugin en disco pero deshabilitado esta sesión"). |
| [`templates/`](templates/) | Plantillas de [findings-checklist](templates/findings-checklist.md) · [vitality-verdict](templates/vitality-verdict.md). |
| [`references/pipeline.md`](references/pipeline.md) · [`references/attribution.md`](references/attribution.md) | Referencia paso a paso · quién escribió qué + matriz completa de instalación. |

## 📦 Instalación y quick start

```bash
/plugin marketplace add davidgarciagordo/design-review
/plugin install design-review
```

O toda la suite (este + token-economy, forge-methodology, working-methods, automations) desde [un único catálogo](https://github.com/davidgarciagordo/claude-plugins):

```bash
/plugin marketplace add davidgarciagordo/claude-plugins
/plugin install design-review@davidgarciagordo-plugins
```

> **Nota honesta:** el comando `/design-review:run`, los 8 agents y el hook de enforcement solo
> existen en tu sesión cuando el plugin está **instalado y habilitado**
> (`/plugin install design-review@davidgarciagordo-plugins`). Leer este repo sin instalarlo te da
> la metodología como prosa — ningún gate se ejecuta.

Después, apúntalo a un target:

```
/design-review:run apps/web/app/settings/page.tsx
```

El pipeline corre de principio a fin y te pregunta exactamente **una** cosa — qué hallazgos aplicar. Así es esa interacción (de [`examples/`](examples/README.es.md), ejemplo 1):

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

…y cada ejecución termina con un veredicto explícito escrito en `.design-review/verdict.json`:

```
Vitality verdict:  templated → (loop) → alive
  judged against .design-review/references.md
  bento density + teal identity layer + staggered entrance landed
```

## ⚙️ El pipeline

Los gates no se pueden saltar ni reordenar. Cada fase deja un artefacto en `.design-review/`:

| # | Fase | Agente / dueño | Artefacto (`.design-review/`) | Gate |
|---|---|---|---|---|
| 0 | Preflight — declara, **pregunta**, instala-u-omite explícitamente | orquestador + `scripts/preflight.mjs` | `preflight.md` | nunca instala en silencio; las omisiones se registran y anuncian |
| 1 | audit-first — captura el estado actual, "qué conservar" | `design-audit-first` | `audit-first.md` | **GATE** — solo rediseños |
| 2 | reference-research — Dribbble popular actual + refero + 2-3 competidores del dominio, en vivo | `design-reference-research` | `references.md` (+ el plan de autoría 2b) | **GATE, siempre** — sin artefacto → STOP |
| 3 | context-pack — descubre el target UNA VEZ (mapa file:line, tokens, capturas) | `design-context-pack` | `context-pack.md` | alimenta cada lente; mata el re-escaneo |
| 4 | 4 lentes, read-only, ruteadas | `design-lens-impeccable` · `-taste` · `-motion` · `-a11y` | hallazgos terse, fusionados en una lista | **GATE** — las 4 devuelven `OK`/`KO`; cero ediciones durante el diagnóstico |
| 5 | multi-select — un checklist deduplicado P1/P2/P3 | orquestador (`AskUserQuestion`) | el checklist elegido | la ÚNICA decisión del owner; nada se aplica sin marcar |
| 6 | apply + re-pass informado | orquestador → el fix command dueño de cada hallazgo | el diff | una pasada, solo después del ask |
| 7 | vitality-verdict — render en vivo (claro/oscuro/móvil), diff vs referencias | `design-vitality-verdict` | `verdict.json` | **GATE** — `alive`, o vuelve al 3 (≤3 rondas) |

**Hook de enforcement:** un hook `PostToolUse` comprueba `verdict.json` cada vez que se escribe un fichero de UI — `warn` (por defecto), `block` (exit 2), u `off` vía `DESIGN_REVIEW_GATE`.

## ❓ ¿Por qué no basta con pedirle al modelo que "revise el diseño"?

Porque las skills de terceros que realmente cargan el juicio de diseño fallan de formas concretas y verificadas cuando se usan de forma ingenua. Los [7 playbooks](references/skills/) se comprobaron línea a línea contra el source de cada skill en un commit pineado; el pipeline existe para prevenir estos modos de fallo:

1. **`impeccable` invocado sin argumentos es un recomendador que se queda esperando** — sugiere 2-3 comandos y se para hasta recibir confirmación. El pipeline lo rutea siempre a `audit` + `critique` y ejecuta antes su setup obligatorio de 5 pasos (saltarse el registro brand/product produce exactamente el output genérico que este pipeline mata).
2. **La skill de taste es un GENERADOR** — sin rutear, construye una página nueva en vez de auditar la tuya; y su nombre registrado varía según el directorio de instalación (`taste-skill` vs `design-taste-frontend`). El pipeline la rutea a §11 redesign-audit + §14 pre-flight, prohíbe la generación, y resuelve ambos nombres.
3. **`review-animations` no puede ser invocada por el modelo jamás** (`disable-model-invocation: true`) — un orquestador ingenuo pierde el gate de motion en silencio. El pipeline LEE su SKILL.md + STANDARDS.md de disco y los aplica como contenido de prompt.
4. **El `command.md` que descarga Vercel NO contiene checks de WCAG/ratio de contraste** — una "review" de a11y solo con él se salta el contraste por completo. El pipeline inyecta además el `AGENTS.md` del repo (contraste APCA, hit targets), y nunca afirma números formales de contraste desde un prompt (eso necesita una herramienta de medición).
5. **`emil-design-eng` saluda y espera si se invoca sin pregunta** — y su tabla Before/After omite file:line por diseño. El pipeline pasa la pregunta concreta en la misma invocación y exige file:line en el prompt.
6. **`huashu-design` está íntegramente en chino y no se auto-limita** — y su veto de Concepto (nota ≤5 capa el total en 6.0) es una señal de `templated` usable por máquina que una invocación casual nunca saca a la luz. El pipeline la invoca por nombre, fija el idioma de salida, y la pinea a su modo review del Step 10, en read-only.

Dos modos de fallo más que ninguna skill cubre tienen sus propios gates: **diseñar de memoria** (el paso 2 fuerza research de referencias en vivo antes de diseñar nada) y **declarar terminado desde el código** (el paso 7 renderiza el target real en un navegador antes de cualquier veredicto).

## 🔍 Requisitos — la versión honesta

- **Claude Code.** Las piezas ejecutables (ruteo vía Skill tool, agentes, `AskUserQuestion`, el hook) son features de Claude Code. Fuera de Claude Code puedes seguir [`SKILL.md`](SKILL.md) + [`references/pipeline.md`](references/pipeline.md) a mano como metodología, pero nada de esto se ejecuta solo en otro sitio.
- **Las 4 skills core son de terceros y NO vienen incluidas** — [`impeccable`](https://github.com/pbakaus/impeccable) (Paul Bakaus), [`design-taste-frontend`](https://github.com/Leonxlnx/taste-skill) (Leonxlnx), [`emil-design-eng`](https://github.com/emilkowalski/skills) (Emil Kowalski), [`web-design-guidelines`](https://github.com/vercel-labs/web-interface-guidelines) (Vercel). El paso 0 detecta lo que falta y **pregunta ítem a ítem antes de instalar** — nunca instala en silencio, y tampoco omite en silencio: una skill core saltada hace fallar su lente de forma ruidosa (`Unknown skill` / degradación anunciada), no produce calladamente una review más floja. Comandos de instalación: [references/attribution.md](references/attribution.md); `node scripts/preflight.mjs` muestra qué hay presente en tu entorno.
- **`agent-browser` es cuasi-requerido — y debe ser el de Vercel Labs.** Es la [CLI de automatización de navegador de Vercel Labs](https://github.com/vercel-labs/agent-browser), construida y optimizada para browsing dirigido por agentes (`npx -y skills@latest add vercel-labs/agent-browser`) — **no un built-in de Claude Code, y no intercambiable por una herramienta genérica de automatización de navegador**. Los dos gates de navegador (reference-research y el veredicto final) dependen de ella — sin ella el veredicto es **solo provisional**: no se puede afirmar `alive` de un diseño que nadie ha renderizado.
- **Acceso a red** (research de Dribbble/competidores, fetch de las guidelines de Vercel), `node` para los scripts del repo, `python3` solo si usas `ui-ux-pro-max`.

## 📖 Mini-glosario

- **`alive` / `templated` / `flat`** — los tres valores del veredicto. `alive` = los patrones referenciados aterrizaron y el resultado solo podría ser este producto; `templated` = correcto pero intercambiable con cualquier template SaaS; `flat` = sin vida incluso antes de considerar la identidad.
- **house layer** — el re-vestido de los patrones tomados de las referencias con la identidad y tokens propios del proyecto, para que la combinación se lea como *este* producto, no como las referencias pegadas.
- **signature motion** — un momento de motion memorable en una superficie rara/de primer uso. Doctrina de este pipeline, en tensión deliberada con el sesgo anti-motion de Emil — su framework sigue vetando motion en interacciones de alta frecuencia.
- **dials** — los 3 mandos de la skill de taste (`DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`), pre-fijados desde `references.md` en vez de preguntados conversacionalmente.
- **context-pack** — el artefacto discover-once: árbol de componentes, tokens en uso, mapa `file:line`, capturas, hallazgos ya conocidos. Las lentes juzgan este pack en vez de re-escanear cada una toda la superficie.

## ⚠️ Limitaciones y costes

- **Una ejecución completa es pesada**: 8+ despachos de agentes, navegación en vivo, capturas, hasta 3 loops de veredicto. Para una lente sobre un fichero, invoca esa skill directamente (ver [ejemplos](examples/README.es.md#un-prompt-para-todas-o-una-lente-core-por-separado)).
- **Necesita red**: el research de referencias y los fetches de guidelines de a11y son en vivo; sin conexión, el paso 2 se degrada y el veredicto solo puede ser provisional.
- **Los dashboards relajan las reglas de landing**: el surface routing mantiene el listón anti-plantilla en todas partes, pero la rúbrica específica de landing de la skill de taste (hero/eyebrow/marquee) no aplica a UI de producto densa — espera hallazgos de taste más suaves ahí, por diseño.
- **La heurística de fichero-de-UI del hook es conservadora pero sigue siendo una heurística** — usa `DESIGN_REVIEW_GATE=off` en ediciones que no tocan diseño.

## 🙏 Atribución

Orquesta skills de terceros — las carga, nunca las parafrasea. Core (obligatorias, de terceros — ver [Requisitos](#requisitos--la-versión-honesta)): [`impeccable`](https://github.com/pbakaus/impeccable) (Paul Bakaus), [`design-taste-frontend`](https://github.com/Leonxlnx/taste-skill) (Leonxlnx), [`emil-design-eng`](https://github.com/emilkowalski/skills) (Emil Kowalski), [`web-design-guidelines`](https://github.com/vercel-labs/web-interface-guidelines) (Vercel). Add-ons conectados: `ui-ux-pro-max`, `refero`, `frontend-design` (plugin oficial de Anthropic — criterio del plan), `building-components` (estándar de Vercel — criterio de autoría de componentes en el apply), [`agent-browser`](https://github.com/vercel-labs/agent-browser) (Vercel Labs — EL tester: render vivo para research y el veredicto final; optimizado para browsing dirigido por agentes, nunca un sustituto genérico), `review-animations`, `huashu-design`, `web-accessibility`, `seo`. Detalle completo: [references/attribution.md](references/attribution.md).

Alternativa: clónalo en `~/.claude/skills/design-review` para cargarlo como plugin local sin marketplace.

## ⚖️ Licencia

MIT — ver [LICENSE](./LICENSE).
