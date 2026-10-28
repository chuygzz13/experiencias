# Arquitectura

Página de boda para ~200 invitados con costo mensual cero y diseñada para la noche en que todos suben fotos a la vez.
Resumen visual: `08-propuesta.html` (también publicada en https://claude.ai/artifact/QrcuFwuNyra9fmCwnXM7h9).

## 1. Piezas y por qué cada una

| Capa | Servicio | Plan y límite relevante | Papel |
|---|---|---|---|
| Interfaz | React 19 + Vite, React Router, PWA | — | HTML/JS/CSS precompilados; funciona en caché sin red |
| Hosting | Cloudflare Pages | Free, ancho de banda ilimitado | Sirve la web desde la CDN |
| Lógica de servidor | Cloudflare Pages Functions (TypeScript) | Free, 100,000 solicitudes/día, 10 ms CPU por solicitud | Firma subidas, valida tokens, registra metadatos |
| Archivos | Cloudflare R2 | Free: 10 GB-mes, 1 M escrituras, 10 M lecturas, salida gratis; excedente 0.015 USD/GB-mes | Fotos, videos, audios; servido por CDN con dominio propio |
| Datos | Supabase Postgres | Free: 500 MB, pausa tras 7 días sin uso | Sólo metadatos y configuración |
| Tiempo real | Supabase Realtime | Free: 200 conexiones simultáneas, 2 M mensajes/mes | Pantalla `/tv` y panel `/admin` |
| Acceso admin | Supabase Auth (magic link) | Free | Login de 1 a 2 moderadores |
| Anti-pausa | GitHub Actions `schedule` o Worker con Cron Trigger | Free | `GET /api/keepalive` cada 3 días |
| Dominio | Registrador + DNS en Cloudflare | 300 a 500 MXN/año | `boda.<dominio>` y `media.<dominio>` |

Alternativas equivalentes: Backblaze B2 en lugar de R2 (mismo protocolo S3, 10 GB gratis); Vercel Hobby en lugar de Pages
(las funciones se portan a serverless).

## 2. Flujos principales

### 2.1 Entrada por etiqueta NFC o QR

1. El celular abre `https://boda.<dominio>/t/<token>`.
2. El frontend llama `POST /api/resolve-token`. La función verifica la firma del token (sin tocar la base), luego consulta
   `tags` y devuelve invitado o mesa, más la configuración pública (fecha, WiFi, si la galería pide PIN).
3. El resultado se guarda en `localStorage` (`guest`, `token`, `displayName`). No se vuelve a consultar en la noche.
4. Se muestra el inicio personalizado y la sugerencia "Agregar a pantalla de inicio".
5. Token inválido o inactivo: pantalla amable con buscador por nombre (sólo nombre y mesa, sin más datos).

### 2.2 Subida de fotos, video y audio

1. El invitado elige archivos (`accept="image/jpeg,image/png,video/mp4,video/quicktime"`, `multiple`). No se incluye
   `image/heic`: Safari convierte HEIC a JPEG solo si no se pide HEIC.
2. En el navegador se generan `web` (2048 px, JPEG 0.8) y `thumb` (480 px). Para video: validación de duración (≤ 90 s) y
   tamaño (≤ 50 MB), y poster frame a 480 px desde `<video>` + canvas. Para audio: blob tal cual (MP4/AAC en Safari,
   WebM/Opus en Chrome).
3. `POST /api/upload-url` con la lista de archivos (tipo, MIME, bytes, dimensiones). La función:
   - verifica token y límite de tasa (`can_upload`),
   - valida MIME y tamaño,
   - inserta filas en `media` con `status='pending'`, `uploaded=false`,
   - devuelve URLs `PUT` prefirmadas (expiran en 15 min) para `web` y `thumb`.
4. El navegador sube directo a R2 desde una cola local persistida en IndexedDB: 2 subidas simultáneas, fotos antes que
   videos, reintentos con espera exponencial, reanudación tras perder la red.
5. `POST /api/media/confirm` con los ids subidos: marca `uploaded=true` y, si `settings.auto_approve_photos` está activo y
   es foto, `status='approved'`.
6. `/admin` ve la cola de pendientes; aprobar o rechazar cambia `status`. Rechazar también borra las claves en R2.

### 2.3 Muro en vivo

`/tv` se suscribe a `postgres_changes` en `media` y `messages` (filtro `status=eq.approved`), precarga las dos imágenes
siguientes, rota cada 7 s, intercala mensajes aprobados y resultados de canciones cada N fotos, y si pierde la red sigue
rotando lo que ya tiene. Corre en una laptop con cable o hotspot propio, en Chrome a pantalla completa.

### 2.4 Álbum en celulares

Lista paginada por cursor (`created_at, id`) de 30 elementos desde la vista `media_public`; miniaturas desde
`https://media.<dominio>/thumb/<uuid>.jpg` con `Cache-Control: public, max-age=31536000, immutable`; la versión `web`
sólo al abrir el visor. Refresco al volver a la pestaña o cada 60 s. Acceso con PIN (guardado en `localStorage`) o por token.

### 2.5 Mensajes, canciones y RSVP

Escrituras vía funciones (`/api/messages`, `/api/songs`, `/api/songs/vote`, `/api/rsvp`), siempre con token. Lecturas con
anon key: `messages` aprobados, `song_rank` (vista con conteo de votos), nunca `guests` ni `rsvps`.

## 3. Diseño anti-colapso

### 3.1 Supuestos del pico

| Dato | Valor |
|---|---|
| Invitados | 200 |
| Ventana crítica | 10 min después del primer baile o del beso |
| Fotos en esa ventana (60 % × 5) | 600 fotos ≈ 0.5 MB c/u = 300 MB |
| Videos (40 % × 1 × 40 MB) | 80 videos = 3.2 GB |
| Llamadas a funciones (firmas + confirmaciones) | ≈ 1,000 (1.7 por segundo) |
| Subida que exigiría el salón si todo el video sale a la vez | ≈ 43 Mbps |

Conclusión: el backend no es el riesgo; el enlace de subida del salón sí. Por eso las fotos tienen prioridad y los videos
pueden diferirse desde `/admin`.

### 3.2 Decisiones que lo sostienen

- Archivos siempre directo navegador → R2. Funciones y Postgres sólo ven texto corto; registro por lote (una llamada por
  tanda de archivos).
- Compresión en cliente: 85 % menos tráfico antes de que exista.
- Cola local con concurrencia 2, reintentos y reanudación; nada se pierde porque el archivo sigue en el celular.
- Límite de tasa por token en Postgres (p. ej. 60 archivos por 10 min). No en KV: el plan Free de KV permite sólo
  1,000 escrituras al día.
- Realtime sólo en `/tv` y `/admin`. Los celulares paginan.
- Miniaturas de 480 px (~40 KB) servidas por CDN con caché inmutable; claves con UUID.
- Token con firma HMAC: `upload-url` puede validar sin base de datos si Supabase no responde (modo degradado: firma la
  subida, guarda un sidecar `meta/<uuid>.json` en R2 y el registro se reconcilia después).
- `/admin` con "modo fiesta": auto-aprobar fotos, "fotos ahora, videos después", contadores de subidas por minuto y errores.
- Prueba de carga dos semanas antes (200 celulares simulados, también con Supabase apagado), ensayo en el salón una semana
  antes, plan B impreso (QR a álbum compartido de Google Photos).

### 3.3 Capacidad estimada vs límites gratuitos (día completo)

| Recurso | Uso estimado | Límite gratuito | Estado |
|---|---|---|---|
| Llamadas a Pages Functions | ≈ 5,000/día | 100,000/día | Holgado |
| Escrituras en R2 | ≈ 3,000 | 1,000,000/mes | Holgado |
| Lecturas en R2 (miniaturas) | ≈ 60,000 | 10,000,000/mes | Holgado |
| Almacenamiento en R2 | 15 a 25 GB | 10 GB | Excede: ≈ 3 a 5 MXN/mes |
| Base de datos | ≈ 10 MB | 500 MB | Holgado |
| Conexiones Realtime | ≤ 5 | 200 | Holgado por diseño |
| Mensajes Realtime | ≈ 3,000 | 2,000,000/mes | Holgado |
| Salida de datos API Supabase | ≈ 50 MB | 5 GB/mes | Holgado |
| Pausa de Supabase Free | 7 días sin uso | keepalive cada 3 días | Cubierto |
| Enlace de subida del salón | hasta 43 Mbps | depende del venue | Riesgo real: se mide en sitio |

### 3.4 Qué pasa si algo falla

| Falla | Invitado | Sistema | Ustedes |
|---|---|---|---|
| Cae el WiFi del salón | Página abierta; "se enviará cuando haya señal" | Cola local, reintentos; `/tv` sigue rotando | Activar "videos después" si dura |
| Supabase no responde | Puede subir; el álbum muestra lo último cargado | Firma sin base; sidecar en R2; metadatos pendientes | Correr reconciliación al día siguiente |
| R2 no responde | Subida en espera | Cola y reintentos | Nada |
| Abuso de un token | "Espera un momento" | Límite de tasa; reportar oculta al instante | Un toque en `/admin` |
| Cola de moderación crece | La pantalla tarda | Interruptor de auto-aprobación de fotos | Activarlo |
| Cloudflare caído globalmente | Nada abre | Improbable | Sobre con QR a Google Photos |

## 4. Modelo de datos (borrador de `supabase/migrations/0001_init.sql`)

```sql
create extension if not exists pgcrypto;

create type media_kind    as enum ('photo', 'video', 'audio');
create type review_status as enum ('pending', 'approved', 'rejected');
create type tag_kind      as enum ('guest', 'table', 'spot');

create table tables (
  id        smallserial primary key,
  numero    smallint not null unique,
  nombre    text,
  capacidad smallint
);

create table guests (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  apellido   text,
  familia    text,
  table_id   smallint references tables(id),
  menu       text,
  es_menor   boolean not null default false,
  notas      text,
  created_at timestamptz not null default now()
);

create table tags (
  token      text primary key check (token ~ '^[a-z2-7]{12}$'),  -- id8 + sig4
  kind       tag_kind not null,
  guest_id   uuid references guests(id) on delete set null,
  table_id   smallint references tables(id) on delete set null,
  label      text,
  activo     boolean not null default true,
  created_at timestamptz not null default now()
);

create table rsvps (
  guest_id     uuid primary key references guests(id) on delete cascade,
  asiste       boolean,
  acompanantes smallint not null default 0,
  alergias     text,
  cancion      text,
  updated_at   timestamptz not null default now()
);

create table media (
  id           uuid primary key default gen_random_uuid(),
  guest_id     uuid references guests(id) on delete set null,
  display_name text,
  kind         media_kind not null,
  key_web      text not null,         -- web/<uuid>.jpg | video/<uuid>.mp4 | audio/<uuid>.m4a
  key_thumb    text,                  -- thumb/<uuid>.jpg (foto y poster de video)
  width        int,
  height       int,
  duration_s   int,
  bytes        int,
  uploaded     boolean not null default false,
  status       review_status not null default 'pending',
  created_at   timestamptz not null default now(),
  reviewed_at  timestamptz,
  reviewed_by  uuid
);
create index media_status_created_idx on media (status, created_at desc, id desc);
create index media_guest_idx          on media (guest_id, created_at desc);
create index media_pending_upload_idx on media (uploaded, created_at) where uploaded = false;

create table messages (
  id           uuid primary key default gen_random_uuid(),
  guest_id     uuid references guests(id) on delete set null,
  display_name text,
  texto        text,
  media_id     uuid references media(id) on delete set null,
  status       review_status not null default 'pending',
  created_at   timestamptz not null default now()
);
create index messages_status_idx on messages (status, created_at desc);

create table songs (
  id         uuid primary key default gen_random_uuid(),
  titulo     text not null,
  artista    text,
  guest_id   uuid references guests(id) on delete set null,
  status     review_status not null default 'approved',
  created_at timestamptz not null default now()
);

create table song_votes (
  song_id    uuid references songs(id) on delete cascade,
  guest_id   uuid references guests(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (song_id, guest_id)
);

create table settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);
-- claves previstas: fecha_evento, wifi {ssid, password}, pin_galeria_hash, auto_approve_photos,
-- defer_videos, textos {bienvenida, agradecimiento}, limites {files_per_10min, video_max_s, video_max_mb}

create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nombre  text
);

-- Helpers ------------------------------------------------------------------
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from admins where user_id = auth.uid()) $$;

-- Límite de tasa: archivos pedidos por un invitado en la ventana reciente.
create or replace function can_upload(p_guest uuid, p_limit int default 60, p_window interval default '10 minutes')
returns boolean language sql stable as
$$ select count(*) < p_limit from media where guest_id = p_guest and created_at > now() - p_window $$;

-- Vistas públicas ----------------------------------------------------------
create view media_public with (security_invoker = true) as
  select id, kind, key_web, key_thumb, width, height, duration_s, display_name, created_at
  from media where status = 'approved' and uploaded = true;

create view song_rank with (security_invoker = true) as
  select s.id, s.titulo, s.artista, count(v.guest_id) as votos, s.created_at
  from songs s left join song_votes v on v.song_id = s.id
  where s.status = 'approved'
  group by s.id;

-- RLS ----------------------------------------------------------------------
alter table tables     enable row level security;
alter table guests     enable row level security;
alter table tags       enable row level security;
alter table rsvps      enable row level security;
alter table media      enable row level security;
alter table messages   enable row level security;
alter table songs      enable row level security;
alter table song_votes enable row level security;
alter table settings   enable row level security;
alter table admins     enable row level security;

-- anon: sólo lectura de lo aprobado (la vista filtra); nada de guests, tags, rsvps, settings.
create policy media_read_approved    on media    for select to anon, authenticated using (status = 'approved' and uploaded);
create policy messages_read_approved on messages for select to anon, authenticated using (status = 'approved');
create policy songs_read_approved    on songs    for select to anon, authenticated using (status = 'approved');
create policy votes_read             on song_votes for select to anon, authenticated using (true);

-- admins: todo. (Las escrituras de invitados entran con service role desde Pages Functions y no pasan por RLS.)
create policy tables_admin   on tables     for all to authenticated using (is_admin()) with check (is_admin());
create policy guests_admin   on guests     for all to authenticated using (is_admin()) with check (is_admin());
create policy tags_admin     on tags       for all to authenticated using (is_admin()) with check (is_admin());
create policy rsvps_admin    on rsvps      for all to authenticated using (is_admin()) with check (is_admin());
create policy media_admin    on media      for all to authenticated using (is_admin()) with check (is_admin());
create policy messages_admin on messages   for all to authenticated using (is_admin()) with check (is_admin());
create policy songs_admin    on songs      for all to authenticated using (is_admin()) with check (is_admin());
create policy votes_admin    on song_votes for all to authenticated using (is_admin()) with check (is_admin());
create policy settings_admin on settings   for all to authenticated using (is_admin()) with check (is_admin());
create policy admins_self    on admins     for select to authenticated using (user_id = auth.uid());

-- Realtime -----------------------------------------------------------------
alter publication supabase_realtime add table media, messages, songs, song_votes;
```

Notas: las políticas de `select` para `anon` existen para que Realtime y las vistas funcionen; las escrituras de invitados
nunca usan la anon key. Revisar con los advisors de Supabase después de aplicar.

## 5. Contratos de las Pages Functions

Todas responden JSON, aceptan sólo `POST` salvo `keepalive`, y devuelven `429` cuando se excede el límite de tasa. El token
viaja en el cuerpo, nunca en la URL de la función (la URL `/t/<token>` es sólo de entrada).

| Ruta | Entrada | Salida | Reglas |
|---|---|---|---|
| `POST /api/resolve-token` | `{token}` | `{kind, guest?:{id,nombre,mesa}, table?:{numero,nombre}, settings:{fecha, wifi, pin_required}}` | Verifica `sig4` con HMAC antes de consultar; `404` si inválido o inactivo |
| `POST /api/upload-url` | `{token, files:[{kind, mime, bytes, width?, height?, duration_s?}]}` (máx. 20 por llamada) | `{uploads:[{id, put_web, put_thumb?, key_web, key_thumb?, expires_at}]}` | `can_upload`, MIME y tamaño; inserta `media` pending/uploaded=false; URLs prefirmadas S3 (aws4fetch) válidas 15 min |
| `POST /api/media/confirm` | `{token, ids:[uuid]}` | `{confirmed:[uuid], approved:[uuid]}` | Sólo ids del mismo guest; aplica `auto_approve_photos` |
| `POST /api/messages` | `{token, texto?, media_id?}` | `{id}` | Texto ≤ 500 caracteres; `media_id` debe ser audio del mismo guest |
| `POST /api/songs` | `{token, titulo, artista?}` | `{id, existed:boolean}` | Deduplica por título+artista normalizados; vota automáticamente |
| `POST /api/songs/vote` | `{token, song_id}` | `{votos}` | Idempotente (PK compuesta) |
| `POST /api/rsvp` | `{token, asiste, acompanantes, alergias?, cancion?}` | `{ok}` | Sólo tokens de tipo `guest` |
| `GET /api/keepalive` | — | `{ok, at}` | `select 1`; llamado por el cron cada 3 días |

Modo degradado de `upload-url`: si Supabase falla, la función igual firma (el token ya está verificado por HMAC) y escribe
`meta/<uuid>.json` en R2 con los metadatos; `scripts/reconcile.ts` lista `meta/` y crea las filas faltantes.

## 6. Variables de entorno

| Variable | Dónde | Uso |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | frontend | Lecturas públicas y Realtime |
| `VITE_MEDIA_BASE_URL` | frontend | `https://media.<dominio>` |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | funciones | Escrituras con service role |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | funciones | Presign S3 |
| `TOKEN_HMAC_SECRET` | funciones y script de generación de tokens | Firma `sig4` |
| `ADMIN_EMAILS` | funciones / seed | Alta de administradores |

Se versiona `.env.example` con los nombres; los valores viven en Cloudflare (Pages → Settings → Variables) y en local en
`.env` ignorado por git.

## 7. Despliegue

- Rama principal → Cloudflare Pages producción; ramas de trabajo → URL de preview automática.
- Migraciones con `supabase db push` o con el MCP de Supabase (`apply_migration`).
- Keepalive: workflow de GitHub Actions `schedule: "0 9 */3 * *"` que hace `curl https://boda.<dominio>/api/keepalive`.
- Cabeceras en `public/_headers`: CSP, `X-Frame-Options`, `Referrer-Policy`, `X-Robots-Tag: noindex`.

## 8. Qué se reutiliza del prototipo actual

| Pieza | Dónde está hoy | Destino |
|---|---|---|
| `compressImage(base64, maxWidth, quality)` | `src/App.js` | `src/lib/media.js`, extendida para `web` y `thumb` y para trabajar con `File`/`Blob` |
| `selectFromGallery` (input file dinámico) | `src/App.js` | Selector de `/subir` con `multiple` y MIME explícitos |
| `startRecording`/`stopRecording` (`MediaRecorder`) | `src/App.js` | Grabador de `/mensajes` con `isTypeSupported` |
| `capturePhoto` (`getUserMedia` + canvas) | `src/App.js` | Fase 2: cámara desechable digital |
| Grid de tarjetas | `src/ExperienciasFeed.js` | Base del grid de `/album` |
