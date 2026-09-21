# Feature: Transición de página

> El nombre del archivo es histórico: empezó como "page-turn" (giro de hoja) y
> hoy describe un fundido. Ver **Historial** al final.

## Estado actual

Al cambiar de ruta **solo se funde el contenido**: lo que sale baja a opacidad
0 en `300ms ease-in` y lo que entra sube desde opacidad 0 en `340ms ease-out`.
Sin desplazamiento, sin rotación, sin dirección.

La barra de anuncio y el navbar **no participan del fundido**: quedan clavados
mientras el contenido se releva.

Implementado en `src/styles/global.css` con `::view-transition-old/new(root)` y
los keyframes `page-out` / `page-in`, dentro de
`@media (prefers-reduced-motion: no-preference)`.

## Barra superior fuera del fundido

El objetivo es que la navegación se lea como un cambio de contenido, no como un
cambio de página entera: el navbar es el marco del sitio, no parte de la página.

La mecánica son **named view transitions**:

- En `src/components/Header.astro`, la barra de anuncio lleva
  `transition:name="site-announcement"` y el `<header>` lleva
  `transition:name="site-header"`. Astro los emite como
  `view-transition-name`.
- Un elemento con nombre propio **sale del snapshot de `root`** y obtiene su
  propio grupo de view transition. `root` queda con el contenido y el footer, y
  eso es lo único que se funde.
- En `global.css`, los pseudo-elementos `old`/`new` de ambos nombres llevan
  `animation: none`, y sus grupos `z-index: 100` para pintarse por encima del
  contenido que se funde.

**Detalle que importa:** Astro emite su propio crossfade de 180ms para cada
grupo nombrado, dentro de `@layer astro`. La regla del sitio gana porque vive
fuera de toda capa (unlayered vence a cualquier `@layer`, sin importar
especificidad ni orden de carga). Por eso `animation: none` no lleva capa: si
alguna vez se envuelve ese bloque en un `@layer`, el navbar vuelve a fundirse.

## Por qué es seguro

- Solo se animan `opacity` y `transform`: nada fuerza layout ni paint.
- La superposición la compone la View Transitions API con capas absolutas; el
  relevo no altera el flujo del documento.
- La animación vive solo en los pseudo-elementos de la view transition, que
  ningún `IntersectionObserver` observa: el reveal de `[data-reveal]` sigue
  disparando igual.
- `[data-reveal]` queda intacto en `translateY(16px)`.
- **Nunca usar `clip-path` acá:** el commit `5ae525e` lo revirtió porque Chrome
  calcula intersección 0 en un elemento observado recortado a 0 de altura, el
  `IntersectionObserver` nunca dispara y el contenido queda invisible.
- Con `prefers-reduced-motion: reduce` todo el bloque no aplica.

## Ajuste fino

| Parámetro | Valor actual | Efecto al tocarlo |
| --- | --- | --- |
| Duración salida / entrada | `300ms` / `340ms` | Más lento y el relevo se siente pesado |
| Easing | `ease-in` sale, `ease-out` entra | Un solo easing para ambos corta la sensación de relevo |
| Nombres | `site-announcement`, `site-header` | Quitarlos devuelve la barra al snapshot de `root`: vuelve a fundirse con la página |
| `z-index` de los grupos | `100` | Menos que el contenido deja el navbar por debajo durante el relevo |

## Verificación

1. `npm run build` sin errores.
2. `npx astro check` limpio.
3. El CSS emitido conserva `::view-transition-old/new(root)` con `page-out` /
   `page-in`, los cuatro selectores `(site-announcement|site-header)` con
   `animation: none` y los dos grupos con `z-index: 100`.
4. El HTML emitido lleva `view-transition-name: site-announcement` en la barra
   de anuncio y `view-transition-name: site-header` en el header.
5. Navegación real: el navbar queda clavado mientras el contenido se funde.

**Estado:** implementado; el punto 5 queda pendiente de verificación visual en
navegador (no hay browser automation en este entorno).

**Limitación conocida:** en navegadores sin soporte nativo de View Transitions
Astro usa su fallback (`[data-astro-transition-fallback]`), que anima los
elementos reales y por lo tanto sí funde el navbar. Es degradación aceptable, no
un defecto: el navbar nunca queda invisible ni descolocado.

## Historial

1. **Hoja de libro** (`leaf-out` / `leaf-in` con `rotateY`): tenía presencia
   espacial pero no distinguía dirección. Descartada.
2. **Slide direccional**: `NAV_ORDER = ["/", "/nosotros", "/proyectos",
   "/contacto"]` con `/proyectos/<slug>` en 2.5, escrito por un script en
   `BaseLayout.astro` que escuchaba `astro:before-preparation` y seteaba
   `data-nav-dir`; el CSS movía `±100%` con crossfade a `0.55`. Descartada: el
   movimiento no le gustó al autor. De acá sobrevive la idea de la barra
   estática, que en esa versión ya existía con los mismos dos nombres.
3. **Fundido puro** (actual): sin dirección, sin movimiento.
