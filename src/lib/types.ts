export type NavItem = {
  label: string;
  href: string;
};

export type Cta = {
  label: string;
  href: string;
};

export type Service = {
  id: "erp" | "crm" | "landing";
  name: string;
  description: string;
};

export type Differentiator = {
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ContactInfo = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  email: string;
  whatsapp: string;
};
