'use client';

import { useEffect, useRef } from 'react';
import { TICKER_ITEMS } from '@/lib/event';

/**
 * Faixa de impacto após o hero — marquee contínuo.
 * Novo: reage à VELOCIDADE do scroll (Lenis) com um leve skew + boost,
 * dando aquela sensação "viva" dos motion sites. Degrada para o marquee
 * normal sem JS / em reduced-motion.
 */
export default function EventTicker() {
  const skewRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Motion sempre ligado — não respeita reduce-motion.

    let raf;
    let cur = 0;
    const loop = () => {
      const v = (window.__lenis && window.__lenis.velocity) || 0;
      // alvo de skew proporcional à velocidade, com clamp
      const target = Math.max(-7, Math.min(7, v * 0.5));
      cur += (target - cur) * 0.12;
      if (skewRef.current) {
        skewRef.current.style.transform = `skewX(${cur.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // duas cópias em sequência → loop perfeito com translateX(-50%)
  const sequence = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="bg-grain relative h-16 overflow-hidden border-y border-white/[0.07] bg-ink-2"
      style={{ contain: 'paint' }}
    >
      <div className="mask-fade-x absolute inset-0">
        {/* wrapper que recebe o skew por velocidade + CENTRALIZA na vertical
            (flex em vez de -translate-y-1/2, que conflitaria com o translateX do marquee) */}
        <div ref={skewRef} className="absolute inset-0 flex items-center will-change-transform">
          <div className="flex w-max animate-marquee-slow items-center whitespace-nowrap hover:[animation-play-state:paused]">
            {sequence.map((label, i) => (
              <div key={i} className="flex items-center">
                <span className="mx-7 text-sm font-semibold uppercase tracking-[0.22em] text-white/70 sm:mx-9">
                  {label}
                </span>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gradient shadow-[0_0_12px_rgba(241,37,105,0.7)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
