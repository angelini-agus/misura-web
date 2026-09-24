# Feature: Integración del formulario de contacto (Web3Forms)

## Objetivo
Que el submit del formulario de contacto (`ContactForm.astro`) envíe un mail
real a contacto@misure.dev. El envío se hace desde el cliente con `fetch` y
`new FormData(form)` (multipart) al endpoint de Web3Forms.

## Contexto / restricciones
- El sitio es 100% estático (`astro build`, sin servidor/backend).
- No hay backend propio para SMTP, así que la solución es client-side con un
  servicio de formularios que recibe el POST y dispara el mail.
- No se agrega ningún paquete npm nuevo: solo `fetch` nativo.
- AGENTS.md: no agregar dependencias sin justificar.

## Servicio elegido: Web3Forms
Se eligió **Web3Forms** sobre Formspree porque se integra más simple con
`fetch` nativo: un único `POST` multipart a `https://api.web3forms.com/submit`
con `new FormData(form)`, donde viajan el campo `access_key` y los datos del
form con las mismas claves que sus atributos `name`. No hace falta token de
autenticación en el header ni transformar los datos a JSON. Plan gratis, sin
backend propio.

## Qué se hizo
1. **Config en `src/lib/content.ts`**: dentro de `contactForm`, se agregó
   `web3forms` con:
   - `endpoint: "https://api.web3forms.com/submit"`
   - `accessKey`: Access Key real de la cuenta de Web3Forms, ya cargado (no se
     reproduce el valor en este documento).
2. **Envío real en `ContactForm.astro`**: `fetch` POST a
   `https://api.web3forms.com/submit` con `new FormData(form)` (multipart). Las
   claves que viajan son `access_key`, `name`, `company`, `email`, `phone`,
   `service` y `message`; este último no existe en la variante simple de la
   home.
3. **Estados del botón**: se deshabilita el botón y se muestra
   `contactForm.submittingLabel` durante el envío; al terminar vuelve a
   `submitLabel`, o a `contactForm.retryLabel` si falló (ya no hay copy
   hardcodeado en el script). En éxito se abre el `<dialog>` de
   `contactForm.modal`.
4. **Manejo de error anunciado**: si el `fetch` falla (sin conexión, servicio
   caído, key inválida o `response.ok` falso) se escribe `contactForm.formError`
   en la región `#contact-form-error` (`data-form-error`, `role="alert"`) y se
   le quita `sr-only` para que quede visible y sea anunciada. La región se
   limpia y vuelve a `sr-only` al inicio de cada intento de envío. El form
   **NO** se resetea, para no perder lo escrito.
5. **Errores de campo asociados**: cada `<p data-error-for>` tiene id estable
   (`cf-name-error`, `cf-email-error`, `cf-phone-error`, `cf-service-error`) y
   arranca en `sr-only` en vez de `hidden`, para seguir en el árbol de
   accesibilidad; cada control lo referencia con `aria-describedby` y `setError`
   alterna `sr-only` + `aria-invalid`. El teléfono es **obligatorio** (pedido del
   autor: es el canal para contactar al interesado, incluso por WhatsApp) y exige
   al menos 6 caracteres; el label lleva el asterisco, como nombre y email.
6. **Entrada al formulario: siempre paso 1.** El servicio elegido no se recuerda
   entre visitas. El flujo vuelve al paso 1 en cada `astro:page-load`, en la
   vuelta desde la bfcache (`pageshow`) y al clickear un link que apunta a
   `#contacto`. El listener de click va en fase de captura porque el router de
   Astro corta la propagación del evento. Si el visitante ya escribió algo, el
   reset conserva sus respuestas (`keepValues`) y solo limpia el servicio; un
   envío fallido no resetea nada. El envío exitoso sí hace el reset completo.
   El reset también vacía el input oculto `service`, para que el valor que el
   navegador restaura por su cuenta no viaje en un envío que el visitante no
   eligió.
7. **Modal de éxito centrado y sin CTA secundario.** El `<dialog>` centra todo
   (sello, título, cuerpo y botón) y queda con una sola acción, "Cerrar". Se
   eliminó el link al caso de la empresa de limpieza junto con `nextLabel` y
   `nextHref` de `contactForm.modal` en `src/lib/content.ts`.
8. **Campo de mensaje sin redimensionar.** El textarea tiene alto fijo
   (`rows="5"`), no se puede agrandar a mano (`resize-none`) y scrollea por
   dentro cuando el texto no entra, sin barra de scroll visible.

## Paso manual pendiente
Ninguno. La cuenta de **web3forms.com** ya existe con destino de mail
**contacto@misure.dev** y el Access Key está cargado en
`contactForm.web3forms.accessKey` en `src/lib/content.ts`.

## Verificación
- `npm run build` sin errores.
- Probar el form en `/contacto` y en el bloque de contacto de la home:
  completar y enviar → debe llegar el mail a contacto@misure.dev. Si el envío
  falla, se mostrará `formError` sin resetear el form.
- Verificado en un build de Chromium servido con `astro preview`: tras un
  `pageshow` simulado de bfcache el formulario vuelve al paso 1 conservando lo
  ya escrito, el click en el CTA del paso 2 vuelve al paso 1, el envío exitoso
  limpia todo detrás del modal y el fallido conserva las respuestas y muestra
  la región de error. El textarea reporta `resize: none` y una scrollbar de
  ancho cero.

## Anclaje del CTA al formulario (24-09-2026)

El CTA que lleva al formulario (`/contacto#contacto` desde el navbar, el footer y el
hero) aterrizaba con `scroll-margin-top: 96px` mientras el header mide 67 px en
mobile y 77 px en desktop: dejaba 19-29 px de hueco arriba y **cortaba 81 px del
formulario abajo**. Ahora el `scroll-margin-top` es exactamente el alto del header
(`var(--contact-nav-h)`), así que la sección arranca pegada a él.

Medido con click real: 1440x1080 → la sección entra completa (1003 px visibles de
1004, sin hueco arriba); 1440x900 → 823 de 885 px (los 62 px que sobran son la
sección misma: su contenido supera los `100dvh − nav`); 375x667 → arranca pegada al
header (67) y el resto se scrollea. Idéntico al entrar por client-side desde
`/proyectos` que desde la misma página.

### Corrección 24-09: la tarjeta va centrada, no pegada al header

El scroll del CTA dejaba la sección pegada al header: en 1440x900 eso daba 97 px de
aire arriba y solo 35 abajo, es decir la tarjeta del formulario descentrada. Ahora el
destino declara `data-scroll-align="center"` y el handler de `BaseLayout` centra el
elemento marcado con `data-scroll-card` (la tarjeta), no la sección: la sección es más
alta que la franja y el navegador no puede centrar algo más grande que el viewport.

El `scroll-margin-top` de la tarjeta (`var(--contact-nav-h)`) es lo que convierte el
centro de la ventana en el centro de la franja real (la que queda entre el header y el
borde inferior). Y centra **solo si la tarjeta entra** en esa franja: en mobile mide
1292 px sobre 600 disponibles, así que ahí cae a alineación arriba, que es la que deja
el arranque del formulario a la vista. El `scroll-margin-top` de la sección mantiene
los 2 px de menos para que su línea no quede pegada a la del header.

| viewport | aire arriba / abajo | resultado |
| --- | --- | --- |
| 1440x1080 | 96 / 97 | centrada |
| 1440x900 | 66 / 66 | centrada (el scroll pasa de 359 a 390: baja más) |
| 1280x800 | 16 / 16 | centrada, justa |
| 375x667 | 65 / — | la tarjeta no entra: alineación arriba, se ve el arranque |

Además, la llegada por hash desde otra página (`/contacto#contacto`) no pasa por el
handler de click: la maneja el ClientRouter con alineación `start`. Por eso se reencuadra
en `astro:page-load` con el mismo helper, 80 ms después de montar la página nueva.
