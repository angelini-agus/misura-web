# Feature: el preload xilográfico (BOTTEGA impreso)

## Objetivo

El preload de la home es una **xilografía**: la pantalla arranca cubierta por la
tinta (verde bottega liso, sin nada más), ese plato baja hasta la cara del taco, el
taco se levanta, golpea seco sobre el lino y se queda presionando mientras la tinta
pasa a la fibra. Después se despega inclinándose como lo haría un artesano. Abajo
queda impreso **BOTTEGA**.

Reemplaza a la escena del hierro con llamas (que el autor descartó: "es muy rápido
todo y no se entiende lo de las llamas"). La referencia histórica es una bottega
italiana del siglo XV/XVI: estampado artesanal con taco de madera sobre papel de
lino.

**La vista es cenital y en primera persona**: el taco es un rectángulo visto desde
arriba y su altura se cuenta con dos cosas, nada más: la escala (1 abajo, 1,42
arriba) y la sombra, que pasa de ancha y difusa a pegada y dura. No hay dibujo: el
taco es un bloque sólido y toda la información la dan las sombras de altura, la
física del golpe y la textura de la tinta.

## Paleta

| Pieza | Color |
| --- | --- |
| Lino | `#F2ECE1` (a tres puntos del crema del sitio: invisible en el relevo) |
| Plato, taco e impresión | `var(--color-green)` = **`#0E3B33`**, el verde de la marca |

**Una sola tinta.** El plato que cubre la pantalla al arranque, el bloque y la
palabra impresa son el MISMO color. Es la decisión que ordena la escena: el plato
aterriza sobre la cara del taco sin que se vea una costura, el masazo no tiene que
cambiar ningún color y el relevo conserva el verde del hero. Las sombras también
son de la tinta (`color-mix` sobre `--tinta`): nunca grises.

## Decisiones

1. **Una sola idea por vez.** El ritmo se arregló repartiendo los 2,75s en menos
   cosas simultáneas: verde pleno (0,45s), contracción (0,4s), carga (0,13s), golpe
   (0,12s), presión (0,45s), despegue (0,7s) y relevo (0,42s). Antes había cuatro
   cosas a la vez en 2,4s y por eso se sentía apurado.
2. **El taco no rebota como un sello de goma.** Se queda presionando 0,44s y se
   comprime a `scale(0,995)`: el gesto manual es el de transferir la tinta a la
   fibra, no el de estampar y salir.
3. **El despegue pivotea en la esquina de abajo a la izquierda** (`transform-origin:
   18% 88%`) y se levanta con `rotateX(5deg) rotateY(-7.5deg) scale(1.18)`,
   `blur(1px)` y una traslación corta: es un bloque que se levanta desde un borde.
   **Se sostiene OPACO hasta los 2,03s** y recién ahí se disuelve, en 215ms: con el
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
   aterriza en la caja exacta del taco, que el script escribe como las cuatro
   medidas del `clip-path`. El taco espera **abajo y a escala 1** debajo del plato:
   por eso el aterrizaje es un recorte sobre su caja y no hay ni un píxel que
   alinear.
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

## Línea de tiempo (2,75s)

| t | Fase | Qué se ve |
| --- | --- | --- |
| 0 → 0,45 | **Verde pleno** | El plato cubre la ventana: verde bottega liso y nada más. El taco espera debajo, a escala 1 y sin sombra |
| 0,45 → 0,85 | La contracción | El plato baja hasta la caja del taco (curva que arranca rápido y asienta). Alrededor aparece el lino y su fibra |
| 0,85 → 0,98 | **La carga** | El taco se levanta: `scale(1)` → `scale(1.42)` y la sombra se abre, ancha y difusa. El plato escala con él |
| 0,98 → 1,1 | **El masazo** | `scale(1.42)` → `scale(1)` en 120ms con curva seca, la sombra pasa a mínima y dura, y la tinta deja la cara del taco (el plato se apaga en el mismo cuadro) |
| 0,98 | El mazo | El lino da un sacudón seco de 1,5px en 190ms |
| 1,1 → 1,55 | Presión | `scale(1)` → `scale(0,995)`: el taco sigue apoyado, sin rebotar |
| 1,55 → 2,03 | Despegue sólido | Pivotea desde un borde y se levanta: `rotateX(5deg) rotateY(-7.5deg) scale(1.18)`, `blur(1px)`, sin disolverse todavía |
| 2,03 → 2,25 | Se disuelve | `opacity` 1 → 0 en 215ms con curva de entrada: el bloque se va y queda la marca, sin velo |
| 2,3 → 2,72 | Relevo | El lino se enrolla hacia arriba con un `clip-path` y deja a la vista el hero |

## Verificación

| Chequeo | Resultado |
| --- | --- |
| `npx astro check` | 0 errores, 0 warnings, 0 hints (67 archivos) |
| `npm run build` | 11 páginas, limpio |
| La impresión contra el wordmark del hero | **Idénticas**: 377,289 · 685×192 las dos (la caja del hero medida por offset acumulado) |
| El verde de las tres piezas | `rgb(14, 59, 51)` leído del DOM en el plato, el taco y la impresión: el mismo `#0E3B33` |
| El arranque | Cinco píxeles del cuadro 0 (720,120 · 120,450 · 1320,450 · 720,780 · 720,450): los cinco `14,59,51`. Ni un borde de lino |
| El aterrizaje del plato | A 850ms el `clip-path` computado es `inset(259px 348px 389px 347px)` = la caja del taco (347..1092 × 259..511). Muestreado 4px afuera de cada borde: lino; 4px adentro: tinta |
| La sincronía de la carga | A 980ms, la escala del plato y la del taco leídas del DOM: **1,41998 las dos**, y los dos pivotes resuelven al mismo punto (481,1 · 480,76) |
| Los cuadros | 18 fases en `%TEMP%/hero-shot/preload2/` (montaje `fases-preload2.png`) capturadas con la ceremonia **congelada** por la Web Animations API (`pause()` + `currentTime`): cuadro exacto, sin sondear. Arnés: `%TEMP%/hero-shot/preload2.cjs` |
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

- **El costo**: 2,75s de ceremonia por sesión, sin salteo. La primera pintura la
  define el plato (verde pleno, 0,45s), no el hero.
- **El velo del despegue**: con el taco del mismo verde que la impresión, cualquier
  opacidad parcial sobre el crema da un verde lechoso que no es de la paleta. Se
  acota a los últimos 215ms. Si el autor quiere cero velo, la salida es correr el
  bloque fuera del cuadro (una traslación de ~700px, su propio ancho) en vez de
  disolverlo: la marca aparecería por el canto del bloque, letra por letra.
