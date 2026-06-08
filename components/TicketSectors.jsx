import { SECTORS, TICKET_URL } from '@/lib/event';
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
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-120 ${
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
            Garantir ingresso pela GuichêWeb
          </GradientButton>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-white/45">
            Compra segura pela plataforma oficial de vendas
          </p>
        </Reveal>
      </div>
    </section>
  );
}
