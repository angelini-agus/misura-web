# Capturas de pantalla

## El estándar

Toda captura que se muestre en el sitio (galería de un caso, mazo de
`/proyectos`, portada de un caso) mide **1920x1200** y es un PNG. Es 16:10, la
proporción que ya usaba la mayoría de las capturas anteriores (1440x900,
1600x1000), y deja la resolución por encima de 1080p.

Con todas en la misma medida, la galería y el mazo no cambian de tamaño al pasar
de una a otra: el carrusel mantiene el mismo marco y el mismo alto, y los casos
se leen parejos. No hay que recortar ni estirar nada en el layout porque la
uniformidad la garantizan los archivos.

## Cómo se hace una captura nueva

1. Se captura con el navegador a **1920x1200 de ventana**, con
   `reducedMotion: 'reduce'` (las animaciones ensucian el cuadro) y esperando las
   fuentes y los datos: `document.fonts.ready` más alrededor de un segundo.
2. Las secciones que no ocupan la pantalla entera también se capturan como **vista
   de 1920x1200**, con el elemento alineado arriba y el chrome fijo (navbar
   flotante, botón de WhatsApp) oculto. Así toda captura es "lo que se ve en una
   ventana de 1920x1200" y ninguna necesita recorte ni bandas: por ejemplo el
   cierre de un caso, que mide 525px de alto, se captura con lo que lo rodea.
3. Si una captura vieja no es 16:10 (1600x900, 1903x916), se normaliza **sin
   recortar**: se escala entera dentro de 1920x1200 y lo que falta se rellena con
   el color promedio del borde correspondiente de la propia imagen, así el relleno
   se lee como continuación del fondo y nunca se pierde contenido de la interfaz.

El script de normalización usa `sharp`: `resize(1920, 1200, { fit: 'inside' })` y
después `extend` con el color del borde de arriba, abajo, izquierda o derecha
según lo que falte.

## De dónde salen las capturas pediátricas

Del repo `pediatric-clinic-erp`:

```
docker compose up -d postgres
pnpm --filter @pediatric-erp/db db:migrate:deploy
pnpm --filter @pediatric-erp/db db:seed
pnpm --filter @pediatric-erp/api dev            # 3001
pnpm --filter @pediatric-erp/web exec next dev -p 3100
pnpm --filter @pediatric-erp/landing dev -- --port 4322
```

Después, un pase de captura con Playwright: el repo trae el suyo en
`apps/web/playwright.screenshots.config.ts` y sirve como referencia del flujo
(login con `ricardo.silva@pediatric-erp.com` / `admin123`, las rutas de cada
pantalla y los `data-testid` que hay que esperar). Los datos son los del seed
demo: nunca datos reales de pacientes.

Dos puertos que chocan en esta máquina: la base del repo necesita el 5432 (lo
ocupa el postgres del notes-app) y la landing asume el 4321 (lo ocupa el dev
server de misura-web). Por eso la captura se corre con la base del notes-app
detenida y la landing en 4322.
