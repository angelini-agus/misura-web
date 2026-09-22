# Feature: Footer — botón compartir y línea de copyright

## Estado

El botón "Compartir" del footer **funcionaba solo en la primera carga completa** y
quedaba muerto después de cualquier navegación client-side. Causa raíz: el sitio
monta `<ClientRouter />` (`src/layouts/BaseLayout.astro:3,56`) y `ShareButton.astro`
era el único componente interactivo del repo que enganchaba el listener una sola vez
con `getElementById` + `addEventListener`, en vez del patrón `astro:page-load` que
usan `Header.astro:83`, `ContactForm.astro:217`, `Faq.astro:82`,
`CaseStudyGallery.astro:145` y `BaseLayout.astro:108/124/180/216`.

Mecanismo verificado en el runtime instalado (Astro 7.2.2),
`node_modules/astro/dist/transitions/swap-functions.js:28-46` y
`node_modules/astro/dist/transitions/router.js:72-96`: en cada navegación,
`deselectScripts(doc)` marca los scripts del documento nuevo como ya ejecutados
usando `script.textContent` como clave, y `runScripts()` los saltea. Como el script
del footer es byte-idéntico en todas las páginas, se ejecuta una sola vez por sesión
y el nodo nuevo del footer entra al DOM sin listener.

Cronología: el botón nace en `d41bb0d` (14-ago-2026); View Transitions entra en
`4cbfaa3` (18-ago-2026). El componente quedó huérfano al activarse el router.

- **Estado:** implementado y verificado por `astro check` + build + HTML emitido. Pendiente de verificación del autor en navegador real (sin automatización disponible).
- **Rama:** `fix/footer-share-copyright`
- **Autorización:** el usuario aprobó arreglar el share y actualizar la línea de
  copyright, y eligió: copyright con año actual + "Todos los derechos reservados";
  en desktop el botón copia el link directo en vez de abrir la hoja del sistema.

## Decisiones del usuario

1. **Copyright:** `© 2026 misure. Todos los derechos reservados.` — sin rango de año
   de fundación. El año sigue siendo dinámico (`new Date().getFullYear()`).
2. **Share en desktop:** copiar link al portapapeles con feedback visible. La hoja
   nativa del sistema (`navigator.share`) queda reservada a dispositivos táctiles.
3. **Alcance:** ambos cambios.

## Fallas secundarias corregidas

Independientes del bug de View Transitions, dejaban el botón mudo incluso en la
primera carga:

1. **Contexto no seguro** (http sobre LAN, p. ej. probar desde el celular contra
   `http://192.168.x.x:4321`): `navigator.share` y `navigator.clipboard` no existen,
   el `catch` hacía `return` y el usuario no veía absolutamente nada.
2. **Share nativo que falla sin ser cancelación:** el `catch` retornaba sin intentar
   el portapapeles.

## Alcance

- `src/components/ShareButton.astro`: delegación de eventos en `document` (inmune al
  swap de DOM) + cascada de tres niveles que nunca es silenciosa + feedback
  accesible.
- `src/components/Footer.astro`: línea legal con "Todos los derechos reservados".
- `src/lib/content.ts`: strings nuevos (`share.errorLabel`, `footer.legal`).

## Fuera de alcance

- Texto de share contextual por página (`data-share-text`): requiere decidir copy por
  caso de estudio. Queda como follow-up.
- Renderizar el botón solo en casos de estudio: decisión de producto pendiente.
- La redundancia de "misure" en la fila legal (`© ... misure` + `Desarrollado por
  misure`): pendiente de decisión del usuario, no se toca.
- `site.url` en `content.ts:55` sigue en `[PENDIENTE: dominio de producción]`
  mientras `astro.config.mjs` define `https://misure.dev`.

## Criterios de aceptación

1. El botón responde después de navegar client-side entre páginas (no solo en la
   primera carga).
2. En desktop copia la URL y muestra "Link copiado" durante ~2 s, reiniciable.
3. En móvil táctil abre la hoja nativa de compartir.
4. En http/LAN (sin Clipboard API) copia igual mediante el fallback legacy.
5. Si todo falla, el usuario ve un estado de error: nunca un click silencioso.
6. El cambio de estado se anuncia a lectores de pantalla.

## Tareas

- [x] Arreglar `ShareButton.astro`
- [x] Actualizar copyright en `Footer.astro` y strings en `content.ts`
- [x] Verificar con `astro check` + build + lectura del HTML emitido

## Evidencia

- Commit: `b469ebb` — `fix(footer): boton compartir funcional tras navegar y linea legal completa`.
- `npx astro check`: `Result (56 files): 0 errors, 0 warnings, 0 hints`.
- `npm run build`: `10 page(s) built in 956ms`, `Complete!`.
- HTML emitido (`dist/index.html`):
  `<p>© 2026 <span></span><strong class="normal-case font-bold">misure</strong><span></span>. Todos los derechos reservados.</p>`
  y `<button data-share type="button" aria-label="Compartir esta página" ...>Compartir</button><span class="sr-only" role="status" aria-live="polite" data-share-status></span>`.
- Las 10 páginas del build contienen `data-share` y el script inline es
  byte-idéntico en todas (un solo hash): confirma que el runtime lo saltea tras
  la primera ejecución y que la delegación en `document` es la corrección
  adecuada.
- Implementación: `src/components/ShareButton.astro` delega en `document` con
  guard en `window` (el runtime resetea los atributos de `<html>` en cada
  navegación, por eso el guard no puede vivir en `documentElement`), cascada
  Web Share nativa (solo `pointer: coarse`) → Clipboard API → `execCommand`, y
  restaura las etiquetas desde constantes, nunca desde `button.textContent`.
- No verificado: click real en navegador, `execCommand` en contexto inseguro y
  hoja nativa en táctil. Validado por lectura de código contra el runtime de
  Astro 7.2.2 y por el HTML emitido.

## Pendientes derivados (fuera de alcance)

- Texto de share contextual por página.
- Renderizar el botón solo en casos de estudio.
- La fila legal sigue mostrando "misure" dos veces (`© … misure` y
  "Desarrollado por misure"): pendiente de decisión del usuario.
- `src/styles/global.css` quedó modificado por un proceso externo (fix de
  autofill) y se dejó intacto, fuera de este commit.
