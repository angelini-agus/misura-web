# auditoria-tanda-1 — fixes accionables del informe de auditoría (misura-web)

Creado: 2026-10-20 · Rama: `feat/bottega-rebrand` · Fuente: `AUDITORIA.md` (secciones 5 y 6)

## Alcance

- Incluye la tanda 1 completa: F24, F02, F05, F06, F08, F01, F04, F03.
- No incluye tanda 2 (CI, PNG muertos, modal fallback, prev/next, `.catch`, script check, Web3Forms por dominio) ni tanda 3.
- Cambios de la auditoría NO pushear: decisión `No todavía` (2026-10-20). Pushes solo cuando el usuario pida.

## Autorización

- 2026-10-20: el usuario eligió `Arrancar sí` para la tanda 1. F24 sigue bloqueada en decisión del autor; SDD no seleccionado (flujo ODD).

## Regla de protección

- `src/styles/global.css` (textura de papel) y `image.png` (borrado) son trabajo en curso del autor: nunca commitear ni sobrescribir.
- Al commitear: solo `git add` de rutas propias del cambio.

## Tasks

| ID | Hallazgo | Épica | Descripción | Estado | Commit |
| --- | --- | --- | --- | --- | --- |
| T1 | F02 | 404 | Crear `src/pages/404.astro` con el layout marca; copy sobrio, link a `/` y `/contacto`; Astro emite `404.html` | pending | — |
| T2 | F04 | preload | `link rel=preload as=font crossorigin` de los 2 woff2 latin en `BaseLayout.astro`, con las URLs reales que emite el CSS | pending | — |
| T3 | F05 | contraste | `text-green/60` → `text-green/75` en `CaseContrast.astro` (F23 de ClientQuote queda en tanda 3) | pending | — |
| T4 | F06 | aria-live | Anunciar el estado de envío en `ContactForm.astro` (`aria-live` + `aria-busy`), patrón mínimo sin reestructurar | pending | — |
| T5 | F08 | seo | Acortar en `content.ts`: titles de index (67c), empresa-limpieza-rosario (68c) y landing-empresa-limpieza (62c) a ≤60c; descripciones de crm-concesionaria (240c), gestion-legal (254c) y landing-empresa-limpieza (175c) a ≤160c. Sin inventar datos | pending | — |
| T6 | F01 | headers | `vercel.json`: CSP + los 5 headers de seguridad (bloqueada por T8: la CSP depende de si GA4 queda) | blocked | — |
| T7 | F03 | perf | CSS blocking 760ms: analizar y decidir inline de crítico vs split/footer (máximo impacto de perf pendiente) | pending | — |
| T8 | F24 | compliance | GA4 vs política: decisión del autor entre (a) quitar GA4, (b) banner de consentimiento, (c) analítica sin cookies + corregir la política al estado real + declarar Web3Forms como procesador (con F11) | blocked | — |
| T9 | cierre | docs | Actualizar `AUDITORIA.md` (estados de los hallazgos de tanda 1) al cerrar la tanda | pending | — |

## Evidencia de concepto (hallazgos verificados ayer)

- F02: `dist/404.html` inexistente; `/pagina-inexistente-xyz` cae en la 404 genérica de Vercel.
- F04: 0 `rel=preload` en `dist/index.html`; preload comentado en `BaseLayout.astro:127-131` no aterriza; fuentes latinas 37+27 KiB.
- F05: `CaseContrast.astro:23-24` `text-green/60` = 3.50:1 contra cream `#f1e8db`.
- F06: `grep aria-live|role=status|aria-busy ContactForm.astro` → 0; el buen patrón existe en `ShareButton.astro:120`.
- F08: medición de caracteres sobre el dist (FASE 3).
- F01: `curl -sI https://bottegadevs.com` → solo HSTS y `Server: Vercel`.
- F24: `BaseLayout.astro:58-60/:88` gtag sin CMP vs `content.ts:153-156` que promete texto "no usa cookies… ni analítica de terceros… con tu consentimiento previo".

## Commits esperados (unidades)

- C1 `feat(404): pagina propia de error` — T1.
- C2 `perf(head): precarga las fuentes woff2` — T2.
- C3 `fix(a11y): sube el contraste y anuncia el estado de envio` — T3+T4.
- C4 `fix(seo): acorta titles y descripciones fuera de rango` — T5.
- T7 y T8 cierran con su propio commit cuando se desbloqueen.
