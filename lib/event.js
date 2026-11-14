/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  QUINTAL DO HUNGRIA — FONTE ÚNICA DE INFORMAÇÃO DO EVENTO          ║
 * ║  Edite somente este arquivo para atualizar dados oficiais.        ║
 * ║  NENHUMA informação não confirmada deve ser adicionada aqui.      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// Link PRINCIPAL de vendas — aponta para a PRÓXIMA PARADA da turnê:
//     Ribeirão Preto (19/12), pela GuichêWeb. Todos os CTAs "Ingressos"
//     usam este link. As demais cidades têm seus próprios links em TOUR_DATES.
export const TICKET_URL = 'https://www.guicheweb.com.br/quintal-do-hungria_52782'; // GuichêWeb — Ribeirão Preto (19/12)

// Local — Fazendinha (Restaurante da Fazendinha), Rod. Anhanguera (SP-330), pista
// lateral, km 316 – Jardim Salgado Filho, Ribeirão Preto/SP (14079-010).
// Botão "Abrir localização": abre o Google Maps completo já no ponto.
export const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=Restaurante%20da%20Fazendinha%2C%20Via%20SP-330%20Pista%20Lateral%2C%20Km%20316%20-%20Jardim%20Salgado%20Filho%2C%20Ribeir%C3%A3o%20Preto%20-%20SP%2C%2014079-010';
// Embed (sem chave de API) por COORDENADAS reais do local → renderiza sempre,
// sem depender de geocoding de texto (que às vezes mostrava o mapa em branco).
export const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=-21.1283184,-47.7683072&z=16&hl=pt-BR&output=embed';

// Instagram oficial do Quintal do Hungria.
export const INSTAGRAM_URL = 'https://www.instagram.com/quintaldohungria/';

export const EVENT = {
  name: 'QUINTAL DO HUNGRIA',
  artist: 'Hungria',
  city: 'Ribeirão Preto',
  date: '19 de dezembro',
  dateShort: '19 DEZ',
  weekday: 'Sábado',
  venue: 'Fazendinha',
  venueShort: 'Fazendinha',
  doorsTime: '20H30', // horário do evento na GuichêWeb (19/12/2026 · 20:30H)
  showDuration: '3 horas',
  experienceDuration: '6 horas',
  ticketPlatform: 'GuichêWeb',
};

// Navegação (header) — âncoras internas da página.
export const NAV_LINKS = [
  { label: 'TURNÊ', href: '#turne' },
  { label: 'EXPERIÊNCIA', href: '#experiencia' },
  { label: 'AFTER MOVIE', href: '#aftermovie' },
  { label: 'PALCO 360°', href: '#palco360' },
  { label: 'SETORES', href: '#setores' },
  { label: 'LOCAL', href: '#local' },
  { label: 'DÚVIDAS', href: '#duvidas' },
];

// ╭──────────────────────────────────────────────────────────────────╮
// │  TURNÊ — RIBEIRÃO PRETO é a data ATIVA (próxima parada e prioridade │
// │  de venda). CURITIBA e BELO HORIZONTE já aconteceram (past).        │
// │  Cidades "soon" NÃO têm data confirmada.                            │
// │  status: 'active' | 'confirmed' | 'past' | 'soon'                   │
// ╰──────────────────────────────────────────────────────────────────╯
export const TOUR_DATES = [
  {
    id: 'curitiba',
    day: '19',
    month: 'SET',
    dateLabel: '19/09',
    city: 'Curitiba',
    venue: 'Live Curitiba',
    status: 'past', // edição já realizada — vendas encerradas
    ticketUrl: null,
  },
  {
    id: 'bh',
    day: '24',
    month: 'OUT',
    dateLabel: '24/10',
    city: 'Belo Horizonte',
    venue: 'Terrazo 367',
    status: 'past', // edição já realizada — vendas encerradas
    ticketUrl: null,
  },
  {
    id: 'ribeirao',
    day: '19',
    month: 'DEZ',
    dateLabel: '19/12',
    city: 'Ribeirão Preto',
    venue: 'Fazendinha',
    status: 'active', // próxima parada — único com acento da marca + CTA
    ticketUrl: TICKET_URL, // GuichêWeb
  },
  {
    id: 'brasilia',
    day: null,
    month: null,
    dateLabel: null,
    city: 'Brasília',
    venue: null,
    status: 'soon', // sem data confirmada — "em breve"
    ticketUrl: null,
  },
  {
    id: 'goiania',
    day: null,
    month: null,
    dateLabel: null,
    city: 'Goiânia',
    venue: null,
    status: 'soon',
    ticketUrl: null,
  },
];

// Faixa de impacto (ticker) após o hero.
export const TICKER_ITEMS = [
  'QUINTAL DO HUNGRIA',
  '19 DE DEZEMBRO',
  '6 HORAS DE EXPERIÊNCIA',
  '3 HORAS EXCLUSIVAS DE HUNGRIA',
  'PALCO 360°',
  'PRÓXIMA PARADA · RIBEIRÃO PRETO',
];

// Setores confirmados — SEM benefícios, valores ou selos não oficiais.
export const SECTORS = [
  {
    id: 'frontstage',
    name: 'FRONTSTAGE',
    note: 'Consulte disponibilidade e informações oficiais deste setor na plataforma de vendas.',
    tone: 'warm', // diferenciação apenas estética
  },
  {
    id: 'backstage',
    name: 'BACKSTAGE',
    note: 'Consulte disponibilidade e informações oficiais deste setor na plataforma de vendas.',
    tone: 'dark', // diferenciação apenas estética
  },
];

// Jornada da noite (timeline).
export const NIGHT_JOURNEY = [
  {
    marker: '20H30',
    title: 'O QUINTAL ABRE',
    text: 'A experiência começa com a chegada do público e a energia tomando conta do Quintal.',
  },
  {
    marker: '360°',
    title: 'A NOITE GANHA FORMA',
    text: 'Luzes, música e proximidade em uma estrutura criada para viver cada detalhe do evento.',
  },
  {
    marker: '3H',
    title: 'O MOMENTO PRINCIPAL',
    text: 'O ápice da noite: 3 horas exclusivas de Hungria no palco — o auge das 6 horas do Quintal.',
  },
];

// FAQ — respostas estritamente baseadas em informações confirmadas.
export const FAQ = [
  {
    q: 'Onde será a próxima edição do Quintal do Hungria?',
    a: 'A próxima parada da turnê é Ribeirão Preto, na Fazendinha — Rodovia Anhanguera (SP-330), km 316, pista lateral, Jardim Salgado Filho, Ribeirão Preto/SP.',
  },
  {
    q: 'Quando acontece a próxima edição?',
    a: 'No sábado, 19 de dezembro, às 20h30, em Ribeirão Preto. Backstage e Lounge (open bar) são para maiores de 18 anos; Frontstage e Bistrô, a partir de 16 anos, acompanhados dos pais.',
  },
  {
    q: 'A edição de Ribeirão Preto foi remarcada?',
    a: 'Sim. A edição de Ribeirão Preto foi remarcada para 19 de dezembro e acontece na Fazendinha. Ingressos pela GuichêWeb.',
  },
  {
    q: 'Que horas começa o evento?',
    a: 'Na próxima edição, em Ribeirão Preto, o evento está marcado para as 20h30.',
  },
  {
    q: 'Quanto tempo dura o show do Hungria?',
    a: 'O Hungria fará um show exclusivo de 3 horas, dentro de uma experiência total de 6 horas.',
  },
  {
    q: 'Qual será a duração da experiência completa?',
    a: 'A experiência completa terá 6 horas de duração, sendo 3 horas exclusivas de show do Hungria.',
  },
  {
    q: 'O que é o palco 360°?',
    a: 'É uma estrutura pensada para aproximar o público do artista e tornar a experiência mais imersiva.',
  },
  {
    q: 'Onde posso comprar meu ingresso?',
    a: 'Os ingressos de Ribeirão Preto são vendidos pela GuichêWeb, plataforma oficial. Use sempre os links oficiais aqui do site.',
  },
  {
    q: 'Quais são os setores disponíveis?',
    a: 'Em Ribeirão Preto: Frontstage, Backstage (open bar), Bistrô para 4 pessoas e Lounge para 10 pessoas (open bar). Consulte valores e disponibilidade na GuichêWeb.',
  },
];

// Texto orbital reutilizado nos grafismos do palco 360°.
export const ORBITAL_TEXT = 'PALCO 360° • RIBEIRÃO PRETO • 19 DEZ • HUNGRIA • ';

// ╭──────────────────────────────────────────────────────────────────╮
// │  GALERIA — fotos de SHOWS ANTERIORES do Hungria (film-strip).      │
// │  1) Coloque os arquivos em: public/assets/quintal/gallery/        │
// │  2) Preencha src + caption abaixo (caption é opcional).           │
// │  Enquanto src = null → mostra placeholder "imagem em breve".      │
// │  São registros de outras apresentações (não do evento de RP).     │
// ╰──────────────────────────────────────────────────────────────────╯
export const GALLERY_PHOTOS = [
  { src: null, caption: null }, // ex.: { src: 'https://pub-dfd14236a91140a5a1e41c79f0a83fe4.r2.dev/quintal/assets/gallery/01.webp', caption: 'Hungria ao vivo' }
  { src: null, caption: null },
  { src: null, caption: null },
  { src: null, caption: null },
  { src: null, caption: null },
  { src: null, caption: null },
  { src: null, caption: null },
  { src: null, caption: null },
];
