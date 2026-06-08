import MotionProvider from '@/components/MotionProvider';
import SmoothScroll from '@/components/motion/SmoothScroll';
import ShaderBackground from '@/components/motion/ShaderBackground';
import ParallaxController from '@/components/motion/ParallaxController';
import TiltController from '@/components/motion/TiltController';
import IntroOverlay from '@/components/IntroOverlay';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import EventTicker from '@/components/EventTicker';
import TourDatesSection from '@/components/TourDatesSection';
import ManifestoSection from '@/components/ManifestoSection';
import Stage360Section from '@/components/Stage360Section';
import NightJourneyTimeline from '@/components/NightJourneyTimeline';
import TicketSectors from '@/components/TicketSectors';
import LocationSection from '@/components/LocationSection';
// Galeria desativada por enquanto (sem fotos ainda) — reativar quando chegarem.
// import AtmosphereGallery from '@/components/AtmosphereGallery';
import FAQSection from '@/components/FAQSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import MobileTicketBar from '@/components/MobileTicketBar';

export default function Page() {
  return (
    <MotionProvider>
      <SmoothScroll>
      {/* Gradiente animado FIXO — vive atrás do site inteiro.
          As seções alternam entre revelar (semi-transparentes) e esconder (sólidas). */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <ShaderBackground />
      </div>
      {/* Camadas de motion sutis (degradam sem JS) */}
      <ParallaxController />
      <TiltController />
      {/* Intro de abertura — revela o hero atrás */}
      <IntroOverlay />
      <Header />
      <main className="relative z-10">
        {/* Primeira dobra — do pôr do sol ao centro da noite */}
        <HeroSection />
        <EventTicker />

        {/* Turnê — Ribeirão Preto é a próxima data (prioridade) */}
        <TourDatesSection />

        {/* Narrativa da experiência */}
        <ManifestoSection />
        <Stage360Section />
        <NightJourneyTimeline />

        {/* Conversão */}
        <TicketSectors />
        <LocationSection />

        {/* Desejo + dúvidas */}
        {/* <AtmosphereGallery />  ← galeria desativada até ter as fotos */}
        <FAQSection />

        {/* Clímax */}
        <FinalCTA />
      </main>
      <Footer />
      <MobileTicketBar />
      </SmoothScroll>
    </MotionProvider>
  );
}
