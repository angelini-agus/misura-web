# Feature: marca y contacto BottegaDevs

## Objetivo

Pasar los datos de contacto y el nombre del sitio a lo que el autor definió:

- Email: `contacto@bottegadevs.com` (antes `contacto@misure.dev`).
- LinkedIn: `https://www.linkedin.com/company/bottegadevs` (antes `/company/misure`).
- Instagram: `https://www.instagram.com/bottegadevs` (antes `/misure.dev`).
- El nombre pasa a **BottegaDevs** en todos los textos donde decía "Bottega Dev".
- **Dominio: `https://bottegadevs.com`** en canonical, sitemap, `robots.txt`,
  `llms.txt`, JSON-LD y `astro.config.mjs` (antes `bottegadev.com`).

## Decisiones

1. **El dominio cambia a `bottegadevs.com`** (decisión explícita del autor): el
   email y los handles ya viven en ese dominio, así que el sitio queda alineado.
2. **El wordmark queda `bottega`.** La marca gráfica en Lora (apertura de la home,
   navbar, footer y el `<span>` final del hero) y la entrada del diccionario no se
   tocan: `site.name` sigue siendo `"bottega"`. Lo que cambia es el *nombre*
   (`legalName`, títulos, metadatos, copyright), que pasa a "BottegaDevs".
3. **El copyright del footer pierde `BrandWord`.** El componente parte el texto
   por la palabra marca y la pone en negrita; con "BottegaDevs" eso dejaba media
   palabra en negrita ("**Bottega**Devs"). Ahora el nombre entero va en un
   `<strong>`, que es la misma énfasis de antes pero sin cortar la palabra.
4. **No se toca `package.json`** (`"name": "misure-web"`): el repo y la carpeta
   local siguen igual, por decisión previa.
5. **No se toca `docs/copy-completo.md`**: es un volcado viejo del copy, está
   ignorado por git y quedó desactualizado a propósito. Si el autor lo quiere
   vigente, hay que regenerarlo, no parchearlo.

## Dónde

- `src/lib/content.ts`: `site.url`, `legalName`, `metaTitle`, `metaDescription`,
  títulos y descripciones de las páginas, títulos de los 6 casos, `contact.email`,
  `contact.socials` (URL y `displayLabel`) y las dos menciones al email en la
  política de privacidad.
- `astro.config.mjs` (`site`), `public/robots.txt` (sitemap), `public/llms.txt`
  (nombre, email y web), `README.md` (título).
- `src/layouts/BaseLayout.astro`: el comentario del canonical y el del schema.
- `src/components/ui/BrandWord.astro` y `src/components/Footer.astro`.
- `docs/features/contact-form-integration.md` y `docs/features/privacidad.md`
  (documentan el email real del formulario).

## Verificación

- `astro check`: 0 errores, 0 warnings, 0 hints. Build de 11 páginas.
- En el `dist` no queda ninguna referencia vieja: `contacto@bottegadevs.com`,
  `linkedin.com/company/bottegadevs` e `instagram.com/bottegadevs` en las 11
  páginas, `https://bottegadevs.com` en las 11 + `llms.txt`, y
  `sitemap-0.xml` con las 6 URLs en el dominio nuevo.
- El footer muestra "© 2026 BottegaDevs. Todos los derechos reservados" y el
  wordmark sigue diciendo `bottega`.

## Pendiente (fuera del repo)

- **Web3Forms**: el destinatario está atado al Access Key del panel. Si la casilla
  nueva es `contacto@bottegadevs.com`, hay que cambiarlo ahí; en el código no hay
  ninguna dirección de destino que tocar.
- Los handles de LinkedIn e Instagram tienen que existir con ese nombre para que
  los links no den 404.
