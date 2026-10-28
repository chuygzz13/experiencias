# Seguridad y privacidad

Guía transversal. Complementa `03-arquitectura.md` (RLS y contratos) y se enriquece con las notas de la bóveda de Obsidian
(ver sección final). Principio: el invitado no tiene cuenta, así que la seguridad vive en los tokens, en las funciones y en
las políticas de la base, no en el navegador.

## 1. Modelo de amenazas (realista para una boda)

| Amenaza | Probabilidad | Impacto | Control principal |
|---|---|---|---|
| Alguien adivina o comparte una URL y sube contenido inapropiado | Media | Medio | Tokens no adivinables, moderación, reportar, límite de tasa |
| Un token se filtra en redes y entra gente ajena | Baja | Medio | Desactivar token desde `/admin`; galería con PIN |
| Fuga de la lista de invitados (nombres, mesas, alergias) | Baja | Alto | Sin lectura `anon` de `guests`/`rsvps`; `resolve-token` devuelve lo mínimo |
| Exposición de fotos de menores o de quien no quiere aparecer | Media | Alto | Moderación, `noindex`, PIN, borrado a petición, retención |
| Abuso que agote cuotas gratuitas | Baja | Medio | Límite de tasa, tamaño máximo, MIME permitidos |
| Secretos commiteados o expuestos en el frontend | Media (error humano) | Alto | `.env` ignorado, service role sólo en funciones, revisión antes de cada commit |
| Panel de admin accesible sin login | Baja | Alto | Auth magic link + tabla `admins` + RLS `is_admin()` |

## 2. Tokens de etiqueta

- Formato: 12 caracteres en alfabeto base32 minúsculas (`a-z2-7`): `id8` aleatorio (40 bits) + `sig4` = primeros 4
  caracteres de `base32(HMAC-SHA256(TOKEN_HMAC_SECRET, id8))`.
- La firma permite rechazar basura antes de tocar la base y seguir firmando subidas si Supabase no responde.
- Generación sólo con `scripts/gen-tokens.ts` usando `crypto.getRandomValues`. Nunca derivados de nombres ni consecutivos.
- Cada token tiene `activo`; desactivar es inmediato. Los tokens de mesa y de punto fijo no identifican persona.
- La URL `/t/<token>` sólo se usa para entrar; después el token viaja en el cuerpo de las peticiones `POST`, no en query strings
  (evita que quede en logs y en el historial).

## 3. Funciones (Pages Functions)

- Sólo `POST` con `Content-Type: application/json` y cuerpo ≤ 64 KB; `GET` únicamente en `keepalive`.
- Validar siempre: formato del token, firma, `activo`, tipo de token permitido para la acción, longitud de textos, MIME de una
  lista cerrada (`image/jpeg`, `image/png`, `video/mp4`, `video/quicktime`, `audio/mp4`, `audio/webm`), tamaño máximo por tipo.
- Límite de tasa con `can_upload()` en Postgres (60 archivos por 10 min por token; 20 mensajes/h; 30 votos/h). Respuesta
  `429` con `Retry-After`.
- URLs prefirmadas con expiración de 15 minutos, clave fija por archivo (`web/<uuid>.jpg`), método `PUT` y `Content-Type`
  obligatorio en la firma para que no se pueda subir otro tipo de contenido.
- La service role key sólo existe en variables de Pages Functions. El frontend sólo conoce la anon key.
- CORS: sólo el origen de la boda. Sin `*`.
- Registrar en log (sin datos personales) los `4xx/5xx` para el panel de estado.

## 4. Base de datos

- RLS activo en todas las tablas (ver SQL en 03). `anon` sólo lee aprobados; nunca `guests`, `tags`, `rsvps`, `settings`.
- Vistas con `security_invoker = true` para que respeten RLS.
- `is_admin()` como `security definer` con `search_path` fijado.
- Pasar los advisors de seguridad de Supabase después de cada migración y antes de la boda.
- Sin datos sensibles más allá de lo necesario: no se guardan teléfonos ni correos de invitados en el MVP. Alergias y menú
  sólo si el RSVP los pide, y sólo legibles por admins.

## 5. Archivos (R2)

- Bucket privado; acceso público sólo a través del dominio `media.<dominio>` para las claves `web/`, `thumb/`, `video/`,
  `audio/`. Las claves llevan UUID v4: no se pueden enumerar ni adivinar. El prefijo `meta/` no se expone.
- Al rechazar, se borra el objeto, no sólo la fila.
- `Cache-Control: public, max-age=31536000, immutable` para `thumb/` y `web/`; los rechazados se borran, así que la caché no
  sirve contenido retirado más allá del borde de la CDN (purga manual disponible).
- Sin listado público del bucket; sin credenciales S3 en el frontend.

## 6. Panel de administración

- Login con magic link de Supabase Auth; sólo correos listados en `ADMIN_EMAILS` se dan de alta en `admins`.
- Rutas `/admin/*` verifican sesión y `is_admin()`; sin sesión redirigen al login sin revelar nada.
- Sesiones cortas en el celular del moderador (cerrar sesión al terminar la noche).
- Acciones destructivas (borrar en bloque, desactivar todos los tokens) con confirmación dentro de la interfaz.

## 7. Frontend

- Cabeceras en `public/_headers`:
  `Content-Security-Policy` (scripts propios, conexiones a Supabase, R2 y el propio dominio; sin `unsafe-inline` en scripts),
  `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`,
  `X-Robots-Tag: noindex, nofollow`, `Permissions-Policy` mínima (cámara y micrófono sólo `self`).
- `noindex` también en el HTML y sin sitemap.
- `localStorage` guarda sólo: token, nombre a mostrar, PIN de galería (hash no, el PIN mismo es de baja sensibilidad; aun así
  se borra al cerrar sesión de admin) y preferencias. Nada más.
- Service worker: cachea la app, nunca respuestas de la API ni imágenes pendientes.
- Dependencias: pocas, fijadas en versión, revisadas con `npm audit` antes de cada despliegue.

## 8. Secretos y repositorio

- `.env` y `.env.*` ignorados; `.env.example` con nombres y sin valores.
- Service role, secreto HMAC y credenciales R2 sólo en Cloudflare (variables cifradas) y en el `.env` local.
- Antes de cada commit: buscar `eyJ`, `sk_`, `AKIA`, `supabase.co` con claves, `SECRET=`.
- Rotar `TOKEN_HMAC_SECRET` invalida todas las etiquetas: sólo antes de grabarlas.

## 9. Privacidad (LFPDPPP y sentido común)

- Aviso de privacidad corto en el primer uso: qué se guarda (fotos, mensajes, nombre), quién lo ve (invitados con PIN y los
  novios), cuánto tiempo (1 a 2 años), cómo pedir borrado (correo de contacto).
- Menores: el campo `es_menor` permite excluir de la pantalla `/tv` fotos etiquetadas con ese invitado en fase 2; en el MVP,
  la moderación humana cuida esto.
- Botón "reportar" en cada elemento; el contenido reportado se oculta al instante y queda para revisión.
- Derecho de borrado: desde `/admin` por elemento o por invitado (todo lo que subió y donde aparece etiquetado en fase 2).
- Reconocimiento facial (fase 2, opcional): sólo con consentimiento explícito por invitado, selfie borrada tras la búsqueda,
  proveedor con política clara; es dato biométrico y merece una decisión aparte.
- Retención: fecha de apagado definida en `settings.retencion_hasta`; exportación completa a disco antes de borrar; purga de
  `guests`, `rsvps`, `tags` y objetos en R2.

## 10. Lista de verificación antes de la boda

- [ ] Advisors de Supabase sin alertas.
- [ ] Prueba con anon key: no se leen `guests`, `tags`, `rsvps`, `settings` ni filas `pending`.
- [ ] Token inválido, expirado y desactivado responden `404` sin información.
- [ ] `429` al superar el límite de tasa; la UI lo explica.
- [ ] PUT prefirmado con otro `Content-Type` es rechazado por R2.
- [ ] Cabeceras verificadas con un escáner de cabeceras HTTP; CSP sin errores en consola.
- [ ] `/admin` sin sesión redirige; con sesión de un correo no admin, no muestra nada.
- [ ] `grep` de secretos en el repo limpio; `npm audit` sin críticas.
- [ ] Aviso de privacidad visible y botón reportar funcionando.

## 11. Completar desde la bóveda de Obsidian

La skill `/boda-obsidian` busca en la bóveda notas sobre seguridad web, OWASP, Supabase/RLS, Cloudflare, manejo de secretos
y privacidad, y propone aquí:

- [ ] Controles adicionales que el dueño ya tenga documentados (con cita a la nota de origen).
- [ ] Ajustes a la CSP o a las cabeceras según sus convenciones.
- [ ] Política de contraseñas/PIN y de sesiones de admin si tiene una propia.
- [ ] Plantilla de aviso de privacidad si existe en la bóveda.
