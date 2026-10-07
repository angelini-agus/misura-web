# Feature: Footer, hover del link Privacidad

## Estado

El link "Privacidad" de la última fila del footer
(`src/components/Footer.astro`, línea 104) usaba `text-green/75
underline-offset-4 hover:underline`: el subrayado nativo aparece de golpe al
pasar el mouse y desentona con el botón "Compartir" que tiene al lado. Ahora
usa el mismo hover que ese botón:

- `link-ink` (`src/styles/global.css:364-388`): barrita de 2px que se dibuja
  de izquierda a derecha (`transform: scaleX(0)` → `scaleX(1)`) en 160ms
  `ease-out`, con `transform-origin: left` y color `currentColor`.
- `hover:text-green`: el color del texto pasa de 75% a opaco, igual que en el
  botón de al lado.
- `active:translate-x-[-4px] active:translate-y-[4px]`: al clickear se hunde en
  diagonal, como todos los botones del sitio.

Clases finales:

    link-ink w-fit text-xs text-green/75 transition-transform duration-150
    ease-out hover:text-green active:translate-x-[-4px] active:translate-y-[4px]
    active:duration-75

- **Estado:** implementado; `astro check` y build pasan (verificado por el
  padre). Comprobación visual pendiente: no hay navegador disponible.

## Alcance

- `src/components/Footer.astro`: clases del link "Privacidad" de la fila legal.

## Verificación

- `npx astro check`: pasa, verificado por el padre.
- `npm run build`: pasa, verificado por el padre.
- Comprobación visual del hover y del active en navegador: pendiente, sin
  navegador disponible.

## Fuera de alcance

- Los demás links del footer conservan su hover actual.
- El copy del link sigue saliendo de `content.ts` (`footer.privacyLabel`); no se
  toca.
