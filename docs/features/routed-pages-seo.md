# Páginas Routed + SEO Técnico

## Objetivo
Crear la página de caso de estudio `/proyectos/empresa-limpieza-rosario`,
conectar el listado de `/proyectos` con datos reales, corregir meta
descriptions con menciones a "IA" y verificar estado SEO de todas las rutas.

## Criterios de aceptación
- `/proyectos/empresa-limpieza-rosario` existe como ruta estática
- La página del caso tiene: problema, solución, resultados numéricos, CTA
- `Portfolio.astro` en `/proyectos` enlaza al caso real con href correcto
- Ninguna meta description menciona "IA" como diferencial
- Cada página tiene title y description únicos en BaseLayout
- Sitemap se genera correctamente en build (ya configurado)
- 0 JS nuevo en cliente — todo renderizado en servidor

## Restricciones
- No inventar datos: solo los del contexto del negocio
- Reutilizar PageHeader, patrones de sección, tokens del sistema de diseño
- No crear ruta dinámica [slug].astro: hay un solo caso, página estática
- No agregar ViewTransitions/ClientRouter: va contra restricción 0 JS cliente
- Todo copy en content.ts, no hardcodeado en .astro

## Plan
1. types.ts — agregar href?: string a PortfolioItem
2. content.ts — corregir meta descriptions, agregar caseStudies.limpieza,
   actualizar portfolio.items[0] con datos reales
3. Portfolio.astro — usar item.href dinámico
4. NUEVO src/pages/proyectos/empresa-limpieza-rosario.astro
5. npm run build

## Verificación
- `npm run build` sin errores TypeScript
- Las 5 rutas se generan: /, /nosotros, /proyectos, /contacto,
  /proyectos/empresa-limpieza-rosario
- El sitemap incluye todas las rutas
