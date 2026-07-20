'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { TOUR_DATES } from '@/lib/event';
import GradientButton from './ui/GradientButton';
import Reveal from './ui/Reveal';
import SectionTag from './ui/SectionTag';

/* ══════════════════════════════════════════════════════════════════════
   SEÇÃO — TURNÊ / EDIÇÕES (deck 3D em leque)
   Card ativo de frente no centro; vizinhos girados em perspectiva atrás
   (estilo "baralho aberto"). Setas + bolinhas, swipe no touch, clique no
   card lateral traz pro centro, auto-rotação suave (pausa no hover).
   ────────────────────────────────────────────────────────────────────── */

function StatusDot({ status }) {
  if (status === 'active') {
    return (
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-70" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-gradient shadow-[0_0_12px_rgba(241,37,105,0.8)]" />
      </span>
    );
  }
  if (status === 'confirmed') {
    return <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-white/30 bg-white/10" />;
  }
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-white/15" />;
}

function ActionCell({ date }) {
  // tem link de venda → botão de compra (primário só na próxima parada)
  if (date.ticketUrl) {
    return (
      <GradientButton
        href={date.ticketUrl}
        external
        size="sm"
        icon
        variant={date.status === 'active' ? 'primary' : 'secondary'}
        className="w-full justify-center"
      >
        Garantir ingresso
      </GradientButton>
    );
  }
  const label = date.status === 'confirmed' ? 'Vendas em breve' : 'Em breve';
  return (
    <span
      className={`inline-flex w-full items-center justify-center rounded-full border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
        date.status === 'confirmed'
          ? 'border-white/12 bg-white/[0.03] text-white/55'
          : 'border-white/[0.07] bg-transparent text-white/35'
      }`}
    >
      {label}
    </span>
  );
}

function TourCard({ date, active }) {
  const soon = date.status === 'soon';
  const hot = date.status === 'active';

  return (
    <article
      className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] border p-6 ${
        hot
          ? 'border-ember/40 bg-gradient-to-b from-ember/[0.16] via-ink-2 to-ink shadow-[0_0_60px_-10px_rgba(241,37,105,0.65)]'
          : 'border-white/10 bg-gradient-to-b from-white/[0.05] via-ink-2 to-ink'
      } ${soon && !active ? 'opacity-90' : ''}`}
    >
      {hot && (
        <span className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-brand-gradient shadow-[0_0_18px_rgba(241,37,105,0.55)]" />
      )}

      <div className="flex items-center justify-between">
        <StatusDot status={date.status} />
        {hot && (
          <span className="inline-flex items-center rounded-full border border-ember/30 bg-ember/[0.12] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white">
            Próxima parada
          </span>
        )}
      </div>

      <div>
        {soon ? (
          <span className="font-display text-4xl leading-none text-white/45">Em breve</span>
        ) : (
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className={`font-display text-6xl ${hot ? 'text-gradient' : 'text-white'}`}>
              {date.day}
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                hot ? 'text-gold/90' : 'text-white/45'
              }`}
            >
              {date.month}
            </span>
          </div>
        )}

        <h3 className={`font-display mt-3 text-3xl leading-tight ${hot ? 'text-white' : 'text-white/90'}`}>
          {date.city}
        </h3>

        {date.venue ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-white/50">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold/80" />
            {date.venue}
          </p>
        ) : soon ? (
          <p className="mt-2 text-xs text-white/40">Nova data em breve</p>
        ) : (
          <p className="mt-2 text-xs text-white/45">Data confirmada · local em breve</p>
        )}
      </div>

      <div className="mt-5">
        <ActionCell date={date} />
      </div>
    </article>
  );
}

export default function TourDatesSection() {
  const n = TOUR_DATES.length;
  const [idx, setIdx] = useState(0); // começa em Ribeirão Preto (ativo)
  const [compact, setCompact] = useState(false);
  const deckRef = useRef(null);
  const hovering = useRef(false);
  const inView = useRef(true);
  const timer = useRef(0);
  const swipe = useRef(null);
  const idxRef = useRef(0);
  const tiltEls = useRef({}); // i → camada interna que recebe o tilt do cursor

  const go = useCallback((i) => setIdx(((i % n) + n) % n), [n]);
  const next = useCallback(() => setIdx((v) => (v + 1) % n), [n]);
  const prev = useCallback(() => setIdx((v) => (v - 1 + n) % n), [n]);

  // auto-rotação (pausa no hover / fora da tela); reinicia ao interagir
  const restart = useCallback(() => {
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      if (!hovering.current && inView.current) next();
    }, 4500);
  }, [next]);

  useEffect(() => {
    restart();
    return () => window.clearInterval(timer.current);
  }, [restart]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = matchMedia('(max-width: 639px)');
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    const io = new IntersectionObserver(([en]) => { inView.current = en.isIntersecting; }, { threshold: 0.15 });
    if (deckRef.current) io.observe(deckRef.current);
    return () => {
      mq.removeEventListener('change', apply);
      io.disconnect();
    };
  }, []);

  // tilt do card CENTRAL seguindo o cursor (desktop) — em camada interna,
  // pra não brigar com a transição de leque do wrapper
  useEffect(() => {
    idxRef.current = idx;
    // ao trocar de card, zera o tilt de todos (o novo começa neutro)
    Object.values(tiltEls.current).forEach((el) => {
      if (el) el.style.transform = '';
    });
  }, [idx]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (matchMedia('(pointer: coarse)').matches) return;
    const deck = deckRef.current;
    if (!deck) return;
    let raf = 0, cx = 0, cy = 0, tx = 0, ty = 0;
    const loop = () => {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      const el = tiltEls.current[idxRef.current];
      if (el)
        el.style.transform = `rotateX(${(-cy * 5).toFixed(2)}deg) rotateY(${(cx * 7).toFixed(2)}deg) translateZ(14px)`;
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const onMove = (e) => {
      const r = deck.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    deck.addEventListener('pointermove', onMove, { passive: true });
    deck.addEventListener('pointerleave', onLeave);
    return () => {
      deck.removeEventListener('pointermove', onMove);
      deck.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // distância circular assinada do card ativo (-2..2 com 5 cards)
  const offFor = (i) => {
    let d = (i - idx + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  const X1 = compact ? 130 : 265; // deslocamento dos vizinhos
  const X2 = compact ? 215 : 485; // deslocamento dos de trás
  const styleFor = (off) => {
    const a = Math.abs(off);
    const x = off === 0 ? 0 : Math.sign(off) * (a === 1 ? X1 : X2);
    const ry = off === 0 ? 0 : -Math.sign(off) * (a === 1 ? 20 : 30);
    const z = a === 0 ? 0 : a === 1 ? -140 : -280;
    const s = a === 0 ? 1 : a === 1 ? 0.86 : 0.74;
    return {
      transform: `translateX(calc(-50% + ${x}px)) translateZ(${z}px) rotateY(${ry}deg) scale(${s})`,
      zIndex: 30 - a * 10,
      filter: a === 0 ? 'none' : `brightness(${a === 1 ? 0.6 : 0.42}) saturate(${a === 1 ? 0.9 : 0.8})`,
      opacity: a === 2 ? 0.9 : 1,
    };
  };

  // swipe no touch (e arraste com mouse)
  const onPointerDown = (e) => { swipe.current = e.clientX; };
  const onPointerUp = (e) => {
    if (swipe.current == null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (dx < -40) { next(); restart(); }
    else if (dx > 40) { prev(); restart(); }
  };

  return (
    <section id="turne" className="bg-grain relative overflow-hidden bg-ink-2 py-24 sm:py-32">
      {/* brilho atmosférico quente sutil */}
      <div
        data-parallax="0.07"
        className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(241,37,105,0.1),transparent_70%)] blur-3xl"
      />
      <div
        data-parallax="0.11"
        className="pointer-events-none absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(252,157,0,0.08),transparent_70%)] blur-3xl"
      />

      <div className="mx-auto w-full max-w-wrap px-5 sm:px-8">
        {/* Cabeçalho */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionTag className="mx-auto">As edições</SectionTag>
          <h2 className="font-display mt-7 text-4xl leading-[0.98] sm:text-5xl lg:text-6xl">
            Quintal do Hungria
            <br />
            <span className="text-gradient">na estrada</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            A próxima parada é <span className="font-semibold text-white">Ribeirão Preto</span>, em{' '}
            <span className="font-semibold text-white">25 de julho</span> — e{' '}
            <span className="font-semibold text-white">Curitiba</span> (19 de setembro) também já
            está com vendas abertas.
          </p>
        </Reveal>
      </div>

      {/* ── Deck 3D em leque ── */}
      <Reveal delay={0.1}>
        <div
          ref={deckRef}
          className="relative mx-auto mt-12 h-[510px] w-full select-none sm:mt-14 sm:h-[580px] [perspective:1400px]"
          onPointerEnter={() => { hovering.current = true; }}
          onPointerLeave={() => { hovering.current = false; }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {/* luz de palco sob o deck */}
          <div className="pointer-events-none absolute bottom-6 left-1/2 h-28 w-[80%] max-w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(241,37,105,0.26),rgba(252,157,0,0.08)_55%,transparent_75%)] blur-2xl" />

          {TOUR_DATES.map((date, i) => {
            const off = offFor(i);
            return (
              <div
                key={date.id}
                className={`absolute left-1/2 top-0 h-[430px] w-[82vw] max-w-[320px] transition-[transform,filter,opacity] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[460px] sm:w-[340px] sm:max-w-none [transform-style:preserve-3d] ${
                  off !== 0 ? 'cursor-pointer' : ''
                }`}
                style={styleFor(off)}
                onClickCapture={(e) => {
                  if (off !== 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    go(i);
                    restart();
                  }
                }}
              >
                {/* camada 1: flutuação suave (só no card ativo) */}
                <div className={`h-full ${off === 0 ? 'deck-float' : ''}`}>
                  {/* camada 2: tilt do cursor (escrita pelo rAF) */}
                  <div
                    ref={(el) => { tiltEls.current[i] = el; }}
                    className="relative h-full will-change-transform [transform-style:preserve-3d]"
                  >
                    <TourCard date={date} active={off === 0} />
                    {/* brilho varrendo o card quando ele assume o centro */}
                    {off === 0 && (
                      <span
                        key={idx}
                        className="deck-shine pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[1.5rem]"
                      />
                    )}
                    {/* reflexo no "chão" — cópia espelhada REAL dentro da camada
                        que anima → desliza junto com o card, sem piscar */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-[calc(100%+12px)] h-full opacity-40 blur-[1px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent_38%)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent_38%)]"
                    >
                      <div className="h-full -scale-y-100">
                        <TourCard date={date} active={off === 0} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* ── Controles: setas + bolinhas ── */}
      <Reveal delay={0.16}>
        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Edição anterior"
            onClick={() => { prev(); restart(); }}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            {TOUR_DATES.map((d, i) => (
              <button
                key={d.id}
                type="button"
                aria-label={`Ir para ${d.city}`}
                onClick={() => { go(i); restart(); }}
                className={`h-2 rounded-full transition-all duration-400 ${
                  i === idx
                    ? 'w-7 bg-brand-gradient shadow-[0_0_10px_rgba(241,37,105,0.6)]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Próxima edição"
            onClick={() => { next(); restart(); }}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Reveal>

      {/* Rodapé da seção */}
      <Reveal delay={0.2}>
        <p className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
          Vendas oficiais: GuichêWeb (Ribeirão Preto) · Bilheteria Digital (Curitiba)
        </p>
      </Reveal>
    </section>
  );
}
