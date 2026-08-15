import { MapPin, Calendar, Clock } from 'lucide-react';
import { EVENT, MAP_URL, MAP_EMBED_URL } from '@/lib/event';
import GradientButton from './ui/GradientButton';
import Reveal from './ui/Reveal';
import SectionTag from './ui/SectionTag';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="group flex items-center gap-4">
      <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-gold transition-all duration-400 group-hover:border-white/25 group-hover:text-white">
        <span className="absolute inset-0 bg-brand-gradient opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
        <Icon className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
      </span>
      <div>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.26em] text-white/45">
          {label}
        </span>
        <span className="font-display mt-0.5 block text-lg text-white">{value}</span>
      </div>
    </div>
  );
}

/**
 * Seção 06 — Localização. Conteúdo tipográfico à esquerda + área de mapa.
 * Placeholder sofisticado pronto para receber o mapa/imagem aérea oficial.
 */
export default function LocationSection() {
  return (
    <section id="local" className="bg-grain relative overflow-hidden bg-ink/[0.62] py-24 sm:py-32">
      <div
        data-parallax="0.09"
        className="pointer-events-none absolute -right-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(252,157,0,0.1),transparent_70%)] blur-3xl"
      />

      <div className="mx-auto grid max-w-wrap items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* ── Conteúdo ── */}
        <Reveal>
          <SectionTag>A próxima parada</SectionTag>
          <h2 className="font-display mt-7 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
            {EVENT.venueShort}
            <br />
            <span className="text-gradient">{EVENT.city}</span>
          </h2>

          <div className="mt-10 space-y-5">
            <InfoRow icon={MapPin} label="Local" value={EVENT.venue} />
            <InfoRow icon={Calendar} label="Data" value={EVENT.date} />
            <InfoRow icon={Clock} label="Abertura" value={`Às ${EVENT.doorsTime.toLowerCase()}`} />
          </div>

          <div className="mt-10">
            {/* SUBSTITUIR MAP_URL em /lib/event.js pelo link oficial da localização */}
            <GradientButton href={MAP_URL} external icon>
              Abrir localização
            </GradientButton>
          </div>
        </Reveal>

        {/* ── Mapa real do Google Maps (interativo, tratado no tom escuro do site) ── */}
        <Reveal delay={0.12}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-ink-2 shadow-panel lg:aspect-[5/4]">
            <iframe
              title="Mapa — Live Curitiba, Curitiba"
              src={MAP_EMBED_URL}
              className="absolute inset-0 h-full w-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_brightness(0.95)_contrast(0.92)]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* vinheta de marca nas bordas — não bloqueia o centro do mapa */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_62%,rgba(8,7,13,0.55))]" />

            {/* etiqueta flutuante */}
            <div className="pointer-events-none absolute left-5 top-5 rounded-xl border border-white/15 bg-ink-2/85 px-4 py-2.5 backdrop-blur-md">
              <span className="font-display text-sm text-white">Quintal do Hungria</span>
              <span className="font-numeric mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
                {EVENT.venueShort} · {EVENT.dateShort}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
