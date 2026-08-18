# Home Restructure

## Objetivo
Reestructurar la home de misure debajo del Hero existente para mejorar la
conversión: primero prueba social concreta, luego propuesta de valor,
calificación del cliente, diferenciales hechos, FAQ, navegación secundaria,
equipo y formulario final.

## Criterios de aceptación
- El Hero (`Hero.astro`) no se toca bajo ningún concepto
- El orden de secciones es exactamente: Hero → Clients → Services → ForWho →
  Differentiators → FAQ → Explore → Team → Contact
- `Clients` muestra el caso real de la empresa de limpieza con métricas
  destacadas, no logos placeholder
- `Services` describe resultados del cliente, no etiquetas técnicas
- Nueva sección `ForWho` con dos columnas: "Es para vos si" / "No es para vos si"
- `Differentiators` reemplaza "Inteligencia Artificial" por "Cumplimiento de
  plazos garantizado por contrato"; los otros 3 son hechos concretos sin adjetivos
- `FAQ` incluye las 2 nuevas preguntas y la de precio tiene rangos reales
- `Explore` reutiliza el diseño existente con contenido nuevo: Prototipo gratis /
  Caso real / Precios sin letra chica
- `Team` aparece con placeholders [PENDIENTE] (datos reales se completan después)
- `Contact` muestra formulario de 4 campos: Nombre, Empresa, Email, Teléfono
  (todos requeridos excepto Empresa). El form completo sigue en /contacto
- 0 colores hardcodeados — solo tokens de `global.css`
- 0 JS del lado del cliente agregado (salvo el ya existente en ContactForm)
- Todo el copy en `content.ts`, nada hardcodeado en .astro

## Restricciones
- No inventar datos reales (socios, clientes con nombre, etc.)
- No agregar dependencias nuevas
- No romper animaciones `data-reveal`
- No modificar páginas /nosotros, /proyectos, /contacto
- El CTA del caso de limpieza linkea a `/proyectos/empresa-limpieza-rosario`
  (página que se creará en una tarea futura)

## Plan de implementación
1. Agregar tipo `ForWhoSection` en `types.ts`
2. Actualizar `content.ts`: clients, services, forWho (nuevo), differentiators,
   faq (2 preguntas), explore (contenido nuevo), contactForm (teléfono)
3. Crear `ForWho.astro`
4. Modificar `ContactForm.astro`: prop `simple`, campo teléfono
5. Modificar `index.astro`: nuevo orden de secciones
6. Crear/actualizar `Contact.astro` no necesario — se usa con `<ContactForm simple />`

## Verificación
- `npm run build` sin errores
- Revisar en dev: orden visual, animaciones, form de 4 campos
- Confirmar que /contacto sigue mostrando form completo sin cambios
