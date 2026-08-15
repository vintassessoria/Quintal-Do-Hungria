import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

// URL base do site (para gerar URLs absolutas de OG/Twitter).
// • Em produção na Vercel, usa automaticamente o domínio do deploy.
// • Defina NEXT_PUBLIC_SITE_URL com o domínio oficial (ex.: o domínio .com.br)
//   nas Environment Variables da Vercel quando ele estiver pronto.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Quintal do Hungria',
  description:
    'O Quintal do Hungria na estrada: 6 horas de experiência em 360°, com 3 horas de show exclusivo do Hungria. Próxima parada: Curitiba, 19 de setembro, Live Curitiba. Ingressos pela Bilheteria Digital.',
  applicationName: 'Quintal do Hungria',
  keywords: [
    'Quintal do Hungria',
    'Hungria',
    'Curitiba',
    'Live Curitiba',
    'show',
    'palco 360',
    'ingressos',
    'turnê Hungria',
  ],
  authors: [{ name: 'Quintal do Hungria' }],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Quintal do Hungria — A turnê',
    description:
      'Quintal do Hungria: 6 horas de experiência em 360°, com 3 horas de show exclusivo do Hungria. Próxima parada: Curitiba · 19 de setembro · Live Curitiba.',
    url: '/',
    siteName: 'Quintal do Hungria',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quintal do Hungria — A turnê',
    description:
      'Quintal do Hungria: 6 horas de experiência em 360°, com 3 horas de show exclusivo do Hungria. Próxima parada: Curitiba · 19 de setembro.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#08070D',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
