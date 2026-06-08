'use client';

import { useEffect } from 'react';

/**
 * Efeito 3D real (tilt em perspectiva) em TODOS os cards do site.
 * • Alvos: `.card-premium` e `.tilt-3d`.
 * • Cada card rotaciona em 3D seguindo o cursor (rotateX/rotateY) + "sobe"
 *   (translateZ) e ganha um brilho (glare) que acompanha o mouse.
 * • Suavizado por rAF. Desliga em touch e reduced-motion. Sem JS = card normal.
 */
export default function TiltController() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (matchMedia('(pointer: coarse)').matches) return; // sem tilt em touch
    // Motion sempre ligado — não respeita reduce-motion.

    const cards = Array.from(document.querySelectorAll('.card-premium, .tilt-3d'));
    if (!cards.length) return;

    const MAX = 11; // graus máximos de rotação
    const LIFT = 24; // px de translateZ no hover
    const cleanups = [];

    cards.forEach((card) => {
      const st = { rx: 0, ry: 0, lz: 0, trx: 0, try: 0, tlz: 0, raf: 0, active: false };
      card.style.willChange = 'transform';

      // brilho/glare que segue o cursor pela superfície
      const glare = document.createElement('span');
      glare.className = 'tilt-glare';
      card.appendChild(glare);

      const tick = () => {
        st.rx += (st.trx - st.rx) * 0.14;
        st.ry += (st.try - st.ry) * 0.14;
        st.lz += (st.tlz - st.lz) * 0.14;
        card.style.transform = `perspective(950px) rotateX(${st.rx.toFixed(2)}deg) rotateY(${st.ry.toFixed(2)}deg) translateZ(${st.lz.toFixed(1)}px)`;

        const settled =
          !st.active &&
          Math.abs(st.rx) < 0.04 &&
          Math.abs(st.ry) < 0.04 &&
          Math.abs(st.lz) < 0.2;
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
