---
tipo: herramienta
tags: [ia-coding, cursor, herramienta]
confianza: fuente-secundaria
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Herramienta Cursor

**Rol:** editor interactivo (base VS Code) donde tú llevas el control. Latencia baja, diffs visibles, contexto pequeño.

## Úsala para
Tab (autocompletado), ediciones inline, cambios de 1–3 archivos ya ubicados, renombres, ajustes de JSX y estilos, errores de TS/ESLint, preguntas sobre código con `@archivo`. Para refactors grandes o depuración profunda, ver [[Herramienta Claude Code]].

## Planes y cuotas (SIN VERIFICAR: `cursor.com` no fue accesible)
- Una fuente de noviembre de 2026 lista planes para clientes nuevos: Free, Plus $8, Premium $30, Super $100, Ultra $200 (equipos desde $30 por usuario). Otras guías listan el esquema anterior (Pro $20, Pro+ $60, Ultra $200). Las fuentes se contradicen: confirma en `cursor.com/pricing`.
- Los planes de pago incluirían un pool semanal para modelos propios de Cursor (Composer 2.5) y Grok.
- Varias fuentes: el modo Auto dejó de ser de tarifa fija el 2026-08-24 y se factura al precio de lista del modelo enrutado. Las guías que lo llaman "ilimitado" están desactualizadas.
- Composer 2.5 aparece como lo más barato del pool (fuente única).

## Reglas y contexto
- Lee `AGENTS.md` en la raíz (según la doc de su CLI, citada por blogs) y `.cursor/rules` para reglas por alcance. `.cursorrules` es legacy. Ver [[Reglas compartidas AGENTS]].

## En GitHub
- **Bugbot** revisa PRs automáticamente ([[Patron Revisor cruzado en el PR]]) y su **Autofix** lanza un cloud agent ([[Patron Auto-fix de PR]]).
- Cloud agents invocables con `@cursor` desde Slack, Linear o comentarios de issue (una sola fuente; ver [[Patron Issue a PR con agente en la nube]]).
- No encontré fuente sobre soporte de worktrees en Cursor ([[Patron Rama por agente con worktrees]]).

Relacionado: [[Estrategia reparto de tareas Cursor Antigravity Claude]], [[Cuotas separadas como respaldo]], [[Fuentes y confianza multi-herramienta IA]].
