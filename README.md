# Misura — Web

Sitio institucional de una sola página para **Misura**, desarrollado con
**Astro + TypeScript + Tailwind CSS v4**.

Landing estática (0 JS en cliente) con secciones ancladas para las tres líneas de
servicio: **ERP, CRM y Landing pages**.

## Comandos

```bash
npm install
npm run dev        # dev server en background
npm run build      # build estático a dist/
npm run preview    # previsualizar el build
```

## Estructura

```
src/
  components/      # un .astro por sección (+ ui/)
  layouts/         # BaseLayout.astro (SEO)
  lib/             # content.ts (textos) y types.ts
  pages/           # index.astro
  styles/          # global.css (tokens de paleta)
```

## Dirección de arte

Fondo crema `#F6EFE8`, verde oscuro `#0E3B33`, diseño plano con bordes sólidos.
Ver `AGENTS.md`.
