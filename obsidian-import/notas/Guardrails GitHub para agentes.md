---
tipo: guia
tags: [ia-coding, github, seguridad, ci, rulesets]
confianza: criterio-propio
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Guardrails GitHub para agentes

Los agentes escriben rápido; lo que los frena es la plataforma, no su buena voluntad.

## Gate de merge (recomendación)
La revisión por IA no debe ser el gate: Claude Code Review nunca aprueba ni bloquea ([[Patron Revisor cruzado en el PR]]). Las fuentes consultadas no cubren cómo hacer que la revisión de un agente bloquee el merge de otro, así que lo siguiente es diseño propio sobre funciones estándar de GitHub:

1. **Ruleset o branch protection en `main`:** PR obligatorio, sin push directo.
2. **Checks requeridos de CI:** tipos (`tsc --noEmit`), lint, build y tests. Si CI está en verde y un humano aprueba, se mergea.
3. **CODEOWNERS** con revisión obligatoria en rutas sensibles (auth, pagos, infraestructura, workflows).
4. **Etiquetas de ruteo** (`agent:cursor`, `agent:claude`, `agent:agy`) para saber quién tomó la tarea; un kit comunitario enruta issues por etiquetas con lista permitida.
5. **Integración serial:** mergear uno, rebasear el siguiente, volver a correr CI ([[Patron Rama por agente con worktrees]]).

## Control de gasto y de abuso en Actions
- Permisos mínimos por workflow; `timeout-minutes`; `concurrency`; `--max-turns` y `--model` en `claude_args` ([[Patron Issue a PR con agente en la nube]]).
- Secretos solo en GitHub Secrets, nunca en el repo. Para repos compartidos, API key de la Consola en vez de token OAuth personal; alternativa sin secreto de larga vida: federación de identidad (OIDC).
- Los PRs de forks no reciben secretos en repos públicos: la revisión corre solo en ramas del mismo repo.
- Si usas CODEOWNERS, verifica que el workflow tenga los permisos necesarios (observado en la revisión de un repo de ejemplo).

## Instalación de la App
La GitHub App de Claude pide un conjunto fijo de permisos (acciones, checks, contenido, discusiones, issues, PRs, hooks, workflows, etc.). No se puede aceptar un subconjunto. Si tu organización lo exige, crea una app propia con Contents, Issues y Pull requests (cubre solo la Action; Code Review y auto-fix web exigen la oficial).

Relacionado: [[Trampas GitHub con agentes]], [[Checklist setup repo multi-agente]], [[Patron Auto-fix de PR]].
