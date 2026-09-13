# Caso de estudio: CRM de leads para concesionaria

## Objetivo
Sumar al portfolio el quinto caso real de misure: un CRM a medida para una
concesionaria de autos de Rosario (`leads-crm`), que reemplaza la planilla de
Excel manual con la que se cargaban y asignaban las consultas de campañas de
Facebook e Instagram.

El caso llena la categoría `crm` del filtro del portfolio, que hoy solo tiene un
placeholder. Se modela con el mismo patrón que los casos existentes: entrada
tipada en `caseStudies`, card en `Portfolio` y página estática en
`/proyectos/crm-concesionaria-rosario`.

## Criterios de aceptación
- `content.ts` incluye `caseStudies.leadscrm` con la misma forma que los casos
  existentes: `seo`, `eyebrow`, `title`, `client`, `location`, `category`,
  `technologies`, `gallery`, `problem`, `solution`, `results`, `cta`.
- `portfolio.items` reemplaza el placeholder `crm` (`"Proyecto [PENDIENTE]"`) por
  una card real con `category: "crm"` y
  `href: "/proyectos/crm-concesionaria-rosario"`.
- Existe la ruta estática `/proyectos/crm-concesionaria-rosario`, con el mismo
  layout y componentes que `empresa-limpieza-rosario.astro`
  (`PageHeader`, `CaseStudyGallery`, secciones de desafío/solución/resultados,
  CTA final, volver a proyectos).
- La galería y la imagen de la card quedan pendientes hasta contar con las
  capturas reales (`[PENDIENTE]`).
- Cliente anonimizado ("Concesionaria de autos — Rosario"). Se pueden nombrar
  modelos (Jolion, H6, Tank) pero no la marca.
- Los otros 4 casos y sus datos no se modifican.

## Restricciones
- No inventar métricas de mejora: este caso no tiene un "antes/después" medido.
  La sección de resultados describe cualitativamente qué ordena el CRM
  (centralización, filtros, asignación a asesores) y usa el dato real del 60%
  (clientes que pedían cotización de usado y financiación en una muestra de 22
  consultas de la planilla anterior) como insight que informó el diseño, dejando
  claro que es evidencia del proceso reemplazado y no una mejora medida.
- No agregar dependencias.
- No crear ruta dinámica `[slug].astro`: se mantiene el patrón de páginas
  estáticas.
- Reusar los tokens del sistema de diseño (0 colores nuevos, 0 JS de cliente
  nuevo).

## Plan de implementación
1. Assets en `src/assets/proyectos/leadscrm/` (pendiente, todavía no subidos):
   - `case-leadscrm-cover.jpg`
   - `case-leadscrm-dashboard.jpg`
2. `src/lib/content.ts`
   - `caseStudies.leadscrm` (categoría Ventas CRM, React/Vite/PrimeReact/
     .NET 9/Dapper/PostgreSQL/Docker).
   - `portfolio.items`: reemplazar el placeholder `crm` por la card real.
3. `src/pages/proyectos/crm-concesionaria-rosario.astro`, copiando el patrón de
   `empresa-limpieza-rosario.astro`.
4. `npm run build`.

## Verificación
- `npm run build` sin errores.
- Se genera `/proyectos/crm-concesionaria-rosario`.
- El sitemap incluye la ruta nueva.
- El filtro "Ventas (CRM)" del portfolio muestra la card real.

## Pendientes reales
- Capturas del CRM (cover y dashboard) para la card y la galería.
- Métricas de resultado del CRM (`[PENDIENTE]` si en el futuro se miden).
