# Feature: inicio más corto y /proyectos abriendo con el portfolio

## Objetivo

Pedido del autor (2026-10-07), en dos mensajes:

1. El inicio "está muy largo, hay mucho texto, te perdés y hay redundancia: se
   dice dos veces lo mismo". Sacar la sección "Cómo trabajamos" (el proceso, que
   ya está explicado en `/nosotros`) y cambiar el bloque del equipo, que era
   idéntico al de `/nosotros`, sin eliminarlo.
2. En `/proyectos`, sacar el encabezado que dice "Proyectos" y que la página
   arranque directamente con lo que dice "Portfolio". Y que el scroll del mazo
   vaya más lento, para que la animación se aprecie.

El autor pidió opinión antes de ejecutar. Se le presentó la medición y eligió, de
cuatro opciones, el recorte conservador: solo la sección de proceso y el bloque
de equipo.

## Diagnóstico medido (1280×800, antes)

| Sección del inicio | Alto | Palabras |
| --- | --- | --- |
| Preguntas frecuentes | 948px | 280 (vienen plegadas: no son muro de texto) |
| Diferenciales | 735px | 151 |
| Servicios | 738px | 146 |
| Problema | 731px | 135 |
| Para vos | 695px | 131 |
| Cómo trabajamos | 523px | 117 |
| Equipo | 724px | 69 |
| Clientes / Explorar / Hero | 674 / 603 / 687 | 74 / 90 / 71 |

Total: 8204px, **11.3 pantallas**, 1337 palabras, 11 secciones.

La redundancia denunciada es literal: "Cómo trabajamos" (los 4 pasos: entrevista,
prototipo gratis, entregas semanales, mantenimiento) y "Diferenciales" (los 4
compromisos: entrevista de 2 horas, arreglos gratis, prototipo gratis, plazos por
contrato) son la misma promesa contada dos veces.

## Decisiones (autor)

| Tema | Decisión |
| --- | --- |
| Recorte | Solo sacar "Cómo trabajamos" y compactar el equipo. No se agrega la franja de casos del componente huérfano `Portfolio.astro`, ni se toca la FAQ. |
| Equipo | Solo las 2 fotos y el link a `/nosotros#nosotros`: sin nombres, roles, bios ni descripción. |
| Scroll de `/proyectos` | 80dvh por proyecto. El 100dvh original ya se había sentido lento; el 60dvh actual, rápido. |

## Alcance

- `src/pages/index.astro`: se va `HowItWorksHome`; entra `TeamTeaser`.
- `src/components/HowItWorksHome.astro`: se borra (el sitio ya tenía un componente
  muerto, `Portfolio.astro`; no se suman más).
- `src/components/TeamTeaser.astro`: nuevo, para el inicio.
- `src/pages/proyectos.astro`: se va el `PageHeader` de esa página.
- `src/components/ProjectsStack.astro`: el `h2` pasa a `h1`, se va el `border-t` y
  el carrete sube a 80dvh por proyecto.
- `src/lib/content.ts`: se va `pages.proyectos.intro`, que queda sin uso. El copy
  del equipo no se toca: el teaser reusa `team.eyebrow` y `team.title`.

## Fuera de alcance

- `PageHeader` sigue en las 8 páginas que lo usan (`contacto`, `privacidad` y los
  6 casos de estudio).
- `howWeWork` y la sección "Cómo trabajamos" siguen en `/nosotros`.
- La tarjeta de "Explorá" que apunta a `/nosotros` conserva su copy: es el puntero
  al proceso, no lo explica.
- La FAQ no se toca: es el único activo de SEO/GEO del inicio y viene plegada.

## Criterios de aceptación

1. El inicio no renderiza ninguna sección "Cómo trabajamos" y no quedan archivos
   huérfanos por ese recorte.
2. El bloque de equipo del inicio no repite ni la descripción ni las bios de
   `/nosotros`.
3. `/proyectos` tiene un solo `h1` ("Casos de éxito"), ningún `h2`, y la primera
   sección no lleva `border-t`.
4. El carrete de `/proyectos` da 80% de pantalla de scroll por proyecto y las 6
   carpetas pasan al frente en orden.
5. `npx astro check` y `npm run build` pasan.

## Estado

Implementado y verificado (2026-10-07).

| Métrica (1280×800) | Antes | Después |
| --- | --- | --- |
| Alto del inicio | 8204px | 7512px |
| Pantallas del inicio | 11.3 | 10.4 |
| Palabras del inicio | 1337 | 1159 |
| Secciones del inicio | 11 | 10 |
| Bloque de equipo del inicio | 724px / 69 palabras | 555px / 8 palabras |
| Scroll por proyecto en `/proyectos` | 480px (60dvh) | 640px (80dvh) |
| Alto de `/proyectos` | 4703px | 5355px |

Verificado por CDP: un solo `h1` en `/proyectos`, cero `h2`, `border-top: 0px` en
la sección, carrete de 4640px y el frente del mazo avanzando 0 → 5 en orden a lo
largo del carrete. `astro check` 0 errores / 0 warnings / 0 hints y build de 11
páginas en las cuatro unidades.

Queda sobre la mesa, si el autor quiere seguir acortando: la FAQ (948px) y unir
"Para vos" con "Diferenciales" (1426px y 282 palabras entre las dos).
