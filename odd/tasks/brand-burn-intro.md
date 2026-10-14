# Feature: el preload del hierro (BOTTEGA quemado)

## Objetivo

Reemplazar por completo el preload de la home (`BrandBurn.astro`, que el autor
descartó: "la animación que ya está está horrible no sirve") por una escena de
herrería: el hierro **sube frío desde abajo**, se **calienta con llamas verdes que
llegan desde el costado**, **se carga hacia atrás** y da **un solo masazo** que
estampa **bottega** en el papel. El hierro se desvanece y queda el wordmark
quemado, que es el mismo glifo que después ocupa la apertura de marca del hero.

Todo el dibujo (hierro, llamas, chispas, humo) es SVG y CSS propios. Sin
librerías, sin canvas, sin imágenes.

## Narrativa (lo que pidió el autor)

1. El hierro sale **desde abajo**, frío, con movimiento dinámico y nada robótico.
2. Se calienta: **llamas verdes que salen desde el costado**, no un fuego
   envolviéndolo.
3. **Carga hacia atrás** (anticipación) y pega **un solo masazo**.
4. El hierro **se desvanece** y queda **bottega** quemado.
5. Todo en **tonos de verde y crema**. Nada fuera de la paleta.

## Decisiones

1. **Paleta**: crema `#F1E8DB` de fondo, `--color-cream-light #FBF7F0` como
   blanco caliente del núcleo de la llama, `--color-green #0E3B33`,
   `--color-green-light #0F4238`, `--color-green-dark #0A2D27`, y **un solo tono
   nuevo**: el verde caliente `#158a63`, que existe únicamente dentro del preload.
2. **La palabra del preload usa las clases reales de la marca**
   (`wordmark wordmark-hero`, las mismas de `BrandOpening`): así el glifo, el
   peso, el interletrado y el `clamp` del tamaño son los del sitio por
   construcción, no por copia.
3. **El relevo es una coincidencia de caja**: el preload mide dónde queda el
   wordmark del hero con `offsetTop`/`offsetLeft` acumulados (inmunes a las
   transformaciones de `data-reveal`) y planta su propia palabra ahí. El overlay
   se retira con un `clip-path` (la hoja se enrolla hacia arriba) y lo que
   aparece es el mismo glifo, en el mismo píxel, ya limpio.
4. **La animación es declarativa**: una sola clase (`is-running`) dispara todo y
   los tiempos viven en los `animation-delay` de la CSS. El JS solo mide, prende
   la clase, marca la sesión y limpia. Nada de una línea de tiempo en JS.
5. **Un solo masazo**: el golpe es uno. No hay repiqueteo, ni dos impactos, ni
   vibración sostenida: un golpe seco y su rebote.
6. **Nada de movimiento lineal**: cada tramo usa su propia curva. La subida tiene
   sobrepaso y asentamiento, la carga hacia atrás es lenta, el golpe es de 90ms y
   las llamas respiran con duraciones distintas entre sí (0,45s a 0,85s), que es
   lo que separa "fuego" de "parpadeo".
7. **El preload corre una vez por sesión, solo en la home** y se saltea en tres
   casos: ya se vio, la URL trae hash (alguien entró a `/#contacto`), o el
   navegador restauró un scroll (una recarga a mitad de página). Con
   `prefers-reduced-motion: reduce` no corre nunca.
8. **Sin flash en la segunda visita**: la decisión vive en el `<head>`
   (`BaseLayout.astro`, clase `has-burn` en el `<html>`), igual que `has-rail`.
   Decidirlo en el componente mostraría un frame de pantalla crema.

## Línea de tiempo (2.400ms)

| t | Fase | Qué se ve |
| --- | --- | --- |
| 0 – 620 | Subida | El hierro entra desde abajo de cuadro, frío (verdes apagados), con un sobrepaso chico y un asentamiento: nunca en línea recta |
| 500 – 1100 | Calentamiento | Las llamas entran desde el costado derecho y lamen la cara del hierro; el brillo crece desde el borde de la pieza hacia la cara |
| 1100 – 1420 | Carga hacia atrás | El hierro sube y rota hacia atrás, lento: es la anticipación del golpe |
| 1420 – 1500 | Masazo | Caída seca de 80ms hasta la superficie. Un solo golpe |
| 1500 | Impacto | Destello verde caliente desde el punto de contacto, el tablero tiembla una vez y se asienta, salen tres chispas |
| 1500 – 2100 | Quemado | Las siete letras se queman desde el centro del golpe hacia las puntas (70ms entre una y otra, 380ms cada una): verde caliente, después verde de marca, después carbón con el borde ahumado |
| 1650 – 1950 | Desvanecimiento | El hierro se va: sube, se encoge y un jirón de humo crema lo termina de tapar. Solo se ve el rebote |
| 2100 – 2150 | Queda el texto | La brasa del centro se apaga, el resplandor perimetral se va |
| 2150 – 2400 | Relevo | El overlay se enrolla hacia arriba con un `clip-path` y deja a la vista el hero, con el wordmark en el mismo píxel |

## Verificación

| Chequeo | Resultado |
| --- | --- |
| `npx astro check` | 0 errores, 0 warnings, 0 hints (67 archivos) |
| `npm run build` | 11 páginas, limpio |
| La caja del texto quemado contra el wordmark del hero | **377,289 · 684×192** contra **377,289 · 685×192** (la caja del hero medida por offset acumulado; su `getBoundingClientRect` da 305 porque todavía tiene los 16px de `data-reveal`, que es exactamente por lo que se mide por offset) |
| Tiempos declarados (leídos del DOM) | el hierro 2,4s; las letras 0,38s con 1,71s de retardo (la del centro, `i=0`, arranca en 1,5s y la de la punta en 1,71s); las llamas 0,88s con 0,47s; el destello 0,32s con 1,49s; el retiro 0,25s con 2,15s |
| El silencio del arranque | En el cuadro 0% el hierro está en `translateY(168vh)` y su borde de arriba cae siempre debajo del pliegue: medido a 1080 (1427 contra 1080), 900 (1125), 776 (917), 668 (735) y 540 (582, con el hierro compactado a 325px por el tope de 46vh). Las letras y las llamas arrancan en opacidad 0 |
| Segunda visita de la sesión | `has-burn` ausente, overlay `display: none`, ni un frame de crema |
| Entrada con hash (`/#contacto`) | No corre |
| `prefers-reduced-motion: reduce` | No corre |
| Recarga con scroll restaurado | Con el navegador restaurando 2142px, no corre |
| El final | `has-burn` fuera, `display: none`, el `overflow` restaurado y la marca de sesión escrita |
| Capturas de las fases | 10 cuadros en `%TEMP%/hero-shot/preload/`, montaje en `fases-preload.png` y el zoom del hierro en `zoom-hierro.png` |

## Lo que costó (aprendido en la implementación)

1. **Un cuadro implícito en 0% puede arruinar una animación.** En el `@keyframes`
del hierro la opacidad aparecía solo a partir del 83%, y Chrome creó el cuadro
implícito de 0% con el valor de base (1): la opacidad bajaba en rampa **desde el
arranque**, así que a los 1,2s el hierro ya no existía y el masazo no tenía
hierro. Regla: si una propiedad cambia tarde, hay que declararla también al
principio.
2. **El destello tiene que caber en el golpe.** La primera versión era de 680×220
con 460ms y un pico de 0,62: lavaba el cuadro del masazo y el hierro se veía
fantasmal. Quedó en 520×150, 320ms y 0,5.
3. **El humo no puede empezar sobre el rebote.** Arrancaba a 1560ms y tapaba el
hierro justo en el rebote (66%): se corrió a 1700ms, después del golpe.
4. **El silencio necesita un tope por alto de ventana.** Con `translateY(118vh)`
el hierro asomaba en ventanas de 668px o menos: el recorrido tiene que cubrir el
alto de la ventana **más** el alto de la pieza. Se resolvió con 168vh y un ancho
`min(clamp(190px, 23vw, 296px), 46vh)`, que achica el hierro en ventanas bajas
(achica el objeto, no recorta nada).

## Abiertos

- **El costo es real**: 2,4s de ceremonia por sesión, sin salteo (decisión del
  autor). La métrica de la primera pintura la define el texto quemado (~1,5s),
  no el hero.
- Si el autor quiere más aire entre el golpe y el relevo, se toca un número: el
  arranque del quemado o el largo del asentamiento.
- **Tests de sincronía**: el harness no puede capturar el cuadro 0% exacto (los
  `waitForFunction` de puppeteer sondean cada ~100ms), así que el silencio se
verificó por cálculo del cuadro declarado, no visualmente. Si alguna vez hay que
ajustarlo con precisión, el camino es `Animation.setPlaybackRate(0)` por CDP.
