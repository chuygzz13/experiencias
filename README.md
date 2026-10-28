# experiencias → página de boda interactiva

Este repositorio se está convirtiendo en la página web de una boda para ~200 invitados: entrada por etiqueta NFC o QR,
álbum colaborativo de fotos y videos, muro en vivo en la pantalla del salón, libro de visitas con audio, petición de
canciones, RSVP, logística y mesa de regalos. Sin costo mensual: Cloudflare Pages + R2 para la web y los archivos,
Supabase Free para datos y tiempo real.

## Estado

**Fase 0: base documental.** La página todavía no existe; `src/` es el prototipo anterior (feed de experiencias en
Create React App) del que se reutilizan la compresión de imágenes, la cámara y la grabación de audio.

| Documento | Qué contiene |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Reglas duras, stack, convenciones y orden de lectura para Claude Code |
| [`docs/boda/01-investigacion-base.md`](docs/boda/01-investigacion-base.md) | Investigación con fuentes: NFC, redes sociales, actividades, costos |
| [`docs/boda/02-decisiones.md`](docs/boda/02-decisiones.md) | Decisiones tomadas y pendientes |
| [`docs/boda/03-arquitectura.md`](docs/boda/03-arquitectura.md) | Servicios, flujos, diseño anti-colapso, SQL, contratos de funciones |
| [`docs/boda/04-mapa-de-modulos.md`](docs/boda/04-mapa-de-modulos.md) | Qué compone cada módulo y de qué depende |
| [`docs/boda/05-plan-de-trabajo.md`](docs/boda/05-plan-de-trabajo.md) | Backlog por fases con criterios de aceptación |
| [`docs/boda/06-seguridad-y-privacidad.md`](docs/boda/06-seguridad-y-privacidad.md) | Tokens, funciones, RLS, cabeceras, privacidad |
| [`docs/boda/07-diseno-y-tipografia.md`](docs/boda/07-diseno-y-tipografia.md) | Principios, arquitectura de información, tokens, tipografías |
| [`docs/boda/08-propuesta.html`](docs/boda/08-propuesta.html) | Propuesta visual (también en https://claude.ai/artifact/QrcuFwuNyra9fmCwnXM7h9) |

## Trabajar con Claude Code en tu computadora

```bash
git clone https://github.com/chuygzz13/experiencias.git
cd experiencias
git checkout claude/elegant-mendel-mytfol

# Si tienes tu bóveda de Obsidian con notas de diseño, tipografía y seguridad:
claude --add-dir "/ruta/a/tu/boveda"
# o exporta OBSIDIAN_VAULT_PATH="/ruta/a/tu/boveda" antes de abrir claude
```

Dentro de Claude Code:

1. `/boda-contexto` — se pone al día con las reglas y la fase actual.
2. `/boda-obsidian` — lee tu bóveda y sintetiza lo útil en `docs/boda/09-notas-obsidian.md`, proponiendo cambios a las
   guías de diseño y seguridad.
3. Pide la primera tarea de la fase 1 en `docs/boda/05-plan-de-trabajo.md` (migración a Vite).

## Prototipo anterior

```bash
npm install
npm start
```
