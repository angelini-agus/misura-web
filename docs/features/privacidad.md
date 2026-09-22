# Feature: Página de privacidad

## Objetivo
Publicar una página real de privacidad en `/privacidad` que explique qué hace
misure con los datos del formulario de contacto, y linkearla desde el
formulario y desde la fila legal del footer.

## Qué se hizo
1. **Copy en `src/lib/content.ts`**: se agregó el export top-level `privacy`
   con `title`, `description`, `eyebrow`, `h1`, `intro`, `updatedAt` y siete
   secciones (`sections`), cada una con `title` y `body` (array de párrafos).
   Todo el texto vive en el content module; la página no hardcodea copy.
2. **Página `src/pages/privacidad.astro`**: nueva, con la plantilla del repo
   (`BaseLayout` + `Header` + `main#contenido` + `PageHeader` + `Footer`). El
   cuerpo es una sección con el separador `border-t border-green`, ancho
   `max-w-3xl`, la línea `updatedAt` arriba y un bloque por sección iterado
   desde `privacy.sections` (un `<h2>` y sus párrafos debajo). No lleva
   `StickyCta`: es una página legal, no de conversión.
3. **Link en el formulario** (`ContactForm.astro`): debajo del disclaimer se
   agregó un link a `/privacidad` con `contactForm.privacyLabel` y el estilo
   `link-ink`. Además, el bloque de envío pasó de `items-start` a
   `items-center`, el disclaimer quedó con `max-w-md text-center`.
4. **Link en el footer** (`Footer.astro`): en la fila legal, el `<p>` que
   renderizaba `footer.tagline` ("Desarrollado por misure") se reemplazó por un
   anchor a `/privacidad` con `footer.privacyLabel`. `footer.tagline` se
   eliminó de `content.ts` al no quedar ningún otro uso; `site.tagline` (el
   texto bajo el logo) no se tocó.
5. **Por qué se menciona a Web3Forms**: el formulario hace POST a
   `https://api.web3forms.com/submit`, así que Web3Forms es el único tercero
   que interviene en el envío. Omitirlo en la política habría sido una promesa
   falsa: los datos sí pasan por un intermediario técnico antes de llegar a
   contacto@misure.dev.

## Huecos conocidos
- **Logs del hosting**: la política no cubre los registros de acceso del
  proveedor de hosting porque el repo no tiene configuración de deploy (no hay
  `vercel.json` ni `netlify.toml`). Si el hosting registra accesos, conviene
  agregarlo a la página.
- **"Sin cookies ni analítica de terceros"**: la afirmación es cierta mientras
  `PUBLIC_GA_ID` siga sin definirse. `BaseLayout.astro` carga Google Analytics
  condicionalmente cuando esa variable de entorno existe; si algún día se
  define, hay que actualizar la sección "Cookies y analítica" y la política
  completa.
- No hay browser automation en el repo: el centrado y la navegación de los
  links se verifican sobre el HTML emitido, no con un navegador real.

## Verificación
- `npx astro check` sin errores.
- `npm run build` sin errores.
- HTML emitido: `dist/privacidad/index.html` existe con el `<title>` y el
  `<h1>` de la página y las siete secciones; `/privacidad` aparece en
  `dist/sitemap-0.xml`; `dist/contacto/index.html` muestra el bloque de envío
  centrado con el link; `dist/index.html` muestra el link en la fila legal del
  footer en lugar de "Desarrollado por misure".
