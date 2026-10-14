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
| entrada de cada ítem | `ENTRADA_PX` | 364 | 251 |
| paso de la entrada | `ENTRADA_PASO_PX` | 260 | 179 |
| pausa antes del lápiz | `PAUSA_PX` | 156 | 108 |
| garabato de cada ítem | `TACHADO_PX` | 416 | 287 |
| paso del tachado | `TACHADO_PASO_PX` = `TACHADO_PX` | 416 | 287 |
| pausa antes de la goma | `PAUSA_FINAL_PX` | 104 | 72 |
| barrido de goma | `BORRADO_PX` | 468 | 323 |
| marca | `BOTTEGA_PX` | 312 | 215 |
| subtítulo | desde 260, dura `SUBTITULO_PX` | 260 | 179 |
| botones | desde 468, dura `BOTONES_PX` | 208 | 144 |
| **largo total** | la suma de los tramos | **6916** | **4770** |

El paso del tachado es igual a su duración **a propósito**: es la definición de
"de a uno por vez". No hay que corregirlo a un solape "lindo" entre vecinos.

| # | problema | entra | se tacha |
| --- | --- | --- | --- |
| 1 | Planillas de Excel | 0 – 364 | 2340 – 2756 |
| 2 | Carga de datos a mano | 260 – 624 | 2756 – 3172 |
| 3 | Grupos de WhatsApp | 520 – 884 | 3172 – 3588 |
| 4 | Datos sin comprobar | 780 – 1144 | 3588 – 4004 |
| 5 | Horas sin control | 1040 – 1404 | 4004 – 4420 |
| 6 | Papeles sueltos | 1300 – 1664 | 4420 – 4836 |
| 7 | Sueldos calculados a mano | 1560 – 1924 | 4836 – 5252 |
| 8 | Stock anotado en un cuaderno | 1820 – 2184 | 5252 – 5668 |

En mobile los mismos números por 0,69 (ítem i entra en `179i` y se tacha en
`1612 + 287i`), así que los dos entran y los dos se tachan con el mismo recorrido
por debajo del dedo.

| fase | escritorio | mobile | qué hace |
| --- | --- | --- | --- |
| entrada | 0 – 2184 | 0 – 1504 | los 8 ítems entran uno atrás del otro, con 8px de desplazamiento y opacidad 0 a 1. Nada tachado, y los vecinos se pisan (dos entrando a la vez) |
| pausa | 2184 – 2340 | 1504 – 1612 | la lista entera, limpia y quieta: se lee completa antes de que el lápiz la toque |
| tachado | 2340 – 5668 | 1612 – 3908 | 8 garabatos de 416px, **uno por vez**; cada ítem baja a 0,45 al cerrarse |
| pausa | 5668 – 5772 | 3908 – 3980 | todo quieto, la lista completa y tachada |
| borrado | 5772 – 6240 | 3980 – 4303 | barrido de máscara de izquierda a derecha, opacity a 0 y blur creciente. Queda un resto de grafito al 6% que se desvanece |
| bottega | 6240 – 6552 | 4303 – 4518 | entra entintándose: opacity, blur de 6px a 0 y un asentamiento leve |
| subtítulo | 6500 – 6760 | 4482 – 4661 | el mismo tratamiento, encadenado |
| botones | 6708 – 6916 | 4626 – 4770 | los últimos |

**El hero se alargó con el tachado de a uno.** Antes el recorrido era 5200px
(escritorio) y 3600px (mobile) con los trazos pisados: cada garabato tenía 416px
y ocho garabatos entraban en 1612px. Ahora cada uno sigue teniendo sus 416px,
pero al no pisarse ocupan 3328px, así que el recorrido pasó a **6916px
(escritorio) y 4770px (mobile)**, un tercio más. Ningún tramo se acortó: lo que
creció es el largo del hero, y ese fue el pedido ("si el de abajo tiene que
esperar al de arriba tarda más sí o sí").

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

## La libretita

`.hero-pad` es el objeto: `background: var(--color-cream-light)`, borde verde de
1.5px, `border-radius: 0.375rem` y `box-shadow: 6px 6px 0 rgba(14, 59, 51, 0.09)`.
Los renglones salen del `border-bottom` de cada ítem (así siguen al texto cuando
tipa o envuelve) y la línea de margen es un `::before` de 1px al 20%.

La opacidad de aparición va en `.hero-item-label`, no en el `<li>` ni en el
`<span>` que envuelve al texto y al SVG: así el renglón de la libretita se ve
siempre, el trazo no se apaga con el texto y el garabato puede seguir dibujándose
mientras el label entra.

## Fallback

Sin JavaScript o con `prefers-reduced-motion`: sin sticky y sin la altura larga.
Queda el layout corto y estático: el H1, la lista con el tachado de la
tipografía (`text-decoration: line-through` a 0,16em en verde de marca, que es lo
que pide el sistema cuando no hay garabato animado), el SVG oculto y debajo el
estado final con bottega, el subtítulo y los botones. Medido en los dos casos:
`is-live` ausente, decoración `line-through` de 4,32px en `rgb(14, 59, 51)`,
SVG en `display: none` y el estado final visible.

## Verificación

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
- Capturas a 1440x900 y 390x844 en 0%, 50% y 100% del trazo del ítem 0 (2360px,
  2548px y 2756px del recorrido), más la lista completa tachada (5700px), el
  barrido de borrado (6000px) y el estado final (6916px). El avance real coincide
  con el pedido y el `dashoffset` medido del primer ítem es 1 hasta 2340px, 0,5
  en 2548px y 0 en 2756px.
- **Frame rate scrolleando de verdad sobre el tramo de tachado: 60,1 fps con el
  filtro y 60,8 sin él** (1440x900), 63 fps en 390x844. El filtro no cuesta
  frame rate, así que no hizo falta el plan B de la máscara con textura horneada.
- Los 8 ítems quedan en una sola línea en 1440x900 (fuente 27px, caja 32,4px de
  alto): no hay ítems de dos líneas en escritorio, como pide el pedido.
- El ítem de dos líneas se verificó forzando la libretita a 170px de ancho: 2 y 3
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
