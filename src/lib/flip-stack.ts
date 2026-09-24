// Matemática del mazo "flip stack" usado por la sección de proyectos.
//
// Es una librería pura: sin DOM, sin imports de Astro, sin side effects. Se
// importa desde el script del componente para mover las tarjetas y desde Node
// para verificar las invariantes (ver scripts en odd/tasks). Mantener este
// archivo libre de dependencias de runtime permite auditar la geometría sin
// navegador y dejar los tests como scripts standalone.

// Forma normalizada de los parámetros físicos del mazo. Sale de flipGeometry()
// y se pasa a flipCardState() para mantener el cálculo sin allocations por
// frame.
export type FlipGeometry = {
  /** cantidad de tarjetas. */
  readonly total: number;
  /** tramo de progreso dedicado a cada tarjeta, `1 / max(total - 1, 1)`. */
  readonly segment: number;
  /** offset vertical por tarjeta al plegarse, en px (`min(24, 72 / (total-1))`). */
  readonly stackStep: number;
  /**
   * translate Y del .card en % al terminar la salida. NO es la constante
   * -118 de la referencia: la mide el componente con flipExitPercent, porque
   * la tarjeta tiene que salir COMPLETA por arriba de la ventana y una
   * tarjeta que no llena la pantalla necesita mas de -118% para lograrlo.
   */
  readonly exitPercent: number;
  /** offset vertical de reposo en px para una tarjeta intermedia. */
  readonly restOffset: (i: number) => number;
  /** escala de reposo para una tarjeta intermedia (1 - epsilon). */
  readonly restScale: (i: number) => number;
};

export type FlipCardState = {
  /** translate Y del .card en % (geometry.exitPercent al terminar la salida). */
  yPercent: number;
  /** offset adicional en px (apilado del mazo). */
  stackOffset: number;
  /** rotateX en grados (22 al terminar la salida). */
  rotateX: number;
  /** opacidad: 1 casi siempre; con reducedMotion baja a 1 - t en la salida. */
  opacity: number;
  /** translate Y del .panel en px (entrada, desde restOffset(i) hasta 0). */
  entryY: number;
  /** escala del .panel (entrada, desde restScale(i) hasta 1). */
  entryScale: number;
};

// ---- primitivas ------------------------------------------------------------

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Calcula la geometría del mazo. Se llama una vez por init y de nuevo en cada
// medición (resize), no por frame.
//
// `total` debe ser >= 1 (el caller debe evitar mazos vacíos; si pasa 0, todos
// los valores caen a un estado neutro sin NaNs).
// `exitPercent` sale de flipExitPercent() y por defecto vale el -118 de la
// referencia, que es el valor correcto cuando la tarjeta llena la pantalla.
export const flipGeometry = (
  total: number,
  exitPercent = -118,
): FlipGeometry => {
  const safeTotal = Math.max(0, Math.floor(total));
  const m = Math.max(safeTotal - 1, 1);
  return {
    total: safeTotal,
    segment: 1 / m,
    stackStep: Math.min(24, 72 / m),
    exitPercent,
    restOffset: (i: number) => Math.min(i * 12, 34),
    restScale: (i: number) => 1 - Math.min(i * 0.012, 0.035),
  };
};

// Distancia que tiene que recorrer una tarjeta para salir completa por arriba
// del área recortada del sticky, en % del alto de la tarjeta.
//
// -118% alcanza cuando la tarjeta llena la ventana, que es el caso de la
// referencia. Acá la tarjeta puede ser bastante más baja que la ventana (una
// tablet en vertical: 372px de tarjeta en 1024px de alto) y encima está
// centrada, así que -118% de SU alto la deja a mitad de camino y las tarjetas
// plegadas quedan visibles en la franja de arriba. Medido: en 768x1024 las
// cinco tarjetas plegadas asomaban entre 253px y 316px.
//
// `top` es la distancia del borde superior del stage al borde superior del área
// recortada (medida contra el sticky, que es la ventana entera), `height` su
// alto. El `slack` cubre lo que el `rotateX` proyecta hacia afuera: la mitad
// inferior de la tarjeta viene hacia el espectador y con perspective 800px se
// agranda como máximo unos 17px.
export const flipExitPercent = (
  top: number,
  height: number,
  slack = 48,
): number => {
  const safeHeight = Math.max(height, 1);
  const distance = Math.max(top, 0) + safeHeight + slack;
  return -(distance / safeHeight) * 100;
};

// Estado de una tarjeta dada el progreso del carrete.
//
// El modelo:
//   - La ÚLTIMA tarjeta nunca se pliega (queda al frente al final del scroll).
//     Sí ejecuta su entrada (sube desde su offset de reposo al frente del mazo).
//   - Las demás tienen un tramo de SALIDA donde `y%` baja a `exitPercent`
//     (-118 por defecto), `rotateX` sube a 22deg y el `stackOffset` las empuja
//     hacia atrás como un mazo real.
//   - Todas (menos la primera) tienen un tramo de ENTRADA previo donde el
//     panel sube desde una posición de reposo (offset + escala) hasta el plano
//     final. La entrada es aditiva al progreso de salida para que la tarjeta
//     de abajo asiente cuando la de arriba empieza a plegarse.
//
// `progress` ya viene clampeado a [0, 1]. `index` es 0-based.
// `geometry` se obtiene con flipGeometry(total) para no recalcular por frame.
export const flipCardState = (
  progress: number,
  index: number,
  geometry: FlipGeometry,
  reduceMotion: boolean,
): FlipCardState => {
  const p = clamp01(progress);
  const { total, segment, stackStep, exitPercent, restOffset, restScale } =
    geometry;

  // Caso borde: mazo vacío o índice fuera de rango. Devolvemos el "estado de
  // reposo de la primera" sin tocar nada en el DOM. El caller no debería
  // llamar con estos valores; el guard evita NaNs si el script está entre
  // estados durante una navegación SPA.
  if (total === 0 || index < 0 || index >= total) {
    return {
      yPercent: 0,
      stackOffset: 0,
      rotateX: 0,
      opacity: 1,
      entryY: 0,
      entryScale: 1,
    };
  }

  // La última tarjeta no se pliega. Sigue teniendo entrada (sube desde su
  // reposo al frente del mazo) y se mantiene al 100% sobre el viewport al
  // final del scroll.
  const isLast = index === total - 1;
  if (isLast) {
    // Su tramo de ENTRADA va hasta p = 1 (cuando el scroll termina y ella
    // queda al frente). Si la entrada empieza antes, también la aplicamos.
    const entryEnd = 1;
    const entryStart = Math.max(0, entryEnd - 0.7 * segment);
    const tEntry = clamp01((p - entryStart) / Math.max(entryEnd - entryStart, 1e-6));
    const offset = restOffset(index);
    const scale = restScale(index);
    // Bajo movimiento reducido la entrada también se neutraliza: la tarjeta
    // queda al frente sin ascender desde un reposo. No hay crossfade porque
    // no hay tarjeta debajo que la revele.
    const entryY = reduceMotion ? 0 : lerp(offset, 0, tEntry);
    const entryScale = reduceMotion ? 1 : lerp(scale, 1, tEntry);
    return {
      yPercent: 0,
      stackOffset: 0,
      rotateX: 0,
      opacity: 1,
      entryY,
      entryScale,
    };
  }

  // Tramo de SALIDA: de `start = i * seg` a `min(start + seg, 1)`.
  const start = index * segment;
  const end = Math.min(start + segment, 1);
  const tExit = clamp01((p - start) / Math.max(end - start, 1e-6));

  // Tramo de ENTRADA: arranca antes que la salida para que la tarjeta de abajo
  // haya subido a su plano cuando la de arriba empieza a plegarse.
  const entryStart = Math.max(0, start - segment);
  const entryEnd =
    index === 0 ? 0 : Math.min(start, entryStart + 0.7 * segment);
  const tEntry =
    index === 0
      ? 1
      : clamp01((p - entryStart) / Math.max(entryEnd - entryStart, 1e-6));

  // Estado de la tarjeta en este progreso.
  let yPercent = exitPercent * tExit;
  let rotateX = 22 * tExit;
  let stackOffset = stackStep * index * tExit;

  // La opacidad se mantiene en 1 en el flujo normal; el plegado va por
  // transform. Sólo cuando el usuario pidió movimiento reducido cruzamos por
  // opacidad (es la "forma" del mazo cuando no hay 3D).
  let opacity = reduceMotion ? 1 - tExit : 1;

  let offset = restOffset(index);
  let scale = restScale(index);
  let entryY = index === 0 ? 0 : lerp(offset, 0, tEntry);
  let entryScale = index === 0 ? 1 : lerp(scale, 1, tEntry);

  // Reducción de movimiento: se neutraliza TODO el desplazamiento (el pliegue
  // es 3D, así que ocultamos el movimiento por completo) y se deja sólo el
  // crossfade de opacidad. Mantener la función (el visitante sigue avanzando
  // por el mazo) sin el movimiento: la regla de la casa es "neutralizar el
  // movimiento, nunca quitar la función".
  if (reduceMotion) {
    yPercent = 0;
    rotateX = 0;
    stackOffset = 0;
    entryY = 0;
    entryScale = 1;
  }

  return {
    yPercent,
    stackOffset,
    rotateX,
    opacity,
    entryY,
    entryScale,
  };
};

// Tarjeta visualmente al frente del mazo en un progreso dado. Se usa para
// decidir qué tarjeta es la activa a efectos de teclado (inert en las demás)
// y, si quisiéramos, para `aria-hidden` descriptivo.
//
// Discreto por progreso: usamos el segmento continuo con `round`, no la entrada
// exacta de cada tarjeta, porque la transición entre ellas es gradual y eso
// da un cambio de foco más predecible para el lector de pantalla.
//
// El clamp evita que un `progress > 1` (puede pasar un frame mientras el
// navegador se acomoda) devuelva un índice fuera del mazo.
export const flipFront = (progress: number, geometry: FlipGeometry): number => {
  const { total, segment } = geometry;
  if (total === 0) return 0;
  const p = clamp01(progress);
  const raw = Math.round(p / segment);
  return Math.min(Math.max(raw, 0), total - 1);
};

// Progreso del carrete: 0 cuando el TOP del runway toca el borde superior de
// la ventana, 1 cuando el BORDE INFERIOR del sticky interno toca el borde
// inferior (es decir, cuando ya recorrimos todo el "espacio útil" del scroll).
//
// Fórmula: `runwayHeight - stickyHeight` es la distancia que el sticky se
// desplaza mientras el viewport recorre el runway. Si el sticky ocupa la
// pantalla entera, no hay recorrido y el progreso siempre es 1; eso pasaría
// cuando la sección no tiene suficiente alto (mazo de 1 tarjeta), y por eso
// el caller debe evitar mazos así.
export const flipProgress = (
  scrollY: number,
  runwayTop: number,
  runwayHeight: number,
  stickyHeight: number,
): number => {
  const denom = runwayHeight - stickyHeight;
  if (denom <= 0) return 1;
  return clamp01((scrollY - runwayTop) / denom);
};

// ---- resorte ---------------------------------------------------------------

export type SpringConfig = {
  /** rigidez del resorte (mayor = más rápido). */
  stiffness: number;
  /** amortiguación (mayor = menos oscilación). */
  damping: number;
  /** masa del cuerpo. */
  mass: number;
  /** tolerancia para considerar "asentado" (en valor absoluto). */
  restDelta: number;
};

export type SpringStep = {
  /** nuevo valor. */
  value: number;
  /** nueva velocidad. */
  velocity: number;
  /** true cuando |target - value| < restDelta && |velocity| < restDelta. */
  settled: boolean;
};

export const defaultSpringConfig = (): SpringConfig => ({
  stiffness: 120,
  damping: 22,
  mass: 0.8,
  restDelta: 0.0005,
});

// Integración explícita de un resorte críticamente amortiguado (o casi). Es
// UNA iteración del integrador, no un solver: el rAF del componente la llama
// una vez por frame y deja de llamar cuando `settled`. La fórmula:
//
//   force = stiffness * (target - value) - damping * velocity
//   velocity += force / mass * dt
//   value    += velocity * dt
//
// `dt` se clampea a 1/30s (≈33ms). Sin ese tope, una pestaña que vuelve del
// background entrega `dt > 1s` y el resorte salta al target por una sola
// integración: el efecto visible es un paso brusco. Con el tope, el camino es
// el mismo de siempre, solo un poco más largo.
//
// Devuelve SIEMPRE el nuevo estado; el caller decide si seguir integrando.
export const springStep = (
  value: number,
  velocity: number,
  target: number,
  dt: number,
  config: SpringConfig,
): SpringStep => {
  // dt se mide en segundos. Tope de 33ms para soportar pestañas en background.
  const clampedDt = Math.min(Math.max(dt, 0), 1 / 30);
  const { stiffness, damping, mass, restDelta } = config;

  const force = stiffness * (target - value) - damping * velocity;
  const newVelocity = velocity + (force / mass) * clampedDt;
  const newValue = value + newVelocity * clampedDt;

  const settled =
    Math.abs(target - newValue) < restDelta &&
    Math.abs(newVelocity) < restDelta;

  return {
    value: settled ? target : newValue,
    velocity: settled ? 0 : newVelocity,
    settled,
  };
};
