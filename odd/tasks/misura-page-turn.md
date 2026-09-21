# Feature: Transición de página

## Estado

La transición es un **fundido puro** de opacidad (`page-out` 300ms `ease-in`,
`page-in` 340ms `ease-out`) sobre `::view-transition-old/new(root)`. Sin
`translateY`, sin dirección, sin movimiento.

La barra de anuncio y el `<header>` quedan **fuera del fundido**: llevan
`transition:name="site-announcement"` y `transition:name="site-header"` en
`src/components/Header.astro`, y en `global.css` sus pseudo-elementos `old`/`new`
llevan `animation: none` (unlayered, para ganarle al crossfade de 180ms que
Astro emite dentro de `@layer astro`) y sus grupos `z-index: 100`.

Detalle completo: `docs/features/page-turn-transition.md`.

> El nombre del archivo es histórico: empezó como "page-turn" (giro de hoja) y
> hoy describe un fundido.

- **Estado:** fundido puro con la barra superior estática, implementado y verificado por build/CSS emitido; pendiente de revisión visual del autor.
- **Rama:** `feat/page-turn-transition`
- **Autorización:** el usuario aprobó el slide direccional y eligió la opción A: se actualiza la filosofía y se cae la metáfora del libro.

## Objetivo final

Que el cambio de ruta tenga dirección: al avanzar en el sitio la página sale
hacia la izquierda y la nueva entra desde la derecha; al retroceder, se espeja.
La dirección la define la posición en el navbar, no el historial del navegador.

## Historial

1. Primera versión: `page-turn` con `rotateY` sobre el lomo (`leaf-out`/`leaf-in`),
   no direccional. Descartada.
2. Versión final: slide horizontal direccional.

## Diagnóstico que condiciona el diseño

El commit `5ae525e` revirtió un `clip-path` en el reveal porque Chrome calcula
intersección 0 en un elemento observado recortado a 0 de altura: el
`IntersectionObserver` nunca dispara y el contenido queda oculto. Por eso el
efecto se hace solo con `transform` y `opacity`, nunca con `clip-path`.

## Implementación

- `src/layouts/BaseLayout.astro`: script inline que escucha `astro:before-preparation`,
  resuelve la posición de origen y destino en
  `NAV_ORDER = ["/", "/nosotros", "/proyectos", "/contacto"]`
  (`/proyectos/<slug>` cuenta como 2.5), y escribe
  `document.documentElement.dataset.navDir = "forward" | "back"`. `event.direction`
  queda solo como fallback cuando alguna ruta no está en el orden.
- `src/styles/global.css`: `slide-out-forward`, `slide-in-forward`,
  `slide-out-back` y `slide-in-back`, aplicados con
  `:root[data-nav-dir="..."]::view-transition-old/new(root)`. Solo `transform` y
  `opacity`, 300ms/340ms con `--ease-out`, dentro de
  `@media (prefers-reduced-motion: no-preference)`.
- `docs/features/page-turn-transition.md`: documenta el slide direccional.

## Tareas

- [x] Implementar el slide direccional
- [x] Documentar la feature
- [x] Actualizar la filosofía de diseño (se cae la metáfora del libro)
- [x] Verificar: build, astro check y CSS emitido
- [x] Barra superior fuera del fundido (navbar estático con `transition:name`)
- [x] Reconciliar la documentación con el estado real del working tree
- [ ] Commit de la unidad (pendiente de autorización del autor).

## Evidencia

- `npm run build` → exit 0, 10 páginas, sin errores.
- `npx astro check` → exit 0, 55 archivos, 0 errores / 0 warnings / 0 hints.
- El CSS emitido contiene los cuatro keyframes y los selectores `data-nav-dir`;
  no queda rastro de `leaf-out`/`leaf-in` ni de `perspective(1200px)`.
- El HTML emitido incluye el script de dirección en todas las páginas y conserva
  `data-reveal` y `data-countup`.
- El CSS emitido conserva los cuatro selectores
  `::view-transition-old/new(site-announcement|site-header)` con `animation: none`
  y los dos `::view-transition-group(...)` con `z-index: 100`, fuera de todo
  `@layer`; el HTML emitido lleva `view-transition-name: site-announcement` y
  `view-transition-name: site-header`.
- `npx astro check` → 0 errores / 0 warnings / 0 hints; `npm run build` → 10
  páginas sin errores.

**No verificado:** el efecto visual en navegador real. No hay browser automation
en este entorno.

## Nota

El agente `design` (ruteado a Muse Spark) falló dos veces con "assistant reported
an error", así que esta unidad la implementó `gentle-ai-worker`.
