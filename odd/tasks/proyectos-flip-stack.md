# Feature: Flip stack en `/proyectos` (las tarjetas se dan vuelta al scrollear)

## Estado

Pedido del autor (23-09-2026), textual: aplicar a los casos de la sección de
proyectos la animación del componente `case-study-flip-stack` del registry
`@componentry` de shadcn; no poner las fotos una al lado de la otra (una grande
y dos chicas abajo, o una sola en carrusel); que al hover la foto se agrande y
se ponga a color normal; la foto a la derecha en vez de la izquierda; el tamaño
de las tarjetas a criterio del implementador, basado en la animación.

Referencia: `https://componentry.dev/docs/components/case-study-flip-stack`
(fuente cruda del registry: `https://componentry.dev/r/case-study-flip-stack.json`).

- **Estado:** en implementación.
- **Rama:** por crear (`feat/proyectos-flip-stack`), el árbol hoy está en `master`.
- **Autorización:** el autor pidió los cinco cambios en un mismo mensaje. No hay
  pedido de SDD, así que esto corre como ODD con un solo escritor.

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

## Mecanismo

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

## Alcance

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

## Fuera de alcance

- `Portfolio.astro` (home) y `CaseStudyGallery.astro` (detalle): siguen con el
  duotono fijo y las capturas en fila. El modificador queda listo para
  adoptarlo, pero el autor no lo pidió ahí.
- El carrusel de una sola captura.
- Instalar `framer-motion` o cualquier librería de animación (regla del sistema
  de diseño: "no instalar librerías de animación").
- Grillas de 8 columnas, colores por tarjeta, sombras y degradés de la
  referencia.

## Criterios de aceptación

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

## Tareas

- [ ] `src/lib/flip-stack.ts` con la matemática
- [ ] La sección: markup, estilos y script del mazo
- [ ] El revelado al hover en el marco de captura y el primitivo
- [ ] El botón del footer a la columna de la izquierda
- [ ] Docs de las dos features tocadas
- [ ] Verificación: `astro check`, build, matemática en Node y HTML/CSS emitidos

## Evidencia

Pendiente.
