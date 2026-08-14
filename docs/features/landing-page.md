# Feature: Landing page institucional de Misura

## Objetivo
Página de una sola vista (con secciones ancladas) que presente a Misura y sus 
tres líneas de servicio (ERP, CRM, Landing Pages) a PYMEs y empresas, con 
estructura similar a geiko.dev/es.

## Secciones (contenido funcional — el diseño/orden visual lo define el agente según su propia dirección de arte, no debe copiar la composición de ninguna referencia externa)

- Presentación de Misura y su propuesta de valor
- Los tres servicios: ERP, CRM, Landing Pages
- Por qué elegir Misura (diferenciales)
- Portfolio / casos ([PENDIENTE] hasta tener proyectos reales)
- Preguntas frecuentes
- Llamado a la acción de contacto

## Dirección de diseño
- **Referencia visual principal:** Estilo basado en [Elevate Medical](https://www.awwwards.com/sites/elevate-medical) (solo como inspiración estética; la composición final no lo copia).
- **Paleta de colores (definida):** Fondo crema `#F6EFE8`, verde oscuro `#0E3B33` para textos, bordes y acentos. Definida como tokens en `src/styles/global.css`.
- **Tono y estilo:** Moderno, profesional, audaz y cercano. Evitar el aspecto corporativo tradicional. Estética limpia y plana (flat) con alto contraste visual: sin sombras ni degradados, solo bordes sólidos de 1px.
- **Elementos de interfaz (UI):** Contenedores, tarjetas y botones con bordes verdes sólidos y bien marcados sobre el fondo crema. La separación de secciones se da a través de líneas estructurales, no sombras.
- **Logo y tipografía:** [PENDIENTE: definir si hay logo]. Tipografía **Plus Jakarta Sans** variable (geométrica, moderna), self-hosted vía `@fontsource-variable/plus-jakarta-sans`.

## Criterios de aceptación
- [ ] Responsive en mobile, tablet y desktop
- [ ] Todas las secciones ancladas navegables desde el header
- [ ] Formulario o link de contacto funcional (definir: mailto, formulario, WhatsApp)
- [ ] Sin textos ni datos inventados que aparenten ser reales — placeholders explícitos
- [ ] Performance: Lighthouse >90 en mobile

## Restricciones
Ver AGENTS.md del proyecto.

## Plan técnico
- **Framework:** Astro 7 (estático) + TypeScript + Tailwind CSS v4 — decisión de
  stack confirmada (se pivotó desde Next.js para maximizar rendimiento/SEO:
  HTML/CSS puro, 0 JS).
- **SEO:** `BaseLayout.astro` emite title/description, Open Graph (`og:locale
  es_AR`), `twitter:card`, canonical y JSON-LD (schema.org Organization).
  Jerarquía: 1 `<h1>` (Hero), `<h2>` por sección, `<h3>` en cards.
- **Contenido:** centralizado en `src/lib/content.ts`; textos sin definir como
  `[PENDIENTE: ...]` renderizados como `<Placeholder />` (no inventar datos).
- **Navegación:** menú desktop + menú mobile con `<details>` nativo (sin JS);
  scroll suave con `scroll-smooth` y `scroll-mt-24`. FAQ como acordeones
  `<details>` con ícono Plus que rota.
- **Contacto:** CTA "INICIAR PROYECTO" → `mailto:` o `wa.me` si hay datos; si
  no, `<Placeholder inverse>`. Email/WhatsApp `[PENDIENTE]`.
- **Imágenes:** B/N; mientras no existan recursos reales, placeholders CSS.
- **Estructura final:** Header → Hero → Servicios → Nosotros → Diferenciales →
  Portfolio → FAQ → Contacto → Footer.

## Verificación
- `npm run build` en la raíz del repo: build estático OK (1 página,
  `dist/index.html`).
- Salida 100% estática: **0 archivos JS** (solo `index.html` + CSS + fuentes woff2).
- Paleta aplicada: `#f6efe8` y `#0e3b33` presentes en el CSS generado.
- Jerarquía verificada en el HTML: 1 `<h1>`, 6 `<h2>`, 9 `<h3>`.
- Meta tags + JSON-LD presentes en `dist/index.html`.

## Decisiones
- **Pivot Next.js → Astro + Tailwind v4** (rendimiento y SEO: salida estática sin
  JS). Confirmado por el cliente; la migración quedó 1:1 en contenido y diseño.
- **Paleta definitiva:** amarillo → crema `#F6EFE8` + verde `#0E3B33`.
- **Tipografía:** Plus Jakarta Sans variable self-hosted (sin Google Fonts).
- **Contacto:** se eligió `mailto:`/WhatsApp link (no formulario). Datos
  `[PENDIENTE]` hasta que el cliente los provea.
- **OG image default:** `public/og-image.png` generada (B/N flat). Cuando haya
  dominio, pasar `ogUrl`/`ogImage` absolutos a `BaseLayout`.
- **Eliminado:** proyecto Next.js anterior (app/, components/, lib/) — el repo
  ahora es solo Astro.