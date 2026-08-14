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
  announcement: "Software para PYMEs y empresas — ERP · CRM · Landing pages",
  menuLabel: "Menú",
  metaTitle: "Misura — Software para PYMEs: ERP, CRM y Landing Pages",
  metaDescription:
    "Misura diseña y desarrolla ERP, CRM y landing pages a medida para PYMEs y empresas, con soporte continuo. Ordená tus procesos y crecé con datos reales.",
  tagline: "Software que ordena tu operación y hace crecer tu negocio.",
};

export const footer = {
  navTitle: "Navegación",
  servicesTitle: "Servicios",
  tagline: "ERP · CRM · Landing pages",
};

export const nav: NavItem[] = [
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Diferenciales", href: "#diferenciales" },
  { label: "Proyectos", href: "#portfolio" },
  { label: "Preguntas", href: "#preguntas" },
  { label: "Contacto", href: "#contacto" },
];

export const headerCta: Cta = {
  label: "INICIAR PROYECTO",
  href: "#contacto",
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
  title: "Desarrollo de Software a Medida para PYMEs",
  lead:
    "Misura desarrolla ERP, CRM y landing pages a medida, alrededor de tus procesos, para ordenar tu operación y hacer crecer tu negocio con datos reales.",
  ctaPrimary: { label: "Contanos tu proyecto", href: "#contacto" },
  takeawayLabel: "TL:DR",
  takeaways: [
    "ERP, CRM y landing pages en un solo proveedor.",
    "Software construido alrededor de tus procesos reales.",
    "Soporte y mejoras continuas después del lanzamiento.",
  ],
  services: [
    { name: "ERP", href: "#erp" },
    { name: "CRM", href: "#crm" },
    { name: "Landing pages", href: "#landing" },
  ],
  cta: { label: "Ver todos los servicios", href: "#servicios" },
} satisfies {
  title: string;
  lead: string;
  ctaPrimary: Cta;
  takeawayLabel: string;
  takeaways: string[];
  services: { name: string; href: string }[];
  cta: Cta;
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
    "Tres líneas de servicio que se combinan para cubrir el día a día de tu empresa: desde la operación interna hasta cómo te mostrás al mundo.",
  subtitleLink: {
    label: "¿Tenés dudas sobre qué elegir? Ver preguntas frecuentes",
    href: "#preguntas",
  },
  items: [
    {
      id: "erp",
      name: "ERP a medida",
      description:
        "Ventas, stock, compras y facturación en una sola herramienta, construida alrededor de tus procesos y no al revés.",
    },
    {
      id: "crm",
      name: "CRM",
      description:
        "Seguimiento de clientes y oportunidades para que ninguna venta se pierda en el camino y el equipo trabaje con la misma información.",
    },
    {
      id: "landing",
      name: "Landing pages",
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
    href: "#contacto",
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
        "Integramos IA en los ERP y CRM para automatizar procesos repetitivos y agilizar el desarrollo, para que tu equipo se concentre en lo importante. [PENDIENTE: detallar casos de uso concretos]",
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
  title: "Nuestro equipo",
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
  filters: { value: string; label: string }[];
  items: {
    project: string;
    client: string;
    category: "erp" | "crm" | "landing";
    description: string;
  }[];
} = {
  eyebrow: "Portfolio",
  title: "Proyectos",
  description:
    "Estamos construyendo los primeros proyectos para mostrar. Apenas tengamos casos reales para publicar, van a aparecer acá.",
  filtersLabel: "Filtrar proyectos",
  filters: [
    { value: "todos", label: "Todos" },
    { value: "erp", label: "ERP" },
    { value: "crm", label: "CRM" },
    { value: "landing", label: "Landing Pages" },
  ],
  items: [
    {
      project: "Proyecto [PENDIENTE]",
      client: "Cliente [PENDIENTE]",
      category: "erp",
      description: "[PENDIENTE: descripción del caso y resultados]",
    },
    {
      project: "Proyecto [PENDIENTE]",
      client: "Cliente [PENDIENTE]",
      category: "crm",
      description: "[PENDIENTE: descripción del caso y resultados]",
    },
    {
      project: "Proyecto [PENDIENTE]",
      client: "Cliente [PENDIENTE]",
      category: "landing",
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
      "Desarrollamos ERP a medida, CRM y landing pages. Tres líneas que se combinan para cubrir la operación interna de tu empresa y cómo te mostrás al mundo.",
  },
  {
    question: "¿Qué incluye el ERP a medida?",
    answer:
      "Ventas, stock, compras y facturación en una sola herramienta, construida alrededor de tus procesos y no al revés. El alcance final se define según el rubro y la operación de cada empresa. [PENDIENTE: módulos y alcance por tipo de proyecto]",
  },
  {
    question: "¿Para qué sirve el CRM?",
    answer:
      "Para el seguimiento de clientes y oportunidades: que ninguna venta se pierda en el camino y que el equipo trabaje con la misma información. [PENDIENTE: funcionalidades según el proceso comercial de cada empresa]",
  },
  {
    question: "¿Qué es una landing page y para qué sirve?",
    answer:
      "Una página enfocada en un solo objetivo: convertir visitas en consultas o ventas, con diseño propio y carga rápida. Se combina con el CRM para capturar y seguir los contactos que llegan.",
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
  ctaLabel: "INICIAR PROYECTO",
  email: "[PENDIENTE: email de contacto]",
  whatsapp: "[PENDIENTE: número de WhatsApp]",
};

export const stickyCta = {
  ariaLabel: "Acción rápida",
  label: "Contanos tu proyecto",
  href: "#contacto",
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
    { value: "erp", label: "ERP" },
    { value: "crm", label: "CRM" },
    { value: "landing", label: "Landing page" },
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
};
