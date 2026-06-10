'use client';

import { useEffect, useRef, useState } from 'react';
import { EVENT, TICKET_URL } from '@/lib/event';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import MagneticButton from './motion/MagneticButton';
import GradientButton from './ui/GradientButton';

/**
 * HERO — estética "cinematográfica de produto":
 *  • fundo = gradiente animado (shader WebGL)
 *  • wordmark fantasma desfocado atrás
 *  • figura central (Hungria) dramática, dissolvendo na base
 *  • bloco de texto no canto inferior-esquerdo
 *  • card "spec" de vidro no canto inferior-direito
 */
export default function HeroSection() {
  const [artistOk, setArtistOk] = useState(true);
  const sectionRef = useRef(null);

  // "Câmera cinematográfica": ao rolar, a figura dá zoom e as camadas
  // (wordmark, folhas, texto) se movem em velocidades diferentes → profundidade.
  // Scrub atrelado ao scroll (sem pin) → funciona no mobile.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sec = sectionRef.current;
    if (!sec) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sec);
      const fig = q('[data-hero-figure]')[0];
      const wm = q('[data-hero-wordmark]')[0];
      const fol = q('[data-hero-foliage]')[0];
      const content = q('[data-hero-content]')[0];
      if (fig) gsap.set(fig, { transformOrigin: '50% 78%' });
      // UMA timeline única dirige todas as camadas (cada tween na posição 0 = paralelo)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      if (fig) tl.to(fig, { scale: 1.2, ease: 'none' }, 0);
      if (wm) tl.to(wm, { yPercent: -70, opacity: 0.18, ease: 'none' }, 0);
      if (fol) tl.to(fol, { yPercent: -50, ease: 'none' }, 0);
      if (content) tl.to(content, { yPercent: -16, ease: 'none' }, 0);
      ScrollTrigger.refresh();
    }, sec);
    return () => ctx.revert();
  }, []);

  // Profundidade 3D (desktop): o cursor desloca figura, wordmark e glow em
  // velocidades diferentes (parallax de camadas) + leve giro do Hungria.
  // Elementos distintos dos que o GSAP anima → zero conflito. Só transform.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (matchMedia('(pointer: coarse)').matches) return;
    const sec = sectionRef.current;
    if (!sec) return;
    const fig = sec.querySelector('.hero-fig-float');
    const wm = sec.querySelector('[data-hero-wordmark] span');
    const glow = sec.querySelector('[data-hero-glow]');
    if (!fig && !wm && !glow) return;

    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      if (fig)
        fig.style.transform = `perspective(1200px) translate3d(${(x * 14).toFixed(1)}px, ${(y * 8).toFixed(1)}px, 0) rotateY(${(x * 3.5).toFixed(2)}deg)`;
      if (wm)
        wm.style.transform = `translate3d(${(-x * 26).toFixed(1)}px, ${(-y * 10).toFixed(1)}px, 0)`;
      if (glow)
        glow.style.transform = `translate3d(${(x * 20).toFixed(1)}px, ${(y * 12).toFixed(1)}px, 0)`;
      if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} id="topo" className="relative min-h-[100svh] overflow-hidden">
      {/* Fundo: gradiente animado FIXO global (vem do app/page.jsx) — seção transparente */}

      {/* (Folhas do topo removidas — hero mais limpo) */}

      {/* ── Wordmark fantasma atrás (escondido no celular) ── */}
      <div
        data-hero-wordmark
        className="pointer-events-none absolute inset-x-0 top-[11%] z-[1] hidden justify-center sm:top-[13%] sm:flex"
      >
        <span className="font-display select-none whitespace-nowrap text-[22vw] leading-none text-white/[0.06] blur-[2px] sm:text-[28vw] lg:text-[18rem]">
          HUNGRIA
        </span>
      </div>

      {/* aterramento p/ legibilidade (sobre as folhas, atrás da figura) */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-ink/35 via-transparent to-ink" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-ink/60 via-transparent to-ink/45" />
      <div className="bg-grain pointer-events-none absolute inset-0 z-[2] opacity-40" />

      {/* glow suave atrás da figura (substitui o drop-shadow — sem o artefato de recorte) */}
      <div data-hero-glow className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex justify-center">
        <div className="h-[46svh] w-[78%] max-w-[560px] -translate-y-[16%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(241,37,105,0.3),rgba(252,157,0,0.1)_45%,transparent_66%)] blur-[64px]" />
      </div>

      {/* ── Figura central (Hungria — busto recortado). Mobile: sobe a imagem ── */}
      {artistOk && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex -translate-y-[19svh] justify-center sm:translate-y-0">
          <div className="hero-fig-float">
            <img
              data-hero-figure
              src="/assets/quintal/artist/hungria.webp"
              alt="Hungria"
              onError={() => setArtistOk(false)}
              className="h-[66svh] w-auto max-w-none object-contain object-bottom opacity-[0.97] sm:h-[74svh] lg:h-[82svh] [mask-image:linear-gradient(to_bottom,#000_74%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,#000_74%,transparent)]"
            />
          </div>
        </div>
      )}

      {/* aterramento extra SÓ no mobile — começa abaixo do rosto (na jaqueta), p/ a frase ler bem sem faixa visível sobre o gorro */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[52%] bg-gradient-to-t from-ink via-ink/85 to-transparent sm:hidden" />

      {/* ── Conteúdo (frase à esquerda + card à direita, respiro no meio) ── */}
      <div
        data-hero-content
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1720px] flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:px-14"
      >
        <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-end sm:justify-between">
          {/* texto — canto inferior esquerdo */}
          <div className="max-w-[26rem]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
              A turnê · Próxima parada: {EVENT.city}
            </span>
            <h1 className="font-display mt-4 text-5xl leading-[0.9] drop-shadow-[0_6px_30px_rgba(0,0,0,0.55)] sm:text-6xl">
              <span className="block text-white">Quintal</span>
              <span className="block text-gradient">do Hungria.</span>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65 sm:text-base">
              <span className="font-semibold text-white">6 horas</span> de experiência em 360°, com{' '}
              <span className="font-semibold text-white">3 horas exclusivas</span> de show do Hungria.
            </p>
            <div className="mt-7">
              <MagneticButton strength={0.4}>
                <GradientButton href={TICKET_URL} external size="lg" icon>
                  Garantir meu ingresso
                </GradientButton>
              </MagneticButton>
            </div>
          </div>

          {/* card "spec" de vidro — canto inferior direito */}
          <div className="hidden w-[240px] shrink-0 rounded-2xl border border-white/12 bg-white/[0.04] p-5 backdrop-blur-md sm:block">
            <div className="flex items-center justify-between">
              <img
                src="/assets/quintal/logo/logo-quintal.png"
                alt="Quintal do Hungria"
                className="h-7 w-auto opacity-85"
              />
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-gradient" />
              </span>
            </div>
            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.24em] text-gold/90">
              Próxima parada
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-display text-3xl text-white">{EVENT.dateShort}</span>
              <span className="text-sm font-semibold text-gold">{EVENT.doorsTime}</span>
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
              Arena NicNet · {EVENT.city}
            </p>
            <div className="mt-4 border-t border-white/10 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              6H de experiência · 3H de Hungria
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
