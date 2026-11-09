---
tipo: guia
tags: [ia-coding, tokens, claude-code, costos]
confianza: verificado-oficial
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Optimizacion de tokens en Claude Code

Fuente: documentación oficial "Manage costs effectively". Los costos escalan con el tamaño del contexto, que se reenvía en cada turno.

**Referencia de gasto (empresas):** unos $13 por desarrollador por día activo; $150–250 por mes; menos de $30 por día para el 90 %.

## Contexto
- `/clear` entre tareas no relacionadas (antes `/rename` para poder `/resume`). Cuesta cero.
- `/compact <qué conservar>` si necesitas continuidad. Compactar un contexto grande es en sí una petición grande.
- Sección "Compact instructions" en `CLAUDE.md` para fijar qué se preserva.
- `/context` muestra qué lo infla.

## Modelo y razonamiento
- Sonnet por defecto; Opus solo para arquitectura o razonamiento de varios pasos.
- Subagentes con tareas verbosas (tests, logs, docs) en `model: haiku`.
- `/effort` baja el esfuerzo en tareas simples. `MAX_THINKING_TOKENS` solo aplica a modelos con presupuesto fijo; los 5.5 y Fable no permiten apagar el pensamiento.

## Instrucciones y herramientas
- `CLAUDE.md` por debajo de 200 líneas. Instrucciones de flujos específicos → **skills** (cargan bajo demanda). Los `@imports` **no** reducen el costo de contexto. Reglas por ruta en `.claude/rules/` con `paths:` cargan solo cuando aplican.
- MCP: prefiere CLIs (`gh`, `aws`, `gcloud`) y desactiva servidores con `/mcp`. Las definiciones de herramientas MCP ya vienen diferidas por defecto.
- **Hooks** PreToolUse para filtrar salidas: p. ej. tests con `grep -A 5 -E '(FAIL|ERROR|error:)' | head -100` baja decenas de miles de tokens a cientos.
- Plugins de inteligencia de código (lenguajes tipados) reducen lecturas de archivos.

## Hábitos
- Prompts específicos ("agrega validación en la función de login de auth.ts"), no vagos.
- Modo plan antes de implementar; `Esc` y `/rewind` para corregir rumbo temprano.
- Da criterios de verificación (tests, capturas) y prueba de forma incremental.

## Caché y consumo en segundo plano
- Con prompt caching, el historial se relee a tarifa de caché; el primer mensaje tras una pausa mayor al TTL reprocesa todo el contexto. Antes de pausas largas, `/clear`.
- Consumen tokens en inactividad: tareas programadas de sesión, mensajes entre sesiones, goal check-ins, resumen de sesión, compactación inactiva y sugerencias de prompt.
- **Agent teams:** unas 7 veces más tokens que una sesión normal. Desactivados por defecto.

## Medición
`/usage` (atribución por skills, subagentes, plugins y MCP; recomendaciones; con `f` aplica las que puede desde v2.1.305), línea `Prompt cache`, `/insights`.

Relacionado: [[Herramienta Claude Code]], [[Cuotas separadas como respaldo]], [[Flujo Plan Ejecucion Revision]], [[Reglas compartidas AGENTS]].
