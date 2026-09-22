# Feature: Paso de elección de servicio en el formulario de contacto

## Objetivo

Que el formulario de contacto no se muestre para rellenar hasta que el visitante
elija el tipo de servicio. Menos fricción de entrada y mejor calificación del
lead: el servicio elegido viaja igual en el POST a Web3Forms, por lo que no se
pierde ningún dato del negocio.

## Decisiones del usuario

1. **El paso 1 reemplaza al formulario:** el form no se muestra hasta elegir un
   tipo de servicio. Al tocar una opción aparece el formulario con ese servicio
   ya puesto.
2. **El desplegable de servicio se elimina del formulario.** La elección se
   muestra como dato ya elegido, con un control "Cambiar" que vuelve al paso 1, y
   viaja por un input oculto `name="service"`.
3. **Aplica en las dos páginas que montan el formulario:** el home
   (`<Contact simple />`, sin campo de mensaje) y `/contacto` (completo).
4. **E-commerce se agrega a las opciones**, que hoy no existe.

## Opciones del paso 1

Salen del mismo array `contactForm.serviceOptions` de `src/lib/content.ts`, que
hoy solo consume `ContactForm.astro`:

| value | label |
|---|---|
| `erp` | Sistemas de Gestión (ERP) |
| `crm` | Herramientas de Ventas (CRM) |
| `landing` | Páginas Web |
| `ecommerce` | Tienda Online (E-commerce) — **nueva** |
| `otros` | Otros |

## Consecuencia: el desplegable propio queda muerto

El desplegable custom (commit `7faa320`) es el **único** `data-select` del repo.
Al eliminarlo quedan sin uso:

- `.select-chevron` y `[data-select-trigger][aria-expanded="true"] .select-chevron`
  en `src/styles/global.css`.
- `src/components/ui/ChevronDownIcon.astro` (su único consumidor era este form).

No se limpian en esta rama: `global.css` tiene un cambio externo sin commitear
(fix de autofill) y mezclar ambos hunks haría imposible separarlos en el commit.
Queda como follow-up.

## Accesibilidad y progressive enhancement

- El paso 1 es un `role="group"` con `aria-labelledby` apuntando a la pregunta,
  y las opciones son `<button type="button">` nativos: teclado y lector de
  pantalla funcionan sin roving tabindex.
- Al elegir, el foco pasa al primer campo del formulario. Al tocar "Cambiar", el
  foco vuelve a la opción elegida.
- Sin JS el formulario debe seguir siendo alcanzable: la visibilidad se resuelve
  con el patrón `.js` que el repo ya usa en `global.css`
  (`.js [data-reveal]`, `.js dialog[open] …`), dentro de un `<style>` scoped del
  propio componente, para no tocar `global.css`. Con JS: paso 1 visible y form
  oculto. Sin JS: paso 1 oculto y form visible.

## Fuera de alcance

- Descripciones por opción en las tarjetas del paso 1.
- ~~Caso de estudio contextual en el modal según el servicio elegido~~: cerrado
  el 2026-09-22. El autor eliminó el caso de estudio del modal de éxito (era fijo
  en `modal.nextHref`), así que la idea pierde sentido: el modal queda centrado,
  con una sola acción y sin CTA secundario.
- Limpieza del CSS muerto `.select-chevron` y de `ChevronDownIcon.astro`.
- `docs/features/contact-form-integration.md` está desactualizado (habla de
  `simulateSend` y de un POST JSON cuando hoy se manda `FormData`) y no se toca.
- Los textos `"Enviando..."` y `"Reintentar"` están hardcodeados en el script
  pese a la regla del repo de mantener el copy en `content.ts`.

## Criterios de aceptación

1. Al entrar a `/contacto#contacto` o al bloque de contacto del home se ve el
   paso 1, no el formulario.
2. Elegir una opción muestra el formulario con el servicio elegido visible y el
   input `name="service"` con el value correcto.
3. "Cambiar" vuelve al paso 1 y devuelve el foco a la opción elegida.
4. El POST a Web3Forms sigue enviando `service` con el value elegido.
5. Tras un envío exitoso el flujo vuelve al paso 1 con todo limpio.
6. Sin JS el formulario sigue siendo alcanzable y usable (degradado).
7. `npx astro check` y `npm run build` pasan; el CSS emitido contiene las reglas
   `.js` de visibilidad.

## Tareas

- [x] Reescribir `ContactForm.astro`: paso 1 + resumen de servicio + estado
- [x] Actualizar `content.ts`: opción e-commerce y strings del paso 1
- [x] Documentar el flujo en `docs/features/interactive-features.md`
- [x] Verificar con `astro check` + build + CSS y HTML emitidos

## Evidencia

- Commit: `7467515` — `feat(form): paso de eleccion de servicio antes del formulario`.
- `npx astro check`: `Result (56 files): 0 errors, 0 warnings, 0 hints` (exit 0).
- `npm run build`: `10 page(s) built in 1.07s`, `Complete!` (exit 0).
- Cascada CSS emitida (verificada por un agente independiente, no por el
autor del cambio), en el `<style>` scoped del HTML construido:

```css
[data-astro-cid-vekgkm42][data-service-step]{display:none}
.js [data-astro-cid-vekgkm42][data-service-flow][data-step=service] [data-astro-cid-vekgkm42][data-service-step]{display:block}
.js [data-astro-cid-vekgkm42][data-service-flow][data-step=service] [data-astro-cid-vekgkm42][data-service-form]{display:none}
.js [data-astro-cid-vekgkm42][data-service-flow][data-step=form] [data-astro-cid-vekgkm42][data-service-form]{display:grid}
```

  Gana la regla scoped sobre la utility `.grid` de Tailwind por tres vías
  simultáneas: especificidad (0,5,0) contra (0,1,0), estar fuera de
  `@layer utilities`, y orden de declaración (el `<style>` se inyecta después
  del `<link>` al bundle). Sin JS el form conserva su `display: grid`.
- Markup emitido: `data-step="service"` en el wrapper, exactamente 5 botones
  `data-service-option` (`erp`, `crm`, `landing`, `ecommerce`, `otros`), el input
  oculto `name="service"` y el `[data-error-for="service"]` dentro del form, 0
  ocurrencias de `data-select`. La variante `simple` del home sigue sin
  `name="message"` y `/contacto` lo conserva.
- Corrección posterior a la implementación: la etiqueta "Servicio de interés"
  estaba dentro de la caja de resumen; se movió arriba, consistente con los
  otros cuatro campos.
- No verificado (no hay automatización de navegador en el repo): click real,
  transición entre pasos, manejo de foco, submit real a Web3Forms y render
  visual. El comportamiento está verificado por lectura de código contra la
  especificación.
