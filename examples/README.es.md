[English](README.md) | **Español**

# design-review — Ejemplos de uso

> Ejemplos trabajados de forma concreta que muestran qué encuentra el pipeline, cómo queda el checklist y qué se aplica.

Estos son ejemplos realistas, no sintéticos. Cada uno muestra el target, qué pasos se ejecutaron (y cuáles se omitieron), los hallazgos que cada skill encontró, el checklist que vio el usuario y qué se aplicó.

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

## Un prompt para todas, o una skill por separado

`/design-review` es el **un prompt para todas** — ejecuta cada skill aplicable en orden y fusiona los hallazgos en un solo checklist. Pero cada skill orquestada es independiente y puedes invocarla sola cuando solo quieres esa lente:

| Si solo quieres… | Invoca por separado |
|---|---|
| Estructura / jerarquía / IA | `impeccable` (auditoría puntuada) o `ui-ux-pro-max` |
| Anti-slop / pasada de gusto | `taste-skill` · `huashu-design` |
| Pulido de motion e interacción | `emil-design-eng` (+ `review-animations` para criticarlo) |
| Accesibilidad (WCAG AA) | `web-design-guidelines` + `web-accessibility` |
| SEO (páginas públicas) | `seo` |

```
# una skill por separado
Ejecuta impeccable en apps/web/app/settings/page.tsx — solo auditoría puntuada, sin más pasos.

# todo, orquestado, un solo checklist
/design-review apps/web/app/settings/page.tsx
```

Cada skill es de su autor original (ver *Attribution* en el README principal) e instala desde su propia fuente — el pipeline solo las secuencia. ¿Falta alguna? El preflight (Step 0.5) ofrece instalarla (tú eliges).

---

## Ejemplo 1 — Página de ajustes (aplicación web autenticada)

**Target:** `apps/web/app/settings/page.tsx` — página de ajustes con múltiples secciones (perfil, notificaciones, facturación) en una aplicación Next.js autenticada.

**Stack:** Next.js App Router, Tailwind CSS con tokens del design system, Storybook disponible, dev server en marcha.

### Paso 0 — Detección de capacidades

```
Design system: sí (packages/design-system — tokens en design-system/tokens.ts)
Storybook: sí (localhost:6006)
Plataforma: web
Visibilidad del target: privado/autenticado → paso SEO OMITIDO
Navegador en vivo: sí (dev server en localhost:3000)
```

### Qué encontró cada skill

**Paso 1 — Estructura base (`ui-ux-pro-max`)**
- Las tres secciones (Perfil / Notificaciones / Facturación) tienen el mismo peso visual; nada guía al usuario hacia la sección más usada.
- El botón "Guardar cambios" aparece al final de cada sección de forma independiente — tres botones primarios idénticos compiten en la misma vista.
- El título de página "Ajustes" es un `<h1>` pero los títulos de sección son `<div>` con clase bold, no `<h2>` — la estructura de headings está rota.

**Paso 2 — Auditoría puntuada (`impeccable`)**
- Puntuación tipografía: 6/10. Texto de cuerpo a 13px sobre fondo blanco — por debajo del umbral de lectura cómoda.
- Puntuación espaciado: 5/10. Las secciones usan 24px de padding internamente pero solo 8px de separación entre secciones — ritmo comprimido.
- Puntuación contraste: 4/10. Texto secundario (#9ca3af sobre blanco) = 2,85:1 — falla WCAG AA para texto normal.
- Puntuación CTA: 7/10. El botón de guardar es correcto en aislamiento; el problema es la multiplicidad (tres primarios).
- Puntuación layout: 7/10. Layout de una columna adecuado; sin overflow en los anchos probados.

**Paso 3 — Segunda lente anti-slop (`huashu-design`)**
- La sección de Notificaciones tiene 11 toggles sin agrupación — alta carga cognitiva, sin separación visual entre categorías "Email" y "Push".
- La sección de Facturación muestra el nombre del plan pero sin fecha de renovación, barra de uso ni ruta de upgrade — arquitectura de información incompleta para una superficie de facturación.
- Los labels de los formularios están encima de los inputs pero con una separación de 4px — los labels parecen desconectados de los inputs visualmente.

**Paso 4 — Gusto / anti-slop transversal (`taste-skill`)**
- El heading de sección "INFORMACIÓN DE FACTURACIÓN" está en mayúsculas — parece un grito; usar capitalización de título.
- El placeholder del input "Nombre completo" es "Introduce aquí tu nombre completo" — redundante con el label; eliminar o acortar a "Ana García".
- Los toggles muestran texto "Activado" / "Desactivado" junto a cada toggle — el estado del toggle ya comunica esto; el texto es ruido.

**Paso 5 — Movimiento y pulido (`emil-design-eng` + `review-animations`)**
- El botón de guardar no tiene estado de carga/confirmación — tras hacer clic, nada confirma que la acción se recibió durante ~800ms (ida y vuelta de la API).
- Los toggles no tienen transición (cambio instantáneo entre estados encendido/apagado).
- `review-animations`: sin jank detectado (no hay animaciones existentes), pero la ausencia de feedback en la acción de guardar es un hueco de movimiento.

**Paso 6 — Accesibilidad (`web-design-guidelines` + `web-accessibility`)**
- El texto secundario falla el contraste AA (2,85:1 — confirmado en paso 2).
- Los títulos de sección no son headings — los lectores de pantalla no pueden navegar por encabezados.
- Los toggles de notificaciones son elementos `<div>` con handlers de clic, no `<input type="checkbox">` ni `role="switch"` — no son accesibles por teclado.
- Sin `aria-describedby` en ningún input — los lectores de pantalla anuncian solo el label, no el texto de ayuda.

### Checklist presentado al usuario

```
¿Qué hallazgos debo corregir?  (multi-select)

P1 — Roto / identidad / accesibilidad
  [x] Contraste texto secundario 2,85:1 — falla WCAG AA (#9ca3af sobre blanco)    [impeccable, web-accessibility]
  [x] Títulos de sección son <div>, no <h2> — estructura de headings rota          [ui-ux-pro-max, web-accessibility]
  [x] Toggles de notificaciones no son accesibles por teclado (falta role="switch") [web-accessibility]

P2 — Mejoras
  [ ] Tres botones "Guardar cambios" primarios en la misma página                  [ui-ux-pro-max, impeccable]
  [ ] Toggles de notificaciones necesitan agrupación (Email vs Push) — 11 sin ordenar [huashu-design]
  [ ] Texto de cuerpo a 13px — por debajo del umbral de lectura cómoda (objetivo: 14–16px) [impeccable]
  [ ] Botón de guardar necesita estado de carga/confirmación (800ms de silencio)   [emil-design-eng]
  [ ] Separación label-input de 4px — aumentar a 8px para conexión visual          [huashu-design]

P3 — Pulido
  [ ] Heading "INFORMACIÓN DE FACTURACIÓN" — usar capitalización de título          [taste-skill]
  [ ] Placeholder "Introduce aquí tu nombre completo" — redundante; acortar        [taste-skill]
  [ ] Texto "Activado/Desactivado" en toggles es ruido — eliminar                  [taste-skill]
  [ ] Añadir transición de 200ms ease a los toggles                                [emil-design-eng, review-animations]
```

**El usuario seleccionó:** todos los P1 + "Tres botones Guardar competidores" (P2) + "Estado de carga del botón guardar" (P2).

### Qué se aplicó

1. Color del texto secundario cambiado a `#6b7280` (contraste 4,63:1 — pasa AA).
2. Títulos de sección convertidos de `<div className="font-bold">` a `<h2>` con token de heading del design system.
3. Toggles de notificaciones refactorizados a `<button role="switch" aria-checked={...}>` con handler de teclado.
4. Página restructurada con un único botón "Guardar todos los cambios" al pie (un solo CTA primario).
5. Botón de guardar con estado de carga (`isLoading` → spinner + "Guardando…" → confirmación "Guardado" durante 2s).

### Verificación de cierre

Capturas (claro/oscuro/móvil) confirmaron:
- Texto secundario legible en ambos temas.
- Estructura de headings visible en el árbol de accesibilidad del navegador.
- Toggles navegables y accionables por teclado.
- CTA primario único visible al pie de la página.

Core Web Vitals: LCP 1,2s / CLS 0,01 / INP 62ms — todo verde.

---

## Ejemplo 2 — Botón CTA principal (revisión a nivel de componente)

**Target:** `packages/design-system/src/components/Button/Button.tsx` — el componente `Button`, concretamente el estilo `variant="primary"`.

**Stack:** React, Tailwind CSS, tokens del design system, Storybook en localhost:6006.

**Visibilidad del target:** componente (no página) — paso SEO OMITIDO. Navegador en vivo vía Storybook.

### Paso 0 — Detección de capacidades

```
Design system: sí (este ES el componente del design system)
Storybook: sí (localhost:6006 — Button.stories.tsx existe)
Plataforma: web
Visibilidad del target: componente / interno → paso SEO OMITIDO
Navegador en vivo: Storybook
```

### Qué encontró cada skill

**Paso 1 — Estructura base (`ui-ux-pro-max`)**
- El botón se renderiza correctamente en el estado por defecto.
- No hay variante `disabled` definida en las stories — el estado desactivado no está probado ni verificado visualmente.
- Sin variantes de `size` más allá de la por defecto — un hueco habitual que obliga a los consumidores a sobreescribir estilos.

**Paso 2 — Auditoría puntuada (`impeccable`)**
- Contraste (primario): fondo teal `#0f7e74` con label blanco = 4,61:1 — pasa AA (por los pelos).
- Estado hover: el fondo se oscurece a `#0a5e56` — correcto, pero la transición es de 0ms (instantánea).
- Estado active/pressed: sin cambio visual más allá del estado hover — el momento de pulsación es invisible.
- Focus ring: presente pero usa `outline: 2px solid #0f7e74` sobre fondo teal — el anillo es casi invisible.

**Paso 3 — Segunda lente anti-slop (`huashu-design`)**
- El border-radius del botón es `rounded-md` (6px) — se siente ligeramente utilitario para una acción de marca primaria.
- El padding es `px-4 py-2` (16px / 8px) — algo ajustado para un CTA primario; `px-5 py-2.5` se sentiría más premium.

**Paso 4 — Gusto / anti-slop transversal (`taste-skill`)**
- Sin problemas (el componente botón no tiene contenido de texto fijo — las reglas anti-copia no aplican).
- Verificación de coherencia: el hueco de `size` del paso 1 es un riesgo de coherencia — los consumidores probablemente están hardcodeando sobreescrituras.

**Paso 5 — Movimiento y pulido (`emil-design-eng` + `review-animations`)**
- Transición de hover de 0ms — añadir `transition-colors duration-150 ease-out`.
- Estado active (pulsación) necesita una escala sutil: `active:scale-[0.97]` da feedback táctil de pulsación.
- Estado de carga: sin prop `isLoading` ni spinner — el botón queda en silencio durante acciones asíncronas.
- `review-animations`: el timing de escala al pulsar debe coincidir con la transición de hover (150ms) para coherencia.

**Paso 6 — Accesibilidad (`web-design-guidelines` + `web-accessibility`)**
- Focus ring casi invisible sobre fondo teal — cambiar a `outline: 2px solid white` con `outline-offset: 2px` (o usar un anillo de alto contraste).
- La variante `disabled` necesita `aria-disabled` y un estado visual atenuado — actualmente no está definida.
- El estado de carga (al añadirlo) debe anunciarse a lectores de pantalla: `aria-busy="true"` + texto visualmente oculto "Cargando…".

### Checklist presentado al usuario

```
¿Qué hallazgos debo corregir?  (multi-select)

P1 — Roto / identidad / accesibilidad
  [x] Focus ring casi invisible sobre fondo teal — usuarios de teclado pierden orientación [impeccable, web-accessibility]
  [x] Sin variante disabled — los consumidores no pueden renderizar un botón primario desactivado [ui-ux-pro-max, web-accessibility]

P2 — Mejoras
  [ ] Transición de hover de 0ms — añadir duration-150 ease-out                       [emil-design-eng]
  [ ] Sin estado active/pressed — sin confirmación táctil para el usuario              [impeccable, emil-design-eng]
  [ ] Sin estado de carga — el botón queda en silencio durante acciones asíncronas     [emil-design-eng]
  [ ] Padding ajustado para CTA primario (px-4 py-2 → px-5 py-2.5)                    [huashu-design]

P3 — Pulido
  [ ] Border-radius podría ser ligeramente mayor (rounded-md → rounded-lg)             [huashu-design]
  [ ] Escala al pulsar: active:scale-[0.97] para sensación táctil                     [emil-design-eng, review-animations]
```

**El usuario seleccionó:** todos los P1 + transición de hover (P2) + estado de pulsación (P2) + estado de carga (P2).

### Qué se aplicó

1. Focus ring cambiado a `outline: 2px solid white; outline-offset: 2px` (siempre visible independientemente del color del botón).
2. Prop `disabled` añadida: fondo atenuado (`#9ca3af`), `cursor-not-allowed`, `aria-disabled="true"`, y story añadida a Storybook.
3. Transición de hover: `transition-colors duration-150 ease-out` añadida.
4. Active/press: `active:scale-[0.97] active:transition-transform active:duration-75` añadido.
5. Estado de carga: prop `isLoading` → spinner (SVG animado del icon set del DS) + texto visualmente oculto "Cargando" + `aria-busy="true"`.

### Verificación de cierre (Storybook)

Capturas de: por defecto / hover / active / focused / disabled / cargando — en modo claro y oscuro. Todos los estados se renderizan correctamente. Navegación por teclado confirmada: Tab para enfocar → anillo visible → Enter activa la acción → estado de carga visible.

---

## Resumen

| # | Target | Tipo | Pasos omitidos | Arreglos P1 aplicados |
|---|--------|------|---------------|----------------------|
| 1 | Página de ajustes | Página autenticada | SEO | Contraste, headings, toggles por teclado |
| 2 | Componente Button primario | Componente DS | SEO | Focus ring, variante disabled |

→ Volver a [design-review](../README.es.md)
