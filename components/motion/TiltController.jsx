'use client';

import { useEffect } from 'react';

/**
 * Tilt 3D premium em TODOS os cards (.card-premium, .tilt-3d) — v2.
 * • Física de MOLA real (velocidade + amortecimento): impulso → leve
 *   overshoot → assenta. Sensação física, não robótica.
 * • Brilho (glare) segue o cursor e a intensidade acompanha a inclinação.
 * • Rotação calibrada pelo tamanho: cards grandes inclinam menos (cinema),
 *   cards pequenos respondem mais.
 * • Leve: só transform/opacity (GPU), rAF por card ativo, para ao assentar.
 * Desktop only — no touch o feedback é o "press" via CSS (globals).
 */
export default function TiltController() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (matchMedia('(pointer: coarse)').matches) return;

    const cards = Array.from(document.querySelectorAll('.card-premium, .tilt-3d'));
    if (!cards.length) return;

    const LIFT = 26; // px de translateZ no hover
    const STIFF = 0.085; // rigidez da mola
    const DAMP = 0.8; // amortecimento (<1 → assenta com leve overshoot)
    const cleanups = [];

    cards.forEach((card) => {
      // cards largos inclinam menos → leitura mais cinematográfica
      const r0 = card.getBoundingClientRect();
      const MAX = Math.max(6, Math.min(12, 4200 / Math.max(r0.width, r0.height, 1)));

      const st = {
        rx: 0, ry: 0, lz: 0,
        vx: 0, vy: 0, vz: 0,
        trx: 0, try: 0, tlz: 0,
        raf: 0, active: false,
      };
      card.style.willChange = 'transform';

      // brilho/glare que segue o cursor pela superfície
      const glare = document.createElement('span');
      glare.className = 'tilt-glare';
      card.appendChild(glare);

      const tick = () => {
        // mola amortecida por eixo
        st.vx = (st.vx + (st.trx - st.rx) * STIFF) * DAMP;
        st.vy = (st.vy + (st.try - st.ry) * STIFF) * DAMP;
        st.vz = (st.vz + (st.tlz - st.lz) * STIFF) * DAMP;
        st.rx += st.vx;
        st.ry += st.vy;
        st.lz += st.vz;

        card.style.transform = `perspective(950px) rotateX(${st.rx.toFixed(2)}deg) rotateY(${st.ry.toFixed(2)}deg) translateZ(${st.lz.toFixed(1)}px)`;

        // brilho proporcional à inclinação (0.45 → 1)
        const mag = Math.min(1, (Math.abs(st.rx) + Math.abs(st.ry)) / (MAX * 1.4));
        card.style.setProperty('--tilt-glow', (0.45 + mag * 0.55).toFixed(2));

        const settled =
          !st.active &&
          Math.abs(st.rx) < 0.03 && Math.abs(st.ry) < 0.03 && Math.abs(st.lz) < 0.15 &&
          Math.abs(st.vx) < 0.03 && Math.abs(st.vy) < 0.03 && Math.abs(st.vz) < 0.15;
        if (settled) {
          card.style.transform = '';
          card.style.transition = '';
          st.raf = 0;
          return;
        }
        st.raf = requestAnimationFrame(tick);
      };
      const start = () => {
        if (!st.raf) st.raf = requestAnimationFrame(tick);
      };

      const onEnter = () => {
        st.active = true;
        st.tlz = LIFT;
        card.style.transition = 'none'; // o rAF cuida da suavização
        card.classList.add('is-tilting');
        start();
      };
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        st.try = (px - 0.5) * 2 * MAX;
        st.trx = -(py - 0.5) * 2 * MAX;
        card.style.setProperty('--tilt-mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--tilt-my', (py * 100).toFixed(1) + '%');
        start();
      };
      const onLeave = () => {
        st.active = false;
        st.trx = 0;
        st.try = 0;
        st.tlz = 0;
        card.classList.remove('is-tilting');
        start();
      };

      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);

      cleanups.push(() => {
        card.removeEventListener('pointerenter', onEnter);
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
        if (st.raf) cancelAnimationFrame(st.raf);
        card.style.transform = '';
        card.style.transition = '';
        glare.remove();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
