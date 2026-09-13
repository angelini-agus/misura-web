# Landing structure review — Home

## Objetivo
Alinear la home de misure con la estructura clásica de una landing page de
alta conversión, sin inventar datos ni features: el visitante entiende primero
el dolor, después la solución, después cómo se implementa, luego se resuelven
las objeciones (FAQ) y recién ahí aparece el CTA final. Se reutiliza todo el
contenido real ya documentado (caso de la empresa de limpieza, proceso de
trabajo, servicios).

## Criterios de aceptación
- El Hero agrega un elemento visual de respaldo que **no** simula capturas de
  producto. Al no existir todavía una foto real del equipo, el espacio queda
  marcado con `Placeholder.astro` (`Foto del equipo trabajando [PENDIENTE]`).
- Nueva sección `Problem.astro` entre `Clients` y `Services`, con un título que
  nombra el problema concreto y 2-3 bullets de costo real (tiempo perdido,
  errores humanos, ventas perdidas), más una referencia al caso de limpieza ya
  documentado. Contenido tipado en `content.ts` como `problem` (`ProblemSection`).
- `Services` muestra un ícono outline monocromático arriba del título de cada
  card (ya existía: `DatabaseIcon` / `UsersIcon` / `GlobeIcon`).
- Nueva sección `HowItWorksHome.astro` en la home, con la versión compacta de
  los 4 pasos de `howWeWork` (mismo contenido que `/nosotros`, layout resumido).
- Orden final: Hero → Clients → Problem → Services → HowItWorksHome → ForWho →
  Differentiators → FAQ → Explore → Team → Contact.
- 0 datos, precios o testimonios nuevos. Solo se reutiliza contenido real.
- 0 JS de cliente agregado. Se mantienen tokens, `data-reveal` y responsive.

## Restricciones
- No tocar `Clients`, `Faq`, `Explore`, `Team`, `Contact` ni el footer.
- No rediseñar la paleta ni las animaciones; usar tokens de `global.css`.
- No inventar la foto del equipo: queda como placeholder hasta tener el recurso.
- No agregar dependencias.

## Plan de implementación
1. `src/lib/types.ts`: nuevo tipo `ProblemSection`.
2. `src/lib/content.ts`: export `problem` (eyebrow, title, bullets, caseNote con
   CTA al caso de limpieza). Se reutiliza `howWeWork` para la home.
3. `src/components/Problem.astro`: tarjetas outline para el dolor + callout verde
   con el dato real del caso y link a `/proyectos/empresa-limpieza-rosario`.
4. `src/components/Hero.astro`: se reemplaza el mockup de producto por un panel
   verde de marca con `Placeholder inverse` (foto pendiente).
5. `src/components/HowItWorksHome.astro`: versión compacta de los 4 pasos
   (línea superior + número de paso, sin tarjetas rellenas).
6. `src/pages/index.astro`: nuevos imports y orden de secciones.

## Decisión: cantidad de servicios
No se agregaron servicios nuevos. El sitio define explícitamente **tres líneas**
de servicio (ERP, CRM, Páginas Web; ver FAQ "Tres líneas que se combinan") y
"Soporte y mantenimiento" ya está cubierto en `HowWeWork` (paso 4) y en
`Differentiators` ("Errores post-lanzamiento: los arreglamos gratis"). Agregar
una cuarta card duplicaría contenido y contradiría el mensaje de tres líneas.
"Migración de datos" no tiene contenido real documentado, por lo que no se
incluye para no rellenar con humo.

## Verificación
- `npm run build` sin errores.
- Revisar en dev el orden visual, los `data-reveal` y el responsive mobile-first.
- Confirmar que `/nosotros` sigue mostrando `HowWeWork` completo sin cambios.

## Pendientes reales
- ~~Foto del equipo trabajando para el Hero~~ Resuelto: `IMG_2299.HEIC` se
  convirtió a `src/assets/team-trabajando.jpg` (512×512) y se muestra en el Hero
  con `<Image>` de Astro (`object-cover`, a color).
