---
tipo: patron
tags: [ia-coding, github, convenciones, agents-md, plantillas]
confianza: mixto
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Patron Archivos en el repo como contrato

Las tres herramientas no se hablan entre sí, pero todas leen el repo. Los archivos versionados son el contrato compartido.

| Archivo | Quién lo lee | Para qué |
|---|---|---|
| `AGENTS.md` | Claude Code, Cursor, Antigravity | Reglas únicas. Ver [[Reglas compartidas AGENTS]] |
| `CLAUDE.md` (con `@AGENTS.md`) | Claude Code | Extras exclusivos de Claude |
| `.claude/rules/*.md` con `paths:` | Claude Code | Reglas que cargan solo por ruta |
| `.cursor/rules` | Cursor | Reglas por alcance |
| `.cursor/BUGBOT.md` | Cursor Bugbot | Guía de revisión |
| `REVIEW.md` | Claude Code Review | Qué marcar al revisar (se lee de la rama base) |
| `docs/specs/<feature>.md` | Todas | Spec de una página: archivos, criterios, test ([[Flujo Plan Ejecucion Revision]]) |
| `.github/ISSUE_TEMPLATE/*` | Humanos y agentes | Contexto de entrada con criterios de aceptación |
| `.github/PULL_REQUEST_TEMPLATE.md` | Todas | Estructura de PR y checklist |
| `.github/workflows/*` | GitHub Actions | CI obligatorio y automatizaciones ([[Guardrails GitHub para agentes]]) |

## Ejemplo comunitario
El proyecto `tganzerli/agent-dev-methodology` (PR #28) añade soporte para el CLI de Antigravity, una plantilla de PR y hace que su kit **adopte la rama o worktree que la herramienta ya creó** en vez de crear una segunda. No es una función oficial de ningún proveedor.

Relacionado: [[Checklist setup repo multi-agente]], [[Patron Rama por agente con worktrees]], [[Patron Revisor cruzado en el PR]].
