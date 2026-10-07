# Feature: /nosotros en dos pantallas, historia general y equipo a una pantalla

## Objetivo

Pedido del autor (2026-10-07, dos mensajes):

1. Sacar las 2 capturas de la primera sección y unificar el background: los dos
   párrafos que explicaban por separado el recorrido de cada socio se reemplazan
   por uno general (compañeros de facultad, varios proyectos juntos, un año antes
   de recibirse deciden convertirlo en negocio). No hace falta aclarar la
   experiencia previa al proyecto.
2. Las animaciones viven solo en la primera sección; después de eso, directamente
   las 2 fotos del equipo.
3. La sección "Conocé al equipo" es muy grande: tiene que ocupar 100vh menos el
   header.

## Diagnóstico medido

Medido en Chrome headless (CDP) contra `npm run dev`, con el bloque
`anuncio + header` (var `--nav-h`) como techo:

| Viewport | Presupuesto (100dvh − --nav-h) | Equipo hoy | Exceso |
| --- | --- | --- | --- |
| 1280×800 | 723px | 1140px | +417px |
| 1440×900 | 823px | 1140px | +317px |
| 375×667 | 600px | 1704px | +1104px |

Desglose de la sección de equipo a 1280×800: 192px de padding vertical + 141px de
encabezado + 48px de separación + tarjeta de 758px (foto 4/5 de **513px** + texto
de 243px). Con la sección alineada al header solo entran los 490px de arriba de
las fotos: nombre, rol, bio y redes quedan fuera de pantalla.

`about.body` hoy: 4 párrafos, 1187 caracteres, 9 oraciones. Los párrafos 1 y 2 son
el recorrido individual de cada socio.

## Decisiones (autor, 2026-10-07)

| Tema | Decisión |
| --- | --- |
| Alcance del 100vh | Solo desktop: de `lg` para arriba la sección entra exacta. En mobile las 2 tarjetas se apilan y la sección scrollea (el presupuesto a 375×667 es 600px: dos tarjetas con foto no entran). |
| Tarjeta | Vertical como hoy (foto arriba, texto abajo), con la bio. Se permite ensanchar la tarjeta y, de última, sacar el subtítulo de la sección para ganar alto. |
| Primera sección | También una pantalla exacta: historia en una pantalla, equipo en la siguiente. Las animaciones quedan ahí. |
| Encabezado | Se van el intro viejo de `pages.nosotros` y el h2 "Quiénes somos". Queda eyebrow + h1 "Nosotros" + los 2 párrafos nuevos. |
| Capturas | Se van las 2 capturas de `caseStudies` que hoy acompañan al cuerpo. |

## Decisión de diseño (agente)

Para que la foto pueda ser vertical y la sección entre igual en una pantalla, el
encabezado deja de ocupar alto propio: de `lg` para arriba va como columna
izquierda y las 2 tarjetas ocupan la derecha. Eso libera 189px de alto (el
encabezado más su separación) y los pone en la foto.

- Grilla: `lg:grid-cols-[18rem_1fr]`, encabezado `max-w-xl` a la izquierda,
  tarjetas `sm:grid-cols-2` a la derecha.
- Alto de la sección: `min-h-[calc(100dvh-var(--nav-h))]`, la misma var que usan
  `Hero` y `Contact`. El contenido se centra con `justify-center`.
- Foto: contenedor `relative flex-1 min-h-[22rem] max-h-[30rem]` con la imagen
  `absolute inset-0 h-full w-full object-cover`. El alto lo resuelve el layout
  (no hay aritmética de píxeles que mantener): en desktop la foto crece con la
  ventana hasta 30rem, en mobile queda el piso de 22rem. En ningún caso cambia
  `aspect-ratio`, así que no hay CLS por recálculo.
- Variante descartada: mantener el encabezado arriba y recortar la foto a un
  apaisado 5/3. Fuerza un recorte horizontal de una foto de persona y desperdicia
  el ancho que el texto no usa.

## Alcance

- `src/lib/content.ts`: `about` (nuevo `body` de 2 párrafos, se va `title`) y
  `pages.nosotros` (se va `intro`).
- `src/components/About.astro`: una pantalla, sin capturas, reveal por oración.
- `src/components/Team.astro`: layout de una pantalla.
- `docs/copy-completo.md`: secciones 3.2 y 3.3.

## Fuera de alcance

- `team.description` (el subtítulo) se mantiene: entra en la columna izquierda.
- La bio por miembro se mantiene (decisión del autor).
- `HowWeWork` y `CtaBanner` conservan su reveal: el pedido de "animaciones solo en
  la primera sección" es sobre el arranque de la página, no sobre el resto.
- Los casos de estudio siguen mostrando esas capturas en `/proyectos`.

## Criterios de aceptación

1. `/nosotros` renderiza un solo eyebrow y un solo h1 antes del cuerpo.
2. `about.body` tiene 2 párrafos y el texto es el que escribió el autor.
3. De `lg` para arriba, `#nosotros` mide ≤ `100dvh − --nav-h` a 1024×768,
   1280×800, 1440×900 y 1920×1080, con la tarjeta completa visible (foto, nombre,
   rol, bio y redes).
4. El equipo mide exactamente `100dvh − --nav-h` de `lg` para arriba. La historia
   usó el mismo alto forzado hasta el 2026-10-07 y se le quitó: con el contenido
   en ~520px el bloque dejaba ~100px de aire arriba y abajo, y el autor lo sintió
   como espacio en blanco. Ahora usa los márgenes normales de sección
   (`py-16 md:py-24`) y mide lo que mide su contenido.
5. En mobile (375×667) las 2 tarjetas se apilan y nada se solapa ni se corta.
6. Con `prefers-reduced-motion: reduce` el texto de la historia queda visible y
   estático.
7. `npx astro check` y `npm run build` pasan.

## Estado

Primera ola implementada y verificada (2026-10-07). Medido en Chrome headless por
CDP, con `--nav-h` real de cada breakpoint y la sección alineada bajo el header:

| Viewport | Presupuesto | Historia | Equipo | Tarjeta | Foto |
| --- | --- | --- | --- | --- | --- |
| 1024×768 | 691px | 649px (margen normal) | 692px | 608px | 310×363 (0.85) |
| 1280×800 | 723px | 649px (margen normal) | 724px | 640px | 374×395 (0.95) |
| 1440×900 | 823px | 649px (margen normal) | 824px | 725px | 374×480 (0.78, tope) |
| 1920×1080 | 1003px | 649px (margen normal) | 1004px | 725px | 374×480 (tope) |
| 375×667 | 600px | 746px (margen normal) | 1440px (apila) | 589px | 341×352 (0.97) |

La historia dejó de medir una pantalla: el 2026-10-07 el autor pidió que use los
márgenes normales de la página, porque el `min-h` forzado dejaba unos 100px de
aire arriba y abajo. Con `py-16 md:py-24` mide 649px en los cuatro desktop (el
contenido es de ~520px) y 746px en mobile. El equipo sigue siendo una pantalla
exacta.

La sección mide el presupuesto exacto más su propio `border-t` de 1px (más el
redondeo del navegador): el contenido nunca pasa del presupuesto y la tarjeta
entera, con nombre, rol, bio y redes, entra en una pantalla en los cuatro
desktop.

Corregido sobre la primera versión: la tarjeta se estiraba al alto de la fila
mientras la foto ya estaba en su tope de 30rem, así que quedaban ~200px de verde
vacío dentro de la tarjeta debajo de los botones a 1920×1080 (y ~26px a 1440×900).
La grilla dejó de estirarse y la foto pasó a tener alto propio.

`npx astro check`: 0 errores, 0 warnings, 0 hints. `npm run build`: 11 páginas, OK.

## Cita de cliente (2026-10-07)

Pedido del autor: una cita justo antes del CTA. Se implementó `ClientQuote.astro`
entre "Cómo trabajamos" y el `CtaBanner`, con el copy en `clientQuote` (cita textual
de Paola Zorila, AZ Servicios de Limpieza, Rosario, 425 caracteres reproducidos
carácter por carácter) y el link al caso de limpieza reusando
`portfolio.detailsLabel`. Medido a 1280x800: sección de 663px, figura de 470px,
8 líneas a 30px en una columna de 768px.

**Decisión abierta**: el caso de estudio de limpieza está anonimizado
(`client: "Empresa de limpieza · Rosario"` en `portfolio.items`) y la cita ya nombra
a AZ Servicios de Limpieza. O el caso se desanonimiza para que las dos piezas
concuerden, o la cita queda como la única mención con nombre. Lo decide el autor.

## Segunda ola (pedido del autor, 2026-10-07)

1. Centrar mejor el contenido de la primera pantalla (hoy la columna queda pegada
a la izquierda).
2. Intro de la sección de equipo: el texto "Equipo / Conocé al equipo / Dos
personas, un mismo objetivo..." aparece de golpe sobre las tarjetas, se
desvanece y deja las 2 tarjetas a la vista, que se quedan ahí.

**Estado: implementada y medida (2026-10-07).**

- Intro del equipo: implementada en `Team.astro`. Medida por CDP en 5 momentos:
  pop del título a los 160ms, legible a los 760ms, tapa desvanecida a los 1210ms y
  fuera del DOM a los 2110ms, con un click sobre LinkedIn llegando al link. Sin JS,
  con `prefers-reduced-motion` o en mobile (menos de 64rem) la tapa no se pinta y
  las 2 tarjetas se ven de una. El encabezado dejó de ocupar alto, así que la
  columna izquierda de 18rem desapareció: las tarjetas viven en una grilla centrada
  de `max-w-3xl` (372px cada una) y los altos de la tabla de arriba no cambiaron.
- Centrar la primera pantalla: **revertido el mismo día por pedido del autor** ("no
  me gusta centrado, dejala tirada para la izquierda"). El texto vuelve a apoyarse
  en el borde izquierdo del contenedor (`max-w-6xl`), con la columna de `max-w-3xl`
  alineada a la izquierda: sin `text-center` y sin `mx-auto`. Las dos variantes que
  se habían ofrecido eran bloque centrado con texto a la izquierda, o todo centrado
  (la que se probó y no gustó). No volver a centrarlo sin un pedido explícito.
- El espacio doble de "en la facultad  U de Rosario" quedó corregido.

## Tercera pantalla: el diccionario (2026-10-07)

> **Rehecha por el autor después de este registro.** La entrada con las dos líneas
de 1px se reemplazó por un title card con el logo a gran escala, un bloque que
alterna con desenfoque y un morph del logo hacia el navbar. Es trabajo en curso en
el árbol, sin commitear al 2026-10-07, así que este documento ya no describe esa
pantalla.

El autor pidió una entrada tipo diccionario que defina la marca. Primero se probó
debajo del h1 de la historia: el bloque de 340px llevaba la primera pantalla de
723px exactos a 892px y dejaba de entrar, así que se le dio su propia pantalla
centrada. Después pidió lo contrario: que abra la página, antes de la historia, y
con márgenes normales de sección, sin ocupar una pantalla. La página queda:
diccionario, historia, equipo, cómo trabajamos, cita y CTA. El borde de arriba
pasa del diccionario a la historia: el primer bloque debajo del header no lleva
borde propio.

- El bloque: 1px arriba y abajo en verde, sin caja cerrada, palabra a 36px,
  fonética y categoría a 12px mono con 0.25em de espaciado, acepciones a 20px con
  interlineado de 32.5px. Solo verde y crema.
- La palabra usa la display del sitio porque el logo del header es un SVG
  trazado, no una fuente.
- La ficha entra con el desenfoque como el resto del texto suelto.
