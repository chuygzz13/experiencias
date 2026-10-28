# Página de boda interactiva: investigación base

Fecha: 28 de octubre de 2026
Estado: investigación, nada construido todavía.
Objetivo: tener claro qué actividades vale la pena ofrecer a los invitados, cómo se conectan técnicamente a una web propia, y qué decisiones hay que tomar antes de escribir código.

---

## 0. Resumen ejecutivo

1. **NFC sí funciona, pero hace una sola cosa: abrir una URL.** La etiqueta no guarda fotos ni "sube" nada. El invitado acerca su celular, el teléfono abre tu página en el navegador y todo lo interactivo ocurre ahí. No se necesita app. Siempre debe ir acompañada de un código QR y la URL escrita, porque no todos los celulares leen NFC.
2. **"Subir contenido de sus redes sociales" tiene que replantearse.** Jalar automáticamente las fotos que los invitados publiquen en Instagram no es viable en 2026: la API abierta murió en diciembre de 2024 y lo que queda exige cuentas profesionales, revisión de Meta y no incluye stories. Lo que sí funciona y es lo que hacen todas las apps de bodas: que el invitado **suba fotos y videos directo desde su galería a tu página** (sin app, sin cuenta). Como complemento, que **pegue el link de su post** de Instagram o TikTok y tú lo muestres embebido.
3. **Stack recomendado:** React (ya tienes el repo), Supabase para base de datos, almacenamiento y tiempo real (ya tienes una organización con dos proyectos), hosting estático gratuito (Vercel, Netlify o Cloudflare Pages) y un dominio corto. Costo total estimado fuera de las etiquetas: menos de 1,500 MXN.
4. **Las actividades con mejor relación impacto/esfuerzo** son: álbum colaborativo con muro en vivo en pantalla, libro de visitas con audio y video, retos fotográficos tipo bingo, petición de canciones, "encuentra tu mesa" personalizado vía NFC, y predicciones/consejos que se abren en el aniversario.
5. **El riesgo número uno no es técnico: es la señal en el salón.** Sin datos ni WiFi, nada funciona. Hay que confirmarlo con el venue antes de decidir cuánto apostar a lo digital.

---

## 1. Cómo funciona el NFC con invitados

### 1.1 Qué es y qué hace

- Una etiqueta NFC es un chip pasivo (sin batería) pegado a una antena. Se graba una sola vez con un registro NDEF de tipo URL, por ejemplo `https://boda.tudominio.mx/t/k7x2`.
- Al acercar un celular compatible, el sistema operativo lee la URL y la abre en el navegador. No hay app ni permiso que pedir.
- Todo lo demás (quién es el invitado, qué mesa tiene, subir fotos) lo resuelve tu página web a partir de esa URL.

### 1.2 Comportamiento por tipo de celular

| Celular | Qué pasa al acercar la etiqueta | Fuente |
|---|---|---|
| iPhone XS, XR y posteriores (2018 en adelante) | Lectura en segundo plano: con la pantalla encendida aparece un banner arriba; al tocarlo abre Safari. No lee si la cámara está abierta, si está en modo avión, si Wallet/Apple Pay está activo o si el teléfono no se ha desbloqueado desde que se encendió. | Apple Developer, GoToTags |
| iPhone 7, 8 y X | Tienen NFC pero no leen en segundo plano. Deben abrir "Lector de etiquetas NFC" desde el Centro de Control (iOS 14+). En la práctica casi nadie lo sabe: usan el QR. | GoToTags, 9to5Mac |
| iPhone 6s y anteriores | No leen etiquetas. QR. | — |
| Android con NFC (gama media y alta; muchos Samsung, Motorola, Xiaomi) | Leen con la pantalla desbloqueada y NFC activado en ajustes. Android 16 abre el enlace directamente; Android 17 muestra primero una notificación "abrir enlace" que hay que tocar. | Android Developers |
| Android gama baja | Muchos no traen NFC. QR. | — |

Detalles prácticos:
- La antena del iPhone está en el borde superior; la de Android, en el centro de la espalda. Vale la pena ponerlo en el letrero: "Acerca la parte de arriba de tu iPhone".
- Fundas gruesas, con tarjetas o metálicas pueden bloquear la lectura.
- Apple sólo procesa el primer registro URI de la etiqueta y debe ser `https://`. No grabes texto adicional antes de la URL.

### 1.3 Qué etiquetas comprar

| Chip | Memoria | URL máxima aprox. | Uso |
|---|---|---|---|
| NTAG213 | 144 bytes | ~130 caracteres | Suficiente. Es el estándar y el más barato. |
| NTAG215 | 504 bytes | ~480 caracteres | Sólo si quisieras URLs largas. |
| NTAG216 | 888 bytes | ~850 caracteres | Innecesario para esto. |

- Formatos: sticker redondo de 25 a 30 mm (para pegar detrás de tarjetas de lugar o centros de mesa), tarjeta PVC tamaño credencial, pulsera de tela o silicón, llavero o ficha de madera grabada con láser (muy bonito como recuerdo).
- Si la etiqueta irá sobre metal (centro de mesa metálico, charola), compra la versión "anti-metal", si no, no lee.
- Precio de referencia: 0.25 a 0.40 USD por sticker en lotes de 50 a 100 piezas en tiendas internacionales. En Mercado Libre México busca "NTAG213" y compara precio por pieza; estimo 10 a 25 MXN por sticker en paquetes de 10 a 50 (verificar, no encontré listados en la búsqueda). Pulseras o tarjetas personalizadas suben a 15 a 60 MXN por pieza, estimado.
- Compra 20 % extra: algunas vienen defectuosas y otras se pierden.

### 1.4 Cómo se graban

- Con una app gratuita en tu propio celular: "NFC Tools" (iOS y Android). Escribir → Añadir registro → URL → acercar la etiqueta. Una por una, toma unos 5 segundos cada una.
- Opción de bloquear la etiqueta ("lock") para que nadie la reescriba. Hazlo sólo cuando estés seguro de la URL.
- Alternativa: grabarlas desde una página de administración propia usando Web NFC, que sólo funciona en Chrome para Android. Útil si son muchas con token único.
- Alternativa: comprarlas ya grabadas con un proveedor que acepte un archivo CSV de URLs.

### 1.5 Una URL por mesa o una por invitado

| Estrategia | Ventajas | Desventajas |
|---|---|---|
| Una sola URL para todos | Baratísimo, cualquier etiqueta sirve en cualquier lugar. | La página no sabe quién es el invitado; hay que pedir nombre. |
| Una URL por mesa (`/m/7`) | La página puede saludar a la mesa, mostrar quiénes están en ella y hacer competencias entre mesas. | No sabe la persona exacta. |
| Una URL por invitado (`/t/k7x2`) | Experiencia personalizada: "Hola Mariana, tu mesa es la 7, tu menú es vegetariano". Las fotos ya llevan autor. Agradecimientos personalizados después. | Hay que grabar y repartir la etiqueta correcta a cada persona (tarjeta de lugar o pulsera al registrarse). |

Recomendación: token por invitado en la tarjeta de lugar o pulsera, y etiquetas genéricas por mesa y en puntos fijos (barra, photobooth, entrada, baños, mesa de regalos). El token debe ser aleatorio y no adivinable; nunca el nombre ni un número consecutivo.

### 1.6 Dónde colocar los puntos de contacto

- Tarjeta de lugar en cada asiento (la más importante: todos la tocan).
- Centro de mesa con letrero pequeño "Acerca tu celular / escanea el QR para subir tus fotos".
- Entrada o mesa de registro: pulsera o tarjeta.
- Barra: "Pide tu canción", "Vota por el coctel".
- Photobooth: "Tus fotos aparecen aquí".
- Mesa de regalos: link a la mesa digital.
- Baños: funciona sorprendentemente bien, la gente tiene tiempo.

### 1.7 Lo que el NFC no resuelve

- Sin señal celular o WiFi en el salón, la página no abre. Pregunta al venue por WiFi para invitados y pon la contraseña en la página y en un QR tipo `WIFI:` en las mesas.
- Los invitados mayores suelen no usar QR ni NFC. Pon una estación física: una tablet en modo kiosko con tu propia página (grabar audio, dejar mensaje, ver fotos) y, si quieres, un teléfono tipo audio guestbook.
- Prueba con un iPhone viejo, un iPhone reciente, un Samsung, un Motorola o Xiaomi, con funda y sin funda, antes de imprimir nada.

---

## 2. "Subir el contenido de sus redes sociales": qué sí y qué no

### 2.1 Lo que la gente realmente quiere

Las fotos y videos que toman con su celular durante la boda. La inmensa mayoría nunca las publica en redes; se quedan en la galería. Por eso todas las plataformas de bodas se centran en la subida directa, no en Instagram.

### 2.2 Opción A, recomendada: subida directa desde el navegador

- Un botón "Subir fotos" abre la galería del celular con selección múltiple (`<input type="file" accept="image/*,video/*" multiple>`). Funciona en iPhone y Android sin app.
- iPhone guarda fotos en HEIC. Safari las convierte a JPEG automáticamente al elegirlas si el `accept` pide `image/jpeg` o `image/*`; no incluyas `image/heic`, porque Safari 17+ puede hacer lo contrario y convertir todo a HEIC.
- Comprimir en el cliente antes de subir (redimensionar a 2048 px de lado largo, calidad 0.8): una foto de 4 MB queda en 400 a 700 KB, lo que ahorra datos al invitado y almacenamiento a ti. El repo actual ya tiene una función `compressImage` con esa idea.
- Videos: limitar duración o tamaño (por ejemplo 60 segundos o 200 MB) y usar subida reanudable (protocolo TUS, que Supabase Storage soporta) para que no se pierda si falla la red.
- Sin login: el autor se identifica con el token NFC o escribiendo su nombre una vez (se guarda en el navegador).
- Subida directa del navegador al almacenamiento (URL firmada), no a través de tu servidor, para aguantar el pico de 150 personas subiendo a la vez después del beso.

### 2.3 Opción B, complemento: "pega el link de tu post"

- El invitado publica en su Instagram o TikTok, copia el enlace y lo pega en tu página. Tu servidor llama a oEmbed y muestra el post embebido en un muro.
- TikTok: endpoint oEmbed público sin autenticación.
- Instagram: el código de embed (`blockquote` + `embed.js`) funciona para posts públicos sin API. Fuentes secundarias reportan que desde junio de 2026 el endpoint oEmbed de Meta ya no exige token ni revisión; verificar en la documentación oficial antes de depender de ello.
- Limitaciones: sólo posts públicos, nada de stories, y depende de que el invitado haga tres pasos extra. Espera participación baja.

### 2.4 Opción C, avanzada: menciones y hashtags automáticos

- Instagram Basic Display API fue apagada el 4 de diciembre de 2024.
- Lo vigente es la Instagram API con cuenta profesional: tu cuenta de Instagram debe ser Business o Creator, necesitas crear una app en Meta for Developers, y con el endpoint `/tags` obtienes los posts donde te etiquetaron. No incluye stories ni cuentas privadas. La búsqueda por hashtag está limitada (30 hashtags por 7 días) y no devuelve el usuario que publicó.
- Los "muros de hashtag" comerciales (Walls.io, Taggbox, Tagembed) cuestan dinero y tienen exactamente estas mismas limitaciones.
- Veredicto: no apostar la experiencia a esto. Como extra, puede valer la pena si ya tienen cuenta profesional y ganas de pelearse con la revisión de Meta.

### 2.5 Opción D: aparecer en el menú "Compartir" del celular

- Con Web Share Target, una PWA instalada aparece en la hoja de compartir y recibe fotos directamente. Sólo funciona en Chrome para Android; Safari en iOS no lo soporta (petición abierta en WebKit desde 2019, sin cambios en Safari 26).
- Útil como mejora para usuarios Android, no como camino principal.

### 2.6 Opción E: WhatsApp

- México vive en WhatsApp. Dos usos distintos:
  - **Distribución (fácil y muy recomendable):** mandar la invitación y el link personalizado por WhatsApp, botones `wa.me` para compartir la página, y etiquetas Open Graph para que la vista previa se vea bonita.
  - **Recepción de fotos por WhatsApp (complejo):** un número con WhatsApp Business API (vía Twilio, 360dialog, etc.) que recibe imágenes y las sube al álbum. Los mensajes del invitado abren una ventana de 24 horas en la que tus respuestas son gratis; el costo real es la cuota del proveedor y el desarrollo. WhatsApp comprime las fotos salvo que se envíen como documento. Sólo si sobra tiempo.

### 2.7 El camino inverso: que compartan TU contenido en sus redes

- Hashtag oficial visible en todos lados.
- Botón "Compartir" con la Web Share API (`navigator.share`) que entrega al invitado una foto con el marco o sticker de la boda listo para su story.
- Esto sí sube la presencia en redes sin pelearse con ninguna API.

### 2.8 Plan B de cero código

Un álbum compartido de Google Photos con enlace colaborativo funciona para recolectar fotos sin construir nada. Sin tu marca, sin moderación, sin NFC personalizado, pero es un respaldo válido si el tiempo se acaba.

---

## 3. Catálogo de actividades interactivas

Esfuerzo: B = bajo (horas), M = medio (días), A = alto (semana o más, o depende de terceros).

### 3.1 Antes de la boda

| Actividad | Qué hace el invitado | Cómo se conecta a la web | Esfuerzo | Impacto |
|---|---|---|---|---|
| Invitación digital + RSVP | Confirma asistencia, acompañantes, menú, alergias, canción. | Link personalizado por familia enviado por WhatsApp; formulario guarda en tabla `rsvps`. | M | Alto |
| Cuenta regresiva y "nuestra historia" | Ve la línea de tiempo de la pareja con fotos. | Página estática. | B | Medio |
| Logística | Itinerario, mapas, hoteles, transporte, código de vestimenta, clima. | Página estática con botones a Google Maps y Waze. | B | Alto |
| Mesa de regalos y sobre digital | Elige regalo o aporta dinero. | Links a Liverpool, Palacio de Hierro, Amazon o Liizt; para efectivo, CLABE copiable, link de Mercado Pago o Stripe. | B | Alto |
| Playlist colaborativa | Pide canciones semanas antes. | Formulario → tablero del DJ con votos; exportable a Spotify. Alternativa sin código: playlist colaborativa de Spotify. | B | Alto |
| Quiz "¿quién conoce mejor a los novios?" | Responde 10 preguntas. | Tabla `quiz_answers`; ranking en vivo el día de la boda. | M | Medio |
| Predicciones y consejos | "¿Dónde vivirán en 10 años?", "un consejo para el matrimonio". | Se guardan selladas; se abren en el aniversario. | B | Alto (emocional) |
| Mapa de dónde vienen los invitados | Marca su ciudad. | Mapa con pines; el repo ya tiene un componente de mapa. | B | Medio |

### 3.2 Durante la boda

| Actividad | Qué hace el invitado | Cómo se conecta a la web | Esfuerzo | Impacto |
|---|---|---|---|---|
| Álbum colaborativo | Sube fotos y videos desde su galería. | Subida directa a Storage; tabla `media` con estado pendiente/aprobado. | M | Muy alto |
| Muro de fotos en vivo | Ve sus fotos aparecer en la pantalla o proyector. | Página `/tv` a pantalla completa suscrita a Supabase Realtime; sólo muestra aprobadas; latencia típica 10 a 30 s. | M | Muy alto |
| Cámara desechable digital | Tiene N "disparos"; las fotos se revelan hasta el día siguiente. | Modo cámara en la web (el repo ya usa `getUserMedia`); contador por invitado; revelado programado. | M | Alto |
| Retos fotográficos / bingo | Cumple retos: selfie con tu mesa, foto del primer baile, encuentra a los padrinos. | Lista de retos; al subir la foto elige el reto; tablero por mesa en la pantalla. | M | Alto |
| Libro de visitas: texto, audio, video | Deja un mensaje escrito, de voz o video de 30 s. | `MediaRecorder` (Safari lo soporta desde iOS 14.3, graba MP4/AAC); el repo ya tiene grabación de audio. Tablet en modo kiosko para los mayores. | M | Muy alto |
| Encuentra tu mesa | Toca su etiqueta o busca su nombre y ve su mesa y quién más está ahí. | Token → tabla `guests`; buscador por nombre como respaldo. | B | Alto |
| Trivia y encuestas en vivo | Responde preguntas en la cena; resultados en pantalla. | Tabla `polls`; Realtime hacia `/tv`. | M | Alto |
| Peticiones de canciones en vivo | Pide y vota canciones durante la fiesta. | Cola con votos; vista para el DJ en su celular. | B | Alto |
| Votaciones divertidas | Mejor outfit, mejor bailarín, momento de la noche. | Encuesta simple; resultados al final. | B | Medio |
| Mensajes en pantalla | Manda un mensaje corto que aparece en la pantalla. | Cola moderada antes de mostrar. | B | Medio |
| Carta de bar | Ve cocteles, vota por el favorito, "coctel del novio vs. de la novia". | Página estática + encuesta. | B | Medio |
| Photobooth integrado | Sus fotos de la cabina caen al mismo álbum. | Depende del proveedor (carpeta compartida o API). Alternativa DIY: iPad con tu página en modo cabina. | A | Medio |
| Transmisión en vivo | Familia a distancia ve la ceremonia. | Embed de YouTube Live o Zoom con chat. | B | Medio |
| "Encuentra tus fotos" por selfie | Se toma una selfie y ve todas las fotos en las que sale. | Reconocimiento facial (servicio externo tipo Kamero/FotoOwl o API en la nube). Requiere consentimiento explícito; es dato biométrico. | A | Medio |

### 3.3 Después de la boda

| Actividad | Qué hace el invitado | Cómo se conecta a la web | Esfuerzo | Impacto |
|---|---|---|---|---|
| Álbum curado + fotos del fotógrafo | Ve y descarga todo en un solo lugar. | Misma galería con sección "oficiales"; descarga en ZIP generada en servidor. | B | Alto |
| "Tus fotos" | Ve lo que subió y donde lo etiquetaron. | Filtro por token de invitado. | B | Medio |
| Agradecimientos personalizados | Abre su link y recibe un mensaje y foto con ustedes. | Página por token. | B | Alto |
| Apertura de predicciones | En el aniversario se revelan. | Fecha programada. | B | Alto |
| Respaldo y apagado | — | Exportar todo a disco; decidir cuánto vive la página (1 a 2 años). | B | Necesario |

### 3.4 MVP sugerido (lo que yo construiría primero)

1. Página base con logística, RSVP y mesa de regalos.
2. Token NFC/QR por invitado → saludo personalizado y "tu mesa".
3. Álbum colaborativo con subida directa y moderación.
4. Muro en vivo `/tv`.
5. Libro de visitas con texto y audio.
6. Petición de canciones.

Segunda fase: retos fotográficos, cámara desechable, trivia en vivo, embed de posts, predicciones.

---

## 4. Arquitectura técnica propuesta

### 4.1 Piezas

| Capa | Opción recomendada | Notas |
|---|---|---|
| Frontend | React. El repo usa Create React App (`react-scripts` 5), que ya no recibe mantenimiento. Migrar a Vite es un cambio pequeño y vale la pena antes de crecer. | Convertir en PWA (manifest + service worker) para "Agregar a inicio" y cache. |
| Backend | Supabase: Postgres, Storage, Realtime, Auth anónima, Edge Functions. | Ya tienes una organización con dos proyectos: "tpx-portal" (activo, región São Paulo) y "chuygzz13's Project" (inactivo, pausado). Para la boda conviene un proyecto nuevo y dedicado. |
| Almacenamiento de media | Supabase Storage (simple) o Cloudflare R2 (más barato en salida de datos). | Ver dimensionamiento abajo. |
| Hosting | Vercel, Netlify o Cloudflare Pages, plan gratuito. | Dominio corto propio: 300 a 500 MXN al año. |
| Pantalla del salón | Laptop o Chromecast/Fire TV con Chrome abierto en `/tv`. | Preferir cable o hotspot propio. |

### 4.2 Flujos principales

- **Llegada:** toque NFC o QR → `/t/<token>` → se guarda el invitado en el navegador → inicio personalizado → sugerencia de "Agregar a pantalla de inicio".
- **Subida:** elegir fotos → compresión en cliente → subida directa a Storage con URL firmada (TUS si es video) → fila en `media` con estado `pendiente` → moderador aprueba desde `/admin` → Realtime → aparece en `/tv` y en la galería.
- **Mensajes de voz:** `MediaRecorder` → archivo MP4/AAC (Safari) o WebM/Opus (Android) → Storage → reproducción en galería. Guardar ambos formatos tal cual y transcodificar después si hace falta.
- **Pantalla:** `/tv` rota fotos aprobadas, intercala mensajes y resultados de encuestas, nunca muestra nada sin aprobar.

### 4.3 Modelo de datos mínimo

- `guests` (id, nombre, mesa, menú, familia, token)
- `tables` (número, nombre, capacidad)
- `rsvps` (guest_id, asiste, acompañantes, alergias, canción)
- `media` (id, guest_id, tipo foto/video/audio, ruta, miniatura, estado, reto_id, creado_en)
- `messages` (guest_id, texto, tipo, estado)
- `songs` (título, artista, guest_id) y `song_votes`
- `challenges` (reto, orden) para el bingo
- `polls`, `poll_options`, `poll_votes`
- `predictions` (guest_id, texto, abrir_en)
- `embeds` (guest_id, url, html_oembed, estado)

Todas con Row Level Security: el invitado anónimo sólo puede insertar y leer lo aprobado; sólo ustedes (o un padrino moderador) aprueban.

### 4.4 Dimensionamiento y costos

Supuestos: 150 invitados, 15 fotos y 2 videos por persona.

| Concepto | Estimado |
|---|---|
| Fotos comprimidas en cliente | 150 × 15 × 0.5 MB ≈ 1.1 GB |
| Fotos sin comprimir (si decides guardar original) | ≈ 7 GB |
| Videos (40 MB promedio) | 150 × 2 × 40 MB ≈ 12 GB |
| Total razonable | 15 a 20 GB |

| Servicio | Plan | Límites relevantes | Costo |
|---|---|---|---|
| Supabase Free | 0 | 1 GB de archivos, 5 GB de salida, se pausa tras 1 semana sin uso, máximo 2 proyectos | 0 |
| Supabase Pro | mensual | 100 GB de archivos, 250 GB de salida, 8 GB de base de datos | 25 USD/mes; sólo necesitas 1 o 2 meses alrededor del evento |
| Cloudflare R2 | gratuito | 10 GB/mes gratis, salida de datos gratis; después 0.015 USD por GB-mes | 0 a 1 USD/mes |
| Dominio | anual | — | 300 a 500 MXN |
| Hosting | gratuito | — | 0 |
| Etiquetas NFC | único | 150 a 200 stickers | 1,500 a 5,000 MXN según formato |
| Impresión QR y letreros | único | — | 500 a 1,500 MXN |

Importante: el plan gratuito de Supabase no sirve para el día de la boda por el límite de 1 GB y la pausa automática. Pagar Pro el mes del evento o usar R2 para los archivos.

### 4.5 Moderación, privacidad y seguridad

- Cola de aprobación en `/admin` operada por una persona de confianza durante la fiesta (no ustedes). Opción de auto-aprobar fotos y revisar sólo videos y mensajes.
- Botón "Reportar" en cada foto y borrado inmediato a petición.
- Aviso de privacidad corto al primer uso (hay menores y personas que no quieren salir en línea); en México aplica la LFPDPPP para datos personales.
- Tokens aleatorios, límites de tasa en subidas, tamaño máximo por archivo, tipos MIME permitidos en el bucket.
- Galería visible sólo para quien tiene link con token o PIN de la boda, no indexable por buscadores.
- Reconocimiento facial, si se hace, sólo con consentimiento explícito y borrando las selfies tras la búsqueda.

### 4.6 Red y resiliencia

- Confirmar con el venue: WiFi para invitados, ancho de banda, cobertura celular en el salón y jardín.
- QR de conexión WiFi en cada mesa (`WIFI:T:WPA;S:nombre;P:clave;;`).
- Subidas reanudables y reintentos automáticos; mensaje claro de "se subirá cuando tengas señal".
- La pantalla `/tv` debe seguir rotando lo ya cargado si se cae la red.
- Ensayo general una semana antes con 5 a 10 personas y celulares distintos.

### 4.7 Qué se puede reutilizar del repo actual

- `compressImage` en `src/App.js`: redimensiona y comprime a JPEG en el navegador.
- Captura con `getUserMedia` y canvas para la "cámara desechable".
- Grabación de audio con `MediaRecorder` para el libro de visitas (hoy sólo simula una transcripción).
- Selector de galería con `input type="file"`.
- Grid de tarjetas del feed y el componente de mapa.
- Las dependencias de Expo y `react-native-web` no se usan en la web y se pueden quitar.
- Hoy todo se guarda en `localStorage`; hay que sustituirlo por Supabase.

---

## 5. Decisiones que necesito de ustedes antes de construir

1. Fecha de la boda y número de invitados (afecta plazos, tamaño del almacenamiento y cantidad de etiquetas).
2. Venue y su conectividad (WiFi, señal). Define cuánto apostar a lo digital.
3. NFC por invitado, por mesa o ambos; formato (tarjeta de lugar, pulsera, sticker, madera).
4. Dominio deseado y si ya lo tienen.
5. Fotos visibles de inmediato para todos, o sólo tras aprobación; quién modera la noche de la boda.
6. Qué actividades del catálogo entran en la primera versión (propuesta en 3.4).
7. Idiomas (¿invitados de fuera?).
8. Fotógrafo, photobooth y DJ: ¿aceptan integrarse o al menos compartir archivos?
9. Presupuesto para etiquetas, impresión y pantalla.
10. Stack: seguir con React migrando a Vite, o cambiar a Next.js; proyecto Supabase nuevo (recomendado) o reutilizar uno existente.

---

## 6. Plan por fases (propuesto, relativo a la fecha de la boda)

| Fase | Cuándo | Entregable |
|---|---|---|
| 0. Decisiones | ahora | Respuestas a la sección 5. |
| 1. Base | T-12 a T-10 semanas | Proyecto Supabase, dominio, esqueleto de la web, RSVP, logística, mesa de regalos. Enviar invitación por WhatsApp. |
| 2. Experiencia de invitado | T-10 a T-6 | Token NFC/QR, álbum colaborativo, moderación, muro `/tv`, libro de visitas, canciones. |
| 3. Extras | T-6 a T-3 | Retos, cámara desechable, trivia, predicciones, embeds. |
| 4. Hardware y pruebas | T-3 a T-1 | Comprar y grabar etiquetas, imprimir QR, ensayo con celulares reales, prueba de carga simulando subidas simultáneas, plan para la pantalla. |
| 5. Día de la boda | T | Moderador asignado, laptop de respaldo, hotspot de respaldo, etiquetas extra. |
| 6. Post boda | T+1 a T+4 semanas | Fotos oficiales al álbum, agradecimientos, descarga ZIP, respaldo completo. |

---

## 7. Fuentes consultadas

NFC y celulares
- Apple Developer, Adding Support for Background Tag Reading: https://developer.apple.com/documentation/corenfc/adding-support-for-background-tag-reading
- GoToTags, iOS Background NFC Tag Reading: https://gototags.com/help/ios/nfc/reading/background
- Android Developers, NFC basics (tag dispatch, Android 16/17): https://developer.android.com/develop/connectivity/nfc/nfc
- NXP, hoja de datos NTAG213/215/216: https://www.nxp.com/docs/en/data-sheet/NTAG213_215_216.pdf
- Wakdev, NTAG213 y longitud de URL: https://www.wakdev.com/en/knowledge-base/nfc-chips/nxp-ntag213.html
- Chromium, Web NFC (sólo Android): https://www.chromium.org/developers/design-documents/web-nfc/
- Precios de referencia de etiquetas: https://rfid.it/es/390-etiquetas-nfc-blancas y https://www.ebay.de/itm/157248463570
- Experiencia real NFC + QR en tarjetas (foro): https://www.weddingwire.com/wedding-forums/guest-to-upload-photos-they-take/6169dc493808be49.html

Subida de fotos, audio y navegadores
- WebKit, MediaRecorder API en Safari: https://webkit.org/blog/11353/mediarecorder-api/
- WebKit, conversión HEIC en el selector de archivos: https://bugs.webkit.org/show_bug.cgi?id=292350 y https://developer.apple.com/forums/thread/743037
- Web Share Target no soportado en Safari (petición abierta): https://bugs.webkit.org/show_bug.cgi?id=194593
- Supabase Storage, subidas reanudables: https://dev.to/supabase/supabase-storage-v3-resumable-uploads-with-support-for-50gb-files-2egd
- Supabase Storage quickstart: https://supabase.com/docs/guides/storage/quickstart

Redes sociales
- Meta, Instagram Basic Display API descontinuada: https://developers.facebook.com/docs/instagram-basic-display-api
- Meta, Instagram oEmbed: https://developers.facebook.com/docs/instagram-platform/oembed
- Reportes del cambio a oEmbed sin token (verificar): https://wpmayor.com/meta-tokenless-oembed-wordpress/
- Meta, menciones y etiquetas con cuenta profesional: https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/mentions
- TikTok, embed de videos (oEmbed): https://developers.tiktok.com/doc/embed-videos
- Meta, precios WhatsApp Business Platform: https://developers.facebook.com/docs/whatsapp/pricing

Costos de infraestructura
- Guías de precios Supabase 2026: https://makerkit.dev/blog/saas/supabase-pricing y https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/
- Cloudflare R2, precios: https://developers.cloudflare.com/r2/pricing/

Actividades y referencias de mercado
- Comparativas de apps de fotos para bodas: https://www.wedibox.com/compare/best-wedding-photo-sharing-apps , https://guestcam.co/blog/best-wedding-photo-sharing-sites , https://www.yogile.com/blog/best-wedding-photo-sharing-app , https://bridebook.com/uk/article/qr-code-for-wedding-photos
- Muro en vivo el mismo día: https://svenstudios.com/2026/07/what-is-a-same-day-wedding-slideshow/ y https://kululu.com/wedding-photo-sharing-app
- Libro de visitas de audio: https://paperlust.co/blog/audio-guest-book/ y https://guestcam.co/voicemails
- Petición de canciones: https://www.wedibox.com/features/shared-playlist y https://sayi.do/articles/crowdsource-your-wedding-playlist
- Ideas interactivas: https://www.theknot.com/content/wedding-activities , https://craftsyhacks.com/interactive-reception-ideas/ , https://www.bodas.net/articulos/fotos-originales-con-los-invitados--c1661
- Reconocimiento facial para invitados: https://kamero.ai/ai-face-recognition
- Mesa de regalos en México: https://www.liverpool.com.mx/tienda/lista-de-sugerencias-boda/catst10320415 y https://forbes.com.mx/?p=593376
