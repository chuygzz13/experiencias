---
tipo: patron
tags: [ia-coding, github, code-review, bugbot, claude-code, cursor]
confianza: mixto
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Patron Revisor cruzado en el PR

Una herramienta escribe y otra revisa el PR. Es el patrón más común para combinar las tres.

## Cursor Bugbot (ayuda y foro de Cursor, vía búsqueda)
- Revisa automáticamente al crear o actualizar el PR; comentarios en línea con explicación y arreglo sugerido.
- Revisión manual comentando `cursor review` o `bugbot run` (el foro también menciona `@cursor review`: verificar forma exacta).
- Aparece como check **Cursor Bugbot**. Guía del proyecto en `.cursor/BUGBOT.md`.
- Reportes del foro: no se dispara en PRs de colaboradores; `@cursor` falla en GitHub Enterprise.
- Detalle del arreglo automático: [[Patron Auto-fix de PR]].

## Claude Code Review (oficial; Team y Enterprise, solo GitHub)
- Varios agentes leen el diff y el código cercano, un paso de verificación filtra falsos positivos, se ordena por severidad y se publica: comentarios en línea, resumen y check **Claude Code Review**.
- **Nunca aprueba ni bloquea** y el check no concluye en fallo: la decisión de merge sigue siendo tuya.
- Cuándo corre (por repo): al abrir el PR, tras cada push, o solo bajo petición (`@claude review`, requiere permiso de escritura). Niveles: Quick, Standard (por defecto) y Deep; más profundo cuesta más.
- Personalizable con `REVIEW.md` y `CLAUDE.md`; `REVIEW.md` se lee de la rama base, nunca de los cambios del PR.
- Solo lectura y sin ejecutar código. No disponible con Zero Data Retention, HIPAA ni CMEK.
- Alternativas: la Action con el plugin `code-review` (cualquier plan con API key o token), `/code-review` local (cualquier plan) o un subagente propio.

```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: "https://github.com/anthropics/claude-plugins-official.git"
          plugins: "code-review@claude-plugins-official"
          prompt: "/code-review:code-review --comment ${{ github.repository }}/pull/${{ github.event.pull_request.number }}"
          claude_args: '--allowedTools "mcp__github_inline_comment__create_inline_comment"'
```

## Otros
- Copilot también revisa PRs; existe la herramienta comunitaria `agent-reviews` (CLI para listar y triar comentarios de bots como Copilot y Cursor Bugbot).

## Regla (criterio propio)
**Un solo revisor automático y el otro bajo demanda**: dos bots duplican comentarios, ruido y gasto. El gate real es CI obligatorio más tu aprobación ([[Guardrails GitHub para agentes]]).

Relacionado: [[Herramienta Cursor]], [[Herramienta Claude Code]], [[Flujo Plan Ejecucion Revision]], [[Trampas GitHub con agentes]].
