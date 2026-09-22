# Feature: Tratamiento de imágenes (fotos del equipo y capturas del sistema)

## Objetivo

Que las imágenes que no vienen de un shooting profesional se vean intencionales
dentro de la paleta, sin depender de assets nuevos y sin romper la legibilidad de
lo que las capturas tienen que demostrar.

## Decisión de diseño

| Tipo de imagen | Tratamiento | Por qué |
| --- | --- | --- |
| Fotos de personas (equipo) | **Duotono** al 25% sobre gris | Convierte una foto de celular en algo que se lee "diseñado" y fuerza la imagen a la paleta verde/crema |
| Capturas del sistema (galerías de casos, portfolio) | **Duotono** al 25% más marco | Misma fuerza que las fotos: satura el tinte sin tocar la legibilidad, porque el blend preserva la luminosidad |

## Las capturas también llevan duotono

El motivo de mostrar una captura es probar que el software funciona, así que la
primera idea fue no tocarla. Pero el ruido real no es "crema contra foto": es la
paleta propia de la interfaz chocando contra el verde y el crema del sitio, y
entre capturas distintas, que traían cada una su propio esquema de color.

Son dos capas que trabajan juntas:

- **El duotono**, el mismo primitivo que las fotos y con la misma fuerza (25%).
  Subir el dial satura el tinte pero **no toca el contraste**: `mix-blend-mode:
  color` toma la luminosidad de la imagen, así que la legibilidad del texto chico
  no depende de la fuerza. Lo que sí ayuda es el `contrast(1.05)` del filtro.
- **El marco**, que hace el trabajo de leer la captura como "ventana al
  software", intencional, en vez de una imagen flotando sin control.

Encima va un tinte de `multiply` al **6%** sobre todo el shot, que le baja la
temperatura al blanco puro de la interfaz.

Si una captura futura necesita menos tinte, el dial se baja por superficie con
`--duotono-fuerza`, sin tocar nada más.

## Nota técnica: esto NO es un duotono por luminosidad

`mix-blend-mode: color` toma el **tono y la saturación** de la capa de arriba (el
degradé) y la **luminosidad** de la foto. Como el degradé es vertical, el
resultado pinta **por posición**: la parte de arriba de la foto queda verdosa y la
de abajo neutra, con el detalle de la foto conservado como luminosidad.

No es "sombras verdes, luces crema". Eso sería un duotono real y necesita un
filtro SVG `feComponentTransfer`, que mapea por luminosidad de verdad. Queda
descartado por ahora; si se quiere, es un cambio acotado al mismo primitivo.

## Parámetros

- **Duotono:** `--duotono-fuerza` en `0.25` para todo. El dial cambia el color,
  no el contraste: subirlo satura el tinte sin tocar la legibilidad, porque el
  blend toma la luminosidad de la imagen. De 0.35 para arriba el degradé ya se
  lee como color.
- **Tinte de capturas:** `multiply` al `0.06` sobre el shot.
- **Marco:** borde sólido verde de 1px, radio igual al de las tarjetas
  (`rounded-md`), barra superior verde con tres puntos crema, y la captura
  **pegada al borde**: el marco es la ventana y el contenido llega hasta el borde,
  como en un navegador de verdad. El recorte de los vértices queda a cargo del
  `overflow` del marco.

## Alcance

- `src/styles/global.css`: los primitivos `.foto-duotono` y `.screenshot-frame`.
- `src/components/ui/ScreenshotFrame.astro`: el marco reutilizable, con variante
  compacta para las tarjetas chicas.
- `src/components/Team.astro`: envuelve la foto y le aplica el duotono.
- `src/components/CaseStudyGallery.astro`: la captura grande, con marco completo.
- `src/components/Portfolio.astro`: las tarjetas, con marco compacto.

## Fuera de alcance

- El duotono real por luminosidad (filtro SVG).
- Las fotos reales del equipo: la sección sigue con el placeholder compartido y
  los nombres `[COMPLETAR]`. El tratamiento queda listo para cuando lleguen.

## Tareas

- [ ] Los dos primitivos en `global.css`
- [ ] El componente de marco, con variante compacta
- [ ] Aplicarlo en equipo, galería y portfolio
- [ ] Verificar con `astro check` + build + HTML y CSS emitidos

## Evidencia

Pendiente.
