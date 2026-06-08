'use client';

import { useEffect } from 'react';

/**
 * Parallax sutil para elementos decorativos marcados com [data-parallax].
 * Valor = velocidade (ex.: data-parallax="0.12"). Translada no eixo Y conforme
 * a posição do elemento em relação ao centro da viewport.
 * Desliga sob reduced-motion. Sem JS = elementos estáticos (nenhum efeito).
 */
export default function ParallaxController() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Motion sempre ligado — não respeita reduce-motion.

    const els = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!els.length) return;

    let raf;
    const update = () => {
      const vh = window.innerHeight || 1;
      for (const el of els) {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const offset = center - vh / 2;
        el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
