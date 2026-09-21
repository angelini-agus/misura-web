# Feature: Transición de página direccional

## Objetivo

Que el cambio de ruta tenga **dirección**: avanzar por el sitio corre la página
saliente hacia la izquierda y hace entrar la nueva desde la derecha; retroceder
hace el espejo. La dirección sigue el orden del navbar, no el historial del
navegador, así que un click en el menú siempre se siente como avanzar por la
estructura del sitio.

## Diagnóstico previo

El cambio de ruta empezó como un fundido con `translateY` de 8–10px
(`page-out` / `page-in`), sin ninguna lectura espacial. Después pasó por una
rotación 3D tipo hoja de libro (`leaf-out` / `leaf-in` con `rotateY`), que sí
tenía presencia espacial pero **no distinguía dirección**: ir a `/contacto` y
volver a `/` se veía exactamente igual.

También quedó un antecedente que condiciona cualquier cambio acá: el commit
`5ae525e` revirtió un `clip-path` en el reveal porque **Chrome calcula intersección
0 en un elemento observado que está recortado a 0 de altura**, el
`IntersectionObserver` nunca dispara y el contenido queda invisible en carga
directa. Este feature no reintroduce `clip-path`: solo mueve y opacita los
pseudo-elementos de la view transition.

## Implementación

### Regla de dirección

En `src/layouts/BaseLayout.astro` hay un script inline que escucha
`astro:before-preparation` (el evento que dispara el `ClientRouter` antes de
preparar la navegación) y escribe la dirección en la raíz:

```js
document.documentElement.dataset.navDir = "forward" | "back";
```

La posición de cada ruta se resuelve contra el orden del navbar:

```js
const NAV_ORDER = ["/", "/nosotros", "/proyectos", "/contacto"];
```

- Se normaliza el pathname sacando barras finales; `/` queda `/`.
- Cualquier ruta `/proyectos/<algo>` (casos de estudio) resuelve a **2.5**: un
  paso después de `/proyectos` y antes de `/contacto`.
- Con ambos índices resueltos: `to > from` es `forward`, `to < from` es `back`.
  Si son iguales, se conserva el valor anterior.
- Si alguna de las dos rutas no está en `NAV_ORDER` ni es un caso, se cae a
  `event.direction` del navegador (`"back"` o `forward`).

`event.direction` **no** alcanza por sí solo: refleja el historial del navegador,
así que un click en el navbar hacia una ruta anterior se leería como `back`
aunque el usuario esté avanzando en la estructura del sitio. Por eso manda la
regla propia y el historial queda solo como fallback.

### CSS

Los selectores y las animaciones viven en `src/styles/global.css`, dentro de
`@media (prefers-reduced-motion: no-preference)`. Los `@keyframes` se definen a
nivel global y solo se activan desde ese bloque. Cada dirección tiene su propio
par de keyframes:

| Dirección | Selector | Keyframe | Recorrido |
| --- | --- | --- | --- |
| `forward` | `:root[data-nav-dir="forward"]::view-transition-old(root)` | `slide-out-forward` | `translateX(0)` → `translateX(-100%)`, opacidad 1 → 0 |
| `forward` | `:root[data-nav-dir="forward"]::view-transition-new(root)` | `slide-in-forward` | `translateX(100%)` → `translateX(0)`, opacidad 0 → 1 |
| `back` | `:root[data-nav-dir="back"]::view-transition-old(root)` | `slide-out-back` | `translateX(0)` → `translateX(100%)`, opacidad 1 → 0 |
| `back` | `:root[data-nav-dir="back"]::view-transition-new(root)` | `slide-in-back` | `translateX(-100%)` → `translateX(0)`, opacidad 0 → 1 |

**Claves del efecto:**

- El scope es el atributo de la raíz: sin `data-nav-dir` no hay animación
  custom y el navegador hace su cross-fade por defecto.
- Solo se animan `transform` y `opacity`. No hay rotación, ni `perspective`, ni
  `transform-origin`: el movimiento es una traslación horizontal pura.
- Duraciones sin cambios: **300ms** la página que sale, **340ms** la que entra,
  ambas con `--ease-out` y `fill-mode: both`.
- `::view-transition` lleva `background-color: var(--color-cream)` para que el
  deslizamiento nunca deje ver un destello blanco del navegador.

## Por qué es seguro

- Solo se animan `opacity` y `transform`: nada que fuerce layout ni paint.
- La animación vive exclusivamente en los pseudo-elementos de la view
  transition. Esos nodos no los observa ningún `IntersectionObserver`, así que
  el reveal sigue disparando como siempre.
- `[data-reveal]` queda intacto en `translateY(16px)`.
- Con `prefers-reduced-motion: reduce` el bloque entero no aplica y la
  navegación vuelve al comportamiento por defecto del navegador.

## Ajuste fino

| Parámetro | Valor actual | Efecto al tocarlo |
| --- | --- | --- |
| `NAV_ORDER` | `["/", "/nosotros", "/proyectos", "/contacto"]` | Cualquier ruta que no esté cae al fallback del navegador |
| Índice de caso de estudio | `2.5` | Lo corre respecto de `/proyectos` (2) y `/contacto` (3) |
| Distancia | `±100%` | Menos distancia deja las dos páginas a la vista al mismo tiempo |
| Duración | `300ms` / `340ms` | Más lento y más visible |

## Verificación

1. `npm run build` sin errores.
2. `npx astro check` limpio.
3. El CSS emitido conserva los `@keyframes` (`slide-out-forward`,
   `slide-in-forward`, `slide-out-back`, `slide-in-back`) y los selectores
   `:root[data-nav-dir=...]::view-transition-old/new(root)`.
4. El HTML no pierde atributos `data-reveal` ni `data-countup`.
5. El script escribe `data-nav-dir` en `<html>` antes de cada navegación.
6. Navegación real: `/` → `/contacto` se siente hacia adelante; volver se
   siente al revés; un caso de estudio se lee como un paso después de
   `/proyectos`.

**Estado:** implementado; pendiente de revisión visual en navegador por el autor.
