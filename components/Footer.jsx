import { Instagram } from 'lucide-react';
import { EVENT, TICKET_URL, NAV_LINKS, INSTAGRAM_URL } from '@/lib/event';
import GradientButton from './ui/GradientButton';

// Perfis oficiais. (Adicionar YouTube/Facebook aqui quando houver os links.)
const SOCIALS = [{ label: 'Instagram', icon: Instagram, href: INSTAGRAM_URL }];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050409] py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-ember/40 to-transparent" />

      <div className="mx-auto max-w-wrap px-5 sm:px-8">
        {/* topo */}
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="flex flex-col items-center gap-4 md:items-start">
            {/* SUBSTITUIR: /public/assets/quintal/logo/logo-quintal.png */}
            <img
              src="/assets/quintal/logo/logo-quintal.png"
              alt="Quintal do Hungria"
              className="h-12 w-auto"
            />
            <p className="max-w-xs text-xs leading-relaxed text-white/45">
              Próxima parada: {EVENT.city} · {EVENT.date} · {EVENT.venueShort}.
            </p>
          </div>

          <div className="flex flex-col items-center gap-5 md:items-end">
            <GradientButton href={TICKET_URL} external size="sm" icon>
              Garantir ingresso
            </GradientButton>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/10 text-white/60 transition-all duration-400 hover:border-transparent hover:text-white"
                >
                  {/* fundo gradiente que aparece no hover */}
                  <span className="absolute inset-0 bg-brand-gradient opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                  <Icon className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* navegação rápida */}
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-white/[0.07] pt-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* régua de logos — realização (a imagem já traz o título e os logos Best, Hungria e MVR) */}
        <div className="mt-12 flex justify-center">
          <img
            src="/assets/quintal/partners/partners-row.png"
            alt="Realização: Best, Hungria e MVR Produções e Negócios Artísticos"
            className="w-full max-w-[200px] opacity-45 transition-opacity duration-500 hover:opacity-85 sm:max-w-[240px]"
          />
        </div>

        {/* copyright */}
        <div className="mt-12 border-t border-white/[0.07] pt-8 text-center">
          <p className="text-[11px] tracking-wide text-white/40">
            © {EVENT.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
