# BottegaDevs: web institucional

Sitio institucional multipágina (MPA) para **bottega**, desarrollado con
**Astro + TypeScript + Tailwind CSS v4**.

Sitio estático con JS mínimo en cliente (reveal de animaciones, filtro de
proyectos, botón "compartir" y formulario de contacto asíncrono). Rutas:
**`/`** (Inicio), **`/nosotros`**, **`/proyectos`**, **`/contacto`**.

## Comandos

```bash
npm install
npm run dev        # dev server en background
npm run build      # build estático a dist/
npm run preview    # previsualizar el build
```

## Variables de entorno

### Web Analytics (Vercel)

El sitio mide uso con Vercel Web Analytics: analítica propia, agregada y sin
cookies, con el script servido desde el mismo dominio
(`/_vercel/insights/script.js`). La variable `PUBLIC_GA_ID` quedó obsoleta
con la salida de GA4 y ya no tiene ningún efecto.

No requiere configuración: el componente `<Analytics />` (importado de
`@vercel/analytics/astro` en `src/layouts/BaseLayout.astro`) carga el script
solo en producción.

Para ver los datos: panel de Vercel → proyecto `misura-web` → pestaña
**Analytics** → **Enable**. A partir de la siguiente deployment las visitas
quedan registradas en esa pestaña.

### Verificación en Google Search Console (GSC)

Para verificar la propiedad en GSC vas a necesitar un dominio y uno de estos
métodos:

1. **Meta tag (más rápido):** Google te da un token único (no inventarlo).
   Agregalo en el `<head>` de `src/layouts/BaseLayout.astro`:

   ```html
   <meta name="google-site-verification" content="TU_TOKEN_DE_GSC" />
   ```

2. **Archivo HTML:** descargá el archivo que te da GSC y ponelo en `public/`
   (se copia tal cual al build).

3. **DNS TXT:** cuando tengas el dominio real, un registro DNS `TXT` con el
   valor que indica GSC (sin tocar código).

## Estructura

```
src/
  components/      # un .astro por sección (+ ui/)
  layouts/         # BaseLayout.astro (shell + SEO por página)
  lib/             # content.ts (textos) y types.ts
  pages/           # index.astro, nosotros.astro, proyectos.astro, contacto.astro
  styles/          # global.css (tokens de paleta)
```

## Dirección de arte

Fondo crema `#F1E8DB`, verde oscuro `#0E3B33`, diseño plano con bordes sólidos.
Ver `AGENTS.md`.
