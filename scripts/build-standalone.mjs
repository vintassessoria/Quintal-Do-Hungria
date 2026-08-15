/**
 * Gera uma versão STANDALONE do site num único index.html que ABRE COM
 * DUPLO-CLIQUE (file://) — sem servidor, sem build do Next rodando.
 *
 *   node scripts/build-standalone.mjs   (rode depois de `npm run build`)
 *
 * Saída: /standalone/index.html + /standalone/assets (+ ícones).
 * Como funciona:
 *   • Inlina o CSS compilado (mesmo visual do site real).
 *   • Remove os scripts de módulo do Next (que o navegador bloqueia em file://).
 *   • Injeta um JS "vanilla" clássico (roda em file://) que reproduz a intro,
 *     o cursor pendular e os reveals ao rolar.
 *   • Converte os caminhos de imagem para relativos e copia os assets junto.
 */
import {
  readFileSync,
  writeFileSync,
  cpSync,
  mkdirSync,
  rmSync,
  readdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const OUT = join(root, 'out');
const DEST = join(root, 'standalone');

// 1) HTML buildado
let html = readFileSync(join(OUT, 'index.html'), 'utf8');

// 2) CSS compilado (inteiro)
const cssDir = join(OUT, '_next/static/css');
const cssFile = readdirSync(cssDir).find((f) => f.endsWith('.css'));
const css = readFileSync(join(cssDir, cssFile), 'utf8');

// 3) Corpo do HTML, sem scripts
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
let body = bodyMatch ? bodyMatch[1] : html;
body = body
  .replace(/<script\b[\s\S]*?<\/script>/gi, '') // remove <script>...</script>
  .replace(/<script\b[^>]*\/>/gi, '') // remove <script .../>
  .replace(/(["'(])\/assets\//g, '$1assets/') // /assets → assets
  .replace(/(["'(])\/_next\//g, '$1_next/'); // /_next → _next (não usado)

// 4) JS vanilla (clássico — roda em file://) que reanima a página
const shim = [
  '(function(){',
  '  "use strict";',
  '  // Conteudo SEMPRE visivel (robusto p/ arquivo unico): o override CSS forca',
  '  // .reveal-base a opacity:1. Limpa tambem o estado inicial do Framer (hero).',
  '  [].slice.call(document.querySelectorAll(".reveal-base")).forEach(function(el){el.classList.add("reveal-in");});',
  '  [].slice.call(document.querySelectorAll("main [style]")).forEach(function(el){var s=el.getAttribute("style")||"";if(/opacity:\\s*0/.test(s)){el.style.opacity="1";el.style.transform="none";}});',
  '  // intro: dispensa sozinha após ~3s',
  '  var intro=document.querySelector(\'[aria-label^="Abertura"]\');',
  '  if(intro){document.body.style.overflow="hidden";window.scrollTo(0,0);setTimeout(function(){intro.classList.add("intro-exit");setTimeout(function(){if(intro&&intro.parentNode)intro.parentNode.removeChild(intro);document.body.style.overflow="";},1100);},3000);}',
  '  // cursor pendular',
  '  try{if(!matchMedia("(pointer: coarse)").matches){',
  '    var wrap=document.querySelector(".cursor-logo");var pend=wrap&&wrap.firstElementChild;',
  '    if(wrap&&pend){document.documentElement.classList.add("has-custom-cursor");',
  '      var tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty,rot=0,rv=0,sc=0.6,st=1,prev=tx,hov=false;',
  '      wrap.style.transform="translate3d("+x+"px,"+y+"px,0)";',
  '      addEventListener("pointermove",function(e){tx=e.clientX;ty=e.clientY;var c=e.target&&e.target.closest&&e.target.closest("a,button,[role=button],input,textarea,select,label,[data-cursor-hover]");var h=!!c;if(h!==hov){hov=h;st=h?1.4:1;wrap.classList.toggle("cursor-logo--hover",h);}},{passive:true});',
  '      addEventListener("pointerdown",function(){wrap.classList.add("cursor-logo--down");st=hov?1.2:0.82;},{passive:true});',
  '      addEventListener("pointerup",function(){wrap.classList.remove("cursor-logo--down");st=hov?1.4:1;},{passive:true});',
  '      (function tick(){var vx=tx-prev;prev=tx;x+=(tx-x)*0.28;y+=(ty-y)*0.28;rv+=vx*0.28*0.18;rv+=-rot*0.055;rv*=0.86;rot+=rv;if(rot>22){rot=22;rv*=-0.4;}if(rot<-22){rot=-22;rv*=-0.4;}sc+=(st-sc)*0.18;wrap.style.transform="translate3d("+x+"px,"+y+"px,0)";pend.style.transform="rotate("+rot.toFixed(2)+"deg) scale("+sc.toFixed(3)+")";requestAnimationFrame(tick);})();',
  '    }',
  '  }}catch(e){}',
  '})();',
].join('\n');

// 5) Overrides (fonte via Google Fonts — Regarn cai pra Montserrat)
const overrides = [
  ":root{--font-montserrat:'Montserrat';--font-regarn:'Montserrat';}",
  "html,body{font-family:'Montserrat',system-ui,-apple-system,Segoe UI,sans-serif;}",
  ".font-display{font-family:'Montserrat',sans-serif;}",
  // conteúdo sempre visível no arquivo único (sem depender de animação de reveal)
  '.reveal-base{opacity:1 !important;transform:none !important;}',
].join('\n');

// 6) Documento final
const doc = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="theme-color" content="#08070D"/>
<title>Quintal do Hungria · Curitiba — 19 de Setembro</title>
<meta name="description" content="3 horas de show exclusivo do Hungria em uma experiência 360°. 19 de setembro · Live Curitiba · Curitiba. Abertura às 21h."/>
<meta property="og:title" content="Quintal do Hungria · Curitiba"/>
<meta property="og:description" content="3 horas de show exclusivo do Hungria em uma experiência 360°. 19 de setembro · Live Curitiba."/>
<meta property="og:image" content="opengraph-image.png"/>
<link rel="icon" href="icon.png"/>
<link rel="apple-touch-icon" href="apple-icon.png"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
${css}
/* ─── overrides standalone ─── */
${overrides}
</style>
</head>
<body>
${body}
<script>
${shim}
</script>
</body>
</html>`;

// 7) Escreve a pasta standalone
rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, 'index.html'), doc, 'utf8');
cpSync(join(root, 'public/assets'), join(DEST, 'assets'), { recursive: true });
for (const f of ['icon.png', 'apple-icon.png', 'opengraph-image.png']) {
  try {
    cpSync(join(OUT, f), join(DEST, f));
  } catch {}
}

console.log('✓ /standalone/index.html gerado (' + Math.round(doc.length / 1024) + ' KB)');
console.log('  Abra com duplo-clique — funciona sem servidor.');
