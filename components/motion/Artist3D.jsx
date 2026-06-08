'use client';

import { useEffect, useRef } from 'react';

/**
 * Rotação 3D reativa ao cursor para a figura do Hungria.
 * O elemento gira em perspectiva conforme o mouse se move (rotateY = horizontal,
 * rotateX = vertical), suavizado por rAF. Dá a sensação de "girar" a figura.
 * Desliga em touch. Combina com a flutuação (que fica no wrapper externo).
 */
export default function Artist3D({ children, className = '', maxY = 18, maxX = 10 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    if (!el) return;

    let rx = 0;
    let ry = 0;
    let trx = 0;
    let trY = 0;
    let raf = 0;

    const loop = () => {
      rx += (trx - rx) * 0.08;
      ry += (trY - ry) * 0.08;
      el.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      if (Math.abs(trx - rx) > 0.02 || Math.abs(trY - ry) > 0.02) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onMove = (e) => {
      const cx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
      const cy = e.clientY / window.innerHeight - 0.5;
      trY = cx * 2 * maxY; // mouse à direita → vira pra direita
      trx = -cy * 2 * maxX; // mouse embaixo → inclina pra trás
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [maxY, maxX]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}
