[English](README.md) | **Español**

# design-review — Ejemplos de uso

> Ejemplos trabajados de forma concreta que muestran el pipeline con gates en acción: investigación de referencias, las 4 lentes core cargadas con la herramienta Skill, el gate anti-plantilla fallando y recuperándose, y un veredicto de vitalidad explícito.

Estos son ejemplos realistas, no sintéticos. Cada uno muestra el target, qué pasos se ejecutaron (y cuáles se omitieron), qué encontró cada lente, el checklist presentado, qué se aplicó y el veredicto de vitalidad final juzgado contra las referencias en vivo.

---

## Cómo invocar

**Corto** — deja que el pipeline detecte capacidades y se ejecute:

```
/design-review apps/web/app/settings/page.tsx
```

**Estructurado** — proporciona contexto para evitar preguntas de detección:

```
/design-review apps/web/app/settings/page.tsx

Target: página de ajustes de cuenta (autenticada — privada)
Stack: Next.js App Router, Tailwind CSS, tokens de @acme/design-system
Storybook: disponible en localhost:6006
Navegador en vivo: disponible (dev server en puerto 3000)
```

Ambas formas funcionan. La forma estructurada le da al pipeline todo lo que necesita para saltar la detección e ir directo al paso 1.

---

## Un prompt para todas, o una lente core por separado

`/design-review` es el **un prompt para todas** — ejecuta cada lente aplicable en orden, fusiona los hallazgos en un solo checklist y termina con un veredicto de vitalidad. Cada una de las 4 lentes core es independiente y puede invocarse sola cuando solo quieres esa lente:

| Si solo quieres… | Invoca por separado |
|---|---|
| Estructura / jerarquía / IA / auditoría puntuada | `impeccable` |
| Anti-slop + gate anti-plantilla | `design-taste-frontend` (a.k.a. `taste-skill`) |
| Motion de firma + pulido | `emil-design-eng` |
| Accesibilidad (WCAG AA) | `web-design-guidelines` |
| Referencias de productos reales (galería + tokens) *(wired)* | `refero` (vía agent-browser o MCP) |
| Autoría: token-plan + firma + UX-writing *(wired, integrado en el plan)* | `frontend-design` |
| Gate Block/Approve de motion *(wired)* | `review-animations` |
| 2ª lente anti-slop *(add-on)* | `huashu-design` |
| SEO *(add-on, solo páginas públicas)* | `seo` |

```
# una lente core por separado
Ejecuta impeccable en apps/web/app/settings/page.tsx — solo auditoría puntuada, sin más pasos.

# todo, orquestado, un solo checklist, un veredicto de vitalidad
/design-review apps/web/app/settings/page.tsx
```

Cada lente core es de su autor original (ver *Atribución* en el README principal). El pipeline solo las secuencia — no las parafrasea. ¿Falta alguna? El paso 0 ofrece instalarla.

---

## Ejemplo 1 — Página de ajustes (aplicación web autenticada)

**Target:** `apps/web/app/settings/page.tsx` — página de ajustes con múltiples secciones (perfil, notificaciones, facturación) en una aplicación Next.js autenticada.

**Stack:** Next.js App Router, Tailwind CSS con tokens del design system, Storybook disponible, dev server en marcha.

### Paso 0 — Preflight y encuadre

**Preflight** (`node scripts/preflight.mjs --write`):

```
✓ impeccable            present (~/.claude/skills/impeccable)
✓ design-taste-frontend present (autoskills)
✓ emil-design-eng       present (autoskills)
✓ web-design-guidelines present (Claude Code default)
✓ ui-ux-pro-max         present (plugin)
✓ review-animations     present (autoskills)
✓ frontend-design       present (marketplace)
✗ refero                missing — install: Refero MCP (npx refero-mcp) o usar agent-browser por defecto
✗ huashu-design         missing — install: git clone https://github.com/alchaincyf/huashu-design ~/.claude/skills/huashu-design
✓ agent-browser         present (Claude Code built-in)
```

[AskUserQuestion — un solo batch para todos los faltantes]:
- `refero`: ¿instalar Refero MCP ahora o saltar? → **saltar**
- `huashu-design`: ¿instalar ahora o saltar? → **saltar**

SKIPPED `refero` → reference-research degrada a agent-browser sobre refero.design (sin token specs de DESIGN.md).
SKIPPED `huashu-design` → asset-integrity brand-spec + verificación Playwright no disponibles; el veredicto usa capturas de agent-browser.

**Encuadre:**

```
Design system: sí (packages/design-system — tokens en design-system/tokens.ts)
Storybook: sí (localhost:6006)
Plataforma: web
Visibilidad del target: privado/autenticado → add-on SEO OMITIDO
Navegador en vivo: sí (dev server en localhost:3000)
Tipo: rediseño de superficie existente → audit-first SE EJECUTA
```

**Surface routing:** página de ajustes multi-sección autenticada → régimen **dashboard/dense**. Lente primaria: impeccable + reglas de densidad (huashu OMITIDO → densidad vía impeccable). Las reglas exclusivas de landing de taste se relajan.

### Paso 1 — audit-first [GATE · solo rediseños]

El agente `design-audit-first` renderiza la página de ajustes actual (claro/oscuro/móvil) y escribe `.design-review/audit-first.md`:

**Conservar:** la estructura de tres secciones (Perfil / Notificaciones / Facturación) es un modelo mental reconocible; el borde izquierdo teal en el ítem de nav activo se lee como "de marca". **Atacar:** mismo peso visual en las tres secciones; botón de guardar por sección (tres primarios en competencia); markup de headings roto; densidad plana sin ritmo bento.

### Paso 2 — reference-research [GATE · siempre · la palanca #1 contra lo plano]

El agente `design-reference-research` abre `dribbble.com/shots/popular/web-design` (2026 popular), tres páginas de ajustes de competidores (Linear, dashboard Vercel, ajustes Notion) con `agent-browser`, **`refero`** (galería vía agent-browser sobre refero.design — MCP OMITIDO; productos reales publicados: Mercury, Vercel, Linear listados allí), y usa el **vocabulario de `ui-ux-pro-max`** para nombrar estilos/paletas/combinaciones tipográficas con precisión. Extrae 5 patrones concretos y escribe `.design-review/references.md`:

1. **[layout]** Dos columnas: nav lateral fijo + panel de contenido — Linear. Elimina los headings de sección repetitivos.
2. **[densidad]** Bento asimétrico dentro de cada sección — filas de datos más compactas, headings más aireados — dashboard Vercel.
3. **[motion]** Entrada escalonada de secciones en la primera carga (100ms de stagger por sección) — shot de Dribbble #1.
4. **[tipo]** Numerales display para las estadísticas de uso de facturación (% de plan usado, seats usados) — facturación de Notion.
5. **[color]** El borde izquierdo teal en el ítem de nav activo se gradúa a un fondo de sección con tinte teal — exclusivo de este producto.

**Listón para este target:** *"La página se lee como una superficie de ajustes de producto Plexum, no como una plantilla shadcn genérica — densidad bento, secciones escalonadas y el marcador de identidad teal aterrizan."*

### Paso 2b — Plan (autoría · integra `frontend-design`)

Añadido a `.design-review/references.md`:

**Token-plan (4 hex, subordinado a los tokens de `packages/design-system` — estos tienen prioridad):**
- Relleno acento: `#0f7e74` (teal-700 — DS `color-brand-primary`)
- Superficie brand-subtle: `#f0faf9` (6% de tinte teal — DS `surface-brand-subtle`)
- Texto énfasis: `#111827` (DS `text-primary`)
- Separador/atenuado: `#e5e7eb` (DS `border-subtle`)

**Roles tipográficos (2+):** numerales display para estadísticas de facturación (`font-variant-numeric: tabular-nums`); cuerpo legible (14px / 1.5 — corrige el hallazgo de 3a).

**Elemento de firma:** fondo de sección activa con tinte teal que se gradúa desde el marcador de borde izquierdo del nav — el único detalle que solo podría ser de este producto.

**3 looks AI-por-defecto a evitar:** (1) rejilla uniforme de tarjetas con sombra/radio idéntico en cada sección; (2) formulario centrado de ancho completo con exceso de espacio en blanco; (3) paleta gris atenuada + acento azul (aspecto genérico de SaaS).

**Checklist de UX-writing:** ✓ sin texto de placeholder redundante · ✓ el estado del toggle se autoexplica (sin etiqueta "Activado/Desactivado") · ✓ CTA único por vista · ✓ headings de sección en capitalización de oración.

### Paso 3a — lente: impeccable [GATE]

El agente `design-lens-impeccable` **carga el skill `impeccable` con la herramienta Skill** y le pasa el target + las referencias del paso 2.

Hallazgos:
- Puntuación tipografía 6/10. Texto de cuerpo a 13px sobre blanco — por debajo del umbral de lectura cómoda.
- Puntuación espaciado 5/10. Las secciones comparten 24px de padding uniforme, solo 8px entre ellas — ritmo comprimido e indiferenciado.
- Puntuación contraste 4/10. Texto secundario `#9ca3af` sobre blanco = 2,85:1 — falla WCAG AA para texto normal.
- Puntuación CTA 5/10. Tres "Guardar cambios" primarios idénticos en la misma vista. (También marcado: estructura correcta pero genérica — alimenta 3b.)
- Puntuación layout 7/10. Una columna adecuada; sin overflow en los anchos probados.

### Paso 3b — lente: design-taste-frontend [GATE — anti-plantilla]

El agente `design-lens-taste` **carga el skill `design-taste-frontend` con la herramienta Skill** y le pasa el target + las referencias del paso 2.

**Gate anti-plantilla: FALLADO.** La superficie actual es un layout de secciones apiladas por defecto — secciones de igual peso, un botón de guardar por sección, sin capa propia, sin punto de vista. Podría ser la página de ajustes de cualquier SaaS. El gate la rechaza con veredicto `TEMPLATED` y nombra los 2 movimientos de las referencias del paso 2 que la harían singular:

- Aplicar el sidebar de dos columnas + densidad bento (referencias #1 y #2).
- Graduar el borde izquierdo teal a un fondo de sección con tinte teal (referencia #5).

Estos son **hallazgos de vitalidad P1**, preseleccionados. La ejecución no continúa sin ellos.

Hallazgos adicionales:
- Heading de sección "INFORMACIÓN DE FACTURACIÓN" en mayúsculas — parece un grito; usar capitalización de título.
- Placeholder "Introduce aquí tu nombre completo" — redundante con el label; acortar a "Ana García".
- Texto "Activado / Desactivado" junto a cada toggle — el estado del toggle ya lo comunica; eliminar.

### Paso 3c — lente: emil-design-eng + gate `review-animations` [GATE — motion de firma]

El agente `design-lens-motion` **carga el skill `emil-design-eng` con la herramienta Skill** y le pasa el target + las referencias del paso 2.

**Motion de firma (hallazgo de vitalidad P1):** la referencia #3 pide una entrada escalonada de las tres secciones de contenido en la primera carga — stagger de 100ms, `ease-out`, el contenido sube 12px y hace fade-in. Es un **momento memorable vinculado a la referencia**; solo la higiene de hover no es suficiente. Preseleccionado.

Hallazgos de higiene:
- El botón de guardar no tiene estado de carga/confirmación — 800ms de silencio tras el clic.
- Los toggles cambian de estado de forma instantánea — añadir transición de 200ms `ease`.
- Sin guard de `prefers-reduced-motion` en la entrada escalonada.

**Gate `review-animations`** (se ejecuta aquí — Block/Approve contra `STANDARDS.md`): se evalúa la entrada escalonada — duración máx. 400ms, easing `ease-out`, guard de `prefers-reduced-motion` ausente. Gate: **APPROVE** (stagger de 100ms dentro de los estándares; el guard se añadirá en el paso 5 — la ausencia ya es un hallazgo P1 de a11y). Alimenta el veredicto en el paso 6.

### Paso 3d — lente: web-design-guidelines [GATE — accesibilidad]

El agente `design-lens-a11y` **carga el skill `web-design-guidelines` con la herramienta Skill** y le pasa el target + las referencias del paso 2.

Hallazgos (cada fallo WCAG A/AA es P1):
- Contraste texto secundario 2,85:1 — falla AA (confirmado en 3a).
- Los títulos de sección son `<div>` con clase bold, no `<h2>` — estructura de headings rota; los lectores de pantalla no pueden navegar por encabezados.
- Los toggles de notificaciones son `<div>` con handlers de clic, no `<button role="switch">` — no accesibles por teclado.
- `prefers-reduced-motion` no respetado por la entrada escalonada (la lente de motion ya lo marcó — ítem fusionado, ambas etiquetas).
- Sin `aria-describedby` en los inputs — los lectores de pantalla anuncian solo el label, no el texto de ayuda.

### Paso 4 — Checklist presentado al usuario

```
¿Qué hallazgos debo corregir?  (multi-select · ítems de vitalidad preseleccionados)

P1 — Roto / identidad / vitalidad
  [x] Gate anti-plantilla FALLADO: layout de secciones apiladas por defecto — aplicar sidebar+bento+fondo teal  [design-taste-frontend]
  [x] Sin motion de firma: entrada escalonada de secciones (stagger 100ms, ease-out, slide 12px) de ref #3      [emil-design-eng]
  [x] Contraste texto secundario 2,85:1 — falla WCAG AA (#9ca3af sobre blanco)                                 [impeccable, web-design-guidelines]
  [x] Títulos de sección son <div>, no <h2> — estructura de headings rota                                       [impeccable, web-design-guidelines]
  [x] Toggles de notificaciones no accesibles por teclado (falta role="switch")                                 [web-design-guidelines]
  [x] prefers-reduced-motion no respetado por la entrada escalonada                                             [emil-design-eng, web-design-guidelines]

P2 — Mejoras
  [ ] Tres "Guardar cambios" primarios en competencia en la misma página                                        [impeccable]
  [ ] Texto de cuerpo a 13px — por debajo del umbral de lectura cómoda (objetivo: 14–16px)                     [impeccable]
  [ ] Botón de guardar necesita estado de carga/confirmación (800ms de silencio)                                [emil-design-eng]
  [ ] Toggles cambian de estado sin transición — añadir 200ms ease                                             [emil-design-eng]

P3 — Pulido
  [ ] Heading "INFORMACIÓN DE FACTURACIÓN" — usar capitalización de título                                      [design-taste-frontend]
  [ ] Placeholder "Introduce aquí tu nombre completo" — redundante; acortar                                     [design-taste-frontend]
  [ ] Texto "Activado/Desactivado" en toggles es ruido — eliminar                                              [design-taste-frontend]
```

**El usuario seleccionó:** todos los P1 + "Tres botones Guardar en competencia" (P2) + "Estado de carga del botón guardar" (P2).

### Paso 5 — Re-pasada informada

Layout modificado (re-ejecución de 3a) + motion añadido (re-ejecución de 3c) + a11y re-comprobada para la nueva estructura (re-ejecución de 3d). Guard de `prefers-reduced-motion` añadido a la entrada escalonada (corrige el hallazgo P1 de a11y; el gate `review-animations` permanece APPROVE). Nuevo hallazgo: el fondo de sección con tinte teal introduce un color sin token DS — sustituido por `surface-brand-subtle` (token existente, 6% de tinte teal).

### Paso 6 — vitality-verdict [GATE]

El agente `design-vitality-verdict` renderiza la página actualizada en vivo en claro, oscuro y móvil con `agent-browser`. Hace diff del resultado contra `.design-review/references.md`:

- Sidebar nav + densidad bento: **implantado** — patrones de referencias #1 y #2 presentes.
- Fondo de sección activa con tinte teal: **implantado** — referencia #5 aplicada con token DS.
- Entrada escalonada de secciones: **implantada** — las secciones entran con stagger de 100ms; `prefers-reduced-motion` la desactiva.
- Numerales display para estadísticas de facturación: **no aplicado aún** (no estaba en los arreglos seleccionados) — anotado, no bloqueante.
- ¿El momento de motion se dispara? **Sí** — la entrada se dispara en la primera carga, queda inerte en la segunda (caché).

Core Web Vitals: LCP 1,3s / CLS 0,02 / INP 58ms — todo verde.

Reforzado por: **taste §14 pre-flight** (comprobaciones mecánicas binarias — todas superadas: sin headings en mayúsculas, sin placeholders redundantes, el toggle se autoexplica); **`review-animations`** Block/Approve: **APPROVE** (entrada escalonada dentro de STANDARDS.md, guard de reduced-motion aplicado); **verificación Playwright de `huashu-design`**: OMITIDO (no instalado) — se usan capturas de agent-browser en su lugar.

**Veredicto escrito en `.design-review/verdict.json`:**

```
Veredicto de vitalidad:  templated → (bucle) → alive
  juzgado contra .design-review/references.md
  densidad bento + capa de identidad teal + entrada escalonada implantadas
```

### Paso 7 — Bucle de vitalidad

No necesario — el veredicto es `alive` en el primer bucle.

### Verificación de cierre

Capturas (claro/oscuro/móvil) confirmaron: sidebar nav renderizado; ritmo bento visible; entrada escalonada se dispara; texto secundario legible; estructura de headings en el árbol de accesibilidad del navegador; toggles navegables por teclado; CTA primario único al pie de la sección.

---

## Ejemplo 2 — Botón CTA principal (revisión a nivel de componente)

**Target:** `packages/design-system/src/components/Button/Button.tsx` — el componente `Button`, concretamente el estilo `variant="primary"`.

**Stack:** React, Tailwind CSS, tokens del design system, Storybook en localhost:6006.

**Visibilidad del target:** componente (no página) — add-on SEO OMITIDO. Navegador en vivo vía Storybook.

### Paso 0 — Preflight y encuadre

**Preflight** (`node scripts/preflight.mjs --write`): todos los componentes core están presentes (impeccable, design-taste-frontend, emil-design-eng, web-design-guidelines, review-animations, frontend-design, agent-browser, ui-ux-pro-max). MCP de `refero` no configurado → SKIPPED `refero` → reference-research solo vía agent-browser sobre refero.design (sin token specs de DESIGN.md). `huashu-design`: OMITIDO — verificación Playwright no disponible. No se necesita batch de `AskUserQuestion` (ninguna instalación elegida).

**Encuadre:**

```
Design system: sí (este ES el componente del design system)
Storybook: sí (localhost:6006 — Button.stories.tsx existe)
Plataforma: web
Visibilidad del target: componente / interno → add-on SEO OMITIDO
Navegador en vivo: Storybook
Tipo: rediseño de componente existente → audit-first SE EJECUTA
```

**Surface routing:** componente del DS (no es página ni landing) → régimen **estándar**. Las reglas exclusivas de landing de taste se relajan; esta es una revisión de componente, no una auditoría de densidad a nivel de página.

### Paso 1 — audit-first [GATE · solo rediseños]

El agente `design-audit-first` renderiza las stories del Button (por defecto / hover / focus / disabled) y escribe `.design-review/audit-first.md`:

**Conservar:** el color teal `#0f7e74` de marca — inconfundiblemente Plexum; el label blanco sobre teal pasa AA; el radio `rounded-md` es coherente con la familia de campos de formulario. **Atacar:** sin estado de pulsación/active visible; focus ring invisible sobre teal; sin estado de carga; transición de hover a 0ms; sin variante disabled en las stories.

### Paso 2 — reference-research [GATE · siempre · la palanca #1 contra lo plano]

El agente `design-reference-research` abre `dribbble.com/shots/popular/web-design` (2026 popular), tres botones primarios de competidores (Stripe Checkout, Linear, Vercel Deploy) con `agent-browser`, **`refero`** (galería vía agent-browser sobre refero.design — MCP OMITIDO; componentes de botón reales publicados de Stripe, Linear, Vercel listados allí), y usa el **vocabulario de `ui-ux-pro-max`** para nombrar estilos de motion y semántica de color con precisión. Extrae 4 patrones y escribe `.design-review/references.md`:

1. **[motion]** Pulsación micro-spring: `scale(0.96)` + colapso de sombra en 80ms `cubic-bezier(0.34, 1.56, 0.64, 1)` — Stripe.
2. **[motion]** Ripple de marca al clic: una onda circular teal se expande desde el punto de clic y se desvanece en 350ms — shot de Dribbble #2.
3. **[tipo/color]** El estado de carga sustituye el texto del label por un spinner + "Cargando…" que hereda el color del botón — Linear.
4. **[color]** Focus ring blanco con un gap de 2px (offset) independientemente del fondo del botón — Vercel.

**Listón para este target:** *"Los momentos de pulsación y carga del botón se sienten inconfundiblemente Plexum — el ripple teal al clic es el de firma; solo la higiene de hover no es alive."*

### Paso 2b — Plan (autoría · integra `frontend-design`)

Añadido a `.design-review/references.md`:

**Token-plan (3 hex, subordinado a los tokens de `packages/design-system` — estos tienen prioridad):**
- Relleno de marca: `#0f7e74` (teal-700 — DS `color-brand-primary`)
- Marca-oscuro (hover): `#0a5e56` (DS `color-brand-primary-dark`)
- Focus ring: `#ffffff` (blanco — universal, funciona sobre cualquier variante de color del botón)

**Roles tipográficos (2+):** label del botón (14px / medium / ligero letter-spacing para CTAs); texto de carga (visualmente oculto, SR-only vía `sr-only`).

**Elemento de firma:** ripple radial teal desde la posición del puntero al hacer clic — el único momento de motion que hace que este sea inconfundiblemente un botón Plexum y no un default de React.

**3 looks AI-por-defecto a evitar:** (1) relleno sólido + texto blanco con solo oscurecimiento en hover (default genérico shadcn); (2) variante solo-contorno como primario (peso insuficiente); (3) border-radius tan grande que se convierte en píldora en labels cortos (tendencia sin identidad de marca).

**Checklist de UX-writing:** ✓ el label del botón es un verbo ("Guardar", "Desplegar") · ✓ texto de carga anunciado por lectores de pantalla · ✓ sin tooltip necesario en disabled (la acción se explica sola).

### Paso 3a — lente: impeccable [GATE]

El agente `design-lens-impeccable` **carga el skill `impeccable` con la herramienta Skill** y le pasa el target + las referencias del paso 2.

Hallazgos:
- Contraste (primario): fondo teal `#0f7e74` con label blanco = 4,61:1 — pasa AA (por los pelos).
- Estado hover: el fondo se oscurece a `#0a5e56` — correcto, pero la transición es de 0ms (instantánea).
- Estado active/pressed: sin cambio visual más allá del estado hover — el momento de pulsación es invisible.
- Focus ring: `outline: 2px solid #0f7e74` sobre fondo teal — casi invisible (también marcado: correcto pero genérico, alimenta 3b).
- Sin variante `disabled` en las stories — estado no probado.

### Paso 3b — lente: design-taste-frontend [GATE — anti-plantilla]

El agente `design-lens-taste` **carga el skill `design-taste-frontend` con la herramienta Skill** y le pasa el target + las referencias del paso 2.

**Gate anti-plantilla: FALLADO.** El botón actual es una implementación por defecto sin modificar — `rounded-md`, `px-4 py-2`, 0ms de hover, sin momento de motion de marca, sin feedback de pulsación. Es un botón shadcn/Tailwind genérico con un hex teal. El gate lo rechaza con veredicto `TEMPLATED` y nombra el 1 movimiento que lo haría singular:

- Añadir el ripple teal al clic (referencia #2) — este es el único motion que solo podría ser un botón Plexum.

Este es un **hallazgo de vitalidad P1**, preseleccionado.

Hallazgos adicionales (sin contenido de texto fijo en un botón, las reglas de copia no aplican):
- Riesgo de coherencia: sin variantes de `size` más allá de la por defecto — los consumidores probablemente están hardcodeando sobreescrituras, alejándose del design system.

### Paso 3c — lente: emil-design-eng + gate `review-animations` [GATE — motion de firma]

El agente `design-lens-motion` **carga el skill `emil-design-eng` con la herramienta Skill** y le pasa el target + las referencias del paso 2.

**Motion de firma (hallazgo de vitalidad P1):** el ripple teal al clic (referencia #2) — un `radial-gradient` o `clip-path circle` que se expande desde la posición del puntero y se desvanece en 350ms. Este es el **momento memorable**; es lo que hace que el botón se sienta como un botón Plexum y no como un componente React genérico. Preseleccionado.

Hallazgos de higiene:
- Transición de hover a 0ms — añadir `transition-colors duration-150 ease-out`.
- Active/press: añadir micro-spring `scale(0.97)` a 80ms (`cubic-bezier(0.34, 1.56, 0.64, 1)`) — referencia #1.
- Sin estado de carga — el botón queda en silencio durante acciones asíncronas.
- Sin guard de `prefers-reduced-motion` en el ripple.

**Gate `review-animations`** (se ejecuta aquí — Block/Approve contra `STANDARDS.md`): se evalúa el ripple teal — fade de 350ms, easing aceptable, pero guard de `prefers-reduced-motion` ausente. Gate: **BLOCK** (guard de reduced-motion ausente). Debe añadirse el guard antes de que el veredicto pueda alcanzar `alive`. Alimenta el veredicto en el paso 6.

### Paso 3d — lente: web-design-guidelines [GATE — accesibilidad]

El agente `design-lens-a11y` **carga el skill `web-design-guidelines` con la herramienta Skill** y le pasa el target + las referencias del paso 2.

Hallazgos (cada fallo WCAG A/AA es P1):
- Focus ring casi invisible sobre fondo teal — cambiar a `outline: 2px solid white; outline-offset: 2px` (referencia #4). P1.
- Variante `disabled` ausente — los consumidores no pueden renderizar un botón primario desactivado correctamente; necesita `aria-disabled` + estado visual atenuado.
- El estado de carga (al añadirlo) debe anunciarse a los lectores de pantalla: `aria-busy="true"` + texto visualmente oculto "Cargando…".
- La animación del ripple debe respetar `prefers-reduced-motion` — colapsar a un fade de opacidad instantáneo si está activo (la lente de motion ya lo marcó; ítem fusionado).

### Paso 4 — Checklist presentado al usuario

```
¿Qué hallazgos debo corregir?  (multi-select · ítems de vitalidad preseleccionados)

P1 — Roto / identidad / vitalidad
  [x] Gate anti-plantilla FALLADO: botón genérico por defecto — añadir ripple teal al clic (ref #2)           [design-taste-frontend]
  [x] Sin motion de firma: ripple radial teal desde el punto de clic, fade de 350ms (referencia #2)           [emil-design-eng]
  [x] Focus ring casi invisible sobre fondo teal — outline: 2px solid white; outline-offset: 2px (ref #4)     [impeccable, web-design-guidelines]
  [x] Sin variante disabled — los consumidores no pueden renderizar un botón primario desactivado              [impeccable, web-design-guidelines]
  [x] prefers-reduced-motion no respetado por el ripple                                                        [emil-design-eng, web-design-guidelines]

P2 — Mejoras
  [ ] Transición de hover a 0ms — añadir duration-150 ease-out                                                [emil-design-eng]
  [ ] Sin estado active/pressed — añadir scale(0.97) micro-spring a 80ms (referencia #1)                      [impeccable, emil-design-eng]
  [ ] Sin estado de carga — el botón queda en silencio durante acciones asíncronas (referencia #3)             [emil-design-eng]
  [ ] Sin variantes de size — consumidores hardcodeando sobreescrituras; añadir sm/md/lg                       [design-taste-frontend]

P3 — Pulido
  [ ] Border-radius: rounded-md → rounded-lg para un CTA primario ligeramente más suave                        [impeccable]
```

**El usuario seleccionó:** todos los P1 + transición de hover (P2) + estado de pulsación (P2) + estado de carga (P2).

### Paso 5 — Re-pasada informada

Motion añadido (re-ejecución de 3c) + a11y re-comprobada para el ripple + estado de carga (re-ejecución de 3d). Guard de `prefers-reduced-motion` añadido al ripple (colapsa a fade de opacidad instantáneo) — gate `review-animations` liberado (BLOCK → APPROVE). Nuevo hallazgo: el SVG del spinner de carga usa `stroke="#ffffff"` hardcodeado — sustituido por `currentColor` para que herede el color del label, lo que en una futura `variant="secondary"` funcionará correctamente de forma automática.

### Paso 6 — vitality-verdict [GATE]

El agente `design-vitality-verdict` renderiza las stories del Button en vivo con `agent-browser` — todos los estados: por defecto / hover / active / focused / disabled / cargando — en modo claro y oscuro.

Diff contra `.design-review/references.md`:
- Ripple teal al clic: **implantado** — se dispara desde la posición del puntero, fade de 350ms, `prefers-reduced-motion` lo colapsa a opacidad instantánea.
- Pulsación micro-spring: **implantada** — `scale(0.97)` con easing spring a 80ms.
- Focus ring blanco con offset: **implantado** — referencia #4 aplicada; visible sobre teal y sobre cualquier futura variante de color.
- Estado de carga: **implantado** — spinner + texto visualmente oculto "Cargando" + `aria-busy`.
- Variante disabled: **implantada** — fondo atenuado, `cursor-not-allowed`, `aria-disabled="true"`, story añadida.

Core Web Vitals: N/A — componente, no página. Tiempo de render en Storybook: 110ms.

Reforzado por: **taste §14 pre-flight** (comprobaciones mecánicas binarias — superadas: el label es un verbo, sin copia redundante); **`review-animations`** Block/Approve: **APPROVE** (guard de reduced-motion aplicado en el paso 5; el ripple colapsa a fade de opacidad instantáneo — dentro de STANDARDS.md); **verificación Playwright de `huashu-design`**: OMITIDO (no instalado) — se usan renders de stories de Storybook en su lugar.

**Veredicto escrito en `.design-review/verdict.json`:**

```
Veredicto de vitalidad:  templated → (bucle) → alive
  juzgado contra .design-review/references.md
  ripple teal (momento de firma) + focus ring blanco + estado de carga implantados
```

### Paso 7 — Bucle de vitalidad

No necesario — el veredicto es `alive` en el primer bucle.

### Verificación de cierre (Storybook)

Capturas de: por defecto / hover / active / focused / disabled / cargando — en modo claro y oscuro. Todos los estados se renderizan correctamente. Navegación por teclado confirmada: Tab para enfocar → anillo blanco visible → Enter activa la acción → estado de carga visible → `aria-busy` anunciado.

---

## Resumen

| # | Target | Tipo | Pasos omitidos | Veredicto |
|---|--------|------|----------------|-----------|
| 1 | Página de ajustes | Página autenticada | SEO | `templated` → `alive` (1 bucle) |
| 2 | Componente Button primario | Componente DS | SEO | `templated` → `alive` (1 bucle) |

→ Volver a [design-review](../README.es.md)
