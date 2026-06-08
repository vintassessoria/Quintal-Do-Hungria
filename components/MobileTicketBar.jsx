'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
import { TICKET_URL } from '@/lib/event';

/**
 * Botão flutuante inferior — aparece depois que o visitante deixa a
 * primeira dobra. Visível em mobile/tablet, oculto no desktop.
 */
export default function MobileTicketBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 lg:hidden"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))', paddingTop: '0.5rem' }}
        >
          {/* esmaecido para o botão flutuar sobre o conteúdo */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />
          <a
            href={TICKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center gap-2.5 rounded-2xl bg-brand-gradient px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-glow ring-1 ring-white/15"
          >
            <Ticket className="h-4 w-4" />
            Comprar ingresso
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
