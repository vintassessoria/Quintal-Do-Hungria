# QUINTAL DO HUNGRIA — Landing Page

Site oficial do evento **Quintal do Hungria** · Ribeirão Preto · 25 de julho.
Conceito: **"do pôr do sol ao centro da noite"** — uma experiência tropical
noturna, premium e cinematográfica, com o **palco 360°** como assinatura visual.

Stack: **Next.js 14 (App Router) · React 18 · Tailwind CSS · Framer Motion · Lucide**.

---

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento → http://localhost:3000
npm run build    # gera o site estático em /out (com index.html)
npm start        # serve a pasta /out → http://localhost:3000
```

### 👀 Ver o site no PC (sem servidor) / subir no Claude
A pasta `standalone/` tem duas versões que **abrem no duplo-clique**, offline:

| Arquivo | O que é | Use para |
|--------|---------|----------|
| **`standalone/quintal-do-hungria.html`** | **Arquivo único** (~3 MB) com CSS, JS e **todas as imagens embutidas** | Abrir no duplo-clique **e subir/enviar no Claude** ✅ |
| `standalone/index.html` | HTML + pasta `assets/` ao lado | Abrir local (precisa da pasta junto) |

- Jeito mais fácil: **duplo-clique em `Ver site.bat`** → abre o arquivo único.
- Ou abra direto: **`standalone/quintal-do-hungria.html`**.

Para regerar depois de qualquer mudança no site:

```bash
npm run view        # next build + gera as versões standalone (pasta + arquivo único)
# ou, se já rodou o build:
npm run standalone
```

> ℹ️ O `out/index.html` (export “puro” do Next) **precisa de servidor**
> (`npm start`) porque usa módulos JS. As versões em `standalone/` são
> autossuficientes — abrem sozinhas, sem servidor.

---

## ✏️ O que editar (sem mexer no design)

### 1. Link de ingressos (GuichêWeb) e mapa
Arquivo **`lib/event.js`** — fonte única de informação do evento:

```js
export const TICKET_URL = '#'; // ← COLE AQUI o link oficial da GuichêWeb
export const MAP_URL = '#';     // ← COLE AQUI o link da localização (Maps)
```

Todos os botões de compra usam `TICKET_URL`. Todas as informações do evento
(data, local, horários, setores, FAQ) também saem desse arquivo.

### 2. Datas da turnê
Arquivo **`lib/event.js`** → array **`TOUR_DATES`**. Ribeirão Preto é a data
`active` (próxima, com acento + CTA). Curitiba/BH são `confirmed`; Brasília/
Goiânia são `soon` (sem data inventada). Para liberar venda de outra cidade,
mude o `status` para `active` e preencha `ticketUrl`.

### 3. Fonte Regarn
Coloque os arquivos em **`public/fonts/regarn/`** (veja o README de lá).
Até existirem, os títulos usam um fallback pesado de Montserrat.

### 4. Foto do Hungria
Coloque a foto recortada em **`public/assets/quintal/artist/hungria.png`**.
Ela aparece sozinha no hero (substituindo o placeholder).

---

## 🚀 Deploy

O projeto está configurado como **export estático** (`output: 'export'` no
`next.config.mjs`). O `npm run build` gera a pasta **`out/`** com o
**`out/index.html`** — um site 100% estático que roda em qualquer hospedagem.

```bash
npm run build     # gera /out (com index.html)
npm start         # pré-visualiza o /out em http://localhost:3000
```

### Opção A — Vercel + GitHub (recomendado)

```bash
git init
git add -A
git commit -m "Quintal do Hungria — landing page"
git branch -M main
git remote add origin https://github.com/<usuario>/<repo>.git
git push -u origin main
```

Depois, em **vercel.com → Add New Project → Import** o repositório.
A Vercel detecta Next.js e a saída estática automaticamente (sem `vercel.json`).

### Opção B — Qualquer hospedagem estática (GitHub Pages, Netlify, FTP…)
Basta subir o conteúdo da pasta **`out/`**. O `index.html` é a página inicial.

### ⚠️ Antes do build de produção: domínio do preview social
As URLs de Open Graph/Twitter são "assadas" no `index.html` no momento do build.
Para o preview social (WhatsApp, Instagram, X) apontar para o domínio certo,
faça o build com a variável definida:

```bash
# Windows PowerShell
$env:NEXT_PUBLIC_SITE_URL="https://seu-dominio.com.br"; npm run build

# Linux/macOS
NEXT_PUBLIC_SITE_URL="https://seu-dominio.com.br" npm run build
```

Na Vercel, defina **Settings → Environment Variables → `NEXT_PUBLIC_SITE_URL`**
(ou deixe em branco que ela usa o domínio do deploy).

### Assets de launch (favicon + preview social)
Gerados a partir da logo/hero oficiais e auto-detectados pelo Next:
`app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png`.
Para regerar (após trocar logo/hero):

```bash
node scripts/gen-launch-assets.mjs
```

---

## 🗂️ Estrutura de assets

```
public/
├─ assets/quintal/
│  ├─ logo/        logo-quintal.png            (logo oficial)
│  ├─ artist/      hungria.png                 (← adicionar foto recortada)
│  ├─ backgrounds/ hero-atmosphere / sunset-01 / sunset-02
│  ├─ elements/    palmeiras e folhagens (gradiente da marca)
│  ├─ gallery/     fotos adicionais (← opcional)
│  └─ partners/    partners-row.png            (régua de logos)
└─ fonts/regarn/   (← arquivos da fonte Regarn)
```

Todo ponto de substituição de asset está marcado com comentários
`SUBSTITUIR:` no código.

---

## 🧩 Componentes

`Header` · `HeroSection` · `EventTicker` · `TourDatesSection` ·
`ManifestoSection` · `Stage360Section` · `ExperienceNumbers` ·
`NightJourneyTimeline` · `TicketSectors` · `LocationSection` ·
`AtmosphereGallery` · `FAQSection` · `FinalCTA` · `Footer` ·
`MobileTicketBar` · `CursorLogo` (cursor pendular) · `IntroOverlay` (abertura)

Tokens de design (cores, gradiente, sombras, animações) em `tailwind.config.js`
e `app/globals.css`.

### Paleta
| Token | Valor | Uso |
|------|-------|-----|
| `ink` | `#08070D` | fundo principal |
| `ink-2` | `#0D0B14` | fundo secundário |
| `panel` | `#12101A` | cards |
| `ember` | `#F12569` | gradiente (rosa) |
| `gold` | `#FC9D00` | gradiente (âmbar) |

Gradiente oficial: `#F12569 → #FC9D00` (assinatura — usado como luz, calor e
detalhe, nunca como preenchimento de página inteira).

---

> Nenhuma informação não confirmada (preços, benefícios de setores, open bar,
> classificação, patrocinadores fictícios) foi adicionada. Apenas os dados
> oficiais fornecidos.
