# Feature: Arquitectura Multipágina (MPA)

## Objetivo
Migrar el sitio de One-Pager a un sitio multipágina usando el routing por
archivos de Astro, manteniendo dirección de arte flat y rendimiento.

## Rutas
- `/` (Inicio): Hero, vista rápida de Servicios, menciones de clientes
  (placeholders), Diferenciales, FAQ y CTAs a las demás páginas.
- `/nosotros`: personas detrás de misure con placeholders `[PENDIENTE]`.
- `/proyectos`: grilla de casos de éxito con filtros por categoría y
  tecnologías por proyecto.
- `/contacto`: formulario de contacto asíncrono + datos de la empresa en
  layout split (info verde + formulario crema).

## Arquitectura
- `src/pages/*.astro` — una página por ruta; cada una envuelve su contenido en
  `BaseLayout` y pasa `title`/`description` por página (desde `pages` en
  `content.ts`).
- `src/components/` — `Header`/`Footer`/`StickyCta`/`ShareButton` compartidos;
  secciones reutilizables (`Hero`, `Services`, `Team`, `Portfolio`, `Contact`,
  `ContactForm`, etc.); `ui/` con primitivas.
- Nav en `content.ts` apunta a rutas (`/`, `/nosotros`, `/proyectos`,
  `/contacto`). El `Header` marca la página activa con `aria-current="page"` y
  borde verde; ya no usa scroll spy de anchors.
- `BaseLayout` sigue inyectando SEO dinámico, JSON-LD y GA4 opcional.

## Restricciones
- Diseño flat Elevate Medical (crema, verde, bordes sólidos, sin sombras).
- Cero librerías pesadas; JS vanilla solo donde hace falta.
- Datos reales pendientes como `[PENDIENTE]`.

## Verificación
`npm run build` genera las 4 rutas + sitemap con las 4 URLs. `npx astro check`
sin errores.
