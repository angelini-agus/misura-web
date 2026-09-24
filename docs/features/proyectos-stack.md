# Feature: Flip stack en `/proyectos`

## Objetivo

Que la lista de casos de `/proyectos` se recorra como un mazo de cartas: cada
caso ocupa una pantalla y, al scrollear, la tarjeta al frente se pliega hacia
arriba para revelar la siguiente. La última tarjeta se queda al final y el
visitante sigue scrolleando hasta el footer.

Referencia externa: `case-study-flip-stack` del registry `@componentry` de
shadcn (`componentry.dev/docs/components/case-study-flip-stack`). Se tomó la
animación y la estructura de la referencia, **no su piel**.

## Decisiones del autor y decisiones derivadas

1. **La animación es la de la referencia:** el mazo queda pegado a la ventana
   (`sticky`), la tarjeta al frente se pliega con `rotateX` mientras se eleva,
   y la tarjeta siguiente sube desde un offset de reposo hasta su plano final.
   Es lo que pidió el autor, no una reinterpretación.
2. **La captura va a la derecha**, el texto a la izquierda (en la versión
   anterior era al revés). En mobile es una sola columna: el texto arriba y la
   captura abajo.
3. **Una captura grande y hasta dos chicas abajo.** No se quiso un carrusel
   por tarjeta: cada carrusel propio sumaba seis controles, más JS y más a11y,
   para mostrar menos capturas que la grilla anterior.
4. **Al hover la captura se agranda y pierde el duotono.** Es el único lugar
   donde el sitio expone el color real de la interfaz; se implementa como
   modificador opt-in del primitivo, no como CSS específico de la sección.
5. **El tamaño de la tarjeta sale de la animación.** La referencia usa un
   tarjeta de 860px de ancho con relación 1.76:1; acá se estira hasta un
   máximo de 68rem con relación 1.9:1, porque la columna derecha carga una
   captura grande más dos chicas (más alto útil que una sola foto) y el texto
   es más largo.
6. **La piel no se copia.** La referencia trae color por tarjeta, sombra y
   degradé sobre la foto. El sistema del sitio es plano: borde de 1px, radio
   de tarjeta, verde y crema. Se toman la animación y la estructura, no el
   skin.
7. **`framer-motion` queda descartado.** El sistema de diseño del sitio
   prohíbe librerías de animación, y la referencia es de las que funcionan con
   `framer-motion`. Se tradujo a un `requestAnimationFrame` propio con un
   resorte integrado a mano.

## Mecanismo

### Estructura

```
section
  intro (eyebrow + título + descripción)        <- ya existía, no cambia
  runway    alto: n * 100dvh                     <- el carrete del scroll
    sticky  position: sticky; top: 0; alto: 100dvh; overflow: clip
      stage  ancho/alto de la tarjeta + perspective 800px + container de cqw
        card x n   absolutas, inset 0, z-index decreciente
          panel   la caja visible (borde, verde, crema) que sube en la entrada
            copy | shots   una columna en mobile, grilla 2 en desktop
```

El runway mide `n * 100dvh` y no `(n + 1) * 100dvh` como la referencia. Con la
fórmula de la referencia la última tarjeta se plegaba y el mazo terminaba con
la ventana vacía; con `n * 100dvh` la última tarjeta queda al frente al final
del scroll y el visitante sigue avanzando hasta el footer.

### Matemática (un tramo por tarjeta)

Sean `n` la cantidad de tarjetas, `m = max(n - 1, 1)` y `seg = 1 / m`. El
progreso `p` del carrete vale 0 cuando el borde superior del runway toca el
borde superior de la ventana y 1 cuando su borde inferior toca el borde
inferior.

Por tarjeta `i`:

- **Salida** (todas menos la última): tramo `[i * seg, min((i + 1) * seg, 1)]`.
  - `y%` de 0 a -118.
  - `rotateX` de 0 a 22 grados.
  - `stackOffset` de 0 a `i * min(24, 72 / m)` px (apilado del mazo).
- **Entrada** (todas menos la primera): tramo
  `[max(0, i * seg - seg), i === 0 ? 0 : min(i * seg, (i - 1) * seg + 0.7 * seg)]`.
  - `scale` del panel de `1 - min(i * 0.012, 0.035)` a 1.
  - `y` del panel de `min(i * 12, 34)` px a 0.

La entrada empieza antes que la salida: la tarjeta de abajo termina de subir a
su plano cuando la de arriba empieza a plegarse.

Origen de la transformación: el card (el que se pliega) al 50% 50%; el panel
(el que sube) al 50% 100%, para que crezca desde el borde inferior como un
mazo real apoyado sobre la mesa.

### Resorte

El progreso pasa por un resorte con `stiffness 120`, `damping 22`, `mass 0.8`
y `restDelta 0.0005`. La integración es explícita (una iteración por frame)
dentro de un `requestAnimationFrame`. Lo importante es que el rAF **solo corre
mientras el resorte no se asento**: cuando el visitante deja de scrollear
sobre la sección, el frame loop se apaga y la capa de GPU queda libre. El
scroll alimenta el listener pasivo, coalescido por rAF para no escribir más de
una vez por frame.

El script mide el `dt` real entre frames y lo clampea a `1/30s` (33 ms). Sin
ese tope, una pestaña que vuelve del background entrega un `dt` de varios
segundos y el resorte salta al target por una sola integración.

### Movimiento reducido

Con `prefers-reduced-motion: reduce` no hay plegado ni entrada: el mazo avanza
por opacidad (la tarjeta al frente se desvanece sobre la siguiente). Los
botones de las tarjetas tapadas siguen fuera del orden de tabulación. Regla de
la casa: neutralizar el movimiento, nunca quitar la función.

### Teclado

Las tarjetas tapadas llevan `inert`, así sus botones no son alcanzables por
tab. La tarjeta activa es `flipFront(p) = clamp(round(p / seg), 0, n - 1)`:
la que está al frente del mazo en ese momento. Al scrollear la atención de
teclado pasa a la siguiente tarjeta; sin `inert` el foco caía en botones que
no se ven.

### Sin JS

Sin JS el carrete se desarma: el runway pasa a `height: auto`, el sticky
deja de pegarse y las tarjetas se acomodan como una lista vertical. Es el
mismo patrón que usa `[data-reveal]` en `global.css`: todo el mecanismo vive
debajo de la clase `.js` del `<html>` (la pone `BaseLayout.astro` cuando el
módulo del cliente carga). El contenido nunca queda apilado en un solo punto
del DOM si el JS no carga.

### Tamaño de la tarjeta

- **Desde `48rem`:** el ancho es `min(100%, 68rem, (100dvh - navbar - 4rem) * 1.9)`
  y el alto sale de `aspect-ratio 1.9`. El tope de `100dvh` mantiene la
  tarjeta entera en pantalla con 4rem de aire (el navbar arriba y el asomo
  del mazo abajo). A 1440px de ancho la tarjeta mide 1088x572.
- **Por debajo de `48rem`:** una columna, ancho `min(100%, 30rem)`, alto
  `min(100dvh - navbar - 4rem, 40rem)`. Sólo la captura grande entra (las dos
  chicas no caben en el alto útil de un celular manteniendo el mosaico
  legible).
- **Capa compuesta:** `will-change: transform` se prende y se apaga con la
  clase `.projects-stack--moving`, gestionada por el script. El mazo en
  reposo no deja capas de GPU prendidas.
- **Tipografía:** `container-type: inline-size` en el stage, así `1cqw` es el
  1% del ancho del stage y no de la ventana. La tarjeta manda, no el ancho
  del navegador. Los `clamp` de tamaño llevan un piso en `rem` para que la
  tipografía no se achique a cero en una ventana chica.

### Capturas

- **Grande:** relación 16:10 (la relación modal de las capturas del repo: las
  fuentes más visibles del mazo son 1600x1000 y 1440x900). Las capturas que
  salen de esa proporción (las del caso de limpieza, ~2.08:1) se recortan un
  poco a los costados vía `object-cover` con `object-position: top`: el
  contenido crítico de esas capturas está centrado verticalmente y se
  preserva.
- **Chicas:** dos en una fila, también 16:10, cada una con la mitad del ancho.
- **Una sola captura** (`landing-empresa-limpieza`): la grande queda centrada
  en la columna derecha (el `justify-content` del contenedor la centra). Es
  el único caso con ese aire de más.
- **Dos capturas:** la segunda ocupa la celda izquierda de la fila de thumbs.
  El mosaico se lee intencional y no desborda el alto de la columna.
- **Nunca tres en una fila:** el patrón del mazo es siempre una grande arriba
  y hasta dos chicas abajo.

### Hover sobre una captura

Cuando el visitante hace hover sobre una captura del mazo, el modificador
opt-in del marco la agranda un 4.5% y le quita el duotono. Es el único lugar
donde el sitio expone el color real de la interfaz. La transición cruza sólo
`transform` y `filter` (compositor); con `prefers-reduced-motion: reduce` se
neutraliza el zoom pero el cambio de color sigue.

## Datos

Todo el contenido sale de `src/lib/content.ts`. No se inventó copy:

- las capturas del `gallery` del caso (se cortan a tres: una grande y hasta
  dos chicas),
- el cliente, el título y la descripción SEO,
- los tags de `technologies`,
- el destino `/proyectos/<slug>`.

## Alcance

- `src/components/ProjectsStack.astro`: la sección entera (markup, estilos
  scoped y script del mazo).
- `src/lib/flip-stack.ts`: la matemática del mazo como funciones puras, sin
  DOM, para poder verificarla con Node.
- `src/components/ui/ScreenshotFrame.astro`: prop `hover` para activar el
  modificador de revelado.
- `src/styles/global.css`: el modificador de revelado del primitivo del
  duotono.

## Fuera de alcance

- `Portfolio.astro` (home) y `CaseStudyGallery.astro` (detalle): siguen con
  el duotono fijo. El modificador queda listo para adoptarlo, pero el autor
  no lo pidió ahí.
- El carrusel de una sola captura.
- Instalar `framer-motion` o cualquier librería de animación.
- Grillas de ocho columnas, colores por tarjeta, sombras y degradés de la
  referencia.
- El cambio acompañante del footer (botón «Contanos tu caso» en la columna
  izquierda): vive en otro commit y otro archivo.

## Decisiones que se descartaron

- **`(n + 1) * 100dvh` como runway:** la referencia lo hace así, pero acá la
  última tarjeta se plegaría y la ventana quedaría vacía al final. Por eso se
  usa `n * 100dvh` y la última tarjeta nunca se pliega, sólo sube desde su
  reposo hasta quedar al frente.
- **El color por tarjeta:** la referencia trae un acento distinto para cada
  caso. El sitio es plano: borde de 1px, radio de tarjeta, verde y crema en
  todas. Se descartó el color por tarjeta por consistencia visual.
- **`framer-motion`:** el sistema prohíbe librerías de animación. Se tradujo
  la animación a un rAF propio con resorte, sin dependencias externas.

## Criterios de aceptación

1. En `/proyectos`, cada caso es una tarjeta que se pliega hacia arriba al
   scrollear y deja ver la siguiente; la última se queda al final del scroll.
2. La captura grande va a la derecha del texto en desktop y arriba del texto
   en mobile, con hasta dos chicas abajo en desktop. Ninguna fila de tres.
3. Al hover sobre una captura, se agranda y muestra el color real de la
   interfaz; al salir vuelve al duotono.
4. La tarjeta entra entera en la ventana desde `48rem` y en celulares bajos
   por debajo.
5. Con `prefers-reduced-motion: reduce` no hay plegado: el mazo avanza por
   opacidad.
6. Sin JS, los seis casos se leen como una lista vertical.
7. Los botones de las tarjetas tapadas no son alcanzables por teclado.
8. `npx astro check` y `npm run build` pasan; el HTML y el CSS emitidos
   contienen la estructura nueva y los nombres de clase esperados.

## Tareas

- [x] `src/lib/flip-stack.ts` con la matemática
- [x] La sección: markup, estilos y script del mazo
- [x] El revelado al hover en el marco de captura y el primitivo
- [x] Los docs de las dos features tocadas
- [ ] Verificación: `astro check`, build, matemática en Node y HTML/CSS
      emitidos

## Evidencia

- `npx astro check`: 0 errors, 0 warnings, 0 hints (59 archivos).
- `npm run build`: 11 páginas construidas sin errores.
- Matemática verificada en Node con `flipGeometry(6)` y
  `flipCardState(progress, i, geometry, reduceMotion)`: cada segmento mide
  `0.2`, el `stackStep` es `14.4`, el offset de reposo de la última tarjeta
  es `34` px y su escala es `0.965`. A `p = 0` las tarjetas 1..5 tienen
  `entryScale < 1` y `entryY > 0` (el mazo asoma); a `p = 1` la tarjeta 5
  queda en `yPercent = 0`, `entryY = 0`, `entryScale = 1`, mientras las
  anteriores tienen `yPercent = -118` y `rotateX = 22`. El resorte converge de
  0 a 1 en menos de 120 frames de `1/60` y reporta `settled`.
- HTML emitido en `dist/proyectos/index.html` y CSS emitido en
  `dist/_astro/*.css`.
