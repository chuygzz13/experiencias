---
tipo: patron
tags: [ia-coding, github, autofix, ci, claude-code, cursor]
confianza: mixto
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Patron Auto-fix de PR

Un agente vigila el PR y responde a CI en rojo y a comentarios de revisión.

## Claude Code (oficial)
- Requiere la GitHub App de Claude instalada en el repo.
- Activación: en una sesión en la nube, menú **⋮** del PR en la tarjeta *Changes* → Auto-fix; desde terminal `/autofix-pr` en la rama del PR (detecta el PR con `gh`, lanza sesión en la nube y lo activa); desde móvil, pidiéndolo; o pegando la URL del PR.
- Comportamiento: arreglo claro → lo hace, hace push y lo explica. Petición ambigua o arquitectónica → te pregunta. Evento duplicado → lo anota y sigue.
- **No reacciona a conflictos de merge** (GitHub no emite webhook cuando la base avanza). Pídele que rebasee.
- Sus respuestas en hilos se publican con tu usuario, etiquetadas como Claude Code.
- **Advertencia:** si el repo tiene automatización por comentario (Atlantis, Terraform Cloud, workflows con `issue_comment`), esas respuestas pueden dispararla. Revisa antes de activarlo.
- Para detener: apaga Auto-fix o dile que deje de vigilar.

## Cursor (fuentes secundarias)
**Bugbot Autofix** lanza un cloud agent en una VM para parchear lo que Bugbot encuentra. Una fuente secundaria dice que ya salió de beta (sin verificar). [[Patron Revisor cruzado en el PR]]

Relacionado: [[Patron Issue a PR con agente en la nube]], [[Trampas GitHub con agentes]], [[Guardrails GitHub para agentes]], [[Herramienta Claude Code]].
