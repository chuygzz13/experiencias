---
tipo: patron
tags: [ia-coding, github, github-actions, claude-code, cursor, nube]
confianza: mixto
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Patron Issue a PR con agente en la nube

Comentas en un issue o PR y un agente trabaja en una VM o en un runner y abre el PR.

## Claude Code (oficial)
- **GitHub Action** `anthropics/claude-code-action@v1`. Instalación rápida: `/install-github-app` (requiere `gh` autenticado y ser admin del repo). Crea el secret `ANTHROPIC_API_KEY` o `CLAUDE_CODE_OAUTH_TOKEN` (suscripción, generado con `claude setup-token`) y un PR con el workflow.
- **Modo interactivo** (sin `prompt`): responde a `@claude` en issues y PRs. **Modo automatización** (con `prompt`): corre en cualquier evento, incluido `cron`.
- Quién puede disparar: usuarios con permiso de escritura (`allowed_non_write_users` para excepciones) y actores humanos (bots solo si están en `allowed_bots`, para evitar bucles).

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
      actions: read
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

- **Sesiones en la nube:** `claude --cloud "tarea"` crea una sesión que clona la rama **de GitHub** (haz push antes). Varias órdenes = varias sesiones en paralelo. `claude --teleport` la trae al terminal.
- **Planear local, ejecutar en la nube:** guarda el plan en el repo, commit y push, luego `claude --cloud "Ejecuta el plan en docs/..."`.
- **Costo:** `claude_args: "--max-turns 5 --model claude-sonnet-5"`, `timeout-minutes`, `concurrency` y plantillas de issue con contexto. Mantén `CLAUDE.md` corto. Consume minutos de Actions y tokens (o tu suscripción si usas el token OAuth).

## Cursor (fuente secundaria, sin verificar)
Un write-up práctico dice que se entrega un bug a un cloud agent con `@cursor` en Slack, un comentario de issue de GitHub, Linear, la API o la web. Es la única fuente del camino por comentario de issue. [[Herramienta Cursor]]

## Antigravity
No encontré agente nativo en GitHub. Lo común: `gh` en la terminal integrada. Hay guías comunitarias sobre agentes en segundo plano y CI/CD (sin verificar). `/schedule` ofrece ejecución recurrente. [[Herramienta Antigravity]]

Relacionado: [[Patron Revisor cruzado en el PR]], [[Patron Auto-fix de PR]], [[Trampas GitHub con agentes]], [[Optimizacion de tokens en Claude Code]], [[Herramienta Claude Code]].
