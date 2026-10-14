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
4. **El progreso sale de la sección, no de la ventana.** Es la posición de la
   sección contra `SCROLL_LENGTH` en píxeles, así que el mismo scroll da el mismo
   progreso en cualquier alto de ventana.
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
recién con la lista completa el lápiz empieza a cruzar, de nuevo del primero al
último. Constantes editables al inicio del script de `Hero.astro`. Con N = 8:

`APARICION_FIN 0.42`, `APARICION_DUR 0.07`, `TACHADO_INICIO 0.45`,
`TACHADO_FIN 0.76`, `TACHADO_DUR 0.08`, `BORRADO_INICIO 0.78`.

Los dos pasos no son constantes: salen de la cantidad de ítems, así que la lista
puede crecer o acortarse sin tocar los números de arriba.

| # | problema | entra | se tacha |
| --- | --- | --- | --- |
| 1 | Planillas de Excel | 0.0000 – 0.0700 | 0.4500 – 0.5300 |
| 2 | Carga de datos a mano | 0.0500 – 0.1200 | 0.4829 – 0.5629 |
| 3 | Grupos de WhatsApp | 0.1000 – 0.1700 | 0.5157 – 0.5957 |
| 4 | Datos sin comprobar | 0.1500 – 0.2200 | 0.5486 – 0.6286 |
| 5 | Horas sin control | 0.2000 – 0.2700 | 0.5814 – 0.6614 |
| 6 | Papeles sueltos | 0.2500 – 0.3200 | 0.6143 – 0.6943 |
| 7 | Sueldos calculados a mano | 0.3000 – 0.3700 | 0.6471 – 0.7271 |
| 8 | Stock anotado en un cuaderno | 0.3500 – 0.4200 | 0.6800 – 0.7600 |

Los tachados se pisan entre vecinos (el paso es 0,0329 y cada garabato tarda
0,08): en cualquier momento hay dos o tres trazos en vuelo, pero el arranque de
cada uno siempre es posterior al del anterior. La entrada, en cambio, no se pisa
con el tachado de nadie: la lista está completa antes de la primera raya.

| fase | rango | scroll (escritorio / mobile) | qué hace |
| --- | --- | --- | --- |
| entrada | 0.000 – 0.420 | 2184px / 1512px | los 8 ítems entran uno atrás del otro, con 8px de desplazamiento y opacidad 0 a 1. Nada tachado |
| pausa | 0.420 – 0.450 | 156px / 108px | la lista entera, limpia y quieta: se lee completa antes de que el lápiz la toque |
| tachado | 0.450 – 0.760 | 1612px / 1116px | los garabatos se dibujan de primero a último; cada ítem baja a 0,45 al cerrarse |
| pausa | 0.760 – 0.780 | 104px / 72px | todo quieto, la lista completa y tachada |
| borrado | 0.780 – 0.870 | 468px / 324px | barrido de máscara de izquierda a derecha, opacity a 0 y blur creciente. Queda un resto de grafito al 6% que se desvanece |
| bottega | 0.870 – 0.930 | 312px / 216px | entra entintándose: opacity, blur de 6px a 0 y un asentamiento leve |
| subtítulo | 0.920 – 0.970 | 260px / 180px | el mismo tratamiento, encadenado |
| botones | 0.960 – 1.000 | 208px / 144px | los últimos |

El largo del scroll no cambió con las dos fases (`SCROLL_DESKTOP` 5200,
`SCROLL_MOBILE` 3600). Antes los tramos se pisaban y el último ítem cerraba en
0,718; ahora la escalera termina en 0,76, así que cada ítem tiene más scroll
encima que antes (entrada 364px contra 312; tachado 416 contra 390) y el pedido
no cuesta recorrido.

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

- **Las dos fases son dos fases.** Medido por CDP con puppeteer-core a 1440x900
  (largo 5200) y 390x844 (largo 3600), en 9 progresos con el `dashoffset` y la
  opacidad del label de los 8 ítems leídos del DOM. En 0,42 y en 0,45 los ocho
  labels están en opacidad 1,00 y los ocho `dashoffset` en 1,0 (lista completa,
  ninguna raya). Recién en 0,55 hay trazos y son los primeros: `0.0 0.1 0.6` con
  el resto en 1,0. En 0,65 van cinco y en 0,76 los ocho están cerrados
  (`dashoffset` 0,0) con la lista todavía a opacidad plena. Idéntico en mobile.
  Capturas en `%TEMP%/hero-shot/shots/` (montaje en `montaje.png` y
  `montaje-mobile.png`).
- Capturas a 1440x900 y 390x844 en progreso 0%, 50% y 100% del trazo del ítem 0
  (0,45 / 0,49 / 0,53), más la lista completa tachada (0,76), el barrido de
  borrado (0,85) y el estado final (1). El progreso real coincide con el pedido y
  el `dashoffset` medido del primer ítem es 1 hasta 0,45, 0,5 en 0,49 y 0 en
  0,53.
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
