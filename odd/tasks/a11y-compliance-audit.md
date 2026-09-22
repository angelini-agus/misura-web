# Feature: Remediación de la auditoría de cumplimiento y accesibilidad

## Objetivo

Cerrar los hallazgos de la auditoría de cookies, minimización de datos, terceros,
accesibilidad y alt texts. El usuario eligió el alcance completo, incluidos el
design-gate y el SEO.

## Veredicto de la auditoría sobre cookies (no requiere código)

**Hoy no hace falta banner de cookies.** Evidencia: cero cookies, cero
`localStorage`/`sessionStorage`/`indexedDB` en `src/`; `PUBLIC_GA_ID` sin definir
y el `dist/` emitido sin `googletagmanager` ni `gtag`; fuentes self-hosted; cero
iframes, embeds, píxeles o scripts de CDN. El único request saliente del sitio es
el POST del formulario a Web3Forms, y ocurre solo cuando el usuario envía. No hay
nada que consentir a nivel dispositivo y nada que el usuario pueda rechazar: un
banner sería fricción sin beneficio. La Ley 25.326 no pide banners y ePrivacy
art. 5(3) no muerde porque no se escribe ni lee nada en el dispositivo.

**Si algún día se define `PUBLIC_GA_ID`, cambia todo:** cookies de terceros,
transferencia a Google, y dos frases de la política pasan a ser falsas ("es el
único tercero que interviene", "no usa cookies ni analítica de terceros"). Ese día
hace falta consentimiento previo, "Rechazar" con la misma prominencia que
"Aceptar", cero cookies antes de aceptar, granularidad y registro de la elección.
Queda documentado, no implementado: construir un banner para analítica que no se
usa es código muerto.

## Unidades de trabajo

Cada unidad es un commit propio. La rama está encadenada sobre
`feat/contact-copy-privacy`, que a su vez lo está sobre `feat/contact-service-step`,
para que el merge en orden no produzca conflictos.

### U1 — Formulario: accesibilidad y minimización

Hallazgos 1, 2, 5, 6 y 9 del informe, más la mitad del hallazgo 4.

- **[Mayor]** No hay mensaje visible si falla el envío: `formError` está definido
  y no se usa; el botón solo pasa a "Reintentar" (hardcodeado). Región
  `role="alert"` con `contactForm.formError`, y el copy hardcodeado
  (`"Enviando..."`, `"Reintentar"`) pasa a `content.ts`, como manda la regla del
  repo. Esto además vuelve cierta la afirmación de
  `docs/features/contact-form-integration.md`, que hoy describe un comportamiento
  que no existe.
- **[Mayor]** Los errores de campo no se anuncian: falta `aria-describedby` y los
  `<p data-error-for>` arrancan en `display:none`, lo que hace poco confiable la
  anunciación por `role="alert"`.
- **[Mayor / minimización]** `phone` obligatorio pasa a opcional.
- **[Menor]** El `<dialog>` de éxito no tiene nombre accesible.
- **[Menor]** Cuando `service` es el primer inválido, el foco apunta a un `div` no
  focusable; y "Cambiar" es un label genérico fuera de contexto.
- **[Coherencia]** El disclaimer del formulario ("no compartimos tu información
  con terceros") contradice a la política, que declara a Web3Forms. Se alinea.

### U2 — Accesibilidad del resto del sitio

Hallazgos 3, 8 y 10.

- **[Mayor]** Los dots de la galería (10×10px, gap 8px, centros a 18px) fallan
  WCAG 2.2 criterio 2.5.8 (mínimo 24px sin excepción de spacing).
- **[Menor]** `alt` del equipo: hoy renderiza `"[COMPLETAR: nombre]"` con la misma
  imagen genérica para los dos miembros y duplica el `<h3>` adyacente.
- **[Menor]** El menú mobile no cierra con Escape y el `summary` puede mostrar el
  marker nativo de Safari además del ícono propio.

### U3 — Design-gate

Hallazgo 11. Dos violaciones al gate del propio proyecto (`SKILL.md`: animar solo
`transform`/`opacity`, nada de motion siempre encendido):

- `.details-collapse` anima `grid-template-rows` (layout, no transform).
- El cursor del `CodePanel` titila en loop infinito.

### U4 — SEO, schema y coherencia de la política

Hallazgos 4 (resto), 12 y 13.

- El JSON-LD publicado tiene `organizationSchema.url` con el literal
  `"[PENDIENTE: dominio de producción]"` y `telephone`/`streetAddress` como
  placeholders. El dominio real ya está en `astro.config.mjs` y `robots.txt`.
- Ninguna página emite `canonical` ni `og:url`.
- La política no menciona los logs de acceso del hosting (no hay config de deploy
  en el repo, así que el proveedor es desconocido) ni aclara que la afirmación
  "sin cookies ni analítica" depende de que `PUBLIC_GA_ID` siga sin definirse.
- Doc desactualizada: `docs/features/interactive-features.md` declara "✅ hecho"
  un filtro de portfolio que no existe en el código.

### U5 — Layout del formulario: dimensión fija, cuatro opciones y volver como título

Pedido posterior del usuario, no viene de la auditoría.

- **Dimensión fija:** el panel no debe cambiar de tamaño al pasar del paso 1 al
  paso 2. Los dos pasos se apilan en la misma celda de un grid y el inactivo se
  oculta con `visibility: hidden` (que además lo saca del orden de tabulación y
  del árbol de accesibilidad), en vez de `display: none`, que lo sacaría del
  layout y dejaría que el alto lo fije el paso visible.
- **100vh contando el navbar:** la sección mide `100dvh` menos el alto del header
  sticky. El header mide 77px (`py-4` 32px + CTA de 44px + `border-b` 1px); la
  barra de anuncio no se cuenta porque scrollea y no queda visible. Se usa `dvh`
  y `min-height`, no `height`: en pantallas bajas la sección crece en vez de
  recortar el formulario.
- **Cuatro opciones:** Páginas Web y E-commerce se fusionan en una sola opción.
  Quedan ERP, CRM, Páginas Web y E-commerce, Otros. Eso completa un 2×2 exacto.
- **Botones iguales:** `auto-rows-fr` en el grid y `h-full` en cada botón, con
  texto centrado, para que los cuatro midan exactamente lo mismo.
- **Volver como título grande:** el resumen con el «Cambiar» chico desaparece. En
  su lugar, arriba del formulario, el servicio elegido se muestra como título
  grande clickeable que vuelve al paso 1. El input oculto `name="service"` sigue
  dentro del form y el JavaScript no cambia: reusa `data-service-change`,
  `data-service-chosen` y `changeService` tal como están.

### Ya resuelto en otra rama

- **Hallazgo 7** (anunciar "Link copiado" con live region): resuelto en
  `fix/footer-share-copyright` (`c0c7d45`), que agrega
  `role="status" aria-live="polite"` al botón de compartir.

## Fuera de alcance

- Banner de consentimiento: no corresponde mientras no haya nada que consentir.
- `phone` como campo obligatorio justificado: el usuario eligió hacerlo opcional.
- Cambiar `lang="es"` por `es-AR`: válido como está.

## Criterios de aceptación

1. Un envío fallido muestra un mensaje de error visible y anunciado.
2. Cada error de campo está asociado a su control y se anuncia al aparecer.
3. El teléfono es opcional y el formulario lo declara.
4. Los dots de la galería cumplen 2.5.8.
5. El JSON-LD publicado no contiene placeholders.
6. `npx astro check` y `npm run build` pasan en cada unidad.

## Tareas

- [x] U1 — Formulario: accesibilidad y minimización
- [ ] U2 — Accesibilidad del resto del sitio
- [ ] U3 — Design-gate
- [ ] U4 — SEO, schema y coherencia de la política
- [x] U5 — Layout del formulario: dimensión fija, cuatro opciones y volver como título
- [ ] Verificación independiente de cada unidad antes de su commit

## Evidencia

### U1

- Commit: `e611f63` — `fix(a11y): errores del formulario anunciados y telefono opcional`.
- `npx astro check`: 57 archivos, 0 errores. `npm run build`: 11 páginas, `Complete!`.
- Verificado inline contra el HTML emitido: los cuatro `aria-describedby`
  (`cf-name-error`, `cf-email-error`, `cf-phone-error`, `cf-service-error`) con sus
  ids presentes; los párrafos de error en `sr-only` y no en `hidden`; el teléfono
  sin `required`; la región `#contact-form-error`; el modal con
  `aria-labelledby="cf-modal-title"`; y el copy del botón fuera del script
  (`data-submitting-label`, `data-retry-label`, `data-form-error-message`).
- No verificado: anuncio real por lector de pantalla y un fallo de red real.

### U5

- Commit: `10060b3` — `feat(contacto): seccion a pantalla completa, panel de tamaño fijo y cuatro opciones`.
- CSS scoped emitido, verificado en `dist/contacto/index.html`:

```css
[data-astro-cid-vekgkm42][data-service-flow]{display:grid}
[data-astro-cid-vekgkm42][data-service-step],[data-astro-cid-vekgkm42][data-service-form]{grid-area:1/1}
[data-astro-cid-vekgkm42][data-service-step],.js [data-astro-cid-vekgkm42][data-service-form]{visibility:hidden}
.js [data-astro-cid-vekgkm42][data-service-flow][data-step=service] [data-astro-cid-vekgkm42][data-service-step],.js [data-astro-cid-vekgkm42][data-service-flow][data-step=form] [data-astro-cid-vekgkm42][data-service-form]{visibility:visible}
```

  Los dos pasos comparten celda, así el panel mide siempre el paso más alto y no
  cambia de tamaño al elegir. Sin JS el form no matchea ninguna regla de ocultado
  y queda visible.
- Opciones emitidas: `erp`, `crm`, `web`, `otros`. Los `"landing"` que quedan en
  `src/` son la categoría del portfolio (`types.ts`), no el servicio del form.
- El diff no toca ninguna línea del `<script>`: `chooseService`, `changeService` y
  los hooks `data-*` quedaron intactos.
- No verificado: la ausencia real de salto de layout, la altura renderizada y el
  click del título. Tampoco la altura real del header en mobile angosto: los
  `4.8125rem` son una constante derivada de `py-4` + CTA 44px + `border-b` 1px, y
  el peor caso es una sección un poco más alta, nunca recortada.
