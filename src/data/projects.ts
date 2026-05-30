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
    slug: 'sintara-crm',
    number: '00',
    year: '2025',
    client: 'Sintara',
    category: 'saas',
    tags: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Tailwind v4',
      'GSAP',
      'React Three Fiber',
    ],
    cover: '/projects/sintara-crm/mockup.webp',
    screens: [
      '/projects/sintara-crm/screen-1.webp',
      '/projects/sintara-crm/screen-2.webp',
      '/projects/sintara-crm/screen-3.webp',
    ],
    accent: '#8B5CF6',
    dark: true,
    url: 'https://www.sintara-crm.com',
    own: true,
    href: '/products/sintara-crm',
    en: {
      title: 'Sintara CRM — omnichannel CRM for SMB',
      summary:
        'Our own SaaS — an omnichannel CRM with the feel and speed of Linear or Notion, built for small and mid-sized teams in Asia.',
      challenge:
        'Most CRMs feel like software from the last decade — heavy, fragmented across mailbox, messengers and booking tools, and impossible to automate without a developer on call.',
      solution:
        'We built Sintara CRM around four pillars: an omnichannel inbox, a customizable sales pipeline, a no-code Automation Studio with AI steps, and online booking as a core module — not a plugin. 40+ integrations, 10-minute setup, releases every two weeks.',
      role: 'Product, design, engineering, infra — end to end',
    },
    ru: {
      title: 'Sintara CRM — омниканальная CRM для SMB',
      summary:
        'Наш собственный SaaS — омниканальная CRM с интерфейсом и скоростью уровня Linear или Notion, для малого и среднего бизнеса в Азии.',
      challenge:
        'Большинство CRM выглядят как софт прошлого десятилетия: тяжёлые, размазанные между почтой, мессенджерами и онлайн-записью, и почти не автоматизируются без разработчика.',
      solution:
        'Построили Sintara CRM вокруг четырёх опор: омниканальный инбокс, настраиваемая воронка продаж, no-code Automation Studio с AI-шагами и онлайн-запись как ядро продукта — не плагин. 40+ интеграций, запуск за 10 минут, релизы каждые две недели.',
      role: 'Продукт, дизайн, разработка, инфраструктура — полный цикл',
    },
  },
  {
    slug: 'kaif',
    number: '01',
    year: '2025',
    client: 'KAIF Wellness',
    category: 'website',
    tags: ['React 19', 'Vite 6', 'Framer Motion', 'i18next', 'WhatsApp'],
    // No dedicated cover exists — use screen-1 as the cover image
    cover: '/projects/kaif/screen-1.webp',
    screens: ['/projects/kaif/screen-1.webp', '/projects/kaif/screen-2.webp'],
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
    number: '02',
    year: '2025',
    client: 'KAIF CRM',
    category: 'crm',
    tags: ['Electron', 'React', 'TypeScript', 'Tailwind', 'SQLite'],
    cover: '/projects/kaif-crm/cover.webp',
    screens: [
      '/projects/kaif-crm/macbook-pro-16-1.webp',
      '/projects/kaif-crm/macbook-pro-16-2.webp',
      '/projects/kaif-crm/studio-display-1.webp',
      '/projects/kaif-crm/studio-display-2.webp',
      '/projects/kaif-crm/ipad-pro.webp',
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
    number: '03',
    year: '2024',
    client: 'UNICAR CRM',
    category: 'crm',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Dashboard'],
    cover: '/projects/unicar/cover.webp',
    screens: [
      '/projects/unicar/cover-1.webp',
      '/projects/unicar/cover-2.webp',
      '/projects/unicar/cover-3.webp',
      '/projects/unicar/cover-4.webp',
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
    slug: '3dlike',
    number: '04',
    year: '2024',
    client: '3DLike',
    category: 'website',
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'SEO'],
    cover: '/projects/3dlike/cover.webp',
    screens: [
      '/projects/3dlike/macbook-pro-16.webp',
      '/projects/3dlike/studio.webp',
      '/projects/3dlike/ipad-pro.webp',
      '/projects/3dlike/iphone-16-pro.webp',
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
