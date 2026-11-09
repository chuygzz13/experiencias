---
tipo: patron
tags: [ia-coding, github, git, worktrees, paralelo]
confianza: mixto
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Patron Rama por agente con worktrees

**Idea:** una tarea, una rama, un worktree, un agente. Evita que dos herramientas se pisen los archivos.

```bash
git worktree add ../tarea-a -b agent/tarea-a main
```

## Qué dicen las fuentes
- Los worktrees comparten el almacén de objetos de git (no duplican el repo) y cada uno tiene sus archivos y su rama.
- Git impide la misma rama en dos worktrees: usa nombres únicos.
- **Los worktrees no eliminan los conflictos; los mueven** de sobrescrituras silenciosas a conflictos visibles al hacer merge.
- Integración **serial**: mergear una rama, rebasear la siguiente sobre `main` actualizado, repetir. Alguna guía añade un lock file cuando varios agentes terminan a la vez.
- Asigna a cada agente archivos sin traslape. "Dos agentes, mismos archivos" es un anti-patrón.
- Un PR por agente deja rastro auditable pero es más lento si muchos terminan juntos.
- **El cuello de botella es tu capacidad de revisar**, no el número de agentes.

## Por herramienta
- **Claude Code (oficial):** `claude --worktree nombre`; en otra terminal, otro nombre = sesión aislada. El repo necesita al menos un commit. Ver docs de Worktrees para limpieza y `.worktreeinclude`. [[Herramienta Claude Code]]
- **Antigravity (blogs):** abrir la carpeta del worktree como workspace en Agent Manager; en 2.0 hay opción de worktree y este no se borra al terminar. [[Herramienta Antigravity]]
- **Cursor:** no encontré fuente sobre worktrees. [[Herramienta Cursor]]

## Convención propuesta (criterio propio)
Prefijos de rama por herramienta: `claude/…`, `cursor/…`, `agy/…`. Útil para filtrar PRs y saber quién escribió qué.

Relacionado: [[Flujo Plan Ejecucion Revision]], [[Patron Revisor cruzado en el PR]], [[Guardrails GitHub para agentes]], [[Trampas GitHub con agentes]].
