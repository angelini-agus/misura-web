# Feature: Copy del mensaje, página de privacidad y centrado del envío

## Objetivo

Tres ajustes pedidos por el usuario sobre el formulario de contacto y el footer:

1. El campo de texto libre deja de llamarse "Mensaje" y pasa a llamarse "Detalles".
2. Su placeholder pasa a preguntar por el problema concreto del negocio.
3. La línea legal del formulario linkea a una página real de privacidad, con el
   tratamiento de datos que hace misure.
4. El botón de enviar y el texto de la línea legal quedan centrados en el eje X.

## Decisiones del usuario

1. **Privacidad: completa y honesta.** La página declara el uso de los datos, que
   no se venden ni ceden, y **menciona a Web3Forms** como procesador del envío.
   Omitirlo habría sido una promesa falsa: el formulario sí pasa por un tercero.
2. **Se linkea en los dos lados:** en el disclaimer del formulario y en la fila
   legal del footer, donde el link reemplaza a "Desarrollado por misure", que
   repetía la marca dos veces en la misma fila.
3. **Etiqueta del servicio arriba de la caja**, consistente con los otros cuatro
   campos. Se corrigió en la rama anterior, antes de su commit.
4. **Rama encadenada:** esta rama sale de `feat/contact-service-step` (`afb8673`),
   no de `master`. Las dos tocan `ContactForm.astro` y `content.ts`, así que
   ramificar desde `master` garantizaba conflictos al mergear. Encadenadas, la
   segunda se mergea sin conflictos después de la primera.

## Contexto verificado

- **No hay `.env`**, así que `PUBLIC_GA_ID` está vacío y Google Analytics no está
  activo. Por eso la página puede afirmar honestamente que no hay analítica de
  terceros.
- No existe ningún uso de `localStorage`, `sessionStorage` ni cookies en `src/`:
  la afirmación "este sitio no usa cookies" es verificable en el código.
- No hay configuración de hosting en el repo (ni `vercel.json` ni `netlify.toml`),
  así que la política **no menciona logs del proveedor de hosting**. Es un hueco
  conocido: si el hosting registra accesos, conviene agregarlo.

## Alcance

- `src/lib/content.ts`: `labels.message`, `placeholders.message`, nuevo
  `privacy` con el texto completo, `contactForm.privacyLabel`, `footer.privacyLabel`.
- `src/pages/privacidad.astro`: página nueva, con la plantilla del repo
  (`BaseLayout` + `Header` + `main#contenido` + `PageHeader` + `Footer`).
- `src/components/ContactForm.astro`: centrado del bloque de envío y link.
- `src/components/Footer.astro`: link en la fila legal.
- `docs/features/privacidad.md`: documento de la página.

## Fuera de alcance

- Agregar la página al listado de rutas de `public/llms.txt`.
- Cleanup de `.select-chevron` en `global.css` y de `ChevronDownIcon.astro`.
- Los textos `"Enviando..."` y `"Reintentar"` hardcodeados en el script.

## Criterios de aceptación

1. La etiqueta del campo es "Detalles" y el placeholder es la pregunta nueva.
2. `/privacidad` existe, es navegable desde el formulario y desde el footer, y
   renderiza las 7 secciones del texto.
3. El botón de enviar, el disclaimer y el link están centrados en el eje X.
4. El footer ya no muestra "Desarrollado por misure" y sí el link a privacidad.
5. El POST a Web3Forms sigue enviando los mismos campos.
6. `npx astro check` y `npm run build` pasan; el HTML emitido contiene la página
   nueva y los links.

## Tareas

- [x] Copy del mensaje: etiqueta "Detalles" y placeholder nuevo
- [x] Página `/privacidad` con el texto de tratamiento de datos
- [x] Link a privacidad en el formulario y en la fila legal del footer
- [x] Centrar botón de enviar, disclaimer y link
- [x] Verificar con `astro check` + build + HTML emitido

## Evidencia

- Commit: `bd4d08b` — `feat(legal): pagina de privacidad, copy del mensaje y envio centrado`.
- `npx astro check`: `Result (57 files): 0 errors, 0 warnings, 0 hints`.
- `npm run build`: `11 page(s) built in 940ms`, `Complete!`; se emite
  `dist/privacidad/index.html` y la ruta aparece en `dist/sitemap-0.xml`.
- Verificación independiente (agente distinto del autor del cambio): las 7 secciones
  presentes y en orden, con 2/2/2/2/2/1/1 párrafos de cuerpo efectivamente renderizados
  (no solo los títulos); bloque de envío con `items-center` + `max-w-md text-center` +
  anchor a `/privacidad`; fila legal del footer con el anchor y sin "Desarrollado por
  misure" en `src/` ni en `dist/`; `site.tagline` intacta; y el flujo de dos pasos del
  formulario sin regresiones (`data-service-flow`, las cuatro reglas `.js` de la cascada,
  `chooseService`/`changeService` y payload `access_key, name, company, email, phone,
  service, message`).
- No verificado: centrado visual real, click de los links y render de la página en
  navegador (no hay automatización de navegador en el repo).

## Hallazgo posterior sobre este mismo texto

La auditoría de cumplimiento detectó que el disclaimer del formulario
("no compartimos tu información con terceros", `content.ts`) contradice a esta
política, que sí declara a Web3Forms como tercero. Se corrige en la rama
`fix/a11y-compliance-audit`.
