# Riel de scroll con forma de pie de rey

## Objetivo

El riel propio deja de ser una barra pegada al borde de la ventana y pasa a leerse
como un **pie de rey vertical**: la regla es el riel con dos escalas grabadas, el
nonio es el thumb que corre por ella, y la pieza vive despegada del borde, debajo
del header. En mobile no hay riel: queda una marca de lectura mínima y la barra
nativa se oculta (el pedido original: "eliminá la barra de navegación original ya
que agregamos la propia con JS").

## Decisiones (elegidas por el autor)

| Tema | Decisión |
| --- | --- |
| Escala | Doble graduación: fina (1px cada 8px) en la columna izquierda, gruesa (2px cada 40px) en la derecha, riel de 14px |
| Despegue | `right: 0.5rem`, `bottom: 0.5rem` |
| Arranque | Nunca tapado por el header y sin hueco: `sticky`, no `fixed` |
| Capa | `z-40`: el header (z-50) gana. Hoy el riel es z-60 y pinta encima del header |
| Nonio | 5 marcas de vernier, tornillo que gira 45° al arrastrar, asentamiento al soltar |
| Extremos | Quijada fija arriba y tope abajo, macizos de 2px |
| Mobile | Sin riel: marca de lectura de 2x12px sobre el borde derecho, nativa oculta |

## Medidas tomadas antes de escribir (CDP sobre el build, home)

| Dato | Valor |
| --- | --- |
| Barra de anuncio | 36px |
| Header (`--nav-h` a md+) | 77px |
| `headerBottom` en scroll 0 | 113px |
| Riel actual | 10x900 en `x=1270`, `z-60`, thumb 92px con docH 8820 |
| Texto más cerca del borde derecho | 24px (1024), 88px (1280) |
| SVG decorativo del hero | 19.6px del borde a 1024; un `rect` se sale 22px a 768 |
| Fijos a la derecha en desktop | ninguno (`StickyCta` es `md:hidden`) |
| z-index del sitio | 40 (StickyCta), 50 (header + menú), 60 (riel), 100 (skip link, overlay) |

Consecuencia: con riel de 14px e inset de 8px (banda 8-22px) el texto queda a 2px
de aire y el SVG decorativo del hero se toca 2.4px. Si molesta, el inset pasa a 6px.

Por qué `sticky` y no `fixed`: un riel `fixed` que arranca en `--nav-h + 8px` deja
un hueco de 36px en cuanto el header se pega (el anuncio mide 36px y scrollea). El
riel `sticky` arranca debajo del bloque completo en scroll 0 y se estaciona a 8px
del header cuando este se pega: nunca queda tapado y nunca deja hueco.

## Tareas

- [x] Riel con doble escala, despegado del borde y sticky debajo del header
- [x] Nonio: marcas de vernier, tornillo que gira al arrastrar, asentamiento al soltar
- [x] Marca de lectura de scroll en mobile (nativa oculta)
- [x] Verificación: build, `astro check`, medición CDP y captura
- [x] Docs: `docs/features/scroll-rail.md` + excepción 4 en `design-philosophy.md`

## Verificación

| Chequeo | Resultado |
| --- | --- |
| `npm run build` | 11 páginas, limpio |
| `npx astro check` | 0 errores, 0 warnings, 0 hints (se arreglaron también los 6 errores históricos de `ScrollRail.astro`) |
| Geometría a 1280x900 | riel 14x771 en x=1258, borde de 1px, `box-shadow: none`, inset 8px |
| Pieza completa en scroll 0 | top 121 (8px debajo del header), bottom 892 = pliegue - 8px |
| Header pegado | top 85 (8px debajo), 44px de aire abajo: consecuencia del alto constante |
| Thumb 1:1 al 50% | coincide con `p * travel` |
| Arrastre, tornillo y asentamiento | scroll 3960 → 5271 con 120px de arrastre; `rotate: 45deg` durante; `is-settling` se limpia en `animationend` |
| Click en tramo libre | salta al punto clickeado |
| reduced-motion | `animation-duration` 1e-05s |
| Mobile 390x844 | sin riel, con marca de 2x12 al 75% exacto, nativa oculta |
| Regresión de `body { position: relative }` | flechas del carrusel medidas en su contenedor (x=88 y x=1152), sin corrimientos |
| Lighthouse | **pendiente**: no se corrió (no está instalado en el repo) |

## Abiertos

- **El alto constante deja 44px de aire abajo** cuando el header se pega: es el precio
  de que la pieza se vea entera en scroll 0. La alternativa (alto del estado pegado)
  es la que recortaba el tope inferior, y la otra (alto variable) sería un salto de
  layout al cruzar el umbral.
- **El marco de 2px con placa dura se probó y se descartó**: separaba mejor el riel de
  las líneas de sección, pero el autor prefirió el borde de 1px. Queda documentado en
  `docs/features/scroll-rail.md`.
- **La marca de mobile es verde sobre fondo verde**: sobre las bandas verdes del sitio
  el trazo de 2px se pierde. Si molesta, la solución es la misma placa dura de 2px que
  se probó para el riel.
