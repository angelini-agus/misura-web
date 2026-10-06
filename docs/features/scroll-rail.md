# Riel de scroll: la regla y el nonio (solo desktop)

## Por qué existe

La barra nativa se corta visualmente en el borde de cada sección (el fondo alterna
crema y verde) y no queda pegada al borde real de la ventana. Este riel es propio,
**opaco** y vive fuera del contenido de las páginas, así que se ve igual sobre
cualquier superficie. Está construido como un **pie de rey vertical**: el riel es la
regla con dos escalas grabadas, el thumb es el nonio que corre por ella, y la pieza
está despegada del borde de la ventana y arranca debajo del header.

En mobile no hay riel: queda una marca de lectura de 2x12px sobre el borde derecho y
la barra nativa se oculta igual, porque la referencia de scroll la da lo propio.

## Anatomía

| pieza del calibre | qué es |
| --- | --- |
| regla (escala fija) | el riel: 14px de ancho, `border-inline` de 1px y dos columnas de 4px separadas por 4px de canaleta. Fina: marca de 1px cada 8px. Gruesa: marca de 2px cada 40px |
| nonio (escala móvil) | el thumb verde. Lleva 5 marcas crema cada 6.4px = 4/5 de la división fina, que es la relación real de un nonio de 5 divisiones: lee la quinta parte de la escala |
| corredera | el cuerpo del nonio. El alto mínimo es 40px para que entren el vernier (27px) y el tornillo (6px) con sus aires |
| tornillo de fijación | cuadrado crema de 6px con ranura verde: gira 45° mientras se arrastra el nonio |
| quijada fija y tope | bloques macizos de 2px en los dos extremos del riel |

## Cómo se calcula

```js
docH   = document.documentElement.scrollHeight    // alto del contenido
viewH  = window.innerHeight
railH  = rail.clientHeight                        // alto del riel (ver geometría)
thumbH = clamp(railH * (viewH / docH), 40, railH) // mínimo 40px de pieza
travel = railH - thumbH
maxY   = docH - viewH
y      = clamp(scrollY / maxY, 0, 1) * travel     // mapeo lineal 1:1
```

Las métricas se miden en carga, en `resize`, al cambiar el estado del media query y
cuando el documento cambia de alto (`ResizeObserver` sobre el `body`): **nunca** en el
evento de scroll. Por frame solo corre la aritmética y se escribe
`transform: translate3d()`; nada de `top` ni `margin`.

## Geometría: despegado, debajo del header y sin recortes

La pista (`#scroll-rail-track`) es un wrapper `absolute; inset: 0` con
`pointer-events: none` (cubre el documento entero: sin eso se comería todos los
clicks) y `z-index: 40`, así que el header (`z-50`) siempre gana. El riel adentro es
`sticky`, y por eso `body` es `position: relative`: sin ancestro posicionado la pista
se resolvería contra el viewport y el riel no podría viajar con el scroll.

- `margin-block-start: calc(var(--announcement-h) + var(--nav-h) + 0.5rem)` = 121px
  medidos (anuncio 36px + header 77px + 8px): arranca debajo del bloque completo en
  scroll 0.
- `top: calc(var(--nav-h) + 0.5rem)`: cuando el header se pega, el riel se estaciona
  8px debajo.
- `height: calc(100dvh - var(--announcement-h) - var(--nav-h) - 1rem)`: el alto está
  medido para el estado de scroll 0 y **no** para el pegado, para que la pieza se vea
  entera en el primer golpe de vista (de 121px a pliegue-8px). Con el alto del estado
  pegado el tope de abajo caía 28px por debajo del pliegue.
- `margin-inline-end: 0.5rem` y `bottom: 0.5rem`: 8px de aire contra el borde derecho
  y contra el inferior. El texto del contenido nunca se acerca a menos de 24px del
  borde derecho, así que quedan 2px de aire reales.
- El alto es constante a propósito: cambiarlo al cruzar el umbral del sticky sería un
  salto de layout visible. La consecuencia es que, con el header pegado, quedan 44px
  de aire abajo.

## Ciclo de vida (View Transitions)

`astro:page-load` inicializa, `astro:before-swap` limpia (listeners, frame, observer y
las clases de arrastre) y `astro:after-swap` repone las clases del `<html>`, porque el
router las pisa en cada navegación con las del HTML servido. Es el mismo problema que
tenía la clase `js`.

`has-rail` (desktop) y `has-mark` (mobile) las marca el `<head>`
(`BaseLayout.astro`) antes del primer pintado: marcarlas después reflowea el contenido
6px cuando la barra nativa libera su espacio (medido: CLS 0,032 contra 0,011 de base).

## Mobile: marca de lectura

Sin riel (no hay ancho ni hover): `#scroll-mark` es un trazo de 2x12px a 4px del borde
derecho que sigue el scroll con `transform: translate3d()`, sin arrastre ni click. La
barra nativa se oculta con la misma clase `has-mark`.

## Medido en la página real (build de producción, CDP)

| chequeo | resultado |
| --- | --- |
| riel a 1280x900 | 14x771 en x=1258, `border-inline` 1px, `box-shadow: none` |
| scroll 0 | top 121 (8px debajo del header) y bottom 892 = pliegue - 8px: sin recorte |
| header pegado (scroll 200) | top 85 (8px debajo del header), bottom 856: 44px de aire |
| thumb 1:1 al 50% | 3960px de scroll y el transform coincide con `p * travel` |
| arrastre | 120px de arrastre llevan el scroll de 3960 a 5271; `is-dragging` y `rotate: 45deg` durante el arrastre, `is-settling` al soltar y se limpia en `animationend` |
| click en tramo libre | salta al punto clickeado con scroll suave |
| reduced-motion | `animation-duration` queda en 1e-05s: el asentamiento se neutraliza y la información queda |
| mobile 390x844 | `has-mark`, riel `display: none`, nativa oculta, marca de 2x12 con `translate3d` exacto al 75% del scroll |
| CLS | sin cambios: la pista es `absolute` y el riel `sticky`, los dos fuera de flujo |

## Estética

Riel crema opaco de 14px con dos escalas grabadas (fina cada 8px, gruesa cada 40px),
extremos macizos de 2px, nonio verde con sus 5 marcas de vernier y tornillo que gira al
arrastrar. Sin gradientes suaves, sin sombras, sin radius.

Se probó un marco de 2px con placa dura de 2px para que el riel le ganara a las líneas
de 1px que separan secciones: el autor lo descartó y quedó el borde de 1px.
