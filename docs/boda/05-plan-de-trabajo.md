# Plan de trabajo

Backlog por fases. Cada tarea tiene un criterio de aceptación que se verifica en un celular real antes de marcarla.
Semanas relativas al arranque de la fase 1; la fase 8 debe terminar al menos una semana antes de la boda.

## Fase 0 · Base documental (esta entrega)

- [x] Investigación con fuentes (`01-investigacion-base.md`).
- [x] Propuesta visual (`08-propuesta.html`).
- [x] Decisiones, arquitectura, mapa de módulos, plan, seguridad, diseño, skills, `CLAUDE.md`.
- [ ] Leer la bóveda de Obsidian con `/boda-obsidian` y actualizar 06 y 07.
- [ ] Resolver pendientes del dueño (ver `02-decisiones.md`): fecha y salón, dominio, R2 o B2, administradores.

## Fase 1 · Migración a Vite y despliegue vacío (semana 1)

- [ ] Quitar `react-scripts`, `expo-*`, `react-native-web`, `loader-utils`; añadir `vite`, `@vitejs/plugin-react`, `react-router-dom`, `vite-plugin-pwa`.
- [ ] Mover `public/index.html` a la raíz con metas Open Graph y `noindex`; `src/index.js` → `src/main.jsx`.
- [ ] Rescatar `compressImage`, selector de galería y grabación de audio a `src/lib/` (sin UI todavía); borrar el resto del prototipo.
- [ ] Tokens de diseño en `src/styles/tokens.css` según `07-diseno-y-tipografia.md` (paleta provisional si falta la definitiva).
- [ ] Layout base, rutas vacías de todas las pantallas, pantalla 404 amable.
- [ ] `wrangler.toml`, `public/_headers`, `.env.example`; proyecto en Cloudflare Pages conectado al repo.
- Aceptación: `npm run build` sin errores ni warnings; URL de preview abre en iPhone y Android; Lighthouse PWA instalable.

## Fase 2 · Supabase y datos (semana 1)

- [ ] Crear proyecto Supabase nuevo (Free) y aplicar `supabase/migrations/0001_init.sql` (borrador en `03-arquitectura.md`).
- [ ] Seed de prueba: 2 mesas, 5 invitados, 8 tokens (guest, table, spot).
- [ ] Alta del único administrador (correo del dueño) en `admins`; registro público desactivado en Supabase Auth; probar que el enlace mágico llega a ese correo y que otro correo no obtiene acceso.
- [ ] `functions/api/keepalive.ts` + workflow de GitHub Actions cada 3 días.
- Aceptación: advisors de Supabase sin alertas de RLS; con anon key no se pueden leer `guests`, `tags`, `rsvps` ni filas `pending`; un correo distinto al del dueño no recibe acceso a `/admin`; keepalive responde `200`.

## Fase 3 · Subida directa a R2 (semana 2)

- [ ] Bucket R2 privado, dominio público `media.<dominio>`, credenciales S3 en variables de Pages.
- [ ] `functions/lib/token.ts` (HMAC), `functions/lib/r2.ts` (presign), `functions/api/upload-url.ts`, `functions/api/media/confirm.ts`.
- [ ] `src/lib/media.js`: `web`/`thumb` para fotos, validación y poster para video, duración de audio.
- [ ] `src/lib/upload.js`: cola IndexedDB, concurrencia 2, prioridad foto > video, reintentos exponenciales, reanudación.
- [ ] Pantalla `/subir` con selector múltiple, progreso por archivo y estado de la cola.
- Aceptación: en iPhone y Android, 10 fotos (HEIC incluidas) y 1 video suben; cortar la red a mitad y recuperar no pierde nada; el límite de tasa devuelve `429` y la UI lo explica; `media` queda `uploaded=true`.

## Fase 4 · Álbum, moderación y pantalla (semanas 2 y 3)

- [ ] `/admin` con login exclusivo del dueño, cola de pendientes, aprobar/rechazar individual y en bloque, borrado en R2 al rechazar.
- [ ] `/admin/contenido`: todo el contenido de todos los invitados en cualquier estado, con filtros por estado, tipo, invitado y mesa, búsqueda y descarga individual o en ZIP.
- [ ] Interruptores de modo fiesta en `settings`: `auto_approve_photos`, `defer_videos`.
- [ ] `/album` con paginación por cursor, lightbox, PIN, filtro "mis fotos", refresco cada 60 s.
- [ ] `/tv` con Realtime, precarga, rotación de 7 s, mensajes intercalados, funcionamiento sin red.
- Aceptación: foto aprobada visible en `/tv` en < 30 s y en `/album` al refrescar; 2,000 elementos de prueba en `/album` sin tirones; `/tv` sigue rotando con la red apagada.

## Fase 5 · Tokens e invitados (semana 3)

- [ ] `/admin/invitados`: alta manual, edición en tabla, importación CSV (nombre, apellido, familia, mesa, boletos, menú, menor), vista por mesa, marca de invitación enviada y enlace de WhatsApp con la URL personal; `scripts/gen-tokens.ts` (`id8+sig4`).
- [ ] `functions/api/resolve-token.ts`; `/t/:token`; inicio personalizado con "tu mesa"; buscador por nombre de respaldo.
- [ ] `/admin/etiquetas`: hoja de QR imprimible y export `nombre,mesa,url` para grabar etiquetas; desactivar token.
- Aceptación: token de invitado saluda por nombre y mesa; token de mesa pide nombre una vez; token inválido no revela nada; QR impreso y etiqueta NFC de prueba abren la misma URL.

## Fase 6 · Libro de visitas y canciones (semana 4)

- [ ] `AudioRecorder` con `MediaRecorder`, límite 90 s, vista previa y reintento; `/mensajes` con texto o audio; modo kiosko.
- [ ] `functions/api/messages.ts`; mensajes en `/admin` y en `/tv`.
- [ ] `/canciones` con pedir y votar; `/dj` de sólo lectura con clave para el DJ; `/admin/canciones` con CSV.
- Aceptación: audio grabado en Safari iOS y Chrome Android se reproduce en ambos; voto repetido no duplica; el DJ ve el ranking en su celular.

## Fase 7 · Info, RSVP, regalos y PWA (semanas 4 y 5)

- [ ] `/info` con itinerario, mapas, hoteles, dress code, WiFi con QR; contenido en JSON editable.
- [ ] `/regalos` con mesa de regalos y CLABE/Mercado Pago con botón copiar.
- [ ] `/rsvp` por token y por nombre (acompañantes limitados a los boletos del invitado); `/admin/confirmaciones` con tablero (confirmados, no asisten, pendientes, acompañantes, total de personas, alergias), filtros por mesa y familia, recordatorio por WhatsApp a pendientes y exportación CSV.
- [ ] PWA: manifest, íconos, service worker con caché de la app (nunca de la API); aviso de privacidad en el primer uso.
- [ ] Open Graph y vista previa verificada en WhatsApp.
- Aceptación: todas las pantallas del MVP funcionan sin cuenta en ambos sistemas; "Agregar a inicio" abre como app; enlace compartido por WhatsApp muestra título, imagen y descripción.

## Fase 8 · Pruebas de campo (semana 6, mínimo una semana antes de la boda)

- [ ] `scripts/load-test.ts`: 200 clientes simulados, 600 fotos de 0.5 MB y 80 videos de 40 MB en 10 min, con red limitada. Metas: firma < 200 ms, errores < 0.5 %, foto en `/tv` < 30 s.
- [ ] Repetir la prueba con Supabase pausado a propósito; verificar modo degradado y `scripts/reconcile.ts`.
- [ ] Ensayo en el salón: 10 celulares distintos (iPhone reciente, iPhone 7/8/X, Samsung, Motorola o Xiaomi, con y sin funda); medir subida real del WiFi y cobertura celular; probar la pantalla con el cable o hotspot definitivo.
- [ ] Comprar y grabar las etiquetas (≈ 250 NTAG213); imprimir QR, letreros y QR de WiFi por mesa; preparar el sobre de plan B (QR a álbum compartido de Google Photos).
- [ ] Respaldo de la base y de la configuración; documento de operación de una página para el moderador.

## Checklist del día

- [ ] Supabase activo (keepalive esa mañana) y cuota de R2 revisada.
- [ ] Moderador con `/admin` abierto; interruptores de modo fiesta a la mano.
- [ ] Laptop para `/tv` con cable o hotspot propio, cargador, Chrome a pantalla completa, bloqueo de pantalla desactivado.
- [ ] QR de WiFi en cada mesa; 20 etiquetas de repuesto; sobre de plan B.
- [ ] Contacto del venue para la red y del DJ para `/admin/canciones`.

## Después de la boda

- [ ] `scripts/reconcile.ts` y `scripts/export-all.ts` (respaldo completo a disco).
- [ ] Fotos oficiales del fotógrafo al álbum; agradecimientos por token.
- [ ] Decidir cuánto vive la página (1 a 2 años); exportar y apagar al final; borrar datos personales.
