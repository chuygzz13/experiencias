# Prompt de ingesta: metodologías multi-herramienta IA → vault de Obsidian

**Contenido del paquete:** 19 notas en `notas/` (1 MOC + 18 notas atómicas, todas enlazadas entre sí) y este archivo. Este archivo NO se importa al vault.

## Cómo usarlo (humano)
1. Copia la carpeta `obsidian-import/` dentro de tu vault, por ejemplo a `_inbox-ia/`.
2. Abre Claude Code en la **raíz del vault**, en modo plan: `claude --permission-mode plan`.
3. Pega esto:

> Lee `_inbox-ia/obsidian-import/PROMPT-INGESTA.md` y sigue sus instrucciones. Empieza por la Fase 0 y 1 y espera mi aprobación antes de escribir nada.

---

## Instrucciones para Claude Code

### Objetivo
Integrar las notas de `notas/` (junto a este archivo) en el vault actual como parte del grafo de conocimiento existente: sin duplicar, sin sobrescribir, con enlaces bidireccionales hacia notas relacionadas que ya existan. Idioma de las notas: español.

### Reglas duras
1. **No borres ni sobrescribas** notas existentes. Si hay colisión de nombre o de tema, fusiona añadiendo al final una sección `## Actualización 2026-11-09` con solo lo nuevo.
2. **No modifiques `.obsidian/`** (solo lectura, y solo si necesitas ver qué plugins hay).
3. Fuera de la carpeta destino, lo único permitido es **añadir una línea `Ver también: [[…]]` al final** de notas existentes. Lista cada archivo que toques.
4. **Conserva** `confianza`, `capturado`, `revisar`, `tipo` y las secciones de procedencia y fuentes. Está prohibido subir a `verificado-oficial` cualquier dato marcado `fuente-secundaria` o pendiente. No hagas búsquedas web para "confirmar" salvo que yo lo pida.
5. No inventes datos, rutas locales ni secretos. No copies este archivo al vault.
6. **Seguridad antes de escribir:**
   - Si el vault es un repo git: confirma que el árbol está limpio y crea la rama `ingesta-ia-coding`.
   - Si no es git: copia la carpeta destino (o su carpeta padre) a un respaldo fuera del vault.
7. **Ahorra tokens:** no leas el vault completo. Usa Glob y Grep. Muestrea como máximo 8 notas existentes para aprender convenciones. Al terminar, sugiéreme hacer `/clear`.

### Fase 0 — Reconocer el vault (solo lectura)
1. Lista las carpetas de primer nivel y cuenta las notas `.md`.
2. Busca archivos de convenciones: `CLAUDE.md`, `AGENTS.md`, `README.md`, `_Index`, `MOC`, plantillas (`Templates/`, `Plantillas/`).
3. Muestrea ≤ 8 notas variadas y extrae: claves de frontmatter en uso, estilo de tags (`#tag` vs lista YAML, minúsculas, jerarquía con `/`), idioma, estilo de nombres de archivo, si usan MOCs, `up:`/`related:`, Dataview, carpetas tipo PARA/Zettelkasten/Johnny Decimal.
4. Resume en 10 líneas las convenciones detectadas.

### Fase 1 — Plan (preséntamelo y ESPERA mi aprobación)
1. **Carpeta destino propuesta.** Si el vault ya tiene un lugar natural (p. ej. `Conocimiento/`, `Recursos/`, `Tecnología/`), úsalo; si no, `Conocimiento/IA-Coding/`.
2. **Búsqueda de colisiones.** Con Grep sobre el vault (nombres de archivo, alias y contenido) busca: `Cursor`, `Antigravity`, `Claude Code`, `AGENTS.md`, `CLAUDE.md`, `worktree`, `Bugbot`, `GitHub Actions`, `MOC`, `tokens`, `prompt`. Lista cada nota existente que se solape con alguna del paquete.
3. **Tabla de mapeo** con una fila por nota: nombre en el paquete → destino → acción (`crear` | `fusionar con <nota>` | `omitir, ya cubierto`) → adaptaciones de frontmatter.
4. **Adaptación de frontmatter.** Mapea las claves del paquete a las convenciones del vault (p. ej. `up` → la clave que ya uses; `tags` al estilo del vault), pero conserva siempre `confianza`, `capturado`, `revisar` y `tipo`. Si el vault no usa frontmatter, mantenlo igualmente.
5. **Enlaces propuestos hacia notas existentes.** Para cada nota nueva, hasta 3–5 candidatas (nota existente + motivo). Indica cuántas notas existentes se modificarían; todas con cambios del tipo `Ver también`.
6. **Riesgos.** Cualquier cosa que pueda dañar el grafo (nombres duplicados, alias que chocan, tags que contaminan).

### Fase 2 — Aplicar (solo tras mi aprobación)
1. Crea la rama o el respaldo (regla 6).
2. Copia las notas a la carpeta destino con el mapeo aprobado. Mantén los nombres de archivo del paquete salvo que el plan indique otra cosa; si renombras una nota, actualiza **todos** los wikilinks del paquete que apunten a ella.
3. Aplica las fusiones con la sección `## Actualización 2026-11-09`.

### Fase 3 — Conectar con la red existente
1. En cada nota nueva, añade al final `## Conexiones` con los wikilinks aprobados hacia notas existentes y una frase de por qué se conectan.
2. En las notas existentes aprobadas, añade al final una sola línea `Ver también: [[…]]` hacia el MOC del paquete u otra nota nueva relevante.
3. Si el vault tiene un MOC o índice general, añade allí una entrada que apunte a `[[MOC Flujo Multi-Herramienta IA]]`.

### Fase 4 — Validar
Ejecuta este script (ajusta las dos rutas) con `python3 -I`:

```python
import re, sys, pathlib
dest = pathlib.Path(sys.argv[1])    # carpeta destino de las notas importadas
vault = pathlib.Path(sys.argv[2])   # raíz del vault
names = {p.stem for p in vault.rglob("*.md") if ".obsidian" not in p.parts}
imported = {p.stem: p for p in dest.rglob("*.md")}
broken, inbound = [], {n: 0 for n in imported}
for name, p in imported.items():
    text = p.read_text(encoding="utf-8")
    for m in re.finditer(r"\[\[([^\]|#]+)", text):
        t = m.group(1).strip()
        if t not in names:
            broken.append((name, t))
        elif t in inbound and t != name:
            inbound[t] += 1
print("enlaces rotos:", broken or "ninguno")
print("huérfanas (0 entrantes):", [n for n, c in inbound.items() if c == 0] or "ninguna")
```

Además comprueba: (a) el frontmatter de cada nota es YAML válido; (b) no hay dos notas con el mismo nombre en el vault; (c) los nombres no contienen `: / \ | # ^ [ ]`; (d) `git diff --stat` (o la comparación con el respaldo) muestra que solo cambiaron la carpeta destino y las líneas `Ver también` aprobadas.

### Fase 5 — Reporte (máx. 25 líneas)
- Carpeta destino y número de notas creadas / fusionadas / omitidas.
- Lista de notas existentes modificadas (esperado: solo líneas `Ver también`).
- Resultado de la validación (enlaces rotos, huérfanas).
- Conexiones nuevas más relevantes con tu red actual.
- Pendientes: recuerda que `Pendientes de verificar multi-herramienta IA` tiene un ítem que **caduca el 2026-11-18** (cuota de Claude en el plan gratis de Antigravity).
- Cómo deshacer: nombre de la rama (`git checkout -` y borrar `ingesta-ia-coding`) o ruta del respaldo.

### Mantenimiento (opcional, recomendado)
Todas las notas llevan `revisar: AAAA-MM-DD`. Si usas Dataview, el MOC ya incluye una consulta que ordena por fecha de revisión. Cuando verifiques un dato pendiente, actualiza `confianza` y `revisar` en la nota de origen y marca la casilla en `Pendientes de verificar multi-herramienta IA`.
