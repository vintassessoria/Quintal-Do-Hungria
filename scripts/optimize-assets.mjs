/**
 * Otimiza os assets pesados para web (reduz dimensões e recomprime),
 * mantendo os mesmos nomes de arquivo (sem mudanças no código).
 * Os ORIGINAIS permanecem intactos nas pastas Background/ Elementos/ Logos/.
 *
 * Rodar:  node scripts/optimize-assets.mjs
 */
import sharp from 'sharp';
import { readdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public/assets/quintal');

const jobs = [
  // folhagens/palmeiras (com transparência) — alvo leve com quantização
  { dir: 'elements', maxW: 1100, png: { palette: true, quality: 78, compressionLevel: 9, effort: 8 } },
  // fundos fotográficos — next/image reotimiza; aqui só reduzimos a fonte
  { dir: 'backgrounds', maxW: 1600, png: { quality: 82, compressionLevel: 9, effort: 8 } },
  // régua de logos (vetorial-like, branco) — largura enorme original
  { dir: 'partners', maxW: 2600, png: { palette: true, compressionLevel: 9, effort: 8 } },
  // logo — exibida pequena
  { dir: 'logo', maxW: 900, png: { palette: true, compressionLevel: 9, effort: 8 } },
];

let totalBefore = 0;
let totalAfter = 0;

for (const job of jobs) {
  const dir = path.join(ROOT, job.dir);
  let files = [];
  try {
    files = (await readdir(dir)).filter((f) => f.toLowerCase().endsWith('.png'));
  } catch {
    continue;
  }
  for (const f of files) {
    const p = path.join(dir, f);
    const beforeBytes = (await stat(p)).size;
    const meta = await sharp(p).metadata();
    const out = await sharp(p)
      .resize({ width: job.maxW, withoutEnlargement: true })
      .png(job.png)
      .toBuffer();
    await writeFile(p, out);
    totalBefore += beforeBytes;
    totalAfter += out.length;
    console.log(
      `${job.dir}/${f}: ${meta.width}x${meta.height}  ${(beforeBytes / 1e6).toFixed(2)}MB -> ${(
        out.length / 1e6
      ).toFixed(2)}MB`
    );
  }
}

console.log(
  `\nTOTAL: ${(totalBefore / 1e6).toFixed(2)}MB -> ${(totalAfter / 1e6).toFixed(2)}MB  (${(
    100 -
    (totalAfter / totalBefore) * 100
  ).toFixed(0)}% menor)`
);
