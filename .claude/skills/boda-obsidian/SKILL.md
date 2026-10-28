---
name: boda-obsidian
description: Lee la bóveda de Obsidian del dueño del proyecto (notas sobre diseño y desarrollo web, tipografía, estructura, seguridad, módulos) y sintetiza lo útil para la página de boda en docs/boda/09-notas-obsidian.md, proponiendo actualizaciones a las guías de diseño y seguridad. Úsala antes de definir diseño visual, tipografía o seguridad, o cuando el usuario mencione su bóveda, sus notas o su "red neuronal" de Obsidian.
---

# Leer la bóveda de Obsidian e incorporarla al proyecto

## Cuándo

- Antes de fijar la paleta, la tipografía o los tokens de diseño (fase 1).
- Antes de cerrar la guía de seguridad (06) o la de diseño (07).
- Cuando el usuario diga "mi bóveda", "mis notas", "Obsidian" o "mi red neuronal".

## Paso 1 · Localizar la bóveda

1. Si existe la variable de entorno `OBSIDIAN_VAULT_PATH`, úsala.
2. Si la sesión se abrió con `claude --add-dir <ruta>`, esa carpeta adicional es la bóveda.
3. Si no, pregunta al usuario la ruta. No la adivines ni busques por todo el disco.
4. Confirma que es una bóveda: debe existir la carpeta `.obsidian/` en la raíz. Si no existe, pregunta antes de seguir.

## Paso 2 · Qué buscar

Busca (sin distinguir mayúsculas, en español e inglés) en archivos `.md` y en los frontmatter/tags:

| Tema | Términos |
|---|---|
| Diseño web y UI/UX | diseño web, web design, UI, UX, landing, layout, estructura, wireframe, componentes, design system, tokens |
| Tipografía | tipografía, typography, fuente, font, Google Fonts, serif, sans, jerarquía, escala tipográfica, legibilidad |
| Color y estética | paleta, color, contraste, estética, moodboard, referencias, inspiración, boda, wedding |
| Desarrollo | React, Vite, Supabase, Cloudflare, PWA, arquitectura, módulos, mapeo, estructura de carpetas, buenas prácticas |
| Seguridad | seguridad, security, OWASP, RLS, autenticación, tokens, secretos, CSP, privacidad, LFPDPPP |
| Boda | invitados, mesas, proveedores, salón, itinerario, playlist, fotógrafo, DJ |

Usa `rg -il` para listar notas candidatas y luego lee las más relevantes completas. Sigue los `[[wikilinks]]` un nivel desde
las notas relevantes. Ignora adjuntos binarios, plantillas vacías y notas diarias sin relación.

## Paso 3 · Sintetizar

Escribe `docs/boda/09-notas-obsidian.md` con esta estructura:

```
# Notas de la bóveda aplicables a la página de boda
Fecha · ruta de la bóveda (sin datos personales) · notas revisadas: N

## Diseño y estructura        ← reglas, patrones, referencias; cada punto cita [[nota]] o ruta
## Tipografía                 ← familias preferidas/descartadas, escalas, parejas
## Color y estética           ← paletas, moodboards, referencias de bodas
## Desarrollo y módulos       ← convenciones, estructura de carpetas, librerías que ya usa
## Seguridad y privacidad     ← controles, listas, plantillas
## Datos de la boda           ← SÓLO si existen: invitados, mesas, proveedores (ver reglas abajo)
## Contradicciones con las decisiones actuales
## Qué no se encontró
```

Cada punto termina con la cita a la nota de origen (`[[Nombre de la nota]]` o ruta relativa dentro de la bóveda) para que el
dueño pueda ir a verla.

## Paso 4 · Proponer cambios

- Añade los hallazgos a las secciones "Completar desde la bóveda de Obsidian" de `docs/boda/07-diseno-y-tipografia.md` y
  `docs/boda/06-seguridad-y-privacidad.md`. Si afectan arquitectura o módulos, también a 03 y 04.
- Si un hallazgo contradice una decisión de `docs/boda/02-decisiones.md`, no la cambies: anótalo en "Contradicciones" y
  pregunta al usuario. Si decide cambiar, se añade una nueva entrada D-nn en 02.
- Si la bóveda tiene paleta o tipografías definidas para la boda, propón los tokens concretos en 07 (sección 3 y 4) y marca
  la opción tipográfica elegida.

## Reglas

- **Nunca copies datos personales al repo:** nombres completos de invitados, teléfonos, correos, direcciones, montos,
  contraseñas, CLABE. Si la bóveda tiene la lista de invitados, dilo y propón importarla directamente a Supabase desde
  `/admin/invitados` en la fase 5, sin pasar por git.
- No modifiques la bóveda. Sólo lectura.
- Resume con tus palabras; cita, no pegues notas enteras.
- Si la bóveda es grande, limita la primera pasada a las 30 notas más relevantes y dilo en "Qué no se encontró".

## Entrega

Termina con un resumen de 5 líneas: cuántas notas se revisaron, los 3 hallazgos que más cambian el proyecto, las
contradicciones detectadas y qué decisión necesitas del usuario.
