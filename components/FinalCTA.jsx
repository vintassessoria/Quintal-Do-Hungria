import { EVENT, TICKET_URL } from '@/lib/event';
import GradientButton from './ui/GradientButton';
import MagneticButton from './motion/MagneticButton';
import ShaderBackground from './motion/ShaderBackground';
import EmberField from './motion/EmberField';
import Tilt3DText from './motion/Tilt3DText';
import Reveal from './ui/Reveal';

/**
 * CTA final — clímax da página. A noite no ponto máximo:
 * preto profundo, gradiente vivo, BRASAS subindo ("vai acender") e o
 * título em 3D real (gira em perspectiva com o cursor).
 */
export default function FinalCTA() {
  return (
    <section className="bg-grain relative overflow-hidden bg-[#050409] py-28 text-center sm:py-40">
      {/* fundo: gradiente animado escuro */}
      <ShaderBackground subtle className="opacity-50" />

      {/* brasas subindo */}
      <EmberField />

      {/* glow pulsante atrás do título (centragem no wrapper; pulse no filho) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2">
        <div className="h-full w-full animate-glow-pulse rounded-full bg-[radial-gradient(circle,rgba(241,37,105,0.34),rgba(252,157,0,0.16)_42%,transparent_70%)] blur-3xl" />
      </div>

      {/* fades topo/baixo p/ fundir com as seções vizinhas */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050409] to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55">
            Próxima parada · {EVENT.city} · {EVENT.dateShort}
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <Tilt3DText className="mt-7" maxX={9} maxY={13}>
            <h2
              className="font-display mx-auto text-5xl leading-[0.9] sm:text-7xl lg:text-[5.5rem]"
              style={{
                transformStyle: 'preserve-3d',
                textShadow: '0 2px 0 rgba(0,0,0,0.35), 0 14px 36px rgba(0,0,0,0.6)',
              }}
            >
              <span className="block text-white" style={{ transform: 'translateZ(28px)' }}>
                O Quintal
              </span>
              <span
                className="block text-gradient"
                style={{
                  transform: 'translateZ(72px)',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 28px rgba(241,37,105,0.5))',
                }}
              >
                vai acender
              </span>
              <span className="block text-white" style={{ transform: 'translateZ(28px)' }}>
                a noite.
              </span>
            </h2>
          </Tilt3DText>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Prepare-se para uma noite inesquecível no Quintal do Hungria. A próxima parada é{' '}
            {EVENT.city}, {EVENT.date}.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <MagneticButton strength={0.4}>
              <GradientButton href={TICKET_URL} external size="lg" icon className="text-sm sm:text-base">
                Garantir meu ingresso
              </GradientButton>
            </MagneticButton>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
              Ingressos oficiais pela {EVENT.ticketPlatform}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
