# Riel de scroll propio (solo desktop)

## Por qué existe

La barra nativa se corta visualmente en el borde de cada sección (el fondo alterna
crema y verde) y no queda pegada al borde real de la ventana. Este riel es
`position: fixed`, **opaco** y vive fuera del contenido de las páginas, así que se ve
igual sobre cualquier superficie. En mobile no se activa nada: sigue la barra nativa
del sistema, sin cambios.

## Cómo se calcula

```js
docH   = document.documentElement.scrollHeight    // alto del contenido
viewH  = window.innerHeight
railH  = rail.clientHeight                        // alto del riel (fixed, viewport)
thumbH = clamp(railH * (viewH / docH), 28, railH) // mínimo 28px de pieza
travel = railH - thumbH
maxY   = docH - viewH
y      = clamp(scrollY / maxY, 0, 1) * travel     // mapeo lineal 1:1
```

Las métricas se miden en carga, en `resize`, al cambiar el estado del media query y
cuando el documento cambia de alto (`ResizeObserver` sobre el `body`): **nunca** en el
evento de scroll. Por frame solo corre la aritmética y se escribe
`transform: translate3d()`; nada de `top` ni `margin`.

- El scroll es `window` (el documento) con `{ passive: true }`, y la actualización se
  encola con `requestAnimationFrame`: como máximo una por frame.
- Detección de desktop: `matchMedia("(min-width: 48rem)")`, el mismo corte que usa el
  sitio para el header sticky. La barra nativa se oculta con la clase `has-rail` que
  agrega el script: si el JS no corre, la nativa queda intacta (mejora progresiva).
  El CSS de ocultado respeta el criterio de `global.css`: la vía webkit para
  Chromium/Safari y la estándar solo bajo `@supports not selector(::-webkit-scrollbar)`.
- Arrastre del thumb y click en el riel con pointer events (con captura, en `try` para
  los eventos sintéticos). El arrastre usa `behavior: "instant"` para responder 1:1;
  el click usa `smooth`, salvo con `prefers-reduced-motion`.

## Medido en la página real (1440x1080, home)

| chequeo | resultado |
| --- | --- |
| riel | 10 x 1080, x = 1424 (pegado al borde derecho), borde izquierdo de 1px verde |
| thumb | 127px = railH x (1080 / 9180), con el mínimo de 28 |
| posición del thumb | solo `transform: translate3d()`: `top` y `margin` en 0, y el `cssText` no tiene otra propiedad de posición |
| seguimiento | a 0 %, 50 % y 95 % del scroll: delta 0px contra el esperado |
| CLS al ocultar la nativa | `clientWidth` y ancho del body idénticos con y sin la clase (delta 0) |
| arrastre | scrollY de 0 a 1700 arrastrando el thumb 200px |
| click en un tramo libre del riel | salta al punto clickeado; si el click cae sobre el thumb, inicia un arrastre |
| mobile 375x667 | sin la clase, riel `display: none`, la nativa intacta |

## Ciclo de vida (View Transitions)

`astro:page-load` inicializa, `astro:before-swap` limpia (listeners, frame, observer) y
`astro:after-swap` repone la clase del `<html>`, porque el router la pisa en cada
navegación con la del HTML servido. Es el mismo problema que tenía la clase `js`.

## Estética

Riel crema opaco de 10px con marcas de regla cada 8px y una marca larga cada 40px,
dibujadas con dos `repeating-linear-gradient` de hard stops. Thumb verde macizo, ancho
completo, esquinas rectas, sin transición, con una línea crema de 1px en cada extremo.
Sin gradientes suaves, sin sombras, sin radius.
