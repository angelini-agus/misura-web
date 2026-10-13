# Feature: Bottega Dev — renombre de marca, wordmark tipográfico y dominio

## Objetivo

El sitio deja de llamarse **misure** y pasa a llamarse **bottega**. El nombre
anterior estaba ocupado (el dominio `misure.dev` ya era de otro y hubo que
elegir marca nueva). El cambio no es un find/replace: el logo deja de ser un
wordmark vectorial y pasa a ser texto, el dominio cambia, y los íconos se
regeneran.

## Decisiones del usuario

1. **Marca: `bottega`**, una sola palabra, en minúscula. Igual que `misure`:
   el nombre de marca es una palabra suelta y el wordmark la escribe tal cual.
   Viene del italiano *bottega* (taller, obrador), el mismo registro que
   *misura*.
2. **Nombre completo: `Bottega Dev`**. Es el nombre legal registrado, y va en
   metadata, títulos de pestaña, JSON-LD y copyright. El ícono y el wordmark
   dicen `bottega` solo.
3. **Dominio: `https://bottegadev.com`**. Descartado `bottega.dev`: está
   registrado por un tercero y aparcado para venta en GoDaddy (NS
   `ns39/ns40.domaincontrol.com`, SOA `dns.jomax.net`, HTTP 200 con redirect a
   `/lander`). `bottegadev.com` no resuelve en DNS, que es la señal de
   disponibilidad. **Verificar en el registrador antes de comprar**: el DNS
   solo prueba que hoy no hay zona pública.
4. **El logo grande deja de ser SVG y pasa a ser texto**: tipo de letra normal,
   familia **Lora en peso Medium (500)**, sin efectos. Aplica al wordmark del
   diccionario, al del navbar y al del footer, que son el mismo logo.
5. **Íconos y OG image se rehacen** con la inicial nueva: `b.` en Lora Medium
   sobre el círculo crema, conservando el diseño del `m.` actual.
6. **El email de contacto NO cambia**: sigue `contacto@misure.dev`, que hoy
   funciona. `bottegadev.com` todavía no está comprado, así que una casilla ahí
   no existe.
7. **Los links sociales NO cambian**: el footer sigue apuntando a
   `linkedin.com/company/misure` e `instagram.com/misure.dev`. No se rompen
   accesos que funcionan y no queda ningún link muerto en el sitio.
8. **El repositorio y la carpeta local NO cambian**: sigue `misura-web` en
   GitHub y `C:/Programacion/misura-web` en disco. `upstream` es el fork de
   Franco (`francocus/misure-web`), y renombrar el repo lo afectaría a él.

## Contexto verificado

- **126 ocurrencias** de `misure`/`misura` en **35 archivos** tracked, más 4
  archivos con `misur` en el nombre.
- **El logo es trazado vectorial**: `public/misure-logo.svg` tiene 94 `<path>` y
  cero `<text>`. Rasterizado dice `misure` en serif. No se puede renombrar por
  texto.
- **El sitio no carga Lora**: usa `Plus Jakarta Sans Variable` para todo
  (`--font-sans` y `--font-display` en `src/styles/global.css`). Lora hay que
  agregarla como dependencia (`@fontsource-variable/lora`, existe en 5.3.0).
- **`MisureWord.astro` no es cosmético**: parte el copy por la palabra marca y
  la reemplaza por `<strong>{word}</strong>`. Tiene un bug: emite `word` literal
  en vez del fragmento original, así que "Bottega Dev" con `word="bottega"`
  perdería la mayúscula. Se corrige emitiendo `part`.
- **El logo del diccionario viaja al navbar por JS** (`initLogoMorph` en
  `Dictionary.astro`): mide el placeholder, el logo del header y la caja del
  link, y interpola `scale` y `translate` en scroll. Depende de
  `placeholder.complete` y del evento `load`, que son propiedades de `<img>` y
  no existen en un elemento de texto. Además el header mide 620px de layout
  escalados a 133px para que el navegador nunca agrande el mapa de bits; con
  texto esa restricción desaparece porque el texto se re-renderiza nítido a
  cualquier escala.
- **El árbol de trabajo tiene 5 cambios sin commitear del usuario**, y uno de
  ellos es `src/lib/content.ts`, el archivo con más ocurrencias de la marca:
  `content.ts` (la acepción del diccionario), `src/styles/global.css`,
  `src/components/ui/ScreenshotFrame.astro`, y las bajas de `image.png` y
  `src/assets/team-trabajando.jpg`. Ninguna se pisa ni se commitea.

## Inventario de cambios

### Infraestructura

| Archivo | Cambio |
| --- | --- |
| `astro.config.mjs` | `site` pasa a `https://bottegadev.com` |
| `public/robots.txt` | Sitemap a `https://bottegadev.com/sitemap-index.xml` |
| `public/llms.txt` | Marca y dominio (el email queda) |
| `src/layouts/BaseLayout.astro` | `ogImage`, comentarios, `legalName` en el JSON-LD |
| `README.md` | Título del proyecto |

### Contenido (`src/lib/content.ts`)

`site.name` → `bottega`; `site.legalName` nuevo → `Bottega Dev`;
`site.url` → `https://bottegadev.com`; `metaTitle` y `metaDescription`;
`pages.*.title` y `description`; `privacy.*`; `about.body`; `faq`; el testimonio;
los títulos de los 6 casos; y `dictionaryEntry`.

**Preservado sin tocar**: `contact.email` y `social`.

### Componentes

`MisureWord.astro` → `BrandWord.astro` (nombre genérico, para que el próximo
cambio de marca no vuelva a acoplar el archivo al nombre del producto) y sus 11
puntos de uso; `window.__misureShareDelegated` → `__brandShareDelegated`;
`src="/misure-logo.svg"` desaparece de `Header`, `Footer` y `Dictionary`.

### Tipografía y wordmark

`@fontsource-variable/lora` + `--font-wordmark` en `@theme`; el `<img>` del
diccionario y el del navbar pasan a elementos de texto; el script de morphing se
adapta a texto.

### Assets

`public/misure-logo.svg` se elimina; `favicon.svg`, `favicon.ico`,
`apple-touch-icon.png` y la OG image se regeneran como `b.`.

### Documentación

`docs/features/*` (11 archivos) y `odd/tasks/*` (4 archivos). Donde el nombre
viejo es un hecho histórico o infraestructura viva (el email, los handles, el
nombre del repo, la URL de producción actual) se conserva y se marca.

## Tareas

1. Infraestructura: dominio, robots, llms, BaseLayout.
2. Contenido: `content.ts` completo.
3. Componentes: rename de `BrandWord` y sus usos, guard de `ShareButton`.
4. Tipografía y wordmark: Lora, texto en los tres lugares, script de morphing.
5. Assets: íconos y OG image.
6. Documentación: README, `docs/features`, `odd/tasks`.
7. Verificación: `astro check`, build, y medición del morphing y del wordmark en
   navegador a varios anchos y altos.

## Pendientes que esta feature deja abiertos

- **Acepción del diccionario**: hoy dice una frase derivada de *misura*
  (medida). Con *bottega* (taller) el sentido cambia, pero es copy y lo decide
  el usuario. No se inventa.
- **Logo definitivo**: el wordmark tipográfico es la solución pedida, no un
  placeholder. Si más adelante hay un logo dibujado, reemplaza a este.
- **Email**: `contacto@misure.dev` hasta que exista la casilla en el dominio
  nuevo.
- **Redes**: los handles actuales hasta que existan las cuentas de bottega.
- **Repo y carpeta**: `misura-web` hasta que se decida renombrarlo, con el
  acuerdo de Franco.

## Verificación

- `npx astro check` sin errores y build completo de las 11 páginas.
- Cero ocurrencias de `misure` en el sitio construido, salvo el email y los
  handles por decisión.
- El wordmark mide lo que el diseño pide en los tres lugares, y el morphing
  llega al navbar sin saltos ni desplazamientos laterales.
- Medición por alto de ventana (regla del usuario): 1080, 970, 900, 776, 720,
  668, 647 y 540 px; y por ancho: 360, 390, 768, 1024, 1280, 1440 y 1920.
