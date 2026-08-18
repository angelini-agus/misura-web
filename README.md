# misure — Web

Sitio institucional multipágina (MPA) para **misure**, desarrollado con
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

### GA4 (analytics)

El script de Google Analytics 4 está preparado en `src/layouts/BaseLayout.astro`
y solo se incluye cuando existe la variable `PUBLIC_GA_ID`. Para activarlo,
creá un archivo `.env` en la raíz del proyecto (o setea la variable en el
deploy) con tu Measurement ID:

```bash
PUBLIC_GA_ID=G-XXXXXXXXXX
```

Sin esa variable, el sitio se compila sin analytics ni terceros. El Measurement
ID se obtiene en Google Analytics → Admin → Data Streams → tu stream → el ID
que empieza con `G-`.

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
