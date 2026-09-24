# Textura de fondo del sitio

## Decisión

Puntos en cada intersección de una grilla de **64 px**, con la tinta de la marca al
**4 %** de opacidad. Se comparó contra la variante de líneas finas en `grid-demo.html`
(48 y 64 px, sobre crema y sobre verde) y se midió cada trazo con `getImageData` sobre
capturas reales: las dos variantes dan la **misma tinta** (delta de luminancia 7,43
sobre 255), pero una línea continua se lee como grilla y un punto es un evento
aislado, así que el punto pesa mucho menos en pantalla. Cambiar de variante, de
tamaño o de opacidad es tocar una sola variable.

## Implementación (`src/styles/global.css`)

- Tres variables en `:root`: `--grid-step: 64px`, `--grid-alpha: 4%`,
  `--grid-ink: var(--color-green)`.
- El patrón es un `radial-gradient` con **hard stops** (de color a transparente en el
  mismo punto) repetido: no puede producir banding, y con `background-attachment:
  scroll` (el valor por defecto) no se recalcula al scrollear. Sin SVG, sin imagen
  rasterizada, sin JS, sin Canvas.
- La trama se pinta **encima** del color de fondo, en el mismo elemento, así que no
  hace falta un pseudo-elemento ni tocar el layout:
  `:is(html, body, .bg-cream, .bg-green, .folder__body, .folder__tab)`.
- **Inversión automática**: una sola regla da vuelta la tinta en las superficies
  verdes, `:is(.bg-green, .folder__body, .folder__tab) { --grid-ink: var(--color-cream) }`.
  Ningún componente lleva clases de la trama: para sumar una superficie verde nueva
  alcanza con agregarla a esa lista, en un solo lugar.

## Medido en la página real

| qué | valor |
| --- | --- |
| tinta sobre crema | `color(srgb 0.0549 0.2314 0.2 / 0.04)` |
| tinta sobre verde | `color(srgb 0.9451 0.9098 0.8588 / 0.04)` |
| delta de luminancia del punto | **7,43 sobre 255** (≈3 %), igual sobre crema y sobre verde |
| tamaño del punto | marca de 2×2 px CSS; a DPR 2 se rasteriza en 4×4 de dispositivo |
| grilla | los puntos repiten exactos cada 64 px (verificado en píxeles) |
| banding | imposible con hard stops; en una ventana plana de 64×64 el rango de luminancia da 0 fuera de los puntos |
| alta densidad | probado a DPR 1, 1,5 y 2: el trazo se entinta parejo, sin bordes degradados |
| costo en scroll | `background-attachment: scroll`, sin JS: no se recalcula al scrollear |

## Detalle aceptado

El patrón de cada elemento arranca en su propia caja, así que las grillas de dos
superficies contiguas no están perfectamente en fase. A 4 % no se percibe, y la
alternativa que las alinearía (`background-attachment: fixed`) es justamente la que
sí cuesta en el scroll, así que queda descartada a propósito.

## Comparador

`grid-demo.html` en la raíz del repo (sin trackear) tiene las dos variantes por
espaciado y por fondo, con la opacidad como variable. Es descartable.
