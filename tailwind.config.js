/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── Quintal do Hungria — design tokens ───
        ink: '#08070D', // fundo principal
        'ink-2': '#0D0B14', // fundo secundário
        panel: '#12101A', // blocos / cards
        ember: '#F12569', // gradiente — rosa queimado
        gold: '#FC9D00', // gradiente — âmbar / pôr do sol
      },
      fontFamily: {
        // Regarn (display) cai para Montserrat até o arquivo da fonte ser adicionado
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(120deg, #F12569 0%, #FC9D00 100%)',
        'brand-gradient-r': 'linear-gradient(90deg, #F12569 0%, #FC9D00 100%)',
        'brand-radial':
          'radial-gradient(circle at 30% 20%, rgba(241,37,105,0.55) 0%, rgba(252,157,0,0.25) 35%, transparent 70%)',
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(241,37,105,0.55)',
        'glow-gold': '0 0 70px -14px rgba(252,157,0,0.5)',
        'glow-soft': '0 0 120px -30px rgba(241,37,105,0.45)',
        panel: '0 30px 80px -40px rgba(0,0,0,0.9)',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        wrap: '1240px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.06)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
        'spin-slow': 'spin-slow 60s linear infinite',
        'spin-reverse': 'spin-reverse 90s linear infinite',
        float: 'float 9s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 11s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
