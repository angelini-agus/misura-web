# Feature: Performance de navegación (Astro View Transitions)

## Objetivo
Evitar el full reload y el flash blanco al navegar entre páginas del sitio
(/, /nosotros, /proyectos, /contacto, /proyectos/[slug]). El sitio es una MPA
con rutas reales (no anchors), por lo que la navegación entre páginas
provocaba una recarga dura del navegador.

## Justificación del JS en cliente
AGENTS.md indica "0 JS en cliente por defecto". Este cambio agrega JS pero es
una feature nativa de Astro (`astro:transitions` / `ClientRouter`), sin
librerías nuevas ni JS custom pesado, y mejora directamente la experiencia de
navegación. Por eso está justificado.

## Qué se hizo
1. **`ClientRouter`** en `<head>` de `src/layouts/BaseLayout.astro`: import de
   `astro:transitions` y componente `<ClientRouter />`, que habilita la
   navegación SPA-like (sin recarga dura) entre las rutas del sitio. Astro
   deduce que un link apunta a la página actual y no re-ejecuta nada notorio.
2. **`data-reveal` re-inicializado por transición**: el script del
   IntersectionObserver en `BaseLayout.astro` ahora se registra también en el
   evento `astro:page-load` (además de ejecutarse al inicio), para que las
   animaciones de scroll-reveal se re-ejecuten correctamente en cada cambio de
   página (no solo en el primer `DOMContentLoaded`).
3. **`scroll-behavior: smooth`** en `src/styles/global.css` para anchors
   internos (StickyCta, CTAs a `#contenido`, `#clientes`, `#preguntas`). El
   bloque `@media (prefers-reduced-motion: reduce)` ya existente fuerza
   `scroll-behavior: auto`, y se respeta tal cual.
4. **CTA "Quiero mi prototipo gratis" → `/contacto#contacto`** (Header.astro y
   StickyCta.astro, `src/lib/content.ts`): si ya se está en `/contacto`, el
   click no dispara una transición de Astro sino un scroll suave directo al
   form (`#contacto`). El listener se registra en fase de captura (intercepta
   antes del router de Astro) y se re-registra en cada `astro:page-load`
   (mismo patrón que data-reveal) para no perderse tras una navegación
   SPA-like. Con JS deshabilitado o desde otra página, el href `#contacto`
   funciona como fallback/ancla normal. Respeta `prefers-reduced-motion`
   (scroll instantáneo).

## Qué se verificó / no se rompió
- **Sticky header** (`position: sticky`): sigue fijo durante las transiciones.
- **StickyCta** (`position: fixed`, `md:hidden`): intacto en mobile.
- **`<details>`** del menú mobile y de la FAQ: nativos, funcionan sin cambios.
- **JSON-LD** por página (Organization en el layout, FAQPage en Faq): se
  re-ejecutan en cada transición; cada página conserva su schema.
- Diseño, colores y contenido sin cambios.

## Restricciones / notas
- No se agregó dependencia nueva.
- No se cambió el diseño, la paleta ni las animaciones existentes.

## Verificación
- `npm run build` sin errores.
- Prueba manual: click en cada link del nav (desktop y mobile) desde cada
  página, el botón "Quiero mi prototipo gratis", los CTAs a /contacto y el
  link del logo a / — sin parpadeo blanco y con las animaciones `data-reveal`
  funcionando en cada página.
