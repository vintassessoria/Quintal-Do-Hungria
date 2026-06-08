'use client';

import { motion } from 'framer-motion';
import { NIGHT_JOURNEY } from '@/lib/event';
import Reveal from './ui/Reveal';
import SectionTag from './ui/SectionTag';

// duração do "desenho" da linha — o cometa e os nós ficam sincronizados com ela
const LINE_DUR = 1.6;
const lineEase = [0.33, 1, 0.68, 1];
const fillTransition = { duration: LINE_DUR, ease: lineEase };
const viewport = { once: true, margin: '-100px' };

// fração da largura onde cada nó fica (centro das 3 colunas: 1/6, 1/2, 5/6)
const nodeDelay = (i) => LINE_DUR * ((i + 0.5) / NIGHT_JOURNEY.length);

export default function NightJourneyTimeline() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* transição de fundo SEMI-transparente → revela o gradiente fixo global */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a0a12]/85 via-ink/[0.6] to-ink/80" />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(252,157,0,0.14),rgba(241,37,105,0.08)_45%,transparent_70%)] blur-3xl" />

      <div className="relative mx-auto max-w-wrap px-5 sm:px-8">
        <Reveal className="mb-16 max-w-2xl">
          <SectionTag>A jornada da noite</SectionTag>
          <h2 className="font-display mt-6 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
            Do primeiro brilho
            <br />
            ao <span className="text-gradient">último hit</span>.
          </h2>
        </Reveal>

        {/* ───────── Desktop: horizontal ───────── */}
        <div className="hidden lg:block">
          {/* markers — cada número acende quando o cometa passa pela sua parada */}
          <div className="grid grid-cols-3 gap-10">
            {NIGHT_JOURNEY.map((m, i) => (
              <div key={m.marker} className="text-center">
                <motion.span
                  className="font-display inline-block text-6xl leading-none text-white"
                  initial={{ opacity: 0.25, y: 14, filter: 'blur(2px)' }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    textShadow: [
                      '0 0 0px rgba(252,157,0,0)',
                      '0 0 26px rgba(252,157,0,0.65)',
                      '0 0 0px rgba(252,157,0,0)',
                    ],
                  }}
                  viewport={viewport}
                  transition={{ delay: nodeDelay(i), duration: 0.7, ease: 'easeOut' }}
                >
                  {m.marker}
                </motion.span>
              </div>
            ))}
          </div>

          {/* linha + nós + cometa */}
          <div className="relative my-9 h-4">
            {/* trilho */}
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />

            {/* preenchimento que se desenha da esquerda p/ direita */}
            <motion.div
              className="absolute left-0 top-1/2 h-[2px] w-full origin-left -translate-y-1/2 rounded-full bg-brand-gradient-r shadow-[0_0_16px_rgba(241,37,105,0.8)]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewport}
              transition={fillTransition}
            />

            {/* cometa de luz que corre na ponta, "desenhando" a linha */}
            <motion.span
              className="absolute top-1/2 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_22px_7px_rgba(252,157,0,0.75)]"
              initial={{ left: '0%', opacity: 0 }}
              whileInView={{ left: '100%', opacity: [0, 1, 1, 0] }}
              viewport={viewport}
              transition={{
                left: fillTransition,
                opacity: { duration: LINE_DUR, times: [0, 0.06, 0.9, 1] },
              }}
            />

            {/* nós (acendem + pulsam quando o cometa chega) */}
            <div className="relative grid h-full grid-cols-3 gap-10">
              {NIGHT_JOURNEY.map((m, i) => (
                <div key={m.marker} className="relative flex items-center justify-center">
                  {/* pulso (ripple) */}
                  <motion.span
                    className="absolute h-4 w-4 rounded-full bg-ember/60"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: [0.5, 2.8], opacity: [0.7, 0] }}
                    viewport={viewport}
                    transition={{ delay: nodeDelay(i), duration: 1, ease: 'easeOut' }}
                  />
                  {/* nó */}
                  <motion.span
                    className="relative z-10 h-4 w-4 rounded-full bg-brand-gradient ring-4 ring-ink"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={viewport}
                    transition={{ delay: nodeDelay(i), duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* conteúdo */}
          <div className="grid grid-cols-3 gap-10">
            {NIGHT_JOURNEY.map((m, i) => (
              <Reveal key={m.marker} delay={nodeDelay(i) + 0.1} className="text-center">
                <h3 className="font-display text-2xl text-white">{m.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/55">
                  {m.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ───────── Mobile: vertical ───────── */}
        <div className="relative pl-10 lg:hidden">
          {/* trilho */}
          <div className="absolute bottom-2 left-3 top-2 w-px bg-white/10" />
          {/* preenchimento de cima p/ baixo */}
          <motion.div
            className="absolute left-3 top-2 w-px origin-top rounded-full bg-brand-gradient shadow-[0_0_14px_rgba(241,37,105,0.7)]"
            style={{ bottom: '0.5rem' }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={fillTransition}
          />
          {/* cometa descendo */}
          <motion.span
            className="absolute left-3 z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_6px_rgba(252,157,0,0.7)]"
            initial={{ top: '0.5rem', opacity: 0 }}
            whileInView={{ top: 'calc(100% - 0.5rem)', opacity: [0, 1, 1, 0] }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              top: fillTransition,
              opacity: { duration: LINE_DUR, times: [0, 0.06, 0.9, 1] },
            }}
          />
          {NIGHT_JOURNEY.map((m, i) => (
            <Reveal key={m.marker} delay={i * 0.1} className="relative mb-12 last:mb-0">
              {/* pulso */}
              <motion.span
                className="absolute -left-[34px] top-1.5 h-4 w-4 rounded-full bg-ember/60"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: [0.5, 2.6], opacity: [0.7, 0] }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: 0.2 + i * 0.45, duration: 1, ease: 'easeOut' }}
              />
              {/* nó */}
              <motion.span
                className="absolute -left-[34px] top-1.5 h-4 w-4 rounded-full bg-brand-gradient ring-4 ring-ink"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: 0.2 + i * 0.45, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
              />
              <span className="font-display text-5xl leading-none text-white">{m.marker}</span>
              <h3 className="font-display mt-3 text-xl text-white">{m.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">{m.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
