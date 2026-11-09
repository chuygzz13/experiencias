---
tipo: estrategia
tags: [ia-coding, flujo, claude-code, cursor, antigravity]
confianza: criterio-propio
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Flujo Plan Ejecucion Revision

Ciclo de tres pasos que reparte el trabajo entre herramientas y mantiene el contexto pequeño.

1. **Plan — [[Herramienta Claude Code]] en modo plan** (`Shift+Tab` o `claude --permission-mode plan`). Produce `docs/specs/<feature>.md` de una página: archivos a tocar, criterios de aceptación, comando de test. Pocos tokens, mucho apalancamiento.
2. **Ejecución — [[Herramienta Cursor]] o [[Herramienta Antigravity]].** Cursor si es pequeña; Antigravity si es grande, paralela o de UI. Ambos leen [[Reglas compartidas AGENTS]] y la spec. Alternativa oficial de Claude: guardar el plan en el repo, hacer commit y push, y lanzar `claude --cloud "Ejecuta el plan en docs/..."` ([[Patron Issue a PR con agente en la nube]]).
3. **Revisión — Claude Code en sesión limpia.** `/clear`, Sonnet, `git diff main...rama` más los tests. Ver [[Patron Revisor cruzado en el PR]].

**Git es el canal de traspaso.** Una rama/worktree por herramienta ([[Patron Rama por agente con worktrees]]); nunca dos herramientas sobre los mismos archivos a la vez.

## Anti-patrones
- Pedir a Claude Code "explora el repo": escaneo amplio = tokens. Sé específico.
- Opus para renombres o ediciones triviales ([[Optimizacion de tokens en Claude Code]]).
- Sesiones largas sin `/clear`; muchos servidores MCP activos; reglas duplicadas en varios archivos.
- Tres herramientas editando los mismos archivos.

## Procedencia
Criterio propio apoyado en docs oficiales de Claude (modo plan, `/clear`, `--cloud` con plan guardado en el repo). Ver [[Fuentes y confianza multi-herramienta IA]].
