# Casos de estudio: landing AZ, landing pediátrica y ERP clínico pediátrico

## Objetivo
Sumar proyectos reales al portfolio y crear sus páginas de caso de estudio, con
el mismo patrón que los casos existentes (limpieza y gestión jurídica): entrada
tipada en `caseStudies`, card en `Portfolio` y página estática en
`/proyectos/<slug>`.

El repo `pediatric-clinic-erp-v0` contiene **dos productos distintos**, por lo
que se modelan como dos proyectos separados:
- **Landing pública** (`apps/landing`): sitio de marketing y captación de turnos.
- **ERP clínico y portal de pacientes** (`apps/web` + `apps/api`): gestión clínica.

Proyectos:
- **Landing page para empresa de limpieza** (`az-landing-page`): sitio oficial de
  una empresa de limpieza de Rosario, con propuesta de valor, captación de
  consultas calificada e integración con su ERP interno vía proxy en el borde.
- **Landing pública para clínica pediátrica** (`pediatric-clinic-erp-v0`,
  `apps/landing`): sitio con autoridad médica, etapas del cuidado pediátrico,
  flujo de turnos, FAQ y contacto.
- **ERP clínico y portal de pacientes** (`pediatric-clinic-erp-v0`,
  `apps/web` + `apps/api`): gestión de pacientes y turnos, historia clínica
  conforme a la Ley 26.529, recetas en PDF y autenticación segura.

## Criterios de aceptación
- `content.ts` incluye `caseStudies.azLanding`, `caseStudies.pediatricLanding` y
  `caseStudies.pediatricErp` con la misma forma que los casos existentes: `seo`,
  `eyebrow`, `title`, `client`, `location`, `category`, `technologies`,
  `gallery`, `problem`, `solution`, `results`, `cta`.
- `portfolio.items` incluye 3 cards nuevas (AZ landing, landing pediátrica, ERP
  pediátrico) y conserva el placeholder de `crm` (no hay proyecto CRM real).
- Existen las rutas estáticas:
  - `/proyectos/landing-empresa-limpieza`
  - `/proyectos/landing-clinica-pediatrica`
  - `/proyectos/sistema-clinica-pediatrica`
- Las páginas reutilizan `PageHeader`, los patrones de sección y los tokens del
  sistema de diseño (0 colores nuevos, 0 JS de cliente nuevo).
- Nombres de cliente anonimizados ("Empresa de limpieza", "Clínica pediátrica").
- Sin métricas inventadas: los resultados van como `[PENDIENTE]`.

## Restricciones
- No inventar datos, cifras ni testimonios. El contenido se basa en los README
  públicos de los repos.
- No crear ruta dinámica `[slug].astro`: se mantiene el patrón de páginas
  estáticas.
- No agregar dependencias.

## Plan de implementación
1. `src/lib/content.ts`
   - `caseStudies.azLanding` (categoría Página Web).
   - `caseStudies.pediatricLanding` (categoría Página Web, 4 capturas).
   - `caseStudies.pediatricErp` (categoría Gestión ERP, 5 capturas).
   - `portfolio.items`: sumar las 3 cards.
2. Páginas estáticas, copiando el patrón de `empresa-limpieza-rosario.astro`:
   - `src/pages/proyectos/landing-empresa-limpieza.astro`
   - `src/pages/proyectos/landing-clinica-pediatrica.astro`
   - `src/pages/proyectos/sistema-clinica-pediatrica.astro`
3. `npm run build`.

## Verificación
- `npm run build` sin errores.
- Las 9 rutas se generan: `/`, `/nosotros`, `/proyectos`, `/contacto`,
  `/proyectos/empresa-limpieza-rosario`, `/proyectos/gestion-legal-estudio`,
  `/proyectos/landing-empresa-limpieza`,
  `/proyectos/landing-clinica-pediatrica`,
  `/proyectos/sistema-clinica-pediatrica`.
- El sitemap incluye las rutas nuevas.
- Los filtros del portfolio muestran los casos en su categoría correcta
  (landing / erp).

## Pendientes reales
- Métricas de resultado de los proyectos (`[PENDIENTE]` en `results`).
