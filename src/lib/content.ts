import type {
  ContactInfo,
  Cta,
  Differentiator,
  FaqItem,
  ForWhoSection,
  NavItem,
  PortfolioItem,
  Service,
} from "./types";

export const isPending = (value: string) => value.includes("[PENDIENTE");

export const hasRealAnswer = (value: string) =>
  value.replace(/\[PENDIENTE:[^\]]*\]/g, "").trim().length > 0;

export const cleanAnswer = (value: string) =>
  value.replace(/\[PENDIENTE:[^\]]*\]/g, "").trim();

export const site = {
  name: "misure",
  url: "[PENDIENTE: dominio de producción]",
  announcement:
    "Desarrollo de software a medida en Rosario y Cordón Industrial — Prototipo gratis antes de contratar",
  menuLabel: "Menú",
  metaTitle: "misure — Software a medida para PYMEs: Gestión, Ventas y Páginas Web",
  metaDescription:
    "misure diseña y desarrolla sistemas de gestión, herramientas de ventas y páginas web 100% a medida para PYMEs de Rosario y el Cordón Industrial. Prototipo gratis antes de firmar.",
  tagline: "Software a medida para que tu empresa funcione mejor.",
};

export const footer = {
  navTitle: "Navegación",
  servicesTitle: "Servicios",
  tagline: "Desarrollado por misure",
};

export const nav: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Proyectos", href: "/proyectos" },
];

export const headerCta: Cta = {
  label: "Quiero mi prototipo gratis",
  href: "/contacto",
};

export const pages = {
  home: { title: site.metaTitle, description: site.metaDescription },
  nosotros: {
    title: "Nosotros — misure | Equipo de desarrollo en Rosario",
    description:
      "Conocé a las personas detrás de misure: desarrollo de sistemas de gestión, herramientas de ventas y páginas web 100% a medida para PYMEs de Rosario y el Cordón Industrial.",
    h1: "Nosotros",
    intro:
      "Conocé a las personas que desarrollan el software a medida de misure: sistemas de gestión, herramientas de ventas y páginas web.",
  },
  proyectos: {
    title: "Proyectos — misure | Casos de éxito en software a medida",
    description:
      "Casos de éxito de misure: sistemas de gestión, herramientas de ventas y páginas web 100% a medida para PYMEs de Rosario. Resultados reales, no promesas.",
    h1: "Proyectos",
    intro:
      "Resultados reales de software a medida para PYMEs: sistemas de gestión, herramientas de ventas y páginas web.",
  },
  contacto: {
    title: "Contacto — misure | Prototipo gratis antes de firmar",
    description:
      "Contanos en qué etapa está tu negocio y te mostramos cómo un sistema a medida puede resolver tu problema. Prototipo gratis, sin compromiso.",
    h1: "Hablemos",
    intro:
      "Contanos en qué etapa está tu negocio y empecemos con un prototipo gratis, sin compromiso.",
  },
};

export const clients = {
  eyebrow: "Prueba social",
  title: "No prometemos resultados. Los mostramos.",
  description:
    "Un sistema de gestión a medida para una empresa de limpieza de Rosario eliminó un puesto administrativo completo y llevó las quejas por inasistencias de 4-6 por mes a prácticamente 0.",
  metrics: [
    {
      value: "$2.800.000",
      unit: "ARS/mes",
      label: "ahorrados en sueldo y cargas sociales",
    },
    {
      value: "0",
      unit: "quejas",
      label: "por inasistencias (antes: 4-6 por mes)",
    },
    {
      value: "1",
      unit: "persona",
      label: "supervisa lo que antes hacían 3",
    },
  ],
  cta: {
    label: "Ver cómo lo hicimos",
    href: "/proyectos/empresa-limpieza-rosario",
  },
};

export const explore = {
  eyebrow: "Explorá",
  title: "¿Por dónde seguís?",
  description:
    "Tres cosas concretas que podés hacer ahora para entender si misure es lo que tu empresa necesita.",
  items: [
    {
      title: "Prototipo gratis antes de firmar",
      description:
        "Antes de comprometerte con nada, te entregamos el diseño y el prototipo de tu sistema sin cargo. Cero riesgo para arrancar.",
      href: "/nosotros",
      cta: "Cómo trabajamos",
    },
    {
      title: "Un caso real documentado",
      description:
        "Empresa de limpieza, Rosario: un sistema que reemplazó tres planillas de Excel y eliminó un puesto administrativo completo.",
      href: "/proyectos/empresa-limpieza-rosario",
      cta: "Ver el caso",
    },
    {
      title: "Precios sin letra chica",
      description:
        "Landing desde USD 200. ERP/CRM desde USD 1.000. E-commerce desde USD 1.500. Sin sorpresas ni suscripciones de por vida.",
      href: "#preguntas",
      cta: "Ver preguntas frecuentes",
    },
  ],
};

export const about: {
  eyebrow: string;
  title: string;
  body: string;
} = {
  eyebrow: "Nosotros",
  title: "Quiénes somos",
  body: "[PENDIENTE: texto real de la empresa]",
};

export const hero = {
  title: "Automatizá lo que hoy le cuesta un sueldo completo a tu empresa.",
  lead:
    "Diseñamos y desarrollamos sistemas de gestión, ventas y páginas web 100% a medida, sin SaaS genérico ni plantillas. Vamos a tu negocio, armamos un prototipo y diseño gratis antes de firmar, y trabajamos con entregas semanales por contrato.",
  ctaPrimary: { label: "Agendá 20 minutos con nosotros", href: "/contacto" },
  ctaSecondary: { label: "Ver casos de éxito", href: "/proyectos" },
} satisfies {
  title: string;
  lead: string;
  ctaPrimary: Cta;
  ctaSecondary: Cta;
};

export const services: {
  eyebrow: string;
  title: string;
  subtitle: string;
  subtitleLink: Cta;
  items: Service[];
} = {
  eyebrow: "Servicios",
  title: "Lo que hacemos",
  subtitle:
    "Desarrollamos software específico y 100% personalizado para tu empresa. Sin SaaS genérico, sin plantillas, sin adaptarte a un sistema rígido.",
  subtitleLink: {
    label: "¿Tenés dudas sobre qué elegir? Ver preguntas frecuentes",
    href: "#preguntas",
  },
  items: [
    {
      id: "erp",
      name: "Sistemas de Gestión (ERP)",
      description:
        "Dejás de perder tiempo con planillas de Excel, WhatsApp y papeles. Tu equipo trabaja desde un solo lugar: ventas, stock, compras y facturación integrados al proceso real de tu negocio.",
    },
    {
      id: "crm",
      name: "Herramientas de Ventas (CRM)",
      description:
        "Ninguna oportunidad se pierde más entre el primer contacto y el cierre. Tu equipo comercial trabaja con la misma información, en tiempo real, desde donde esté.",
    },
    {
      id: "landing",
      name: "Páginas Web",
      description:
        "Cada visita tiene una sola misión: convertirse en consulta o venta. Diseño propio, carga rápida y un objetivo claro que reemplaza al folleto digital que nadie lee.",
    },
  ],
};

export const differentiators: {
  eyebrow: string;
  title: string;
  subtitle: string;
  subtitleLink: Cta;
  items: Differentiator[];
} = {
  eyebrow: "Diferenciales",
  title: "Qué nos hace distintos",
  subtitle:
    "Cuatro compromisos concretos, no adjetivos. Podés leerlos y pedirlos por escrito.",
  subtitleLink: {
    label: "¿Te interesa? Contanos tu caso",
    href: "/contacto",
  },
  items: [
    {
      title: "Entrevista de 2 horas en tu negocio",
      description:
        "Vamos presencialmente a ver cómo trabajás antes de escribir una línea de código. No hacemos suposiciones desde una videollamada.",
    },
    {
      title: "Errores post-lanzamiento: los arreglamos gratis",
      description:
        "Si algo falla después de que el sistema sale a producción, lo solucionamos sin costo adicional. Sin excusas y sin facturar horas extra.",
    },
    {
      title: "Prototipo y diseño gratis antes de firmar nada",
      description:
        "Antes de que desembolses un peso, ya tenés el prototipo navegable y el diseño aprobado. Si no te convence, no perdés nada.",
    },
    {
      title: "Cumplimiento de plazos garantizado por contrato",
      description:
        "Las entregas semanales y la fecha de lanzamiento quedan escritas en el contrato. No somos una empresa que promete y desaparece.",
    },
  ],
};

export const team: {
  eyebrow: string;
  title: string;
  description: string;
  socialLabels: { linkedin: string; github: string };
  members: {
    name: string;
    role: string;
    description: string;
    socials: { linkedin: string; github: string };
  }[];
} = {
  eyebrow: "Equipo",
  title: "Conocé al equipo",
  description: "[PENDIENTE: descripción breve del equipo]",
  socialLabels: {
    linkedin: "LinkedIn",
    github: "GitHub",
  },
  members: [
    {
      name: "[PENDIENTE]",
      role: "[PENDIENTE]",
      description: "[PENDIENTE]",
      socials: { linkedin: "[PENDIENTE]", github: "[PENDIENTE]" },
    },
    {
      name: "[PENDIENTE]",
      role: "[PENDIENTE]",
      description: "[PENDIENTE]",
      socials: { linkedin: "[PENDIENTE]", github: "[PENDIENTE]" },
    },
  ],
};

export const portfolio: {
  eyebrow: string;
  title: string;
  description: string;
  filtersLabel: string;
  detailsLabel: string;
  filters: { value: string; label: string }[];
  items: PortfolioItem[];
} = {
  eyebrow: "Portfolio",
  title: "Casos de éxito",
  description:
    "Proyectos reales, con resultados medibles. Cada sistema fue diseñado desde cero para el proceso de cada empresa.",
  filtersLabel: "Filtrar proyectos",
  detailsLabel: "Ver caso completo",
  filters: [
    { value: "todos", label: "Todos" },
    { value: "erp", label: "Gestión (ERP)" },
    { value: "crm", label: "Ventas (CRM)" },
    { value: "landing", label: "Páginas Web" },
  ],
  items: [
    {
      project: "Sistema de gestión para empresa de limpieza",
      client: "Empresa de limpieza — Rosario",
      category: "erp",
      technologies: ["Node.js", "TypeScript", "PostgreSQL", "QR", "Geolocalización"],
      description:
        "Asistencia por geolocalización/QR, cálculo automático de sueldos e impuestos y gestión de stock por edificio. Resultado: un puesto administrativo eliminado y quejas por inasistencias reducidas a 0.",
      href: "/proyectos/empresa-limpieza-rosario",
    },
    {
      project: "Proyecto [PENDIENTE]",
      client: "Cliente [PENDIENTE]",
      category: "crm",
      technologies: ["React", "Node.js", "TypeScript"],
      description: "[PENDIENTE: descripción del caso y resultados]",
    },
    {
      project: "Proyecto [PENDIENTE]",
      client: "Cliente [PENDIENTE]",
      category: "landing",
      technologies: ["Astro", "TypeScript"],
      description: "[PENDIENTE: descripción del caso y resultados]",
    },
  ],
};


export const faqHeading: {
  eyebrow: string;
  title: string;
} = {
  eyebrow: "FAQ",
  title: "Preguntas frecuentes",
};

export const faq: FaqItem[] = [
  {
    question: "¿Qué servicios ofrece misure?",
    answer:
      "Desarrollamos sistemas de gestión (ERP), herramientas de ventas (CRM) y páginas web a medida. Tres líneas que se combinan para cubrir la operación interna de tu empresa y cómo te mostrás al mundo.",
  },
  {
    question: "¿Qué incluye un sistema de gestión (ERP)?",
    answer:
      "Ventas, stock, compras y facturación en una sola herramienta, construida alrededor de tus procesos y no al revés. El alcance final se define según el rubro y la operación de cada empresa.",
  },
  {
    question: "¿Para qué sirve una herramienta de ventas (CRM)?",
    answer:
      "Para el seguimiento de clientes y oportunidades: que ninguna venta se pierda en el camino y que el equipo trabaje con la misma información.",
  },
  {
    question: "¿Qué es una página web de conversión y para qué sirve?",
    answer:
      "Una página enfocada en un solo objetivo: convertir visitas en consultas o ventas, con diseño propio y carga rápida. Se combina con las herramientas de ventas para capturar y seguir los contactos que llegan.",
  },
  {
    question: "¿Cuánto cuesta un proyecto como el mío?",
    answer:
      "Depende del alcance, pero manejamos rangos transparentes: landing page desde USD 200, sistemas de gestión (ERP/CRM) entre USD 1.000 y 2.000, e-commerce entre USD 1.500 y 3.000. Antes de darte un número, hacemos una entrevista para entender tu caso y presupuestamos sin compromiso.",
  },
  {
    question: "¿Qué pasa después del lanzamiento?",
    answer:
      "El software no termina cuando se publica. Si hay errores después del lanzamiento, los arreglamos gratis. Y seguimos disponibles para soporte, mantenimiento y mejoras.",
  },
  {
    question: "¿Cómo sé que van a cumplir el plazo si son una empresa nueva?",
    answer:
      "Las entregas semanales y la fecha de lanzamiento quedan escritas en el contrato. No dependemos de promesas verbales. Podés leer las condiciones antes de firmar y, si algo se desvía, está contemplado en el acuerdo.",
  },
  {
    question: "¿Cuánto cuesta un proyecto?",
    answer:
      "Landing page desde USD 200. Sistemas de gestión (ERP/CRM) entre USD 1.000 y 2.000. E-commerce entre USD 1.500 y 3.000. El presupuesto exacto lo definimos después de entender tu caso en una charla de 20 minutos.",
  },
];

export const forWho: ForWhoSection = {
  eyebrow: "¿Es para vos?",
  title: "Trabajamos con quienes saben lo que quieren.",
  yes: {
    label: "Es para vos si",
    items: [
      "Perdiste el control de tu operación con Excel, WhatsApp o papeles",
      "Probaste un sistema genérico que no encajaba con tu negocio",
      "Preferís pagar una vez y no una suscripción de por vida",
      "Querés un sistema que se adapte a vos, no al revés",
      "Valorás tener un interlocutor que entiende tu rubro",
    ],
  },
  no: {
    label: "No es para vos si",
    items: [
      "Buscás la opción más barata sin importar el resultado",
      "Querés un sistema ya armado sin adaptarlo a tu proceso",
      "No tenés 2 horas para una entrevista inicial presencial",
      "Esperás que el software resuelva problemas de gestión sin involucrarte",
    ],
  },
};

export const contact: ContactInfo = {
  eyebrow: "Contacto",
  title: "¿Listo para digitalizar tu empresa?",
  description:
    "Contanos en qué etapa está tu negocio y te contamos cómo podemos ayudarte. Sin vueltas y sin compromiso.",
  ctaLabel: "Iniciar proyecto",
  email: "[PENDIENTE: email de contacto]",
  locationItems: [
    { label: "UBICACIÓN", value: "Rosario, Santa Fe" },
    { label: "MODALIDAD", value: "Presencial / Remoto" },
  ],
  socials: [
    { label: "LinkedIn", url: "[PENDIENTE: perfil de LinkedIn]" },
    { label: "Instagram", url: "[PENDIENTE: perfil de Instagram]" },
  ],
};

export const stickyCta = {
  ariaLabel: "Acción rápida",
  label: "Contanos tu proyecto",
  href: "/contacto",
};

export const share = {
  label: "Compartir",
  copiedLabel: "Link copiado",
};

export const contactForm = {
  labels: {
    name: "Nombre",
    company: "Empresa",
    email: "Email",
    phone: "Teléfono",
    service: "Servicio de interés",
    message: "Mensaje",
  },
  placeholders: {
    name: "Tu nombre",
    company: "Tu empresa",
    email: "tucorreo@empresa.com",
    phone: "Tu teléfono o WhatsApp",
    message: "Contanos en qué etapa está tu negocio",
  },
  servicePlaceholder: "Elegí un servicio",
  serviceOptions: [
    { value: "erp", label: "Sistemas de Gestión (ERP)" },
    { value: "crm", label: "Herramientas de Ventas (CRM)" },
    { value: "landing", label: "Páginas Web" },
    { value: "otros", label: "Otros" },
  ],
  errors: {
    name: "Ingresá tu nombre",
    email: "Ingresá un email válido",
    phone: "Ingresá tu teléfono",
    service: "Elegí un servicio",
    message: "Contanos un poco más (mínimo 10 caracteres)",
  },
  submitLabel: "Enviar",
  submittingLabel: "Enviando...",
  successMessage:
    "Gracias, recibimos tu mensaje. Te contactamos a la brevedad.",
  formError: "Revisá los campos marcados e intentá de nuevo.",
  disclaimer:
    "Tus datos están seguros con nosotros. No compartimos tu información con terceros ni enviamos spam.",
};

export const caseStudies = {
  limpieza: {
    slug: "empresa-limpieza-rosario",
    seo: {
      title:
        "Sistema de gestión para empresa de limpieza — misure | Rosario",
      description:
        "Eliminamos un puesto administrativo completo y llevamos las quejas por inasistencias de 4-6 por mes a 0. Sistema a medida con geolocalización, cálculo de sueldos y stock por edificio.",
    },
    eyebrow: "Caso de éxito",
    title: "Sistema de gestión para empresa de limpieza",
    client: "Empresa de limpieza",
    location: "Rosario, Santa Fe",
    category: "Gestión (ERP)",
    technologies: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Geolocalización",
      "QR",
    ],
    problem: {
      eyebrow: "El desafío",
      title: "Tres planillas, WhatsApp y un puesto administrativo al límite",
      body: [
        "La empresa manejaba la asistencia de su personal en múltiples edificios con planillas de Excel compartidas por WhatsApp. Cada fin de mes, el área administrativa tardaba varios días en cruzar datos de asistencia, calcular sueldos y liquidar impuestos.",
        "Las quejas por inasistencias llegaban a 4-6 por mes sin que hubiera forma de verificarlas en tiempo real. El personal de supervisión no tenía visibilidad de qué empleado estaba en qué edificio, y el stock de insumos por edificio se registraba a mano.",
        "El sistema existente no era escalable: cada empleado nuevo multiplicaba el trabajo administrativo en lugar de distribuirlo.",
      ],
    },
    solution: {
      eyebrow: "La solución",
      title: "Un sistema construido alrededor del proceso real de la empresa",
      features: [
        {
          title: "Asistencia por geolocalización y QR",
          description:
            "El personal registra entrada y salida desde su teléfono, verificado por geolocalización GPS y código QR en cada edificio. Sin papel, sin planillas, sin posibilidad de registrar desde otro lugar.",
        },
        {
          title: "Cálculo automático de sueldos e impuestos",
          description:
            "Las horas trabajadas, horas extra, ausencias y llegadas tarde se calculan automáticamente según el convenio colectivo. La liquidación mensual que antes llevaba días ahora tarda minutos.",
        },
        {
          title: "Gestión de stock por edificio",
          description:
            "Cada edificio tiene su propio inventario de insumos dentro del sistema. Los supervisores registran consumo desde el celular y el sistema alerta cuando el stock cae por debajo del mínimo.",
        },
        {
          title: "Panel de supervisión en tiempo real",
          description:
            "Un supervisor puede ver en un mapa qué empleados están activos, en qué edificio, y cuánto llevan trabajado en el día. Las alertas de inasistencia aparecen automáticamente.",
        },
      ],
    },
    results: {
      eyebrow: "Resultados",
      title: "Números reales, no estimaciones.",
      metrics: [
        {
          value: "$2.800.000",
          unit: "ARS/mes",
          label: "ahorrados en sueldo y cargas sociales al eliminar un puesto administrativo completo",
        },
        {
          value: "0",
          unit: "quejas",
          label: "por inasistencias por mes (antes eran 4-6 mensuales sin posibilidad de verificar)",
        },
        {
          value: "1",
          unit: "persona",
          label: "supervisa hoy lo que antes requería 3, con mayor visibilidad y en tiempo real",
        },
      ],
    },
    cta: {
      eyebrow: "¿Tu empresa tiene un problema similar?",
      title: "Contanos cómo trabajás y te mostramos qué podemos hacer.",
      label: "Quiero mi prototipo gratis",
      href: "/contacto",
    },
  },
};
