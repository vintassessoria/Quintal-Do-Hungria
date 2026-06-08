import { ArrowRight } from 'lucide-react';

/**
 * Botão / link de conversão — versão refinada.
 *
 * variant: 'primary' (preenchido) | 'secondary' (contorno) | 'ghost'
 * size:    'sm' | 'md' | 'lg'
 *
 * Características premium:
 *  • Shine sweep sutil no hover (luz passando)
 *  • Glow externo controlado, mais profundo no hover
 *  • Microinteração na seta (translateX)
 *  • Focus ring premium (focus-visible global)
 */
export default function GradientButton({
  href = '#',
  children,
  variant = 'primary',
  size = 'md',
  icon = false,
  external = false,
  className = '',
  ...rest
}) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.12em] cursor-pointer overflow-hidden ' +
    'transition-[transform,box-shadow,background,border-color] duration-300 will-change-transform';

  const sizes = {
    sm: 'px-5 py-2.5 text-[11px]',
    md: 'px-7 py-3.5 text-xs',
    lg: 'px-9 py-4.5 text-sm',
  };

  const variants = {
    primary:
      'bg-brand-gradient text-white shadow-glow ring-1 ring-white/15 ' +
      'hover:-translate-y-0.5 hover:brightness-110 ' +
      'hover:shadow-[0_18px_50px_-12px_rgba(241,37,105,0.55),0_0_80px_-10px_rgba(252,157,0,0.5)]',
    secondary:
      'border border-white/20 text-white bg-white/[0.02] backdrop-blur-sm ' +
      'hover:border-white/45 hover:bg-white/[0.06] hover:-translate-y-0.5 ' +
      'hover:shadow-[0_10px_30px_-12px_rgba(241,37,105,0.4)]',
    ghost: 'text-white/80 hover:text-white',
  };

  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const shineLayer = variant === 'primary' && (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
      style={{
        background:
          'linear-gradient(110deg, transparent 38%, rgba(255,255,255,0.32) 50%, transparent 62%)',
      }}
    />
  );

  return (
    <a
      href={href}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...externalProps}
      {...rest}
    >
      {shineLayer}
      <span className="relative z-10 inline-flex items-center gap-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.25)]">
        {children}
        {icon && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
    </a>
  );
}
