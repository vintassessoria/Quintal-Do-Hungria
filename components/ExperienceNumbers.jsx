import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { EVENT } from '@/lib/event';
import Orbit360Graphic from './Orbit360Graphic';
import Reveal from './ui/Reveal';
import SectionTag from './ui/SectionTag';

/**
 * Seção 03 — A noite em números (bento premium).
 * Cards de tamanhos diferentes, forte hierarquia, sem ícones corporativos.
 */
export default function ExperienceNumbers() {
  return (
    <section className="bg-grain relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(252,157,0,0.1),transparent_70%)] blur-3xl" />

      <div className="mx-auto max-w-wrap px-5 sm:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <SectionTag>A noite em números</SectionTag>
          <h2 className="font-display mt-6 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
            Uma experiência
            <br />
            feita para <span className="text-gradient">marcar</span>.
          </h2>
        </Reveal>

        <div className="grid auto-rows-[minmax(180px,1fr)] grid-cols-1 gap-4 sm:grid-cols-6">
          {/* ───── Card principal grande — 03H ───── */}
          <Reveal className="sm:col-span-4 sm:row-span-2">
            <article className="card-premium group relative h-full overflow-hidden rounded-[1.75rem] border border-white/10">
              {/* Fundo: foto escura. SUBSTITUIR por foto do artista quando disponível:
                  /public/assets/quintal/artist/ — usando atmosfera por enquanto. */}
              <Image
                src="/assets/quintal/backgrounds/hero-atmosphere.png"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 55vw"
                className="object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(241,37,105,0.28),transparent_55%)]" />

              <div className="relative flex h-full flex-col justify-between p-7 sm:p-9">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
                  Show
                </span>
                <div>
                  <span className="font-display block text-7xl leading-none text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] sm:text-8xl lg:text-9xl">
                    03<span className="text-gradient">H</span>
                  </span>
                  <h3 className="font-display mt-4 text-2xl text-white sm:text-3xl">
                    Show exclusivo do Hungria
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
                    Três horas para cantar, viver e sentir de perto uma apresentação criada
                    especialmente para essa noite.
                  </p>
                </div>
              </div>
            </article>
          </Reveal>

          {/* ───── Card vertical — 360° ───── */}
          <Reveal delay={0.08} className="sm:col-span-2 sm:row-span-2">
            <article className="card-premium group relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-panel/50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(241,37,105,0.18),transparent_60%)]" />
              <Orbit360Graphic
                ticks={false}
                dots
                glow={false}
                className="pointer-events-none absolute left-1/2 top-[38%] h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2 opacity-50"
              />
              <div className="relative flex h-full flex-col justify-between p-7">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
                  Palco
                </span>
                <div className="flex flex-1 items-center justify-center">
                  <span className="font-display text-7xl leading-none text-gradient drop-shadow-[0_6px_30px_rgba(241,37,105,0.4)] sm:text-8xl">
                    360°
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white">Palco central</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    Uma experiência pensada para aproximar o público do show.
                  </p>
                </div>
              </div>
            </article>
          </Reveal>

          {/* ───── Card menor — 06H ───── */}
          <Reveal delay={0.12} className="sm:col-span-3">
            <article className="card-premium top-accent group relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-panel/50 p-7">
              <div className="flex h-full items-center gap-6">
                <span className="font-display text-6xl leading-none text-white sm:text-7xl">
                  06<span className="text-gradient">H</span>
                </span>
                <div>
                  <h3 className="font-display text-xl text-white">De experiência</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    Do pôr do sol à noite, uma programação criada para viver cada momento.
                  </p>
                </div>
              </div>
            </article>
          </Reveal>

          {/* ───── Card menor — localização ───── */}
          <Reveal delay={0.16} className="sm:col-span-3">
            <article className="card-premium group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 bg-panel/50 p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(252,157,0,0.12),transparent_55%)]" />
              <div className="relative">
                <h3 className="font-display text-2xl text-white sm:text-3xl">{EVENT.city}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {EVENT.venue}
                  <br />
                  {EVENT.date} · Abertura às {EVENT.doorsTime.toLowerCase()}
                </p>
              </div>
              <a
                href="#local"
                className="relative mt-5 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/75 transition-colors hover:text-white"
              >
                Ver local
                <ArrowUpRight className="h-4 w-4 text-gold" />
              </a>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
