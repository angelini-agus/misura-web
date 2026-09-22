# Feature: Ajustes de la versión mobile (CTA de navbar, CTA fijo y orden del hero)

## Objetivo

Cerrar tres ajustes pedidos por el usuario sobre la versión mobile del sitio:

1. El CTA de la navbar desaparece en mobile y pasa a vivir dentro del menú
   desplegable (oculto por defecto, porque el menú arranca cerrado).
2. El CTA fijo del pie deja de estar siempre visible: aparece recién cuando el
   usuario sale de la primera pantalla del hero y se vuelve a esconder cuando
   sube de nuevo.
3. En el hero, el orden mobile pasa a ser panel de código (SVG), título, copete y
   botones, y todo se compacta lo necesario para que los dos botones entren
   dentro de los primeros `100dvh`.

El motivo del 1 y el 2 es el mismo que dio el usuario: hoy el botón "Quiero mi
prototipo gratis" aparece tres veces al mismo tiempo en la primera pantalla
(CTA de la navbar, CTA del hero y CTA fijo del pie).

## Decisiones del usuario

- "La foto" del pedido es **el panel de código** (el `CodePanel` SVG). El hero no
  tiene foto y no se agrega ninguna imagen nueva.
- Si los botones no entran en los primeros `100dvh`, se **achica lo necesario**
  (padding del hero, título mobile, tamaño del panel y gaps). El orden pedido se
  mantiene y el copete no se mueve ni se recorta.
- El CTA fijo **se vuelve a esconder** al subir otra vez al hero.

## Unidades de trabajo

### U1 — Navbar: el CTA sale de mobile y entra al menú

`src/components/Header.astro`.

- El CTA de la navbar queda solo para `md+` (`hidden md:inline-flex`).
- El mismo CTA (`headerCta`, sin copy nuevo) se agrega como último ítem del
  `<details>` que abre el menú mobile. Como el `<details>` arranca cerrado, el
  CTA no se ve por defecto; el script existente ya cierra el menú al clickear
  cualquier `<a>` de adentro.
- El header mobile deja de medir 77px: el CTA era su elemento más alto. La nueva
  altura es 67px (`py-4` 32px + `summary` 34px + `border-b` 1px). Hay que
  actualizar `--contact-nav-h` en `src/components/Contact.astro`, que hoy asume
  77px para el cálculo de `100dvh` de la sección de contacto, y su comentario.

### U2 — CTA fijo del pie: aparece al salir del hero

`src/components/StickyCta.astro`.

- Estado inicial oculto (`translate-y-full` + `opacity: 0`) e `inert`, para que
  no sea focuseable ni exista para el lector de pantalla mientras está oculto.
- Se muestra cuando `window.scrollY > window.innerHeight * 0.85` (el usuario ya
  salió de la primera pantalla del hero) y se esconde cuando vuelve por encima
  de ese umbral.
- También se esconde mientras el `footer` está en pantalla: el footer ya tiene
  el mismo CTA y el panel fijo le tapa las últimas líneas.
- Scroll listener pasivo con coalescing por `requestAnimationFrame` y mutación
  del DOM solo cuando cambia el estado; `IntersectionObserver` para el footer;
  recálculo en `resize`. Se registra en `astro:page-load` (que también dispara en
  la carga inicial) sin apilar listeners entre navegaciones.
- Movimiento con `transform` y `opacity` (200ms, `var(--ease-out)`), que ya
  queda neutralizado por el bloque global de `prefers-reduced-motion`.
- `md:hidden`, el `aria-label` y el componente `Button` existentes no cambian.

### U3 — Hero mobile: SVG, título, copete y botones dentro de los 100dvh

`src/components/Hero.astro`.

- Orden visual en mobile: panel de código, título, copete, botones. El orden del
  DOM no cambia (el `h1` sigue primero para el lector de pantalla) y el
  reordenamiento se hace con utilidades `order-*` sobre el grid.
- Desktop intacto: texto 55% a la izquierda y panel 45% a la derecha.
- Compactación mobile: menos padding vertical del hero, `gap` más chico, `h1` a
  `text-3xl`, copete a `text-base` con menos margen, botones con menos margen
  superior y panel limitado en ancho para que su alto acompañe.

## Fuera de alcance

- Copy nuevo: no se toca `src/lib/content.ts` ni ninguna cadena de texto.
- El trabajo en curso del autor en el working tree (formulario de contacto,
  `contactForm`, autofill, `docs/features/interactive-features.md`).
- Los hallazgos de design-gate de la auditoría (`grid-template-rows` del
  `.details-collapse` y el titileo infinito del cursor del `CodePanel`).
- Fotos: no se agrega ninguna imagen al hero.

## Modo TDD resuelto

- **Modo:** off. **Fuente:** configuración del proyecto (`package.json` no tiene
  script de test y el repo no tiene runner). **Runner:** ninguno.
- Checks funcionales por unidad: `npx astro check`, `npm run build`, verificación
  contra el HTML/CSS emitido en `dist/` y captura headless a ancho mobile.

## Estrategia de entrega

`ask-on-risk` (por defecto). Pronóstico de líneas autoradas: ~140 (adiciones más
borrados), muy por debajo de las 400, así que la estrategia no se dispara y la
feature queda en un solo PR. El trabajo mobile vive en la rama **`feat/mobile`**,
creada desde el HEAD de `fix/a11y-compliance-audit` (que ya está dentro de
`master`) y pusheada a `origin` y `upstream`. El trabajo del formulario (textarea,
modal, reset al paso 1) no forma parte de esta rama: sigue sin commitear en el
working tree, junto con la edición en curso del autor en `ContactForm.astro`.

## Criterios de aceptación

1. En mobile, la navbar no muestra ningún CTA; el CTA está dentro del menú y solo
   se ve con el menú abierto. En desktop el CTA de la navbar sigue igual.
2. El CTA fijo del pie no se ve en la primera pantalla del hero, aparece al
   scrollear más allá de ella y se esconde al volver arriba y al llegar al footer.
3. En mobile el orden del hero es SVG, título, copete, botones, y los dos botones
   entran dentro de los primeros `100dvh` (medido a 390×844 y 375×667).
4. Desktop sin cambios visibles en el hero.
5. El CTA fijo oculto no es focuseable ni lo anuncia el lector de pantalla.
6. `npx astro check` y `npm run build` pasan, sin CLS nuevo.

## Tareas

- [x] U1 — Navbar: el CTA sale de mobile y entra al menú
- [x] U2 — CTA fijo del pie: aparece al salir del hero
- [x] U3 — Hero mobile: SVG, título, copete y botones dentro de los 100dvh
- [x] Verificación independiente (`astro check`, `build`, HTML emitido, capturas mobile)

## Evidencia

### Implementación

Los tres cambios quedaron en cuatro commits de la rama `feat/mobile`
(`839ea6b`, `c671f48`, `c81938f`, `901e748`), en cuatro archivos:
`src/components/Header.astro`, `src/components/Contact.astro` (solo la custom
property `--contact-nav-h` y su comentario), `src/components/StickyCta.astro` y
`src/components/Hero.astro`. No se tocó ningún texto de `content.ts`, ni
`global.css`, ni el formulario.

### Verificación estática (agente independiente, read-only)

- `npx astro check`: 57 archivos, 0 errores / 0 warnings / 0 hints.
- `npm run build`: exit 0, 11 páginas.
- Confirmado en `dist/index.html`: el CTA del navbar con `hidden` + `md:inline-flex`,
  el CTA dentro del `<details>` mobile, `order-2 md:order-1` y
  `order-1 … md:order-2` en el hero, y el `aside[data-sticky-cta]` con `inert`.
- Confirmado en el CSS emitido: `max-width:min(15rem,30dvh)`, la regla
  `[data-astro-cid-…][data-sticky-cta]{transform:translateY(110%)}` con su
  `.is-visible`, y `--contact-nav-h` dos veces (`4.1875rem` base y `4.8125rem`
  dentro de `@media (width>=48rem)`).
- El script del CTA fijo existe en las 9 páginas que lo renderizan y no existe en
  `/contacto` ni en `/privacidad`, que no lo importan.
- Los valores `md:` del hero son idénticos a `HEAD`.

### Medición en navegador real (Chrome 153 headless sobre `astro preview`, vía CDP)

Una sola instancia visible de "Quiero mi prototipo gratis" en la primera pantalla
en todos los anchos mobile (antes eran tres: navbar, hero y CTA fijo).

| Viewport | Header | Panel | Último botón (borde inferior) | ¿Entra en 100dvh? |
| --- | --- | --- | --- | --- |
| 390×844 | 67px | 240×187 | 734px | Sí (110px de margen) |
| 390×745 (iPhone real con barra del navegador) | 67px | 224×174 | 721px | Sí |
| 412×820 | 67px | 240×187 | 701px | Sí |
| 430×932 | 67px | 240×187 | 701px | Sí |
| 360×740 | 67px | 222×173 | 762px | Sí tras la compactación: ver la sección de escalones |
| 375×667 (iPhone SE) | 67px | 200×156 | 745px | Sí (+75, ver la sección de escalones) |
| 1440×900 (desktop) | 77px | 497×386 | 644px | Hero sin cambios; sigue con 2 CTAs en pantalla (navbar + hero), que es previo y está fuera del alcance mobile |

El header mobile mide 67px medidos, así que el `4.1875rem` de `--contact-nav-h`
está validado en el navegador, no estimado.

Estado del CTA fijo (igual en 390×844, 390×745, 375×667, 360×740, 412×820 y
430×932, y también en `/nosotros` y `/proyectos`):

| Posición | Estado |
| --- | --- |
| Arriba de todo (scroll 0) | Oculto, `inert`, `opacity 0`, fuera del viewport |
| Media pantalla (0.5 × vh) | Oculto |
| Pasado el hero (1.5 × vh) | Visible, sin `inert`, pegado abajo |
| De vuelta arriba | Oculto otra vez |
| Al final de la página (footer a la vista) | Oculto |

Sin overflow horizontal a 390, 375, 360, 412, 430 y 1440.

### Ajuste posterior del orquestador

La primera medición daba 746px en 390×844: entraba, pero sin margen para un
teléfono real (con la barra del navegador el viewport visible es ~745px). Se
achicó un paso más dentro de lo autorizado por el usuario: `py-8` → `py-6`,
`gap-6` → `gap-5` y el tope del panel `33dvh` → `30dvh`. Resultado medido: 734px
en 390×844 y 721px en 390×745.

### Escalones de compactación en celulares bajos

El criterio de los 100dvh se cerró con tres escalones, todos condicionados a
**ancho de celular** (hasta 30rem = 480px) **y** alto bajo, así que ni el desktop
ni los celulares altos los ven:

| Escalón | Condición | Qué cambia |
| --- | --- | --- |
| 1 | `max-height: 820px` | `h1` a 1.5rem, panel a `min(11rem, 24dvh)`, gaps y márgenes más chicos (`Hero.astro`) |
| 2 | `max-height: 620px` | panel a `min(9rem, 20dvh)` y los dos CTAs pasan a dos columnas (`Hero.astro`) |
| Barra de anuncio | `max-height: 620px` | 0.7rem, tracking 0.1em y `py-1.5` (`Header.astro`) |

Medición final en Chromium (borde inferior del segundo botón contra el alto del
viewport, contando barra de anuncio + header):

| Viewport | Antes | Ahora | Entra |
| --- | --- | --- | --- |
| 320×568 | 630 | 542 | Sí (+26) |
| 360×640 | 627 | 627 | Sí (+13) |
| 375×667 | 745 | 592 | Sí (+75) |
| 360×740 | 762 | 645 | Sí (+95) |
| 390×745 (iPhone con barra del navegador) | 721 | 604 | Sí (+141) |
| 375×553 (SE con las barras a la vista) | 571 | 495 | Sí (+58) |
| 390×844 / 412×915 / 430×932 | 734 / 701 / 701 | igual | Sí |
| 1440×900 y 768×1024 (desktop) | 644 / 846 | igual | Sin cambios: los `md:` y los tamaños base de desktop quedaron idénticos |

### Lo que queda abierto

- **El rango `sm` (640–767px de ancho) sigue sin cumplir.** A 700×800 el panel mide
  576×448 porque `sm:max-w-xl` lo deja casi a pantalla completa y los CTAs caen a
  906px. Es previo a este cambio y no es un celular en vertical, pero un plegable
  (por ejemplo 673×841) cae justo ahí: la corrección sería topar el panel también
  en `sm` (un ancho máximo acotado, sin usar la forma de clase de Tailwind, para
  que el escáner de contenido no emita CSS muerto desde este markdown), que
  cambiaría el layout de 640–767px y por eso no se aplicó sin pedido.
- **Defecto previo, no introducido acá:** entre 768px y ~1256px de ancho el hero
  desborda horizontalmente ~64px, porque `md:grid-cols-[55%_45%]` suma 100% y el
  `md:gap-16` se agrega por encima. Medido a 768×1024: `scrollWidth` 802 contra
  `innerWidth` 768; el elemento que sobresale es la columna visual del hero. Los
  valores `md:` son idénticos a `HEAD`, así que el defecto es anterior. La
  corrección de una línea sería `md:grid-cols-[55fr_45fr]`, pero angosta la
  columna de texto del hero en desktop, así que no se aplicó sin pedido.
- Sin verificación con lector de pantalla real ni con el `g` de Lighthouse.
