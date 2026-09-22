# Feature: Proyectos a lo ancho con sticky cards

## Objetivo

Que `/proyectos` deje de ser una grilla de 3 columnas con tarjetas chicas y pase
a ser una pila de bloques a lo ancho, uno por proyecto, donde el scroll va
apilando las tarjetas una sobre otra. Referencia: `geiko.dev/es/projects/`.

## Decisiones del usuario

1. **Solo en `/proyectos`.** El home conserva la grilla compacta: con 6 proyectos
   a pantalla completa, la home se vuelve larguísima antes del formulario.
2. **Dos proyectos más el navbar por pantalla**, o sea cada bloque mide
   `(100dvh − alto del navbar) / 2`. El mismo criterio en mobile.
3. **Sticky cards:** al scrollear, las tarjetas se van pegando y apilando una
   sobre otra.
4. **Imágenes a la izquierda, datos a la derecha**, con las 3 capturas de la
   galería del caso.
5. **Un botón «Ver el caso»** al final del bloque. El bloque no es clickeable
   entero.

## Mecanismo

El navbar sticky mide 67px en mobile y 77px desde `md` (el mismo valor que usa la
sección de contacto). La barra de anuncio **no** cuenta acá: cuando el visitante
llega a las tarjetas ya scrolleó y la barra se fue.

Cada tarjeta va dentro de una ranura más alta que ella y usa `position: sticky`
con un tope escalonado según su posición en el par:

- las pares se pegan arriba (`top: navbar`),
- las impares se pegan abajo (`top: navbar + media pantalla`).

Así el par llena la pantalla y el par siguiente lo tapa al subir, que es el
apilado pedido. El `z-index` no hace falta tocarlo: en el flujo normal, la tarjeta
posterior pinta encima de la anterior.

## Datos

No se inventa contenido. Cada bloque sale de lo que ya existe:

- las **3 imágenes** de `caseStudies[*].gallery`,
- el **cliente** (`client`), el **título** (`title`), la **categoría**,
- la **descripción** (`seo.description`),
- los **tags** de `technologies`,
- el **destino**: `/proyectos/<slug>`.

Las capturas usan el `ScreenshotFrame` compacto y el duotono del sistema, para
que el portfolio se lea como un conjunto y no como seis paletas distintas.

## Fuera de alcance

- El home: sigue con `Portfolio.astro` tal como está.
- El detalle inline por proyecto (el "Sobre el proyecto" de geiko). El detalle
  vive en la página del caso, que es a donde lleva el botón.
- Animación de entrada o de salida de las tarjetas: solo el apilado por scroll.

## Criterios de aceptación

1. En `/proyectos`, cada proyecto ocupa el ancho completo y mide la mitad de
   `100dvh − navbar`.
2. Dos bloques más el navbar suman exactamente una pantalla.
3. Al scrollear, las tarjetas se pegan y el par siguiente tapa al anterior.
4. Cada bloque muestra las 3 capturas a la izquierda y los datos a la derecha.
5. El botón «Ver el caso» lleva a `/proyectos/<slug>`.
6. El home no cambia.
7. `astro check` y el build pasan.

## Tareas

- [ ] El componente de la pila, con el apilado sticky
- [ ] `/proyectos` lo usa y deja de usar la grilla
- [ ] Verificar midiendo posiciones a distintas alturas de scroll

## Evidencia

Pendiente.
