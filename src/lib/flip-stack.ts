// Matemática del mazo de "carpetas" usado por la sección de proyectos.
//
// Es una librería pura: sin DOM, sin imports de Astro, sin side effects. Se
// importa desde el script del componente para mover las carpetas y desde Node
// para verificar las invariantes (ver scripts en odd/tasks). Mantener este
// archivo libre de dependencias de runtime permite auditar la geometría sin
// navegador y dejar los tests como scripts standalone.
//
// Modelo de movimiento (v2, carpetas que se asientan detrás):
//   - El mazo está en una pista (runway) que el scroll recorre.
//   - Cada carpeta tiene una pestaña con el título que sobresale por arriba
//     del cuerpo y un cuerpo con el resto del contenido.
//   - Cuando una carpeta pasa al frente, sube un escalón (su pestaña queda
//     visible sobre la carpeta siguiente) y se escala un punto abajo.
//   - La siguiente está estacionada justo debajo del frente (y las que siguen,
//     escalonadas una más abajo cada una) y sube hasta ocupar su lugar.
//   - La última carpeta nunca se asienta: queda al frente al final.
//
// Diferencias con v1 (plegado con rotateX):
//   - No hay `rotateX` ni `exitPercent`: las carpetas no rotan ni se hunden.
//   - No hay `stackStep` por tarjeta: las que ya pasaron se siguen moviendo
//     hacia arriba un escalón por cada nueva carpeta que pasa.
//   - Aparece `entryOffset`: la distancia a la que la carpeta entrante
//     empieza, abajo del stage (medida en px).

// ---- tipos -----------------------------------------------------------------

export type FlipGeometry = {
  /** cantidad de carpetas. */
  readonly total: number;
  /** tramo de progreso dedicado a cada carpeta, `1 / max(total - 1, 1)`. */
  readonly segment: number;
  /** alto del escalón en px (alto de pestaña + ~10px de sliver). */
  readonly step: number;
  /** translate Y inicial de una carpeta entrante, en px (positiva = abajo). */
  readonly entryOffset: number;
};

export type FlipCardState = {
  /** translate Y en px (negativo = arriba, positivo = abajo del stage). */
  y: number;
  /** escala: 1 cuando la carpeta está al frente, 0.98 cuando ya pasó. */
  scale: number;
  /** opacidad: 1 en movimiento normal; con `reduceMotion` cae a 0 al
   *  alejarse del frente (la forma de "avanzar" del mazo cuando no se mueve). */
  opacity: number;
};

// ---- primitivas ------------------------------------------------------------

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const clamp = (n: number, lo: number, hi: number) =>
  n < lo ? lo : n > hi ? hi : n;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Calcula la geometría del mazo. Se llama una vez por init y de nuevo en cada
// medición (resize), no por frame.
//
// `total` debe ser >= 1 (el caller debe evitar mazos vacíos; si pasa 0, todos
// los valores caen a un estado neutro sin NaNs).
//
// `step` es el alto del escalón en px: la cantidad que sube una carpeta cuando
// pasa. Sale de la altura de la pestaña + un aire pequeño (ver spec, lo mide
// el componente). `entryOffset` es la distancia a la que la carpeta entrante
// empieza abajo del stage (en px); depende del alto del cuerpo y de la
// posición de la pestaña.
export const flipGeometry = (
  total: number,
  step: number,
  entryOffset: number,
): FlipGeometry => {
  const safeTotal = Math.max(0, Math.floor(total));
  // Un tramo por carpeta (`1 / n`), no `1 / (n - 1)`: asi el carrete tiene un
  // tramo final propio de la ultima carpeta, que se queda al frente mientras la
  // anterior termina de asentarse. Con `1 / (n - 1)` la ultima llegaba justo al
  // final del carrete y la anteultima no tenia scroll para subir su escalon
  // (quedaba tapada por la ultima).
  const m = Math.max(safeTotal, 1);
  return {
    total: safeTotal,
    segment: 1 / m,
    step: Math.max(0, step),
    entryOffset: Math.max(0, entryOffset),
  };
};

// Estado de una carpeta dado el progreso del carrete.
//
// Reglas:
//   - Folder 0 (primera): arranca al frente (y=0) y sube continuamente hasta
//     `-(n-1)*step` al final del scroll. Sin entrada.
//   - Folder n-1 (última): sube desde `entryOffset` hasta 0 al final. Sin
//     salida.
//   - Las del medio: suben desde `entryOffset` hasta 0 durante su segmento de
//     entrada, después de 0 a `-(n-1-i)*step` durante el resto (la suma de
//     su entrada más todas las salidas de las carpetas que pasan después).
//
// La escala se interpola entre 1 (al frente, y=0) y 0.98 (un escalón atrás o
// más) en función de `|y|/step`. Es la "reducción leve" que pide el spec
// para que la pestaña que asoma no se vea igual de grande que la carpeta del
// frente.
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
  const { total, segment, step, entryOffset } = geometry;

  // Caso borde: mazo vacío o índice fuera de rango. Devolvemos el "estado de
  // reposo de la primera" sin tocar nada en el DOM. El caller no debería
  // llamar con estos valores; el guard evita NaNs si el script está entre
  // estados durante una navegación SPA.
  if (total === 0 || index < 0 || index >= total) {
    return { y: 0, scale: 1, opacity: 1 };
  }

  // Bajo movimiento reducido el mazo no se mueve: todo queda en y=0 y la
  // transición entre carpetas se hace por opacidad. La opacidad sigue una
  // función "tienda" centrada en el segmento propio de cada carpeta:
  //   opacity = max(0, 1 - |p/seg - i|)
  // Así la carpeta i está al 100% cuando p = i*seg (al frente) y cae a 0
  // cuando se aleja un segmento hacia cualquier lado. Sin movimiento, las
  // carpetas que se cruzan en un segmento se intercalan por opacidad.
  if (reduceMotion) {
    const opacity = clamp01(1 - Math.abs(p / segment - index));
    return { y: 0, scale: 1, opacity };
  }

  // `q` = cuántos tramos faltan para que esta carpeta llegue al frente
  // (fraccionario): 0 = al frente, 1 = una carpeta adelante (la próxima), etc.
  // De `q` salen las tres fases:
  //   q >= 1        espera en la cola de abajo, un escalón más abajo por carpeta
  //   0 <= q <= 1   sube desde la cola hasta el frente (un tramo)
  //  -1 <= q < 0    al frente, quieta: todo su tramo (así nunca mueve su solapa)
  //   q < -1        se asienta en la pila de arriba, un escalón por tramo
  const q = index - p / segment;

  let y: number;
  let scale: number;

  if (q >= 0) {
    // Cola de abajo o subiendo: la próxima (q = 1) espera justo debajo de la del
    // frente, a `entryOffset` = alto del cuerpo + pestaña + un aire, así el
    // visitante ya ve el proyecto que viene antes de que empiece la animación y
    // no queda el hueco vacío de abajo. Cada una de las que siguen espera otro
    // `entryOffset` más abajo, fuera de cuadro a propósito: asomando mostrarían
    // el contenido de proyectos que todavía no tocan. Cuando le toca subir
    // (0 < q < 1) recorre la cola hasta el frente en su tramo.
    y = entryOffset * q;
  } else {
    // Pila de arriba: la carpeta ya pasó al frente. Se queda quieta todo su
    // tramo (así su solapa nunca se mete debajo del navbar) y recién sube un
    // escalón por tramo cuando la siguiente llegó y la tapa. Al final del
    // carrete cada una queda exactamente (total - 1 - index) escalones arriba.
    y = q >= -1 ? 0 : step * (q + 1);
  }

  // La escala se interpola entre 1 (al frente) y 0.98 (un escalón atrás, o en
  // la cola de abajo), y se queda en 0.98 cuando |y| >= step.
  const scaleT = clamp01(Math.abs(y) / Math.max(step, 1e-6));
  scale = lerp(1, 0.98, scaleT);

  return { y, scale, opacity: 1 };
};

// Carpeta visualmente al frente del mazo en un progreso dado. Se usa para
// decidir qué carpeta es la activa a efectos de teclado (inert en las demás).
//
// Discreto por progreso: usamos el segmento continuo con `floor`, no el
// momento exacto de "llegada al frente" de cada carpeta, porque la transición
// entre ellas es gradual y eso da un cambio de foco más predecible para el
// lector de pantalla.
//
// El clamp evita que un `progress > 1` (puede pasar un frame mientras el
// navegador se acomoda) devuelva un índice fuera del mazo.
export const flipFront = (progress: number, geometry: FlipGeometry): number => {
  const { total, segment } = geometry;
  if (total === 0) return 0;
  const p = clamp01(progress);
  // El +1e-9 es por el clásico error de coma flotante: `Math.floor(0.2/0.2)`
  // puede devolver 0 cuando queremos 1 por una división que da 0.99999... .
  const raw = Math.floor(p / segment + 1e-9);
  return clamp(raw, 0, total - 1);
};

// Progreso del carrete: 0 cuando el TOP del runway toca el borde superior de
// la ventana, 1 cuando el BORDE INFERIOR del sticky interno toca el borde
// inferior (es decir, cuando ya recorrimos todo el "espacio útil" del scroll).
//
// Fórmula: `runwayHeight - stickyHeight` es la distancia que el sticky se
// desplaza mientras el viewport recorre el runway. Si el sticky ocupa la
// pantalla entera, no hay recorrido y el progreso siempre es 1; eso pasaría
// cuando la sección no tiene suficiente alto (mazo de 1 carpeta), y por eso
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