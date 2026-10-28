# Mapa de módulos

Cada módulo lista su ruta, piezas de código, tablas y funciones que usa, de qué depende, qué significa "listo" y su estado.
Estados: `pendiente` · `en curso` · `listo` · `fase 2`.

## Dependencias entre módulos

```
M0 Base (Vite, router, diseño, Supabase, R2)
 ├─ M1 Entrada por token ──────────────┐
 ├─ M2 Subida ──► M3 Moderación ──► M4 Muro /tv
 │                        └──────────► M5 Álbum
 ├─ M6 Libro de visitas (usa M2 para audio, M3 para aprobar)
 ├─ M7 Canciones
 ├─ M8 RSVP (usa M1)
 ├─ M9 Info y regalos
 └─ M10 Admin de invitados y etiquetas (alimenta M1)
M11 Operación: keepalive, monitoreo, reconciliación, plan B
```

---

## M0 · Base del proyecto

| Campo | Detalle |
|---|---|
| Qué incluye | Migración a Vite, React Router, layout, tokens de diseño, PWA, cliente Supabase, configuración R2, `wrangler.toml`, `.env.example`, despliegue en Pages |
| Código | `index.html`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`, `src/styles/tokens.css`, `src/lib/supabase.js`, `src/lib/guest.js` |
| Tablas / funciones | migración `0001_init.sql`; ninguna función todavía |
| Depende de | dominio, proyecto Supabase, bucket R2 |
| Listo cuando | `npm run build` limpio, URL de Pages abre en celular, `/` muestra el diseño base, tablas creadas con RLS verificado por advisors |
| Estado | pendiente |

## M1 · Entrada por token (NFC / QR)

| Campo | Detalle |
|---|---|
| Ruta | `/t/:token` → redirige a `/` |
| Código | `src/pages/Entrada.jsx`, `src/pages/Home.jsx`, `src/lib/guest.js` (lee/escribe `localStorage`), `src/lib/token.js` (formato y validación local del formato) |
| Función | `functions/api/resolve-token.ts` |
| Tablas | `tags`, `guests`, `tables`, `settings` (lectura con service role) |
| Depende de | M0, M10 (tokens generados) |
| Listo cuando | Token válido muestra nombre y mesa; token de mesa pide nombre una vez; token inválido muestra buscador; la sugerencia "Agregar a inicio" aparece en iOS y Android |
| Estado | pendiente |

## M2 · Subida de archivos

| Campo | Detalle |
|---|---|
| Ruta | `/subir` |
| Código | `src/pages/Subir.jsx`, `src/components/FilePicker.jsx`, `src/components/UploadQueue.jsx`, `src/lib/media.js` (compresión, thumbs, poster, duración), `src/lib/upload.js` (cola IndexedDB, concurrencia 2, reintentos, prioridad foto > video) |
| Función | `functions/api/upload-url.ts`, `functions/api/media/confirm.ts`, `functions/lib/r2.ts` (presign con `aws4fetch`), `functions/lib/token.ts` (HMAC) |
| Tablas | `media`, `can_upload()`, `settings.limites`, `settings.defer_videos` |
| Depende de | M0, M1 (token o nombre) |
| Librerías | `aws4fetch` (funciones); compresión propia con canvas (sin librería) |
| Listo cuando | En iPhone y Android reales: 10 fotos HEIC/JPEG y 1 video suben con progreso; apagar WiFi a mitad y volver no pierde nada; el límite de tasa responde `429` y la UI lo muestra bien; `media` tiene filas `uploaded=true` |
| Estado | pendiente |

## M3 · Moderación

| Campo | Detalle |
|---|---|
| Ruta | `/admin`, `/admin/cola` |
| Código | `src/pages/admin/Login.jsx`, `src/pages/admin/Cola.jsx`, `src/components/admin/ReviewCard.jsx`, `src/lib/admin.js` |
| Tablas | `media`, `messages` (update directo con RLS de admin), `settings` (interruptores `auto_approve_photos`, `defer_videos`) |
| Depende de | M0, M2 |
| Listo cuando | Login por magic link; cola con aprobar/rechazar en un toque y en bloque; rechazar borra en R2 (vía función `/api/admin/purge` o Supabase webhook); interruptores de modo fiesta funcionan; usable en celular |
| Estado | pendiente |

## M4 · Muro en vivo

| Campo | Detalle |
|---|---|
| Ruta | `/tv` |
| Código | `src/pages/Tv.jsx`, `src/lib/realtime.js`, `src/components/tv/Slide.jsx`, `src/components/tv/MessageSlide.jsx` |
| Tablas | `media_public`, `messages` aprobados, `song_rank`; suscripción Realtime a `media` y `messages` |
| Depende de | M0, M3 |
| Listo cuando | Foto aprobada aparece en < 30 s; rotación 7 s con precarga; sigue rotando sin red; legible a 5 m (ver 07); tecla para pausar; `?pin=` o login para abrir |
| Estado | pendiente |

## M5 · Álbum

| Campo | Detalle |
|---|---|
| Ruta | `/album`, `/album/:id` |
| Código | `src/pages/Album.jsx`, `src/components/Gallery.jsx`, `src/components/Lightbox.jsx`, `src/components/PinGate.jsx` |
| Tablas | `media_public` (paginación por cursor, 30 por página) |
| Depende de | M0, M3 |
| Listo cuando | Scroll infinito fluido con 2,000 elementos; filtro "mis fotos" por token; PIN pedido una vez; descarga individual; refresco cada 60 s sin parpadeo |
| Estado | pendiente |

## M6 · Libro de visitas (texto y audio)

| Campo | Detalle |
|---|---|
| Ruta | `/mensajes` |
| Código | `src/pages/Mensajes.jsx`, `src/components/AudioRecorder.jsx` (MediaRecorder, `isTypeSupported`, límite 90 s), `src/components/MessageList.jsx` |
| Función | `functions/api/messages.ts` (y `upload-url` para el audio) |
| Tablas | `messages`, `media` (kind `audio`) |
| Depende de | M0, M1, M2, M3 |
| Listo cuando | Grabar 20 s en Safari iOS y Chrome Android, reproducir en `/album` y `/admin`; mensaje de texto ≤ 500 caracteres; modo kiosko (ruta `/mensajes?kiosko=1` con botones grandes y reinicio automático) |
| Estado | pendiente |

## M7 · Canciones

| Campo | Detalle |
|---|---|
| Ruta | `/canciones`, `/admin/canciones` |
| Código | `src/pages/Canciones.jsx`, `src/pages/admin/Canciones.jsx` |
| Función | `functions/api/songs.ts`, `functions/api/songs/vote.ts` |
| Tablas | `songs`, `song_votes`, `song_rank` |
| Depende de | M0, M1 |
| Listo cuando | Pedir, votar y ver ranking; vista DJ ordenada por votos con exportación CSV; voto repetido no duplica |
| Estado | pendiente |

## M8 · RSVP

| Campo | Detalle |
|---|---|
| Ruta | `/rsvp` |
| Código | `src/pages/Rsvp.jsx` |
| Función | `functions/api/rsvp.ts` |
| Tablas | `rsvps`, `guests` |
| Depende de | M0, M1, M10 |
| Listo cuando | Confirmar por token de invitado; buscador por nombre como respaldo; `/admin/rsvp` con conteo y exportación |
| Estado | pendiente |

## M9 · Información y regalos

| Campo | Detalle |
|---|---|
| Ruta | `/info`, `/regalos` |
| Código | `src/pages/Info.jsx`, `src/pages/Regalos.jsx`, contenido en `src/content/*.json` editable sin tocar componentes |
| Tablas | `settings` (WiFi, textos) |
| Depende de | M0 |
| Listo cuando | Itinerario, mapas (Google Maps y Waze), hoteles, dress code, WiFi con QR, mesa de regalos, CLABE con botón copiar; vista previa correcta en WhatsApp (Open Graph) |
| Estado | pendiente |

## M10 · Admin de invitados y etiquetas

| Campo | Detalle |
|---|---|
| Ruta | `/admin/invitados`, `/admin/etiquetas` |
| Código | `src/pages/admin/Invitados.jsx`, `src/pages/admin/Etiquetas.jsx`, `scripts/gen-tokens.ts` (genera `id8+sig4`), `scripts/qr-sheet.ts` (hoja imprimible) |
| Librerías | `qrcode` (generación de QR en el navegador), `papaparse` (CSV) |
| Tablas | `guests`, `tables`, `tags` |
| Depende de | M0 |
| Listo cuando | Importar CSV de invitados y mesas; generar tokens por invitado, por mesa y por punto fijo; hoja de QR imprimible (A4/carta) y export `nombre,mesa,url` para grabar etiquetas; desactivar un token |
| Estado | pendiente |

## M11 · Operación

| Campo | Detalle |
|---|---|
| Incluye | `functions/api/keepalive.ts` + workflow programado; panel `/admin/estado` (subidas/min, errores, cola, uso de R2); `scripts/reconcile.ts` (R2 `meta/` → `media`); `scripts/load-test.ts` (200 clientes simulados); `scripts/export-all.ts` (respaldo); sobre de plan B |
| Depende de | M2, M3 |
| Listo cuando | Keepalive verificado 10 días seguidos; prueba de carga cumple metas (firma < 200 ms, errores < 0.5 %, foto en `/tv` < 30 s); reconciliación recupera filas borradas a propósito en una prueba |
| Estado | pendiente |

---

## Fase 2 (fuera del MVP)

| Módulo | Idea | Reutiliza |
|---|---|---|
| Retos fotográficos / bingo | Lista de retos; al subir se elige el reto; tablero por mesa en `/tv` | M2, M4; tabla `challenges` y columna `challenge_id` en `media` |
| Cámara desechable digital | N disparos por invitado, revelado al día siguiente | `capturePhoto` del prototipo, M2 |
| Trivia y encuestas en vivo | Preguntas desde `/admin`, resultados en `/tv` | Realtime; tablas `polls`, `poll_votes` |
| Predicciones | Se sellan y se abren en el aniversario | tabla `predictions` con `abrir_en` |
| Posts embebidos | Pegar link de Instagram/TikTok; oEmbed en función | tabla `embeds`; moderación M3 |
| "Mis fotos" por selfie | Reconocimiento facial con consentimiento | servicio externo; ver 06 |
