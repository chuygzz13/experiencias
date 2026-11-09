---
tipo: herramienta
tags: [ia-coding, claude-code, anthropic, herramienta]
confianza: verificado-oficial
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Herramienta Claude Code

**Rol:** agente de terminal para razonamiento y trabajo de producción. Es la única de las tres con integración oficial documentada de punta a punta con GitHub.

## Úsalo para
Plan de features no triviales, refactors multiarchivo, causa raíz de bugs, tests, revisar el diff de lo que hicieron otras herramientas, commits y PRs, modo headless (`claude -p`) y CI. **No** para renombres triviales ni "explora el repo".

## Funciones oficiales que importan aquí
- **Modo plan:** `Shift+Tab` o `claude --permission-mode plan`. Propone sin editar hasta que apruebes.
- **Subagentes, skills, hooks, MCP** y reglas por ruta en `.claude/rules/` con `paths:`.
- **Worktrees:** `claude --worktree nombre` ([[Patron Rama por agente con worktrees]]).
- **Nube:** `claude --cloud "tarea"`; `--teleport` trae la sesión al terminal ([[Patron Issue a PR con agente en la nube]]).
- **GitHub:** Action `claude-code-action`, `/install-github-app`, Code Review, `/autofix-pr` ([[Patron Revisor cruzado en el PR]], [[Patron Auto-fix de PR]]).
- **Medición:** `/usage`, `/context`, `/insights` ([[Optimizacion de tokens en Claude Code]]).
- Los modelos 5.5 (Opus, Sonnet, Haiku) y los Fable no permiten apagar el pensamiento extendido; se controla con `/effort`.
- Memoria: lee `CLAUDE.md`, y `AGENTS.md` si no hay `CLAUDE.md` ([[Reglas compartidas AGENTS]]).

## Cuota
Ventanas de 5 horas y semanal compartidas entre modelos: [[Cuotas separadas como respaldo]].

Relacionado: [[Estrategia reparto de tareas Cursor Antigravity Claude]], [[Flujo Plan Ejecucion Revision]], [[Fuentes y confianza multi-herramienta IA]].
