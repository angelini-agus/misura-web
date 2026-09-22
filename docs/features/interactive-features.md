# Feature: Interactividad (inspiración estructural: geiko.dev)

## Objetivo
Dotar de interactividad a la landing sin salir de la arquitectura Astro:
formulario de contacto asíncrono, filtro de portfolio dinámico y scroll spy
en el header.

## Restricciones
- Vanilla JS/TS dentro de `<script>` en archivos `.astro`. Sin islas de React
  ni librerías pesadas.
- Diseño misure (flat, crema `#F6EFE8`, verde `#0E3B33`, bordes sólidos, sin
  sombras). No copiar visuales de geiko.dev.
- Textos en `src/lib/content.ts`, no hardcodeados en componentes.
- Con `<ClientRouter />`, un script `is:inline` con el mismo `textContent` en
  todas las páginas se ejecuta una sola vez por sesión. Los componentes
  interactivos deben delegar eventos en `document` o reinicializarse en
  `astro:page-load`.

## Funcionalidades
1. **Formulario de contacto asíncrono** (`ContactForm.astro`): campos
   Nombre/Empresa/Email/Servicio/Mensaje, validación en cliente (TS puro),
   envío simulado con estado "Enviando..." y mensaje de éxito sin recarga.
   Estado: ✅ hecho.
2. **Filtro de portfolio dinámico** (`Portfolio.astro`): botones
   Todos/ERP/CRM/Landing, `data-category` en tarjetas, Vanilla JS para
   ocultar/mostrar. Filtro activo con borde/bg verde sólido. Estado: ❌ no
   implementado. El filtro no existe en el código actual: `Portfolio.astro`
   hoy es una grilla estática y no hay `data-filter`, `data-category` ni
   `aria-pressed` en `src/`. La descripción de arriba queda como registro
   histórico de la idea original.
3. **Scroll spy en el header** (`Header.astro`): `IntersectionObserver` con
   banda central (`-50% 0px -50% 0px`) que resalta el link del nav de la
   sección visible (`border-bottom` verde). Estado: ✅ hecho.
4. **Botón Compartir del footer** (`ShareButton.astro`): delegación de eventos
   en `document` para sobrevivir a los swaps del ClientRouter, cascada
   Web Share API nativa (solo en dispositivos táctiles) → Clipboard API →
   fallback legacy con `execCommand`, y feedback visible con live region
   para lectores de pantalla. Estado: ✅ hecho.
5. **Elección de servicio en dos pasos** (`ContactForm.astro`): el formulario no
   se muestra hasta que el visitante elige un tipo de servicio. El paso 1 es un
   `role="group"` con `aria-labelledby` sobre la pregunta, y ofrece las cuatro
   opciones de `contactForm.serviceOptions` (ERP, CRM, Páginas Web y E-commerce
   —fusión de las antiguas Páginas Web y Tienda Online—, Otros) como botones
   nativos del mismo tamaño en una grilla 2×2 (`auto-rows-fr` + `h-full`). Al
   elegir, el formulario aparece con el servicio visible como título clickeable
   (`data-service-change`) que vuelve al paso 1 y devuelve el foco a la opción
   elegida; el value viaja igual por el input oculto `name="service"` hacia
   Web3Forms. Los dos pasos comparten una única celda de grilla y se alternan
   con `visibility: hidden`, así el panel conserva el mismo tamaño entre pasos y
   el paso oculto queda fuera del foco y del árbol de accesibilidad. La sección
   ocupa un viewport menos el alto del navbar (`--contact-nav-h`) mediante
   `min-height` con `dvh`, de modo que crece en pantallas bajas en lugar de
   recortar el formulario. Progressive enhancement: con JS el paso 1 se ve y el
   form arranca oculto (patrón `.js` con CSS scoped en el propio componente);
   sin JS el formulario queda visible y alcanzable. Nota: el desplegable custom
   de servicio (`data-select`) quedó retirado con este cambio, y su CSS y su
   ícono se limpiaron después. El flujo vuelve solo al paso 1 cada vez que el
   visitante entra de nuevo al formulario: un link al ancla de la sección, la
   vuelta desde la bfcache o un cambio de hash. El paso vive en un atributo del
   DOM, así que sin ese reset sobreviviría a cualquier navegación que no
   recargue el documento. Estado: ✅ hecho.

## Verificación
`npm run build` sin errores + `npx astro check` limpio + revisar HTML emitido
(scripts válidos).
