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
   ocultar/mostrar. Filtro activo con borde/bg verde sólido. Estado: ✅ hecho.
3. **Scroll spy en el header** (`Header.astro`): `IntersectionObserver` con
   banda central (`-50% 0px -50% 0px`) que resalta el link del nav de la
   sección visible (`border-bottom` verde). Estado: ✅ hecho.
4. **Botón Compartir del footer** (`ShareButton.astro`): delegación de eventos
   en `document` para sobrevivir a los swaps del ClientRouter, cascada
   Web Share API nativa (solo en dispositivos táctiles) → Clipboard API →
   fallback legacy con `execCommand`, y feedback visible con live region
   para lectores de pantalla. Estado: ✅ hecho.

## Verificación
`npm run build` sin errores + `npx astro check` limpio + revisar HTML emitido
(scripts válidos, atributos `data-category`/`data-filter` presentes).
