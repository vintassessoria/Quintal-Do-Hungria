/**
 * Etiqueta pequena de seção, com ponto luminoso no gradiente da marca.
 */
export default function SectionTag({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 backdrop-blur-sm ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-gradient" />
      </span>
      {children}
    </span>
  );
}
