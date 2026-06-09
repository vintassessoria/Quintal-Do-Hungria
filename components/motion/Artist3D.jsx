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
    const el = ref.current;
    if (!el) return;
    // touch (mobile): sem cursor → oscila sozinho (auto-sway 3D)
    const coarse = matchMedia('(pointer: coarse)').matches;

    let rx = 0;
    let ry = 0;
    let trx = 0;
    let trY = 0;
    let raf = 0;

    let gyro = false; // vira true quando o giroscópio entrega dados (Android etc.)

    const loop = (now) => {
      if (coarse && !gyro) {
        const t = (now || 0) / 1000;
        trY = Math.sin(t * 0.55) * maxY * 0.7; // vai-e-vem horizontal
        trx = Math.sin(t * 0.4 + 1.0) * maxX * 0.6; // leve inclinação
      }
      rx += (trx - rx) * 0.08;
      ry += (trY - ry) * 0.08;
      el.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      if (coarse) {
        raf = requestAnimationFrame(loop);
        return;
      }
      if (Math.abs(trx - rx) > 0.02 || Math.abs(trY - ry) > 0.02) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    if (coarse) {
      // GIROSCÓPIO: inclinar o aparelho gira o elemento (quando o navegador
      // entrega eventos sem pedir permissão — Android). iOS fica no auto-sway.
      const onOrient = (e) => {
        if (e.gamma == null || e.beta == null) return;
        gyro = true;
        const g = Math.max(-28, Math.min(28, e.gamma)); // lateral
        const b = Math.max(-28, Math.min(28, e.beta - 50)); // frente/trás (desconta a pegada ~50°)
        trY = (g / 28) * maxY;
        trx = (-b / 28) * maxX;
      };
      window.addEventListener('deviceorientation', onOrient, true);
      raf = requestAnimationFrame(loop);
      return () => {
        window.removeEventListener('deviceorientation', onOrient, true);
        if (raf) cancelAnimationFrame(raf);
      };
    }

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
