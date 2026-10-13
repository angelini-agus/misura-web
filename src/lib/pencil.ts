// Generador del tachon a lapiz.
//
// Lo usan los DOS lados: el frontmatter de Astro lo llama en el build, para que
// el tachon exista sin JavaScript, y el script del cliente lo vuelve a llamar
// con el ancho real de cada texto. Una sola fuente de verdad, para que el del
// build y el del cliente sean el mismo dibujo.

export interface Trazo {
  /** El `d` del path, en el sistema de coordenadas del ancho y alto pedidos. */
  d: string;
  /** Grosor del trazo, en px. */
  grosor: number;
  /** Opacidad del trazo. */
  opacidad: number;
}

/**
 * PRNG con semilla (mulberry32). Deterministico a proposito: los tachones tienen
 * que ser iguales en cada carga, y distintos entre items.
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

/**
 * Convierte una lista de puntos en un path de curvas. Entre cada par de puntos
 * usa el punto como control y el punto medio como destino, que es la forma
 * barata de que la linea pase suave por todos: con segmentos rectos el trazo se
 * lee como un poligono y el tachon queda duro.
 */
function curvas(puntos: Array<[number, number]>): string {
  if (puntos.length < 2) return "";
  const num = (v: number) => v.toFixed(2);
  let d = `M${num(puntos[0][0])} ${num(puntos[0][1])}`;
  for (let i = 1; i < puntos.length - 1; i++) {
    const [cx, cy] = puntos[i];
    const [nx, ny] = puntos[i + 1];
    d += ` Q${num(cx)} ${num(cy)} ${num((cx + nx) / 2)} ${num((cy + ny) / 2)}`;
  }
  const [fx, fy] = puntos[puntos.length - 1];
  d += ` L${num(fx)} ${num(fy)}`;
  return d;
}

/**
 * El contorno del trazo, con grosor variable.
 *
 * Una linea de SVG tiene grosor constante, y un lapiz no: apoya fuerte en el
 * medio y levanta en las puntas. Asi que en vez de dibujar la linea, se dibuja
 * su contorno y se rellena. El grosor se calcula en cada punto midiendo hacia
 * los dos lados de la direccion del recorrido.
 */
function contorno(puntos: Array<[number, number]>, grosor: number): string {
  const n = puntos.length;
  const arriba: Array<[number, number]> = [];
  const abajo: Array<[number, number]> = [];

  for (let i = 0; i < n; i++) {
    const [x, y] = puntos[i];
    const [ax, ay] = puntos[Math.max(0, i - 1)];
    const [bx, by] = puntos[Math.min(n - 1, i + 1)];
    let dx = bx - ax;
    let dy = by - ay;
    const largo = Math.hypot(dx, dy) || 1;
    dx /= largo;
    dy /= largo;
    // La normal a la direccion del recorrido
    const nx = -dy;
    const ny = dx;
    // En las puntas el trazo se afina, como cuando el lapiz entra y sale
    const t = i / (n - 1);
    const perfil = Math.pow(Math.sin(Math.PI * t), 0.4);
    const medio = (grosor / 2) * (0.35 + 0.65 * perfil);
    arriba.push([x + nx * medio, y + ny * medio]);
    abajo.push([x - nx * medio, y - ny * medio]);
  }

  // Un lado de ida y el otro de vuelta, y se cierra
  return `${curvas([...arriba, ...abajo.reverse()])} Z`;
}

/**
 * Un solo trazo que cruza el texto y vuelve, como un rayon hecho a mano.
 *
 * No son varias rayas separadas: es un path continuo que va de izquierda a
 * derecha y vuelve, con las dos pasadas a distinta altura y con inclinaciones
 * opuestas para que se crucen. El recorrido ondula con dos ondas de distinta
 * frecuencia, que es lo que le saca la rigidez de linea recta.
 */
export function trazoDeTachado(semilla: number, ancho: number, alto: number): Trazo {
  const rnd = prng(semilla);
  const centro = alto / 2;

  const bordeIzq = -(2 + rnd() * 5);
  const bordeDer = ancho + 2 + rnd() * 5;

  const inclinacion = alto * 0.5;
  const pasadas = [
    {
      desde: bordeIzq,
      hasta: bordeDer,
      base: centro - alto * 0.16,
      inc: inclinacion * (0.6 + rnd() * 0.9),
    },
    {
      desde: bordeDer,
      hasta: bordeIzq,
      base: centro + alto * 0.15,
      inc: -inclinacion * (0.6 + rnd() * 0.9),
    },
  ];

  const puntos: Array<[number, number]> = [];
  for (const pasada of pasadas) {
    // Cada pasada tiene sus propias ondas: una lenta que le da la forma y una
    // rapida que le da el temblor del pulso.
    const f1 = 2 + Math.floor(rnd() * 3);
    const f2 = 5 + Math.floor(rnd() * 4);
    const a1 = (0.03 + rnd() * 0.045) * alto;
    const a2 = (0.008 + rnd() * 0.02) * alto;
    const fase1 = rnd() * Math.PI * 2;
    const fase2 = rnd() * Math.PI * 2;

    const pasos = 10;
    for (let s = 0; s <= pasos; s++) {
      const t = s / pasos;
      const x = pasada.desde + (pasada.hasta - pasada.desde) * t;
      // El borde apaga la onda en los extremos, para que el trazo no se escape
      const borde = Math.sin(Math.PI * t);
      const onda =
        Math.sin(t * Math.PI * f1 + fase1) * a1 + Math.sin(t * Math.PI * f2 + fase2) * a2;
      const y = pasada.base + pasada.inc * (t - 0.5) + onda * borde;
      puntos.push([x, y]);
    }
  }

  // El grosor sale del alto del texto, un poco por debajo de la tipografia
  const grosor = alto * (0.2 + rnd() * 0.06);

  return {
    d: contorno(puntos, grosor),
    grosor: +grosor.toFixed(2),
    opacidad: +(0.88 + rnd() * 0.1).toFixed(2),
  };
}
