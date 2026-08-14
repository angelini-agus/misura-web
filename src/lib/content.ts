import type {
  ContactInfo,
  Cta,
  Differentiator,
  FaqItem,
  NavItem,
  Service,
} from "./types";

export const isPending = (value: string) => value.includes("[PENDIENTE");

export const hasRealAnswer = (value: string) =>
  value.replace(/\[PENDIENTE:[^\]]*\]/g, "").trim().length > 0;

export const cleanAnswer = (value: string) =>
  value.replace(/\[PENDIENTE:[^\]]*\]/g, "").trim();

export const site = {
  name: "Misura",
  url: "[PENDIENTE: dominio de producción]",
  announcement:
    "Software a medida para PYMEs y empresas — Gestión, Ventas y Páginas Web con IA",
  menuLabel: "Menú",
  metaTitle: "Misura — Software para PYMEs y empresas: Gestión, Ventas y Páginas Web con IA a medida",
  metaDescription:
    "Misura diseña y desarrolla sistemas de gestión, herramientas de ventas y páginas web a medida para PYMEs y empresas, con soporte continuo. Ordená tus procesos y crecé con datos reales.",
  tagline: "Software a medida para que tu empresa funcione mejor.",
};

export const footer = {
  navTitle: "Navegación",
  servicesTitle: "Servicios",
  tagline: "Desarrollado por Misura",
};

export const nav: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Contacto", href: "/contacto" },
];

export const headerCta: Cta = {
  label: "Iniciar proyecto",
  href: "/contacto",
};

export const pages = {
  home: { title: site.metaTitle, description: site.metaDescription },
  nosotros: {
    title: "Nosotros — Misura",
    description:
      "Conocé a las personas detrás de Misura: desarrollo de sistemas de gestión, herramientas de ventas y páginas web con IA a medida para PYMEs.",
  },
  proyectos: {
    title: "Proyectos — Misura",
    description:
      "Casos de éxito de Misura: proyectos de sistemas de gestión, herramientas de ventas y páginas web con IA a medida para PYMEs.",
  },
  contacto: {
    title: "Contacto — Misura",
    description:
      "Contanos en qué etapa está tu negocio y empecemos un proyecto de software a medida con Misura: Gestión, Ventas y Páginas Web con IA.",
  },
};

export const clients = {
  eyebrow: "Clientes",
  title: "Empresas que ya confían en nosotros",
  description: "[PENDIENTE: logos reales y menciones de clientes]",
  items: [
    { name: "[PENDIENTE]" },
    { name: "[PENDIENTE]" },
    { name: "[PENDIENTE]" },
    { name: "[PENDIENTE]" },
  ],
};

export const explore = {
  eyebrow: "Explorá Misura",
  title: "Conocé más sobre nosotros",
  description:
    "Mirá quiénes desarrollan los sistemas, conocé los proyectos en curso y contanos cómo podemos ayudarte.",
  items: [
    {
      title: "Nosotros",
      description:
        "Las personas que desarrollan cada sistema de gestión, herramienta de ventas y página web.",
      href: "/nosotros",
      cta: "Conocenos",
    },
    {
      title: "Proyectos",
      description: "Casos de éxito de software a medida para PYMEs.",
      href: "/proyectos",
      cta: "Ver proyectos",
    },
    {
      title: "Tu proyecto",
      description:
        "Empezá a digitalizar tu empresa con un sistema hecho a tu medida.",
      href: "/contacto",
      cta: "Iniciar proyecto",
    },
  ],
};

export const about: {
  eyebrow: string;
  title: string;
  body: string;
} = {
  eyebrow: "Misura",
  title: "Quiénes somos",
  body: "[PENDIENTE: texto real de la empresa]",
};

export const hero = {
  title: "Software a medida para que tu empresa funcione mejor.",
  lead:
    "En Misura desarrollamos software específico y 100% personalizado para tu empresa: sistemas de gestión, herramientas de ventas y páginas web, potenciados con Inteligencia Artificial para automatizar y optimizar tus procesos.",
  ctaPrimary: { label: "Iniciar proyecto", href: "/contacto" },
  ctaSecondary: { label: "Ver proyectos", href: "/proyectos" },
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
    "Desarrollamos software específico y 100% personalizado para tu empresa, potenciado con Inteligencia Artificial para automatizar y optimizar tus procesos.",
  subtitleLink: {
    label: "¿Tenés dudas sobre qué elegir? Ver preguntas frecuentes",
    href: "#preguntas",
  },
  items: [
    {
      id: "erp",
      name: "Sistemas de Gestión (ERP)",
      description:
        "Ventas, stock, compras y facturación en una sola herramienta, construida alrededor de tus procesos y no al revés.",
    },
    {
      id: "crm",
      name: "Herramientas de Ventas (CRM)",
      description:
        "Seguimiento de clientes y oportunidades para que ninguna venta se pierda en el camino y el equipo trabaje con la misma información.",
    },
    {
      id: "landing",
      name: "Páginas Web",
      description:
        "Páginas enfocadas en un solo objetivo: convertir visitas en consultas o ventas, con diseño propio y carga rápida.",
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
    "Cuatro razones concretas para elegirnos, sin vueltas y sin prometer lo que no podemos cumplir.",
  subtitleLink: {
    label: "¿Te interesa? Contanos tu caso",
    href: "/contacto",
  },
  items: [
    {
      title: "Desarrollo a medida",
      description:
        "Cada pieza se construye alrededor de tus procesos reales, y no al revés. Nada de adaptar tu negocio a un sistema rígido.",
    },
    {
      title: "Soporte continuo",
      description:
        "El software no termina el día del lanzamiento. Nos quedamos al lado del negocio con soporte, mejoras y mantenimiento.",
    },
    {
      title: "Stack moderno",
      description:
        "Tecnología actual y buenas prácticas de la industria para que tu inversión siga sirviendo y no quede vieja en dos años.",
    },
    {
      title: "Inteligencia Artificial",
      description:
        "Integramos Inteligencia Artificial en los sistemas de gestión y herramientas de ventas para automatizar procesos repetitivos y agilizar el desarrollo, para que tu equipo se concentre en lo importante. [PENDIENTE: detallar casos de uso concretos]",
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
  eyebrow: "Nosotros",
  title: "Nosotros",
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
  items: {
    project: string;
    client: string;
    category: "erp" | "crm" | "landing";
    technologies: string[];
    description: string;
  }[];
} = {
  eyebrow: "Portfolio",
  title: "Proyectos",
  description:
    "Estamos construyendo los primeros proyectos para mostrar. Apenas tengamos casos reales para publicar, van a aparecer acá.",
  filtersLabel: "Filtrar proyectos",
  detailsLabel: "Ver especificaciones",
  filters: [
    { value: "todos", label: "Todos" },
    { value: "erp", label: "Gestión (ERP)" },
    { value: "crm", label: "Ventas (CRM)" },
    { value: "landing", label: "Páginas Web" },
  ],
  items: [
    {
      project: "Proyecto [PENDIENTE]",
      client: "Cliente [PENDIENTE]",
      category: "erp",
      technologies: ["Node.js", "TypeScript", "SQL"],
      description: "[PENDIENTE: descripción del caso y resultados]",
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
      technologies: ["Next.js", "React", "TypeScript"],
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
    question: "¿Qué servicios ofrece Misura?",
    answer:
      "Desarrollamos sistemas de gestión (ERP), herramientas de ventas (CRM) y páginas web con IA. Tres líneas que se combinan para cubrir la operación interna de tu empresa y cómo te mostrás al mundo.",
  },
  {
    question: "¿Qué incluye un sistema de gestión (ERP)?",
    answer:
      "Ventas, stock, compras y facturación en una sola herramienta, construida alrededor de tus procesos y no al revés. El alcance final se define según el rubro y la operación de cada empresa. [PENDIENTE: módulos y alcance por tipo de proyecto]",
  },
  {
    question: "¿Para qué sirve una herramienta de ventas (CRM)?",
    answer:
      "Para el seguimiento de clientes y oportunidades: que ninguna venta se pierda en el camino y que el equipo trabaje con la misma información. [PENDIENTE: funcionalidades según el proceso comercial de cada empresa]",
  },
  {
    question: "¿Qué es una página web de conversión y para qué sirve?",
    answer:
      "Una página enfocada en un solo objetivo: convertir visitas en consultas o ventas, con diseño propio y carga rápida. Se combina con las herramientas de ventas para capturar y seguir los contactos que llegan.",
  },
  {
    question: "¿Cuánto cuesta un proyecto?",
    answer: "[PENDIENTE: definir presupuestos por tipo y alcance de proyecto]",
  },
  {
    question: "¿Qué pasa después del lanzamiento?",
    answer:
      "El software no termina cuando se publica. Ofrecemos soporte, mantenimiento y mejoras continuas para que siga acompañando el negocio.",
  },
];

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
    service: "Servicio de interés",
    message: "Mensaje",
  },
  placeholders: {
    name: "Tu nombre",
    company: "Tu empresa",
    email: "tucorreo@empresa.com",
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
