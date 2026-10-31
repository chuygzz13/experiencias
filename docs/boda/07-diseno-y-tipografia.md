# Diseño y tipografía

Guía para que la página se vea estructurada, estética, práctica y funcional. Define principios, arquitectura de
información, tokens a fijar y tres propuestas tipográficas. Las secciones marcadas "completar desde Obsidian" se llenan con
la skill `/boda-obsidian` a partir de las notas del dueño sobre diseño web y tipografía.

## 1. Principios

1. **Móvil primero y con una mano.** El 95 % de los usos ocurre en un celular, de pie, con una copa en la otra mano.
   Acciones principales abajo, al alcance del pulgar; una acción principal por pantalla.
2. **Invitados de 8 a 85 años.** Tipografía base de 17 px, botones de al menos 48 px de alto, contraste AA (4.5:1) en todo el
   texto, nada de gris claro sobre blanco, iconos siempre con palabra.
3. **Cero fricción.** Sin cuenta, sin app, sin tutorial. Cada pantalla se entiende en dos segundos: título, una frase, un botón.
4. **La boda es la protagonista, no la interfaz.** Fotos grandes, blancos generosos, poca decoración; el estilo sale de la
   paleta y la tipografía, no de adornos.
5. **Estado siempre visible.** Subiendo, en cola, enviado, aprobado: el invitado nunca se pregunta si funcionó.
6. **Funciona a medias con red a medias.** Esqueletos de carga, mensajes claros cuando no hay señal, nada se pierde.
7. **Respeto al movimiento.** Transiciones cortas (150 a 250 ms), `prefers-reduced-motion` respetado, nada que parpadee en `/tv`.

## 2. Arquitectura de información

```
/            Inicio personalizado: saludo, cuenta regresiva, "tu mesa", 4 accesos grandes
├─ /subir    Subir fotos y videos
├─ /album    Álbum (PIN) → /album/:id visor
├─ /mensajes Libro de visitas (texto / audio) · ?kiosko=1
├─ /canciones Pedir y votar
├─ /info     Itinerario · lugares · hoteles · dress code · WiFi
├─ /rsvp     Confirmación
├─ /regalos  Mesa de regalos · sobre digital
├─ /t/:token Entrada (redirige a /)
├─ /tv       Muro en vivo (pantalla)
├─ /dj       Ranking de canciones para el DJ (clave, sólo lectura)
└─ /admin    Login (sólo tú) → cola · contenido · invitados · confirmaciones · etiquetas · canciones · estado
```

Navegación de invitado: barra inferior fija con 4 destinos (Inicio, Subir, Álbum, Más). "Más" abre mensajes, canciones,
info, RSVP y regalos. En escritorio la misma barra pasa a la izquierda.

### Anatomía de una pantalla de invitado

1. Encabezado corto: nombre de la sección y, si aplica, el nombre del invitado.
2. Una frase de contexto (máximo 2 líneas).
3. Contenido.
4. Acción principal fija abajo (botón ancho). Acciones secundarias como texto.

## 3. Tokens de diseño a fijar

Se definen en `src/styles/tokens.css` con tema claro y oscuro (el oscuro importa: muchos invitados tienen el celular en
oscuro y la fiesta es de noche).

| Token | Qué define | Provisional |
|---|---|---|
| `--bg`, `--surface`, `--surface-2` | Fondo y tarjetas | A decidir con la paleta de la boda |
| `--ink`, `--muted` | Texto principal y secundario | Oscuro con sesgo hacia el acento, nunca negro puro ni gris neutro |
| `--accent`, `--accent-ink` | Botones y énfasis | Un solo acento (el color de la boda); versión más oscura para texto |
| `--line` | Bordes y separadores | Tono del fondo, un paso más oscuro |
| `--good`, `--warn`, `--bad` | Estados de subida y moderación | Semánticos, con icono y palabra siempre |
| `--radius` | Esquinas | 10 px en tarjetas, 999 px en chips; botones 12 px |
| `--space-1..8` | Escala de espacio | 4, 8, 12, 16, 24, 32, 48, 64 px |
| `--font-display`, `--font-body`, `--font-mono` | Familias | Ver sección 4 |
| `--text-sm..xl` | Escala tipográfica | 14 / 17 / 20 / 26 / 34 px (móvil); `/tv` aparte |

Regla: ningún color literal en componentes; todo sale de tokens, y cada token se define primero en claro y luego se
redefine en oscuro.

## 4. Tipografía

### Criterios de elección

- Dos familias como máximo (display para títulos, texto para todo lo demás), cuatro pesos en total, servidas desde Google
  Fonts con `display=swap` y `preload` del archivo principal. Fuentes variables cuando existan para reducir peticiones.
- La de texto tiene que leerse a 17 px en pantalla de celular con brillo bajo: altura de x generosa, formas abiertas, buen
  soporte de acentos y ñ (todas las de Google Fonts en Latin lo tienen; se verifica igual).
- La de display aporta la personalidad de la boda, pero se usa con moderación: nombres, títulos de sección, números grandes.
- Números tabulares (`font-variant-numeric: tabular-nums`) en cuentas regresivas, mesas y rankings.
- Mayúsculas pequeñas con `letter-spacing: .06em` sólo en etiquetas; nunca párrafos en mayúsculas.

### Tres parejas candidatas (Google Fonts)

| Opción | Display | Texto | Carácter | Cuándo elegirla |
|---|---|---|---|---|
| A · Clásica | Cormorant Garamond (500, 600 itálica) | Source Sans 3 (400, 600) | Elegante, editorial, invitación impresa | Boda formal, paleta clara con acento dorado, verde o vino |
| B · Contemporánea | Fraunces (variable, óptico, 500 a 700) | Work Sans (400, 500, 600) | Cálida, con personalidad, menos solemne | Boda de día o jardín, paleta terrosa o pastel |
| C · Sobria | DM Serif Display (400) | DM Sans (400, 500, 700) | Limpia, moderna, muy legible en pantalla | Boda urbana, paleta de alto contraste; DM Sans ya está en el prototipo |

Recomendación provisional: **A** si la papelería es clásica, **C** si es minimalista. La decisión final se toma con la paleta
y con lo que haya en la bóveda de Obsidian.

### Reglas para el muro `/tv`

- Pantalla de 1080p vista a 5 m: nombre del autor y pie de foto a 48 px mínimo, títulos a 72 px; pesos medios o seminegros,
  nunca finos; contraste alto sobre fondo oscuro.
- Una foto por pantalla, con desenfoque del mismo contenido como fondo si la proporción no llena.
- Transición de 400 ms con fundido; sin movimiento continuo que canse.
- Zona segura del 5 % en los bordes (los televisores recortan).

### Micro-reglas de texto

- Títulos con `text-wrap: balance`; párrafos a máximo 65 caracteres por línea.
- Botones en infinitivo o imperativo corto: "Subir fotos", "Enviar mensaje", "Votar".
- Mensajes de error con qué pasó y qué hacer: "No hay señal. Tus fotos se enviarán solas cuando vuelva."

## 5. Componentes base

| Componente | Reglas |
|---|---|
| Botón primario | Ancho completo en móvil, 52 px de alto, texto 17 px seminegro, estado de carga con spinner y texto |
| Botón secundario | Mismo tamaño, borde, sin relleno |
| Tarjeta | Fondo `--surface`, borde `--line`, radio 10 px, sombra sólo en estado flotante |
| Chip de estado | Icono + palabra + color semántico; nunca sólo color |
| Barra de progreso | Por archivo y total; porcentaje en número |
| Hoja inferior | Para confirmaciones y acciones secundarias (sustituye `alert`/`confirm`) |
| Esqueleto de carga | En álbum y mensajes; nunca pantalla en blanco |
| Campo de texto | 48 px, etiqueta visible siempre (no sólo placeholder), ayuda debajo |

## 6. Accesibilidad mínima

- Contraste AA en todo; AAA en `/tv`.
- Foco visible con el color de acento; orden de tabulación lógico aunque casi nadie use teclado.
- Etiquetas `aria` en botones de icono; `alt` descriptivo generado del pie de foto o "Foto de <nombre>".
- Tamaños de toque de 48 px y separación de 8 px entre objetivos.
- Probar con tamaño de fuente del sistema aumentado al 130 %.

## 7. Completar desde la bóveda de Obsidian

La skill `/boda-obsidian` busca notas sobre diseño web, UI/UX, tipografía, sistemas de diseño, estructura de páginas y
accesibilidad, y añade aquí, con cita a la nota de origen:

- [ ] Paleta o referencias visuales que el dueño ya tenga para la boda.
- [ ] Familias tipográficas preferidas o descartadas, y por qué.
- [ ] Reglas de estructura o de componentes que use en otros proyectos.
- [ ] Referencias de páginas de boda que le gusten (y qué de ellas).
- [ ] Cualquier regla que contradiga esta guía: se anota como propuesta de cambio, no se aplica sin decisión.
