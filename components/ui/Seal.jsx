import { useId } from 'react';

/**
 * Selo circular com texto orbital — conceito do palco 360°.
 * Ex.: "3H / DE SHOW" ou "SHOW / EXCLUSIVO".
 */
export default function Seal({
  ring = 'SHOW EXCLUSIVO · 3 HORAS DE HUNGRIA · ',
  top = '3H',
  bottom = 'DE SHOW',
  spin = true,
  className = '',
}) {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  const C = 100;
  const r = 80;

  return (
    <div
      className={`relative grid aspect-square place-items-center rounded-full border border-white/15 bg-ink-2/70 shadow-glow backdrop-blur-md ${className}`}
    >
      <div className="gradient-border pointer-events-none absolute inset-0 rounded-full" />
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path
            id={`seal-${uid}`}
            fill="none"
            d={`M ${C},${C} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${
              r * 2
            },0`}
          />
        </defs>
        <g
          className={spin ? 'animate-spin-slow' : ''}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <text
            fill="#fff"
            fillOpacity="0.55"
            fontSize="10.5"
            letterSpacing="2.5"
            style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600 }}
          >
            <textPath href={`#seal-${uid}`} startOffset="0%">
              {ring}
            </textPath>
          </text>
        </g>
      </svg>
      <div className="z-10 flex flex-col items-center justify-center text-center leading-none">
        <span className="font-display text-3xl text-gradient">{top}</span>
        <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.25em] text-white/70">
          {bottom}
        </span>
      </div>
    </div>
  );
}
