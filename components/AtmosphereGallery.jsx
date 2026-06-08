'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { GALLERY_PHOTOS } from '@/lib/event';
import Reveal from './ui/Reveal';
import SectionTag from './ui/SectionTag';
import ComingSoonImage from './ui/ComingSoonImage';

/**
 * Seção — Galeria (FILM-STRIP). Duas faixas de fotos de shows anteriores
 * deslizando em direções opostas. Hover: cor + zoom + pausa. Clique: lightbox.
 * Enquanto as fotos não chegam (src=null), mostra placeholders "imagem em breve".
 */

function Tile({ photo, onOpen }) {
  const SIZE = 'h-[190px] w-[290px] shrink-0 sm:h-[230px] sm:w-[360px]';

  if (!photo.src) {
    return (
      <div className={SIZE}>
        <ComingSoonImage
          className="h-full w-full rounded-2xl border border-white/10"
          label="Imagem em breve"
          sub={photo.caption}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(photo.realIndex)}
      className={`group/tile relative overflow-hidden rounded-2xl border border-white/10 ${SIZE}`}
    >
      <img
        src={photo.src}
        alt={photo.caption || 'Show do Hungria'}
        loading="lazy"
        className="h-full w-full object-cover brightness-90 grayscale-[0.35] transition duration-500 ease-out group-hover/tile:scale-105 group-hover/tile:brightness-100 group-hover/tile:grayscale-0"
      />
      {/* vinheta + ícone de zoom */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 transition-opacity group-hover/tile:opacity-40" />
      <span className="pointer-events-none absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-ink/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/tile:opacity-100">
        <ZoomIn className="h-4 w-4" />
      </span>
      {photo.caption && (
        <span className="pointer-events-none absolute bottom-3 left-3 right-3 truncate text-left text-xs font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100">
          {photo.caption}
        </span>
      )}
    </button>
  );
}

function Strip({ items, reverse, duration, onOpen }) {
  const seq = [...items, ...items]; // duplicado → loop contínuo
  return (
    <div className="mask-fade-x relative overflow-hidden">
      <div
        className="flex w-max items-center gap-4 hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
          willChange: 'transform',
        }}
      >
        {seq.map((photo, i) => (
          <Tile key={i} photo={photo} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

export default function AtmosphereGallery() {
  // anexa o índice "real" (entre as fotos com src) p/ o lightbox
  let ri = 0;
  const photos = GALLERY_PHOTOS.map((p) => ({ ...p, realIndex: p.src ? ri++ : -1 }));
  const real = photos.filter((p) => p.src);

  const [open, setOpen] = useState(-1); // índice em "real"; -1 = fechado
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(-1), []);
  const next = useCallback(() => setOpen((o) => (o + 1) % real.length), [real.length]);
  const prev = useCallback(() => setOpen((o) => (o - 1 + real.length) % real.length), [real.length]);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close, next, prev]);

  // duas faixas: metades diferentes p/ não repetir lado a lado
  const half = Math.ceil(photos.length / 2);
  const rowA = photos.slice(0, half);
  const rowB = photos.slice(half);

  return (
    <section className="bg-grain relative overflow-hidden bg-ink-2 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(241,37,105,0.1),transparent_70%)] blur-3xl" />

      <div className="mx-auto mb-12 max-w-wrap px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <SectionTag>Galeria</SectionTag>
          <h2 className="font-display mt-6 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
            A noite que
            <br />
            <span className="text-gradient">Ribeirão</span> vai viver.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60">
            Registros de shows anteriores do Hungria — a energia que vai tomar conta da Arena NicNet.
          </p>
        </Reveal>
      </div>

      {/* film-strip — duas faixas em direções opostas */}
      <div className="space-y-4">
        <Strip items={rowA} reverse={false} duration={55} onOpen={setOpen} />
        <Strip items={rowB} reverse duration={68} onOpen={setOpen} />
      </div>

      {real.length > 0 && (
        <p className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-white/30">
          Passe o mouse para pausar · clique para ampliar
        </p>
      )}

      {/* ── Lightbox (portal p/ ficar acima de tudo) ── */}
      {mounted &&
        open >= 0 &&
        real[open] &&
        createPortal(
          <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md"
            onClick={close}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.05] text-white transition hover:bg-white/15"
            >
              <X className="h-5 w-5" />
            </button>

            {real.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Anterior"
                className="absolute left-4 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.05] text-white transition hover:bg-white/15 sm:left-8"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            <figure className="max-h-[86vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
              <img
                src={real[open].src}
                alt={real[open].caption || 'Show do Hungria'}
                className="max-h-[80vh] max-w-[92vw] rounded-xl object-contain shadow-[0_30px_90px_rgba(0,0,0,0.7)]"
              />
              {real[open].caption && (
                <figcaption className="mt-4 text-center text-sm font-medium uppercase tracking-[0.18em] text-white/70">
                  {real[open].caption}
                </figcaption>
              )}
            </figure>

            {real.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Próxima"
                className="absolute right-4 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.05] text-white transition hover:bg-white/15 sm:right-8"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              {open + 1} / {real.length}
            </span>
          </div>,
          document.body
        )}
    </section>
  );
}
