'use client';

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { TOUR_DATES } from '@/lib/event';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import GradientButton from './ui/GradientButton';
import SectionTag from './ui/SectionTag';

/* ══════════════════════════════════════════════════════════════════════
   SEÇÃO — TURNÊ (cards + trava + revelação um por um)
   Desktop: a tela TRAVA (position:sticky) e os CARDS aparecem um a um (da
   esquerda p/ a direita) atrelados ao scroll. Mobile: cards empilhados,
   cada um revela ao entrar na tela (sem travar).
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
  if (date.status === 'active') {
    return (
      <GradientButton href={date.ticketUrl} external size="sm" icon className="w-full justify-center">
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

function TourCard({ date }) {
  const active = date.status === 'active';
  const soon = date.status === 'soon';

  return (
    <article
      className={`group relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-[1.5rem] border p-6 ${
        active
          ? 'border-ember/40 bg-gradient-to-b from-ember/[0.14] via-white/[0.02] to-transparent shadow-[0_0_50px_-12px_rgba(241,37,105,0.6)]'
          : 'border-white/10 bg-white/[0.025]'
      } ${soon ? 'opacity-60' : ''}`}
    >
      {active && (
        <span className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-brand-gradient shadow-[0_0_18px_rgba(241,37,105,0.55)]" />
      )}

      {/* topo: status + selo */}
      <div className="flex items-center justify-between">
        <StatusDot status={date.status} />
        {active && (
          <span className="inline-flex items-center rounded-full border border-ember/30 bg-ember/[0.12] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white">
            Próxima
          </span>
        )}
      </div>

      {/* meio: data + cidade + local */}
      <div>
        {soon ? (
          <span className="font-display text-4xl leading-none text-white/45">Em breve</span>
        ) : (
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className={`font-display text-5xl ${active ? 'text-gradient' : 'text-white'}`}>
              {date.day}
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                active ? 'text-gold/90' : 'text-white/45'
              }`}
            >
              {date.month}
            </span>
          </div>
        )}

        <h3 className={`font-display mt-3 text-2xl leading-tight ${active ? 'text-white' : 'text-white/90'}`}>
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

      {/* base: ação */}
      <div className="mt-5">
        <ActionCell date={date} />
      </div>
    </article>
  );
}

export default function TourDatesSection() {
  const tallRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tall = tallRef.current;
    const list = listRef.current;
    if (!tall || !list) return;
    const cards = gsap.utils.toArray('[data-tour-card]', list);
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      // começam escondidos (opacidade no WRAPPER → preserva o dim das "soon")
      gsap.set(cards, { opacity: 0, y: 50 });

      const mm = gsap.matchMedia();

      // DESKTOP: a tela TRAVA (sticky) e os cards aparecem um a um com o scroll
      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: tall, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
        });
        cards.forEach((c, i) => {
          tl.to(c, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, i * 0.8);
        });
        tl.to({}, { duration: 1.2 }); // respiro com todos visíveis antes de soltar
      });

      // MOBILE: carrossel horizontal (swipe) — os cards aparecem em sequência ao entrar
      mm.add('(max-width: 1023.98px)', () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: { trigger: list, start: 'top 82%', once: true },
        });
      });
    }, tall);

    return () => ctx.revert();
  }, []);

  return (
    <section id="turne" className="relative bg-ink-2">
      {/* contêiner ALTO no desktop → distância de scroll p/ a "trava" (sticky) */}
      <div ref={tallRef} className="relative lg:h-[200vh]">
        {/* wrapper STICKY no desktop = a tela trava aqui enquanto os cards aparecem */}
        <div className="bg-grain relative overflow-hidden py-24 sm:py-32 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
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
            <div className="max-w-2xl">
              <SectionTag>A turnê</SectionTag>
              <h2 className="font-display mt-7 text-4xl leading-[0.98] sm:text-5xl lg:text-6xl">
                Quintal do Hungria
                <br />
                <span className="text-gradient">na estrada</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
                A próxima parada é <span className="font-semibold text-white">Ribeirão Preto</span>, em{' '}
                <span className="font-semibold text-white">25 de julho</span>. Os ingressos já estão à
                venda — as demais cidades serão anunciadas em breve.
              </p>
            </div>

            {/* Cards — desktop: fileira (trava + revela um a um) · mobile: carrossel horizontal (swipe) */}
            <div
              ref={listRef}
              className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-12 lg:items-stretch lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {TOUR_DATES.map((date) => (
                <div
                  data-tour-card
                  key={date.id}
                  className="w-[80vw] max-w-[300px] shrink-0 snap-center lg:w-auto lg:min-w-0 lg:max-w-none lg:flex-1"
                >
                  <TourCard date={date} />
                </div>
              ))}
            </div>

            {/* Rodapé */}
            <p className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
              Vendas oficiais pela GuichêWeb · Ribeirão Preto é a próxima data
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
