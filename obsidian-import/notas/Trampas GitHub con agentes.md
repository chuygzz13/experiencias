---
tipo: guia
tags: [ia-coding, github, troubleshooting, claude-code, cursor]
confianza: mixto
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Trampas GitHub con agentes

## Verificadas (docs oficiales de Claude)
- **CI no corre en los commits de la Action** si le pasas `github_token: ${{ secrets.GITHUB_TOKEN }}`: GitHub no dispara workflows con ese token. Quita la línea para que se autentique como la GitHub App, o usa un token de app propio.
- **Bots rechazados:** la Action rechaza actores bot salvo los listados en `allowed_bots`. También aplica a ejecuciones programadas, que GitHub atribuye al último usuario que cambió el `cron`.
- **Auto-fix responde con tu usuario** y puede disparar workflows `issue_comment` (Atlantis, Terraform Cloud). [[Patron Auto-fix de PR]]
- **Conflictos de merge:** el auto-fix no los detecta; pide rebase.
- **Claude Code Review no aprueba ni bloquea.** [[Guardrails GitHub para agentes]]
- **Cuotas compartidas:** las sesiones en la nube usan el mismo límite de la cuenta; N tareas en paralelo = N veces el consumo. [[Cuotas separadas como respaldo]]
- **Token OAuth personal:** está atado a quien lo generó; para repos de equipo usa API key.
- **Comentarios `@claude`:** deben contener `@claude` como palabra completa; no funcionan `/claude` ni `@claude-bot`.
- **`claude --cloud` clona la rama de GitHub, no tu checkout local:** haz push primero.
- **Workflows programados:** GitHub los corre solo desde la rama por defecto y, en repos públicos, los desactiva tras 60 días sin actividad.
- **Zero Data Retention, HIPAA y CMEK:** Code Review no disponible; las sesiones en la nube tampoco en ZDR/HIPAA/CMEK.

## Fuente secundaria
- Foro de Cursor: Bugbot no se dispara en PRs de colaboradores; `@cursor` falla en GitHub Enterprise. [[Patron Revisor cruzado en el PR]]
- Dos bots revisando el mismo PR duplican comentarios y gasto.
- Los worktrees mueven los conflictos al merge en vez de evitarlos. [[Patron Rama por agente con worktrees]]
- El cuello de botella real es tu capacidad de revisar.

Relacionado: [[Patron Issue a PR con agente en la nube]], [[Checklist setup repo multi-agente]].
