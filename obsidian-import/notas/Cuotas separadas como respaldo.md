---
tipo: estrategia
tags: [ia-coding, cuotas, tokens, claude-code, cursor, antigravity]
confianza: mixto
capturado: 2026-11-09
revisar: 2026-12-09
up: "[[MOC Flujo Multi-Herramienta IA]]"
---

# Cuotas separadas como respaldo

Tres herramientas = tres presupuestos independientes. Si una se agota, las otras siguen.

## Verificado (docs oficiales de Claude)
- En suscripción, Claude Code tiene una ventana de 5 horas y una semanal, **compartidas entre modelos** y con el chat de Claude. Cambiar de modelo con `/model` no restaura el acceso, salvo en los límites específicos por modelo (por ejemplo "Opus limit").
- Con Claude Code v2.1.234 o posterior se puede esperar el reinicio y continuar la tarea automáticamente (`/rate-limit-options`; ajuste `autoContinueAtUsageLimit` para flotas).
- Las sesiones en la nube comparten el límite de la cuenta: tres tareas en paralelo consumen el triple.

## Fuente secundaria (sin verificar en páginas oficiales)
- **Cursor:** el modo Auto dejó de ser tarifa fija el 2026-08-24 y se factura al precio del modelo enrutado. Los modelos propios (Composer) serían el uso más barato del plan. Detalle en [[Herramienta Cursor]].
- **Antigravity:** plan gratis con cuota semanal; planes de pago con ventanas de 5 horas y tope semanal. Detalle en [[Herramienta Antigravity]].
- Un solo blog dice que el plan gratis de Antigravity incluye modelos Claude hasta el **2026-11-18**. Verificar en la app antes de depender de eso ([[Pendientes de verificar multi-herramienta IA]]).

## Criterio propio
- Pon el mayor gasto en la herramienta que uses para lo más difícil (normalmente Claude) y deja las otras en planes baratos.
- Si te quedas sin Claude, sigue con ejecución en Cursor o Antigravity usando las specs ya escritas ([[Flujo Plan Ejecucion Revision]]).
- Con cuenta corporativa, revisa la política de datos antes de enviar código a tres proveedores. Wikipedia indica que el IDE de Antigravity no tiene soporte empresarial desde octubre de 2026.

Relacionado: [[Estrategia reparto de tareas Cursor Antigravity Claude]], [[Optimizacion de tokens en Claude Code]].
