# Registro de decisiones

Formato breve tipo ADR: contexto, decisión, consecuencias. Las decisiones se tomaron el 28 de octubre de 2026 a partir de
`01-investigacion-base.md` y de las respuestas del dueño del proyecto. Para cambiar una, se añade una nueva entrada que la
reemplace; no se edita la original.

---

## D01 · Alcance de la primera versión: MVP recomendado

**Contexto.** Catálogo de ~30 actividades posibles con distinto esfuerzo e impacto.
**Decisión.** La primera versión incluye: información y logística, RSVP, mesa de regalos, entrada personalizada por NFC/QR,
álbum colaborativo con moderación, muro en vivo para la pantalla del salón, libro de visitas con texto y audio, y petición de
canciones con votos.
**Consecuencias.** Retos fotográficos, cámara desechable digital, trivia en vivo, predicciones para el aniversario y posts
embebidos por link quedan en fase 2, después de que el MVP funcione en celulares reales.

## D02 · Etiquetas NFC por invitado y por mesa

**Contexto.** El NFC sólo abre una URL; la personalización depende de cómo se repartan las etiquetas.
**Decisión.** Token único por invitado (tarjeta de lugar o pulsera) más etiquetas genéricas por mesa y en puntos fijos
(entrada, barra, photobooth, mesa de regalos, baños). Todas con QR impreso al lado y la URL corta escrita.
**Consecuencias.** Hace falta una tabla `tags` con tipo `guest | table | spot`, importación de invitados, generación de
tokens y hojas de QR desde `/admin`, y un flujo de grabación de ~250 etiquetas NTAG213 (app NFC Tools o proveedor con CSV).

## D03 · Stack: React + Vite, proyecto Supabase nuevo

**Contexto.** El repo usa Create React App, que ya no recibe mantenimiento, con dependencias de Expo sin uso.
**Decisión.** Migrar a Vite conservando React 19; crear un proyecto Supabase dedicado a la boda (no reutilizar `tpx-portal`
ni el proyecto inactivo existente).
**Consecuencias.** La fase 1 del backlog es la migración y limpieza. Se descartó Next.js (más trabajo inicial sin beneficio
para una web que no necesita SEO) y las plataformas de terceros (pierden el NFC personalizado y el control).

## D04 · Costo mensual cero

**Contexto.** El dueño no quiere pagar Supabase Pro ni ninguna suscripción. ~200 invitados generan 15 a 25 GB de archivos.
**Decisión.** Supabase Free únicamente para Postgres, Realtime y Auth de administradores. Archivos en Cloudflare R2
(10 GB gratis, salida de datos gratis, excedente a 0.015 USD por GB al mes). Hosting y funciones en Cloudflare Pages Free.
Keepalive programado para evitar la pausa de Supabase Free por inactividad.
**Consecuencias.** Ningún byte de foto o video pasa por Supabase. Si R2 exige tarjeta registrada y el dueño no quiere darla,
la alternativa es Backblaze B2 (10 GB gratis, mismo protocolo S3). Costo recurrente real: el dominio.

## D05 · Subida directa desde el navegador con compresión en el cliente

**Contexto.** El pico de la noche son ~600 fotos y ~80 videos en diez minutos; el enlace de subida del salón es el recurso
más escaso.
**Decisión.** El navegador comprime (`web` 2048 px, `thumb` 480 px), pide URLs prefirmadas a una Pages Function y sube
directo a R2. Cola local con 2 subidas simultáneas, reintentos exponenciales y reanudación. Videos limitados a 90 s / 50 MB
y con menor prioridad que las fotos; interruptor "fotos ahora, videos después" en `/admin`.
**Consecuencias.** No se guarda el original de las fotos (sólo `web` y `thumb`). No hay transformaciones de imagen en
servidor. La función de firma debe responder en milisegundos y nunca recibir el archivo.

## D06 · Realtime sólo para la pantalla y el panel

**Contexto.** Supabase Free permite 200 conexiones Realtime simultáneas; 200 invitados agotarían el límite.
**Decisión.** Sólo `/tv` y `/admin` se suscriben a Realtime (≤ 5 conexiones). Los celulares consultan el álbum paginado al
entrar y, como máximo, cada 60 segundos.
**Consecuencias.** El álbum en el celular puede tardar hasta un minuto en reflejar una foto nueva; la pantalla del salón la
muestra en segundos, que es donde importa.

## D07 · Moderación humana con modo fiesta

**Contexto.** Hay menores, hay invitados que no quieren salir en línea y puede subirse contenido inapropiado.
**Decisión.** Todo entra como `pending`. Una persona de confianza (no los novios) aprueba desde `/admin`. Interruptor
"aprobar fotos automáticamente esta noche" para que la pantalla no se vacíe; videos y mensajes siguen pasando por revisión.
Botón "reportar" en cada elemento que lo oculta al instante.
**Consecuencias.** `/admin` debe ser de un toque por elemento, con acciones en bloque y utilizable desde un celular.

## D08 · Privacidad: galería con PIN, no pública

**Contexto.** La galería contiene fotos de ~200 personas, varias menores.
**Decisión.** `/album` requiere el PIN de la boda (o llegar por token). La página no se indexa (`noindex`, sin sitemap).
Aviso de privacidad corto en el primer uso, borrado a petición, retención definida (1 a 2 años) y exportación antes de apagar.
**Consecuencias.** Las claves de R2 incluyen un UUID (no adivinables) y los rechazados se borran de R2, no sólo se ocultan.

## D09 · No importar contenido de Instagram automáticamente

**Contexto.** La Basic Display API se apagó en diciembre de 2024; la API vigente exige cuenta profesional y revisión de Meta,
sin stories. Los muros de hashtag comerciales tienen las mismas limitaciones.
**Decisión.** La vía principal es la subida directa desde la galería. Como extra de fase 2, el invitado puede pegar el link
de su post (Instagram o TikTok) y se muestra embebido vía oEmbed.
**Consecuencias.** No se crea app en Meta for Developers en el MVP. Sí se define un hashtag oficial y un botón "compartir"
con la Web Share API para que el invitado lleve fotos con marco de la boda a sus propias redes.

## D10 · Hosting en Cloudflare Pages

**Contexto.** Vercel Hobby y Netlify Free también servirían.
**Decisión.** Cloudflare Pages, por estar en la misma cuenta que R2, no cobrar salida de datos y permitir Pages Functions
para el presign sin otro proveedor.
**Consecuencias.** DNS del dominio en Cloudflare. Si en el futuro se prefiere Vercel, las funciones se portan a serverless
sin cambiar R2 ni Supabase.

---

## Pendientes del dueño del proyecto

| Pendiente | Para qué se necesita | Bloquea |
|---|---|---|
| Fecha de la boda y nombre del salón | Calendario de fases, medición de red en sitio | Fase 8 (pruebas de campo) |
| Dominio deseado (o aprobar una propuesta) | URL corta de las etiquetas, dominio de medios | Fase 1 (despliegue) |
| R2 (con tarjeta registrada) o Backblaze B2 | Crear el bucket | Fase 3 (subida) |
| Nombres y correos de 1 a 2 administradores | Auth de `/admin` | Fase 4 |
| Lista de invitados y mesas (puede venir de Obsidian) | Tokens, QR, grabación de etiquetas | Fase 5 |
| Paleta y tipografía definitivas (ver `07-diseno-y-tipografia.md` y la bóveda de Obsidian) | Tokens de diseño | Fase 1 (diseño base) |
