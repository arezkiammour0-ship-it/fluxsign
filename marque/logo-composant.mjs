// Remplace le logo vectoriel Documenso de l'en-tête par le logo FluxSign (même proportion 2248 x 320).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const B = process.argv[2];
const IMG = '/assets/logo-Nudru9Pm.png';
let n = 0;

// Rendu serveur : fonction BrandingLogo dans server-build-*.js
const sdir = join(B, 'server/assets');
for (const f of readdirSync(sdir).filter((x) => /^server-build-.*\.js$/.test(x))) {
  const p = join(sdir, f); let s = readFileSync(p, 'utf8');
  const re = /const BrandingLogo = \(\{\n  \.\.\.props\n\}\) => \{\n[\s\S]*?\n\};\n/;
  if (re.test(s)) {
    s = s.replace(re, `const BrandingLogo = ({\n  ...props\n}) => {\n  return /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 2248 320", ...props, children: /* @__PURE__ */ jsx("image", { href: "${IMG}", width: 2248, height: 320 }) });\n};\n`);
    writeFileSync(p, s); n++;
  }
}

// Navigateur : module branding-logo-*.js
const cdir = join(B, 'client/assets');
for (const f of readdirSync(cdir).filter((x) => /^branding-logo-.*\.js$/.test(x))) {
  const p = join(cdir, f); const s = readFileSync(p, 'utf8');
  const m = s.match(/^import\{j as (\w+)\}from"(\.\/jsx-runtime-[^"]+)";const (\w+)=/);
  if (!m || !s.includes('M529.4 276h-82.5')) continue;
  const [, j, rt, nom] = m;
  writeFileSync(p, `import{j as ${j}}from"${rt}";const ${nom}=({...l})=>${j}.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 2248 320",...l,children:${j}.jsx("image",{href:"${IMG}",width:2248,height:320})});export{${nom} as B};\n`);
  n++;
}
console.log(`logo remplacé dans ${n} fichier(s)`);
if (n !== 2) process.exit(1);
