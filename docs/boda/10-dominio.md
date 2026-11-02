# Dominio

Estado: **pendiente de elegir y registrar**. Esta nota reúne criterios, candidatos y el procedimiento para verificar y
comprar. La decisión final se registra en `02-decisiones.md` como D12.

## 1. Criterios

1. **Corto y dictable.** Habrá invitados que lo tecleen a mano (sin NFC ni QR). Sin guiones, sin acentos, sin números
   que se confundan ("Jesús" se escribe `jesus`; "Mónica", `monica`).
2. **Una sola forma de escribirlo.** `monicayjesus` se deletrea solo; `moni-y-jesus` o `monica_jesus` no.
3. **Extensión que la gente reconozca** para la versión escrita: `.com` primero, `.mx` después. Las extensiones temáticas
   (`.boda`, `.wedding`, `.love`) son perfectas para el QR y el NFC, pero generan dudas al dictarlas.
4. **Que sirva dos años.** La página vivirá uno o dos años después de la boda; el dominio se renueva al menos dos veces.
5. **Registrado a nombre de ustedes**, con privacidad WHOIS activada y renovación automática.

## 2. Candidatos

### Propuesto por el dueño (2 de noviembre de 2026): `monichuy.mx`

"Moni" + "Chuy" (apodo de Jesús). Evaluación contra los criterios: 8 letras, sin guiones ni acentos, se dicta solo y suena a
pareja; funciona si los invitados los conocen como Moni y Chuy, que en familia y amigos es lo normal. Riesgo bajo de
confusión al escribir ("monichuy" se escribe como suena). Si está libre, es un gran dominio principal; conviene tomar
también `monichuy.com` para que la versión escrita en `.com` no se la lleve nadie. Verificar con:

```bash
node scripts/check-domains.mjs monichuy.mx monichuy.com monichuy.boda
```

Sin rastro público del nombre en buscadores al 2 de noviembre de 2026, lo que sugiere que no hay una página activa con
él; no demuestra que esté libre.

### Lista general

Orden de preferencia dentro de cada grupo. "Uso" indica si conviene como dominio principal (el que se dicta) o como
dominio extra que redirige al principal.

| # | Dominio | Por qué | Uso |
|---|---|---|---|
| 1 | `monicayjesus.com` | El natural; se dicta solo | Principal |
| 2 | `monicayjesus.mx` | Igual de claro, identidad mexicana | Principal si el `.com` está tomado |
| 3 | `monicayjesus.boda` | Se lee "Mónica y Jesús, boda"; ideal para QR y NFC | Extra que redirige, o principal si no importa dictarlo |
| 4 | `moniyjesus.com` | Más corto si ella usa "Moni" | Principal alternativo |
| 5 | `jesusymonica.com` | Mismo nombre, otro orden | Alternativo |
| 6 | `monicayjesus2027.com` | Casi seguro libre; el año estorba un poco al dictar | Alternativo |
| 7 | `bodamonicayjesus.com` | Claro, pero largo | Alternativo |
| 8 | `myj2027.com` | Muy corto; funciona si el hashtag es #MyJ2027 | Alternativo corto |
| 9 | `myj.boda` | Tres letras; podría tener precio premium | Extra |
| 10 | `enlasnubes2027.com` | Guiño al salón ("en las nubes"), romántico | Extra temático |
| 11 | `monicayjesus.love` | Bonito para el QR | Extra |
| 12 | `monicayjesus.wedding` | Claro en inglés; largo | Extra |
| 13 | `monicayjesus.com.mx` | Respaldo si `.com` y `.mx` están tomados | Respaldo |
| 14 | `13feb2027.com` | Sólo la fecha; fácil de recordar ese día, difícil después | Descartable |

Descartados por criterio: cualquier variante con guiones (`monica-y-jesus.com`), con acentos (IDN) o con "and".

**`Monica&Jesus` no es posible como dominio** (consultado el 2 de noviembre de 2026). Los nombres de dominio sólo admiten
letras, dígitos y guiones (regla "LDH" de los RFC 1035/1123); los símbolos como `&`, `+`, `_` o espacios están prohibidos,
también en los dominios internacionalizados (IDNA2008 sólo añade letras de otros alfabetos, no símbolos). Las mayúsculas no
cuentan: `MonicaYJesus.com` y `monicayjesus.com` son el mismo dominio y se puede escribir con mayúsculas en invitaciones y
letreros. Los dominios con emoji (por ejemplo un corazón) sólo existen en extensiones como `.ws`, `.to` o `.fm`, no en
`.com` ni `.mx`, y se muestran mal en muchos navegadores y en WhatsApp, así que se descartan. Cómo conservar la idea:
`monicayjesus.com` como dominio, y "Mónica & Jesús" en el logotipo, las invitaciones y el hashtag.

## 3. Cómo verificar disponibilidad

Desde la computadora (no funciona desde el contenedor de Claude en la nube):

```bash
node scripts/check-domains.mjs                      # revisa la lista de candidatos de arriba
node scripts/check-domains.mjs moniyjesus.mx otro.com   # o los que quieras
```

El script consulta RDAP (el reemplazo oficial de WHOIS) a través del directorio de IANA. "Disponible (probable)" significa
que el registro no tiene el nombre; puede seguir estando reservado o con precio premium, lo que sólo se ve en el
registrador. Para `.mx` y `.com.mx`, si el registro no responde por RDAP, verificar en https://www.akky.mx (registrador
oficial de NIC México).

También se puede verificar y comprar en el mismo sitio: Cloudflare Registrar (`.com` a precio de costo; nuestro DNS ya
estará ahí), Porkbun o Namecheap (`.boda`, `.love`, `.wedding`, `.mx`), Akky (`.mx`, `.com.mx`).

## 4. Precios de referencia (anuales, aproximados; verificar al comprar)

| Extensión | Rango estimado | Nota |
|---|---|---|
| `.com` | 10 a 12 USD (≈ 200 a 250 MXN) | Cloudflare Registrar lo vende a costo |
| `.mx` | 500 a 900 MXN | Akky o revendedores |
| `.com.mx` | 300 a 500 MXN | Akky |
| `.boda` | 25 a 35 USD | Dominios de 3 letras pueden ser premium |
| `.wedding` | ≈ 27 USD | Dynadot lo listaba en 26.97 USD en abril de 2026 |
| `.love` | 25 a 30 USD | — |

Presupuesto razonable: un principal `.com` o `.mx` más, si se quiere, un `.boda` que redirija: 500 a 1,300 MXN al año.

## 5. Recomendación

1. Correr el script. Si `monicayjesus.com` está libre, registrarlo como principal y, opcionalmente, `monicayjesus.boda` para
   QR, NFC y redes.
2. Si el `.com` está tomado, principal `monicayjesus.mx`; si también, `moniyjesus.com` o `monicayjesus2027.com`.
3. Registrar por dos años con renovación automática y privacidad WHOIS.
4. Poner el DNS en Cloudflare (gratis) para usar Pages y el subdominio `media.` de R2.
5. Alinear el hashtag con el dominio: `#MonicaYJesus2027` o `#MyJ2027`.

## 6. Después de registrar

- Anotar la decisión en `02-decisiones.md` (D12) y el dominio en `settings` y en las variables de Pages.
- Configurar `media.<dominio>` como dominio público del bucket R2.
- Reservar los subdominios: `www` (redirige al raíz) y, si se usa, el `.boda` redirigiendo con 301 al principal.
- Verificar la vista previa al compartir el enlace por WhatsApp (Open Graph) antes de mandar invitaciones.
