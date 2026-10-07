# Feature: /nosotros con una sola apertura y evidencia visual

## Objetivo

La página arranca con mucho texto y sin ningún objeto visual. Abre dos veces
(PageHeader con eyebrow "Nosotros" + h1 "Nosotros" + intro, y enseguida About con
eyebrow "Nuestra historia" + h2 "Quiénes somos" + el cuerpo), y los dos párrafos
más largos describen sistemas concretos que el visitante nunca ve. Pedido del
autor (2026-10-07): que la sección sea más dinámica y que el texto no sea un muro.

## Diagnóstico medido

- `about.body`: 4 párrafos, 339 + 446 + 282 + 120 = **1187 caracteres**, 9 oraciones.
- El intro de `pages.nosotros` agrega 135 caracteres: **1322 en total**.
- El reveal da 80ms de diferencia entre párrafos, así que los 4 entran en 240ms y
  la animación no llega a guiar la lectura.
- Las dos capturas que el texto describe ya están en el repo y **ya tienen
  descripción en `content.ts`**: `caseStudies.limpieza.gallery[1]` (alt
  "Liquidación automática de sueldos por horas verificadas") y
  `caseStudies.legal.gallery[2]` (alt "Detalle de un expediente judicial").

## Decisiones (agente, 2026-10-07)

| Tema | Decisión |
| --- | --- |
| Apertura | `About` absorbe la apertura de la página: eyebrow `about.eyebrow`, h1 `pages.nosotros.h1`, lead `pages.nosotros.intro`, y después h2 `about.title` con el cuerpo. `/nosotros` deja de renderizar `PageHeader`. |
| Borde | `About` pierde el `border-t`: ahora es el primer bloque debajo del header sticky, que ya tiene su propio `border-b`, y dos líneas de 1px pegadas se leen como una de 2px. El bloque que va inmediatamente debajo del header no lleva borde superior: en el home es `Hero` y en el resto de las páginas es `PageHeader`, los dos sin borde. `Contact` sí lo tiene porque viene después de `PageHeader`. |
| Ancla | `About` suelta `id="nosotros"` y `scroll-mt-24`: `Team` ya usa ese id y en `/nosotros` quedaba duplicado (HTML inválido). Ningún link del repo apunta a `#nosotros`. |
| Capturas | Una por párrafo de evidencia, con el ancho completo de la columna de contenido. A 40% de ancho una captura de sistema no se lee. El texto conserva su medida (`max-w-3xl`). |
| Origen de la captura | `src` y `alt` salen de `caseStudies`: misma captura y misma descripción, sin duplicar copy ni inventar. |
| Reveal | Por oración en vez de por párrafo, solo con opacidad. Los spans son inline y `transform` no aplica a cajas inline no reemplazadas, así que el `translateY` del primitivo lo ignora el navegador: los cortes de línea del texto no cambian y no hay CLS. |
| Tipografía | Sin cambios: el cuerpo sigue en `text-xl md:text-2xl`. |

## Alcance

- `src/components/About.astro`: apertura, reveal por oración y las dos capturas.
- `src/pages/nosotros.astro`: saca `PageHeader` y su import.
- `src/lib/content.ts`: **sin cambios**. El eyebrow y el h2 siguen usándose, y los
  alt salen de `caseStudies`.

## Fuera de alcance

- Timeline, "dos caminos que convergen" y la gramática del pie de rey: segunda ola,
  requieren decisión del autor.
- El copy de `about.body` y de `pages.nosotros.intro` no se toca.

## Criterios de aceptación

1. `/nosotros` renderiza un solo eyebrow y un solo h1 antes del cuerpo.
2. El texto de los 4 párrafos es idéntico al actual, con espacios simples entre
   oraciones.
3. Cada oración revela con opacidad y delay incremental; con
   `prefers-reduced-motion: reduce` queda visible y estática.
4. Las dos capturas salen con el `alt` de su caso de estudio, en `loading="lazy"` y
   con `widths`/`sizes`.
5. No queda ningún `id="nosotros"` duplicado en el HTML de `/nosotros`.
6. `npx astro check` y `npm run build` pasan.

## Estado

Implementado y verificado: `astro check` (61 archivos, 0 errores, 0 warnings), build
OK y HTML emitido revisado. Un solo h1 ("Nosotros"), 12 ids todos únicos (el
`id="nosotros"` queda solo en `Team`), orden correcto de
p1 / captura limpieza / p2 / captura legal / p3 / p4, y el texto de los 4 párrafos
idéntico a `content.ts` (339 + 446 + 282 + 120 caracteres, cero palabras comidas).

Corregido sobre la primera versión delegada: apilaba las dos capturas al final del
texto en vez de pegarlas al párrafo que afirman, y no les aplicaba `data-reveal` ni
el delay.

Sin navegador: el reveal en scroll, las capturas renderizadas y Lighthouse quedan
pendientes de comprobación visual.
