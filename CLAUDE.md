# Página de boda interactiva — contexto para Claude Code

## Qué es este proyecto

Repositorio `chuygzz13/experiencias`. Se va a convertir en la página web de una boda para ~200 invitados:
entrada por etiqueta NFC o QR, álbum colaborativo de fotos y videos, muro en vivo en la pantalla del salón,
libro de visitas con texto y audio, petición de canciones, RSVP, logística y mesa de regalos.
Restricción central: **costo mensual cero** (sólo dominio y etiquetas NFC).

## Estado actual

Fase 0: base documental. Todavía no hay código de la boda. `src/` es un prototipo anterior en Create React App
("feed de experiencias") del que se rescatan tres piezas: `compressImage` (src/App.js), la captura con cámara
(`getUserMedia`) y la grabación con `MediaRecorder`. El resto se reemplaza en la fase 1 (migración a Vite).

## Reglas duras (no negociables)

1. **Sin Supabase Pro ni ningún cobro mensual.** Supabase Free sólo para Postgres, Realtime y Auth del administrador.
2. **Ningún archivo pesado toca Supabase ni un servidor nuestro.** Fotos, videos y audios suben directo del navegador a
   Cloudflare R2 con URL prefirmada. Las funciones sólo firman y registran metadatos.
3. **Compresión y miniaturas en el cliente** antes de subir: `web` 2048 px / calidad 0.8 y `thumb` 480 px.
   Video máximo 90 s o 50 MB. Audio máximo 90 s.
4. **Realtime sólo en `/tv` y `/admin`.** Los celulares de invitados nunca abren canales en vivo; refrescan al entrar
   o cada 60 s con paginación por cursor (30 elementos).
5. **Tokens de etiqueta aleatorios y firmados** (`id8 + sig4`, alfabeto base32 minúsculas). Nunca nombres ni números
   consecutivos. Límite de tasa por token calculado en Postgres, no en KV.
6. **RLS activo en todas las tablas.** El rol `anon` sólo lee lo aprobado. Las escrituras de invitados pasan únicamente
   por Pages Functions con la service role. Secretos sólo en variables de entorno; nunca en el repo.
7. **Toda pantalla de invitado funciona sin cuenta y sin app**, en iPhone y Android, con una mano, y degrada bien sin red
   (cola local de subida, página en caché).
8. **Nada aparece en `/tv` ni en `/album` sin estado `approved`.**
9. **Un solo administrador: el dueño.** Supabase Auth con registro público desactivado y lista blanca de un correo
   (`ADMIN_EMAIL`); `admins` tiene una fila. Sólo él ve el contenido completo, la lista de invitados y las confirmaciones.
   El DJ usa `/dj` de sólo lectura con clave; la pantalla `/tv` usa su propia clave.

## Stack y servicios

| Capa | Herramienta | Plan |
|---|---|---|
| Frontend | React 19 + Vite, React Router, PWA (`vite-plugin-pwa`) | — |
| Hosting y funciones | Cloudflare Pages + Pages Functions (TypeScript) | Free |
| Archivos | Cloudflare R2, dominio público `media.<dominio>` | Free hasta 10 GB |
| Datos, tiempo real, auth del dueño | Supabase (Postgres, Realtime, Auth magic link sin registro público) | Free |
| Anti-pausa de Supabase | GitHub Actions programado o Worker con cron, cada 3 días | Free |

Detalle completo en `docs/boda/03-arquitectura.md`.

## Estructura objetivo del repo (tras la fase 1)

```
index.html                 vite.config.js            wrangler.toml
src/main.jsx               src/pages/                src/components/
src/lib/{supabase,guest,media,upload,realtime}.js
functions/api/{resolve-token,upload-url,media,messages,songs,rsvp,keepalive}.ts   functions/api/admin/purge.ts
supabase/migrations/0001_init.sql
docs/boda/                 .claude/skills/
```

## Comandos

- Hoy (prototipo CRA): `npm start`, `npm run build`.
- Tras la fase 1: `npm run dev`, `npm run build`, `npm run preview`, `npx wrangler pages dev dist`,
  `npx supabase db push` (o aplicar migraciones con el MCP de Supabase).

## Convenciones

- Textos de interfaz y documentación en español de México, tuteando al invitado. Mensajes de commit en inglés, cortos, en imperativo.
- Accesibilidad por defecto: tipografía base de 17 px, botones de al menos 48 px, contraste AA, `prefers-reduced-motion` respetado.
- Nunca `alert()`, `confirm()` ni `prompt()`: confirmaciones dentro de la interfaz.
- Cada tarea del backlog (`docs/boda/05-plan-de-trabajo.md`) termina con su verificación en un celular real.
- No crear pull requests salvo que se pida. Trabajar en la rama que indique la sesión.

## Documentación (leer en este orden antes de tocar código)

1. `docs/boda/02-decisiones.md` — qué ya se decidió y qué sigue pendiente.
2. `docs/boda/03-arquitectura.md` — servicios, flujos, diseño anti-colapso, modelo de datos, contratos de funciones.
3. `docs/boda/04-mapa-de-modulos.md` — qué compone cada módulo y de qué depende.
4. `docs/boda/05-plan-de-trabajo.md` — backlog por fases con criterios de aceptación.
5. `docs/boda/06-seguridad-y-privacidad.md` y `docs/boda/07-diseno-y-tipografia.md` — guías transversales.
6. `docs/boda/01-investigacion-base.md` — la investigación original con fuentes (NFC, redes sociales, costos).
7. `docs/boda/08-propuesta.html` — la propuesta visual presentada al dueño del proyecto.

La skill `/boda-contexto` resume este orden y las reglas duras.

## Bóveda de Obsidian del dueño del proyecto

Tiene una bóveda local con notas sobre creación, diseño y desarrollo web, tipografías, estructura, seguridad y
mapeo de módulos. **Antes de definir el diseño visual, la tipografía o la seguridad, ejecuta la skill `/boda-obsidian`.**

- Ruta de la bóveda: variable de entorno `OBSIDIAN_VAULT_PATH`, o arrancar Claude Code con
  `claude --add-dir "/ruta/a/la/boveda"`. Si no hay ruta disponible, pregunta antes de asumir.
- La síntesis va a `docs/boda/09-notas-obsidian.md` citando las notas de origen. Nunca copies datos personales
  (nombres completos de invitados, teléfonos, contraseñas) de la bóveda al repo.
- Lo encontrado complementa las decisiones de `02-decisiones.md`; si las contradice, se propone el cambio, no se impone.

## Qué no hacer

- No migrar a Next.js ni añadir Expo o `react-native-web` (se eliminan en la fase 1).
- No usar Cloudflare KV para contadores o límites de tasa (el plan Free permite 1,000 escrituras al día).
- No mostrar contenido pendiente o rechazado fuera de `/admin`.
- No dar de alta más administradores ni habilitar el registro público en Supabase Auth sin una decisión nueva en
  `docs/boda/02-decisiones.md`.
- No añadir dependencias pesadas al bundle de invitado sin justificarlo en `04-mapa-de-modulos.md`.
