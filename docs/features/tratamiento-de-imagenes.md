# Feature: Tratamiento de imágenes (fotos del equipo y capturas del sistema)

## Objetivo

Que las imágenes que no vienen de un shooting profesional se vean intencionales
dentro de la paleta, sin depender de assets nuevos y sin romper la legibilidad de
lo que las capturas tienen que demostrar.

## Decisión de diseño

| Tipo de imagen | Tratamiento | Por qué |
| --- | --- | --- |
| Fotos de personas (equipo) | **Duotono sutil** al 25% sobre gris | Convierte una foto de celular en algo que se lee "diseñado" y fuerza la imagen a la paleta verde/crema |
| Capturas del sistema (galerías de casos, portfolio) | **Marco**, sin desaturar | El motivo de mostrar una captura es probar que el software funciona: desaturarla pierde legibilidad justo donde tiene que convencer |

## Por qué las capturas no se tocan

El ruido no es "crema contra foto", es la paleta propia de la interfaz chocando
contra el verde y el crema del sitio. Eso se contiene **encuadrando**, no
recoloreando: el marco con borde verde y barra superior hace que el contraste se
lea como "ventana al software", intencional, en vez de una imagen flotando sin
control.

El único agregado sobre los píxeles es un tinte de `multiply` al **6%**, que le
baja la temperatura al blanco puro de la interfaz sin tocar el contraste del
texto chico.

## Nota técnica: esto NO es un duotono por luminosidad

`mix-blend-mode: color` toma el **tono y la saturación** de la capa de arriba (el
degradé) y la **luminosidad** de la foto. Como el degradé es vertical, el
resultado pinta **por posición**: la parte de arriba de la foto queda verdosa y la
de abajo neutra, con el detalle de la foto conservado como luminosidad.

No es "sombras verdes, luces crema". Eso sería un duotono real y necesita un
filtro SVG `feComponentTransfer`, que mapea por luminosidad de verdad. Queda
descartado por ahora; si se quiere, es un cambio acotado al mismo primitivo.

## Parámetros

- **Duotono:** `opacity: 0.25`. El dial es ese valor: 0.15 es prácticamente
  blanco y negro con un aire de temperatura verdosa, y 0.35-0.4 ya se nota el
  degradé como color. El punto justo depende del brillo de cada foto.
- **Tinte de capturas:** `multiply` al `0.06`.
- **Marco:** borde sólido verde de 1px, radio igual al de las tarjetas (`rounded-md`),
  barra superior verde con tres puntos crema, y 10px de aire entre el marco y la
  captura para que la transición crema → marco verde → captura se sienta en capas.

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
