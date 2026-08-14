import type {
  ContactInfo,
  Cta,
  Differentiator,
  FaqItem,
  NavItem,
  Service,
} from "./types";

export const isPending = (value: string) => value.includes("[PENDIENTE");

export const site = {
  name: "Misura",
  url: "[PENDIENTE: dominio de producción]",
  announcement: "Software a medida para PYMEs y empresas — ERP · CRM · Landing pages",
  menuLabel: "Menú",
  metaTitle: "Misura — Software para PYMEs y empresas",
  metaDescription:
    "Misura diseña y desarrolla ERP, CRM y landing pages para PYMEs y empresas que quieren ordenar sus procesos y crecer con datos reales.",
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
  services: [
    { name: "ERP", href: "#erp" },
    { name: "CRM", href: "#crm" },
    { name: "Landing pages", href: "#landing" },
  ],
  cta: { label: "Ver todos los servicios", href: "#servicios" },
} satisfies {
  title: string;
  services: { name: string; href: string }[];
  cta: Cta;
};

export const services: {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: Service[];
} = {
  eyebrow: "Servicios",
  title: "Lo que hacemos",
  subtitle:
    "Tres líneas de servicio que se combinan para cubrir el día a día de tu empresa: desde la operación interna hasta cómo te mostrás al mundo.",
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
  items: Differentiator[];
} = {
  eyebrow: "Diferenciales",
  title: "Qué nos hace distintos",
  subtitle:
    "Tres razones concretas para elegirnos, sin vueltas y sin prometer lo que no podemos cumplir.",
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
  ],
};

export const portfolio: {
  eyebrow: string;
  title: string;
  description: string;
  items: {
    project: string;
    client: string;
    description: string;
  }[];
} = {
  eyebrow: "Portfolio",
  title: "Proyectos",
  description:
    "Estamos construyendo los primeros proyectos para mostrar. Apenas tengamos casos reales para publicar, van a aparecer acá.",
  items: [
    {
      project: "Proyecto [PENDIENTE]",
      client: "Cliente [PENDIENTE]",
      description: "[PENDIENTE: descripción del caso y resultados]",
    },
    {
      project: "Proyecto [PENDIENTE]",
      client: "Cliente [PENDIENTE]",
      description: "[PENDIENTE: descripción del caso y resultados]",
    },
    {
      project: "Proyecto [PENDIENTE]",
      client: "Cliente [PENDIENTE]",
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
    question: "¿Cuánto cuesta un proyecto?",
    answer: "[PENDIENTE: definir presupuestos por tipo y alcance de proyecto]",
  },
  {
    question: "¿Cuánto tarda el desarrollo?",
    answer: "[PENDIENTE: definir tiempos estándar por tipo de proyecto]",
  },
  {
    question: "¿Trabajan con empresas de mi rubro?",
    answer:
      "Sí: hoy el foco está en PYMEs de comercio y servicios. [PENDIENTE: ampliar rubros y referencias reales]",
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
