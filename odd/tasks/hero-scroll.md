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
9. **Un ítem ya tachado no se apaga.** Se queda con la opacidad normal, como
   cualquier otro: la lectura es una lista que se va cerrando, no un foco que
   persigue al último tachado.

## Línea de tiempo

Constantes editables al inicio de `Hero.astro`. Con N = 8:

`PASO 0.0875`, `APARICION 0.06`, `DESFASE_TACHADO 0.03`, `TACHADO 0.075`.

| # | problema | aparece | se tacha |
| --- | --- | --- | --- |
| 1 | Planillas de Excel | 0.000 – 0.060 | 0.030 – 0.105 |
| 2 | Carga de datos a mano | 0.088 – 0.148 | 0.118 – 0.193 |
| 3 | Grupos de WhatsApp | 0.175 – 0.235 | 0.205 – 0.280 |
| 4 | Datos sin comprobar | 0.263 – 0.323 | 0.293 – 0.368 |
| 5 | Horas sin control | 0.350 – 0.410 | 0.380 – 0.455 |
| 6 | Papeles sueltos | 0.438 – 0.498 | 0.468 – 0.543 |
| 7 | Sueldos calculados a mano | 0.525 – 0.585 | 0.555 – 0.630 |
| 8 | Stock anotado en un cuaderno | 0.613 – 0.673 | 0.643 – 0.718 |

| fase | rango | qué hace |
| --- | --- | --- |
| pausa | 0.718 – 0.780 | todo quieto, la lista completa y tachada |
| borrado | 0.780 – 0.870 | barrido de máscara de izquierda a derecha, opacity a 0 y blur creciente. Queda un resto de grafito al 6% que se desvanece |
| bottega | 0.870 – 0.930 | entra entintándose: opacity, blur de 6px a 0 y un asentamiento leve |
| subtítulo | 0.920 – 0.970 | el mismo tratamiento, encadenado |
| botones | 0.960 – 1.000 | los últimos |

## Los trazos

El generador vive en `src/lib/pencil.ts` y lo usan **los dos lados**: el
frontmatter de Astro lo llama en el build para que los tachones existan sin
JavaScript, y el script del cliente lo vuelve a llamar con el ancho real de cada
texto. Una sola fuente de verdad.

- PRNG con semilla fija (mulberry32), derivada del índice del ítem: los trazos
  son iguales en cada carga, distintos entre ítems.
- **Un solo trazo de ida y vuelta**, no varias rayas sueltas: un path continuo
  que va de izquierda a derecha y vuelve, con las dos pasadas a distinta altura y
  con inclinaciones opuestas para que se crucen en el medio.
- El recorrido ondula con dos ondas de distinta frecuencia (una lenta que le da
  la forma, una rápida que le da el temblor del pulso), y la ondulación se apaga
  en los extremos para que el trazo no se escape a los costados.
- **Curvas, no segmentos rectos.** Los puntos se unen con quadráticas por punto
  medio; con `L` el trazo se lee como un polígono y el tachado queda duro.
- **El grosor varía a lo largo del trazo** (apoya fuerte en el medio, se afina en
  las puntas), así que no es una línea: se dibuja el **contorno relleno**. Una
  línea de SVG tiene grosor constante y un lápiz no.
- El `viewBox` usa el ancho y el alto medidos del `<span>` interno del `<li>`, no
  del `<li>`.
- El revelado es un `clip-path: inset()` de izquierda a derecha, porque un
  relleno no tiene `stroke-dashoffset` para animar.
- Aspecto: verde con opacidad 0.88 a 0.98, filtro
  `feTurbulence + feDisplacementMap` con desplazamiento 0.5 (medido: no cuesta
  frame rate y saca el borde perfecto), definido una vez y aplicado al `<g>` del
  ítem, y `mix-blend-mode: multiply`.

## La libretita

`.hero-pad` es el objeto: `background: var(--color-cream-light)`, borde verde de
1.5px, `border-radius: 0.375rem` y `box-shadow: 6px 6px 0 rgba(14, 59, 51, 0.09)`.
Los renglones salen del `border-bottom` de cada ítem (así siguen al texto cuando
tipa o envuelve) y la línea de margen es un `::before` de 1px al 20%.

La opacidad de aparición va en el `<span>` del texto, no en el `<li>`: así el
renglón de la libretita se ve desde el principio, aunque el ítem todavía no haya
aparecido.

## Fallback

Sin JavaScript o con `prefers-reduced-motion`: sin sticky y sin la altura larga.
Queda el layout corto y estático: el H1, la lista con los tachones ya dibujados y
debajo el estado final con bottega, el subtítulo y los botones.

## Verificación

- Capturas a 1440x900, 1280x720 y 390x844 en progreso 0, 0.4, 0.8 y 1: el
  progreso real coincide con el pedido en los tres.
- Frame rate scrolleando de verdad sobre el tramo de tachado: **60.4 fps** con el
  trazo relleno y el filtro SVG activo, 0 frames sobre 22ms; sin filtro da 59.5
  fps, o sea que el filtro no cuesta nada.
- Piso de ventana medido de 1080 a 540px de alto: la libretita entra completa en
  el escenario, sin scroll interno, y los botones quedan dentro de la ventana en
  todas. Abajo de eso scrollea.
- Que la sección 1, el header y el logo viajero sigan funcionando igual.
