// Corrige les libellés français de FluxSign dans le build (catalogues .po et JS compilés).
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const paires = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const racine = process.argv[3];
const compte = new Map(paires.map(([a]) => [a, 0]));
function parcourir(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) { parcourir(p); continue; }
    if (!/\.(js|mjs|po|json)$/.test(n) || n.endsWith('.map')) continue;
    let s = readFileSync(p, 'utf8'); const avant = s;
    for (const [a, b] of paires) { const k = s.split(a).length - 1; if (k) { compte.set(a, compte.get(a) + k); s = s.split(a).join(b); } }
    if (s !== avant) writeFileSync(p, s);
  }
}
parcourir(racine);
let manque = 0;
for (const [a, k] of compte) { console.log(`${k}\t${a}`); if (!k) manque++; }
if (manque) { console.error(`${manque} libellé(s) introuvable(s)`); process.exit(1); }
