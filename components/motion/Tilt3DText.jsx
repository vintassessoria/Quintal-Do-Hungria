'use client';

import { useEffect, useRef } from 'react';

/**
 * Texto 3D reativo ao cursor — gira em perspectiva conforme o mouse se move,
 * relativo ao centro do próprio elemento. Os filhos podem usar translateZ
 * para criar profundidade real entre as linhas (parallax 3D).
 * Desliga em touch (renderiza estático).
 */
export default function Tilt3DText({ children, className = '', maxX = 9, maxY = 13 }) {
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
      rx += (trx - rx) * 0.09;
      ry += (trY - ry) * 0.09;
      el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      if (Math.abs(trx - rx) > 0.02 || Math.abs(trY - ry) > 0.02) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
      const cy = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
      trY = cx * maxY; // mouse à direita → vira à direita
      trx = -cy * maxX; // mouse embaixo → inclina pra trás
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [maxX, maxY]);

  return (
    <div className={className} style={{ perspective: '900px' }}>
      <div ref={ref} style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
}
