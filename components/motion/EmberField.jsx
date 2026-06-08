'use client';

/**
 * Campo de brasas subindo — tema "o quintal vai acender".
 * Valores DETERMINÍSTICOS (mesma saída no servidor e no cliente) para não
 * quebrar a hidratação. Puro CSS (transform/opacity), leve em performance.
 */
const COUNT = 30;
const rand = (i, n) => {
  const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const EMBERS = Array.from({ length: COUNT }, (_, i) => ({
  left: rand(i, 1) * 100,
  size: 2 + rand(i, 2) * 4.5,
  dur: 7 + rand(i, 3) * 8,
  delay: -(rand(i, 4) * 15),
  drift: (rand(i, 5) - 0.5) * 120,
  op: 0.35 + rand(i, 6) * 0.5,
  gold: rand(i, 7) > 0.5,
}));

export default function EmberField({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="ember absolute bottom-0 rounded-full"
          style={{
            left: `${e.left}%`,
            width: `${e.size}px`,
            height: `${e.size}px`,
            background: e.gold
              ? 'radial-gradient(circle, #ffe0b3, #fc9d00 60%, transparent)'
              : 'radial-gradient(circle, #ffc0d0, #f12569 60%, transparent)',
            boxShadow: e.gold
              ? '0 0 8px 1px rgba(252,157,0,0.6)'
              : '0 0 8px 1px rgba(241,37,105,0.55)',
            '--ember-drift': `${e.drift}px`,
            '--ember-op': e.op,
            animationDuration: `${e.dur}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
