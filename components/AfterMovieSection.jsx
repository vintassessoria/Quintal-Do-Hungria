'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { EVENT, TICKET_URL } from '@/lib/event';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import GradientButton from './ui/GradientButton';
import Reveal from './ui/Reveal';

/* Arquivos gerados a partir do after movie original (4K HEVC, 240 MB):
   • after-movie.mp4        → 1080p H.264 + AAC, faststart (~36 MB) — player com som
   • after-movie-teaser.mp4 → trecho 00:27,5–00:41,5 do filme, 720p, sem áudio (~2,6 MB) — loop
   • *-poster.webp          → capas (neon do Quintal / 1º frame do teaser) */
const DIR = '/assets/quintal/video';
const FULL_SRC = `${DIR}/after-movie.mp4`;
const TEASER_SRC = `${DIR}/after-movie-teaser.mp4`;
const POSTER = `${DIR}/after-movie-poster.webp`;
const TEASER_POSTER = `${DIR}/after-movie-teaser-poster.webp`;
const TEASER_OFFSET = 27.5; // o teaser começa em 00:27,5 do filme → timecode real
const DURATION = '01:34'; // duração real do after movie (93,99 s)

function timecode(s) {
  const t = Math.floor(s);
  const f = Math.floor((s - t) * 30);
  const pad = (n) => String(n).padStart(2, '0');
  return `00:${pad(Math.floor(t / 60))}:${pad(t % 60)}:${pad(f)}`;
}

/* cantoneira de visor de câmera */
function Corner({ className }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-5 w-5 border-white/60 sm:h-7 sm:w-7 ${className}`}
    />
  );
}

/**
 * Seção — AFTER MOVIE. "Tela de cinema" que abre ao rolar:
 *  • quadro sai inclinado em 3D e com letterbox → endireita e amplia (GSAP scrub)
 *  • teaser mudo em loop (carrega só perto da tela; pausa fora dela)
 *  • UI de câmera: REC + timecode real do filme + cantoneiras
 *  • ambilight: o brilho atrás do quadro assume as cores da cena (desktop)
 *  • play em pílula de vidro que acompanha o cursor (desktop)
 *  • clique → player em tela cheia com som + CTA de ingresso
 */
export default function AfterMovieSection() {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const teaserRef = useRef(null);
  const fullRef = useRef(null);
  const ambiRef = useRef(null);
  const tcRef = useRef(null);
  const playWrapRef = useRef(null);
  const playBtnRef = useRef(null);
  const closeRef = useRef(null);
  const visibleRef = useRef(false);
  const loadedRef = useRef(false);
  const openRef = useRef(false);
  const wasOpenRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [near, setNear] = useState(false); // seção perto da tela → arma o player
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ── teaser: carrega perto da tela, toca visível, pausa fora ── */
  useEffect(() => {
    const v = teaserRef.current;
    const frame = frameRef.current;
    if (!v || !frame) return;
    v.muted = true; // garante autoplay (o React não serializa "muted" no HTML)
    const saveData = !!(navigator.connection && navigator.connection.saveData);
    const io = new IntersectionObserver(
      ([e]) => {
        visibleRef.current = e.isIntersecting;
        if (e.isIntersecting) {
          setNear(true);
          if (!loadedRef.current) {
            if (saveData) return; // economia de dados → fica só a capa
            v.src = TEASER_SRC;
            loadedRef.current = true;
          }
          if (!openRef.current) v.play().catch(() => {});
        } else if (loadedRef.current) {
          v.pause();
        }
      },
      { rootMargin: '250px 0px' }
    );
    io.observe(frame);
    return () => io.disconnect();
  }, []);

  /* ── timecode + ambilight (amostra a cena num canvas minúsculo) ── */
  useEffect(() => {
    const v = teaserRef.current;
    if (!v) return;
    const canvas = ambiRef.current;
    const ambi =
      canvas && !matchMedia('(pointer: coarse)').matches ? canvas.getContext('2d') : null;
    let raf = 0;
    let last = 0;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 80) return; // ~12 fps basta
      last = now;
      if (tcRef.current) tcRef.current.textContent = timecode(TEASER_OFFSET + v.currentTime);
      if (ambi && v.readyState >= 2) {
        try {
          ambi.drawImage(v, 0, 0, canvas.width, canvas.height);
        } catch (e) {}
      }
    };
    const start = () => {
      if (ambi) canvas.style.opacity = '0.8';
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    v.addEventListener('playing', start);
    v.addEventListener('pause', stop);
    return () => {
      v.removeEventListener('playing', start);
      v.removeEventListener('pause', stop);
      stop();
    };
  }, []);

  /* ── "tela de cinema" abrindo ao rolar + texto gigante em parallax ── */
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const ctx = gsap.context(() => {
      const frame = frameRef.current;
      gsap.fromTo(
        frame,
        { scale: 0.84, rotateX: 14, yPercent: 6, transformPerspective: 1400, transformOrigin: '50% 100%' },
        {
          scale: 1,
          rotateX: 0,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'center 60%', scrub: 0.7 },
        }
      );
      gsap.fromTo(
        sec.querySelectorAll('[data-am-bar]'),
        { scaleY: 1 },
        {
          scaleY: 0,
          ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top 80%', end: 'center 58%', scrub: 0.7 },
        }
      );
      const bg = sec.querySelector('[data-am-bgtext]');
      if (bg)
        gsap.fromTo(
          bg,
          { xPercent: 6 },
          {
            xPercent: -24,
            ease: 'none',
            scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 1 },
          }
        );
    }, sec);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  /* ── play acompanha o cursor dentro do quadro (desktop) ── */
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return;
    const frame = frameRef.current;
    const wrap = playWrapRef.current;
    if (!frame || !wrap) return;
    let tx = 0, ty = 0, x = 0, y = 0, s = 1, ts = 1, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      s += (ts - s) * 0.14;
      wrap.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
      if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(ts - s) > 0.05) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (e) => {
      const r = frame.getBoundingClientRect();
      const hw = r.width / 2;
      const hh = r.height / 2;
      // a pílula nunca sai do quadro
      const mx = Math.max(0, hw - wrap.offsetWidth / 2 - 16);
      const my = Math.max(0, hh - wrap.offsetHeight / 2 - 16);
      tx = Math.max(-mx, Math.min(mx, e.clientX - (r.left + hw)));
      ty = Math.max(-my, Math.min(my, e.clientY - (r.top + hh)));
      ts = 1.04;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      ts = 1;
      kick();
    };
    frame.addEventListener('pointermove', onMove);
    frame.addEventListener('pointerleave', onLeave);
    return () => {
      frame.removeEventListener('pointermove', onMove);
      frame.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── player em tela cheia ── */
  const openPlayer = useCallback(() => {
    const v = fullRef.current;
    if (v) {
      if (!v.getAttribute('src')) v.src = FULL_SRC; // garante a fonte mesmo sem o "near"
      // play() dentro do gesto do usuário → libera o áudio (inclusive no iOS)
      v.play().catch(() => {});
    }
    if (teaserRef.current) teaserRef.current.pause();
    setNear(true);
    setOpen(true);
  }, []);

  const closePlayer = useCallback(() => {
    if (fullRef.current) fullRef.current.pause();
    setOpen(false);
  }, []);

  useEffect(() => {
    openRef.current = open;
    if (open) {
      wasOpenRef.current = true;
      if (window.__lenis) window.__lenis.stop();
      document.documentElement.style.overflow = 'hidden';
      if (closeRef.current) closeRef.current.focus({ preventScroll: true });
      const onKey = (e) => {
        if (e.key === 'Escape') closePlayer();
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
    if (!wasOpenRef.current) return; // montagem inicial: não mexe no scroll (intro)
    if (window.__lenis) window.__lenis.start();
    document.documentElement.style.overflow = '';
    if (playBtnRef.current) playBtnRef.current.focus({ preventScroll: true });
    if (visibleRef.current && loadedRef.current && teaserRef.current)
      teaserRef.current.play().catch(() => {});
  }, [open, closePlayer]);

  return (
    <section
      id="aftermovie"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050409] py-24 sm:py-32"
    >
      {/* fusão com as seções vizinhas */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-2 to-transparent" />

      {/* texto gigante vazado, deslizando com o scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[40%] select-none overflow-hidden"
      >
        <div
          data-am-bgtext
          className="font-display whitespace-nowrap text-[22vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)] sm:text-[16vw]"
        >
          AFTER MOVIE · AFTER MOVIE
        </div>
      </div>

      {/* cabeçalho */}
      <div className="relative mx-auto max-w-wrap px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
            Aperte o <span className="text-gradient">play.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            O after movie do Quintal do Hungria. Aumente o som e sinta a energia antes de viver a
            sua noite.
          </p>
        </Reveal>
      </div>

      {/* palco do vídeo */}
      <div className="relative mx-auto mt-14 w-full max-w-[1320px] px-4 sm:mt-16 sm:px-8">
        {/* ambilight: glow de marca fixo + cores da cena (canvas borrado) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[4%] -inset-y-[6%]">
          <div className="absolute inset-0 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(241,37,105,0.26),rgba(252,157,0,0.1)_45%,transparent_70%)] blur-3xl" />
          <canvas
            ref={ambiRef}
            width={48}
            height={27}
            className="absolute inset-0 h-full w-full opacity-0 blur-[64px] saturate-150 transition-opacity duration-[1400ms]"
          />
        </div>

        {/* quadro (clicável inteiro) */}
        <div
          ref={frameRef}
          data-cursor-hover
          onClick={openPlayer}
          className="group relative z-10 mx-auto aspect-video w-full cursor-pointer overflow-hidden rounded-[1.25rem] bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95),0_0_90px_-30px_rgba(241,37,105,0.55)] ring-1 ring-white/12 will-change-transform sm:rounded-[1.75rem]"
        >
          <video
            ref={teaserRef}
            poster={TEASER_POSTER}
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.06]"
          />

          {/* grading: vinheta + base escura p/ leitura */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65))]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/45 transition-opacity duration-700 group-hover:opacity-80" />
          {/* textura de película */}
          <div className="am-scanlines pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" />
          <div className="bg-grain pointer-events-none absolute inset-0" />

          {/* letterbox — recolhe conforme a tela "abre" */}
          <div data-am-bar className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[12%] origin-top bg-black" />
          <div data-am-bar className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[12%] origin-bottom bg-black" />

          {/* visor de câmera */}
          <Corner className="left-3 top-3 rounded-tl-md border-l-2 border-t-2 sm:left-5 sm:top-5" />
          <Corner className="right-3 top-3 rounded-tr-md border-r-2 border-t-2 sm:right-5 sm:top-5" />
          <Corner className="bottom-3 left-3 rounded-bl-md border-b-2 border-l-2 sm:bottom-5 sm:left-5" />
          <Corner className="bottom-3 right-3 rounded-br-md border-b-2 border-r-2 sm:bottom-5 sm:right-5" />

          <div className="font-numeric pointer-events-none absolute left-6 top-5 z-20 flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85 sm:left-12 sm:top-10 sm:text-[11px]">
            <span className="am-rec h-2 w-2 rounded-full bg-[#ff3b3b] shadow-[0_0_10px_rgba(255,59,59,0.9)]" />
            REC
            <span ref={tcRef} className="hidden text-white/55 sm:inline">
              {timecode(TEASER_OFFSET)}
            </span>
          </div>
          <div className="pointer-events-none absolute inset-x-5 bottom-4 z-20 sm:inset-x-12 sm:bottom-10">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold/90 sm:text-[11px]">
              Quintal do Hungria
            </p>
            <p className="font-display mt-1 text-xl leading-none text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:mt-2 sm:text-4xl lg:text-5xl">
              After Movie
            </p>
          </div>

          {/* play — pílula de vidro; no desktop acompanha o cursor */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
            <div ref={playWrapRef} className="will-change-transform">
              <button
                ref={playBtnRef}
                type="button"
                aria-label={`Assistir ao after movie do Quintal do Hungria (${DURATION})`}
                className="group/play pointer-events-auto flex items-center gap-3 whitespace-nowrap rounded-full border border-white/25 bg-black/30 py-1.5 pl-1.5 pr-4 text-white backdrop-blur-md transition-colors duration-300 hover:border-white/50 hover:bg-white/[0.12] focus-visible:rounded-full sm:gap-4 sm:py-2 sm:pl-2 sm:pr-6"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover/play:scale-[1.06] sm:h-11 sm:w-11">
                  {/* triângulo de cantos vivos, deslocado p/ o centro óptico */}
                  <svg viewBox="0 0 12 14" aria-hidden="true" className="ml-[2px] h-3 w-3 sm:h-3.5 sm:w-3.5">
                    <path d="M0 0L12 7L0 14Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] sm:text-[11px]">
                  Assistir<span className="hidden sm:inline"> o filme</span>
                </span>
                <span aria-hidden="true" className="hidden h-3 w-px bg-white/30 sm:block" />
                <span className="font-numeric hidden text-[11px] tracking-[0.2em] text-white/60 sm:inline">
                  {DURATION}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── player em tela cheia (portal: acima do header e de tudo) ── */}
      {mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="After movie do Quintal do Hungria"
            aria-hidden={!open}
            onClick={closePlayer}
            className={`fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl sm:p-8 ${
              open
                ? // visibility troca na hora ao abrir → o botão "Fechar" já recebe foco
                  'visible opacity-100 [transition:opacity_500ms,visibility_0s]'
                : // ao fechar, visibility só some depois do fade
                  'pointer-events-none invisible opacity-0 [transition:opacity_500ms,visibility_0s_linear_500ms]'
            }`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(241,37,105,0.22),rgba(252,157,0,0.08)_50%,transparent_72%)] blur-3xl"
            />
            <button
              ref={closeRef}
              type="button"
              onClick={closePlayer}
              aria-label="Fechar o after movie"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/15 sm:right-6 sm:top-6"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className={`relative transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-[0.94] opacity-0'
              }`}
              style={{ width: 'min(1400px, 100%, calc((100vh - 170px) * 16 / 9))' }}
            >
              <video
                ref={fullRef}
                src={near ? FULL_SRC : undefined}
                poster={near ? POSTER : undefined}
                controls
                playsInline
                preload="none"
                controlsList="nodownload"
                className="aspect-video w-full rounded-xl bg-black shadow-[0_40px_140px_-20px_rgba(0,0,0,0.95)] ring-1 ring-white/10 sm:rounded-2xl"
              />
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:mt-5 sm:flex-row">
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 sm:text-left">
                  Próxima parada · <span className="text-white">{EVENT.city}</span> ·{' '}
                  {EVENT.dateShort}
                </p>
                <GradientButton href={TICKET_URL} external size="sm" icon>
                  Garantir ingresso
                </GradientButton>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
