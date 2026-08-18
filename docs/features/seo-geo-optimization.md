# Feature: Optimización SEO/GEO

## Objetivo
Dejar la página de misure optimizada para buscadores tradicionales y para 
motores de búsqueda basados en IA (GEO), siguiendo un checklist de 26 puntos.

## Restricciones
- No inventar contenido real (nombres de servicios, direcciones, teléfonos) — 
  usar los datos ya definidos en /lib/content.ts o dejar [PENDIENTE]
- No romper el diseño ni las animaciones ya implementadas
- Si algún punto de la checklist no aplica a un sitio Astro de una sola 
  página (ej: paginación /page/ de WordPress), marcarlo como "No aplica" y 
  explicar por qué, no forzar una implementación

## Verificación
Correr build de Astro sin errores después de cada lote. Revisar diff antes 
de aceptar.

## Progreso del checklist

### Hecho
- **1-5** Metatítulo/descripción únicos, H1 único distinto del metatítulo,
  intención de búsqueda por sección.
- **6-8** TL:DR en el hero (después de la propuesta de valor), CTA nuevo tras
  el primer párrafo (opción A: párrafo → CTA → TL:DR).
- **9** Jerarquía de headings: 1 H1, H2 por sección, H3 por subitem (incluye
  H3 en los `<summary>` del FAQ).
- **10** Interlinks: hero → `#erp/#crm/#landing`, Services → `#preguntas`,
  Differentiators → `#contacto`, nav/footer.
- **11** Listas semánticas: hero, TL:DR y contactos de Contact en `<ul>/<li>`.
- **12** FAQ con 6 preguntas cubriendo ERP/CRM/Landing; datos reales
  pendientes marcados `[PENDIENTE]`.
- **13** JSON-LD `FAQPage` con respuestas reales (se omiten placeholders puros).
- **14** Imágenes renombradas a minúsculas con guiones: `og-image.png` →
  `og-misure-software.png` (referencias en BaseLayout y docs actualizadas).
- **15** No hay `<img>`/`<Image>` reales todavía; el placeholder usa
  `role="img"` + `aria-label` que sigue al `label`.
- **16** JSON-LD `Organization` (sin dirección física) con email/teléfono/
  dirección como `[PENDIENTE]`.
- **17** `public/robots.txt` permite indexación completa y referencia el
  sitemap.
- **18** URLs/slugs ya limpios (sin números ni conectores redundantes).
- **20** `public/llms.txt` con resumen estructurado para agentes de IA.
- **21** CTA sticky solo mobile (`StickyCta.astro`, `md:hidden`, fijo abajo,
  z-40) con clearance en el footer (`pb-24 md:pb-12`) para no tapar contenido.
- **22** Botón "Compartir" en el footer (`ShareButton.astro`): Web Share API
  con fallback a clipboard (copia el link y muestra feedback 2s).
- **23-24** Script de GA4 preparado en `BaseLayout.astro` leyendo
  `import.meta.env.PUBLIC_GA_ID` (solo se emite si la variable existe).
  Instrucciones de configuración y de verificación en GSC en `README.md`.
- **25** Sitemap generado con `@astrojs/sitemap` (integración en
  `astro.config.mjs`) y `site` configurado para URLs absolutas. El dominio en
  `site` es un placeholder `https://misure.example.com` marcado `[PENDIENTE]`
  — reemplazar por el dominio real al deployar (actualiza también `robots.txt`).

### No aplica
- **19** "Desindexar `/page/`" — es un patrón de paginación de WordPress; este
  sitio Astro es de una sola página sin paginación. No implementado.
