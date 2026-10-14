// Generador del garabato de crayon que tacha cada item del hero.
//
// Lo usan los DOS lados: el frontmatter de Astro lo llama en el build, para que
// el tachado exista sin JavaScript, y el script del cliente lo vuelve a llamar
// con la medida real de cada texto. Una sola fuente de verdad.
//
// El garabato es UNA sola trayectoria continua, sin levantar el lapiz: pasadas
// horizontales que van y vuelven, apiladas de arriba hacia abajo, unidas en los
// costados por giros redondeados. Es el gesto de pintar rapido con un crayon,
// no una raya prolija.

export interface Garabato {
  /** El `d` del path, en el sistema de coordenadas del ancho y alto pedidos. */
  d: string;
  /** Grosor de la linea, en px: `STRIKE_WIDTH` por el tamano de fuente. */
  grosor: number;
  /** Opacidad del trazo, de 0.88 a 0.95. */
  opacidad: number;
  /** Cuantas pasadas tiene, para depurar y para las capturas. */
  pasadas: number;
}

/** Banda vertical del garabato, en em, desde el tope de la caja del texto. */
export const STRIKE_BAND_TOP = 0.14;
export const STRIKE_BAND_BOTTOM = 1;

/** Grosor de la linea, en em. */
export const STRIKE_WIDTH = 0.18;

/** Pasadas por item: entre 5 y 6, distinta cantidad en cada uno. */
export const STRIKE_PASSES_MIN = 5;
export const STRIKE_PASSES_MAX = 6;

/** Inclinacion de las pasadas, en grados. Negativa = sube hacia la derecha. */
export const STRIKE_TILT_MIN = -2.2;
export const STRIKE_TILT_MAX = -1.2;

/** Sobrepaso de la pasada sobre el ancho del texto, en tanto por uno. */
export const STRIKE_OVERHANG_MIN = 0.02;
export const STRIKE_OVERHANG_MAX = 0.05;

/** Cuanto se pasa la mano del borde al girar, en tanto por uno del ancho. */
export const STRIKE_ELBOW_MIN = 0.015;
export const STRIKE_ELBOW_MAX = 0.035;

/** Cuanto se arquea cada pasada, en em: una mano no traza una recta. */
export const STRIKE_BOW = 0.05;

/** Variacion de la inclinacion entre pasadas, en radianes (mas o menos 0.8 grados). */
export const STRIKE_TILT_WOBBLE = 0.014;

/** Cuanto se corre la altura de cada pasada, en tanto por uno del alto de linea. */
export const STRIKE_JITTER = 0.08;

/** Una linea del texto ya medida, en coordenadas de la caja del item. */
export interface LineaDeTexto {
  x: number;
  y: number;
  ancho: number;
  alto: number;
}

/**
 * PRNG con semilla (mulberry32). Deterministico a proposito: el garabato de cada
 * item es el mismo en cada carga, y distinto del de los otros items.
 */
export function prng(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const num = (v: number) => v.toFixed(2);

/**
 * Reparte las pasadas entre las lineas del texto, en proporcion a lo ancho que
 * es cada una, con un minimo de 2 por linea: una linea con una sola pasada no se
 * lee como tachada.
 */
function repartirPasadas(lineas: LineaDeTexto[], total: number): number[] {
  const anchoTotal = lineas.reduce((suma, linea) => suma + linea.ancho, 0) || 1;
  const reparto: number[] = [];
  let asignadas = 0;

  lineas.forEach((linea, i) => {
    if (i === lineas.length - 1) {
      reparto.push(Math.max(2, total - asignadas));
      return;
    }
    // Lo que queda tiene que alcanzar para 2 pasadas por cada linea que falta
    const maximo = total - 2 * (lineas.length - 1 - i);
    const proporcion = Math.round(total * (linea.ancho / anchoTotal));
    const pasadas = Math.max(2, Math.min(proporcion, maximo));
    reparto.push(pasadas);
    asignadas += pasadas;
  });

  return reparto;
}

/**
 * El garabato de tachado de un item.
 *
 * `ancho` y `alto` son la caja del texto (lo que mide el `viewBox`), `fontSize`
 * el tamano de fuente de ese texto (de ahi salen la banda y el grosor, que
 * escalan con la tipografia) y `lineas` las cajas de cada linea cuando el item
 * se parte en dos o mas: el garabato sigue siendo una sola trayectoria, que baja
 * a la linea siguiente con un trazo diagonal.
 */
export function garabatoDeTachado(
  semilla: number,
  ancho: number,
  alto: number,
  fontSize: number,
  lineas?: LineaDeTexto[],
): Garabato {
  const rnd = prng(semilla);

  const cajas = (lineas?.length ? lineas : [{ x: 0, y: 0, ancho, alto }]).filter(
    (linea) => linea.ancho > 0 && linea.alto > 0,
  );
  if (!cajas.length) return { d: "", grosor: fontSize * STRIKE_WIDTH, opacidad: 0.9, pasadas: 0 };

  const total = STRIKE_PASSES_MIN + Math.floor(rnd() * (STRIKE_PASSES_MAX - STRIKE_PASSES_MIN + 1));
  const reparto = repartirPasadas(cajas, total);

  // La inclinacion es una sola para todo el item: en la referencia las pasadas
  // son paralelas entre si.
  const grados = STRIKE_TILT_MIN + rnd() * (STRIKE_TILT_MAX - STRIKE_TILT_MIN);
  const pendiente = Math.tan((grados * Math.PI) / 180);

  const puntos: Array<[number, number]> = [];
  let indice = 0;
  // De que lado quedo la mano al terminar la linea anterior (+1 derecha, -1 izquierda)
  let ladoFin = 0;

  cajas.forEach((caja, i) => {
    const tope = caja.y + STRIKE_BAND_TOP * fontSize;
    const piso = caja.y + STRIKE_BAND_BOTTOM * fontSize;
    const centroX = caja.x + caja.ancho / 2;
    const pasadas = reparto[i];

    // Al bajar de linea la mano no levanta: si la pasada nueva arrancaria del
    // mismo lado en el que quedo la anterior, se invierte la alternancia, asi la
    // union entre las dos lineas es el trazo diagonal y no un codo pegado al
    // margen.
    if (i > 0 && ladoFin !== 0) {
      const arrancaIzquierda = indice % 2 === 0;
      if ((arrancaIzquierda ? -1 : 1) === ladoFin) indice++;
    }

    // Una pasada inclinada sube (o baja) media inclinacion de punta a punta, asi
    // que los centros se corren hacia adentro esa mitad: lo que queda dentro de
    // la banda es la TINTA, no la linea media. Sin esto el garabato se desborda
    // al renglon de arriba y de abajo.
    const barrido = Math.abs(pendiente) * caja.ancho;
    const topeCentros = tope + barrido / 2;
    const pisoCentros = Math.max(topeCentros, piso - barrido / 2);

    // Primero se calculan todas las pasadas de la linea: el codo de vuelta
    // necesita saber a que altura entra la que sigue.
    const tramos = Array.from({ length: pasadas }, (_, j) => {
      const t = pasadas === 1 ? 0.5 : j / (pasadas - 1);
      // Cada pasada se corre un poco de la grilla: si quedan equidistantes se
      // leen como un rallado y no como un garabato.
      const desvio = (rnd() * 2 - 1) * STRIKE_JITTER * caja.alto;
      // La inclinacion es la del item, con una variacion chica por pasada: si
      // todas van con el mismo angulo exacto, la pila se lee como un rallado.
      const pendientePasada = pendiente + (rnd() * 2 - 1) * STRIKE_TILT_WOBBLE;
      // El sobrepaso es distinto en cada extremo y en cada pasada: por eso los
      // giros no quedan alineados.
      const sobreIzq =
        STRIKE_OVERHANG_MIN + rnd() * (STRIKE_OVERHANG_MAX - STRIKE_OVERHANG_MIN);
      const sobreDer =
        STRIKE_OVERHANG_MIN + rnd() * (STRIKE_OVERHANG_MAX - STRIKE_OVERHANG_MIN);
      return {
        yMedio: topeCentros + (pisoCentros - topeCentros) * t + desvio,
        pendiente: pendientePasada,
        xIzq: caja.x - caja.ancho * sobreIzq,
        xDer: caja.x + caja.ancho + caja.ancho * sobreDer,
      };
    });

    const yEn = (tramo: (typeof tramos)[number], x: number) =>
      tramo.yMedio + tramo.pendiente * (x - centroX);

    tramos.forEach((tramo, j) => {
      // La direccion alterna a lo largo de TODO el recorrido, tambien al bajar
      // de una linea a la siguiente: la mano nunca levanta.
      const haciaLaDerecha = indice % 2 === 0;
      const xa = haciaLaDerecha ? tramo.xIzq : tramo.xDer;
      const xb = haciaLaDerecha ? tramo.xDer : tramo.xIzq;
      ladoFin = haciaLaDerecha ? 1 : -1;

      // La pasada no es una recta: se arquea un poco hacia arriba o hacia abajo,
      // que es lo que la saca del aspecto de renglon.
      const arco = (rnd() * 2 - 1) * STRIKE_BOW * fontSize;
      [0, 0.33, 0.66, 1].forEach((u) => {
        const x = xa + (xb - xa) * u;
        puntos.push([x, yEn(tramo, x) + arco * Math.sin(Math.PI * u)]);
      });
      indice++;

      const siguiente = tramos[j + 1];
      if (!siguiente) return;
      // El codo: la mano se pasa un poco del borde del texto y vuelve, en
      // redondo, a la altura del medio entre las dos pasadas.
      const yVuelta = yEn(siguiente, xb);
      const extra = (STRIKE_ELBOW_MIN + rnd() * (STRIKE_ELBOW_MAX - STRIKE_ELBOW_MIN)) * caja.ancho;
      puntos.push([xb + Math.sign(xb - xa) * extra, (yEn(tramo, xb) + yVuelta) / 2]);
    });
  });

  const d = puntos
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${num(x)} ${num(y)}`)
    .join(" ");

  return {
    d,
    grosor: +(fontSize * STRIKE_WIDTH).toFixed(2),
    opacidad: +(0.88 + rnd() * 0.07).toFixed(2),
    pasadas: total,
  };
}
