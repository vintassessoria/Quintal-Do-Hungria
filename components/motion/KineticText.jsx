'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

/**
 * Tipografia cinética — cada "linha" é revelada com clip (sobe de baixo).
 * • `lines`: array de ReactNodes (uma por linha visual).
 * • Fallback: sem JS / reduced-motion, o texto já aparece (visível por padrão);
 *   a animação só é aplicada quando o JS roda.
 * • `trigger`: 'load' (revela ao montar) ou 'scroll' (revela ao entrar na viewport).
 */
export default function KineticText({
  lines = [],
  as: Tag = 'div',
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.09,
  trigger = 'load',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const inners = el.querySelectorAll('.kt-inner');
    gsap.set(inners, { yPercent: 118 });

    const tween = gsap.to(inners, {
      yPercent: 0,
      duration: 1.15,
      ease: 'power4.out',
      stagger,
      delay,
      scrollTrigger:
        trigger === 'scroll'
          ? { trigger: el, start: 'top 82%', once: true }
          : undefined,
    });

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      gsap.set(inners, { clearProps: 'transform' });
    };
  }, [delay, stagger, trigger]);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((ln, i) => (
        <span key={i} className={`block overflow-hidden ${lineClassName}`}>
          <span className="kt-inner block will-change-transform">{ln}</span>
        </span>
      ))}
    </Tag>
  );
}
