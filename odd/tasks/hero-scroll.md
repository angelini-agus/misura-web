# Feature: hero de scroll con tachado a lápiz

## Objetivo

Reemplazar por completo la segunda sección de la home (`Hero.astro`,
`<section id="inicio">`) por un hero interactivo controlado por el scroll: una
sección larga con un escenario fijo donde van apareciendo los problemas del
negocio y se tachan con lápiz, uno a uno. Cuando están todos tachados, la lista
se borra y aparece **bottega** como la solución, con los botones.

La idea que tiene que transmitir: todo lo que scrolleaste está mal, y esta es tu
salida. Todo reversible: si scrollea hacia arriba, la animación retrocede.

## Lo que NO se toca

La sección 1 (`BrandOpening.astro`, el wordmark grande y la entrada de
diccionario), el header, la barra de anuncio y el logo viajero.

## Decisiones

1. **Sin librerías.** Nada de GSAP ni ScrollTrigger: JS y CSS propios.
2. **No hay loop de scroll compartido que reutilizar.** El proyecto tiene cuatro
   listeners independientes (el logo viajero, el mazo de casos, la scrollbar
   custom y el CTA fijo), cada uno con `passive: true` y coalescing por rAF. Este
   hero es el quinto, con el mismo patrón. Unificar los cinco sería un refactor
   de componentes que hoy funcionan, y queda fuera de este cambio.
3. **`svh` y no `dvh`** para el alto del escenario: así la barra del navegador
   móvil no mueve el progreso mientras se scrollea.
4. **El avance sale de la sección, no de la ventana.** Es la posición de la
   sección contra el recorrido del plan en píxeles, así que el mismo scroll da el
   mismo avance en cualquier alto de ventana.
5. **El wordmark final es un `<span>` de texto**, no el componente del logo ni el
   logo viajero: tiene que seguir existiendo un solo logo lógico en la página.
6. **`CodePanel.astro` se elimina**: solo lo usaba el hero viejo.
7. **El array de problemas es un export nuevo** (`heroProblems`). El export
   `problem` que ya existe es otro contenido, para la sección `Problem` de más
   abajo, y no se toca.
8. **Los ítems van adentro de una libretita.** Un objeto con su propio marco
   (papel más claro que el fondo, borde verde, renglones, línea de margen y
   sombra corrida) en vez de una lista suelta sobre el fondo. Los ítems aparecen
   ahí adentro.
9. **Un ítem ya tachado baja a 0,45.** El texto se apaga cuando el garabato lo
   termina de cruzar y el trazo se queda: la lista se va cerrando de a uno, sin
   un foco que persigue al último tachado. La opacidad va en el label, no en el
   `<li>`, así el renglón de la libretita vive siempre y el trazo no se apaga con
   el texto. (Esta decisión decía lo contrario, «no se apaga»: quedó vieja con el
   garabato de crayón, que es el que trajo el 0,45.)

## Línea de tiempo

Dos fases **seguidas**, nunca superpuestas: primero entran todos los ítems y
recién con la lista completa el lápiz empieza a cruzar, del primero al último. Y
el tachado es **de a uno por vez**: cada garabato termina antes de que arranque
el siguiente, así que en cualquier instante hay un solo trazo dibujándose.

La línea de tiempo está en **píxeles de scroll**, no en fracciones. Cada paso
dura lo que tiene que durar y el **largo del hero sale de la suma**: no hay un
número aparte que mantener en sincronía con los tramos. En mobile todo se escala
por `ESCALA_MOBILE 0.69`, porque un gesto del dedo recorre más que un giro de
rueda.

| tramo | constante | px escritorio | px mobile |
| --- | --- | --- | --- |
| entrada de cada ítem | `ENTRADA_PX` | 300 | 207 |
| paso de la entrada | `ENTRADA_PASO_PX` | 210 | 145 |
| pausa antes del lápiz | `PAUSA_PX` | 156 | 108 |
| garabato de cada ítem | `TACHADO_PX` | 300 | 207 |
| paso del tachado | `TACHADO_PASO_PX` = `TACHADO_PX` | 300 | 207 |
| pausa antes del paso de hoja | `PAUSA_FINAL_PX` | 104 | 72 |
| paso de hoja | `HOJA_PX` | 640 | 442 |
| botones | desde 448, dura `BOTONES_PX` | 220 | 152 |
| **largo de la animación** | la suma de los tramos | **5098** | **3519** |
| remate (queda clavado) | `REMATE_PX` | 480 | 331 |
| **recorrido total de la sección** | animación + remate | **5578** | **3850** |

El **remate** es el pedido "que scrollee un poco más después de que termina": la
animación se queda en el tope (el avance se recorta contra el largo del plan, así
que no pasa nada) y el cuaderno se queda clavado arriba con bottega y el CTA a la
vista durante esos 480px antes de que la página siga bajando. No cuesta trabajo:
el avance no cambia, así que `actualizar()` sale por la comparación de siempre y
no toca el DOM.

El paso de hoja no es un tramo más de la lista: es el **giro entero** de la
página (`GIRO_GRADOS 180`) con `PERSPECTIVA_PX 1600` y el doblez de la punta de
arriba a la derecha (`DOBLEZ_FRACCION 0.26` del ancho de la hoja, en su punto más
alto a `DOBLEZ_PICO 0.22` del paso). El último tramo del giro es el de guardarse:
desde `GUARDAR_DESDE 0.68` la hoja se corre su propio ancho (ver "El paso de
hoja", más abajo).

El paso del tachado es igual a su duración **a propósito**: es la definición de
"de a uno por vez". No hay que corregirlo a un solape "lindo" entre vecinos.

| # | problema | entra | se tacha |
| --- | --- | --- | --- |
| 1 | Planillas de Excel | 0 – 300 | 1926 – 2226 |
| 2 | Carga de datos a mano | 210 – 510 | 2226 – 2526 |
| 3 | Grupos de WhatsApp | 420 – 720 | 2526 – 2826 |
| 4 | Datos sin comprobar | 630 – 930 | 2826 – 3126 |
| 5 | Horas sin control | 840 – 1140 | 3126 – 3426 |
| 6 | Papeles sueltos | 1050 – 1350 | 3426 – 3726 |
| 7 | Sueldos calculados a mano | 1260 – 1560 | 3726 – 4026 |
| 8 | Stock anotado en un cuaderno | 1470 – 1770 | 4026 – 4326 |

En mobile los mismos números por 0,69 (ítem i entra en `145i` y se tacha en
`1330 + 207i`), así que los dos entran y los dos se tachan con el mismo recorrido
por debajo del dedo.

| fase | escritorio | mobile | qué hace |
| --- | --- | --- | --- |
| entrada | 0 – 1770 | 0 – 1222 | los 8 ítems entran uno atrás del otro, con 8px de desplazamiento y opacidad 0 a 1. Nada tachado, y los vecinos se pisan (dos entrando a la vez) |
| pausa | 1770 – 1926 | 1222 – 1330 | la lista entera, limpia y quieta: se lee completa antes de que el lápiz la toque |
| tachado | 1926 – 4326 | 1330 – 2986 | 8 garabatos de 300px, **uno por vez**; cada ítem baja a 0,45 al cerrarse |
| pausa | 4326 – 4430 | 2986 – 3058 | todo quieto, la lista completa y tachada |
| paso de hoja | 4430 – 5070 | 3058 – 3500 | la hoja se levanta del lomo, se dobla en la punta de arriba a la derecha, pasa el canto y termina **guardándose detrás de la página impresa**. Del otro lado ya está bottega impreso, así que se revela solo |
| botones | 4878 – 5098 | 3367 – 3519 | el CTA llega encadenado al final del giro (opacity, blur y 10px de asentamiento) |
| remate | 5098 – 5578 | 3519 – 3850 | todo quieto: el cuaderno clavado arriba con bottega y el CTA, antes de que la página siga |

**El giro va de 0 a 180 grados y la hoja no se funde.** Hasta los 90 grados se ve
la cara de la hoja (la lista tachada) creciendo hacia el lector por la
perspectiva; en el canto queda una astilla de unos 30px y a partir de ahí
`backface-visibility: hidden` la deja invisible, que es lo que hace una hoja de
verdad cuando ya está del otro lado. Por eso no hay ningún `opacity` en la hoja:
el relevo es geométrico.

**Y termina detrás de la página, no tirada a la izquierda.** El giro de 180 deja
la hoja espejada sobre el lomo, o sea del lado izquierdo del cuaderno, que es
donde quedaba antes y es lo que el usuario reportó el 14-10. Desde
`GUARDAR_DESDE 0.68` del paso de hoja la hoja se corre **su propio ancho** en el
espacio ya girado (el eje X local apunta al revés, así que `translateX(-ancho)` la
mueve +ancho en pantalla): aterriza justo encima de la página impresa, que es
opaca, y como la hoja va con `z-index: -1` va desapareciendo detrás de ella a
medida que se corre. Medido al final del recorrido: giro -180°, corrimiento
-544px (el ancho de la hoja), `z-index` -1 en la hoja y en la cara de atrás, y
solamente el anillo, una cara y el CTA a la vista. La hoja se guarda, no se funde.

La cara de atrás se ve apenas pasa el canto, así que va adelante de la página
impresa (`z-index: 1`) hasta que arranca el tramo de guardarse; ahí se va atrás y
la página la tapa. Y el doblez se apaga (`opacity: 0`) pasado su pico: aplastado a
ancho 0 igual pintaba su sombra difusa, y esa mancha quedaba afuera del cuaderno
con la hoja ya guardada.

**El hero se acortó el 14-10, y esto revierte un pedido anterior.** El usuario
pidió acelerar el tachado ("tarda mucho, es muy larga y hay que scrollear mucho")
y la entrada de los ítems, así que `TACHADO_PX` bajó de 416 a **300** y
`ENTRADA_PX` / `ENTRADA_PASO_PX` de 364/260 a **300/210**. Nada más se tocó: la
pausa, el paso del tachado (que sigue siendo igual a su duración: de a uno por
vez), el paso de hoja (640) y el remate (480) quedaron como estaban. La animación
pasó de 6440px a **5098px** en escritorio y de 4441px a **3519px** en mobile:
**21% menos de scroll**, 1342px en escritorio. Los números de arriba ya son los
nuevos.

Queda anotado que esto **contradice** el pedido del 13-10 ("no le bajes el tiempo
de animación de borrado, y si el de abajo tiene que esperar al de arriba tarda
más sí o sí"), que es lo que había llevado cada garabato a 416px. Manda el pedido
nuevo: el tachado de a uno se mantiene, la duración no.

## Los trazos

El generador vive en `src/lib/pencil.ts` y lo usan **los dos lados**: el
frontmatter de Astro lo llama en el build para que los tachones existan sin
JavaScript, y el script del cliente lo vuelve a llamar con el ancho real de cada
texto. Una sola fuente de verdad.

- PRNG con semilla fija (mulberry32), derivada del índice del ítem: los trazos
  son iguales en cada carga, distintos entre ítems.
- **Un solo trazo continuo, sin levantar el lápiz**: pasadas horizontales que van
  y vuelven, apiladas de arriba hacia abajo, unidas por giros redondeados
  (`stroke-linejoin` y `stroke-linecap` en `round`). Entre 5 y 6 pasadas por
  ítem, distinta cantidad en cada uno.
- **Cada pasada cruza todo el ancho** del texto y se pasa un poco de los bordes
  (2% a 5% del ancho, distinto en cada extremo y en cada pasada).
- **Inclinación leve** (de -1,2° a -2,2°, sube hacia la derecha) con una variación
  chica por pasada (±0,8°): si todas van con el mismo ángulo exacto, la pila se
  lee como un rallado y no como un garabato.
- **Codos**: entre dos pasadas la mano se pasa del borde (1,5% a 3,5% del ancho)
  y vuelve a la altura del medio entre las dos. Eso es lo que da el giro visible
  en los costados.
- **Arco por pasada** (0,05em): una mano no traza una recta.
- **La banda es de tinta, no de línea media.** La inclinación hace que una pasada
  suba o baje media inclinación de punta a punta, así que los centros se corren
  hacia adentro esa mitad. Sin eso el garabato se desborda al renglón de arriba y
  de abajo, y en la libretita se come los renglones.
- **Grosor 0,18em del texto** (escala con la tipografía: el ancho lo pone el
  atributo `stroke-width`, en px del `viewBox`) y **banda de 0,14em a 1em** desde
  el tope de la caja. Calibrado contra la referencia: con la banda angosta del
  primer intento (0,2 a 0,85em) las pasadas se pisaban y tapaban el texto; la
  referencia usa una banda de ~1,17em con el texto a plena opacidad.
- **Ítem de dos o tres líneas**: `Range.getClientRects()` da una caja por línea;
  el garabato sigue siendo **una sola trayectoria** y baja de una línea a la otra
  con un trazo diagonal. Para que la unión sea diagonal (y no un codo pegado al
  margen) la alternancia de dirección se invierte si la línea nueva arrancaría
  del lado en el que quedó la anterior.
- El `viewBox` usa el ancho y el alto medidos de la caja del texto; la firma de la
  medida (ancho, alto, tamaño de fuente y cajas de cada línea) evita regenerar de
  más en cada `ResizeObserver`.
- **El dibujado es `pathLength="1"` + `stroke-dasharray: 1` + `stroke-dashoffset`
  de 1 a 0**, con un ease suave en las puntas (la mano arranca y frena).
  `dashoffset` no se puede usar con un relleno, y por eso el trazo pasó de
  contorno relleno a línea.
- Aspecto: verde `#0E3B33` con opacidad 0,88 a 0,95 y `mix-blend-mode: multiply`.
  Filtro **estático** definido una vez y aplicado al `<g>` del ítem:
  `feTurbulence` (baseFrequency 1, numOctaves 2) → `feDisplacementMap` con
  desplazamiento 3,5 (borde rugoso) → umbral de alfa sobre el mismo ruido
  (`feColorMatrix` con offset -0,62) → `feComposite operator="out"` para picar
  los huecos por donde se ve el papel. El filtro no se anima y cada SVG mide lo
  que mide su ítem, así que la región del filtro es chica.
- **Ítem ya tachado**: el texto baja a 0,45 y el trazo se queda (el trazo y el
  texto son dos nodos distintos: la opacidad va en `.hero-item-label`).
- La fase de borrado se lleva el trazo junto con el texto: el SVG es parte del
  contenedor de la lista, así que el barrido de goma lo barre igual.

## El cuaderno

`.hero-pad` es el objeto: papel `var(--color-cream-light)`, borde verde de
1.5px, `border-radius: 0.375rem` y `box-shadow: 6px 6px 0 rgba(14, 59, 51, 0.09)`.
Los renglones salen del `border-bottom` de cada ítem (así siguen al texto cuando
tipa o envuelve) y la línea de margen es un `::before` de 1px al 20%.

Adentro del cuaderno hay cuatro cosas, y quién está arriba de quién es lo que
sostiene el paso de hoja:

1. **`.hero-hoja` (z-index 1)** — la hoja de arriba, con la lista adentro. Es la
   que gira. Da el alto del cuaderno (es la que tiene contenido en el flujo), y
   con JS lleva ella el aire del papel y el borde, para poder llegar hasta el
   borde del marco. `transform-origin: left center` y
   `backface-visibility: hidden` (con eso, pasando el canto la cara de adelante
   deja de dibujarse sola, sin ningún `opacity`).
2. **`.hero-hoja-reverso` (z-index -1, pasa a 0 pasado el canto)** — la cara de
   atrás de esa misma hoja: un `span` con `transform: rotateY(180deg)` y
   `backface-visibility: hidden` adentro de un contenedor que recibe la misma
   transformación que la hoja. Antes del canto mira para el otro lado y no se
dibuja; después del canto el giro de adentro cancela el de afuera y es la cara
que queda a la vista, plana y opaca, del otro lado del lomo.
3. **`.hero-final` (absolute, inset 0)** — la página de abajo, con bottega. Está
   ahí desde el principio y no se anima: la revela el giro.
4. **`.hero-anillado` y `.hero-anillado-costado` (z-index 4 y -2)** — el
   anillado, sobre el lomo, en **dos mitades hermanas**. Es del cuaderno, así que
   **no gira con la hoja**: la hoja pasa por debajo de los alambres. La mitad de
   adentro del papel va arriba de todo; la de afuera del canto va debajo de la
   hoja que gira, para que el resorte se guarde detrás de ella (ver «El
   anillado»).

### El anillado

Una vuelta cada 26px, centrada en el canto del papel (el centro de la caja cae
sobre el borde izquierdo). Cada vuelta es **un alambre dibujado**: sale del
agujero, rodea el canto y vuelve a entrar, con tres cosas que le dan volumen:

- **El agujero** se dibuja encima de las puntas del alambre, así que el alambre
  parece entrar en el papel (y no queda un pico raro donde se juntan las puntas).
- **El brillo del metal**: el trazo lleva un `linearGradient` (verde oscuro,
  claro al 40%, oscuro al 72%) que recorre el alambre.
- **La sombra sobre el papel**: una copia del mismo trazo, corrida 2,6px a la
  derecha y 3,2px abajo, con `feGaussianBlur 1,3` y opacidad 0,14.

Todo eso viaja dentro del mismo `data:image/svg+xml` repetido en Y, así que es
una sola imagen estática por vuelta (no cuesta nada por cuadro).

**El anillado son dos cajas, no una.** La vuelta mide 40px y el canto del papel
cae justo en el medio, así que el dibujo se reparte en dos mitades de 20px: la de
adentro del papel (el agujero y el alambre saliendo de él) y la de afuera del
canto (el alambre rodeando el papel). Cada mitad muestra su mitad del mismo
`background-size: 40px 26px`, con la fase en X corrida 20px en la de adentro
(`background-position: -20px 0`), así que las dos quedan alineadas al píxel:
medido con capturas del lomo a escala 3, la partición cambia **9 píxeles en
612.000** (delta máximo 2/255, todos en la columna del canto, que además lleva la
línea del marco) y **1 píxel en 138.600** (delta 1/255) contra la caja única de
antes.

Son dos cajas porque necesitan distinto orden de pintado, y ahí está el arreglo
pedido por el autor (*«el resorte debería meterse detrás de la hoja cuando va para
atrás: no debería verse esa porción si lo ves desde una vista frontal»*):

- **La de adentro va arriba de todo (z-index 4)**: es la cara de adelante del
  cuaderno, así que el alambre sigue saliendo del agujero sobre la página de abajo
  después de la vuelta.
- **La de afuera va en z-index -2 en modo vivo**: por debajo de la hoja que gira,
  que en el tramo de guardarse baja a z-index -1 (el mismo plano con el que se
  esconde detrás del papel del cuaderno). Apenas la hoja pasa el canto, la hoja le
  come la mitad de afuera al resorte: desde el frente esa parte no existe. Antes
  el anillado entero iba a z-index 4 y los aros se veían **encima** de la hoja ya
  volcada del otro lado del lomo.

En el fallback la mitad de afuera se queda en z-index 4 con el resto del anillado:
ahí la hoja no gira y no hay nada que la tape, y con un z-index negativo se iría
debajo del fondo de la sección, porque sin sticky el escenario no arma contexto de
apilado.

El marco del cuaderno lo dibuja `.hero-pad::after` (z-index 3), **por encima de
todo**: así la hoja gira por debajo y el borde no se corta nunca, ni siquiera
cuando el doblez se come la esquina de la hoja.

En el fallback (sin JS) no hay capas: la hoja es un bloque más, la página de
abajo cae debajo con el aire de la mesa en el medio, y el cuaderno mide lo que
miden los dos juntos (687px a 1440x900 contra 423px en modo vivo).

**El cuaderno va arriba del escenario, no centrado.** En modo vivo el escenario
lleva `justify-content: flex-start`: el H1 pegado al header (a 131px con el
header en 113) y el cuaderno justo abajo, con **todo el aire del escenario
abajo** (218px a 1440x900, 316px a 1080), que es como lo pidió el autor ("que el
cuaderno quede más alto durante la animación"). Antes quedaba centrado: el
cuaderno arrancaba a 359px y el aire se repartía entre arriba y abajo. Esa
diferencia es también la que hace que el cuaderno entre entero en ventanas bajas:
el recorte, si lo hay, es solo del lado de abajo.

### El pliegue y el rollo

El doblez son **tres piezas** del mismo cuadrado de la esquina (`DOBLEZ_FRACCION`
del ancho de la hoja), con la diagonal de 45 grados como línea del pliegue:

- **`.hero-doblez-corte`** tapa la esquina que ya no está (la hoja se fue con el
  pliegue) con el papel del cuaderno, para que no se vea el texto cortado. Tiene
  el radio de la esquina de arriba a la derecha.
- **`.hero-doblez-papel`** es el reverso del papel, caído encima de la hoja del
  otro lado de la línea: triángulo con los dos cantos libres (borde verde de
  1,5px a la izquierda y abajo), tono `--cara-reverso` y un degradado desde el
  pliegue (verde al 26% que se apaga al 36%) que es la sombra del rollo sobre el
  papel doblado.
- **`.hero-curl`** es el rollo: el papel curvado en la lomita que une la hoja
  plana con el reverso. Una banda de **24px** (media vuelta de papel, radio 12)
centrada en la línea del pliegue, con el sombreado del tubo: oscura donde toca
(el 16% del borde), luz en la cresta (`#fdfaf1` al 42%) y oscura otra vez donde
se apoya en el reverso. Y la sombra que tira sobre la hoja de abajo:
`box-shadow: 0 -7px 7px rgba(14, 59, 51, .24)`, que en el sistema del rollo cae
perpendicular al pliegue, del lado de la hoja plana.

El rollo **no se escala con el doblez**: es del papel, no de la esquina. Se
mueve con `transform` (una banda de 141,42px de base a la que el scroll le pone
el largo con `scaleX` y la posición con `translate` y `rotate(45deg)`), así que
no cambia el ancho ni el alto de la caja y el navegador no tiene que volver a
dibujar la hoja entera (adentro hay ocho filtros de crayón) en cada paso del
scroll. Los tres están en `opacity: 0` con `will-change: transform` para que la
capa ya esté dibujada cuando el scroll las prende.

La opacidad de aparición va en `.hero-item-label`, no en el `<li>` ni en el
`<span>` que envuelve al texto y al SVG: así el renglón de la libretita se ve
siempre, el trazo no se apaga con el texto y el garabato puede seguir dibujándose
mientras el label entra.

## Fallback

Sin JavaScript o con `prefers-reduced-motion`: sin sticky y sin la altura larga.
Queda el layout corto y estático: el H1, el cuaderno con la lista tachada, el
anillado, y debajo (adentro del mismo cuaderno) el estado final con bottega, el
subtítulo y los botones. El tachado es de la tipografía
(`text-decoration: line-through` a 0,16em en verde de marca, que es lo que pide
el sistema cuando no hay garabato animado) y el SVG está oculto. Medido en los
dos casos: `is-live` ausente, decoración `line-through` de 4,32px en
`rgb(14, 59, 51)`, SVG en `display: none`, el estado final visible (los botones a
opacidad 1, que no los toca ningún JS) y el anillado presente igual, **con sus
dos mitades** (en el fallback la de afuera también va adelante: sin hoja que gire
no hay nada que la tape, que es lo que deja la captura del lomo: los aros
completos a los dos lados del canto).

## Verificación

- **El resorte se guarda detrás de la hoja.** Contando el brillo del metal del
alambre (R 55..115 con G-R ≥ 40, que es el tono claro del tubo) a la izquierda
del canto en las capturas a 1440x900: **448px en reposo y en el tramo de
adelante** (idénticos antes y después de partir la caja en dos), **0px pasado el
canto** (-103°, -117°, -142° y -168°) contra 474/461/460/460 de la caja única, y
**448px otra vez con la vuelta terminada**. Es decir: la mitad de afuera del
anillado existe cuando la hoja no está encima y no existe desde el frente
mientras la hoja está volcada del otro lado del lomo.
- **La partición del anillado no cambia el reposo.** Capturas del lomo a escala 3
  (330x420) contra la caja única de antes: **1 píxel distinto en 138.600** (delta
  1/255). En el cuadro completo (1020x600): **9 píxeles en 612.000**, todos en la
  columna del canto (delta máximo 2/255), que además es donde corre la línea del
  marco. Medido del DOM en modo vivo: la mitad de adentro es `20x363` con su
  origen en el canto del papel, la de afuera `20x363` 20px a la izquierda, con
  `z-index` 4 y -2 y las fases en X `-20px 0` y `0 0`.

- **El tachado es de a uno por vez.** Recorriendo el tramo entero en pasos de
  20px de scroll (346 muestras en escritorio, 239 en mobile, con el `dashoffset`
  de los 8 ítems leído del DOM en cada una): **el máximo de garabatos a medio
  dibujar es 1** y no hay un solo solape entre vecinos. Los arranques y cierres
  medidos (escritorio, malla de 20px): ítem 0 de 2360 a 2740, ítem 1 de 2760 a
  3160, ítem 2 de 3180 a 3580, ítem 3 de 3600 a 4000, ítem 4 de 4020 a 4400,
  ítem 5 de 4440 a 4820, ítem 6 de 4840 a 5240, ítem 7 de 5260 a 5660. Los
  límites exactos del plan son `2340 + 416i` a `2340 + 416(i+1)`. En mobile
  (largo 4770): 1620/1880, 1900/2180, 2200/2460, 2480/2740, 2780/3040, 3060/3320,
  3340/3620, 3640/3900, sobre `1612 + 287i`.
- **Las dos fases son dos fases.** En 2200px los ocho labels están en opacidad
  1,00 y los ocho `dashoffset` en 1,0 (lista completa, ninguna raya): el primer
  trazo aparece en 2340px. En 2500px el único a medio dibujar es el ítem 0
  (`0.6 1 1 1 1 1 1 1`), en 2900px el único es el 1 (`0 0.7 1 1 1 1 1 1`), en
  3900px el 3 (`0 0 0 0.2 1 1 1 1`) y en 5500px el 7 (`0 0 0 0 0 0 0 0.4`). En
  5700px los ocho están cerrados y la lista sigue a opacidad plena. Idéntico en
  mobile. Capturas en `%TEMP%/hero-shot/` (tira por posición en
  `tira-1440x900.png`, muestras en `shots/`).
- **El remate.** Con el recorrido total en el tope (6440px), los últimos 480px de
  scroll de la sección no mueven nada: medido a 1440x900 en +0, +200, +400 y
  +480px después del tope, el escenario sigue clavado en 113..900, el cuaderno en
  los mismos 259..682 y el CTA en opacidad 1. A +500px el escenario ya arranca a
  despegarse (93..880), así que el remate son exactamente los 480 declarados.
- **El cuaderno queda arriba.** A 1440x900 el cuaderno mide 259..682 (antes
  359..782) con 218px de aire abajo, y el H1 131..237 pegado al header. El mismo
  reparto en todo el recorrido (medido en 0, 2000 y 6440px).
- **Piso de ventana** (ancho 1440, cuaderno al tope del recorrido): entra entero
  desde 1080 hasta **500px de alto**, con el aire de abajo bajando de 316px a
  19px. A 460px ya no entra: el cuaderno se corta 17px abajo (el escenario tiene
  `overflow: hidden`), y no se arregla recortando aire porque a esa altura el
  cuaderno ya está en el mínimo de su contenido. Por debajo de 500px de ventana
  el hero muestra el cuaderno cortado abajo.
- **El paso de hoja.** Medido a 1440x900 y 390x844, con el giro y el doblez
  leídos del DOM: `rotateY` va de 0 a -180 grados con la curva suave (en
  escritorio -9,8° a 5828px, -44,2° a 5957, -87,9° a 6086, -132° a 6215, -180° a
  6440), y el doblez mide 0 a 5699px, 83px a 5828, **125px en su punto más alto a
  5957** (26% del ancho de la hoja), y 0 desde 6086 (antes del cruce del canto, que
  cae en 5890: por eso no hay ningún salto cuando la cara de adelante se apaga).
  La proyección de la hoja pasa de 544x423 (plana) a 511x554 (-44°), 30x640 en el
  canto y 544x423 plana del otro lado. En mobile es la misma fracción del ancho
  (82px sobre 358 contra 125 sobre 544).
- **El rollo no se deforma**: mide 24px de grueso siempre (banda de 141,42px que
  el scroll estira con `scaleX`), y la pieza que se ve después del canto es la
  cara de atrás (`--cara-reverso`, 84% papel y 16% crema oscura), opaca, con su
  borde y su sombra. La hoja aterriza **detrás del cuaderno**: el marco (z-index
  3), el anillado (z-index 4) y la escritura de la página de abajo quedan
  adelante. A 1440x900 la hoja aterrizada mide 544px y el lomo está a 448 del
  borde de la ventana, así que se ven 448px (el resto queda fuera de cuadro); en
  mobile (390) sólo asoma una franja de 16px.
- **Frame rate con el rollo y la cara de atrás**, pase completo a 1440x900 (586
  cuadros): mediana 16,7ms = **59,9 fps**, p95 17,3ms. En la primera vuelta hay 3
  cuadros por encima de 25ms (71ms antes del hero, 37ms en el arranque del paso de
  hoja y 26ms antes del hero), y en la segunda uno solo (30ms en el cruce del
  canto). El rollo y el reverso se mueven solo con `transform`.
- **El anillado** mide 40px de ancho (20px de cada lado del canto) con
  `background-size: 40px 26px` y `repeat-y`: 15 vueltas en un cuaderno de 423px.
- **El paso de hoja.** Medido a 1440x900 y 390x844, con el giro y el doblez
  leídos del DOM: `rotateY` va de 0 a -180 grados con la curva suave (en
  escritorio -9,8° a 5828px, -44,2° a 5957, -87,9° a 6086, -132° a 6215, -180° a
  6440), y el doblez mide 0 a 5699px, 67px a 5828, **141px en su punto más alto a
  5957** (26% del ancho de la hoja), 54px a 6086 y 0 desde 6215. La proyección de
  la hoja pasa de 544x423 (plana) a 511x554 (-44°), 30x640 en el canto y 544x423
  plana del otro lado: la hoja no se funde, la deja de ver el canto. En
  escritorio y mobile el doblez es la misma fracción del ancho (141px sobre 544 y
  93px sobre 358).
- **La geometría del cuaderno no se movió** con la reestructuración: a 1440x900
  el cuaderno sigue en 544x423 con la esquina en (448, 359), la lista en (501,
  387) de 454x367, y en mobile el cuaderno en 358x458 con la lista en (45, 339).
  El anillado mide 20x661 en escritorio (20x434 en mobile) con `repeat-y`.
- **Frame rate del pase completo** scrolleando todo el hero a 12px por cuadro
  (586 cuadros, 1440x900): mediana 16,7ms = **59,9 fps**, p95 17,3ms, y solo 2
  cuadros por encima de 25ms en la primera vuelta (82ms en -388px, antes de que
  empiece el hero, y **44ms justo en el cruce del canto a 6080px**); la segunda
  vuelta ya no tiene ninguno. El doblez escalado por transform y sus capas
  pre-dibujadas dejan el paso en 60fps: lo único que queda es ese cuadro del
  cruce en la primera vuelta, y se va cuando las capas ya están calientes.
- **Fallback medido en los dos casos** (sin JS y con movimiento reducido): un
  solo cuaderno (544x687 a 1440x900) con la lista tachada tipográficamente y el
  estado final adentro, el anillado presente y ningún transform aplicado.
- **El paso de hoja reemplazó al barrido de goma**: ya no hay máscara ni blur en
  la lista, la lista no se desvanece (sigue a opacidad plena hasta que la hoja se
  la lleva) y la marca y el subtítulo no tienen entrada propia (los revela el
  giro). Lo único que llega encadenado son los botones, de 6220px a 6440px.
- Capturas a 1440x900 y 390x844 en 0%, 50% y 100% del trazo del ítem 0 (2360px,
  2548px y 2756px del recorrido), más la lista completa tachada (5700px), el paso
  de hoja (5828 / 5957 / 6086 / 6215px) y el estado final (6440px). El avance real
  coincide con el pedido y el `dashoffset` medido del primer ítem es 1 hasta
  2340px, 0,5 en 2548px y 0 en 2756px.
- **Frame rate scrolleando de verdad sobre el tramo de tachado: 60,1 fps con el
  filtro y 60,8 sin él** (1440x900), 63 fps en 390x844. El filtro no cuesta
  frame rate, así que no hizo falta el plan B de la máscara con textura horneada.
- Los 8 ítems quedan en una sola línea en 1440x900 (fuente 27px, caja 32,4px de
  alto): no hay ítems de dos líneas en escritorio, como pide el pedido.
- El ítem de dos líneas se verificó forzando el cuaderno a 170px de ancho: 2 y 3
  líneas por ítem, una sola trayectoria, caja del garabato de 84px de alto en el
  ítem de 3 líneas y la transición diagonal entre líneas en el `d` del path.
- La tinta queda dentro del renglón: el garabato del ítem 0 mide 25px de alto
  contra los 32,4px de la caja del texto, así que no se come los renglones de la
  libretita.
- Piso de ventana medido de 1080 a 540px de alto (1440 de ancho): la libretita
  entra completa en el escenario, sin scroll interno, y los botones quedan dentro
  de la ventana en todas. A 540px el pie de los botones está en 461px de 540, o
  sea que todavía sobra aire; abajo de eso scrollea.
- Que la sección 1, el header y el logo viajero sigan funcionando igual.
