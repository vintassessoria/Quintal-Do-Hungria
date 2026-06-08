import { ImageIcon } from 'lucide-react';

/**
 * Placeholder premium para imagens ainda não enviadas.
 * Substitui fotos "aleatórias" por um espaço elegante de "imagem em breve".
 *
 * Quando a foto oficial chegar, troque o uso deste componente por uma <img>.
 */
export default function ComingSoonImage({
  className = '',
  label = 'Imagem em breve',
  sub = 'Conteúdo oficial em breve',
}) {
  return (
    <div
      className={`tilt-3d relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-panel to-ink ${className}`}
    >
      {/* brilho sutil da marca */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(241,37,105,0.14),rgba(252,157,0,0.06)_45%,transparent_70%)]" />
      {/* malha sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 78%)',
        }}
      />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-white/55">
          <ImageIcon className="h-5 w-5" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
          {label}
        </span>
        {sub && <span className="max-w-[16rem] text-[10px] leading-relaxed text-white/35">{sub}</span>}
      </div>
    </div>
  );
}
