---
tipo: estrategia
tags: [ia-coding, estrategia, cursor, antigravity, claude-code]
confianza: mixto
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Estrategia reparto de tareas Cursor Antigravity Claude

**Principio:** cada herramienta consume su propia cuota. Eficiencia = enrutar cada tarea hacia la herramienta más barata que la resuelva bien, y reservar la cuota más cara (Claude, sobre todo Opus) para razonamiento difícil.

| Herramienta | Úsala para | No la uses para |
|---|---|---|
| [[Herramienta Cursor]] (editor, tú al mando) | Tab e inline; cambios de 1–3 archivos ya ubicados; renombres; JSX y estilos; errores de TS/ESLint; preguntas con `@archivo` | Refactors grandes o depuración profunda |
| [[Herramienta Antigravity]] (delegar y paralelizar) | Features acotadas con spec; andamiaje; varios agentes en paralelo (Agent Manager); verificar UI en navegador (`/browser`); tareas largas con Gemini Flash | Refactors delicados (poco predecible según comparativas); aceptar su salida sin revisar |
| [[Herramienta Claude Code]] (terminal, razonamiento) | Plan de features no triviales; refactors multiarchivo; causa raíz de bugs; tests; revisar diffs; commits y PRs; headless `-p` y CI | Renombres triviales; "explora el repo" |

## Por qué funciona
- Revisar un diff es barato: solo entra el diff al contexto, no el repo entero → [[Flujo Plan Ejecucion Revision]].
- Cuotas independientes dan respaldo si una se agota → [[Cuotas separadas como respaldo]].
- Un solo archivo de reglas evita repetir contexto → [[Reglas compartidas AGENTS]].
- Cómo no gastar de más en Claude → [[Optimizacion de tokens en Claude Code]].
- Cómo se conectan en GitHub → [[Patron Rama por agente con worktrees]] y [[Patron Revisor cruzado en el PR]].

## Procedencia
El reparto sale de comparativas de blogs (opinión; consenso: Cursor = edición manual, Claude Code = razonamiento y producción, Antigravity = delegación en paralelo) más criterio propio. Las capacidades de Claude Code están verificadas en docs oficiales. Ver [[Fuentes y confianza multi-herramienta IA]].
