/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  QUINTAL DO HUNGRIA — FONTE ÚNICA DE INFORMAÇÃO DO EVENTO          ║
 * ║  Edite somente este arquivo para atualizar dados oficiais.        ║
 * ║  NENHUMA informação não confirmada deve ser adicionada aqui.      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// Link PRINCIPAL de vendas — aponta para a PRÓXIMA PARADA da turnê:
//     Curitiba (19/09), pela Bilheteria Digital. Todos os CTAs "Ingressos"
//     usam este link. As demais cidades têm seus próprios links em TOUR_DATES.
export const TICKET_URL = 'https://checkout2.bilheteriadigital.com/quintal-do-hungria-19-de-setembro'; // Bilheteria Digital — Curitiba (19/09)

// Links de venda das outras edições (usados nos cards da turnê).
export const BH_TICKET_URL =
  'https://baladapp.com.br/evento/quintal-do-hungria-belo-horizonte-mg/9083?cod=INSTA'; // BaladAPP — Belo Horizonte (24/10)
export const RP_TICKET_URL = 'https://www.guicheweb.com.br/quintal-do-hungria_52782'; // GuichêWeb — Ribeirão Preto (remarcado 19/12)

// Local — Live Curitiba, R. Itajubá, 143 – Novo Mundo, Curitiba/PR (81050-040).
// Botão "Abrir localização": abre o Google Maps completo já no ponto (nome + coords).
export const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=Live%20Curitiba%2C%20R.%20Itajub%C3%A1%2C%20143%2C%20Curitiba%20-%20PR';
// Embed (sem chave de API) por COORDENADAS reais do local → renderiza sempre,
// sem depender de geocoding de texto (que às vezes mostrava o mapa em branco).
export const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=-25.4818157,-49.2938475&z=16&hl=pt-BR&output=embed';

// Instagram oficial do Quintal do Hungria.
export const INSTAGRAM_URL = 'https://www.instagram.com/quintaldohungria/';

export const EVENT = {
  name: 'QUINTAL DO HUNGRIA',
  artist: 'Hungria',
  city: 'Curitiba',
  date: '19 de setembro',
  dateShort: '19 SET',
  weekday: 'Sábado',
  venue: 'Live Curitiba',
  venueShort: 'Live Curitiba',
  doorsTime: '21H',
  showDuration: '3 horas',
  experienceDuration: '6 horas',
  ticketPlatform: 'Bilheteria Digital',
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
// │  TURNÊ — datas confirmadas. CURITIBA é a data ATIVA (próxima parada │
// │  e prioridade de venda). RIBEIRÃO PRETO foi remarcada p/ 19/12 —    │
// │  novo local/atrações a divulgar. Cidades "soon" NÃO têm data.      │
// │  status: 'active' | 'confirmed' | 'soon'                            │
// ╰──────────────────────────────────────────────────────────────────╯
export const TOUR_DATES = [
  {
    id: 'curitiba',
    day: '19',
    month: 'SET',
    dateLabel: '19/09',
    city: 'Curitiba',
    venue: 'Live Curitiba',
    status: 'active', // próxima parada — único com acento da marca + CTA
    ticketUrl: TICKET_URL, // Bilheteria Digital
  },
  {
    id: 'bh',
    day: '24',
    month: 'OUT',
    dateLabel: '24/10',
    city: 'Belo Horizonte',
    venue: 'Rooftop BH Outlet',
    status: 'confirmed', // vendas abertas
    ticketUrl: BH_TICKET_URL, // BaladAPP
  },
  {
    id: 'ribeirao',
    day: '19',
    month: 'DEZ',
    dateLabel: '19/12',
    city: 'Ribeirão Preto',
    venue: null, // remarcado — novo local a divulgar
    status: 'confirmed',
    ticketUrl: RP_TICKET_URL, // GuichêWeb
    // Edição remarcada: no card, mostramos as novidades no lugar do "local".
    notice: ['Novas atrações', 'Novo local com áreas cobertas', 'Em breve, mais novidades!'],
    ctaLabel: 'Adquira seu ingresso para próxima edição',
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
  '19 DE SETEMBRO',
  '6 HORAS DE EXPERIÊNCIA',
  '3 HORAS EXCLUSIVAS DE HUNGRIA',
  'PALCO 360°',
  'PRÓXIMA PARADA · CURITIBA',
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
    marker: '21H',
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
    a: 'A próxima parada da turnê é Curitiba, na Live Curitiba — Rua Itajubá, 143, Portão, Curitiba/PR.',
  },
  {
    q: 'Quando acontece a próxima edição?',
    a: 'A próxima edição acontece no dia 19 de setembro, em Curitiba. A casa abre às 21h e o evento é para maiores de 18 anos.',
  },
  {
    q: 'Onde será a edição de Belo Horizonte?',
    a: 'No Rooftop BH Outlet, no dia 24 de outubro, com portões a partir das 16h. Os setores open bar são para maiores de 18 anos; nos demais setores, menores seguem as regras de acompanhamento da organização.',
  },
  {
    q: 'A edição de Ribeirão Preto foi remarcada?',
    a: 'Sim. Ribeirão Preto foi remarcada para 19 de dezembro, com novo local e novas atrações a serem divulgados em breve. Ingressos pela GuichêWeb.',
  },
  {
    q: 'Que horas começa o evento?',
    a: 'A abertura varia por cidade. Na próxima edição, em Curitiba, a Live Curitiba abre às 21h.',
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
    a: 'Curitiba: pela Bilheteria Digital. Belo Horizonte: pela BaladAPP. Ribeirão Preto: pela GuichêWeb. Use sempre os links oficiais aqui do site.',
  },
  {
    q: 'Quais são os setores disponíveis?',
    a: 'Consulte os setores e a disponibilidade atualizada diretamente na plataforma oficial de vendas.',
  },
];

// Texto orbital reutilizado nos grafismos do palco 360°.
export const ORBITAL_TEXT = 'PALCO 360° • CURITIBA • 19 SET • HUNGRIA • ';

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
