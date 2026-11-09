---
tipo: herramienta
tags: [ia-coding, antigravity, google, herramienta]
confianza: fuente-secundaria
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Herramienta Antigravity

**Rol:** delegar y paralelizar. Se posiciona como "mission control" de agentes autónomos; verifica su propio trabajo (navegador, capturas).

## Úsala para
Features acotadas con spec, andamiaje, varios agentes en paralelo desde Agent Manager, verificación de UI en navegador, tareas largas con Gemini Flash. **Cuidado:** varias comparativas la describen como poco predecible para refactors delicados; revisa siempre su salida ([[Flujo Plan Ejecucion Revision]]).

## Antigravity 2.0 (Google I/O, 2026-05-19; fuentes secundarias)
- App de escritorio independiente con modos Editor y Agent Manager.
- CLI reescrita en Go, sucesora de Gemini CLI (comando `agy`; un reporte temprano decía que aún no era pública, sin confirmar). Conserva skills, hooks, subagentes y extensiones (renombradas plugins).
- `/browser`: subagente de navegador con Chrome DevTools MCP. `/schedule`: ejecución recurrente tipo cron.

## Cuotas y precios (SIN VERIFICAR: `antigravity.google` no fue accesible)
- Google no publica cuotas absolutas. Plan gratis: cuota de agente semanal. Planes de pago: ventanas de 5 horas con tope semanal.
- Precios citados: Google AI Pro ≈ $19.99; Ultra $100 y $200 (otra fuente: $249.99).
- Modelos del plan gratis: Gemini 3.8 Flash; hasta 2026-11-18 también Claude Sonnet 4.6, Opus 4.6 y GPT-OSS-120b (**una sola fuente**; verificar).
- Wikipedia: el IDE no tiene soporte empresarial desde octubre de 2026; app de escritorio y CLI siguen actualizándose.

## Reglas y skills
- AGENTS.md nativo desde v1.20.3 (marzo 2026, según un blog). Si existe `GEMINI.md` en el mismo directorio, **tiene precedencia** sobre AGENTS.md: no lo crees. Ver [[Reglas compartidas AGENTS]].
- Rutas de skills contradictorias entre fuentes (`~/.gemini/antigravity/skills/` vs `.agents/skills/`). Verificar ([[Pendientes de verificar multi-herramienta IA]]).

## En GitHub
- No encontré integración oficial nativa con GitHub. Lo común: `git` y `gh` en la terminal integrada, y el agente redacta mensajes de commit y cuerpos de PR.
- Worktrees: abrir cada carpeta de worktree como workspace en Agent Manager; en 2.0 hay opción de worktree y este no se elimina al terminar. Ver [[Patron Rama por agente con worktrees]].

Relacionado: [[Estrategia reparto de tareas Cursor Antigravity Claude]], [[Cuotas separadas como respaldo]], [[Fuentes y confianza multi-herramienta IA]].
