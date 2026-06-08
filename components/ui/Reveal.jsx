'use client';

import { useEffect, useRef } from 'react';

/**
 * Revelação suave ao entrar na viewport (fade + leve deslocamento).
 *
 * Implementação dupla-segura:
 *  1) IntersectionObserver (preferencial; eficiente)
 *  2) Fallback via scroll/resize/load (cobre ambientes onde IO não dispara
 *     e o caso "já estava em viewport na 1ª pintura")
 *  3) Garantia: depois de 1.5s, qualquer elemento em viewport é revelado.
 *
 * — Sem hydration mismatch (idêntico SSR/cliente).
 * — Respeita prefers-reduced-motion (opacity-only via globals.css).
 */
export default function Reveal({
  children,
  className = '',
  delay = 0, // segundos
  once = true,
  as = 'div',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (delay) el.style.transitionDelay = `${delay}s`;

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      el.classList.add('reveal-in');
    };

    const isInView = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // mesma margem da IO: dispara um pouco antes do topo entrar de fato
      return r.top < vh * 0.92 && r.bottom > 0;
    };

    const check = () => {
      if (isInView()) {
        reveal();
        cleanup();
      }
    };

    // 1) IntersectionObserver (quando suportado e funcional)
    let io;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            reveal();
            cleanup();
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
      );
      io.observe(el);
    }

    // 2) Fallback por eventos (load/scroll/resize)
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    window.addEventListener('load', check);

    // 3) Sondas iniciais (cobre "já em viewport na 1ª pintura" e ambientes
    //    em que a IO não dispara em elementos visíveis no mount)
    const rafs = [
      requestAnimationFrame(() => requestAnimationFrame(check)),
    ];
    const timers = [
      setTimeout(check, 80),
      setTimeout(check, 350),
      setTimeout(check, 900),
      // Garantia final
      setTimeout(() => { if (isInView()) reveal(); }, 1500),
    ];

    function cleanup() {
      if (!once && !done) return;
      io && io.disconnect();
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      window.removeEventListener('load', check);
      rafs.forEach(cancelAnimationFrame);
      timers.forEach(clearTimeout);
    }

    return cleanup;
  }, [delay, once]);

  const Tag = as;
  return (
    <Tag ref={ref} className={`reveal-base ${className}`}>
      {children}
    </Tag>
  );
}
