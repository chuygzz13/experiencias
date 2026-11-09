---
tipo: guia
tags: [ia-coding, agents-md, claude-md, reglas, cursor, antigravity, claude-code]
confianza: mixto
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Reglas compartidas AGENTS

Una sola fuente de reglas para las tres herramientas evita repetir contexto (y tokens).

## Verificado (docs oficiales de Claude Code)
- Claude Code lee `AGENTS.md` de forma nativa desde la **v2.1.277**. Los blogs que dicen lo contrario están desactualizados.
- **Solo** lo lee si no hay ningún `CLAUDE.md`, `.claude/CLAUDE.md` ni `CLAUDE.local.md` en el directorio de trabajo o por encima. Si existen ambos archivos, Claude usa solo `CLAUDE.md`.
- Un `CLAUDE.md` puede importarlo con `@AGENTS.md`: Claude lee el `CLAUDE.md` con `AGENTS.md` incluido.
- `~/.claude/CLAUDE.md`, el `CLAUDE.md` gestionado por la organización y `.claude/rules/` siguen cargando junto a `AGENTS.md`.
- En subdirectorios, carga el `AGENTS.md` de esa carpeta al leer un archivo allí (si no tiene `CLAUDE.md` propio).
- En algunas sesiones no puede leer `AGENTS.md`: ahí se importa desde `CLAUDE.md`.
- Tamaño: menos de 200 líneas por archivo. Los imports organizan pero no reducen costo ([[Optimizacion de tokens en Claude Code]]).

## Fuente secundaria
- **Cursor** lee `AGENTS.md` y `CLAUDE.md` en la raíz, además de `.cursor/rules`; `.cursorrules` es legacy ([[Herramienta Cursor]]).
- **Antigravity** lee `AGENTS.md` (nativo desde v1.20.3, según un blog) y `GEMINI.md`, que tiene precedencia en el mismo directorio ([[Herramienta Antigravity]]).

## Recomendación (criterio propio)
1. `AGENTS.md` en la raíz como fuente única.
2. `CLAUDE.md` solo si hay instrucciones exclusivas de Claude, y que empiece con `@AGENTS.md`.
3. No crear `GEMINI.md`.
4. Reglas por alcance: `.cursor/rules` (Cursor) y `.claude/rules/` con `paths:` (Claude).

## Esqueleto de AGENTS.md
```markdown
# Proyecto
Stack: <framework, lenguaje, versiones>
## Comandos
- Instalar: <cmd> · Desarrollo: <cmd> · Build: <cmd> · Tests: <cmd> · Tipos/lint: <cmd>
## Convenciones
- <estructura de carpetas, estilo de componentes, nombres>
## Límites
- No tocar: <rutas>. No agregar dependencias sin preguntar.
## Definición de terminado
- Tests y tipos pasan; diff mínimo; sin cambios fuera del alcance de la spec.
```

Relacionado: [[Patron Archivos en el repo como contrato]], [[Checklist setup repo multi-agente]], [[Estrategia reparto de tareas Cursor Antigravity Claude]].
