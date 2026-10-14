# Feature: el preload xilográfico (BOTTEGA impreso)

## Objetivo

El preload de la home es una **xilografía**: la pantalla arranca cubierta por la
tinta (verde bottega liso, sin nada más), ese plato baja hasta el contorno del taco
(que es una pieza de tronco, no una caja), el taco se levanta, golpea seco sobre el
lino y se queda presionando mientras la tinta pasa a la fibra. Después se despega
inclinándose como lo haría un artesano. Abajo queda impreso **BOTTEGA**.

Reemplaza a la escena del hierro con llamas (que el autor descartó: "es muy rápido
todo y no se entiende lo de las llamas"). La referencia histórica es una bottega
italiana del siglo XV/XVI: estampado artesanal con taco de madera sobre papel de
lino.

**La vista es cenital y en primera persona**: el taco es una tabla plana vista
desde arriba y su altura se cuenta con dos cosas, nada más: la escala (1 abajo, 1,42
arriba) y la sombra, que pasa de ancha y difusa a pegada y dura. La tabla es un
rectángulo con los extremos chaflanados (como un listón): la cara es plana, del
verde de la marca calentado con un poco de lino, sin veta, sin nudos, sin catedral,
sin vetas oscuras. Sin corteza, sin mango, sin texturas. No hay dibujo: el taco es un
bloque sólido y toda la información la dan las sombras de altura, la física
del golpe y la textura de la tinta.

## Paleta

| Pieza | Color |
| --- | --- |
| Lino | `#F2ECE1` (a tres puntos del crema del sitio: invisible en el relevo) |
| Plato, impresión y taco | `var(--color-green)` = **`#0E3B33`**, el verde de la marca: una sola tinta, la pieza no se aclara después del masazo |

**Una sola tinta.** El plato que cubre la pantalla al arranque, la pieza y la
palabra impresa son el mismo verde. Es la decisión que ordena la escena: el
plato aterriza sobre el contorno de la pieza sin que se vea una costura, el
masazo no tiene que cambiar ningún color de tinta y el relevo conserva el verde
del hero. La pieza no se aclara después del masazo: antes y después es siempre
el mismo verde plano. Las sombras también son de la tinta (`color-mix` sobre
`--tinta`): nunca grises.

## Decisiones

1. **Una sola idea por vez.** El ritmo se arregló repartiendo los 3s en menos cosas
   simultáneas: verde pleno (0,45s), contracción (0,4s), **pausa (0,3s)**, carga
   (0,13s), golpe (0,12s), presión (0,45s), despegue (0,7s) y relevo (0,42s). Antes
   había cuatro cosas a la vez en 2,4s y por eso se sentía apurado.
2. **El taco no rebota como un sello de goma.** Se queda presionando 0,44s y se
   comprime a `scale(0,995)`: el gesto manual es el de transferir la tinta a la
   fibra, no el de estampar y salir.
3. **El despegue pivotea en la esquina de abajo a la izquierda** (`transform-origin:
   18% 88%`) y se levanta con `rotateX(5deg) rotateY(-7.5deg) scale(1.18)`,
   `blur(1px)` y una traslación corta: es un bloque que se levanta desde un borde.
   **Se sostiene OPACO hasta los 2,33s** y recién ahí se disuelve, en 215ms: con el
   taco del mismo verde que la impresión, cualquier opacidad parcial sobre el crema
   da un verde lechoso que no es de la paleta, así que el velo se acota a un cuadro
   y lo que el ojo lee es "el bloque se fue, la marca quedó".
4. **La impresión es el wordmark del hero, calcado** (corrección del autor: "debería
   ser exactamente la misma que queda después en el hero, esas letras, sin efectos
   y sin marco sin nada"). Usa las clases reales de la marca —`wordmark
   wordmark-hero`— así que el glifo, el peso, el interletrado, el `clamp` del
   tamaño y hasta el color son los del sitio por construcción. **Sin** filtro de
   xilografía, **sin** poros, **sin** hundido, **sin** filete y **sin** animación de
   asentado. Consecuencia: la caja de la impresión y la del wordmark coinciden
   exactas (377,289 · 685×192 las dos), así que al destaparse la marca no se mueve
   un píxel.
5. **El carácter de impresión lo dan el taco y el lino**, no la tinta: las sombras
   de altura, la física del golpe, el despegue y la fibra del papel. Es donde el
   autor dijo que está la magia.
7. **El plato abre la escena** (pedido del autor: "que esté toda la pantalla verde
   bottega, ese rectángulo se achique al tamaño de la tabla y de ahí que pegue el
   masazo"). El plato es una capa del color de la tinta, del tamaño de la ventana:
   el primer pintado de la home es verde liso. A los 450ms arranca la contracción y
   aterriza en el contorno exacto del taco, que el script arma leyendo el `d` del
   `clipPath` de la madera. El taco espera **abajo y a escala 1** debajo del plato:
   por eso el aterrizaje es un recorte sobre su forma y no hay ni un píxel que
   alinear, y el verde que se contrae ya tiene la forma del tronco.
8. **El plato y el taco escalan juntos.** Durante la carga y el masazo los dos van
   de 1 a 1,42 y vuelven, con el mismo pivote físico (el `18% 88%` del taco, medido
   en la ventana): si se movieran por separado, el plato dejaría de cubrir la cara
   del bloque. Medido: **1,41998 las dos**.
6. **El taco tapa el logo**: el bloque mide 30px más por lado que la impresión y la
   impresión cae exactamente en la caja del wordmark del hero (medida por offset
   acumulado, inmune a `data-reveal`), así que el destape ocurre donde después vive
   la marca.
9. **La ceremonia no se ve dos veces**: el `<head>` (`BaseLayout.astro`, clase
   `has-burn`) decide según la marca de sesión, el hash y el movimiento reducido, y
   el componente resuelve el cuarto caso (una recarga con scroll restaurado).
10. **Se revisa por URL**: `?burn=1` fuerza la ceremonia (ignora las cuatro
    condiciones) sin escribir la marca de sesión, así que se puede repetir
    recargando; `?burn=lento` la corre a 0,3x con `updatePlaybackRate`, que es la
    única forma de medir con precisión una línea de tiempos con un golpe de 120ms.
    El corte por movimiento reducido **no** aplica cuando viene forzada.
11. **La pieza es una tabla plana del mismo verde que la tinta, no un tronco**
    (pedido del autor con una foto de un listón de madera como referencia: "hacélo
    más facha el tronco... sacale la crosta todo, pero que quede algo más realista,
    madera curada"; después "después de pegar el masazo el taco se transforma en
    madera, no quiero, que quede siempre liso"; y "no aclares el color del taco
    después del martillazo tampoco"). El taco es un SVG con el contorno en un
    `clipPath` de ocho vértices: un rectángulo con los cuatro extremos chaflanados
    en 45° (los "bordes redondeados"). La cara es plana: un solo `rect` del mismo
    verde de la marca que el plato y la impresión, sin veta, sin nudos, sin
    catedral, sin vetas oscuras, sin corteza, sin mango, sin anillos, sin
    filtros, sin texturas. Así el taco no se transforma en madera después del
    masazo y no se aclara: antes y después es siempre el mismo rectángulo plano
    del verde de la marca.
12. **El plato copia el contorno.** El script lee el `d` del `clipPath` y arma con él
    dos `clip-path: path()`: el que tapa la ventana (el contorno escalado sobre su
    propio centro hasta pasar los cuatro bordes) y el que cae sobre la madera. Entre
    los dos, el plato se contrae y se vuelve tronco.
13. **La madera son trazos, no texturas.** La veta (diez cúbicas con ondulaciones
    suaves), la catedral (cuatro arcos), los nudos (cuatro elipses y un anillo) y
    las vetas oscuras (tres trazos) son todos paths y elipses de SVG: cero filtros
    por cuadro, cero turbulencias, cero `feDisplacementMap`. Con el cambio
    desaparecieron el `feTurbulence` del poro y el `clipPath` anidado del corte
    transversal, y el primer pintado de la ceremonia bajó de ~340 a **~260ms**:
    la madera **era** parte del costo, a diferencia del rediseño anterior donde no
    lo era. Ver Verificación.
14. **La pausa (1,3).** La contracción llega a la madera y la escena se queda quieta
    300ms antes de la carga. Es el único tramo en el que no se mueve nada, y es lo
    que hace que el golpe se sienta como un golpe.

## Línea de tiempo (3s)

| t | Fase | Qué se ve |
| --- | --- | --- |
| 0 → 0,45 | **Verde pleno** | El plato cubre la ventana: verde bottega liso y nada más. El taco espera debajo, a escala 1 y sin sombra |
| 0,45 → 0,85 | La contracción | El plato baja hasta el contorno del tronco (curva que arranca rápido y asienta). Alrededor aparece el lino y su fibra |
| 0,85 → 1,15 | **La pausa** | No pasa nada: la tinta está sobre la madera y la escena se queda quieta. Es el aire que pidió el autor antes del golpe |
| 1,15 → 1,28 | **La carga** | El taco se levanta: `scale(1)` → `scale(1.42)` y la sombra se abre, ancha y difusa. El plato escala con él |
| 1,28 → 1,4 | **El masazo** | `scale(1.42)` → `scale(1)` en 120ms con curva seca, la sombra pasa a mínima y dura, y la tinta deja la cara del taco (el plato se apaga en el mismo cuadro): aparece la madera |
| 1,28 | El mazo | El lino da un sacudón seco de 1,5px en 190ms |
| 1,4 → 1,85 | Presión | `scale(1)` → `scale(0,995)`: el taco sigue apoyado, sin rebotar |
| 1,85 → 2,33 | Despegue sólido | Pivotea desde un borde y se levanta: `rotateX(5deg) rotateY(-7.5deg) scale(1.18)`, `blur(1px)`, sin disolverse todavía |
| 2,33 → 2,55 | Se disuelve | `opacity` 1 → 0 en 215ms con curva de entrada: el bloque se va y queda la marca, sin velo |
| 2,6 → 3,02 | Relevo | El lino se enrolla hacia arriba con un `clip-path` y deja a la vista el hero |

## Verificación

| Chequeo | Resultado |
| --- | --- |
| `npx astro check` | 0 errores, 0 warnings, 0 hints (67 archivos) |
| `npm run build` | 11 páginas, limpio |
| La impresión contra el wordmark del hero | **Idénticas**: 377,289 · 685×192 las dos (la caja del hero medida por offset acumulado) |
| Los tonos | Leídos del DOM: el plato (la tinta) `rgb(14, 59, 51)`, la tabla `(60, 94, 86)` y los nudos y vetas oscuras `rgb(10, 45, 39)`. La impresión sigue siendo el verde de la marca |
| El arranque | Cinco píxeles del cuadro 0 (720,120 · 120,450 · 1320,450 · 720,780 · 720,450): los cinco `14,59,51`. Ni un borde de lino |
| El aterrizaje sobre el CONTORNO | A 1000ms (la pausa), a 10px de la línea real del tronco y en tres puntos de la arista de arriba: afuera lino (237,231,220), adentro tinta (14,59,51). El plato no es un rectángulo en ninguna parte |
| La madera a la vista | A 1400ms (después del masazo), muestreado en los mismos puntos: `60, 94, 86` = la madera curada de la tabla. Y 14px más adentro, un punto más oscuro, donde cae la sombra de un trazo de la veta |
| La sincronía de la carga | A 1280ms, la escala del plato y la del taco leídas del DOM: **1,41574 las dos**, y los dos pivotes resuelven al mismo punto (481,1 · 480,76) |
| Los cuadros | 18 fases en `%TEMP%/hero-shot/preload2/` (montaje `fases-preload2.png`) capturadas con la ceremonia **congelada** por la Web Animations API (`pause()` + `currentTime`): cuadro exacto, sin sondear. Arnés: `%TEMP%/hero-shot/preload2.cjs` |
| El costo | Medido con `%TEMP%/hero-shot/fps-burn.cjs` (3400ms de rAF a velocidad real): el primer pintado de la ceremonia cuesta **~260ms** y después corre a p95 20ms. Con el lino oculto baja a 218ms, así que la fibra del lino se lleva ~125ms y el resto es el armado del overlay. **La madera era parte del costo**: al pasar la madera de `feTurbulence` a trazos el primer pintado bajó de ~340 a ~260ms |
| Los cuatro casos de skip | Segunda visita, hash y movimiento reducido: `has-burn` ausente. Recarga con scroll restaurado, con una recarga real a 2152px (`reload2.cjs`): `has-burn` ausente |
| `?burn=1` y `?burn=lento` | Sin cambios: el forzado ignora las cuatro condiciones y no escribe la marca de sesión |
| Movimiento reducido + `?burn=1` | Corre a velocidad real: las cuatro animaciones con `currentTime` real (~1117ms) y el taco en opacidad 1 a los ~1,1s. **Era un defecto previo**, no de este cambio |

## La trampa que nos comió TRES veces

**El cuadro implícito de 0%.** Si una propiedad aparece solo en los cuadros
finales, Chrome crea el cuadro de 0% con el valor de base y **interpola en rampa
desde el arranque**. En esta escena pasó con la opacidad del hierro (se
desvanecía antes del masazo) y con la opacidad y el `filter: blur()` del taco (se
veía la impresión a través del bloque, y el bloque se venía desenfocando desde el
primer cuadro). **Regla del proyecto: toda propiedad que cambia al final se declara
también al principio, en cada cuadro hasta el cambio.**

**La lista de transformaciones tiene que coincidir.** Si un cuadro dice
`scale(0,995)` y el siguiente `perspective(900px) rotateX(9deg) scale(1,24)`,
Chrome no interpola función por función: interpola **matrices** y la perspectiva
entra en la cuenta. En el taco todas las listas son `perspective() rotateX()
rotateY() scale() translate()`, aunque al principio valgan la identidad.

**Medir con `waitForFunction` no alcanza.** Para juzgar una línea de tiempos (y
sobre todo el velo de 215ms del despegue) hay que congelar la animación: `pause()`
+ `currentTime` por la Web Animations API da el cuadro exacto. Los sondeos de
puppeteer caen cada ~100ms y lo que se ve en la captura puede ser otro cuadro.

**La regla global de movimiento reducido pisa la ceremonia forzada.**
`global.css` tiene `*, *::before, *::after { animation-duration: 0.01ms !important }`
para el sistema con movimiento reducido, y ese `!important` alcanza también a la
ceremonia forzada por `?burn=1`: **toda la escena pasaba en un cuadro** y el
overlay se retiraba solo (el taco quedaba en su cuadro final, opacidad 0). El
doc lo daba por verificado con un arnés viejo que solo miraba el `display`.
Se arregla en el componente reponiendo la duración de cada pieza con un
`!important` **más específico** que el universal (entre dos `!important` desempata
la especificidad) y con las duraciones en `--burn-total`, `--burn-golpe` y
`--burn-retiro`, para no escribirlas dos veces.

## Abiertos

- **El costo**: 3s de ceremonia por sesión, sin salteo. La primera pintura es el
  plato (verde pleno, 0,45s) y cuesta ~260ms: la fibra del lino se lleva ~125ms
  (medido con el lino oculto: 218 contra 344) y el resto es el armado del overlay.
  Al pasar la madera de `feTurbulence` a trazos el primer pintado bajó de ~340 a
  ~260ms, así que la madera sí era parte del costo. Después de eso la ceremonia
  corre a p95 20ms.
- **El velo del despegue**: con el taco del mismo verde que la impresión, cualquier
  opacidad parcial sobre el crema da un verde lechoso que no es de la paleta. Se
  acota a los últimos 215ms. Si el autor quiere cero velo, la salida es correr el
  bloque fuera del cuadro (una traslación de ~700px, su propio ancho) en vez de
  disolverlo: la marca aparecería por el canto del bloque, letra por letra.
