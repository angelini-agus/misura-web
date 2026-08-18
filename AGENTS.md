# misure — Contexto del proyecto

## Qué es
Sitio institucional multipágina (MPA) para misure, empresa de software que 
desarrolla ERP, CRM y Landing Pages para PYMEs y empresas. Rutas: `/` (Inicio, 
resumen con servicios y CTAs), `/nosotros`, `/proyectos`, `/contacto`.

## Stack
- Astro + TypeScript
- Tailwind CSS v4
- Sitio estático — 0 JS en cliente por defecto. No agregar JS del lado del 
  cliente salvo que la tarea lo requiera explícitamente (ej: un widget 
  interactivo puntual)

## Sistema de diseño (ya implementado — no rediseñar, extender)
- Fondo: crema `#F1E8DB`
- Acento/texto principal: verde oscuro `#0E3B33`
- Diseño plano, sin sombras ni gradientes; redondeado sutil (`rounded-md`/`rounded-lg`) en tarjetas, botones e inputs
- Tokens de color en src/styles/global.css — usar esas variables, no hardcodear 
  hex nuevos en componentes
- Animaciones ya implementadas vía skills en .agents/skills — no romperlas al 
  tocar otras cosas

## Al agregar nuevas secciones, páginas o features
- Reusar los tokens de src/styles/global.css, no inventar colores nuevos
- Todo texto va en src/lib/content.ts, no hardcodeado en los componentes .astro
- Mantener el patrón de un componente .astro por sección
- Antes de implementar, crear o actualizar el spec correspondiente en 
  docs/features/ (objetivo, criterios de aceptación, restricciones, plan, 
  verificación) — no saltar directo a código en features nuevas

## Restricciones no negociables
- No inventar nombres de clientes, proyectos, cifras ni datos de contacto 
  reales — dejar placeholders [PENDIENTE]
- No inventar integrantes del equipo
- Responsive mobile-first
- No agregar dependencias nuevas sin justificarlas antes
- No romper el diseño, la paleta ni las animaciones existentes
- Ahorra contexto evitando explicarme las cosas y los resultados, simplemente hacelo.

## Estado actual
- Sitio multipágina (Inicio, Equipo, Proyectos, Contacto): estructura terminada
- Pendiente: resolver [PENDIENTE] de datos reales, retoques de diseño menores, 
  checklist de SEO/GEO (ver docs/features/seo-geo-optimization.md si ya existe, 
  o crearlo antes de aplicar los prompts de esa feature)