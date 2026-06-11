/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  QUINTAL DO HUNGRIA — FONTE ÚNICA DE INFORMAÇÃO DO EVENTO          ║
 * ║  Edite somente este arquivo para atualizar dados oficiais.        ║
 * ║  NENHUMA informação não confirmada deve ser adicionada aqui.      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ⚠️  SUBSTITUIR pelo link oficial de vendas da GuichêWeb.
//     Este é o link PRINCIPAL — ingressos de RIBEIRÃO PRETO (25/07), a próxima
//     data e prioridade atual da turnê. Todos os CTAs "Ingressos" apontam aqui.
//     Enquanto não houver link, mantém "#" (botões permanecem visíveis).
export const TICKET_URL = 'https://www.guicheweb.com.br/quintal-do-hungria_52782'; // GuichêWeb — Ribeirão Preto (25/07)

// Link do mapa / localização (Google Maps) — i9 Alcans Park, Ribeirão Preto.
export const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=i9+Alcans+Park,+Ribeir%C3%A3o+Preto+-+SP';
// Embed (sem chave de API) usado no mapa interativo da seção Localização.
export const MAP_EMBED_URL =
  'https://www.google.com/maps?q=i9+Alcans+Park,+Ribeir%C3%A3o+Preto&z=15&hl=pt-BR&output=embed';

// Instagram oficial do Quintal do Hungria.
export const INSTAGRAM_URL = 'https://www.instagram.com/quintaldohungria/';

export const EVENT = {
  name: 'QUINTAL DO HUNGRIA',
  artist: 'Hungria',
  city: 'Ribeirão Preto',
  date: '25 de julho',
  dateShort: '25 JUL',
  weekday: 'Sábado',
  venue: 'i9 Alcans Park',
  venueShort: 'i9 Alcans Park',
  doorsTime: '17H',
  showDuration: '3 horas',
  experienceDuration: '6 horas',
  ticketPlatform: 'GuichêWeb',
};

// Navegação (header) — âncoras internas da página.
export const NAV_LINKS = [
  { label: 'TURNÊ', href: '#turne' },
  { label: 'EXPERIÊNCIA', href: '#experiencia' },
  { label: 'PALCO 360°', href: '#palco360' },
  { label: 'SETORES', href: '#setores' },
  { label: 'LOCAL', href: '#local' },
  { label: 'DÚVIDAS', href: '#duvidas' },
];

// ╭──────────────────────────────────────────────────────────────────╮
// │  TURNÊ — datas confirmadas. RIBEIRÃO PRETO é a data ATIVA (próxima │
// │  e prioridade de venda). Cidades "soon" NÃO têm data inventada.    │
// │  status: 'active' | 'confirmed' | 'soon'                            │
// ╰──────────────────────────────────────────────────────────────────╯
export const TOUR_DATES = [
  {
    id: 'ribeirao',
    day: '25',
    month: 'JUL',
    dateLabel: '25/07',
    city: 'Ribeirão Preto',
    venue: 'i9 Alcans Park',
    status: 'active', // próxima data — único com acento da marca + CTA
    ticketUrl: TICKET_URL,
  },
  {
    id: 'curitiba',
    day: '19',
    month: 'SET',
    dateLabel: '19/09',
    city: 'Curitiba',
    venue: null,
    status: 'confirmed',
    ticketUrl: null,
  },
  {
    id: 'bh',
    day: '24',
    month: 'OUT',
    dateLabel: '24/10',
    city: 'Belo Horizonte',
    venue: 'Rooftop BH Outlet',
    status: 'confirmed',
    ticketUrl: null,
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
  '25 DE JULHO',
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
    marker: '17H',
    title: 'O QUINTAL ABRE',
    text: 'A experiência começa com a chegada do público e a atmosfera do pôr do sol tomando conta do Quintal.',
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
    a: 'A próxima parada da turnê é Ribeirão Preto, no i9 Alcans Park.',
  },
  {
    q: 'Quando acontece a próxima edição?',
    a: 'A próxima edição acontece no dia 25 de julho, em Ribeirão Preto.',
  },
  {
    q: 'Que horas começa o evento?',
    a: 'A abertura está prevista para as 17h.',
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
    a: 'Os ingressos estão disponíveis pela plataforma oficial GuichêWeb.',
  },
  {
    q: 'Quais são os setores disponíveis?',
    a: 'Consulte os setores e a disponibilidade atualizada diretamente na plataforma oficial de vendas.',
  },
];

// Texto orbital reutilizado nos grafismos do palco 360°.
export const ORBITAL_TEXT = 'PALCO 360° • RIBEIRÃO PRETO • 25 JUL • HUNGRIA • ';

// ╭──────────────────────────────────────────────────────────────────╮
// │  GALERIA — fotos de SHOWS ANTERIORES do Hungria (film-strip).      │
// │  1) Coloque os arquivos em: public/assets/quintal/gallery/        │
// │  2) Preencha src + caption abaixo (caption é opcional).           │
// │  Enquanto src = null → mostra placeholder "imagem em breve".      │
// │  São registros de outras apresentações (não do evento de RP).     │
// ╰──────────────────────────────────────────────────────────────────╯
export const GALLERY_PHOTOS = [
  { src: null, caption: null }, // ex.: { src: '/assets/quintal/gallery/01.webp', caption: 'Hungria ao vivo' }
  { src: null, caption: null },
  { src: null, caption: null },
  { src: null, caption: null },
  { src: null, caption: null },
  { src: null, caption: null },
  { src: null, caption: null },
  { src: null, caption: null },
];
