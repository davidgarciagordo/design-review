[English](README.md) | **Español**

# design-review — Ejemplos de uso

> Ejemplos trabajados de forma concreta que muestran el pipeline con gates en acción: preflight, investigación de referencias, context-pack (discover-once), las 4 lentes core cargadas en modo READ-ONLY con la herramienta Skill, el gate anti-plantilla fallando y recuperándose, y un veredicto de vitalidad explícito.

Estos son ejemplos realistas, no sintéticos. Cada uno muestra el target, qué pasos se ejecutaron (y cuáles se omitieron), qué encontró cada lente (terse), el checklist presentado, qué se aplicó y el veredicto de vitalidad final juzgado contra las referencias en vivo.

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

**Memory adapter:** ninguno detectado — usando `.design-review/*.md` como memoria de sesión; sin caché entre ejecuciones.

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

El agente `design-reference-research` abre `dribbble.com/shots/popular/web-design` (2026 popular), tres páginas de ajustes de competidores (Linear, dashboard Vercel, ajustes Notion) con `agent-browser`, **`refero`** (galería vía agent-browser sobre refero.design — MCP OMITIDO; productos reales publicados: Mercury, Vercel, Linear), y usa el **vocabulario de `ui-ux-pro-max`** para nombrar estilos/paletas/combinaciones tipográficas con precisión. Extrae 5 patrones concretos → escribe `.design-review/references.md`:

1. **[layout]** Dos columnas: nav lateral fijo + panel de contenido — Linear. Elimina los headings de sección repetitivos.
2. **[densidad]** Bento asimétrico dentro de cada sección — filas de datos más compactas, headings más aireados — dashboard Vercel.
3. **[motion]** Entrada escalonada de secciones en la primera carga (100ms de stagger por sección) — shot de Dribbble #1.
4. **[tipo]** Numerales display para las estadísticas de uso de facturación (% de plan usado, seats usados) — facturación de Notion.
5. **[color]** El borde izquierdo teal en el ítem de nav activo se gradúa a un fondo de sección con tinte teal — exclusivo de este producto.

**Listón:** *"La página se lee como una superficie de ajustes de producto Plexum, no como una plantilla shadcn genérica — densidad bento, secciones escalonadas y el marcador de identidad teal aterrizan."*

### Paso 2b — Plan (autoría · integra `frontend-design`)

Añadido a `.design-review/references.md`:

**Token-plan (4 hex, subordinado a los tokens de `packages/design-system` — estos tienen prioridad):**
- Relleno acento: `#0f7e74` (teal-700 — DS `color-brand-primary`)
- Superficie brand-subtle: `#f0faf9` (6% de tinte teal — DS `surface-brand-subtle`)
- Texto énfasis: `#111827` (DS `text-primary`)
- Separador/atenuado: `#e5e7eb` (DS `border-subtle`)

**Roles tipográficos (2+):** numerales display para estadísticas de facturación (`font-variant-numeric: tabular-nums`); cuerpo legible (14px / 1.5 — corrige el hallazgo de 3a).

**Elemento de firma:** fondo de sección activa con tinte teal que se gradúa desde el marcador de borde izquierdo del nav.

**3 looks AI-por-defecto a evitar:** (1) rejilla uniforme de tarjetas con sombra/radio idéntico; (2) formulario centrado de ancho completo con exceso de espacio en blanco; (3) paleta gris atenuada + acento azul.

**Checklist de UX-writing:** ✓ sin placeholder redundante · ✓ el toggle se autoexplica · ✓ CTA único por vista · ✓ headings de sección en capitalización de oración.

### Paso 2c — Context-pack [discover ONCE · palanca de tokens]

El agente `design-context-pack` construye `.design-review/context-pack.md` en un solo pase: árbol de componentes, props, tokens en uso, anclas **fichero:línea** para cada punto de interés, capturas de referencia del audit-first, guías de accesibilidad cacheadas y la lista de ataque del audit-first como hallazgos pre-conocidos compartidos. Todas las lentes siguientes reciben este pack — juzgan un mapa preparado, no el código fuente en bruto. Ninguna lente vuelve a leer el código ni re-deriva lo que una lente anterior ya encontró.

### Paso 3 — DIAGNOSIS — CORE skills, ENRUTADAS, en orden [GATE]

Cada lente recibe `.design-review/context-pack.md` + `references.md`. **READ-ONLY** — sin ediciones durante el diagnóstico; toda mutación ocurre en el paso 5, en un único pase de aplicación, tras la multi-selección del usuario. Output TERSE: línea 1 `OK`/`KO` + motivo ≤8 palabras; luego un hallazgo por línea `P# [skill] fichero:línea — problema → solución`.

### Paso 3a — lente: impeccable [GATE]

El agente `design-lens-impeccable` **carga el skill `impeccable` con la herramienta Skill**, enrutado a `audit` + `critique`. READ-ONLY.

```
KO — auditoría puntuada: tipografía 6/10, contraste 4/10, espaciado 5/10
P1 [impeccable] settings/page.tsx:156 — texto secundario #9ca3af = 2,85:1 → subir a #6b7280 (4,5:1)
P2 [impeccable] settings/page.tsx:24 — cuerpo 13px → 14–16px
P2 [impeccable] settings/page.tsx:67 — secciones con 24px padding uniforme, 8px entre ellas → ritmo bento
P2 [impeccable] settings/page.tsx:89 — 3 primarios "Guardar" idénticos en la misma vista (también alimenta 3b)
P3 [impeccable] settings/page.tsx:12 — una columna adecuado; sin overflow en anchos probados
```

### Paso 3b — lente: design-taste-frontend [GATE — anti-plantilla]

El agente `design-lens-taste` **carga el skill `design-taste-frontend` con la herramienta Skill**, enrutado a §11 redesign-audit + §14. READ-ONLY.

```
KO — gate anti-plantilla FALLADO
P1 [design-taste-frontend] settings/page.tsx:1 — secciones apiladas, sin capa propia → sidebar+bento+fondo teal (refs #1 #2 #5) [VITALIDAD · preseleccionado]
P3 [design-taste-frontend] settings/page.tsx:42 — "INFORMACIÓN DE FACTURACIÓN" en mayúsculas → capitalización de título
P3 [design-taste-frontend] settings/page.tsx:78 — placeholder "Introduce aquí tu nombre completo" → "Ana García"
P3 [design-taste-frontend] settings/page.tsx:94 — etiqueta "Activado/Desactivado" en toggles → eliminar (estado se autoexplica)
```

El gate nombra los 2 movimientos estructurales del paso 2 que lo harían singular: sidebar+bento (refs #1 #2) + fondo teal (ref #5). Hallazgos de vitalidad P1 preseleccionados. La ejecución no continúa sin ellos.

### Paso 3c — lente: emil-design-eng + gate `review-animations` [GATE — motion de firma]

El agente `design-lens-motion` **carga el skill `emil-design-eng` con la herramienta Skill** con la pregunta concreta inline. READ-ONLY.

```
KO — sin momento de motion de firma
P1 [emil-design-eng] settings/page.tsx:1 — sin entrada escalonada → stagger 100ms, ease-out, slide-up 12px (ref #3) [VITALIDAD · preseleccionado]
P2 [emil-design-eng] settings/page.tsx:89 — botón guardar sin estado de carga/confirmación → 800ms de silencio
P2 [emil-design-eng] settings/page.tsx:94 — toggles cambian de estado al instante → transición 200ms ease
P1 [emil-design-eng, web-design-guidelines] settings/page.tsx:1 — sin guard de prefers-reduced-motion en entrada → añadir
```

**Gate `review-animations`:** entrada escalonada dentro de STANDARDS.md (100ms, ease-out, ≤400ms); guard ausente → hallazgo P1 de a11y (se añadirá en el paso 5). Gate: **APPROVE** (provisional). Alimenta el veredicto en el paso 6.

### Paso 3d — lente: web-design-guidelines [GATE — accesibilidad · última lente]

El agente `design-lens-a11y` WebFetch guías → caché → **carga el skill `web-design-guidelines` con la herramienta Skill** (AA). READ-ONLY.

```
KO — 4 fallos WCAG A/AA
P1 [web-design-guidelines] settings/page.tsx:156 — #9ca3af sobre blanco 2,85:1 → fallo AA confirmado (fusionado con 3a)
P1 [web-design-guidelines] settings/page.tsx:31 — títulos de sección <div class=bold> → <h2> (estructura de headings rota)
P1 [web-design-guidelines] settings/page.tsx:94 — toggles <div onClick> → <button role="switch"> (no accesible por teclado)
P1 [emil-design-eng, web-design-guidelines] settings/page.tsx:1 — prefers-reduced-motion no respetado (fusionado con 3c)
P2 [web-design-guidelines] settings/page.tsx:78 — inputs sin aria-describedby → añadir para texto de ayuda
```

### Paso 3e — guías UX de `ui-ux-pro-max` (lente extra wired)

```
OK — sin bloqueadores UX más allá de los ya encontrados
P2 [ui-ux-pro-max] settings/page.tsx:89 — sin feedback de confirmación tras guardar → cubierto por hallazgo de estado de carga en 3c
```

### Paso 4 — Checklist presentado al usuario

```
¿Qué hallazgos debo corregir?  (multi-select · ítems de vitalidad preseleccionados)

P1 — Roto / identidad / vitalidad
  [x] Gate anti-plantilla FALLADO: layout de secciones apiladas — aplicar sidebar+bento+fondo teal  [design-taste-frontend]
  [x] Sin motion de firma: entrada escalonada (stagger 100ms, ease-out, slide 12px) de ref #3       [emil-design-eng]
  [x] Contraste texto secundario 2,85:1 — falla WCAG AA (#9ca3af sobre blanco)                     [impeccable, web-design-guidelines]
  [x] Títulos de sección son <div>, no <h2> — estructura de headings rota                           [impeccable, web-design-guidelines]
  [x] Toggles de notificaciones no accesibles por teclado (falta role="switch")                     [web-design-guidelines]
  [x] prefers-reduced-motion no respetado por la entrada escalonada                                 [emil-design-eng, web-design-guidelines]

P2 — Mejoras
  [ ] Tres "Guardar cambios" primarios en competencia en la misma página                            [impeccable]
  [ ] Texto de cuerpo a 13px — por debajo del umbral de lectura cómoda (objetivo: 14–16px)          [impeccable]
  [ ] Botón de guardar necesita estado de carga/confirmación (800ms de silencio)                    [emil-design-eng]
  [ ] Toggles cambian de estado sin transición — añadir 200ms ease                                  [emil-design-eng]

P3 — Pulido
  [ ] Heading "INFORMACIÓN DE FACTURACIÓN" — usar capitalización de título                          [design-taste-frontend]
  [ ] Placeholder "Introduce aquí tu nombre completo" — redundante; acortar                         [design-taste-frontend]
  [ ] Texto "Activado/Desactivado" en toggles es ruido — eliminar                                   [design-taste-frontend]
```

**El usuario seleccionó:** todos los P1 + "Tres botones Guardar en competencia" (P2) + "Estado de carga del botón guardar" (P2).

### Paso 5 — Re-pasada informada

Layout modificado (re-ejecución de 3a) + motion añadido (re-ejecución de 3c) + a11y re-comprobada para la nueva estructura (re-ejecución de 3d). Guard de `prefers-reduced-motion` añadido a la entrada escalonada (corrige el hallazgo P1 de a11y; el gate `review-animations` permanece APPROVE). Nuevo hallazgo: el fondo de sección con tinte teal no referencia ningún token DS → sustituido por `surface-brand-subtle` (token existente, 6% de tinte teal).

### Paso 6 — vitality-verdict [GATE]

El agente `design-vitality-verdict` renderiza la página actualizada en vivo en claro, oscuro y móvil con `agent-browser`. Hace diff del resultado contra `.design-review/references.md`:

- Sidebar nav + densidad bento: **implantado** — patrones de referencias #1 #2 presentes.
- Fondo de sección activa con tinte teal: **implantado** — ref #5 aplicada con token DS.
- Entrada escalonada de secciones: **implantada** — `prefers-reduced-motion` la desactiva.
- Numerales display para estadísticas de facturación: no aplicado aún (no seleccionado) — anotado, no bloqueante.
- ¿El momento de motion se dispara? **Sí** — en la primera carga, inerte en la segunda (caché).

Core Web Vitals: LCP 1,3s / CLS 0,02 / INP 58ms — todo verde.

Reforzado por: **taste §14 pre-flight** (todas superadas: sin headings en mayúsculas, sin placeholders redundantes, el toggle se autoexplica); **`review-animations`** APPROVE (guard aplicado); **verificación Playwright de `huashu-design`** OMITIDO — se usan capturas de agent-browser.

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

**Memory adapter:** ninguno detectado — usando `.design-review/*.md` como memoria de sesión; sin caché entre ejecuciones.

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

El agente `design-reference-research` abre `dribbble.com/shots/popular/web-design` (2026 popular), tres botones primarios de competidores (Stripe Checkout, Linear, Vercel Deploy) con `agent-browser`, **`refero`** (galería vía agent-browser sobre refero.design — MCP OMITIDO; componentes reales publicados de Stripe, Linear, Vercel), y usa el **vocabulario de `ui-ux-pro-max`** para nombrar estilos de motion y semántica de color con precisión. Extrae 4 patrones → escribe `.design-review/references.md`:

1. **[motion]** Pulsación micro-spring: `scale(0.96)` + colapso de sombra en 80ms `cubic-bezier(0.34, 1.56, 0.64, 1)` — Stripe.
2. **[motion]** Ripple de marca al clic: una onda circular teal se expande desde el punto de clic y se desvanece en 350ms — shot de Dribbble #2.
3. **[tipo/color]** El estado de carga sustituye el texto del label por un spinner + "Cargando…" que hereda el color del botón — Linear.
4. **[color]** Focus ring blanco con un gap de 2px (offset) independientemente del fondo del botón — Vercel.

**Listón:** *"Los momentos de pulsación y carga del botón se sienten inconfundiblemente Plexum — el ripple teal al clic es el de firma; solo la higiene de hover no es alive."*

### Paso 2b — Plan (autoría · integra `frontend-design`)

Añadido a `.design-review/references.md`:

**Token-plan (3 hex, subordinado a los tokens de `packages/design-system` — estos tienen prioridad):**
- Relleno de marca: `#0f7e74` (DS `color-brand-primary`)
- Marca-oscuro (hover): `#0a5e56` (DS `color-brand-primary-dark`)
- Focus ring: `#ffffff` (universal sobre cualquier variante de color del botón)

**Roles tipográficos (2+):** label del botón (14px / medium / ligero letter-spacing para CTAs); texto de carga (SR-only vía `sr-only`).

**Elemento de firma:** ripple radial teal desde la posición del puntero al hacer clic.

**3 looks AI-por-defecto a evitar:** (1) relleno sólido + texto blanco con solo oscurecimiento en hover; (2) variante solo-contorno como primario; (3) border-radius tan grande que se convierte en píldora en labels cortos.

**Checklist de UX-writing:** ✓ el label del botón es un verbo · ✓ texto de carga anunciado por SR · ✓ sin tooltip necesario en disabled.

### Paso 2c — Context-pack [discover ONCE · palanca de tokens]

El agente `design-context-pack` construye `.design-review/context-pack.md` en un solo pase: árbol de componentes, interfaz de props, tokens en uso, anclas **fichero:línea** para cada variante y estado, nombres de stories de Storybook y la lista de ataque del audit-first como hallazgos pre-conocidos compartidos. Todas las lentes siguientes reciben este pack.

### Paso 3 — DIAGNOSIS — CORE skills, ENRUTADAS, en orden [GATE]

Cada lente recibe `.design-review/context-pack.md` + `references.md`. **READ-ONLY** — sin ediciones durante el diagnóstico; toda mutación ocurre en el paso 5, en un único pase de aplicación, tras la multi-selección del usuario. Output TERSE.

### Paso 3a — lente: impeccable [GATE]

El agente `design-lens-impeccable` **carga el skill `impeccable` con la herramienta Skill**, enrutado a `audit` + `critique`. READ-ONLY.

```
KO — problemas de contraste/estado
P2 [impeccable] Button.tsx:23 — contraste 4,61:1, pasa AA (por los pelos); transición hover 0ms
P1 [impeccable] Button.tsx:31 — sin estado active/pressed → el momento de pulsación es invisible
P1 [impeccable] Button.tsx:41 — focus ring #0f7e74 sobre teal → casi invisible (también alimenta 3b)
P2 [impeccable] Button.tsx:1 — sin variante disabled en stories → estado no probado
```

### Paso 3b — lente: design-taste-frontend [GATE — anti-plantilla]

El agente `design-lens-taste` **carga el skill `design-taste-frontend` con la herramienta Skill**, enrutado a §11 redesign-audit + §14. READ-ONLY.

```
KO — gate anti-plantilla FALLADO
P1 [design-taste-frontend] Button.tsx:1 — shadcn/Tailwind genérico con hex teal, sin motion de marca → añadir ripple teal (ref #2) [VITALIDAD · preseleccionado]
P2 [design-taste-frontend] Button.tsx:1 — sin variantes de size → consumidores hardcodeando sobreescrituras, alejándose del DS
```

El gate nombra el 1 movimiento del paso 2 que lo haría singular: ripple teal al clic (ref #2). Hallazgo de vitalidad P1 preseleccionado.

### Paso 3c — lente: emil-design-eng + gate `review-animations` [GATE — motion de firma]

El agente `design-lens-motion` **carga el skill `emil-design-eng` con la herramienta Skill** con la pregunta concreta inline. READ-ONLY.

```
KO — sin motion de firma, lagunas de higiene
P1 [emil-design-eng] Button.tsx:1 — sin ripple al clic → ripple radial teal desde el puntero, fade 350ms (ref #2) [VITALIDAD · preseleccionado]
P2 [emil-design-eng] Button.tsx:23 — transición hover 0ms → transition-colors duration-150 ease-out
P2 [emil-design-eng] Button.tsx:31 — sin micro-spring press → scale(0.97) 80ms cubic-bezier(0.34,1.56,0.64,1) (ref #1)
P2 [emil-design-eng] Button.tsx:1 — sin estado de carga → botón en silencio durante acciones asíncronas (ref #3)
P1 [emil-design-eng, web-design-guidelines] Button.tsx:1 — sin guard de prefers-reduced-motion en ripple → añadir
```

**Gate `review-animations`:** ripple fade 350ms, easing aceptable, guard de `prefers-reduced-motion` ausente. Gate: **BLOCK** — el guard debe añadirse antes de que el veredicto pueda alcanzar `alive`. Alimenta el veredicto en el paso 6.

### Paso 3d — lente: web-design-guidelines [GATE — accesibilidad · última lente]

El agente `design-lens-a11y` WebFetch guías → caché → **carga el skill `web-design-guidelines` con la herramienta Skill** (AA). READ-ONLY.

```
KO — 2 fallos WCAG A/AA
P1 [web-design-guidelines] Button.tsx:41 — focus ring casi invisible sobre teal → outline: 2px solid white; outline-offset: 2px (ref #4)
P2 [web-design-guidelines] Button.tsx:1 — sin variante disabled → necesita aria-disabled + estado visual atenuado
P2 [web-design-guidelines] Button.tsx:1 — estado de carga (futuro) → aria-busy="true" + texto SR-only "Cargando…"
P1 [emil-design-eng, web-design-guidelines] Button.tsx:1 — guard de prefers-reduced-motion ausente (fusionado con 3c)
```

### Paso 3e — guías UX de `ui-ux-pro-max` (lente extra wired)

```
OK — sin bloqueadores UX más allá de los ya encontrados
```

### Paso 4 — Checklist presentado al usuario

```
¿Qué hallazgos debo corregir?  (multi-select · ítems de vitalidad preseleccionados)

P1 — Roto / identidad / vitalidad
  [x] Gate anti-plantilla FALLADO: botón genérico sin motion de marca → añadir ripple teal (ref #2)  [design-taste-frontend]
  [x] Sin motion de firma: ripple radial teal desde el punto de clic, fade 350ms (ref #2)            [emil-design-eng]
  [x] Sin estado active/pressed — el momento de pulsación es invisible                               [impeccable]
  [x] Focus ring casi invisible sobre teal → outline: 2px solid white; outline-offset: 2px (ref #4) [impeccable, web-design-guidelines]
  [x] prefers-reduced-motion no respetado por el ripple                                              [emil-design-eng, web-design-guidelines]

P2 — Mejoras
  [ ] Transición de hover a 0ms — añadir duration-150 ease-out                                      [emil-design-eng]
  [ ] Sin estado micro-spring press — añadir scale(0.97) a 80ms (ref #1)                            [impeccable, emil-design-eng]
  [ ] Sin estado de carga — botón en silencio durante acciones asíncronas (ref #3)                   [emil-design-eng]
  [ ] Sin variante disabled — consumidores no pueden renderizar un botón desactivado correctamente   [impeccable, web-design-guidelines]
  [ ] Sin variantes de size — consumidores hardcodeando sobreescrituras; añadir sm/md/lg             [design-taste-frontend]

P3 — Pulido
  [ ] Border-radius: rounded-md → rounded-lg para un CTA primario ligeramente más suave             [impeccable]
```

**El usuario seleccionó:** todos los P1 + transición de hover (P2) + estado de pulsación (P2) + estado de carga (P2).

### Paso 5 — Re-pasada informada

Motion añadido (re-ejecución de 3c) + a11y re-comprobada para el ripple + estado de carga (re-ejecución de 3d). Guard de `prefers-reduced-motion` añadido al ripple (colapsa a fade de opacidad instantáneo) — gate `review-animations` liberado (BLOCK → APPROVE). Nuevo hallazgo: el SVG del spinner de carga usa `stroke="#ffffff"` hardcodeado → sustituido por `currentColor` para que herede el color del label correctamente en futuras variantes.

### Paso 6 — vitality-verdict [GATE]

El agente `design-vitality-verdict` renderiza las stories del Button en vivo con `agent-browser` — todos los estados: por defecto / hover / active / focused / disabled / cargando — en modo claro y oscuro.

Diff contra `.design-review/references.md`:
- Ripple teal al clic: **implantado** — se dispara desde la posición del puntero, fade 350ms, `prefers-reduced-motion` lo colapsa a opacidad instantánea.
- Pulsación micro-spring: **implantada** — `scale(0.97)` con easing spring a 80ms.
- Focus ring blanco con offset: **implantado** — visible sobre teal y sobre cualquier futura variante de color (ref #4).
- Estado de carga: **implantado** — spinner + texto SR-only "Cargando" + `aria-busy`.
- Variante disabled: **diferido** (no seleccionado) — anotado, no bloqueante.

Tiempo de render en Storybook: 110ms.

Reforzado por: **taste §14 pre-flight** (superado: el label es un verbo, sin copia redundante); **`review-animations`** APPROVE (guard de reduced-motion aplicado; el ripple colapsa a opacidad instantánea — dentro de STANDARDS.md); **verificación Playwright de `huashu-design`** OMITIDO — se usan renders de stories de Storybook.

**Veredicto escrito en `.design-review/verdict.json`:**

```
Veredicto de vitalidad:  templated → (bucle) → alive
  juzgado contra .design-review/references.md
  ripple teal (momento de firma) + focus ring blanco + estado de carga implantados
```

### Paso 7 — Bucle de vitalidad

No necesario — el veredicto es `alive` en el primer bucle.

### Verificación de cierre (Storybook)

Capturas: por defecto / hover / active / focused / disabled / cargando — en modo claro y oscuro. Todos los estados se renderizan correctamente. Teclado: Tab → anillo blanco visible → Enter → estado de carga visible → `aria-busy` anunciado.

---

## Resumen

| # | Target | Tipo | Pasos omitidos | Veredicto |
|---|--------|------|----------------|-----------|
| 1 | Página de ajustes | Página autenticada | SEO, huashu-design, refero (MCP) | `templated` → `alive` (1 bucle) |
| 2 | Componente Button primario | Componente DS | SEO, huashu-design, refero (MCP) | `templated` → `alive` (1 bucle) |

→ Volver a [design-review](../README.es.md)
