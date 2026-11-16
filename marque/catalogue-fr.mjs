// Complète le catalogue français compilé de FluxSign (serveur et navigateur) avec nos traductions.
// Usage : node catalogue-fr.mjs <traductions.json> <dossier build>
// traductions.json : [{ "ctx": null | "contexte", "en": "message source", "fr": "traduction" }]
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const req = createRequire('/app/package.json');
const { generateMessageId } = req('@lingui/message-utils/generateMessageId');
const { compileMessage } = req('@lingui/message-utils/compileMessage');

const entrees = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const racine = process.argv[3];
const ajouts = Object.fromEntries(entrees.map((e) => [generateMessageId(e.en, e.ctx ?? undefined), compileMessage(e.fr)]));

// Repère chaque JSON.parse("...") ou JSON.parse(`...`) et renvoie [début, fin, guillemet] du littéral.
function litteraux(src) {
  const res = [];
  let i = 0;
  while ((i = src.indexOf('JSON.parse(', i)) !== -1) {
    const q = src[i + 11];
    if (q !== '"' && q !== '`') { i += 11; continue; }
    let j = i + 12;
    while (j < src.length && src[j] !== q) j += src[j] === '\\' ? 2 : 1;
    res.push([i + 11, j + 1, q]);
    i = j + 1;
  }
  return res;
}

function encoder(obj, q) {
  const json = JSON.stringify(obj);
  if (q === '"') return JSON.stringify(json);
  return '`' + json.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
}

let fichiers = 0, remplaces = 0;
function parcourir(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) { parcourir(p); continue; }
    if (!/\.(js|mjs)$/.test(n)) continue;
    let src = readFileSync(p, 'utf8');
    if (!src.includes('mErq7F')) continue;
    let modifie = false;
    for (const [a, b, q] of litteraux(src).reverse()) {
      let obj;
      try { obj = JSON.parse(new Function('return ' + src.slice(a, b))()); } catch { continue; }
      const insc = obj?.mErq7F?.[0];
      if (insc !== 'Inscription') continue; // uniquement le catalogue français
      for (const [id, val] of Object.entries(ajouts)) { if (id in obj) { obj[id] = val; remplaces++; } }
      src = src.slice(0, a) + encoder(obj, q) + src.slice(b);
      modifie = true;
    }
    if (modifie) { writeFileSync(p, src); fichiers++; console.log('catalogue FR :', p); }
  }
}
parcourir(racine);
console.log(`${fichiers} catalogue(s), ${remplaces} libellé(s) remplacé(s), ${Object.keys(ajouts).length} traduction(s) fournie(s)`);
if (!fichiers) process.exit(1);
