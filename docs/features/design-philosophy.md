# Filosofía de diseño de Misure

> Documento normativo. No describe una feature de esta web: describe el criterio
> con el que Misure construye **todo** producto que entrega. Aplica a esta página,
> a los productos a medida de los clientes y a los productos propios futuros.

## Qué es Misure

- Vendemos **software a medida**, entregado junto con el proyecto del cliente.
- Etapa actual: los **primeros clientes**, foco en productos a medida.
- Etapa futura: **productos propios**, comercializados como SaaS.
- La web actual es la primera superficie pública de esa identidad, no un
  catálogo de plantillas.

## El principio rector

La filosofía de Misure no es un eslogan: es **construir el producto de la mayor
calidad posible**. Cuando hay que elegir entre entregar rápido y entregar bien,
se elige entregar bien.

Esa calidad se juzga, sobre todo, **del lado del cliente**. No alcanza con que
la funcionalidad exista: tiene que sentirse cuidada.

## Calidad del lado del cliente

Cuatro criterios, en este orden de prioridad cuando entran en conflicto:

1. **Diseño.** La mayor calidad posible. Debe **sentirse un producto caro**: no
   un template, no un MVP prolijo, no algo "hecho con IA". La percepción de
   valor es un requisito, no un adorno.
2. **Experiencia de usuario.** Cada interacción tiene que ser clara, predecible
   y agradable. Ningún estado sin resolver: sin callejones sin salida, sin
   feedback faltante, sin errores silenciosos.
3. **Velocidad.** El rendimiento es parte del diseño. Un producto lento se
   siente barato por más que se vea bien. Peso de JS, fuentes e imágenes se
   cuidan como se cuida una pantalla.
4. **Detalle.** Los bordes, los espaciados, los estados de foco, los textos de
   error: la suma de los detalles chicos es lo que produce la sensación de
   calidad.

## Lenguaje visual

Estilo **retro / analógico** sobre una base plana y editorial.

- **Flat.** Bordes sólidos de 1–2px, sin sombras, sin gradientes, esquinas
  apenas redondeadas (`rounded-md` / `rounded-lg`).
- **Paleta.** Crema y verde profundo. Alto contraste, sin colores de relleno.
- **Tipografía.** Plus Jakarta Sans Variable, con escala marcada: títulos
  grandes y decididos, texto de apoyo chico y funcional.
- **Iconografía y assets en SVG inline**, sin librerías de íconos.
- **Fotografía** en gris como recurso de marca: el color se reserva para lo
  interactivo.

### Tokens vigentes

Fuente de verdad: `src/styles/global.css` (bloque `@theme`).

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-cream` | `#f1e8db` | Fondo base |
| `--color-cream-light` | `#fbf7f0` | Superficies elevadas |
| `--color-cream-dark` | `#ded2c0` | Separadores y texturas |
| `--color-green` | `#0e3b33` | Texto y bordes |
| `--color-green-light` | `#0f4238` | Hover / selección |
| `--color-green-dark` | `#0a2d27` | Profundidad |
| `--color-error` | `#a64a2a` | Errores de formulario |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Todo el movimiento |

> Nota de coherencia: `docs/features/interactive-features.md` cita el crema como
> `#F6EFE8`. El valor real es `#f1e8db`. Si hay que elegir, manda `global.css`.

## Movimiento

El movimiento es **analógico**: imita el comportamiento físico de objetos
reales, sin llegar nunca a lo caricaturesco.

- **Los botones se hunden.** Al presionar, el botón se desplaza
  (`translate(-4px, 4px)`) en 75ms, como si lo empujaras contra la hoja.
- **Los subrayados se dibujan.** Los links trazan una línea de 2px de izquierda
  a derecha (`scaleX(0)` → `scaleX(1)`) en 160ms.
- **Cambiar de página tiene dirección.** El cambio de ruta es un deslizamiento
  horizontal, como correr una hoja sobre la mesa: al avanzar en el sitio la
  página sale hacia la izquierda y la nueva entra desde la derecha; al
  retroceder, se espeja. La dirección la define la posición en el navbar, no el
  historial del navegador.
- **Lo que aparece, se asienta.** Los bloques entran con un desplazamiento corto
  (`translateY(16px)`) y se acomodan.

### Reglas de movimiento

- Duraciones **cortas**: 75ms para feedback directo, 150–220ms para cambios de
  estado, 300–420ms para entradas de bloque, 300–340ms para el cambio de página.
- Easing: siempre `--ease-out`. Nunca rebotes elásticos ni `ease-in-out` en
  feedback inmediato.
- Se anima **opacidad y transform** únicamente: nada que fuerce layout.
- **Siempre** se respeta `prefers-reduced-motion: reduce`.
- Antes de inventar una animación nueva, se reutiliza un primitivo existente
  (`.details-collapse`, `link-ink`, `data-reveal`, `stamp-in`, `page-in/out`).

Hay **dos excepciones deliberadas** a estas reglas. Están documentadas abajo con
su motivo y su costo, para que la regla y el código no se contradigan.

### Excepciones documentadas

#### 1. El acordeón del FAQ anima `grid-template-rows`

`src/styles/global.css` (`.details-collapse`) transiciona `grid-template-rows`
de `0fr` a `1fr` en 220ms. Eso **fuerza layout en cada frame**, así que rompe la
regla de "se anima opacidad y transform únicamente".

Se mantiene porque es la técnica estándar para abrir un `<details>` sin conocer
su altura, y las alternativas son peores: animar `max-height` también es layout y
encima calcula mal las alturas intermedias, y animar la altura por JavaScript es
layout **más** trabajo en el main thread. El alcance es de un elemento por
pregunta, 220ms, y solo se dispara con una acción explícita del usuario. Con
`prefers-reduced-motion: reduce` no hay transición.

Si algún día el FAQ crece a decenas de ítems abiertos al mismo tiempo, esta es la
primera excepción que hay que revisar.

#### 2. El cursor del panel de código titila en loop infinito

`src/components/ui/CodePanel.astro` (`.cd-cursor`) usa
`animation: cd-blink 1.1s steps(1, end) infinite`, que la lista de anti-patrones
prohíbe como "animación continua o infinita".

Se mantiene porque el motivo declarado de esa regla **no aplica a este caso**: la
regla existe porque una animación infinita mantiene ocupado el main thread, y acá
la única propiedad animada es `opacity`, que corre en el compositor. Es un rect
chico y decorativo, dentro de una ilustración, y con
`prefers-reduced-motion: reduce` queda estático.

Lo que sigue prohibido sin excepción: `requestAnimationFrame` en loop, canvas,
WebGL, partículas, y animar propiedades de layout de forma continua.

## Reglas de implementación

- El copy vive en `src/lib/content.ts`. **No se hardcodea texto** en
  componentes.
- El estilo vive en `src/styles/global.css`. No hay `<style>` scoped.
- Vanilla JS dentro de `<script>` en archivos `.astro`. Sin islas de React ni
  librerías de animación (GSAP, Framer, etc.).
- Todo componente nuevo se apoya en los tokens; no se inventan colores ni
  easings sueltos.
- Un estado interactivo no está terminado hasta que tiene: hover, focus visible,
  active, y su versión con movimiento reducido.

## Anti-patrones

Ninguno de estos pertenece a la identidad de Misure:

- Parallax, scroll-jacking, blobs, gradientes decorativos, glassmorphism.
- Sombras grandes o bordes difusos: rompen el flat.
- Librerías de animación o de íconos.
- Animaciones largas o con rebote elástico.
- Texto hardcodeado o copy duplicado entre componentes.
- Sacrificar velocidad por efecto visual.
- Animaciones continuas o infinitas, fondos animados, partículas, canvas o WebGL
  decorativos.
- Texto con opacidad reducida que rompe el contraste mínimo.

## Presupuesto de rendimiento y accesibilidad (Lighthouse)

Es **obligatorio**. Una superficie no está terminada hasta que Lighthouse da:

| Categoría | Objetivo |
| --- | --- |
| Accesibilidad | **100 / 100 (obligatorio)** |
| Rendimiento — desktop | **100 / 100** |
| Rendimiento — mobile | **≥ 98 / 100** |
| Cambios de diseño (CLS) | **0** (audit "Evitar grandes cambios de diseño") |

Los gates ganan sobre el gusto. Si un efecto no los cumple, se corta o se
rediseña el efecto: nunca se baja el gate.

### Costo de las animaciones

De más barato a más caro:

| Propiedad | Costo | Notas |
| --- | --- | --- |
| `transform` (translate, scale, rotate) | Compositor | Casi gratis; no toca el main thread |
| `opacity` | Compositor | Igual que `transform` |
| `color`, `background-color`, `border-color` | Paint | Repinta por frame |
| `clip-path`, `mask` | Paint + riesgo | Además rompe el IntersectionObserver si se aplica al elemento observado (ver commit `5ae525e`) |
| `box-shadow`, `filter`, `backdrop-filter` | Paint caro | El blur y las sombras grandes son carísimos en áreas amplias |
| `width`, `height`, `top`, `left`, `margin`, `padding`, `grid-template-rows` | Layout | Fuerza reflow por frame y puede generar CLS |

Regla: si se puede hacer con `transform` y `opacity`, se hace con eso.

### Qué destruye el score de rendimiento

- **Animaciones continuas o infinitas** (`animation: infinite`,
  `requestAnimationFrame` en loop, canvas, WebGL, partículas). Mantienen el main
  thread ocupado y disparan el **TBT**, una de las métricas más pesadas. En
  mobile, Lighthouse emula una CPU ~4x más lenta, así que se agrava.
- **Animaciones que arrancan durante la carga**: compiten con el render inicial y
  retrasan FCP y LCP.
- **El elemento del LCP escondido detrás de una animación de entrada**: si el
  hero arranca en `opacity: 0`, Lighthouse no lo cuenta como pintado hasta que
  aparece y el LCP se penaliza. El contenido principal debe pintarse visible.
- **Animar propiedades de layout**: genera jank y **CLS**.
- **Listeners de scroll o pointer sin cuidado**: aumentan el input delay.

### Caso documentado

En un proyecto propio se descartó un fondo animado interactivo para el hero
(animaciones por defecto más interacción del usuario) porque bajó el rendimiento
muchísimo. Era lo que más gustaba, y se cortó igual.

**Ese es el comportamiento esperado**: un efecto que rompe el presupuesto se
descarta, aunque sea el favorito.

### Accesibilidad 100

No es negociable. Lo que más suele romperla:

- **Contraste**: texto con opacidad reducida o sobre fondos claros. AA exige
  4.5:1 en texto normal y 3:1 en texto grande.
- Controles sin nombre accesible, o imágenes sin `alt`.
- Jerarquía de encabezados rota, o más de un `h1` por página.
- `lang` incorrecto, foco no visible, orden de tabulación ilógico.
- Formularios sin `label` asociado.

### Pendientes de auditar en este proyecto

- `text-green/60` en el contador del carrusel (`CaseStudyGallery.astro`): el 60%
  de opacidad sobre crema probablemente no alcanza el 4.5:1 de AA.
- El hero: confirmar que su elemento de LCP no arranca oculto detrás de
  `[data-reveal]`.
- Ejecutar Lighthouse en mobile y desktop sobre `/`, `/nosotros`, `/proyectos` y
  un caso de estudio.

## Verificación

Un cambio de diseño se considera terminado cuando:

1. `npm run build` pasa sin errores.
2. `npx astro check` queda limpio.
3. Se revisa el comportamiento con `prefers-reduced-motion: reduce` activado.
4. El HTML emitido conserva los atributos de comportamiento (`data-*`) que los
   scripts esperan.
5. Los estados interactivos (hover, focus, active, error) están todos cubiertos.
