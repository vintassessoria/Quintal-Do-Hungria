'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, TICKET_URL } from '@/lib/event';
import GradientButton from './ui/GradientButton';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Trava o scroll do body quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto max-w-wrap">
        <nav
          className={`relative flex items-center justify-between rounded-2xl border px-3 py-2.5 transition-all duration-500 sm:px-4 ${
            scrolled || open
              ? 'border-white/10 bg-ink-2/80 shadow-panel backdrop-blur-xl'
              : 'border-white/[0.06] bg-ink-2/40 backdrop-blur-md'
          }`}
        >
          {/* Logo */}
          <a href="#topo" className="flex items-center gap-3 pl-1" aria-label="Quintal do Hungria">
            {/* SUBSTITUIR: /public/assets/quintal/logo/logo-quintal.png */}
            <img
              src="/assets/quintal/logo/logo-quintal.png"
              alt="Quintal do Hungria"
              className="h-8 w-auto sm:h-9"
            />
          </a>

          {/* Navegação central (desktop) */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex xl:gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative inline-block py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                  {/* underline gradient — vem do centro, mais elegante */}
                  <span
                    className="absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-brand-gradient-r shadow-[0_0_8px_rgba(241,37,105,0.6)] transition-all duration-400 ease-out group-hover:w-full"
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Ações à direita */}
          <div className="flex items-center gap-2">
            <GradientButton href={TICKET_URL} external size="sm">
              Ingressos
            </GradientButton>

            {/* Hambúrguer (mobile / tablet) */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/80 transition-colors hover:bg-white/5 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Painel mobile */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-2/95 p-2 shadow-panel backdrop-blur-xl lg:hidden"
            >
              <ul className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
