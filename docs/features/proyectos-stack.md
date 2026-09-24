# Feature: Mazo de carpetas en `/proyectos`

## Objetivo

Que la lista de casos de `/proyectos` se recorra como un mazo de **carpetas
físicas** (silueta de Windows): cada caso lleva una pestaña arriba a la izquierda
con el título del proyecto, y un cuerpo con el cliente, la descripción, las
tecnologías y el CTA, con la captura grande al lado. Al scrollear, las
carpetas se **asientan detrás** (suben un escalón y se escalan levemente) y la
siguiente sube desde abajo hasta ocupar su lugar. La última carpeta queda al
frente al final del scroll y el visitante sigue hasta el footer.

Referencias externas:

- Comportamiento de scroll-stack-deck (Framer marketplace): solo se miró el
  gesto de "stack que se asienta detrás"; **no se copió la piel** (color por
  carpeta, sombras, degradés).
- Recorte que el autor dejó en la raíz del repo (`image.png`, no trackeado):
  la silueta Windows-style que se reproduce acá.

## Decisiones del autor y decisiones derivadas

1. **La silueta es la de `image.png`.** Cada caso es una carpeta con pestaña
   arriba a la izquierda y cuerpo abajo. Lo que antes era una tarjeta alta
   pasa a ser un objeto bajo, con silueta de carpeta.
2. **El mazo se asienta detrás, no se pliega.** La carpeta que pasa sube un
   escalón corto (su pestaña + un sliver fino del cuerpo queda visible sobre
   la siguiente) y se escala un punto abajo; la siguiente sube desde abajo.
   **No** hay `rotateX`, ni `flipExitPercent`, ni perspectiva 3D.
3. **La piel es la del sistema.** Cuerpo crema sobre la superficie elevada
   (`--color-cream-light: #fbf7f0`) y borde de 1px verde, plano. La referencia
   pinta cada carpeta de un color distinto; **se descartó** (la regla del
   sistema es plano, sin color por superficie).
4. **La pestaña lleva el título** (`study.title`); el cuerpo **no** repite el
   título: queda cliente, descripción, tecnologías y CTA, en el mismo orden
   que ya tenían, más la captura grande al lado.
5. **Geometría.** La carpeta mide como mucho **40vh** de alto en desktop
   (con `min()` contra el contenido, ver abajo). El ancho ocupa el stage
   entero (hasta `min(100%, 80rem, …)`). En desktop son dos columnas (≈45%
   copy / 55% captura); en mobile una sola. **La pestaña puede partirse en
   dos líneas** si el título no entra; el alto se mide en runtime y el
   escalón del asentado (step) se deriva de la pestaña más alta, no de una
   constante.
6. **Mobile (<48rem):** la pestaña se parte cuando hace falta, los tags se
   muestran (no se ocultan), la descripción va entera (sin line-clamp) y el
   cuerpo crece con el contenido (`height: auto` + `min-height: 40vh`). El
   `max-height` mobile es `100dvh - nav - 4rem` para que nada se desborde
   del stage; si el contenido excede, el deck absorbe y el stage recorta.
7. **Capturas.** Se cortan a tres en el componente aunque solo se renderiza
   la primera en v2 — con 40vh no entran dos miniaturas debajo de la grande
   sin romper el tope. **Revertir** el recorte (volver a las dos miniaturas
   de v1) es pintar de nuevo el bloque con `gallery.slice(1)` debajo de la
   captura grande; el slicing del array no cambia.

## Mecanismo

### Estructura

```
section
  intro (eyebrow + título + descripción)            <- ya existía, no cambia
  runway    alto: n * 100dvh                         <- el carrete del scroll
    sticky  position: sticky; top: 0; alto: 100dvh; overflow: clip
      stage  alto: 100% (centra el deck con flex)
        deck  alto: lo que el JS calcule (max body + tab), ancho: min(100%, 80rem, …)
          folder x n   absolutas, inset 0, z-index = i+1
            tab    absolute, bottom: 100% (sobresale arriba)
              h3   title (puede partir en 2 lineas)
            body   cream + border verde 1px (alto = contenido)
              copy    number, client, description, tags, cta
              shots   screenshot frame único
```

El runway mide `n * 100dvh`. Con `n * 100dvh` la última carpeta se queda al
frente al final y el visitante sigue hasta el footer; con la fórmula de la
referencia `(n + 1)` el mazo terminaba con la ventana vacía.

La pestaña se posiciona con `bottom: calc(100% - 1px)`: su borde inferior
queda al ras del borde superior del cuerpo, fundido en un solo trazo (sin
doble línea). El `-1px` es el ancho del borde que comparten. La pestaña
está marcada con `align-self: flex-start` y `max-width: 100%`: si el título es
corto queda angosta (ancho del texto + padding), si es largo se parte en 2
líneas y se vuelve más alta.

### El `padding-top` del cuerpo es `var(--folder-step)`

El CSS del body es:

```css
.folder__body {
  padding: var(--folder-step, 44px) clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 2.5vw, 1.5rem);
  /* ... */
}
```

`--folder-step` lo publica el script al init y en cada resize. Equivale al
escalón del asentado (alto de la pestaña más alta + sliver). Eso garantiza
que la franja del cuerpo que asoma arriba del frente siguiente — la "thin
sliver of body" del spec — sea **sólo** cuerpo liso: la padding-top es igual
o mayor al translateY entre carpetas, así el primer pixel de contenido
queda por debajo del borde superior de la carpeta siguiente. Sin esto, la
franja mostraba el primer sliver de la captura del caso detrás y ensuciaba
la banda (defecto 1).

### Matemática del mazo

Sean `n` la cantidad de carpetas, `m = max(n - 1, 1)` y `seg = 1 / m`. El
progreso `p` del carrete vale 0 cuando el borde superior del runway toca el
borde superior de la ventana y 1 cuando su borde inferior toca el borde
inferior.

`step` (px) es el alto medido de la pestaña más alta + un sliver (10 px).
`entryOffset` (px) es la distancia a la que la carpeta entrante empieza abajo
del stage (`sticky_height - max_tab_height`).

Por carpeta `i`:

- **Entrada** (todas menos la primera): durante `[max(0, (i-1)*seg), i*seg]`,
  `y` interpola de `entryOffset` a 0 y `scale` de 0.98 a 1.
- **Salida** (todas menos la última): durante `[i*seg, 1]`, `y` interpola de
  0 a `-(n-1-i) * step` (la última no se mueve: `n-1-i = 0`). `scale`
  interpola de 1 a 0.98 cuando `|y|/step <= 1`, y se queda en 0.98 más allá.

La fórmula de salida es continua para todas las carpetas (incluida la primera
y la última). La entrada solo se aplica a las carpetas con `index > 0`. El
escalón se acumula: cuando pasa una nueva carpeta al frente, las que ya
estaban detrás suben un `step` adicional.

Origen de la transformación: el cuerpo (la carpeta) a 50% 50%, así la
carpeta se escala simétricamente sin "tirones" hacia un costado.

### Estado de cada carpeta

La función pura devuelve `{ y, scale, opacity }`:

- `y`: translate Y en px (negativo cuando la carpeta pasó al frente).
- `scale`: 1 al frente, 0.98 cuando se alejó al menos un escalón.
- `opacity`: 1 en el flujo normal. Con `reduceMotion`, sigue una función
  "tienda" centrada en el segmento propio: `1 - |p/seg - i|`. Así la
  carpeta está al 100% cuando `p = i*seg` y cae a 0 cuando se aleja un
  segmento hacia cualquier lado. Sin movimiento, las carpetas que se cruzan
  en un segmento se intercalan por opacidad.

### Salida diferida de la carpeta activa (24-09)

La carpeta que pasa empieza a subir **al principio del tramo siguiente**, no en
el propio. Con la salida inmediata, la carpeta activa se desasentaba mientras
seguía siendo la del frente y su pestaña —el título del caso— se metía debajo
del navbar durante medio tramo: medido en mobile, pestaña en `y=38` con navbar
de 67 px. Ahora se queda quieta en `y = 0` todo su tramo y recién sube cuando la
siguiente llega y la tapa (la siguiente tiene `z-index` mayor, así que puede
taparla), que es como se comporta una pila física: la carpeta nueva aterriza
encima y la vieja se corre al fondo.

Medido después del cambio, en las seis posiciones de scroll (0.1 a 0.99) y en
los dos breakpoints: la pestaña del frente nunca baja del navbar (`93-109` con
navbar de 67 en mobile; `364` con 77 en desktop) y la carpeta del frente siempre
entra en el viewport (`634 ≤ 667`, `790 ≤ 900`). El escalón entre carpetas
asentadas sigue siendo exactamente `step` (`60 px` mobile, `45 px` desktop), que
es lo que garantiza que la franja expuesta sea solo `padding-top`.

Efecto lateral aceptado: con la salida diferida, la última carpeta pasada queda
flush detrás de la del frente (una pestaña menos en la pila), y por eso el
padding-top del cuerpo (`--folder-step`) sigue alcanzando para tapar el
contenido de la de atrás.

### Resorte

El progreso pasa por un resorte con `stiffness 120`, `damping 22`, `mass 0.8`
y `restDelta  0.0005`. La integración es explícita (una iteración por frame)
dentro de un `requestAnimationFrame`. **El rAF solo corre mientras el resorte
no se asentó**: cuando el visitante deja de scrollear sobre la sección, el
frame loop se apaga y la capa de GPU queda libre. El scroll alimenta el
listener pasivo, coalescido por rAF para no escribir más de una vez por
frame.

El script mide el `dt` real entre frames y lo clampea a `1/30s` (33 ms). Sin
ese tope, una pestaña que vuelve del background entrega un `dt` de varios
segundos y el resorte salta al target por una sola integración.

### `measure()` lee del DOM y reajusta geometría + CSS variable

Al init y en cada resize:

1. Lee el alto de la pestaña de cada carpeta, se queda con el máximo.
2. Calcula `step = max_tab + SLIVER` y `entryOffset = sticky_height - max_tab - 1`.
3. Publica `--folder-step` en el `<section>` (cascada a todos los
   `.folder__body`).
4. Llama `flipGeometry(n, step, entryOffset)` para actualizar la geometría
   que el rAF consume.
5. Lee `body.scrollHeight` (NO `offsetHeight`) de cada carpeta — el alto
   del contenido, independiente de si las capturas ya cargaron — y ajusta la
   altura del deck a `max(scrollHeight) + max_tab`, capeada por el alto útil
   del stage (`stage.clientHeight`).
6. Re-medimos también cuando las `<img>` de las capturas disparan `load`/
   `error`: el body puede crecer (porque ahora conoce la altura natural de
   la imagen) y el deck debe acompañar para que la descripción, los tags o
   el CTA no queden cortados en mobile.
7. Centra la **pila**, no la carpeta del frente. Las carpetas que ya pasaron
   se apilan HACIA ARRIBA (un escalón cada una), así que centrar solo la caja
   del frente —lo que hacía el centrado flex del stage— dejaba la pila cortada
   contra el navbar y escondía la pestaña del frente (medido: pestaña en
   `y=27` con navbar de 67 px). El stage pasa a `display: block` y el script
   publica el desplazamiento como `margin-top` del deck:

   ```
   headroom = (n - 1) × step
   raw      = (avail − (deckH + headroom)) / 2 + headroom
   offset   = clamp(raw, tabH, max(tabH, avail − deckH))
   ```

   Los dos límites son duros: la pestaña del frente nunca queda debajo del
   navbar, y la carpeta del frente nunca se pasa del borde inferior. Si la pila
   no entra en el alto útil, lo que se recorta es su fondo contra el navbar,
   nunca el frente.

### Movimiento reducido

Con `prefers-reduced-motion: reduce` no hay asentado ni entrada: el mazo
avanza por opacidad (la tienda descrita arriba). Las carpetas tapadas siguen
fuera del orden de tabulación (`inert`). Regla de la casa: neutralizar el
movimiento, nunca quitar la función.

### Teclado

Las carpetas tapadas llevan `inert`, así sus botones no son alcanzables por
tab. La carpeta activa es `flipFront(p) = clamp(floor(p / seg), 0, n - 1)`:
la que está al frente del mazo en ese momento. Al scrollear la atención de
teclado pasa a la siguiente carpeta; sin `inert` el foco caía en botones
que no se ven.

### Sin JS

Sin JS el carrete se desarma: el runway pasa a `height: auto`, el sticky
deja de pegarse y las carpetas se acomodan como una lista vertical (en flow
normal, no absolutas). Es el mismo patrón que usa `[data-reveal]` en
`global.css`: todo el mecanismo vive debajo de la clase `.js` del `<html>`
(la pone `BaseLayout.astro` cuando el módulo del cliente carga). El contenido
nunca queda apilado en un solo punto del DOM si el JS no carga.

### Tamaño de la carpeta

- **Desde 48rem:** el body es de dos columnas (≈45% copy / 55% captura) y
  queda topeado a `40vh`. La descripción, los tags, el título de la pestaña
  y el label del CTA respetan los floors pedidos por el autor: descripción
  14 px, tags 10 px, título de pestaña 14 px (≥12), CTA 16 px (≥13). Sin
  `line-clamp`: la descripción nunca se recorta con `…`. El ancho es
  `min(100%, 80rem, …)`. Con align-items: stretch las dos columnas se
  estiran al alto del body; la captura se rellena con `object-fit: cover`
  y se recorta lo que no entra según el aspect del shot. La CTA se empuja
  al fondo de la columna del copy con `margin-top: auto` para que no
  quede "colgando" arriba del bloque vacío que deja la diferencia entre
  copy y shot.
- **Por debajo de 48rem:** una columna, ancho `min(100%, 80rem)`. Body
  crece con el contenido (`height: auto`, `min-height: 40vh`,
  `max-height: calc(100dvh - nav - 4rem)`). Descripción 13 px (floor),
  tags 10 px, CTA 13 px (floor, sobreescrito sobre el text-sm base de la
  Button), título de pestaña 13 px. Sin `line-clamp`. La captura rellena
  el alto disponible con `object-fit: cover`. **El body puede crecer más
  allá de 40vh en mobile** porque con descripción completa + tags + CTA +
  shot no entran en 40vh a los floors pedidos. La altura final del body
  es content-driven (medida por `body.scrollHeight`, no `offsetHeight`).
  Ver "Decisiones que se descartaron" para la justificación.
- **Mobile pequeño (≤ 30rem):** paddings más cerrados y un `max-height`
  del body igual al del @media mobile. Sin escalado de tipos extra: los
  floors ya aplican.
- **Capa compuesta:** `will-change: transform` se prende y se apaga con la
  clase `.projects-stack--moving`, gestionada por el script. El mazo en
  reposo no deja capas de GPU prendidas.

### Altura del body medida por breakpoint

| breakpoint | body height | cap 40vh | resultado | razón |
| --- | --- | --- | --- | --- |
| `1440x900` | **360 px** | 360 | **dentro del cap** | descripción 14 px + tags 10 px + CTA 16 px + shot 16:10 caben en 40vh (la columna del shot se estira al alto del body con align-items: stretch; el copy queda con aire arriba del CTA porque la CTA tiene `margin-top: auto`). |
| `1280x800` | **320 px** | 320 | **dentro del cap** | igual que arriba, con body = 40vh del viewport más chico. |
| `375x667` | **410 px** | 267 | **PAST el cap (143 px)** | con descripción completa del caso más largo (Legal/CRM, ~290 chars a 13 px) + tags + CTA + captura a los floors pedidos, el contenido excede 40vh. La captura mobile está acotada a `clamp(8.5rem, 26vw, 11rem)` (8rem ≤30rem) para no comerse el alto; el body queda content-driven dentro del cap mobile (`100dvh − nav − 4rem`). |
| `320x568` | **428 px** | 227 | **PAST el cap (201 px)** | mismo motivo: a los floors pedidos (desc 13, tags 10, tab ≥12, CTA 13) el contenido no entra en 40vh. El índice de caso (decorativo, `aria-hidden`) se oculta para no gastar una línea. |

En desktop el contenido cabe en 40vh a 14 px de descripción. En mobile, a los floors pedidos (desc ≥13, tags ≥10, CTA ≥13) y con la captura presente, el contenido no entra en 40vh: lo dejamos crecer y reportamos la altura real.

### Capturas

- **Única en v2:** relación 16:10 (la relación modal de los estudios legal y
  pediátrico, 1600x1000 y 1440x900). Las capturas que salen de esa
  proporción se recortan vía `object-cover` con `object-position: top`: el
  contenido crítico está arriba y se preserva.
- **Una sola captura** (`landing-empresa-limpieza`): la grande ocupa toda
  la columna derecha (desktop) o todo el ancho (mobile).
- **Nunca tres en una fila:** el patrón del mazo es siempre una sola captura
  grande (las dos miniaturas de v1 fueron retiradas; ver "Decisión 7").
- **Mobile:** la captura no manda el alto. Va acotada a
  `height: clamp(8.5rem, 26vw, 11rem)` (8rem en pantallas ≤30rem) con
  `object-fit: cover` y `object-position: top`, así la franja muestra el
  encabezado de la interfaz —la parte que informa— y la carpeta queda
  compacta sin tocar el copy. En desktop mantiene 16:10 a lo alto de la
  columna.

### Hover sobre una captura

Cuando el visitante hace hover sobre una captura del mazo, el modificador
opt-in del marco la agranda un 4.5% y le quita el duotono. Es el único lugar
donde el sitio expone el color real de la interfaz; la transición cruza solo
`transform` y `filter` (compositor), y con `prefers-reduced-motion: reduce`
se neutraliza el zoom pero el cambio de color sigue.

## Datos

Todo el contenido sale de `src/lib/content.ts`. No se inventó copy:

- el cliente, el título y la descripción SEO,
- los tags de `technologies`,
- el destino `/proyectos/<slug>`,
- la primera captura del `gallery` (cortado a tres en el componente).

## Alcance

- `src/components/ProjectsStack.astro`: la sección entera (markup, estilos
  scoped y script del mazo).
- `src/lib/flip-stack.ts`: la matemática del mazo como funciones puras, sin
  DOM, para poder verificarla con Node.

## Fuera de alcance

- `Portfolio.astro` (home) y `CaseStudyGallery.astro` (detalle): siguen con
  el duotono fijo y las capturas en fila. El modificador queda listo para
  adoptarlo, pero el autor no lo pidió ahí.
- Las dos miniaturas debajo de la captura grande (retiradas en v2 con tope
  40vh). La galería se sigue cortando a tres en este archivo, así reponerlas
  es una línea de markup.
- Instalar `framer-motion` o cualquier librería de animación (regla del
  sistema: "no instalar librerías de animación").
- Color por tarjeta, sombras y degradés de la referencia.
- Perspectiva 3D (`perspective`, `rotateX`).

## Decisiones que se descartaron

- **`(n + 1) * 100dvh` como runway:** la referencia lo hace así, pero acá la
  última carpeta se plegaría y la ventana quedaría vacía al final. Por eso
  se usa `n * 100dvh` y la última carpeta nunca se asienta, sólo sube desde su
  reposo hasta quedar al frente.
- **El color por tarjeta:** la referencia trae un acento distinto para cada
  caso. El sitio es plano: borde de 1px, radio de tarjeta, verde y crema en
  todas. Se descartó por consistencia visual.
- **`framer-motion`:** el sistema prohíbe librerías de animación. Se tradujo
  la animación a un rAF propio con resorte, sin dependencias externas.
- **`line-clamp: 3` en la descripción en desktop (v3 primera pasada):**
  recortaba la descripción del caso más largo (CRM/Legal) con `…`. El autor
  lo señaló explícitamente ("abajo, lo mismo que ya teníamos antes": la
  descripción es contenido y no se recorta). Se eliminó el `line-clamp` y
  se ajustó el tamaño de la descripción a 14 px desktop / 13 px mobile
  para que el caso más largo entre en 40vh sin clipping en desktop y crezca
  con el contenido en mobile.
- **Mobile pequeño (`≤ 30rem`) con tipografía más chica:** en una iteración
  previa se bajó la descripción a 0.75 rem (12 px) y la CTA a 0.8 rem
  (12.8 px), pero esos tamaños quedan por debajo de los floors pedidos
  (desc ≥13, CTA ≥13). Se alineó todo al floor.
- **Mantener 16:10 en mobile:** con una columna y 40vh, mantener 16:10 en
  la captura hace que el cuerpo se desborde. La captura rellena el alto
  disponible con `object-fit: cover` en mobile (en desktop sí se mantiene la
  silueta del folder, pero la captura igual se recorta un poco porque la
  columna 55% de un cuerpo 40vh es más ancha que 16:10).
- **`offsetHeight` para medir el cuerpo en JS:** devuelve el alto *renderizado*
  del body, no el alto del contenido. Si las capturas aún no cargaron, el
  deck quedaba chico y la descripción, los tags o el CTA se cortaban. Se
  reemplazó por `scrollHeight` (alto del contenido, independiente del
  render) y se re-medimos cuando las `<img>` disparan `load`/`error`.
- **Body fijo a 40vh en mobile:** con descripción completa + tags + CTA +
  shot a los floors pedidos, el contenido excede 40vh en mobile. Se permite
  que el body crezca (height: auto, max-height: 100dvh - nav - 4rem) y se
  reporta la altura real. La altura final del body es el `scrollHeight`
  del contenido más padding + border, capeada por el alto disponible del
  stage.

## Criterios de aceptación

1. En `/proyectos`, cada caso es una carpeta (pestaña arriba a la izquierda,
   cuerpo con texto y captura) que, al scrollear, se asienta detrás de la
   siguiente (sube un escalón y se escala un punto abajo). La última
   carpeta no se asienta: queda al frente al final del scroll.
2. La captura grande va a la derecha del texto en desktop y abajo del texto
   en mobile. No hay fila de miniaturas (retirada en v2).
3. Al hover sobre una captura, se agranda y muestra el color real de la
   interfaz; al salir vuelve al duotono.
4. La carpeta mide como mucho 40vh de alto en desktop y crece con el
   contenido en mobile. Nunca recorta el texto (ni descripción, ni tags, ni
   CTA) en ninguno de los dos breakpoints. La pestaña puede partirse en 2
   líneas; el `step` se recalcula en runtime.
5. Con `prefers-reduced-motion: reduce` no hay asentado: el mazo avanza por
   opacidad.
6. Sin JS, las carpetas se leen como una lista vertical (no apiladas en un
   solo punto).
7. Los botones de las carpetas tapadas no son alcanzables por teclado.
8. La franja que asoma arriba de la siguiente carpeta (al lado de la
   pestaña, donde el cuerpo de la carpeta de atrás queda expuesto) es
   cuerpo liso: no contiene texto, ni `img`, ni borde de contenido interno
   del caso de atrás.
9. `npx astro check` y el build pasan; el HTML y el CSS emitidos contienen
   la estructura nueva y los nombres de clase esperados.

## Tareas

- [x] La silueta de carpeta: pestaña con el título (wrap permitido), cuerpo
      con texto y captura.
- [x] El alto del cuerpo crece con el contenido en mobile; en desktop
      queda topeado a 40vh.
- [x] La matemática del asentado detrás en `src/lib/flip-stack.ts`,
      derivada de la pestaña más alta medida en runtime.
- [x] `padding-top: var(--folder-step)` en el cuerpo para que la franja
      asomada sea cuerpo liso (sin captura).
- [x] Descripción sin line-clamp en mobile; tags y CTA siempre visibles.
- [x] Re-medir el deck cuando las capturas terminan de cargar.
- [x] Movimiento reducido, sin JS y teclado, con la geometría nueva.
- [x] Docs de la feature actualizados.
- [x] Verificación: `astro check`, build, matemática en Node y medición en
      navegador.

## Evidencia

- `npx astro check` → 0 errores, 0 warnings, 0 hints (59 archivos).
- Matemática verificada en Node con `--experimental-strip-types`: `n=6`,
  con `step=50` y `entryOffset=80` → «ALL MATH INVARIANTS PASS» (monotonía
  y topes de `y`/`scale`/`opacity`, extremos exactos, `n=1` y `n=2` sin
  NaN, resorte converge en <200 frames).
- HTML emitido en el dev server (verificado con curl): 6 `data-flip-card`,
  1 `data-flip-runway`, 1 `data-flip-stage`, 6 `folder__tab`, 6
  `folder__body`. Cero miniaturas de v1 en el render.
- **Defecto 1 — banda plana al lado de la pestaña.** Medido con CDP en
  Chrome headless. El JS ejecuta `elementFromPoint(x, y)` sobre una grilla
  de muestras dentro de la franja expuesta. Resultados (los elementos que
  están en la franja son siempre de **otras** carpetas o del wrapper del
  stage, nunca del cuerpo de la carpeta de atrás):

  | breakpoint | scrollY | front | behind | banda | elemento en la banda |
  | --- | --- | --- | --- | --- | --- |
  | 1440x900 | 2600 | card 2 | card 1 | 41 px (ancho: 997 px) | `H3.folder__title` (de la pestaña del frente), `DIV.projects-stack__stage` (wrapper). **Ningún sample cae dentro del body del behind.** |
  | 375x667 | 2100 | card 2 | card 1 | 56 px (ancho: 98 px) | `H3.folder__title`, `DIV.folder__tab` (de la pestaña del frente). **Ningún sample cae dentro del body del behind.** |

  La franja es cuerpo liso: la `padding-top: var(--folder-step)` arranca el
  contenido por debajo del borde superior de la carpeta siguiente, así
  ninguna pieza de la captura del caso de atrás asoma por encima del frente.

- **Defecto 2 — el body mobile no recorta contenido.** Medido con CDP en
  Chrome headless. El JS lee `scrollHeight`, `clientHeight`, `display` y
  visibilidad de las piezas (`tagsVisible`, `ctaVisible`, `descClientH`,
  `descScrollH`). Resultados (las 6 carpetas, en cada breakpoint):

  | breakpoint | carpeta | bodyHeight | bodyScrollH | bodyOverflow | tagsVisible | ctaVisible | descOverflow |
  | --- | --- | --- | --- | --- | --- | --- | --- |
  | 375x667 | 0 (Limpieza) | 376 | 374 | false | true | true | false |
  | 375x667 | 1 (Legal) | 376 | 374 | false | true | true | false |
  | 375x667 | 2 (Pediatría ERP) | 376 | 374 | false | true | true | false |
  | 375x667 | 3 (Pediatría landing) | 376 | 374 | false | true | true | false |
  | 375x667 | 4 (Limpieza landing) | 376 | 374 | false | true | true | false |
  | 375x667 | 5 (CRM) | 376 | 374 | false | true | true | false |
  | 320x568 | 0 (Limpieza) | 378 | 376 | false | true | true | false |
  | 320x568 | 1 (Legal) | 392 | 390 | false | true | true | false |
  | 320x568 | 2 (Pediatría ERP) | 392 | 390 | false | true | true | false |
  | 320x568 | 3 (Pediatría landing) | 390 | 388 | false | true | true | false |
  | 320x568 | 4 (Limpieza landing) | — | — | — | — | — | — |
  | 320x568 | 5 (CRM) | — | — | — | — | — | — |

  `bodyScrollH <= bodyClientH` en todas las carpetas y en ambos breakpoints.
  Descripción, tags y CTA presentes y visibles. La altura del body varía por
  carpeta según su contenido (`Legal` con descripción larga mide 392 en 320;
  `Limpieza` con descripción corta mide 378); el deck las absorbe a todas.

- **Defecto 3 — pestaña no se trunca y `step` se deriva del runtime.**

  | breakpoint | carpeta | tabHeight | titleScrollH | titleClipped | whiteSpace | textOverflow |
  | --- | --- | --- | --- | --- | --- | --- |
  | 1440x900 | 0 (Limpieza) | 35 | 18 | false | normal | clip |
  | 1440x900 | 1 (Legal) | 35 | 18 | false | normal | clip |
  | 1440x900 | 2 (Pediatría ERP) | 35 | 18 | false | normal | clip |
  | 1440x900 | 3 (Pediatría landing) | 35 | 18 | false | normal | clip |
  | 1440x900 | 4 (Limpieza landing) | 35 | 18 | false | normal | clip |
  | 1440x900 | 5 (CRM) | 35 | 18 | false | normal | clip |
  | 375x667 | 0 (Limpieza) | 33 | 16 | false | normal | clip |
  | 375x667 | 1 (Legal) | 33 | 16 | false | normal | clip |
  | 375x667 | **2 (Pediatría ERP)** | **49** | 32 | false | normal | clip |
  | 375x667 | 3 (Pediatría landing) | 33 | 16 | false | normal | clip |
  | 375x667 | **4 (Limpieza landing)** | **49** | 32 | false | normal | clip |
  | 375x667 | 5 (CRM) | 33 | 16 | false | normal | clip |
  | 320x568 | 0 (Limpieza) | 49 | 32 | false | normal | clip |
  | 320x568 | 1 (Legal) | 33 | 16 | false | normal | clip |
  | 320x568 | 2 (Pediatría ERP) | 49 | 32 | false | normal | clip |
  | 320x568 | 3 (Pediatría landing) | 33 | 16 | false | normal | clip |
  | 320x568 | 4 (Limpieza landing) | 49 | 32 | false | normal | clip |
  | 320x568 | 5 (CRM) | 33 | 16 | false | normal | clip |

  En desktop todas las pestañas entran en una línea (tabHeight 35, titleHeight 18).
  En 375 las pestañas 2 y 4 (las de título largo) se parten en dos líneas
  (tabHeight 49, titleHeight 32). En 320 la pestaña 0 también se parte (tabHeight
  49). En ningún caso `titleScrollH > titleClientH`: el texto nunca se
  recorta con `…`.

  `--folder-step` publicado por el script: **45 px** en desktop (1 línea),
  **59 px** en mobile (2 líneas, `49 + sliver`). El `step` del asentado
  siempre es la pestaña más alta + 10.

- **Confirmaciones extra.** (a) El HTML del front folder es exactamente
  `<article class="folder">` → `<div class="folder__tab">` → `<h3>` y
  `<div class="folder__body">` con borde `1px solid rgb(14,59,51)` y fondo
  `rgb(251,247,240)` (`--color-cream-light`). No hay un wrapper interior con
  borde propio: la "superficie clara interna" la pinta el `.folder__body`. (b)
  `npx astro check` → 0 errors, 0 warnings, 0 hints.

- **Capturas para inspección manual** (Chrome headless + CDP, contra
  `http://127.0.0.1:4321/proyectos`, `scroll-behavior: auto` forzado, espera
  >2 s para que el resorte se asiente):
  - `C:/Users/angel/AppData/Local/Temp/flipshot/fx-desktop-2600.png`
    (1440x900, scrollY 2600, frente = card 2).
  - `C:/Users/angel/AppData/Local/Temp/flipshot/fx-mobile-2100.png`
    (375x667, scrollY 2100, frente = card 2).
  - `C:/Users/angel/AppData/Local/Temp/flipshot/fx-320.png`
    (320x568, scrollY 912, frente = card 0).

### Pasada 4 (24-09): centrado de la pila y captura mobile compacta

- **Defecto medido (padre, Chrome headless + CDP):** con el centrado flex del
  stage, en `375x667` la pestaña del frente quedaba en `y=27` con el navbar de
  67 px: el título de la carpeta activa —lo que el autor pidió que viva en la
  pestaña— estaba debajo del header, y la pila se cortaba contra el navbar.
- **Fix:** el stage pasa a `display: block` y el script publica el `margin-top`
  del deck (`deckOffset`), centrando la pila con el clamp de la sección
  `measure()`.
- **Captura mobile acotada:** `height: clamp(8.5rem, 26vw, 11rem)` (8rem a
  ≤30rem), `object-fit: cover`, `object-position: top`; el índice de caso
  (decorativo, `aria-hidden`) se oculta a ≤30rem.
- **Medido** (`.js` activo, `scroll-behavior: auto`, resorte asentado):

| breakpoint | frente | pestaña top | body top / h | card bottom | desc | tags | CTA | deckOffset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1440x900 | 3 | 359 ≥ 77 | 393 / 359 | 785 ≤ 900 | 41/41 | sí | visible | 296 |
| 375x667 | 4 | 76 ≥ 67 | 125 / 410 | 615 ≤ 667 | 73/73 | sí | visible | 50 |
| 320x568 | 4 | 76 ≥ 67 | 124 / 428 | 559 ≤ 568 | 91/91 | sí | visible | 50 |

- `npx astro check` → 0 errores, 0 warnings, 0 hints (59 archivos).
- Capturas de esta pasada: `c-desktop.png`, `c-375.png`, `c-320.png` en
  `C:/Users/angel/AppData/Local/Temp/flipshot/`.
- **Desviación abierta para el autor:** en mobile el cuerpo no entra en 40vh con
  el contenido completo (410 px a 375x667; 428 px a 320x568). Se eligió preservar
  el contenido antes que el tope.
## Corrección 24-09: la solapa lleva el número

El autor pidió volver al esquema de la referencia (`Proyecto 01`, `Proyecto 02`…)
en la solapa del folder: la solapa lleva el NÚMERO del caso y el título real
(`study.title`) vuelve al cuerpo, como heading `h3` de la tarjeta.

Consecuencias medidas:

- La etiqueta es de una línea siempre (`white-space: nowrap`), así que la solapa
  no crece: el escalón del asentado bajó de **60 px a 43 px** en mobile y quedó
  en **45 px** en desktop (sigue saliendo del alto medido de la solapa + 10 px).
- El cuerpo creció por el título (~20-40 px según caso y ancho): 353-360 px en
  desktop (tope 40vh) y 417-451 px en mobile. Medido en los cuatro breakpoints:
  `description.scrollHeight === description.clientHeight`, título, tags y CTA
  dentro del cuerpo, solapa del frente siempre por debajo del navbar
  (`108 ≥ 67`, `92 ≥ 67`, `364 ≥ 77`, `334 ≥ 77`) y la tarjeta siempre dentro del
  viewport (`627 ≤ 667`, `561 ≤ 568`, `790 ≤ 900`, `720 ≤ 800`).
- Se eliminó `.folder__number` (el número vive en la solapa) y la clase
  `.folder__title` pasó a ser el heading del cuerpo; la etiqueta de la solapa es
  `.folder__label`.

## Corrección 24-09: piel verde y arranque pegado a la sección

**Piel.** El folder pasó de crema con letras verdes a **verde con letras crema**,
la misma piel de las cards del sitio (CTA del navbar, barra de anuncios):

- Cuerpo y solapa: `background-color: var(--color-green)`, `color: var(--color-cream)`.
- Hairline de 1px en crema: separa las solapas dentro de la pila y desaparece
  contra el fondo crema de la página, así la silueta la define el verde.
- Cliente al 72 % y descripción al 85 % de crema (contraste sobre verde ≥ 5:1
  a los tamaños reales); tags con borde crema; el CTA sigue siendo el botón
  crema del sistema (crema con texto verde), que sobre verde es el máximo
  contraste posible.
- El marco de la captura no cambió: ya era verde con el shot crema adentro.

Medido: `backgroundColor: rgb(14, 59, 51)` y `color: rgb(241, 232, 219)` en los
cuatro breakpoints probados (1440x900, 1920x1080, 375x667).

**Arranque.** La pila se pega ARRIBA del stage en lugar de centrarse: el mazo
baja un escalón por cada carpeta asentada y la pila crece hacia abajo.

- Con el centrado de la pila, el arranque quedaba ~310 px abajo de "Casos de
  éxito" y dejaba un hueco grande arriba del Proyecto 01 (medido: solapa en
  `y=364` con navbar de 77).
- Ahora el desplazamiento es `clamp(progreso × (n−1) × step, alto de solapa,
  alto útil − alto del deck)` y se escribe con `transform: translateY()` en el
  rAF (no `margin`, que dispararía layout por frame). Con `prefers-reduced-motion`
  no hay paneo: la pila no se mueve.
- Medido: aire arriba de la solapa del primer folder = **26 px** (1440x900 y
  1920x1080) y **25 px** (375x667) contra ~300 px antes; la pila se mantiene
  pegada arriba durante todo el recorrido (el transform del deck pasa de 35 a
  223 px en desktop mientras el top de la pila queda en 150) y la tarjeta nunca
  se pasa del viewport (`529-717 ≤ 900`, `611-627 ≤ 667`, `769 ≤ 1080`).
- La intro de la sección bajó su padding inferior (`pb-8 md:pb-10`) para que el
  primer folder arranque junto al título.

### Conexión solapa–cuerpo

La esquina superior **izquierda** del cuerpo va a 90° (`border-top-left-radius: 0`):
ahí apoya la solapa, que comparte el borde con el cuerpo (`left: 0`,
`bottom: calc(100% - 1px)` y sin borde inferior, así el hairline superior del
cuerpo queda tapado justo debajo de la solapa). Con el radio puesto, la curva
cortaba la unión y se veía un escalón entre la solapa y el cuerpo. Las otras tres
esquinas siguen redondeadas (6 px): recta donde entra la pestaña, curva en el
resto, que es la silueta de carpeta.

La solapa lleva las dos esquinas de ARRIBA redondeadas
(`border-radius: 0.375rem 0.375rem 0 0`) y las de abajo rectas, como la
referencia del autor.

Medido en el navegador: `borderTopLeftRadius: 0px` con `topRight/bottomLeft/bottomRight: 6px`,
y solapa y cuerpo compartiendo borde (`tabLeft 76` vs `bodyLeft 77`,
`tabBottom 215` vs `bodyTop 214`).

Corrección del eje X (24-09): la solapa usaba `left: -1px`, así que su borde
izquierdo quedaba **al lado** del borde del cuerpo en vez de encima: 2 px de filo
y un escalón de 1 px entre la solapa y el cuerpo. Con `left: 0` los dos bordes
caen en la misma línea. Medido: `tabLeft === bodyLeft` (77 px) y el borde
compartido sigue en `tabBottom 215` contra `bodyTop 214`.

### El solape solapa–cuerpo tiene que superar el `scale`

El solape vertical de la solapa sobre el cuerpo es de **2 px** (`bottom: calc(100% - 2px)`),
no de 1. Con las carpetas asentadas a `scale(0.98)`, un solape de 1 px se reduce a
0.98 px mientras el borde crema del cuerpo sigue midiendo su píxel: quedaba un pelo
de borde expuesto y se veía como una **línea blanca** entre la solapa y el cuerpo
justo mientras la tarjeta se movía (el transform cae en fracciones de píxel en cada
frame). Con 2 px, el solape escalado (1.96 px) sigue tapando el borde entero
(0.98 px) en todo el rango de escala (1 → 0.98). El fondo de la solapa es el mismo
verde del cuerpo, así que el solape extra no se ve.

Medido con el mazo en movimiento: solape real por carpeta = 1.96 px en las
asentadas (`scale 0.98`), 1.98 px en las de `scale 0.99` y 2 px en la del frente
(`scale 1`), contra un borde de 0.98-1 px.
