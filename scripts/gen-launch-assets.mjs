/**
 * Gera os assets de launch (favicon, apple-icon e imagem Open Graph) a partir
 * dos assets oficiais da marca. Roda uma vez antes do deploy:
 *   node scripts/gen-launch-assets.mjs
 *
 * Saídas (auto-detectadas pelo Next.js App Router):
 *   app/icon.png            → favicon (512x512)
 *   app/apple-icon.png      → ícone iOS (180x180)
 *   app/opengraph-image.png → preview social / WhatsApp / X (1200x630)
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const LOGO = join(root, 'public/assets/quintal/logo/logo-quintal.png');
const HERO = join(root, 'public/assets/quintal/backgrounds/hero-intro.png');
const APP = join(root, 'app');

const INK = '#08070D';

/* ── Favicon (512) e Apple icon (180): logo centralizada no fundo ink ── */
async function makeIcon(size, out, logoW) {
  const logo = await sharp(LOGO)
    .resize({ width: logoW })
    .toBuffer();
  const meta = await sharp(logo).metadata();
  await sharp({
    create: { width: size, height: size, channels: 4, background: INK },
  })
    .composite([
      {
        input: logo,
        top: Math.round((size - meta.height) / 2),
        left: Math.round((size - meta.width) / 2),
      },
    ])
    .png()
    .toFile(out);
  console.log('✓', out.replace(root, '.'));
}

/* ── Open Graph 1200x630: hero escurecido + glow da marca + logo + eyebrow ── */
async function makeOG() {
  const W = 1200;
  const H = 630;

  const bg = await sharp(HERO)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.52, saturation: 1.05 })
    .blur(1.5)
    .toBuffer();

  const overlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="36%" r="62%">
          <stop offset="0%" stop-color="#F12569" stop-opacity="0.30"/>
          <stop offset="45%" stop-color="#FC9D00" stop-opacity="0.10"/>
          <stop offset="78%" stop-color="#08070D" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="vert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#08070D" stop-opacity="0.55"/>
          <stop offset="42%" stop-color="#08070D" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#08070D" stop-opacity="0.9"/>
        </linearGradient>
        <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#F12569"/>
          <stop offset="100%" stop-color="#FC9D00"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#vert)"/>
      <rect width="${W}" height="${H}" fill="url(#glow)"/>
      <!-- eyebrow -->
      <text x="${W / 2}" y="476" text-anchor="middle"
            font-family="Arial, Helvetica, sans-serif" font-size="30"
            font-weight="700" letter-spacing="9" fill="#FFFFFF">
        RIBEIRÃO PRETO &#8226; 25 JUL &#8226; 17H
      </text>
      <!-- linha gradiente -->
      <rect x="${W / 2 - 150}" y="500" width="300" height="3" rx="1.5" fill="url(#brand)"/>
      <!-- subline -->
      <text x="${W / 2}" y="548" text-anchor="middle"
            font-family="Arial, Helvetica, sans-serif" font-size="21"
            font-weight="600" letter-spacing="5" fill="#FFFFFF" fill-opacity="0.72">
        3 HORAS DE SHOW &#8226; PALCO 360&#176; &#8226; ARENA NICNET
      </text>
    </svg>
  `);

  // logo proporcional
  const logoW = 520;
  const logo = await sharp(LOGO).resize({ width: logoW }).toBuffer();
  const lmeta = await sharp(logo).metadata();

  await sharp(bg)
    .composite([
      { input: overlay, top: 0, left: 0 },
      {
        input: logo,
        top: Math.round(150 - lmeta.height / 2 + 110), // centro do bloco superior
        left: Math.round((W - lmeta.width) / 2),
      },
    ])
    .png()
    .toFile(join(APP, 'opengraph-image.png'));
  console.log('✓ ./app/opengraph-image.png');
}

await makeIcon(512, join(APP, 'icon.png'), 380);
await makeIcon(180, join(APP, 'apple-icon.png'), 132);
await makeOG();
console.log('\nLaunch assets gerados com sucesso.');
