'use client';

import { useEffect, useRef } from 'react';

/**
 * Cursor com balanço pendular real.
 *
 * Estrutura aninhada para física inequívoca:
 *   <wrapper>          ← posicionado no cursor (translate3d)
 *     <pendulum>       ← rotaciona ao redor de (0,0) = ponto do cursor
 *       <img>          ← pendura: top no cursor, corpo abaixo
 *     </pendulum>
 *   </wrapper>
 *
 * O ponto de pivô da rotação fica EXATAMENTE no ponto do mouse — a logo
 * pendura como charm de chaveiro.
 *
 *  Mouse pra direita → corpo lag pra esquerda (inércia)
 *  Mouse para        → oscila pelo eixo, amortece, estabiliza
 */
export default function CursorLogo() {
  const wrapRef = useRef(null);
  const pendulumRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (matchMedia('(pointer: coarse)').matches) return; // sem mouse

    const wrap = wrapRef.current;
    const pendulum = pendulumRef.current;
    if (!wrap || !pendulum) return;

    document.documentElement.classList.add('has-custom-cursor');

    // ── Estado físico ──
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let rot = 0;     // ângulo do pêndulo (graus)
    let rotVel = 0;  // velocidade angular
    let scale = 0.6; // pop-in
    let scaleTarget = 1;
    let prevTx = tx;
    let hovering = false;

    // Posição inicial visível
    wrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    // ── Parâmetros do pêndulo (refinado: gentil, sem ficar "bambo") ──
    const POS_LERP = 0.28;        // "fio" segue mouse com pouco lag
    const ANGLE_SCALE = 0.28;     // ↓ menos reação ao movimento
    const ANGLE_CLAMP = 22;       // ↓ amplitude máxima menor (°)
    const SPRING_K = 0.055;       // ↑ mola firme — volta ao centro logo
    const SPRING_D = 0.86;        // ↓ mais atrito — para de oscilar rápido
    const IMPULSE_GAIN = 0.18;    // ↓ chute inicial gentil
    const SCALE_LERP = 0.18;

    // ── Listeners ──
    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target;
      const clickable =
        t && t.closest &&
        t.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]') !== null;
      if (clickable !== hovering) {
        hovering = clickable;
        scaleTarget = hovering ? 1.4 : 1;
        wrap.classList.toggle('cursor-logo--hover', hovering);
      }
    };
    const onDown = () => {
      wrap.classList.add('cursor-logo--down');
      scaleTarget = hovering ? 1.2 : 0.82;
    };
    const onUp = () => {
      wrap.classList.remove('cursor-logo--down');
      scaleTarget = hovering ? 1.4 : 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });

    // ── Loop de física ──
    let raf;
    const tick = () => {
      const vx = tx - prevTx;
      prevTx = tx;

      // posição: fio segue snappy
      x += (tx - x) * POS_LERP;
      y += (ty - y) * POS_LERP;

      // pêndulo:
      //   CSS rotate(+) = horário → ponto-abaixo vai pra ESQUERDA
      //   mouse pra direita (vx +) → corpo deve lagar esquerda → rot POSITIVO
      //   logo: sinal POSITIVO em vx
      const impulse = vx * ANGLE_SCALE;
      rotVel += impulse * IMPULSE_GAIN;
      rotVel += -rot * SPRING_K;     // gravidade (mola pro vertical)
      rotVel *= SPRING_D;             // atrito (damping)
      rot += rotVel;
      if (rot > ANGLE_CLAMP) {
        rot = ANGLE_CLAMP;
        rotVel *= -0.4;
      } else if (rot < -ANGLE_CLAMP) {
        rot = -ANGLE_CLAMP;
        rotVel *= -0.4;
      }

      scale += (scaleTarget - scale) * SCALE_LERP;

      // ── Aplica ──
      // Wrapper só posiciona (sem rotação/escala) no ponto do mouse.
      wrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      // Pendulum rotaciona ao redor de (0,0) que é exatamente o ponto do mouse.
      pendulum.style.transform = `rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="cursor-logo pointer-events-none fixed left-0 top-0 z-[9999] hidden lg:block"
      style={{ willChange: 'transform' }}
    >
      {/* Pendulum: rotaciona ao redor da origem (0,0) — o ponto do mouse.
          O scale é aplicado também aqui (em volta da origem) para que ao
          aumentar/diminuir, a logo continue pendurada do mesmo pivô. */}
      <div
        ref={pendulumRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transformOrigin: '0 0', // PIVÔ no canto superior esquerdo = ponto do cursor
          transform: 'rotate(0deg) scale(0.6)',
          willChange: 'transform',
        }}
      >
        {/* A IMG é deslocada -50% horizontal pra centralizar embaixo do pivô.
            Vertical fica em 0: o TOPO da logo coincide com o ponto do mouse. */}
        <img
          src="/assets/quintal/logo/cursor.png"
          alt=""
          draggable="false"
          className="cursor-logo-img select-none"
          style={{
            display: 'block',
            width: '46px',
            height: 'auto',
            maxWidth: 'none',
            transform: 'translateX(-50%)',
            filter:
              'drop-shadow(0 0 10px rgba(241,37,105,0.85)) drop-shadow(0 0 3px rgba(0,0,0,0.55))',
          }}
        />
      </div>
    </div>
  );
}
