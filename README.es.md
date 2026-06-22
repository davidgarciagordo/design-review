[English](README.md) | **Español**

# design-review

> Un pipeline ordenado que ejecuta skills de diseño en secuencia, acumula todos los hallazgos y te presenta un checklist para elegir qué corregir.

**design-review** es un flujo de trabajo con nombre propio para pulir cualquier artefacto visual — un componente, pantalla, página, email o dashboard — con un asistente de IA. Secuencia skills de diseño consolidadas (la mayoría de terceros — ver [Atribución](#atribución)) en un único paso disciplinado: estructura → auditoría → anti-slop → pulido → accesibilidad → comprobación visual en vivo. Tú eliges los arreglos; el pipeline solo aplica lo que apruebas.

Es compañero de [Forge Methodology](https://github.com/davidgarciagordo/forge-methodology): **Forge estructura qué construir; design-review pule cómo se ve**.

---

## ¿Por qué design-review?

Ejecutar skills de diseño de forma ad hoc significa hacerlo en el orden equivocado, perder hallazgos entre pasos y aplicar cambios sin un punto de control. El resultado es una auditoría que parece exhaustiva pero pierde las interacciones entre capas — problemas de contraste que solo aparecen después de ajustar el layout, animaciones que parecen bien en aislamiento pero distraen en la pantalla real.

design-review lo resuelve al:

- **Fijar el orden** — estructura antes de auditar, auditoría antes de pulir, pulido antes de accesibilidad, comprobación en vivo siempre al final
- **Acumular hallazgos** de todas las skills en una lista deduplicada (nada se pierde)
- **Darte el control** — presenta hallazgos como un checklist multi-select; aplica solo lo que apruebas
- **Adaptarse a tu proyecto** — omite pasos que no aplican (sin design system, target privado, contexto móvil)

---

## Por qué design-review — con y sin

| | Sin design-review | Con design-review |
|---|---|---|
| **Orden de las skills** | Las skills se ejecutan en el orden en que se invocan; los problemas de estructura se acumulan sobre un layout deficiente | Pipeline fijo: layout y jerarquía primero, auditoría después, pulido solo cuando la estructura está bien |
| **Pérdida de hallazgos** | Cada skill reporta de forma independiente; los hallazgos anteriores se pierden cuando llega la siguiente skill | Lista acumulada única — todos los hallazgos de todas las skills, deduplicados y priorizados |
| **Control del usuario** | Arreglos aplicados silenciosamente o en bloque; sin punto de control entre "qué se encontró" y "qué se cambió" | Checklist multi-select: ves cada hallazgo y eliges qué aplicar antes de que cambie nada |
| **Huecos de cobertura** | Las skills ejecutadas en aislamiento pierden interacciones (contraste tras ajuste de layout, animación tras arreglo de dark mode) | Pipeline ordenado detecta interacciones entre skills; la comprobación en vivo al final captura lo que el análisis estático nunca puede ver |
| **Esfuerzo desperdiciado** | SEO ejecutado sobre un panel de administración; paso de Storybook en un proyecto sin stories | La detección de capacidades en el paso 0 omite los pasos inaplicables explícitamente e indica cuáles se saltaron |
| **Sin evidencia real** | La revisión se hace contra el código, no el artefacto renderizado | La comprobación visual de cierre (capturas en claro/oscuro/móvil + Core Web Vitals) aporta evidencia objetiva |

**La diferencia práctica:** menos interacciones ignoradas, sin cambios masivos silenciosos, hallazgos que sobreviven el pipeline completo, y una captura final que prueba que el resultado es lo que crees que es.

---

## El pipeline

El pipeline se ejecuta en orden fijo. Cada paso acumula hallazgos; nada se descarta.

| Paso | Qué ocurre | Skills |
|------|-----------|--------|
| **0. Detectar capacidades** | Detectar design system, Storybook, plataforma (web/móvil), navegador en vivo y si el target es público. Omitir pasos inaplicables e indicar cuáles. | — |
| **0b. Reuse-first** | Consultar los componentes existentes antes de diseñar. Las piezas nuevas reutilizables van al design system con su story. *(Omitir si no hay design system.)* | — |
| **1. Estructura base** | Jerarquía visual, arquitectura de la información, layout, carga cognitiva. | `ui-ux-pro-max` (principal) o `frontend-design` (fallback) |
| **2. Auditoría puntuada + anti-slop** | Auditoría puntuada en 5 dimensiones con iteración en vivo. Skill principal. | `impeccable` |
| **3. Segunda lente anti-slop** | Crítica independiente en 5 dimensiones; detecta lo que el paso 2 pasó por alto. | `huashu-design` |
| **4. Gusto / anti-slop transversal** | Prohibición de em-dash, control de eyebrows, números falsos, coherencia. En dashboards: solo reglas transversales. | `taste-skill` |
| **5. Movimiento y pulido** | Animación con propósito, feedback táctil, transiciones, skeletons, reduced-motion. Después, revisión dedicada de animaciones (timing, easing, jank). | `emil-design-eng` + `review-animations` |
| **6. Accesibilidad** | WCAG AA (contraste ≥ 4,5:1), teclado, focus ring visible, roles, labels, reduced-motion. | `web-design-guidelines` + `web-accessibility` / `accessibility` |
| **6b. SEO** | Headings semánticos, etiquetas meta/OG, datos estructurados. **Solo para targets públicos — omitir en UI privada/interna.** | `seo` |
| **7. Comprobación visual en vivo** | Renderizar el target real (Storybook y/o ruta de la app) en claro, oscuro y móvil. Captura de pantalla. Core Web Vitals (LCP/CLS/INP/TTFB). Diff de regresión visual en rediseños. Ejecutar secuencialmente. *(Omitir si no hay navegador en vivo; indicarlo.)* | `agent-browser` |

La comprobación en vivo siempre es la última. Es la prueba de realidad que el análisis estático no puede dar.

---

## Se adapta a tu proyecto

Antes de ejecutarse, el pipeline comprueba cuatro cosas:

| Si tu proyecto tiene… | El pipeline… |
|---|---|
| Sin design system ni fichero de tokens | Omite el paso reuse-first; marca inconsistencias de color/espaciado de forma ad hoc |
| Sin Storybook | Omite el paso Storybook-first; renderiza en la ruta de la app |
| Un target privado/interno (admin, dashboard, app autenticada) | **Omite el paso SEO por completo** |
| Móvil (React Native / Expo) en lugar de web | Usa una skill de diseño móvil; omite las skills solo para DOM |
| Sin navegador en vivo ni servidor de desarrollo | Hace una revisión estática; indica explícitamente que la comprobación visual en vivo no se ejecutó |

Cada paso omitido se indica explícitamente con el motivo.

---

## Salida: un checklist que tú eliges

Tras ejecutar el pipeline, todos los hallazgos de cada skill se reúnen en una lista deduplicada, agrupada por prioridad, y se presentan como un **checklist multi-select**. Los ítems P1 se preseleccionan. Tú eliges qué corregir; el pipeline aplica solo los ítems seleccionados.

```
¿Qué hallazgos debo corregir?  (multi-select)

P1 — Roto / identidad / accesibilidad
  [x] Contraste 3,1:1 en el label del botón primario — falla WCAG AA        [impeccable, web-accessibility]
  [x] Sin focus ring visible en los nav links — usuarios de teclado no pueden orientarse  [web-design-guidelines]
  [x] Acción solo con icono en nav móvil sin label accesible                 [web-accessibility]

P2 — Mejoras
  [ ] Jerarquía de CTA: dos botones primarios en la misma pantalla           [impeccable, huashu-design]
  [ ] Ritmo de espaciado de tarjetas se rompe en la 3ª fila (8px de diferencia) [taste-skill]
  [ ] LCP 3,8s — imagen hero no precargada                                   [agent-browser]

P3 — Pulido
  [ ] Transición de hover a 320ms se siente lenta → objetivo 150ms           [emil-design-eng, review-animations]
  [ ] Eyebrow de sección "CARACTERÍSTICAS" en mayúsculas no aporta nada      [taste-skill]
  [ ] Borde de tarjeta en dark mode apenas visible (1px solid rgba(255,255,255,0.06)) [impeccable]
```

Para listas largas se ofrecen atajos: "seleccionar todos los P1", "todos P1+P2" o selección por ítem.

Tras aplicar: typecheck (si hay código), uso de design tokens (sin colores/espaciados/tipografías hardcodeados), coherencia de marca/identidad, y capturas de cierre (claro/oscuro/móvil) + Core Web Vitals.

---

## Atribución

Este pipeline orquesta skills de terceros. **Verifica las URLs antes de instalar.**

| Skill | Propósito | Fuente |
|---|---|---|
| `ui-ux-pro-max` | UX base / estructura (paso 1) | https://ui-ux-pro-max-skill.nextlevelbuilder.io/ |
| `frontend-design` | UI base no genérica (fallback paso 1) | Anthropic |
| `impeccable` | Auditoría puntuada + anti-slop + iteración en vivo | https://github.com/pbakaus/impeccable |
| `huashu-design` | Prototipos hi-fi + anti-slop + revisión en 5 dimensiones | https://github.com/alchaincyf/huashu-design |
| `taste-skill` | Anti-slop / gusto de diseño | https://github.com/Leonxlnx/taste-skill |
| `emil-design-eng` | Pulido de movimiento e interacción | https://github.com/emilkowalski/skills |
| `review-animations` | Revisión dedicada de animaciones (timing / easing / jank) | https://github.com/emilkowalski/skills |
| `web-design-guidelines` | Web Interface Guidelines (AA, teclado, contraste) | Anthropic — Web Interface Guidelines |
| `web-accessibility` / `accessibility` | Auditoría WCAG 2.2 | https://github.com/addyosmani/web-quality-skills |
| `seo` | Visibilidad en buscadores (solo targets públicos) | https://github.com/addyosmani/web-quality-skills |
| skill de diseño móvil | Pantallas móviles / RN | elige la tuya (p. ej. Sleek — sleek.design) |

Si una skill no está disponible y no tiene fuente pública, el pipeline degrada con gracia: ejecuta los pasos disponibles e indica qué lentes se omitieron.

Detalles completos de instalación y atribución: [references/attribution.md](references/attribution.md)

---

## Cómo usarlo

### Instalación

Clona `SKILL.md` en tu directorio de skills de Claude Code:

```bash
git clone https://github.com/davidgarciagordo/design-review-pipeline ~/.claude/skills/design-review
```

Claude Code lo detecta automáticamente.

### Disparadores

```
improve design
design review
run the design skills
/design-review <target>
```

### Prompt estructurado

```
/design-review apps/web/app/settings/page.tsx

Target: página de ajustes (autenticada — omitir SEO)
Stack: Next.js App Router, Tailwind, tokens del design system
Navegador en vivo: disponible (dev server en puerto 3000)
```

### Sin Claude Code

Lee `SKILL.md` directamente. El pipeline funciona con cualquier asistente de IA. Ejecuta cada paso manualmente en orden, acumula hallazgos en un documento compartido y presenta el checklist antes de aplicar cambios.

---

## Compañero: Forge

design-review es compañero de [Forge Methodology](https://github.com/davidgarciagordo/forge-methodology).

**Forge** estructura el trabajo: alinear intención → spec → grill adversarial → plan global → ejecución óptima → verificado → aprobación del responsable. Responde a "¿estamos construyendo lo correcto, de la forma correcta?"

**design-review** pule el resultado: una vez que la pantalla o componente existe, pásalo por el pipeline para que sea visualmente correcto — jerarquía adecuada, sin regresiones de accesibilidad, movimiento con propósito, métricas de rendimiento reales.

Se combinan de forma natural: usa Forge para planificar y ejecutar una funcionalidad, luego pasa el artefacto de UI por design-review antes del gate de aprobación del responsable.

---

## Ejemplos

Ejemplos trabajados con hallazgos y checklists:

→ [examples/](examples/README.es.md)

---

## Referencias

| Referencia | Contenido |
|-----------|----------|
| [references/pipeline.md](references/pipeline.md) | Detalle paso a paso del pipeline: qué hace cada skill, qué buscar, cómo encadenar hallazgos |
| [references/attribution.md](references/attribution.md) | Tabla completa de atribución con instrucciones de instalación y notas de fallback |

---

## Plantillas

| Plantilla | Para qué |
|----------|---------|
| [templates/findings-checklist.md](templates/findings-checklist.md) | Plantilla de checklist lista para copiar y registrar hallazgos del pipeline |

---

## Licencia

MIT — ver [LICENSE](./LICENSE).
