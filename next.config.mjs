/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── EXPORT ESTÁTICO ──
  // Gera um site 100% estático em /out (com index.html), que pode ser
  // hospedado em qualquer lugar: Vercel, GitHub Pages, Netlify, hospedagem
  // simples, etc. A "index" do site é /out/index.html.
  output: 'export',

  images: {
    // Export estático não usa o otimizador de imagens do Next em runtime.
    // Os assets já são PNGs otimizados na paleta da marca.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },

  // URLs com barra final → cada rota vira uma pasta com index.html
  // (melhor compatibilidade em hospedagem estática).
  trailingSlash: true,
};

export default nextConfig;
