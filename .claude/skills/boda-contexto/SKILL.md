---
name: boda-contexto
description: Ponte al día con el proyecto de la página de boda antes de tocar código: orden de lectura de la documentación, reglas duras, fase actual y cómo elegir la siguiente tarea del backlog. Úsala al iniciar cualquier sesión de trabajo en este repo o cuando el usuario pida "ponte al día", "contexto" o "qué sigue".
---

# Contexto del proyecto de boda

## 1. Lee en este orden (no te saltes el primero)

1. `CLAUDE.md` — reglas duras y convenciones.
2. `docs/boda/02-decisiones.md` — qué está decidido y qué sigue pendiente del dueño.
3. `docs/boda/05-plan-de-trabajo.md` — en qué fase estamos y qué tareas siguen.
4. Según la tarea: `03-arquitectura.md` (flujos, SQL, contratos), `04-mapa-de-modulos.md` (qué toca cada módulo),
   `06-seguridad-y-privacidad.md`, `07-diseno-y-tipografia.md`.
5. Si vas a decidir diseño, tipografía o seguridad y `docs/boda/09-notas-obsidian.md` no existe, ejecuta `/boda-obsidian`
   primero.

## 2. Reglas duras (resumen; la lista completa está en `CLAUDE.md`)

- Costo mensual cero: Supabase Free sólo para datos, Realtime y auth de admins; archivos en R2.
- Ningún archivo pesado pasa por Supabase ni por nuestras funciones: subida directa con URL prefirmada.
- Compresión y miniaturas en el cliente; video ≤ 90 s / 50 MB.
- Realtime sólo en `/tv` y `/admin`; los celulares paginan.
- Tokens aleatorios y firmados; límite de tasa en Postgres; RLS en todo; secretos sólo en variables de entorno.
- Nada se muestra fuera de `/admin` sin estado `approved`.
- Sin app, sin cuenta, con una mano, funciona a medias sin red.

## 3. Cómo elegir la siguiente tarea

1. Abre `05-plan-de-trabajo.md`, busca la primera fase con tareas sin marcar.
2. Revisa en `04-mapa-de-modulos.md` el módulo correspondiente: dependencias, archivos, criterio de "listo".
3. Confirma que los pendientes del dueño que bloquean esa fase (tabla al final de 02) están resueltos; si no, dilo y
   propone la siguiente tarea no bloqueada.
4. Al terminar: verifica en un celular real según el criterio de aceptación, marca la casilla en 05, actualiza el estado en 04
   y, si tomaste una decisión nueva, añade una entrada en 02.

## 4. Qué decir al usuario al arrancar

En cinco líneas: fase actual, última tarea completada, siguiente tarea propuesta, pendientes que bloquean, y si hace falta
correr `/boda-obsidian`.
