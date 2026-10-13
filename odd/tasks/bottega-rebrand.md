# Feature: Bottega Dev — renombre de marca, apertura de la home y dominio

## Objetivo

El sitio deja de llamarse **misure** y pasa a llamarse **bottega**. El nombre
anterior estaba ocupado. El cambio no es un find/replace: el logo deja de ser un
wordmark vectorial y pasa a ser texto, la apertura de marca se muda de
`/nosotros` a la home, el dominio cambia y los íconos se regeneran.

## Decisiones del usuario

1. **Marca: `bottega`**, una sola palabra, en minúscula. Igual que `misure`: el
   nombre de marca es una palabra suelta y el wordmark la escribe tal cual.
   Viene del italiano *bottega* (taller, obrador), el mismo registro que
   *misura*.
2. **Nombre completo: `Bottega Dev`**, el nombre legal registrado. Va en
   metadata, títulos de pestaña, JSON-LD y copyright. El wordmark dice
   `bottega` solo.
3. **Dominio: `https://bottegadev.com`**. Descartado `bottega.dev`: está
   registrado por un tercero y aparcado para venta en GoDaddy (NS
   `ns39/ns40.domaincontrol.com`, SOA `dns.jomax.net`, HTTP 200 con redirect a
   `/lander`). `bottegadev.com` no resuelve en DNS, que es la señal de
   disponibilidad. **Verificar en el registrador antes de comprar**: el DNS solo
   prueba que hoy no hay zona pública.
4. **El wordmark deja de ser SVG y pasa a ser texto** en familia **Lora, peso
   Medium (500)**, sin efectos. Aplica al wordmark del navbar y al de la
   apertura de la home.
5. **El ícono circular es el FAVICON, no el header.** El círculo verde con la
   `b` (referencia que dejó el autor en la raíz del repo) es la solapa de la
   pestaña: `icono.svg`, `favicon.ico`, `apple-touch-icon.png` y la OG image. El
   navbar sigue con el wordmark de texto.
6. **La apertura de marca se muda a la home, como sección propia.** El wordmark
   a gran escala con su fonética, que era lo primero de `/nosotros`, pasa a ser
   lo primero de la home en su propia sección (no dentro del hero), y
   **conserva la animación**: al scrollear viaja y se acomoda en el navbar. El
   wordmark se queda en su tamaño máximo, los ~620px de ancho que tenía el logo
   de misure en `/nosotros`, sin compactarse por alto de ventana.
7. **`/nosotros` arranca directo en la fonética y la definición**, sin el
   wordmark (que ahora se ve al entrar al sitio).
8. **El email de contacto NO cambia**: sigue `contacto@misure.dev`, que hoy
   funciona. `bottegadev.com` todavía no está comprado.
9. **Los links sociales NO cambian**: el footer sigue apuntando a
   `linkedin.com/company/misure` e `instagram.com/misure.dev`.
10. **El repositorio y la carpeta local NO cambian**: sigue `misura-web` en
    GitHub y `C:/Programacion/misura-web` en disco. `upstream` es el fork de
    Franco (`francocus/misure-web`).

## Contexto verificado

- **126 ocurrencias** de `misure`/`misura` en **35 archivos** tracked, más 4
  archivos con `misur` en el nombre.
- **El logo viejo era trazado vectorial**: `public/misure-logo.svg` tenía 94
  `<path>` y cero `<text>`.
- **El sitio no cargaba Lora**: usaba `Plus Jakarta Sans Variable` para todo.
  Se sumó `@fontsource-variable/lora` (5.3.0).
- **`MisureWord.astro` no era cosmético**: parte el copy por la palabra marca y
  la reemplaza por `<strong>`. Tenía un bug: emitía `word` literal en vez del
  fragmento original, así que "Bottega Dev" con `word="bottega"` perdía la
  mayúscula. Se corrigió emitiendo `part`, y ahora se llama `BrandWord.astro`
  con el default tomado de `site.name` para que el próximo cambio de marca no
  lo vuelva a tocar.
- **El viaje del wordmark estaba roto por el reveal**: `measure()` usaba
  `getBoundingClientRect`, que incluye los transforms de las animaciones
  `data-reveal`. Medido en `/nosotros`: la caja del wordmark ya estaba en 225
  pero su rect devolvía 241 durante ~600ms después de cargar, así que el viaje
  quedaba 16px abajo. Ahora mide por `offsetTop`/`offsetLeft` acumulados, que es
  la posición de flujo y no depende de cuándo se mida.
- **La proporción del wordmark no es la del logo viejo**: la caja de texto de
  "bottega" en Lora tiene proporción 628/176 = 3.57, y la tinta mide 181px de
  alto sobre una caja de 176. El logo de imagen medía 4.17. Por eso la caja del
  link del navbar pasó de 133x32 a **115x32**: llenando los 32px de alto, el
  ancho da 115. Con el ancho viejo el texto escalaba al ancho y su tinta medía
  38px sobre una caja de 32, que es lo que se veía desproporcionado y
  desalineado hacia abajo.

## Inventario de cambios

### Infraestructura

`astro.config.mjs` (`site`), `public/robots.txt`, `public/llms.txt`,
`src/layouts/BaseLayout.astro` (`ogImage`, comentarios, `legalName` en el
JSON-LD de Organization, el favicon apuntando a `/icono.svg`).

### Contenido (`src/lib/content.ts`)

`site.name` → `bottega`; `site.legalName` nuevo → `Bottega Dev`; `site.url` →
`https://bottegadev.com`; `metaTitle` y `metaDescription`; `pages.*`;
`privacy.*`; `about.body`; `faq`; el testimonio; los títulos de los 6 casos; y
`dictionaryEntry` (`word` y `phonetic`).

**Preservado sin tocar**: `contact.email` y `social`.

### Componentes

`MisureWord.astro` → `BrandWord.astro` y sus 11 puntos de uso;
`window.__misureShareDelegated` → `__brandShareDelegated`; `Header` con el
wordmark de texto y la caja del link en 115x32; **`BrandOpening.astro`** (nuevo)
con la sección de la apertura y el script del viaje; `Hero` sin la apertura, con
sus cinco umbrales de compactación originales; `Dictionary` sin el wordmark y
sin el script; `Footer` con el copyright en `site.legalName`.

### Tipografía

`@fontsource-variable/lora`, `--font-wordmark` en `@theme`, la clase
`.wordmark` con sus tres variantes (`-hero`, `-nav`, `-footer`) y
`.font-typewriter` movida a `global.css` porque ahora la usan dos componentes.

### Assets

`public/icono.svg` (el ícono de marca y el favicon),
`public/favicon.ico` (16/32/48), `public/apple-touch-icon.png` (180x180),
`public/og-bottega-software.png` (1200x630). Se eliminaron
`favicon.svg`, `misure-logo.svg` y `og-misure-software.png`.

Los PNG y el `.ico` salen de un SVG con los paths del wordmark y de la `b`
extraídos de `Lora[wght].ttf` con fontkit (instanciada en `wght=500`), no de
texto: así no dependen de ninguna fuente instalada ni del navegador.

### Documentación

`README.md` y `docs/features/*` (14 archivos, 38 reemplazos). Donde el nombre
viejo es infraestructura viva (el email, los handles, el nombre del repo) se
conserva.

## Verificación

- `npx astro check`: 0 errores, 0 warnings (1 hint preexistente:
  `pediatricPortalAppointments` importado sin usar en `content.ts`, de la tarea
  de casos anterior).
- Build de 11 páginas.
- **El viaje del wordmark**: al scroll 0 el logo del navbar coincide con la caja
  del hero (delta medido 0.0 en x e y, a 1440x970 y a 390x844); en reposo
  coincide con la caja del link (delta 0.0 de ancho, 0.2 de alto, 0.1 de
  centrado).
- **Medición por alto de ventana** (regla del usuario):

  | ventana | 1080 | 970 | 900 | 880 | 776 | 720 | 668 | 647 | 600 | 540 |
  | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
  | Apertura entra en la primera pantalla (1440) | sí | sí | sí | sí | sí | sí | sí | sí | sí | no, +13px |
  | Hero entra en la suya (1440) | sí | sí | sí | sí | sí | sí | sí | sí | sí | sí |
  | Apertura entra (390) | sí | sí | sí | sí | sí | sí | sí | sí | sí | sí |
  | Hero entra en la suya (390) | sí | sí | sí | sí | sí | sí | sí | sí | sí | sí |

  El wordmark mide **628x176px en escritorio y 343x96px en mobile en todas las
  alturas**, fijo en su tamaño máximo. Antes de separar la apertura se achicaba
  hasta 40px de tipo en ventanas bajas, y al no achicarse más el hero recuperó
  su piso propio: **entra en su pantalla en todas las alturas medidas**, con el
  CTA dentro de la sección y entre 87 y 177px de sobra. La apertura entra en la
  primera pantalla desde 600px; a 540px (un 1080p al 200%) sobra por 13px.

## Pendientes que esta feature deja abiertos

- **Acepción del diccionario**: hoy dice una frase derivada de *misura*
  (medida). Con *bottega* (taller) el sentido cambia, pero es copy y lo decide
  el usuario. No se inventa.
- **Email**: `contacto@misure.dev` hasta que exista la casilla en el dominio
  nuevo.
- **Redes**: los handles actuales hasta que existan las cuentas de bottega.
- **Repo y carpeta**: `misura-web` hasta que se decida renombrarlo, con el
  acuerdo de Franco.
- **`docs/copy-completo.md`**: no está trackeado y quedó con la marca vieja en
  19 tokens. Es un archivo de trabajo del autor, no del repo, así que no se
  tocó.
- **`public/icono.svg` solo es favicon**: si más adelante el ícono circular
  tiene que aparecer también en el header o en el footer, el archivo ya está.
