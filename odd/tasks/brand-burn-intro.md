# Feature: el preload xilográfico (BOTTEGA impreso)

## Objetivo

El preload de la home es una **xilografía**: un taco de madera entintado que baja,
golpea seco sobre el lino, se queda presionando mientras la tinta pasa a la fibra,
y se despega inclinándose como lo haría un artesano. Abajo queda impreso
**BOTTEGA**, con el filete irregular del taco tallado.

Reemplaza a la escena del hierro con llamas (que el autor descartó: "es muy rápido
todo y no se entiende lo de las llamas"). La referencia histórica es una bottega
italiana del siglo XV/XVI: estampado artesanal con taco de madera sobre papel de
lino.

**La vista es cenital y en primera persona**: el taco es un rectángulo visto desde
arriba y su altura se cuenta con dos cosas, nada más: la escala (1,35 arriba, 1
abajo) y la sombra, que pasa de ancha y difusa a pegada y dura. No hay dibujo: el
taco es un bloque sólido y toda la información la dan las sombras de altura, la
física del golpe y la textura de la tinta.

## Paleta

| Pieza | Color |
| --- | --- |
| Lino | `#F2ECE1` (a tres puntos del crema del sitio: invisible en el relevo) |
| Taco | `#071A10` |
| Tinta | `#0A2F1D` |

## Decisiones

1. **Una sola idea por vez.** El ritmo se arregló repartiendo los 2,8s en menos
   cosas simultáneas: bajar (0,56s), presionar (0,44s), despegar (0,7s), revelar y
   asentar (1,1s superpuestos). Antes había cuatro cosas a la vez en 2,4s y por eso
   se sentía apurado.
2. **El taco no rebota como un sello de goma.** Se queda presionando 0,44s y se
   comprime a `scale(0,995)`: el gesto manual es el de transferir la tinta a la
   fibra, no el de estampar y salir.
3. **El despegue pivotea en la esquina de abajo a la izquierda** (`transform-origin:
   18% 88%`) y se va con `rotateX(8deg) rotateY(-5deg) scale(1.25)`, `blur(6px)` y
   opacidad: es un bloque que se levanta desde un borde.
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

## Línea de tiempo (2,8s)

| t | Fase | Qué se ve |
| --- | --- | --- |
| 0 → 0,44 | Subida y micro-envión | El taco entra alto: `scale(1.35)` con sombra ancha y difusa, sube a `scale(1.42)` |
| 0,44 → 0,56 | **El golpe** | `scale(1.42)` → `scale(1)` en 120ms con curva seca. La sombra se vuelve mínima y dura |
| 0,56 | El mazo | El lino da un sacudón seco de 1,5px en 190ms |
| 0,56 → 1,0 | Presión | `scale(1)` → `scale(0,995)`: el taco sigue apoyado, sin rebotar |
| 1,0 → 1,7 | Despegue | Pivotea desde un borde y se va: `rotateX(8deg) rotateY(-5deg) scale(1.25)`, `blur(6px)`, opacidad 0 |
| 1,0 → 2,15 | La impresión | Debajo del taco aparecen BOTTEGA y el filete; la tinta se asienta (opacidad 0,9 → 1) mientras el taco la va destapando |
| 2,38 → 2,8 | Relevo | El lino se enrolla hacia arriba con un `clip-path` y deja a la vista el hero |

## Verificación

| Chequeo | Resultado |
| --- | --- |
| `npx astro check` | 0 errores, 0 warnings, 0 hints |
| `npm run build` | 11 páginas, limpio |
| La impresión contra el wordmark del hero | **Idénticas**: 377,289 · 685×192 las dos (la caja del hero medida por offset acumulado; su `getBoundingClientRect` da 305 porque todavía tiene los 16px de `data-reveal`) |
| Línea de tiempos medida con `?burn=lento` | A 0,3x, leído del DOM: el taco en opacidad **1 y `blur(0px)`** durante toda la bajada y la presión (80, 380, 560ms), y recién en el despegue 0,55 a los 1000ms, 0,16 a los 1180 y 0 a los 1400; la tinta 0,9 → 1 de 1000 a 2150ms |
| Los cuatro casos de skip | Segunda visita, hash, movimiento reducido y recarga con scroll restaurado (probado con una recarga real a 2142px) |
| `?burn=1` | Dos pasadas seguidas en la misma pestaña arrancan las dos y la marca de sesión queda vacía |
| `prefers-reduced-motion` + `?burn=1` | Corre igual (el corte no aplica al forzado) |
| Capturas | Diez cuadros en `%TEMP%/hero-shot/preload/` (montaje `fases-preload.png`) y el zoom del lino en `zoom-lino.png` |

## La trampa que nos comió TRES veces

**El cuadro implícito de 0%.** Si una propiedad aparece solo en los cuadros
finales, Chrome crea el cuadro de 0% con el valor de base y **interpola en rampa
desde el arranque**. En esta escena pasó con la opacidad del hierro (se
desvanecía antes del masazo) y con la opacidad y el `filter: blur()` del taco (se
veía la impresión a través del bloque, y el bloque se venía desenfocando desde el
primer cuadro). **Regla del proyecto: toda propiedad que cambia al final se declara
también al principio, en cada cuadro hasta el cambio.**

## Abiertos

- **El costo**: 2,8s de ceremonia por sesión, sin salteo. La primera pintura la
  define la impresión (~0,6s), no el hero.
- **El harness no puede capturar el cuadro 0 exacto** (los `waitForFunction` de
  puppeteer sondean cada ~100ms): el arranque se verifica por cálculo del cuadro
  declarado o con `?burn=lento`, no con capturas a tiempo real.
