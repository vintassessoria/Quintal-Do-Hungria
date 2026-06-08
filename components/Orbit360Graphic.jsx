import { useId } from 'react';

// Arredonda coordenadas p/ evitar divergência de ponto flutuante (hydration).
const round2 = (n) => Math.round(n * 100) / 100;

function polar(cx, cy, r, deg) {
  const a = (deg * Math.PI) / 180;
  return { x: round2(cx + r * Math.cos(a)), y: round2(cy + r * Math.sin(a)) };
}
function describeArc(cx, cy, r, startDeg, endDeg) {
  const start = polar(cx, cy, r, endDeg);
  const end = polar(cx, cy, r, startDeg);
  const large = endDeg - startDeg <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

/**
 * Grafismo do PALCO 360° — auréola luminosa (não técnica).
 * Spotlight quente + arco de luz com cauda + anéis suaves + pontos de luz
 * + texto orbital. Halos via stroke (sem filtros SVG) → fluido.
 *
 * Props: text | ticks (anel tracejado) | dots (pontos de luz) | glow | spin
 */
export default function Orbit360Graphic({
  text = null,
  ticks = true,
  dots = false,
  glow = true,
  spin = true,
  className = '',
}) {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  const ids = {
    grad: `g-${uid}`,
    arc: `a-${uid}`,
    soft: `s-${uid}`,
    path: `p-${uid}`,
  };

  const C = 220;
  const rText = 166;
  const spinOrigin = { transformBox: 'fill-box', transformOrigin: 'center' };

  // arco luminoso principal (foco visual) + cauda
  const mainArc = describeArc(C, C, 192, -140, 86);
  const head = polar(C, C, 192, 86);
  // contra-arco discreto (equilíbrio)
  const counterArc = describeArc(C, C, 192, 122, 196);

  // pontos de luz (poucos, brilhantes)
  const dotData = [
    [20, 192], [128, 150], [212, 184], [300, 150], [338, 196],
  ];
  const dotEls = dots
    ? dotData.map(([deg, r], i) => {
        const p = polar(C, C, r, deg);
        const big = i % 2 === 0;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={big ? 7 : 5} fill={`url(#${ids.grad})`} opacity="0.25" />
            <circle cx={p.x} cy={p.y} r={big ? 2.6 : 1.8} fill="#fff" />
          </g>
        );
      })
    : null;

  return (
    <svg viewBox="0 0 440 440" className={className} style={{ overflow: 'visible' }} aria-hidden="true">
      <defs>
        <linearGradient id={ids.grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F12569" />
          <stop offset="100%" stopColor="#FC9D00" />
        </linearGradient>
        <linearGradient id={ids.arc} gradientUnits="userSpaceOnUse" x1="30" y1="400" x2="410" y2="60">
          <stop offset="0%" stopColor="#F12569" stopOpacity="0" />
          <stop offset="30%" stopColor="#F12569" />
          <stop offset="100%" stopColor="#FC9D00" />
        </linearGradient>
        <radialGradient id={ids.soft} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FC9D00" stopOpacity="0.6" />
          <stop offset="34%" stopColor="#F12569" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#F12569" stopOpacity="0" />
        </radialGradient>
        <path
          id={ids.path}
          fill="none"
          d={`M ${C},${C} m -${rText},0 a ${rText},${rText} 0 1,1 ${rText * 2},0 a ${rText},${rText} 0 1,1 -${
            rText * 2
          },0`}
        />
      </defs>

      {/* spotlight quente central */}
      {glow && <circle cx={C} cy={C} r={208} fill={`url(#${ids.soft})`} />}

      {/* anéis concêntricos suaves — estrutura sem cara de medidor */}
      <circle cx={C} cy={C} r={206} fill="none" stroke="#fff" strokeOpacity="0.06" strokeWidth="1" />
      <circle cx={C} cy={C} r={150} fill="none" stroke="#fff" strokeOpacity="0.045" strokeWidth="1" />

      {/* anel tracejado finíssimo (elegante, no lugar dos ticks) */}
      {ticks && (
        <g className={spin ? 'animate-spin-slow' : ''} style={spinOrigin}>
          <circle
            cx={C}
            cy={C}
            r={179}
            fill="none"
            stroke="#fff"
            strokeOpacity="0.14"
            strokeWidth="1"
            strokeDasharray="1.5 10"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* contra-arco discreto */}
      <path
        d={counterArc}
        fill="none"
        stroke={`url(#${ids.grad})`}
        strokeWidth="1.5"
        strokeOpacity="0.28"
        strokeLinecap="round"
      />

      {/* arco luminoso principal (com halo) — rotação lenta */}
      <g className={spin ? 'animate-spin-slow' : ''} style={spinOrigin}>
        <path
          d={mainArc}
          fill="none"
          stroke={`url(#${ids.arc})`}
          strokeWidth="11"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <path
          d={mainArc}
          fill="none"
          stroke={`url(#${ids.arc})`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* cauda luminosa (comet head) */}
        <circle cx={head.x} cy={head.y} r="8" fill="#FC9D00" opacity="0.35" />
        <circle cx={head.x} cy={head.y} r="3.4" fill="#fff" />
      </g>

      {/* pontos de luz */}
      {dotEls && <g>{dotEls}</g>}

      {/* texto orbital */}
      {text && (
        <g className={spin ? 'animate-spin-reverse' : ''} style={spinOrigin}>
          <text
            fill="#fff"
            fillOpacity="0.55"
            fontSize="11"
            letterSpacing="6"
            style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600 }}
          >
            <textPath href={`#${ids.path}`} startOffset="0%">
              {text}
            </textPath>
          </text>
        </g>
      )}
    </svg>
  );
}
