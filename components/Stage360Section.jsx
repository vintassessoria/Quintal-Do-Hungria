import Artist3D from './motion/Artist3D';
import Reveal from './ui/Reveal';
import SectionTag from './ui/SectionTag';

const PILLARS = [
  { n: '01', label: 'PROXIMIDADE', text: 'O público mais perto do artista.' },
  { n: '02', label: 'IMERSÃO', text: 'A noite acontecendo em todas as direções.' },
  { n: '03', label: 'PRESENÇA', text: 'O Hungria ao alcance dos olhos, de qualquer ângulo.' },
];

/**
 * Seção 02 — O centro da experiência / Palco 360°.
 * Peça central: o MAPA 3D do evento, com rotação 3D reativa ao cursor,
 * anéis orbitais girando, glow pulsante e flutuação.
 */
export default function Stage360Section() {
  return (
    <section id="palco360" className="bg-grain relative overflow-hidden bg-ink-2 py-24 sm:py-32">
      {/* glow central quente vindo do palco */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(241,37,105,0.12),rgba(252,157,0,0.06)_45%,transparent_70%)] blur-3xl" />

      <div className="mx-auto max-w-wrap px-5 sm:px-8">
        {/* Cabeçalho */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionTag className="mx-auto">O centro da experiência</SectionTag>
          <h2 className="font-display mx-auto mt-7 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
            Todos os olhares
            <br />
            para o <span className="text-gradient">centro</span>.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Um palco 360° pensado para diminuir a distância entre o Hungria e o público. Veja como a
            noite acontece ao seu redor — Frontstage, Backstage e o palco no centro de tudo.
          </p>
        </Reveal>

        {/* Peça central — MAPA 3D do evento */}
        <Reveal delay={0.1} className="relative mx-auto mt-14 aspect-square w-full max-w-[42rem]">
          {/* fundo LIMPO: glow pulsante + anéis finos discretos + 1 anel de acento girando */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2">
            <div className="h-full w-full animate-glow-pulse rounded-full bg-[radial-gradient(circle,rgba(241,37,105,0.3),rgba(252,157,0,0.14)_45%,transparent_70%)] blur-2xl" />
          </div>
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-[95%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]" />
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
          <span
            className="map-ring pointer-events-none absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: 'rgba(241,37,105,0.5)',
              borderRightColor: 'rgba(252,157,0,0.3)',
            }}
          />

          {/* mapa flutuando + rotação 3D reativa ao cursor */}
          <div className="map-float absolute inset-[8%]">
            <Artist3D className="flex h-full w-full items-center justify-center" maxY={14} maxX={9}>
              <img
                src="/assets/quintal/mapa-3d.webp"
                alt="Mapa 3D do Quintal do Hungria — Palco 360° no centro, com Frontstage, Backstage e passarelas"
                className="h-full w-full object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.6)] [transform:translateZ(46px)]"
              />
            </Artist3D>
          </div>
        </Reveal>

        {/* dica sutil */}
        <Reveal delay={0.16}>
          <p className="mt-6 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
            Mexa o mouse para girar a maquete
          </p>
        </Reveal>

        {/* Três microinformações ao redor do conceito */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={0.1 + i * 0.1}>
              <div className="card-premium top-accent group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-panel/40 p-7">
                <span className="font-display font-numeric text-sm text-gradient">{p.n}</span>
                <h3 className="font-display mt-3 text-xl tracking-tight text-white">{p.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
