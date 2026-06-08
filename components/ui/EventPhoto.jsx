'use client';

import { useEffect, useRef, useState } from 'react';
import ComingSoonImage from './ComingSoonImage';

/**
 * Foto oficial do evento com fallback automático.
 * • Enquanto o arquivo `src` não existir, mostra o placeholder "imagem em breve".
 * • Quando você colocar a foto no caminho indicado, ela aparece sozinha.
 *
 * Props: src, alt, className (moldura/aspecto), sub (texto do fallback),
 *        tag (etiqueta editorial opcional no canto).
 */
export default function EventPhoto({ src, alt = '', className = '', sub, tag }) {
  const [ok, setOk] = useState(true);
  const imgRef = useRef(null);

  // Captura o caso em que a imagem já falhou (404) ANTES da hidratação
  // anexar o onError — comum em export estático.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, []);

  if (!ok) {
    return <ComingSoonImage className={className} sub={sub} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onError={() => setOk(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* aterramento + calor (mesma linguagem editorial do resto do site) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(252,157,0,0.18),transparent_55%)]" />
      {tag && (
        <span className="absolute right-5 top-5 z-[1] text-[10px] font-semibold uppercase tracking-[0.25em] text-white/75">
          {tag}
        </span>
      )}
    </div>
  );
}
