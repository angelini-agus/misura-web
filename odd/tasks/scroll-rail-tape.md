# Riel de scroll como cinta métrica

## Objetivo

El riel propio deja de ser un pie de rey y pasa a leerse como una **cinta métrica
colgada**: la punta (el gancho) queda apoyada arriba, 8px debajo del navbar, y la
caja viaja hacia abajo a medida que se scrollea, escupiendo la cinta graduada. El
número que queda contra la boca de la caja es el avance de la página en porcentaje.

Reemplaza al riel de pie de rey (`docs/features/scroll-rail.md`), que queda como
historia de la pieza anterior.

## Decisiones (elegidas por el autor, 2026-10-06)

| Tema | Decisión |
| --- | --- |
| Qué mide | Porcentaje de avance: marca fina cada 1%, media cada 5%, número cada 10 (10 a 100) |
| Impresión | Números rotados 90° sobre una cinta fina de 16px, con la columna de marcas a la derecha |
| Sentido físico | La punta (0) queda fija arriba, debajo del navbar; la caja viaja hacia abajo y la cinta se estira entre las dos |
| Mobile | Queda la marca de lectura de 2x12px de hoy: no hay ancho para números ni para la caja |
| Lectura | Analógica: el número pegado a la boca de la caja. Sin contador extra |
| Interacción | Se conserva la del nonio: arrastre de la caja 1:1, click sobre la cinta para clavar la boca en esa graduación, asentamiento al soltar y tornillo que gira mientras se arrastra |

## Espacio disponible medido (glifos, build de producción, CDP)

Distancia mínima del borde derecho de la ventana al glifo más cercano, por página
(`/`, `/nosotros`, `/proyectos`, `/contacto`) y por ancho:

| ancho | glifo más cercano | dónde |
| --- | --- | --- |
| 768 | 24px | `contacto@misure.dev` (footer) |
| 1024 | 24px | `contacto@misure.dev` (footer) |
| 1280 | 88px | `contacto@misure.dev` (footer) |
| 1440 | 168px | `contacto@misure.dev` (footer) |
| 1600 | 248px | `contacto@misure.dev` (footer) |

Consecuencia: la banda del riel tiene que entrar en 24px hasta 1024px. La cinta de
16px con 6px de aire deja una banda de 22px, igual que el riel de hoy (14 + 8): 2px
de aire contra el glifo. Los anchos grandes quedan libres, pero no se usan: una sola
cinta en todos los anchos (decisión del autor).

## Anatomía

| pieza de la cinta | qué es |
| --- | --- |
| punta (gancho) | bloque verde de 16x3px con un diente de 5x3px que sube hacia el navbar. Es el 0 de la cinta y no se mueve |
| cinta | tira de 16px de ancho, crema opaca con bordes verdes de 1px, graduada: fina 2px cada 1%, media 3px cada 5%, mayor 5px cada 10%. Los números van rotados 90° en una columna de 9px a la izquierda, centrados en su marca |
| caja | bloque verde macizo de 16x44px con línea crema de boca arriba, línea crema de tope abajo y remache crema de 6px que gira al arrastrar. Viaja con el scroll |
| largo de la cinta | `travel = alto del riel - alto de la caja`: a 900px de alto de ventana son 727px |

La cinta **no se estira**: es una tira del largo máximo, graduada una sola vez, y se
recorta con `clip-path: inset()` a la altura de la boca de la caja. Eso es lo que
pasa en el objeto real: el material sale de la caja y las graduaciones quedan fijas
respecto de la punta, así que las marcas no se mueven al scrollear, solo aparecen.

## Cómo se calcula

```js
docH    = document.documentElement.scrollHeight
viewH   = window.innerHeight
railH   = rail.clientHeight                            // alto del riel
caseH   = case.offsetHeight                            // 44px
travel  = railH - caseH                                // recorrido de la caja
maxY    = docH - viewH
p       = clamp(scrollY / maxY, 0, 1)
y       = p * travel                                   // posición de la boca de la caja
unit    = travel / 100                                 // 1%: 7,27px con travel 727
clip    = inset(0 0 (travel - y) 0)                    // recorte de la cinta
```

Por frame solo corre esa aritmética y se escriben dos propiedades: `transform:
translate3d()` en la caja y `clip-path` en la cinta. Las métricas se miden en carga,
`resize`, cambio de media query y cambios de alto del documento (`ResizeObserver`
sobre `body`), nunca en el evento de scroll.

## Tareas

- [x] Medir el espacio disponible contra el borde derecho y decidir ancho con el autor
- [ ] Marcado y estilos de la cinta (punta, cinta graduada, caja) en `ScrollRail.astro`
- [ ] Geometría y pintado por frame (recorte de cinta, viaje de la caja, números por medida)
- [ ] Interacción: arrastre de la caja, click sobre la cinta, asentamiento, tornillo
- [ ] Verificación: build, `astro check`, medición CDP (geometría, lectura, arrastre, reduced motion, costo del recorte), capturas
- [ ] Docs: `docs/features/scroll-tape.md`, excepción 4 de `design-philosophy.md`, cierre de este doc

## Verificación

| Chequeo | Resultado |
| --- | --- |
| `npm run build` | pendiente |
| `npx astro check` | pendiente |
| Geometría a 1280x900 | pendiente |
| Lectura al 50% | pendiente |
| Arrastre de la caja | pendiente |
| Click sobre una graduación | pendiente |
| reduced-motion | pendiente |
| Costo por frame del recorte | pendiente |
| Mobile 390x844 | pendiente |

## Abiertos

- **El recorte de la cinta es paint por frame**, no transform: la cinta está clipada
  y solo se mueve el borde inferior del recorte. `clip-path` no es propiedad de
  layout y el área es de 16x727px, pero es un costo que el riel anterior (solo
  transform) no tenía. Se mide y se documenta; si el costo apareciera, la salida es
  volver al modelo caja fija arriba (la cinta sale hacia abajo) o animar el alto.
- **El número 100 no puede centrarse en su marca**: a caja llena la marca cae justo
  en la boca y el número quedaría cortado. La regla es que ninguna etiqueta puede
  salirse del largo de la cinta, así que la última se apoya sobre su marca.
