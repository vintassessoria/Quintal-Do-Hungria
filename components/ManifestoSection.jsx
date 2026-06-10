import Orbit360Graphic from './Orbit360Graphic';
import Reveal from './ui/Reveal';
import SectionTag from './ui/SectionTag';
import EventPhoto from './ui/EventPhoto';

/**
 * Seção 01 — Manifesto da experiência. Editorial, com respiro,
 * estabelece desejo. Âncora #experiencia (CTA secundário do hero).
 */
export default function ManifestoSection() {
  return (
    <section id="experiencia" className="bg-grain relative overflow-hidden bg-ink/[0.62] py-24 sm:py-32">
      {/* glow lateral quente, ainda lembrando o pôr do sol */}
      <div
        data-parallax="0.08"
        className="pointer-events-none absolute -left-32 top-1/3 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(241,37,105,0.16),transparent_70%)] blur-3xl"
      />

      <div className="mx-auto grid max-w-wrap items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* ── Texto ── */}
        <Reveal>
          <SectionTag>Uma noite para viver de perto</SectionTag>
          <h2 className="font-display mt-7 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
            Não é só um show.
            <br />
            É o <span className="text-gradient">Quintal</span>
            <br />
            do Hungria.
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            O Quintal do Hungria é uma experiência criada para aproximar público e artista — uma
            noite quente, intensa e inesquecível. E a próxima cidade a viver isso é Ribeirão Preto.
          </p>
        </Reveal>

        {/* ── Composição visual ── */}
        <Reveal delay={0.12} className="relative">
          {/* linhas orbitais cruzando a composição, sutis */}
          <Orbit360Graphic
            ticks={false}
            dots
            glow={false}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 opacity-40"
          />

          <div className="relative">
            {/* moldura — foto oficial do evento (public/assets/quintal/manifesto.jpg) */}
            <EventPhoto
              src="/assets/quintal/manifesto.jpg"
              alt="O Quintal do Hungria no centro de Ribeirão Preto"
              className="tilt-3d aspect-[4/5] rounded-[2rem] border border-white/10 shadow-panel"
              sub="Foto oficial do evento"
              tag="Quintal do Hungria"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
