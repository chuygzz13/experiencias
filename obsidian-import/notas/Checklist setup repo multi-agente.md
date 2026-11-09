---
tipo: checklist
tags: [ia-coding, checklist, github, setup]
confianza: criterio-propio
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Checklist setup repo multi-agente

Para dejar un repo listo para Cursor, Antigravity y Claude Code a la vez.

## Reglas y contexto
- [ ] `AGENTS.md` en la raíz, menos de 200 líneas ([[Reglas compartidas AGENTS]])
- [ ] `CLAUDE.md` solo si hay extras de Claude, empezando con `@AGENTS.md`
- [ ] No crear `GEMINI.md`
- [ ] `docs/specs/` con plantilla de spec de una página ([[Flujo Plan Ejecucion Revision]])
- [ ] `.cursor/BUGBOT.md` y/o `REVIEW.md` si usarás esos revisores ([[Patron Revisor cruzado en el PR]])

## Plantillas y convenciones
- [ ] `.github/ISSUE_TEMPLATE/` con objetivo, archivos, criterio de aceptación y comando de test
- [ ] `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] Prefijos de rama `claude/`, `cursor/`, `agy/` y regla "un agente, una rama, un worktree" ([[Patron Rama por agente con worktrees]])

## GitHub
- [ ] Workflow de CI: tipos, lint, build, tests ([[Guardrails GitHub para agentes]])
- [ ] Ruleset en `main`: PR obligatorio y checks requeridos
- [ ] CODEOWNERS para rutas sensibles
- [ ] Claude: `/install-github-app` y secret; workflow `@claude` con `--max-turns`, `--model`, `timeout-minutes`, `concurrency` ([[Patron Issue a PR con agente en la nube]])
- [ ] Elegir **un** revisor automático; el otro bajo demanda
- [ ] Revisar workflows con `issue_comment` antes de activar Auto-fix ([[Patron Auto-fix de PR]])

## Tokens
- [ ] Hook PreToolUse que filtra salida de tests ([[Optimizacion de tokens en Claude Code]])
- [ ] `/usage` como línea base; Sonnet por defecto; `/clear` entre tareas
- [ ] Desactivar servidores MCP que no uses

Relacionado: [[Trampas GitHub con agentes]], [[Patron Archivos en el repo como contrato]].
