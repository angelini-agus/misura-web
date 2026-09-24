# Feature: mazo de carpetas en `/proyectos`

## Estado

Pedido del autor (23-09-2026, **v1**), textual: aplicar a los casos de la sección de
proyectos la animación del componente `case-study-flip-stack` del registry
`@componentry` de shadcn; no poner las fotos una al lado de la otra (una grande
y dos chicas abajo, o una sola en carrusel); que al hover la foto se agrande y
se ponga a color normal; la foto a la derecha en vez de la izquierda; el tamaño
de las tarjetas a criterio del implementador, basado en la animación.

Referencia v1: `https://componentry.dev/docs/components/case-study-flip-stack`
(fuente cruda del registry: `https://componentry.dev/r/case-study-flip-stack.json`).

Pedido del autor (24-09-2026, **v2, vigente**), textual: «Quiero que tenga esa
forma, los contenedores de las cards, como si fuera algo físico, un archivo de
la carpeta física, como las de Windows. Fíjate que las hiciste gigantes y
quiero que ocupen la pantalla. O uso una screenshot que ocupe como la pantalla
entera. Tiene que ser la card del tamaño así, más o menos 40vh máximo de
tamaño, y las screenshots de allí a la derecha. Después arriba, en la
carpetita, el título: este proyecto 1, y abajo, lo mismo que ya teníamos
antes.»

Referencias v2: `https://www.framer.com/marketplace/components/scroll-stack-deck/`
y el recorte que el autor dejó en la raíz del repo (`image.png`, sin trackear:
no se commitea).

- **Estado:** v1 implementado y verificado, commiteado como base (`526f415` +
  `d5d02a3`) y **reemplazado por v2**. v2 en implementación.
- **Rama:** `feat/proyectos-flip-stack` (local, sin pushear).
- **Autorización:** el autor pidió los cambios en un mismo mensaje (v1 el 23-09,
  rediseño el 24-09). No hay pedido de SDD, así que esto corre como ODD con un
  solo escritor.

## Rediseño v2 (vigente): carpetas que se asientan detrás

### Decisiones del autor (24-09)

1. **La forma es la de `image.png`:** cada caso es una carpeta con la pestaña
   arriba a la izquierda; el cuerpo de la carpeta contiene el texto y la
   captura. Lo que antes era una tarjeta alta pasa a ser un objeto bajo, con
   silueta de carpeta de Windows.
2. **El mazo se asienta detrás, no se pliega:** la carpeta que queda atrás sube
   y se achica un poco (deja ver su pestaña) y la siguiente sube desde abajo.
   Se retira el `rotateX` del plegado.
3. **La piel es la del sistema:** cuerpo crema sobre la superficie elevada y
   borde de 1px verde, plano. La referencia pinta cada carpeta de un color
   distinto; eso no se copia (misma regla que en v1: se toma la forma, no la
   piel).
4. **La pestaña lleva el título del caso** (`study.title`). El cuerpo **no**
   repite el título: queda cliente, descripción, tecnologías y CTA, en el mismo
   orden que ya tenían.

### Geometría

- El stage sigue pegado y ocupa la pantalla (`sticky`, `100dvh`), con el mazo
  centrado: es lo que el autor llama «que ocupen la pantalla».
- La carpeta ocupa el ancho del stage (el contenido de la página, sin volver al
  tope de 68rem de v1) y su alto está topeado en **40vh**; si el contenido pide
  menos, manda el contenido (`min()`), nunca un alto fijo que recorte texto.
- Adentro, dos columnas: texto a la izquierda, captura a la derecha, en la
  proporción del recorte (≈45/55). La captura conserva 16:10, el duotono y el
  revelado al hover que ya están verificados.
- **Se retira la fila de dos miniaturas.** Con 40vh de alto, la captura grande
  ya llena la columna de la derecha: dos más abajo no entran sin romper el
  tope. El corte de la galería a tres capturas se mantiene en el componente,
  así reponerlas es un cambio de una línea de markup si el autor lo pide.
- Mobile (`<48rem`): una columna, la captura abajo del texto, mismo tope de
  40vh y la pestaña arriba.

### Movimiento

- Por tramo de scroll (runway = `n * 100dvh`, como en v1) la carpeta que pasa
  se asienta: `translateY` hacia arriba de un escalón corto + `scale` levemente
  menor, sin rotación. La que entra sube desde abajo hasta su lugar.
- El escalón tiene que dejar visible la pestaña de la carpeta de atrás (su alto
  más un aire es el mínimo, no un número inventado).
- El resorte y el `requestAnimationFrame` que se apaga cuando se asienta se
  mantienen de v1: nada de un loop encendido todo el tiempo, y nada de instalar
  una librería de animación.
- La matemática sigue viviendo en `src/lib/flip-stack.ts` como funciones puras,
  para poder ejercitarla en Node sin navegador.

### Accesibilidad y degradación (se mantiene de v1)

- `prefers-reduced-motion: reduce`: sin asentado ni entrada; el mazo avanza por
  opacidad.
- Sin JS: el carrete se desarma y los seis casos se leen como lista vertical.
- Teclado: las carpetas tapadas quedan `inert`; la de adelante es la que
  responde al foco.
- Capturas: mismo `alt`, mismo duotono, mismo hover que ya están verificados.

## Historial v1 — plegado (implementado, verificado y reemplazado el 24-09)

## Decisiones del autor y decisiones derivadas

1. **La animación es la de la referencia:** el mazo queda pegado (sticky), la
   tarjeta de arriba se pliega hacia arriba con `rotateX` y la de abajo sube
   desde un offset de reposo. Es lo que pidió, no una interpretación.
2. **La foto va a la derecha**, el texto a la izquierda (hoy es al revés).
3. **Nada de fotos en fila:** una captura grande arriba y hasta dos chicas
   abajo, en la columna de la derecha. Se descartó el carrusel: cada tarjeta
   tendría su propio carrusel (6 controles nuevos, más JS y más a11y) para
   mostrar menos capturas que la grilla actual.
4. **Al hover la captura se agranda y pierde el duotono.** Es el único lugar
   donde el sistema muestra el color real de la interfaz; se implementa como
   modificador reutilizable del primitivo, no como CSS suelto de esta sección.
5. **El tamaño de la tarjeta sale de la animación, no de la tarjeta vieja:** la
   referencia usa una tarjeta de 860px de ancho con relación 1.76:1 centrada en
   una ventana de una pantalla. Acá se estira a un máximo de 68rem con relación
   1.9:1, porque la columna de la derecha lleva una captura grande más dos
   chicas (más alto útil que una sola foto) y el texto es más largo.
6. **La piel no se copia.** La referencia trae color por tarjeta, sombra y
   degradé sobre la foto. El sistema del sitio es plano: borde de 1px, radio de
   tarjeta, verde y crema. Se toma la animación y la estructura, no el skin.
7. **Cambio acompañante (otro commit):** el botón «Contanos tu caso» del footer
   se mueve de la columna de navegación a la columna de la izquierda, debajo de
   la bajada de marca.

## Mecanismo (v1)

### Estructura

```
section
  intro (eyebrow + título + descripción)          <- ya existe, no cambia
  runway    height: n * 100dvh                     <- el carrete del scroll
    sticky  position: sticky; top: 0; height: 100dvh; overflow: hidden
      stage  ancho/alto de la tarjeta + perspective 800px + container de cqw
        card x n   absolutas, inset 0, z-index decreciente
```

El runway mide `n * 100dvh` y no `(n + 1) * 100dvh` como la referencia: así la
última tarjeta **no** se pliega, se queda como tarjeta final y el visitante
sigue scrolleando hacia el footer. Con la fórmula de la referencia el mazo
terminaba con la ventana vacía.

### Matemática (una tarjeta por tramo)

`n` = cantidad de tarjetas, `m = max(n - 1, 1)`, `seg = 1 / m`, y `p` = progreso
del carrete (0 cuando el runway toca el borde superior, 1 cuando su borde
inferior toca el borde inferior de la ventana).

Por tarjeta `i`:

- **salida** (todas menos la última): tramo `[i * seg, min((i + 1) * seg, 1)]`
  - `y%` de 0 a -118
  - `rotateX` de 0 a 22deg
  - offset de apilado en px de 0 a `i * min(24, 72 / m)`
- **entrada** (todas menos la primera): tramo
  `[max(0, i * seg - seg), i === 0 ? 0 : min(i * seg, i * seg - 0.3 * seg)]`
  - `scale` de `1 - min(i * 0.012, 0.035)` a 1
  - `y` de `min(i * 12, 34)` px a 0

Origen de la transformación: la tarjeta (la que se pliega) al 50% 50%; el panel
(el que sube) al 50% 100%, para que crezca desde el borde inferior.

El progreso pasa por un resorte (`stiffness 120`, `damping 22`, `mass 0.8`,
`restDelta 0.0005`) que se integra en un `requestAnimationFrame` que **sólo
corre mientras el resorte no se asentó**; el scroll lo alimenta con un listener
pasivo coalescido por rAF, igual que `StickyCta.astro`. Nada de bucles
encendidos todo el tiempo.

### Movimiento reducido

Con `prefers-reduced-motion: reduce` no hay plegado ni entrada: el mazo avanza
por opacidad (la tarjeta de arriba se desvanece sobre la de abajo). "Neutralizar
el movimiento, nunca quitar la función."

### Teclado

Las tarjetas tapadas están fuera del orden de tabulación vía `inert`. La tarjeta
activa es `round(p / seg)`, es decir, la que está al frente del mazo en ese
momento: se puede tabular a su botón, y al scrollear pasa a ser accesible la
siguiente. Sin `inert` el foco caía en botones que no se ven.

### Sin JS

Sin JS el carrete se desarma (`height: auto`, sin `sticky`, sin `absolute`) y
las tarjetas quedan como una lista vertical: el contenido nunca queda apilado en
una sola posición. Es el mismo patrón que usa `[data-reveal]` en `global.css`
(todo bajo la clase `.js` del `<html>`).

### Tamaño

- **Desde `48rem`:** el ancho es `min(100%, 68rem, (100dvh - navbar - 4rem) * 1.9)`
  y el alto sale de `aspect-ratio 1.9`. El tope de `100dvh` mantiene la tarjeta
  entera en pantalla (con 4rem de aire: el navbar arriba y el asomo del mazo
  abajo). A 1440px de ancho la tarjeta mide 1088x572.
- **Menos de `48rem`:** una columna, ancho `min(100%, 30rem)`, alto
  `min(100dvh - navbar - 4rem, 40rem)`, y sólo la captura grande (las dos chicas
  no entran en el alto útil de un celular).
- La tipografía usa `cqw` contra el `stage` (`container-type: inline-size`) con
  mínimos en `rem`: la tarjeta manda, no el ancho de la ventana.

### Capturas

- Grande: `16:10` (relación de la mayoría de las capturas del repo, así no hay
  recorte lateral), ancho completo de la columna.
- Chicas: dos en una fila, `16:10`, cada una con la mitad del ancho.
- Si el caso tiene una sola captura (`landing-empresa-limpieza`), la grande
  queda centrada en la columna. Es el único caso con ese aire de más.
- Si tiene dos, la segunda ocupa la celda izquierda de la fila: el mosaico se
  lee intencional y no desborda el alto de la columna.

## Alcance (v1)

- `src/components/ProjectsStack.astro`: la sección entera (markup, estilos
  scoped y script).
- `src/lib/flip-stack.ts`: la matemática del mazo como funciones puras, para
  poder verificarla sin navegador.
- `src/components/ui/ScreenshotFrame.astro`: prop nueva para el revelado al
  hover.
- `src/styles/global.css`: modificador de hover del primitivo del duotono.
- `src/components/Footer.astro`: el botón «Contanos tu caso» a la columna de la
  izquierda (commit aparte).
- `docs/features/proyectos-stack.md` y `docs/features/tratamiento-de-imagenes.md`.

## Fuera de alcance (v1)

- `Portfolio.astro` (home) y `CaseStudyGallery.astro` (detalle): siguen con el
  duotono fijo y las capturas en fila. El modificador queda listo para
  adoptarlo, pero el autor no lo pidió ahí.
- El carrusel de una sola captura.
- Instalar `framer-motion` o cualquier librería de animación (regla del sistema
  de diseño: "no instalar librerías de animación").
- Grillas de 8 columnas, colores por tarjeta, sombras y degradés de la
  referencia.

## Criterios de aceptación (v1, históricos)

1. En `/proyectos`, cada caso es una tarjeta que se pliega hacia arriba al
   scrollear y deja ver la siguiente; la última se queda.
2. La captura grande va a la derecha del texto, con hasta dos chicas abajo, y
   ninguna fila de tres.
3. Al hover sobre una captura, se agranda y muestra el color real de la
   interfaz; al salir vuelve al duotono.
4. La tarjeta entra entera en la ventana (con el navbar) de 48rem en adelante y
   en celulares bajos.
5. Con `prefers-reduced-motion: reduce` no hay plegado: el mazo avanza por
   opacidad.
6. Sin JS, los seis casos se leen como lista.
7. Los botones de las tarjetas tapadas no son alcanzables por teclado.
8. El botón «Contanos tu caso» del footer está en la columna de la izquierda,
   debajo de la bajada de marca.
9. `npx astro check` y el build pasan; el HTML y el CSS emitidos contienen la
   estructura nueva.

## Tareas (v2)

- [x] La silueta de carpeta: pestaña con el título, cuerpo con texto y captura
- [x] El alto topeado a 40vh con el ancho del stage (desktop; en mobile el
      contenido manda y el tope no entra: ver Evidencia)
- [x] La matemática del asentado detrás en `src/lib/flip-stack.ts`
- [x] Movimiento reducido, sin JS y teclado, con la geometría nueva
- [x] Docs de la feature
- [x] Verificación: `astro check`, build, matemática en Node y HTML/CSS emitidos
- [x] Pasada 4: centrado de la pila (la pestaña del frente quedaba debajo del
      navbar) y captura mobile compacta
- [ ] Verificación INDEPENDIENTE del mazo: el `gentle-ai-verify` se lanzó el
      24-09 y el autor lo canceló por lento (89 turnos). La evidencia disponible
      es la del escritor más las mediciones propias del padre en navegador.

## Plan operativo (v2)

1. Reescribir `src/lib/flip-stack.ts` con la matemática del mazo de carpetas
   (sin `rotateX`, sin `flipExitPercent`, sin apilado por `stackStep`):
   - `flipGeometry(total, step, entryOffset)` devuelve geometría con `segment`.
   - `flipCardState(progress, index, geometry, reduceMotion)` devuelve
     `{ y, scale, opacity }` para la carpeta `index` al progreso dado.
   - Mantener `flipFront`, `flipProgress`, `springStep`, `defaultSpringConfig`.
2. Reescribir el markup, los estilos y el script de
   `src/components/ProjectsStack.astro`:
   - Silueta de carpeta: `.folder` con `.folder__tab` (arriba a la izquierda,
     sobresale del cuerpo) y `.folder__body` (caja crema con borde verde).
   - El cuerpo lleva copy a la izquierda y la captura grande a la derecha
     (mobile: una columna). Sin la fila de dos miniaturas.
   - El alto del cuerpo está topeado en 40vh con `min(content, 40vh)`.
   - El script alimenta el mazo con la nueva matemática.
3. Actualizar `docs/features/proyectos-stack.md` con la geometría, la
   matemática y el motion del v2, y dejar nota explícita de las dos
   miniaturas que se retiraron y cómo restaurarlas.
4. Verificar con `npx astro check` y medir en Chrome headless contra el dev
   server.

## Tareas v1 (cerradas el 24-09)

- [x] `src/lib/flip-stack.ts` con la matemática
- [x] La sección: markup, estilos y script del mazo
- [x] El revelado al hover en el marco de captura y el primitivo
- [x] El botón del footer a la columna de la izquierda
- [x] Docs de las dos features tocadas
- [x] Verificación: `astro check`, build, matemática en Node y HTML/CSS emitidos

## Evidencia

### v1 (cerrada el 24-09)

- `npx astro check` → 0 errores, 0 warnings, 0 hints (59 archivos).
- `npm run build` → 11 páginas, `Complete!`.
- Matemática de `src/lib/flip-stack.ts` ejercitada en Node 24
  (`--experimental-strip-types`, script fuera del repo): monotonía y topes de
  `yPercent`/`rotateX`/`stackOffset`/`entryY`/`entryScale`, extremos exactos,
  última tarjeta sin plegar, `n=1` y `n=2` sin NaN → «ALL MATH INVARIANTS
  PASS».
- Emitido y servido, mismos marcadores: 6 `data-flip-card`, 1
  `data-flip-runway`, 1 `data-flip-stage`, 6 `shot--big`, 10 `shot--thumb`, 16
  `foto-duotono--hover`, `--flip-count: 6`.
- Sin JS: reglas base ungated (runway `height:auto`, sticky estático, cards en
  flujo) y el gate en `.js`; `document.documentElement.classList.add("js")` en
  `BaseLayout.astro:97`.
- Pendiente que v1 dejó abierto y que v2 reemplaza: la revisión visual del
  autor (medición en navegador).

### v2

- `npx astro check` → 0 errores, 0 warnings, 0 hints (59 archivos).
- Matemática de `src/lib/flip-stack.ts` ejercitada en Node 24 con
  `--experimental-strip-types`: monotonía y topes de `y`/`scale`/`opacity`,
  extremos exactos (folder 0 en `p=1` → `y=-5*step`, folder 5 en `p=1` →
  `y=0`), última carpeta sin asentarse, `n=1` y `n=2` sin NaN, resorte
  converge en menos de 200 frames → «ALL MATH INVARIANTS PASS».
- Emitido y servido: 6 `data-flip-card`, 1 `data-flip-runway`, 1
  `data-flip-stage`, 6 `folder__tab`, 6 `folder__body`. Cero
  `data-flip-card` extra (la fila de dos miniaturas de v1 no se renderiza,
  solo el slicing a tres en `projects.slice(0, 3)` se mantiene).

#### Medición en navegador (Chrome headless + CDP contra el dev server)

Script: `Emulation.setDeviceMetricsOverride` con `scroll-behavior: auto`
forzado antes de cada `scrollTo`. `window.scrollTo(0, 0)` previo a cada
medición. Espera generosa (>2 s) para que el resorte se asiente antes de
leer el frente.

**1440 x 900 (desktop):**

| Medida | Valor |
| --- | --- |
| Cantidad de carpetas | 6 |
| Caja del deck (`offsetWidth x offsetHeight`) | 1280 x 360 px |
| Caja del body de la carpeta al frente | 1280 x 360 px (40.00 vh) |
| Caja de la pestaña | 332 x 34 px |
| Tope de 40vh en el cuerpo del frente | sí (360 px = 40.00 vh, sin تجاوز) |
| Texto recortado en el cuerpo del frente (`scrollHeight > clientHeight`) | no, en las 6 carpetas |
| CTA visible dentro del cuerpo | sí, en las 6 carpetas |
| Sliver visible de la pestaña de la carpeta de atrás a `p=0.5` | 33 px |
| Sliver visible del cuerpo de la carpeta de atrás a `p=0.5` | 41 px (= `step - tab_h` ≈ 44 − 34 = 10 px + algo del borde y padding; el cálculo de `step` es `tab_h + sliver` = 34 + 10 = 44, pero la medición incluye el borde de 1 px arriba del cuerpo y el efecto del padding del deck) |
| Scroll al que cambia el frente 0 → 1 | 1670 |
| Scroll al que cambia el frente 1 → 2 | 2570 |
| Scroll al que cambia el frente 2 → 3 | 3470 |
| Scroll al que cambia el frente 3 → 4 | 4370 |
| Scroll al que cambia el frente 4 → 5 | 5270 |
| Posición final del folder 0 al `p=1` | `y = -220 px` (= `step * 5` = 5 * 44, exacto) |

**375 x 667 (mobile):**

| Medida | Valor |
| --- | --- |
| Cantidad de carpetas | 6 |
| Caja del deck | 343 x 267 px |
| Caja del body de la carpeta al frente | 343 x 267 px (40.03 vh) |
| Caja de la pestaña | 332 x 34 px |
| Tope de 40vh en el cuerpo del frente | sí (267 px = 40.03 vh) |
| Texto recortado en el cuerpo del frente | no, en las 6 carpetas |
| CTA visible dentro del cuerpo | sí, en las 6 carpetas |
| Sliver visible de la pestaña de atrás a `p=0.5` | 33 px |
| Sliver visible del cuerpo de atrás a `p=0.5` | 42 px |
| Scroll al que cambia el frente 0 → 1 | 1380 |
| Scroll al que cambia el frente 1 → 2 | 2047 |
| Scroll al que cambia el frente 2 → 3 | 2714 |
| Scroll al que cambia el frente 3 → 4 | 3381 |
| Scroll al que cambia el frente 4 → 5 | 4048 |

Los valores sub-pixel del scroll se redondean con `Math.ceil` para que la
medición no caiga justo antes de la transición (el scroll es en enteros, y
la teórica cae en `.25` — `Math.round` la mandaba al entero de abajo y
perdíamos la transición).

#### Casos que la spec pedía preservar

- **`prefers-reduced-motion: reduce`** (Chrome flag `--force-prefers-reduced-motion`):
  en `p=0.5` todos los folders tienen `--folder-y: 0px`, `--folder-scale: 1`,
  y la opacidad sigue la tienda `1 - |p/seg - i|`. Folder 2 (el frente a
  `p=0.5`) con `opacity = 0.585`, folder 3 con `0.415`. La carpeta de
  adelante se ve a opacidad alta y la siguiente a opacidad baja, sin
  movimiento.
- **Sin JS** (clase `.js` removida a mano antes de medir): el runway pasa a
  `height: auto` (3854 px en desktop, no `5400`), el sticky vuelve a
  `position: static`, y las carpetas son `position: relative` en flujo
  normal, una debajo de la otra, con espaciado entre ellas (cada una mide
  ~636 px). El contenido nunca queda apilado en un solo punto del DOM.
- **Teclado**: en `p=0` solo `data-flip-card="0"` no tiene `inert`; en
  `p=0.5` solo `data-flip-card="2"` no tiene `inert`. Las carpetas tapadas
  quedan fuera del orden de tabulación.

#### Lo que **no** se pudo medir

- La convergencia exacta del resorte: el script se detiene cuando
  `|target - value| < restDelta && |velocity| < restDelta` (criterio
  `restDelta = 0.0005`). En el browser el resorte tarda ~1.4 s en asentar
  (medido con `scrollTo(0, 5270)` y leyendo `--folder-y` cada 200 ms).
  Después de eso, el frente coincide con el teórico (`floor(p / seg + 1e-9)`).
  Sin un test unitario que mocke el tiempo, esto se mide en navegador.
- El “feel” analógico del resorte (cómo se ve entre frames) es subjetivo y
  no se puede reportar numéricamente.
- El comportamiento con `framer-motion` o cualquier otra librería no se
  probó (regla del sistema: no se instalan).

#### Reglas del v1 retiradas explícitamente

- `rotateX(22deg)` en las tarjetas (plegado 3D) — **eliminado**.
- `transform-origin: 50% 50%` con `rotateX` — **eliminado**.
- `perspective: 800px` en el stage — **eliminado**.
- `aspect-ratio: 1.9` en el stage — **eliminado** (reemplazado por altura
  fija `40vh` con `min()`).
- `width: min(100%, 68rem, …)` en el stage — **eliminado** (reemplazado
  por `min(100%, 80rem, …)` para que la carpeta llene el stage con la
  pestaña y el cuerpo que pide el rediseño).
- `transform: translate3d(0, calc(${yPercent}% + ${stackOffset}px), 0)
  rotateX(${rotateX}deg)` en `.projects-stack__card` — **eliminado**
  (reemplazado por `transform: translateY(var(--folder-y, 0px))
  scale(var(--folder-scale, 1))`).
- `background-color: var(--color-green); color: var(--color-cream);` en el
  panel — **eliminado** (el cuerpo pasa a `cream-light` + texto verde, como
  pide el rediseño).
- `.projects-stack__thumbs` y `.projects-stack__shot--thumb` —
  **eliminados** del markup, los estilos y la lógica de miniatura (la fila
  de dos miniaturas debajo de la grande ya no se renderiza).
- `flipExitPercent()` en `src/lib/flip-stack.ts` — **eliminado** (la
  medida del `-118%` de la referencia no se usa; el nuevo modelo mide
  `step` y `entryOffset` desde el DOM).
- `stackStep`/`restOffset`/`restScale` y la propiedad `exitPercent` del
  `FlipGeometry` — **eliminados** (el modelo nuevo interpola `y` de forma
  continua, sin necesidad de offsets por tarjeta).
- `entryY` y `entryScale` en el `FlipCardState` — **eliminados** (no hay
  panel que crezca desde el borde inferior; el folder entero sube).
- Las transiciones de CSS sobre `rotateX` en `:global(.js) .folder` —
  **ninguna**, el v2 anima `transform` vía CSS variables (compositor).

#### Archivos fuera de las superficies permitidas

**No tocados** (verificado con `git status` y `git diff --stat` antes de
cerrar): `src/styles/global.css`, `src/components/ui/ScreenshotFrame.astro`,
`src/components/Footer.astro`, `src/lib/content.ts`, `astro.config.mjs`,
`package.json`, `tsconfig.json`, y el resto de la app. El botón del footer
y el modificador del duotono del v1 quedaron como estaban.

`image.png` en la raíz del repo: **no modificado, no movido, no commiteado**
(sigue sin trackear; `git status` no lo lista en "Changes to be committed").

### Cierre de la pasada 4 (padre, 24-09)

- **Defecto medido por el padre** (Chrome headless + CDP, `.js` activo,
  `scroll-behavior: auto`, resorte asentado): a `375x667` la pestaña del frente
  quedaba en `y=27` con el navbar de 67 px — el título de la carpeta activa
  debajo del header — y la pila se cortaba contra el navbar.
- **Fix:** `display: block` en el stage y `margin-top` del deck calculado por el
  script centrando la pila:
  `headroom = (n-1)*step`, `raw = (avail - (deckH + headroom))/2 + headroom`,
  `offset = clamp(raw, tabH, max(tabH, avail - deckH))`.
- **Captura mobile acotada:** `clamp(8.5rem, 26vw, 11rem)` (8rem a ≤30rem) con
  `object-fit: cover` y `object-position: top`; índice de caso oculto a ≤30rem
  (decorativo, `aria-hidden`).
- **Medido después del fix:** pestaña en `y=76` a 375x667 y a 320x568 (navbar
  67); `cardBottom` dentro del viewport (615/667, 559/568, 785/900); descripción
  sin recorte (`73/73`, `91/91`, `41/41`); tags y CTA visibles; `deckOffset` 296
  en desktop y 50 en mobile.
- **Tope 40vh:** desktop dentro (360/360 y 320/320). Mobile fuera a propósito:
  410 px a 375x667 (cap 267) y 428 px a 320x568 (cap 227), porque a los pisos de
  legibilidad el contenido no entra en 40vh. Decisión del 24-09: preservar
  contenido antes que tope; queda la mirada del autor en el teléfono.
- Pasada 5 (fix de motion): la salida de la carpeta activa pasa a arrancar en
  el tramo SIGUIENTE (`src/lib/flip-stack.ts`). Antes la carpeta empezaba a
  subir mientras todavía era la del frente y su pestaña —el título— se metía
  debajo del navbar: medido `y=38` con navbar de 67 px en mobile. Después del
  cambio, en 6 posiciones de scroll (0.1 a 0.99) y 2 breakpoints: pestaña del
  frente en `93-109` (mobile, navbar 67) y `364` (desktop, navbar 77),
  `cardFits` siempre true (`634 ≤ 667`, `790 ≤ 900`) y escalón entre asentadas
  exactamente `step` (60 px mobile, 45 px desktop). `astro check` 0/0/0.
- Capturas: `c-desktop.png`, `c-375.png`, `c-320.png` en
  `C:/Users/angel/AppData/Local/Temp/flipshot/`.
- `npx astro check` → 0 errores, 0 warnings, 0 hints (59 archivos).
- **Pendiente:** verificación independiente (cancelada) y los checks de no-JS /
  reduced-motion / teclado con la geometría final, medidos por el escritor en la
  pasada 3.

**No commiteado, no pusheado, no stageado nada**: el padre committea
después de verificar.

Corrección del autor (24-09): la solapa lleva el número del caso
(`Proyecto 01`, `Proyecto 02`…) y el título real vuelve al cuerpo como `h3`.
Cambia la decisión 4 de v2. Medido: escalón 45 px desktop / 43 px mobile,
los 6 casos sin recorte en los 4 breakpoints, solapa del frente siempre bajo el
navbar y tarjeta dentro del viewport.

Corrección del autor (24-09, segunda): piel verde con letras crema (como las
cards del sitio) y el mazo pegado arriba del stage para que el Proyecto 01 no
deje un hueco grande bajo "Casos de éxito". Medido: `bg rgb(14,59,51)` /
`color rgb(241,232,219)`, aire arriba de la solapa del primer folder 26 px
(antes ~310), pila pegada arriba todo el recorrido, tarjeta siempre dentro del
viewport y los 6 casos sin recorte en 1440x900, 1920x1080 y 375x667.
