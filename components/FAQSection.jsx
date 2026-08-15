'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FAQ, TICKET_URL, EVENT } from '@/lib/event';
import GradientButton from './ui/GradientButton';
import Reveal from './ui/Reveal';
import SectionTag from './ui/SectionTag';

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="group/faq relative border-b border-white/10 transition-colors duration-300 hover:border-white/20">
      {/* highlight gradient inferior quando aberto */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-500 ${
          isOpen ? 'bg-gradient-to-r from-transparent via-ember/70 to-transparent opacity-100' : 'opacity-0'
        }`}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
      >
        <span
          className={`text-base font-medium leading-snug transition-colors duration-300 sm:text-lg ${
            isOpen ? 'text-white' : 'text-white/70 group-hover/faq:text-white/95'
          }`}
        >
          {item.q}
        </span>
        <span
          className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-400 ${
            isOpen
              ? 'rotate-45 border-transparent bg-brand-gradient text-white shadow-[0_0_22px_-4px_rgba(241,37,105,0.7)]'
              : 'border-white/15 text-white/65 group-hover/faq:border-white/40 group-hover/faq:text-white'
          }`}
        >
          <Plus className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-xl pb-7 pr-12 text-sm leading-relaxed text-white/60 sm:text-base">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Seção 08 — FAQ. Visual escuro e sofisticado, respostas baseadas
 * exclusivamente em informações confirmadas.
 */
export default function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="duvidas" className="bg-grain relative overflow-hidden bg-ink-2 py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(241,37,105,0.1),transparent_70%)] blur-3xl" />

      <div className="mx-auto grid max-w-wrap gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* coluna esquerda */}
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <SectionTag>Dúvidas</SectionTag>
            <h2 className="font-display mt-6 text-4xl leading-[0.95] sm:text-5xl">
              Informações
              <br />
              <span className="text-gradient">importantes</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
              Tudo o que você precisa saber para viver o Quintal do Hungria. Ingressos da próxima
              parada pela plataforma oficial {EVENT.ticketPlatform}.
            </p>
            <div className="mt-8">
              <GradientButton href={TICKET_URL} external variant="secondary" icon>
                Garantir meu ingresso
              </GradientButton>
            </div>
          </div>
        </Reveal>

        {/* coluna direita — accordion */}
        <Reveal delay={0.1}>
          <div>
            {FAQ.map((item, i) => (
              <FaqItem
                key={i}
                item={item}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
