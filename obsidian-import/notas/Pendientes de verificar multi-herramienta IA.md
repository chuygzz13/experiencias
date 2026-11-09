---
tipo: pendientes
tags: [ia-coding, pendientes, verificacion]
confianza: criterio-propio
capturado: 2026-11-09
revisar: 2026-11-20
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Pendientes de verificar multi-herramienta IA

Datos que quedaron sin confirmar en fuente oficial. Marca cada uno al verificarlo y actualiza la nota de origen y su campo `confianza`.

## Cursor ([[Herramienta Cursor]])
- [ ] Planes y precios vigentes (Free, Plus $8, Premium $30, Super $100, Ultra $200 vs esquema anterior) → `cursor.com/pricing`
- [ ] Fin del Auto de tarifa fija el 2026-08-24 y facturación al precio del modelo enrutado
- [ ] Composer 2.5 como uso más barato del pool
- [ ] Comando exacto de Bugbot: `cursor review`, `bugbot run` o `@cursor review` ([[Patron Revisor cruzado en el PR]])
- [ ] `@cursor` en comentarios de issue de GitHub ([[Patron Issue a PR con agente en la nube]])
- [ ] Soporte de worktrees en Cursor ([[Patron Rama por agente con worktrees]])
- [ ] Lectura de `AGENTS.md` por Cursor ([[Reglas compartidas AGENTS]])

## Antigravity ([[Herramienta Antigravity]])
- [ ] **Caduca el 2026-11-18:** ¿el plan gratis incluye modelos Claude y GPT-OSS hasta esa fecha? ([[Cuotas separadas como respaldo]])
- [ ] Cuotas y precios reales (AI Pro, Ultra $100/$200/$249.99)
- [ ] Disponibilidad pública del CLI `agy`
- [ ] Ruta de skills: `~/.gemini/antigravity/skills/` vs `.agents/skills/`
- [ ] AGENTS.md nativo y precedencia de `GEMINI.md`
- [ ] ¿Hay integración nativa con GitHub (PRs, agente en la nube)?
- [ ] Soporte empresarial del IDE (Wikipedia: sin soporte desde octubre de 2026)

## Cruzado
- [ ] Cómo hacer que la revisión de un agente condicione el merge de otro ([[Guardrails GitHub para agentes]])
- [ ] Comportamiento de `claude-code-action` con `AGENTS.md` en el runner (la docs cubre CLAUDE.md; confirmar)

## Cómo verificar
Con red abierta a `cursor.com` y `antigravity.google`, o leyendo las páginas oficiales a mano. Al terminar, mueve `confianza` a `verificado-oficial` y actualiza `revisar`.
