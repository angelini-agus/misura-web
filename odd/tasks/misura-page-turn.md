# Feature: Transición de página tipo hoja de libro

- **Estado:** en progreso
- **Rama:** por definir (hoy `master`)
- **Autorización:** el usuario aprobó arrancar por el page-turn
- **Origen:** `docs/features/design-philosophy.md` (movimiento analógico: "cambiar
  de página es dar vuelta una hoja de un libro")

## Objetivo

Reemplazar el cambio de ruta actual (fundido + `translateY`) por una transición
que se lea como dar vuelta la hoja de un libro, sin romper el reveal ni el resto
de las micro-interacciones.

## Diagnóstico

- Hoy `::view-transition-old/new(root)` usan `page-out` / `page-in`: opacidad más
  un `translateY` de 8–10px, 300ms / 340ms. El `ClientRouter` de Astro está
  activo en `src/layouts/BaseLayout.astro`.
- El commit `5ae525e` revirtió el `clip-path` del reveal porque Chrome calcula
  intersección 0 en un elemento observado recortado a 0 de altura: el
  `IntersectionObserver` nunca dispara y el contenido queda oculto en carga
  directa.
- **Implicancia:** ese defecto es del `clip-path` aplicado al *elemento
  observado*. Los pseudo-elementos de la view transition no son observados por
  nadie, así que el 3D ahí es seguro. Aun así: no se usa `clip-path` en el
  reveal y no se toca `[data-reveal]`.

## Restricciones (tomadas de la filosofía)

- Solo `opacity` y `transform`. Nada que fuerce layout.
- Respetar `prefers-reduced-motion: reduce`.
- Sin sombras grandes, sin gradientes, sin librerías de animación.
- Duraciones cortas: 300–340ms, siempre `--ease-out`.

## Tareas

- [x] **T1** — Implementar el page-turn en `src/styles/global.css` con transform
      3D exponencial en los pseudo-elementos de view transition.
- [x] **T2** — Documentar la feature en `docs/features/page-turn-transition.md`.
- [x] **T3** — Verificar: `npm run build` + `npx astro check` + inspección del CSS
      emitido y del `data-*` intacto.
- [ ] **T4** — Commit de la unidad de trabajo (requiere autorización del usuario).

## Evidencia

**Implementación** (`src/styles/global.css`):

- `@keyframes leaf-out`: opacidad 1→0, `perspective(1200px) rotateY(0) scale(1)` →
  `rotateY(-28deg) scale(0.97)`.
- `@keyframes leaf-in`: opacidad 0→1, `rotateY(20deg) translateX(1.5%) scale(0.99)`
  → `rotateY(0)`.
- `transform-origin: left center` (el lomo) en ambos pseudo-elementos.
- `::view-transition` con `background-color: var(--color-cream)`.
- 300ms / 340ms con `--ease-out`. Se eliminaron `page-out` y `page-in`.

**Doc**: `docs/features/page-turn-transition.md`.

**Verificación** (agente `gentle-ai-verify`, read-only) — 8/8 PASS:

- `npm run build` → exit 0, 10 páginas, sin errores.
- `npx astro check` → exit 0, 55 archivos, 0 errores / 0 warnings / 0 hints.
- El CSS emitido contiene `leaf-out`, `leaf-in`, `::view-transition-old/new(root)`
  y `perspective(1200px)`; sin rastro de `page-out`/`page-in` en `dist/` ni en `src/`.
- El HTML emitido conserva `data-reveal` (146), `data-countup` (24) y
  `data-gallery` (122).
- Los overrides de `prefers-reduced-motion: reduce` para `[data-reveal]` siguen
  intactos.

**No verificado**: el efecto visual en navegador real. No hay browser automation
en este entorno, así que la lectura del movimiento queda pendiente del autor, junto
con el ajuste fino de ángulos y duraciones.

**Corrección posterior**: el doc afirmaba que todo vivía dentro del media query;
los `@keyframes` están a nivel global. Redacción corregida por precisión.

## Archivos de la unidad

- `src/styles/global.css` (modificado)
- `docs/features/page-turn-transition.md` (nuevo)
- `odd/tasks/misura-page-turn.md` (tracking)
