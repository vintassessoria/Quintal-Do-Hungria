/**
 * Gera um ARQUIVO ÚNICO de verdade: standalone/quintal-do-hungria.html
 * com TODAS as imagens embutidas (data URI WebP otimizado). Não depende de
 * nenhuma pasta — pode ser aberto no duplo-clique OU enviado/subido no Claude.
 *
 *   node scripts/build-single.mjs   (rode depois de `npm run standalone`)
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SRC = join(root, 'standalone', 'index.html');
const DEST = join(root, 'standalone', 'quintal-do-hungria.html');

if (!existsSync(SRC)) {
  console.error('Rode antes: npm run standalone (gera standalone/index.html)');
  process.exit(1);
}

let html = readFileSync(SRC, 'utf8');

// largura/qualidade por categoria (equilíbrio nitidez × tamanho)
function plan(ref) {
  if (ref.includes('/backgrounds/')) return { w: 1366, q: 70 };
  if (ref.includes('/artist/')) return { w: 1000, q: 82 };
  if (ref.includes('/elements/')) return { w: 1000, q: 72 };
  if (ref.includes('/partners/')) return { w: 1100, q: 82 };
  if (ref.includes('/logo/')) return { w: 640, q: 90 };
  return { w: 1200, q: 78 };
}

async function toDataUri(ref) {
  const abs = join(root, 'public', ref);
  if (!existsSync(abs)) return null;
  const { w, q } = plan(ref);
  const buf = await sharp(abs)
    .resize({ width: w, withoutEnlargement: true })
    .webp({ quality: q })
    .toBuffer();
  return 'data:image/webp;base64,' + buf.toString('base64');
}

// coleta refs únicas
const refs = [
  ...new Set(html.match(/assets\/quintal\/[^"')]+\.(?:png|jpe?g|webp)/g) || []),
];

let before = 0;
let after = 0;
for (const ref of refs) {
  const abs = join(root, 'public', ref);
  if (existsSync(abs)) before += readFileSync(abs).length;
  const uri = await toDataUri(ref);
  if (uri) {
    after += uri.length;
    html = html.split(ref).join(uri); // troca todas as ocorrências
    console.log('  •', ref, '→', Math.round(uri.length / 1024) + 'KB');
  }
}

// favicon embutido (a partir do icon.png já gerado)
const iconPath = join(root, 'standalone', 'icon.png');
if (existsSync(iconPath)) {
  const ico =
    'data:image/webp;base64,' +
    (await sharp(iconPath).resize({ width: 64 }).webp({ quality: 90 }).toBuffer()).toString(
      'base64'
    );
  html = html.replace('href="icon.png"', 'href="' + ico + '"');
}
// remove refs externas que sobraram (apple-icon / og)
html = html
  .replace(/<link rel="apple-touch-icon"[^>]*>/g, '')
  .replace(/<meta property="og:image"[^>]*>/g, '');

writeFileSync(DEST, html, 'utf8');
console.log(
  '\n✓ standalone/quintal-do-hungria.html — ARQUIVO ÚNICO (' +
    Math.round(html.length / 1024) +
    'KB).'
);
console.log(
  '  imagens: ' +
    Math.round(before / 1024) +
    'KB → ' +
    Math.round(after / 1024) +
    'KB (webp/base64). Abre no duplo-clique e dá pra subir no Claude.'
);
