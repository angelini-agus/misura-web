# Feature: Integración del formulario de contacto (Web3Forms)

## Objetivo
Que el submit del formulario de contacto (`ContactForm.astro`) envíe un mail
real a contacto@misure.dev. Antes solo simulaba el envío con un `setTimeout`
(`simulateSend`) y no mandaba los datos a ningún lado.

## Contexto / restricciones
- El sitio es 100% estático (`astro build`, sin servidor/backend).
- No hay backend propio para SMTP, así que la solución es client-side con un
  servicio de formularios que recibe el POST y dispara el mail.
- No se agrega ningún paquete npm nuevo: solo `fetch` nativo.
- AGENTS.md: no agregar dependencias sin justificar.

## Servicio elegido: Web3Forms
Se eligió **Web3Forms** sobre Formspree porque se integra más simple con
`fetch` nativo: un único `POST` JSON a `https://api.web3forms.com/submit` con
un campo `access_key` y los datos del form como claves directas, sin necesidad
de token de autenticación en el header ni de armar `FormData` con nombres de
campo especiales. Plan gratis, sin backend propio.

## Qué se hizo
1. **Config en `src/lib/content.ts`**: dentro de `contactForm`, se agregó
   `web3forms` con:
   - `endpoint: "https://api.web3forms.com/submit"`
   - `accessKey: "[PENDIENTE: access key de Web3Forms]"` (placeholder real de
     una cuenta por crear).
2. **Envío real en `ContactForm.astro`**: se reemplazó `simulateSend()` por
   `sendForm()` que hace un `fetch` POST JSON a `web3forms.endpoint` con
   `access_key` + `name`, `company`, `email`, `phone`, `service`, `message`.
3. **UX mantenida**: se deshabilita el botón y se muestra `submittingLabel`
   durante el envío; al terminar, `successMessage` si OK o `formError` si falla.
4. **Manejo de error real**: si el `fetch` falla (sin conexión, servicio caído,
   key inválida, `response.ok` falso o `data.success === false`) se muestra
   `formError` y **NO** se resetea el form, para no perder lo escrito.
5. Se mantuvo la validación de campos existente (`baseValidators` /
   `fullValidators`), sin cambios de diseño, labels ni HTML de los campos.

## Paso manual pendiente
- Crear una cuenta en **web3forms.com** con destino de mail
  **contacto@misure.dev**.
- Copiar el Access Key generado y reemplazar
  `contactForm.web3forms.accessKey` en `src/lib/content.ts` (quitando el
  placeholder).

## Verificación
- `npm run build` sin errores.
- Probar el form en `/contacto` y en el bloque de contacto de la home:
  completar y enviar → debe llegar el mail a contacto@misure.dev. Con la key
  pendiente el fetch fallará y se mostrará `formError` sin resetear el form.
