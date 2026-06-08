'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Scroll suave global (Lenis) sincronizado com o GSAP ScrollTrigger.
 * Desliga sob prefers-reduced-motion (scroll nativo).
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Motion sempre ligado (decisão do dono do site) — não respeita reduce-motion.

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    // expõe p/ âncoras (ex.: header) e debug
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // links de âncora usam o scrollTo do Lenis
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: -80, duration: 1.2 });
        }
      }
    };
    document.addEventListener('click', onClick);

    // recalcula triggers após o layout assentar (fontes/imagens)
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t = window.setTimeout(refresh, 600);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('load', refresh);
      window.clearTimeout(t);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return children;
}
