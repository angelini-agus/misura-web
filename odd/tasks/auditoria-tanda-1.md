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
| T1 | F02 | 404 | Crear `src/pages/404.astro` con el layout marca; copy sobrio, link a `/` y `/contacto`; Astro emite `404.html` | done | 63c92cf |
| T2 | F04 | preload | `link rel=preload as=font crossorigin` de los 2 woff2 latin en `BaseLayout.astro`, con las URLs reales que emite el CSS | done | f368666 |
| T3 | F05 | contraste | `text-green/60` → `text-green/75` en `CaseContrast.astro` (F23 de ClientQuote queda en tanda 3) | done | abebc5f |
| T4 | F06 | aria-live | Anunciar el estado de envío en `ContactForm.astro` (`aria-live` + `aria-busy`), patrón mínimo sin reestructurar | done | abebc5f |
| T5 | F08 | seo | Acortar en `content.ts`: titles de index (67c), empresa-limpieza-rosario (68c) y landing-empresa-limpieza (62c) a ≤60c; descripciones de crm-concesionaria (240c), gestion-legal (254c) y landing-empresa-limpieza (175c) a ≤160c. Sin inventar datos. Extra decidido el 20-10: el barrido del dist detectó 2 descripciones más >160c (landing-clinica-pediatrica 199c, sistema-clinica-pediatrica 185c) y se acortaron con el mismo criterio | done | 7e3eb85 |
| T6 | F01 | headers | `vercel.json`: CSP (allowlist scripts inline + web3forms) + nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy y cache immutable `/​_astro/*`; HSTS queda el default de Vercel. Verificación en vivo pendiente del deploy | done | 2a25786 |
| T7 | F03 | perf | Análisis: del chunk de 55KB, 13% (7.6KB) era @font-face de todos los subsets de fontsource. Decisión: autohost latin (fonts.css + 2 woff2 en src/assets/fonts) en vez de inline crítico (caro de mantener con LH 99-100). Medición LH móvil antes/después: bloqueo Footer.css 456→305ms, TBT 70→50ms, chunk 55.0→48.2 KiB, assets woff2 8→2. Paquetes fontsource desinstalados | done | 2658460 |
| T8 | F24 | compliance | Decisión del autor: analítica sin cookies (C). GA4 fuera (`417d440` con `@vercel/analytics` v2.0.1), política actualizada al estado real (`9c0c269`, octubre 2026). Sin banner por pedido del autor. Lado Vercel pendiente: Enable de Analytics + borrar la env `PUBLIC_GA_ID` | done | 417d440 + 9c0c269 |
| T9 | cierre | docs | Tanda 1 completa y cerrada: §8.1 de `AUDITORIA.md` con todos los estados resueltos. Solo quedan las verificaciones post-deploy (headers CSP en vivo, 404 en runtime, cookie `_ga` ausente, Enable de Analytics) | done | — |

## Notas de ejecución (20-10)

- Worker (gentle-ai-worker) cerró T1-T4 con gates verdes: `astro check` 0/0/0, build 12 páginas, `dist/404.html` existe, 2 preloads verificados en `dist/index.html` con href existente en `dist/_astro`, sin duplicados de woff2 (dedupe de Vite confirmado, hash de lora sin cambia).
- `aria-busy` va en el botón, no en el form: en el form sería ancestro del live region y podría suprimir el anuncio en algunos lectores de pantalla.
- El eyebrow de la 404 usa `text-green/70`: coincide con el patrón de `PageHeader.astro:17`; el barrido de /70 es F23 (tanda 3).
- Dist final: 0 titles >60c, 0 descs >160c.

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
