# Feature: preload y cuadernillo anillado en todas las resoluciones

## Objetivo

El usuario pidió (2026-10-18, tres veces: las sesiones anteriores se cortaron sin
hacer nada): "aplicá la animación de preload a todas las resoluciones y lo mismo
con nuestro nuevo cuadernillo anillado que solo está en 1080: aplicalo para
mobile y todas las res de desktop".

Dos piezas en cobertura responsive completa:

1. **El preload (BrandBurn.astro)**: commiteado el 14/10 (última cadena
   `6a8fd6f..919b6a4`), verificado solo en escritorio (1440x900-ish).
2. **El nuevo wire-o del hero (Hero.astro, `.hero-binding`)**: implementado el
   14/10 a las 19:55 y **sin commitear** (la sesión que lo hizo se cortó antes de
   cerrar). Reemplaza al anillado de dos mitades de 40px por un wire-o de tile
   32x26 (dos líneas horizontales + cuadrado-agujero), hijo del papel, con alto
   cuantizado por el script a unidades enteras.

## Estado de partida

- Rama `feat/bottega-rebrand`, base `919b6a4`.
- Working tree sucio: Hero.astro (wire-o), index.astro (`<BrandBurn />`),
  content.ts (copy), ScreenshotFrame.astro (prop style), image.png,
  team-trabajando.jpg borrada. Referencias del autor sin trackear: `anillado.png`
  (tablas de madera), `image preload.png`, `preload reference.jpg` (el cuadernillo
  anillado de cartón kraft, foto).
- El doc `hero-scroll.md` todavía describe el anillado viejo (dos mitades 40px);
  el wire-o nuevo no está documentado ahí todavía.

## Plan

1. Medir el preload con el arnés CDP existente (`%TEMP%/hero-shot/`) en mobile
   (390x844) y la matriz de desktop por alto: 1080, 970, 900, 776, 720, 668,
   647, 540.
2. Medir el wire-o del hero en 390x844, 768x1024, 1440x900, 1440x776,
   1440x647, 1920x1080.
3. Corregir los defectos que aparezcan (se anotan abajo con evidencia).
4. `npx astro check` + `npm run build` + re-capturas.
5. Commits por unidad de trabajo (Conventional Commits, en español), sin arrastrar
   los archivos del autor.

## Hallazgos (2026-10-18, medido con arnéses CDP)

Ambas piezas YA corren en todas las resoluciones (ninguna tiene gate de ancho);
lo que faltaba eran tres defectos que las rompían fuera del escritorio de
referencia:

1. **Preload: el plato no cubría la ventana en mobile y tablet.** La escala de
   cobertura tenía los divisores fijados a la caja del taco de escritorio
   (134/611/222/30) y el centro del wordmark como origen; el plato en realidad
   escala sobre el PIVOTE (18%/88% de la caja del taco). A 390x844 cubría hasta
   672px y dejaba 172px de lino abajo; a 768x1024 faltaban 22px. Fix: la escala
   se calcula con las cuatro distancias reales pivote/borde de ventana sobre
   pivote/borde de taco (BrandBurn.astro, script de `plantar`).
2. **Wire-o: el alambre se cortaba contra el borde de la pantalla en mobile.**
   El strip asoma 24px a la izquierda del cuaderno, pero abajo de 592px de ancho
   el cuaderno queda a 16px del borde (el padding del escenario), así que los
   primeros 8px del alambre quedaban fuera de la pantalla. Fix: media query
   `max-width: 591px` con poke de 16px y tile aplastado en X a 24px (el agujero
   sigue cayendo sobre el borde del papel; el paso vertical de 26px no cambia,
   la cuantización del script sirve igual).
3. **Wire-o sin JS y con movimiento reducido: tocho de 100px.** El fallback de
   `height: var(--binding-height, 100px)` dejaba un alambre de 100px arriba del
   papel en el fallback entero. Fix: `var(--binding-height, auto)` — se estira
   con el cuaderno (top/bottom 8px), como el anillado viejo.

## Verificación

- `npx astro check`: 0 errores, 0 warnings, 0 hints (67 archivos).
- `npm run build`: 11 páginas, limpio.
- Plato (cuadro 0, `elementFromPoint` en las 4 esquinas + centro): tapado en
  360x740, 390x844, 768x1024, 1440x900, 1440x776, 1440x647, 1920x1080
  (`burn-cover-check.cjs`).
- Wire-o: sin recorte de viewport en toda la matriz (`wireo-res.cjs`,
  `clipIzq: false` en todas); reposo, entrada, tachado, paso de hoja y final
  capturados y mirados en 390x844, 768x1024, 1440x900, 1440x776, 1440x647,
  1920x1080.
- Fallback sin JS: el alambre estira con el cuaderno (784px de alto sobre el
  cuaderno completo a 390x844; 689px a 1440x900) en vez del tocho de 100px.

## Evidencia de commits

- `092a1a9` — feat(home): el cuaderno del hero pasa a wire-o en todas las
  resoluciones (Hero.astro con la implementación del wire-o de la sesión del
  14/10 más los fixes 2 y 3 de arriba, y la nota del wire-o en hero-scroll.md).
- El segundo commit (montaje del preload + fix de cobertura) es el que lleva
  este doc: BrandBurn.astro, index.astro y brand-burn-intro.md.
