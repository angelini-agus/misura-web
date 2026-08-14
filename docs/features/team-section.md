# Feature: Sección "Nuestro Equipo"

## Objetivo
Presentar al equipo de desarrollo de Misura con una grilla responsive,
siguiendo el diseño flat de la marca (inspiración estructural: geiko.dev).

## Restricciones
- NO inventar nombres, roles, redes ni descripciones: todo queda como
  `[PENDIENTE]` en `src/lib/content.ts`, listo para completar.
- Diseño Misura: flat, fondo crema, bordes verde `1px` sólidos, sin sombras.
- Fotos en blanco y negro: clase `grayscale` preparada para fotos reales.
- Usar el componente `<Image>` de `astro:assets` (optimización automática),
  con `src/assets/team-placeholder.png` como placeholder actual.
- Grilla responsive: 1 columna mobile, 2 tablet, 4 desktop.

## Datos
- `team.members[]`: `name`, `role`, `description`, `socials.{linkedin,github}`.
- 2 miembros placeholder (la empresa tiene 2 personas).
- Cuando haya datos reales: completar `content.ts` y reemplazar
  `teamPlaceholder` por las fotos importadas.

## Layout
- `grid grid-cols-1 sm:grid-cols-2` centrado en `max-w-4xl` (1 col mobile,
  2 col desktop).

## Verificación
`npm run build` sin errores (genera variantes optimizadas del placeholder) +
`npx astro check` limpio.
