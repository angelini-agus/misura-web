# Imágenes reales de los proyectos

## Objetivo
Reemplazar los placeholders del portfolio por capturas reales de los proyectos
y mostrar una galería navegable con flechas en cada página de caso. Las
imágenes se optimizan con el componente `Image` de Astro (WebP + srcset) y se
muestran a color y sin recortes.

## Criterios de aceptación
- Las cards de `/proyectos` muestran la primera captura del proyecto a color,
  dentro de un marco de proporción fija `aspect-[16/9]` con `object-cover
  object-top` (llenan la card, sin mat ni panel de fondo). El link "Ver caso
  completo" va con `mt-auto` para alinear al fondo.
- Cada página de caso con galería muestra todas las capturas disponibles en un
  carrusel con flecha anterior/siguiente, contador y puntos. Las imágenes se
  muestran a tamaño natural (máximo `70vh` de alto), centradas, sin marco,
  borde ni fondo.
- Proyectos con imágenes (5):
  - Empresa de limpieza (ERP / ServiceTrack): 6 capturas.
  - Gestión jurídica: 3 capturas.
  - ERP clínico pediátrico: 5 capturas.
  - Landing pública de clínica pediátrica: 4 capturas.
  - Landing de la empresa de limpieza: 2 capturas (escritorio y mobile).
- El placeholder CRM sigue usando `BwImagePlaceholder` (no hay proyecto CRM
  real todavía).
- 0 JS de cliente nuevo salvo el script del carrusel (requerido por la tarea).

## Restricciones
- No inventar imágenes: se usan capturas reales del cliente.
- Sin marcos ni bordes agregados: la galería no usa `border`, `rounded` ni
  fondo propio. Las cards usan `object-cover` para llenar el marco sin barras.
- No agregar dependencias.

## Plan de implementación
1. Assets en `src/assets/proyectos/`:
   - `limpieza/` (6, descargadas del repo ServiceTrack).
   - `legal/` (3, copiadas del repo local de gestión jurídica).
   - `az-landing/` (2, descargadas de GitHub; el escritorio y el mobile eran
     capturas full-page, se recortó el viewport superior).
   - `pediatric/` (9, descargadas de GitHub).
2. `types.ts`: `PortfolioItem` con `image?`/`imageAlt?`; `CaseStudy` con
   `gallery?: CaseStudyCover[]`.
3. `content.ts`: imports, `image`/`imageAlt` en los ítems del portfolio y
   `gallery` en los 4 casos.
4. `Portfolio.astro`: `<Image class="w-full">` (a color, sin recorte) o
   `BwImagePlaceholder` si no hay imagen.
5. `CaseStudyGallery.astro`: marco `aspect-[4/3] sm:aspect-[16/10]` con
   `object-contain`, flechas, contador y puntos; script de navegación con guard
   para View Transitions.
6. Insertar `<CaseStudyGallery images={cs.gallery} />` en las 4 páginas de caso.
7. `npm run build`.

## Verificación
- `npm run build` sin errores.
- `dist/proyectos/index.html`: 5 `<img>` de proyecto a color (sin `grayscale`).
- Páginas de caso: galería con la cantidad correcta de slides
  (6 limpieza / 3 legal / 5 ERP pediátrico / 4 landing pediátrica / 2 landing
  limpieza).
- El filtro de portfolio sigue funcionando.
