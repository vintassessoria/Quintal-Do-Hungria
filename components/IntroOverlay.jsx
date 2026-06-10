'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { EVENT } from '@/lib/event';

/* ══════════════════════════════════════════════════════════════════════
   AJUSTES RÁPIDOS DA INTRO
   - Duração total ≈ (HOLD_MS + EXIT_MS) / 1000
   - Os DELAYS/DURAÇÕES da entrada (bg, logo, data) estão nas classes
     .intro-bg / .intro-logo / .intro-date em app/globals.css
   - A intro toca a cada reload (sem sessionStorage gate).
   ────────────────────────────────────────────────────────────────────── */
const HOLD_MS = 3000; // ⏱️ tempo (ms) antes de iniciar a saída
const EXIT_MS = 1100; // duração (ms) da saída (revela o hero — suave)
/* ══════════════════════════════════════════════════════════════════════ */

// Partículas fixas (determinísticas → sem mismatch de hidratação)
const PARTICLES = [
  { left: '16%', size: 3, delay: 0.2, dur: 5.5 },
  { left: '31%', size: 2, delay: 1.2, dur: 6.6 },
  { left: '47%', size: 3, delay: 0.6, dur: 5.0 },
  { left: '62%', size: 2, delay: 1.7, dur: 6.1 },
  { left: '77%', size: 3, delay: 0.9, dur: 7.0 },
  { left: '88%', size: 2, delay: 0.35, dur: 5.8 },
];

export default function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const dismissed = useRef(false);

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    setExiting(true); // dispara a animação CSS de saída
    window.setTimeout(() => setVisible(false), EXIT_MS); // desmonta após a saída
  };

  useEffect(() => {
    // Intro toca a cada reload (sem gate de sessionStorage).
    // Revela o topo (hero) e trava o scroll enquanto a intro está em cena.
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // 100% auto-play (sem clique, sem Esc — o site abre sozinho)
    const t = window.setTimeout(dismiss, HOLD_MS);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
    };
    // Executa apenas uma vez no mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Libera o scroll assim que a intro sai de cena
  useEffect(() => {
    if (!visible) document.body.style.overflow = '';
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      aria-label="Abertura do Quintal do Hungria"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink ${
        exiting ? 'intro-exit' : ''
      }`}
    >
      {/* ─────────── BACKGROUND INTRO (asset obrigatório) ─────────── */}
      <div className="intro-bg absolute inset-0">
        {/* brisa orgânica muito sutil nas folhagens (sem distorcer a imagem) */}
        <div className="intro-sway absolute inset-0">
          {/* ASSET "background intro" → /public/assets/quintal/backgrounds/hero-intro.png */}
          <Image
            src="/assets/quintal/backgrounds/hero-intro.png"
            alt="Quintal do Hungria — atmosfera tropical noturna"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* poça escura no centro p/ assentar a logo (mantém a folhagem das laterais) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,7,13,0.5)_0%,rgba(8,7,13,0.18)_40%,transparent_70%)]" />
        {/* leve aterramento topo/baixo */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/55" />
        {/* grão sutil */}
        <div className="bg-grain absolute inset-0" />
        {/* brilho atmosférico que respira (centragem no wrapper; pulse no filho) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2">
          <div className="h-full w-full animate-glow-pulse rounded-full bg-[radial-gradient(circle,rgba(241,37,105,0.16),rgba(252,157,0,0.07)_45%,transparent_70%)] blur-3xl" />
        </div>
      </div>

      {/* ─────────── partículas muito suaves ─────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="intro-particle absolute bottom-[16%] rounded-full bg-white/80"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* ─────────── LOGO + DATA ─────────── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="intro-logo relative">
          {/* glow muito sutil por trás da logo */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(241,37,105,0.26),rgba(252,157,0,0.12)_45%,transparent_70%)] blur-2xl" />
          {/* LOGO: /public/assets/quintal/logo/logo-quintal.png */}
          <img
            src="/assets/quintal/logo/logo-quintal.png"
            alt="Quintal do Hungria"
            className="mx-auto w-[78vw] max-w-[300px] drop-shadow-[0_10px_40px_rgba(0,0,0,0.55)] sm:max-w-[390px] lg:max-w-[440px]"
          />
        </div>

        <p className="intro-date mt-6 text-[11px] font-semibold uppercase tracking-[0.34em] text-white/70 sm:text-xs">
          Quintal do Hungria
        </p>
      </div>

    </div>
  );
}
