import { Maximize2 } from 'lucide-react';
import { SECTORS, TICKET_URL, EVENT } from '@/lib/event';
import GradientButton from './ui/GradientButton';
import Reveal from './ui/Reveal';
import SectionTag from './ui/SectionTag';

/**
 * Seção 05 — Setores e ingressos.
 * Apenas setores confirmados (FRONTSTAGE / BACKSTAGE), sem benefícios,
 * valores ou selos não oficiais. Diferenciação é apenas estética.
 */
export default function TicketSectors() {
  return (
    <section id="setores" className="bg-grain relative overflow-hidden bg-ink-2 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(241,37,105,0.12),transparent_70%)] blur-3xl" />

      <div className="mx-auto max-w-wrap px-5 sm:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <SectionTag className="mx-auto">Escolha como viver essa noite</SectionTag>
          <h2 className="font-display mt-6 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
            Seu lugar
            <br />
            no <span className="text-gradient">Quintal</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/60">
            Garanta seu ingresso para o Quintal do Hungria e prepare-se para viver essa experiência
            de perto.
          </p>
        </Reveal>

        {/* Mapa de setores oficial do evento (Palco 360°) */}
        <Reveal delay={0.05} className="mb-14">
          <figure className="mx-auto max-w-3xl">
            <a
              href="/assets/quintal/mapa-setores.jpeg"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-[1.75rem] border border-white/12 bg-ink shadow-panel transition-colors duration-500 hover:border-white/25"
              aria-label="Abrir o mapa de setores em tamanho ampliado"
            >
              <img
                src="/assets/quintal/mapa-setores.jpeg"
                alt="Mapa de setores do Quintal do Hungria — Palco 360° ao centro, camarotes, pista premium, mesas e área VIP"
                loading="lazy"
                className="w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              />
              {/* dica de ampliar */}
              <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm transition-opacity duration-300 group-hover:text-white">
                <Maximize2 className="h-3.5 w-3.5" />
                Ampliar
              </span>
            </a>
            <figcaption className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Mapa de setores · Palco 360°
            </figcaption>
          </figure>
        </Reveal>

        {/* Cards de setores */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {SECTORS.map((sector, i) => {
            const warm = sector.tone === 'warm';
            return (
              <Reveal key={sector.id} delay={i * 0.1}>
                <article
                  className={`card-premium group relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-[1.75rem] border p-8 sm:p-10 ${
                    warm
                      ? 'border-white/15 bg-gradient-to-br from-ember/[0.18] via-panel/60 to-gold/[0.1]'
                      : 'border-white/10 bg-gradient-to-br from-panel/90 to-ink'
                  }`}
                >
                  {/* atmosfera de fundo, sutilmente distinta */}
                  <div
                    className={`pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100 ${
                      warm
                        ? 'bg-[radial-gradient(circle_at_82%_18%,rgba(252,157,0,0.32),transparent_55%),radial-gradient(circle_at_20%_85%,rgba(241,37,105,0.18),transparent_60%)]'
                        : 'bg-[radial-gradient(circle_at_15%_85%,rgba(241,37,105,0.16),transparent_60%),radial-gradient(circle_at_80%_15%,rgba(252,157,0,0.06),transparent_55%)]'
                    }`}
                  />

                  {/* brilho central na borda superior, marcando "premium" */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${
                      warm
                        ? 'from-transparent via-gold/80 to-transparent'
                        : 'from-transparent via-white/30 to-transparent'
                    }`}
                  />

                  <div className="relative">
                    <span className="font-numeric text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55">
                      Setor 0{i + 1}
                    </span>
                    <h3 className="font-display mt-4 text-4xl leading-[0.95] text-white sm:text-5xl">
                      {sector.name}
                    </h3>
                    <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
                      {sector.note}
                    </p>
                  </div>

                  <div className="relative mt-10">
                    <GradientButton
                      href={TICKET_URL}
                      external
                      variant={warm ? 'primary' : 'secondary'}
                      icon
                    >
                      Comprar ingresso
                    </GradientButton>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* CTA central forte */}
        <Reveal delay={0.15} className="mt-12 text-center">
          <GradientButton href={TICKET_URL} external size="lg" icon>
            Garantir ingresso pela {EVENT.ticketPlatform}
          </GradientButton>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-white/45">
            Compra segura pela plataforma oficial de vendas
          </p>
        </Reveal>
      </div>
    </section>
  );
}
