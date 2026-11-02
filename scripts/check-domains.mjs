#!/usr/bin/env node
// Verifica disponibilidad de dominios vía RDAP (sucesor de WHOIS) usando el directorio oficial de IANA.
// Uso:  node scripts/check-domains.mjs                 -> revisa la lista de candidatos de docs/boda/10-dominio.md
//       node scripts/check-domains.mjs a.com b.mx ...  -> revisa los que indiques
// Requiere Node 18 o superior (fetch global). Correr desde tu computadora; en el contenedor de Claude la red está cerrada.

const CANDIDATOS = [
  'monicayjesus.com',
  'monicayjesus.mx',
  'monicayjesus.boda',
  'moniyjesus.com',
  'jesusymonica.com',
  'monicayjesus2027.com',
  'bodamonicayjesus.com',
  'myj2027.com',
  'myj.boda',
  'enlasnubes2027.com',
  'monicayjesus.love',
  'monicayjesus.wedding',
  'monicayjesus.com.mx',
  '13feb2027.com',
];

const BOOTSTRAP_URL = 'https://data.iana.org/rdap/dns.json';
const TIMEOUT_MS = 12000;

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label}: tiempo de espera agotado`)), ms)),
  ]);
}

async function loadBootstrap() {
  const res = await withTimeout(fetch(BOOTSTRAP_URL, { headers: { accept: 'application/json' } }), TIMEOUT_MS, 'IANA');
  if (!res.ok) throw new Error(`IANA respondió ${res.status}`);
  const data = await res.json();
  const map = new Map();
  for (const [tlds, urls] of data.services) {
    for (const tld of tlds) map.set(tld.toLowerCase(), urls.find((u) => u.startsWith('https://')) ?? urls[0]);
  }
  return map;
}

function tldOf(domain) {
  const parts = domain.toLowerCase().split('.');
  // Para dominios de tercer nivel como ejemplo.com.mx, el registro RDAP es el de "mx".
  return parts[parts.length - 1];
}

async function check(domain, bootstrap) {
  const base = bootstrap.get(tldOf(domain));
  if (!base) return { domain, estado: 'sin RDAP público', detalle: 'verificar en el registrador (Akky para .mx)' };
  const url = `${base.replace(/\/?$/, '/')}domain/${domain.toLowerCase()}`;
  try {
    const res = await withTimeout(
      fetch(url, { headers: { accept: 'application/rdap+json' }, redirect: 'follow' }),
      TIMEOUT_MS,
      domain,
    );
    if (res.status === 404) return { domain, estado: 'DISPONIBLE (probable)', detalle: 'confirmar precio en el registrador' };
    if (res.ok) {
      const json = await res.json().catch(() => ({}));
      const exp = (json.events ?? []).find((e) => e.eventAction === 'expiration');
      const status = (json.status ?? []).slice(0, 2).join(', ');
      return {
        domain,
        estado: 'registrado',
        detalle: [exp ? `expira ${String(exp.eventDate).slice(0, 10)}` : null, status || null].filter(Boolean).join(' · '),
      };
    }
    if (res.status === 429) return { domain, estado: 'límite de consultas', detalle: 'reintentar en un minuto' };
    return { domain, estado: `respuesta ${res.status}`, detalle: 'verificar manualmente' };
  } catch (err) {
    return { domain, estado: 'error de red', detalle: err.message };
  }
}

async function main() {
  const lista = process.argv.slice(2).length ? process.argv.slice(2) : CANDIDATOS;
  let bootstrap;
  try {
    bootstrap = await loadBootstrap();
  } catch (err) {
    console.error(`No se pudo leer el directorio RDAP de IANA: ${err.message}`);
    process.exit(1);
  }
  const resultados = [];
  for (const d of lista) {
    // Secuencial para no disparar límites de consulta de los registros.
    resultados.push(await check(d, bootstrap));
  }
  const ancho = Math.max(...resultados.map((r) => r.domain.length), 8);
  console.log(`${'Dominio'.padEnd(ancho)}  ${'Estado'.padEnd(24)}  Detalle`);
  console.log(`${'-'.repeat(ancho)}  ${'-'.repeat(24)}  ${'-'.repeat(32)}`);
  for (const r of resultados) {
    console.log(`${r.domain.padEnd(ancho)}  ${r.estado.padEnd(24)}  ${r.detalle ?? ''}`);
  }
  console.log('\n"DISPONIBLE (probable)" = el registro no tiene el nombre; puede estar reservado o ser premium. Confirmar al comprar.');
}

main();
