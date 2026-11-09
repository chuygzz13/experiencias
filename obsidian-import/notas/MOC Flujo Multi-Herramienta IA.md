---
tipo: moc
tags: [ia-coding, moc, metodologia]
confianza: mixto
capturado: 2026-11-09
revisar: 2026-12-09
---

# MOC Flujo Multi-Herramienta IA

Mapa de contenido sobre cómo usar **Cursor**, **Antigravity** y **Claude Code** a la vez, optimizando tokens y conectándolos mediante **GitHub**. Capturado el 2026-11-09; las herramientas cambian rápido, revisa la fecha de cada nota.

> Leyenda de `confianza` (frontmatter): `verificado-oficial` = docs del fabricante · `fuente-secundaria` = blogs/foros, pueden contradecirse · `criterio-propio` = recomendación de diseño, no de una fuente · `mixto` = combina varias.

## Estrategia
- [[Estrategia reparto de tareas Cursor Antigravity Claude]] — qué hace cada una y qué no
- [[Flujo Plan Ejecucion Revision]] — ciclo de tres pasos
- [[Cuotas separadas como respaldo]] — tres presupuestos independientes

## Herramientas
- [[Herramienta Cursor]]
- [[Herramienta Antigravity]]
- [[Herramienta Claude Code]]

## Tokens
- [[Optimizacion de tokens en Claude Code]]

## Reglas compartidas
- [[Reglas compartidas AGENTS]]

## GitHub: cómo se conectan las tres
- [[Patron Rama por agente con worktrees]]
- [[Patron Issue a PR con agente en la nube]]
- [[Patron Revisor cruzado en el PR]]
- [[Patron Auto-fix de PR]]
- [[Patron Archivos en el repo como contrato]]
- [[Guardrails GitHub para agentes]]
- [[Trampas GitHub con agentes]]

## Operativo
- [[Checklist setup repo multi-agente]]

## Meta
- [[Fuentes y confianza multi-herramienta IA]]
- [[Pendientes de verificar multi-herramienta IA]]

## Consulta Dataview (opcional, requiere el plugin)

```dataview
TABLE confianza, revisar
FROM #ia-coding
WHERE tipo != "moc"
SORT revisar ASC
```
