// Single source of truth for project/case data.
// Used by Home (selected work), Work index, and Work detail pages.

import { v } from '../lib/asset';

export type ProjectCategory = 'website' | 'bot' | 'crm' | 'saas';

export interface ProjectI18n {
  title: string;
  summary: string;       // one-line teaser (used in grid + home)
  challenge: string;     // what was the business problem
  solution: string;      // how we solved it
  role: string;          // what we delivered (short comma list)
}

export interface Project {
  slug: string;
  number: string;          // "01", "02"... (editorial numbering)
  year: string;
  client: string;
  category: ProjectCategory;
  tags: string[];          // tech + domain tags
  /** Cover image (full-bleed). */
  cover: string;
  /** Gallery screens, used in detail page. */
  screens: string[];
  /** Accent color used in hover / on detail page hero. */
  accent: string;
  /** Optional dark background if cover sits nicer on ink. */
  dark?: boolean;
  /** External live link. */
  url?: string;
  /** Sintara's own product (not a client work). Card shows a badge,
   *  and the click target is the dedicated /products/<slug> page. */
  own?: boolean;
  /** Optional dedicated detail route override (e.g. own products live
   *  under /products/<slug> rather than /work/<slug>). */
  href?: string;

  en: ProjectI18n;
  ru: ProjectI18n;
}

// Raw data — the cover/screen URLs run through `v()` below so they pick up
// the current ASSET_VERSION query string. That way, replacing an image at
// the same path actually shows up for every visitor.
const rawProjects: Project[] = [
  {
    slug: 'sintara-rent-crm',
    number: '01',
    year: '2025',
    client: 'Sintara',
    category: 'saas',
    tags: [
      'React 18',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'PostgreSQL',
      'Claude AI',
      'Leaflet',
    ],
    cover: '/projects/sintara-rent-crm/mockup.avif',
    screens: [
      '/projects/sintara-rent-crm/screen-1.avif',
      '/projects/sintara-rent-crm/screen-2.avif',
      '/projects/sintara-rent-crm/screen-3.avif',
    ],
    accent: '#D97706',
    dark: true,
    url: 'https://sintara-rent-crm.com',
    own: true,
    href: '/products/sintara-rent-crm',
    en: {
      title: 'Sintara Rent CRM — car & moto rental',
      summary:
        'Our own SaaS — an omnichannel CRM purpose-built for vehicle rental: fleet, deposits, online booking, GPS and a Telegram/WhatsApp/Instagram inbox with AI, in one isolated workspace.',
      challenge:
        'Rental operators run their business across spreadsheets and chats — requests from Telegram and WhatsApp get lost, cars get double-booked, deposits turn into disputes, and nobody knows which car actually makes money.',
      solution:
        'We built Sintara Rent CRM around the full rental cycle: an omnichannel inbox with AI, rentals with deposits and extensions, a fleet with photo-proof, per-car finances, provider-agnostic GPS and a self-service booking site. An isolated workspace with its own subdomain — live in five minutes.',
      role: 'Product, design, engineering, infra — end to end',
    },
    ru: {
      title: 'Sintara Rent CRM — авто- и мотопрокат',
      summary:
        'Наш собственный SaaS — омниканальная CRM, заточенная под прокат транспорта: автопарк, депозиты, онлайн-бронь, GPS и инбокс Telegram/WhatsApp/Instagram с AI — в одном изолированном пространстве.',
      challenge:
        'Прокаты ведут бизнес в таблицах и чатах: заявки из Telegram и WhatsApp теряются, машины бронируются дважды, депозиты превращаются в споры, а какая машина реально приносит деньги — непонятно.',
      solution:
        'Построили Sintara Rent CRM вокруг полного цикла аренды: омниканальный инбокс с AI, аренды с депозитами и продлениями, автопарк с фотофиксацией, финансы по каждой машине, провайдеро-независимый GPS и сайт онлайн-брони. Изолированное пространство со своим поддоменом — запуск за пять минут.',
      role: 'Продукт, дизайн, разработка, инфраструктура — полный цикл',
    },
  },
  {
    slug: 'kaif',
    number: '02',
    year: '2025',
    client: 'KAIF Wellness',
    category: 'website',
    tags: ['React 19', 'Vite 6', 'Framer Motion', 'i18next', 'WhatsApp'],
    // No dedicated cover exists — use screen-1 as the cover image
    cover: '/projects/kaif/screen-1.avif',
    screens: ['/projects/kaif/screen-1.avif', '/projects/kaif/screen-2.avif'],
    accent: '#1F2E22',
    url: undefined,
    en: {
      title: 'Kaif — premium wellness complex',
      summary:
        'Cinematic multilingual website for a premium wellness complex with video backgrounds and WhatsApp booking.',
      challenge:
        'A new wellness complex needed a site that would immediately communicate premium positioning and drive bookings from foreign tourists.',
      solution:
        'We built a cinematic multilingual marketing site with video-first hero, procedural animations, and one-tap WhatsApp booking — deployed in 3 weeks.',
      role: 'Strategy, design, frontend, i18n, deploy',
    },
    ru: {
      title: 'Kaif — премиальный велнес-комплекс',
      summary:
        'Кинематографичный мультиязычный сайт велнес-комплекса с видео-фонами и бронированием через WhatsApp.',
      challenge:
        'Новому велнес-комплексу нужен был сайт, который с первых секунд транслирует премиальность и превращает иностранных туристов в бронирования.',
      solution:
        'Сделали кинематографичный мультиязычный сайт: видео в герое, процедурные анимации и бронь в один тап через WhatsApp. Запуск за 3 недели.',
      role: 'Стратегия, дизайн, фронт, локализация, деплой',
    },
  },
  {
    slug: 'kaif-crm',
    number: '03',
    year: '2025',
    client: 'KAIF CRM',
    category: 'crm',
    tags: ['Electron', 'React', 'TypeScript', 'Tailwind', 'SQLite'],
    cover: '/projects/kaif-crm/cover.avif',
    screens: [
      '/projects/kaif-crm/macbook-pro-16-1.avif',
      '/projects/kaif-crm/macbook-pro-16-2.avif',
      '/projects/kaif-crm/studio-display-1.avif',
      '/projects/kaif-crm/studio-display-2.avif',
      '/projects/kaif-crm/ipad-pro.avif',
    ],
    accent: '#2E4AFF',
    dark: true,
    en: {
      title: 'Kaif CRM — desktop management system',
      summary:
        'Offline-first desktop CRM for a fitness & wellness club — schedules, clients, passes, and revenue in one app.',
      challenge:
        'Managers had to juggle three tools and paper notes. Internet was unreliable in some locations — cloud-only CRMs simply did not work.',
      solution:
        'Built a native Electron desktop app with an offline-first architecture and cloud sync. Schedule, pass management, client base, and financial reports — all in one place.',
      role: 'Product, UX, desktop app, sync, analytics',
    },
    ru: {
      title: 'Kaif CRM — десктопная система управления',
      summary:
        'Offline-first десктоп-CRM для фитнес- и велнес-клуба: расписания, клиенты, абонементы и выручка в одном приложении.',
      challenge:
        'Администраторы жонглировали тремя сервисами и бумажными записями. Интернет в локациях был нестабильный — облачные CRM просто не работали.',
      solution:
        'Сделали нативное Electron-приложение с offline-first архитектурой и облачной синхронизацией. Расписания, абонементы, клиентская база и финансовые отчёты — в одном месте.',
      role: 'Продукт, UX, desktop-приложение, синхронизация, аналитика',
    },
  },
  {
    slug: 'unicar',
    number: '04',
    year: '2025',
    client: 'UNICAR CRM',
    category: 'crm',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Dashboard'],
    cover: '/projects/unicar/cover.avif',
    screens: [
      '/projects/unicar/cover-1.avif',
      '/projects/unicar/cover-2.avif',
      '/projects/unicar/cover-3.avif',
      '/projects/unicar/cover-4.avif',
    ],
    accent: '#1A3E8F',
    en: {
      title: 'Unicar CRM — car rental management system',
      summary:
        'End-to-end CRM for a car rental operator: fleet, bookings, clients, and financial dashboards.',
      challenge:
        'A growing rental operator was losing track of their fleet. Cars were double-booked, maintenance was missed, and financial reporting lived in Excel.',
      solution:
        'Shipped a custom CRM with fleet management, booking calendar, client profiles, and a live financial dashboard — replacing four separate tools with one.',
      role: 'Product, UX, frontend, dashboard',
    },
    ru: {
      title: 'Unicar CRM — система управления автопрокатом',
      summary:
        'Сквозная CRM для автопроката: автопарк, бронирования, клиенты и финансовые дашборды.',
      challenge:
        'Автопрокат быстро рос и терял контроль: машины бронировались дважды, ТО пропускали, а финансы жили в Excel.',
      solution:
        'Сделали кастомную CRM с управлением автопарком, календарём бронирований, профилями клиентов и живым финансовым дашбордом — заменили четыре инструмента одним.',
      role: 'Продукт, UX, фронт, дашборд',
    },
  },
  {
    slug: 'unicar-rent',
    number: '05',
    year: '2025',
    client: 'UNICAR',
    category: 'website',
    tags: [
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'PostgreSQL',
      'i18next',
    ],
    cover: '/projects/unicar-rent/cover.avif',
    screens: [
      '/projects/unicar-rent/screen-1.avif',
      '/projects/unicar-rent/screen-2.avif',
      '/projects/unicar-rent/screen-3.avif',
      '/projects/unicar-rent/screen-4.avif',
      '/projects/unicar-rent/screen-5.avif',
      '/projects/unicar-rent/screen-6.avif',
      '/projects/unicar-rent/screen-7.webp',
    ],
    accent: '#0F2E63',
    dark: true,
    url: 'https://unicar-rent.com',
    en: {
      title: 'Unicar — car & bike rental in Phuket',
      summary:
        'Bilingual rental platform with a 40+ vehicle catalogue, smart filters, progressive pricing and online booking wired straight into the CRM.',
      challenge:
        'Rental companies in Phuket take orders manually through WhatsApp: the client waits hours for a reply, managers drown in chats, and conversion depends on how fast an operator types.',
      solution:
        'We built a real booking funnel: a catalogue of cars and bikes with advanced filters and galleries, progressive long-term discounts computed live, user accounts with favorites, and a booking request that lands in the CRM instantly — the manager calls back with the quote already done.',
      role: 'Design, frontend, backend, CRM integration, i18n',
    },
    ru: {
      title: 'Unicar — аренда авто и байков на Пхукете',
      summary:
        'Двуязычная платформа аренды транспорта: каталог из 40+ авто и байков, умные фильтры, прогрессивные цены и онлайн-бронирование, завязанное на CRM.',
      challenge:
        'Прокаты на Пхукете принимают заказы вручную через WhatsApp: клиент часами ждёт ответа, менеджеры тонут в переписках, а конверсия зависит от скорости оператора.',
      solution:
        'Построили настоящую воронку бронирования: каталог авто и байков с фильтрами и галереями, прогрессивные скидки за длительную аренду с живым расчётом, личный кабинет с избранным и заявка, которая мгновенно попадает в CRM — менеджер перезванивает уже с готовым расчётом.',
      role: 'Дизайн, фронт, backend, интеграция с CRM, локализация',
    },
  },
  {
    slug: 'logistics-kaz',
    number: '06',
    year: '2026',
    client: 'Logistics.kaz',
    category: 'website',
    tags: [
      'React 19',
      'TypeScript',
      'Framer Motion',
      'Three.js',
      'Telegram Mini App',
      'i18n',
    ],
    cover: '/projects/logistics-kaz/cover.avif',
    screens: [
      '/projects/logistics-kaz/screen-1.avif',
      '/projects/logistics-kaz/screen-2.avif',
      '/projects/logistics-kaz/screen-3.avif',
    ],
    accent: '#B45309',
    dark: true,
    en: {
      title: 'Logistics.kaz — freight from China',
      summary:
        'Immersive website for a logistics company: a live cost calculator, a cinematic scroll-driven route map and leads flowing straight into the CRM — in three languages.',
      challenge:
        'Logistics websites in this niche all look the same, while clients pick a partner on trust. The company needed to make fully documented customs clearance and the China — Kazakhstan — Russia route tangible enough to stand out.',
      solution:
        'We shipped an editorial site with an interactive calculator (weight, cargo category, route — the quote carries over into the lead form), a pinned scroll scene drawing the Yiwu — Khorgos — Almaty — Moscow rail route over real geography, and full i18n in Russian, Kazakh and English. Plus a Telegram bot with a Mini App for orders and shipment tracking.',
      role: 'Design, frontend, calculator, Telegram bot, i18n',
    },
    ru: {
      title: 'Logistics.kaz — доставка грузов из Китая',
      summary:
        'Иммерсивный сайт логистической компании: живой калькулятор стоимости, кинематографичная скролл-карта маршрута и заявки прямо в CRM — на трёх языках.',
      challenge:
        'Сайты в логистике выглядят одинаково безлико, а подрядчика клиент выбирает по доверию. Нужно было сделать «белую» растаможку и маршрут Китай — Казахстан — Россия осязаемыми, чтобы компания выделялась на фоне конкурентов.',
      solution:
        'Сделали редакционный сайт с интерактивным калькулятором (вес, категория груза, маршрут — расчёт сам подставляется в заявку), pinned-скролл-сценой ЖД-маршрута Иу — Хоргос — Алматы — Москва на реальной географии и локализацией на русский, казахский и английский. Плюс Telegram-бот с Mini App для заявок и трекинга грузов.',
      role: 'Дизайн, фронт, калькулятор, Telegram-бот, локализация',
    },
  },
  {
    slug: 'zefstar',
    number: '07',
    year: '2026',
    client: 'Zef Star',
    category: 'website',
    tags: ['Next.js', 'React 19', 'TypeScript', 'Tailwind v4', 'Figma'],
    cover: '/projects/zefstar/cover.avif',
    screens: [
      '/projects/zefstar/screen-1.avif',
      '/projects/zefstar/screen-2.avif',
    ],
    accent: '#A118FF',
    dark: true,
    en: {
      title: 'Zef Star — outdoor advertising platform',
      summary:
        'Website for an outdoor advertising operator: billboards, LED screens and city formats picked on a city map, with a placement request in a couple of clicks.',
      challenge:
        'An outdoor advertising operator was selling through calls and PDF price lists. They needed to move sales online: let the client browse available surfaces on a map and request a placement themselves.',
      solution:
        'We translated the Figma design system into code one-to-one — tokens, typography, UI kit — and built the platform foundation on Next.js and Tailwind v4: a dark cinematic hero, the placement formats catalogue and the frame for an interactive map of surfaces with format filters.',
      role: 'Design system, frontend, UI kit, architecture',
    },
    ru: {
      title: 'Zef Star — платформа наружной рекламы',
      summary:
        'Сайт оператора наружной рекламы: билборды, LED-экраны и сити-форматы выбираются на карте города, заявка на размещение — в пару кликов.',
      challenge:
        'Оператор наружной рекламы продавал через звонки и PDF-прайсы. Нужно было перевести продажи в онлайн: дать клиенту самому посмотреть свободные площадки на карте и оставить заявку.',
      solution:
        'Перенесли дизайн-систему из Figma в код один в один — токены, типографика, UI-кит — и построили фундамент платформы на Next.js и Tailwind v4: тёмный кинематографичный hero, каталог форматов размещения и каркас интерактивной карты площадок с фильтрами.',
      role: 'Дизайн-система, фронт, UI-кит, архитектура',
    },
  },
  {
    slug: '3dlike',
    number: '08',
    year: '2025',
    client: '3DLike',
    category: 'website',
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'SEO'],
    cover: '/projects/3dlike/cover.avif',
    screens: [
      '/projects/3dlike/macbook-pro-16.avif',
      '/projects/3dlike/studio.avif',
      '/projects/3dlike/ipad-pro.avif',
      '/projects/3dlike/iphone-16-pro.avif',
    ],
    accent: '#E53E12',
    en: {
      title: '3DLike — 3D stickers manufacturer',
      summary:
        'Multi-page marketing site for a 3D stickers manufacturer — animated catalogue, ordering flow, SEO.',
      challenge:
        'A niche manufacturer needed to scale B2B orders beyond word-of-mouth and look credible to serious brands.',
      solution:
        'Built a polished multi-page site with animated catalogue, clear ordering flow, and SEO-first architecture. Moved them from referrals to steady inbound.',
      role: 'Design, frontend, SEO, content',
    },
    ru: {
      title: '3DLike — производитель 3D-стикеров',
      summary:
        'Многостраничный маркетинговый сайт производителя 3D-стикеров: анимированный каталог, оформление заказа, SEO.',
      challenge:
        'Нишевому производителю нужно было масштабировать B2B-заказы за пределы сарафанного радио и выглядеть убедительно для серьёзных брендов.',
      solution:
        'Сделали аккуратный многостраничный сайт с анимированным каталогом, понятным оформлением заказа и SEO-first архитектурой. Перевели их с сарафана на стабильный inbound.',
      role: 'Дизайн, фронт, SEO, контент',
    },
  },
];

export const projects: Project[] = rawProjects.map((p) => ({
  ...p,
  cover: v(p.cover),
  screens: p.screens.map(v),
}));

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return projects[0];
  return projects[(idx + 1) % projects.length];
};
