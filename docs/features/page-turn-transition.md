# Feature: Transición de página tipo hoja de libro

## Objetivo

Que el cambio de ruta se lea como dar vuelta la hoja de un libro, en lugar de un
fundido genérico con desplazamiento vertical. Es la pieza central del lenguaje de
movimiento descrito en `docs/features/design-philosophy.md`.

## Diagnóstico previo

El cambio de ruta usaba `@keyframes page-out` / `page-in` (opacidad más
`translateY` de 8–10px). No había ninguna lectura espacial: era un fundido.

Además, existía un antecedente que condiciona el diseño: el commit `5ae525e`
revirtió un `clip-path` en el reveal porque **Chrome calcula intersección 0 en un
elemento observado que está recortado a 0 de altura**, el `IntersectionObserver`
nunca dispara y el contenido queda invisible en carga directa.

**Conclusión:** el `clip-path` es inseguro sobre el *elemento observado*, no sobre
los pseudo-elementos de la view transition. Igual se evitó por completo: el
efecto se hace solo con `transform`.

## Implementación

Los selectores y las animaciones viven en `src/styles/global.css`, dentro de
`@media (prefers-reduced-motion: no-preference)`. Los `@keyframes` se definen a
nivel global y solo se activan desde ese bloque.

**Dos keyframes nuevos:**

| Keyframe | Aplica a | Recorrido |
| --- | --- | --- |
| `leaf-out` | `::view-transition-old(root)` | `rotateY(0)` → `rotateY(-28deg)`, con `scale(1)` → `scale(0.97)` y opacidad 1 → 0 |
| `leaf-in` | `::view-transition-new(root)` | `rotateY(20deg)` → `rotateY(0)`, con `translateX(1.5%)` → `0`, `scale(0.99)` → `1` y opacidad 0 → 1 |

**Claves del efecto:**

- `transform-origin: left center` en ambos pseudo-elementos: el punto de giro es
  el **lomo**, a la izquierda de la hoja.
- `perspective(1200px)` dentro de cada `transform`: da profundidad real sin
  depender de una perspectiva en un ancestro.
- `::view-transition` lleva `background-color: var(--color-cream)` para que el
  giro nunca deje ver un destello blanco del navegador.
- Duraciones sin cambios: **300ms** la hoja que sale, **340ms** la que entra,
  ambas con `--ease-out`.

## Por qué es seguro

- Solo se animan `opacity` y `transform`: nada que fuerce layout ni paint.
- El 3D está aplicado exclusivamente a los pseudo-elementos de la view
  transition. Esos nodos no los observa ningún `IntersectionObserver`, así que el
  reveal sigue disparando como siempre.
- `[data-reveal]` queda intacto en `translateY(16px)`.
- Con `prefers-reduced-motion: reduce` el bloque entero no aplica y la navegación
  vuelve al comportamiento por defecto del navegador.

## Ajuste fino

Los ángulos son deliberadamente chicos: un giro grande se lee caricaturesco y
rompe la regla de "analógico, sin exagerar". Si hace falta más presencia,
los parámetros a tocar son:

| Parámetro | Valor actual | Efecto al subirlo |
| --- | --- | --- |
| `perspective` | `1200px` | Menos profundidad; más "plano" |
| Ángulo de `leaf-out` | `-28deg` | Más dramático |
| Ángulo de `leaf-in` | `20deg` | La hoja entra más inclinada |
| Duración | `300ms` / `340ms` | Más lento y más visible |

## Verificación

1. `npm run build` sin errores.
2. `npx astro check` limpio.
3. El CSS emitido conserva los `@keyframes` y los selectores
   `::view-transition-old/new(root)`.
4. El HTML no pierde atributos `data-reveal` ni `data-countup`.
5. Navegación real entre `/`, `/nosotros`, `/proyectos` y un caso de estudio.

**Estado:** implementado; pendiente de revisión visual en navegador por el autor.
