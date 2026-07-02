[English](README.md) | **Español**

# design-review

Plugin de Claude Code. Un pipeline con gates que cura la **UI plana y plantillada** — estudia referencias reales de 2026, corre 4 lentes de diseño en orden, y termina cada ejecución con un veredicto explícito: **alive / templated / flat**.

Compañero de [forge-methodology](https://github.com/davidgarciagordo/forge-methodology): Forge estructura *qué construir*; design-review hace que *cómo se ve* cobre vida.

## Requiere

Este plugin **orquesta 4 skills de terceros — no las incluye**. Ninguna viene de fábrica con Claude Code.
**No hace falta instalarlas a mano**: `/design-review:run` auto-instala en el Step 0 cualquier skill core
que falte (anunciándolo, nunca en silencio). La tabla queda como referencia / instalación manual:

| Skill | Autor | Instalación |
|---|---|---|
| `impeccable` | Paul Bakaus ([pbakaus](https://github.com/pbakaus)) | `git clone https://github.com/pbakaus/impeccable ~/.claude/skills/impeccable` |
| `design-taste-frontend` (`taste-skill`) | [Leonxlnx](https://github.com/Leonxlnx) | `npx -y skills@latest add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend` |
| `emil-design-eng` | Emil Kowalski ([emilkowalski](https://github.com/emilkowalski)) | `npx -y skills@latest add emilkowalski/skills --skill emil-design-eng` |
| `web-design-guidelines` | Vercel (`vercel-labs/web-interface-guidelines`) | `npx -y skills@latest add vercel-labs/agent-skills --skill web-design-guidelines` (alt: `curl -fsSL https://vercel.com/design/guidelines/install | bash`) |

Detalle completo (add-ons, inteligencia conectada, mecanismo de bootstrap): [references/attribution.md](references/attribution.md).
`node scripts/preflight.mjs` comprueba qué hay presente en tu entorno.

## Instalación

Solo este plugin:

```bash
/plugin marketplace add davidgarciagordo/design-review
/plugin install design-review
```

O toda la suite (este + token-economy, forge-methodology, working-methods, automations) desde [un único catálogo](https://github.com/davidgarciagordo/claude-plugins):

```bash
/plugin marketplace add davidgarciagordo/claude-plugins
/plugin install design-review@davidgarciagordo-plugins
```

## Cómo funciona

Ejecútalo explícitamente con `/design-review:run <target>` (un componente, una ruta de la app, un story de Storybook, o un email), o deja que se auto-dispare por contexto ("mejora este diseño", "hazlo vivo").

**Pipeline (en orden, los gates no se pueden saltar):**

1. **Preflight** — declara cada componente que necesita la ejecución, pregunta antes de instalar, registra omisiones explícitamente.
2. **audit-first** *(solo rediseños)* — captura el estado actual, escribe "qué conservar".
3. **reference-research** *(gate, siempre)* — Dribbble 2026 + 2-3 competidores, en vivo vía `agent-browser`. La palanca #1 contra lo plano.
4. **context-pack** — descubre el target UNA SOLA VEZ (ficheros, tokens, captura); cada lente juzga este pack en vez de re-escanear.
5. **4 lentes** *(read-only)* — `impeccable` (estructura/IA), `design-taste-frontend` (gate anti-plantilla), `emil-design-eng` (motion de firma), `web-design-guidelines` (accesibilidad AA). Cada una emite OK/KO terse + hallazgo de una línea, etiquetado `[skill]`.
6. **Multi-select** — una lista deduplicada P1/P2/P3; nada cambia sin que lo marques.
7. **Apply** — una única pasada con todos los arreglos elegidos.
8. **vitality-verdict** *(gate)* — renderiza en vivo (claro/oscuro/móvil), compara contra las referencias, emite `alive` / `templated` / `flat`. Si no es `alive` → vuelve al paso 3.

**Hook de aplicación:** un hook `PostToolUse` comprueba `.design-review/verdict.json` cada vez que se escribe un fichero de UI. Modos vía `DESIGN_REVIEW_GATE`: `warn` (por defecto, orientativo), `block` (exit 2 — hay que llegar a `alive`), `off`.

**Ejemplo de prompt estructurado:**

```
/design-review:run apps/web/app/settings/page.tsx

Target: página de ajustes (autenticada — privada; add-on SEO desactivado)
Stack: Next.js App Router, Tailwind, tokens del design system
Navegador en vivo: disponible (dev server en puerto 3000)
```

**Sin Claude Code:** lee `SKILL.md` y `references/pipeline.md` — el pipeline funciona con cualquier asistente de IA: ejecuta cada gate en orden, carga cada skill en lugar de resumirla, acumula hallazgos, termina con el veredicto explícito.

## Ventajas

- No deja pasar "correcto pero plano" — el gate de veredicto fuerza vitalidad, no solo eliminación de defectos.
- Frugal en tokens: context-pack de descubrimiento único + lentes read-only terse (sin re-escanear en cada lente).
- Nada se instala en silencio: el preflight pregunta antes de instalar, el hook avisa/bloquea escrituras de UI sin gate.

## Atribución

Orquesta skills de terceros — las carga, nunca las parafrasea. Core (obligatorios, de terceros — ver [Requiere](#requiere)): [`impeccable`](https://github.com/pbakaus/impeccable) (Paul Bakaus), [`design-taste-frontend`](https://github.com/Leonxlnx/taste-skill) (Leonxlnx), [`emil-design-eng`](https://github.com/emilkowalski/skills) (Emil Kowalski), [`web-design-guidelines`](https://github.com/vercel-labs/web-interface-guidelines) (Vercel). Add-ons conectados: `ui-ux-pro-max`, `refero`, `frontend-design`, `review-animations`, `huashu-design`, `web-accessibility`, `seo`. Detalle completo: [references/attribution.md](references/attribution.md).

Alternativa: clónalo en `~/.claude/skills/design-review` para cargarlo como plugin local sin marketplace.

## Licencia

MIT — ver [LICENSE](./LICENSE).
