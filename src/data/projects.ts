// Single source of truth for project/case data.
// Used by Home (selected work), Work index, and Work detail pages.

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

  en: ProjectI18n;
  ru: ProjectI18n;
}

export const projects: Project[] = [
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
    client: 'KAIF Wellness',
    category: 'crm',
    tags: ['Electron', 'React', 'TypeScript', 'Tailwind', 'SQLite'],
    cover: '/projects/kaif-crm/cover.webp',
    screens: [
      '/projects/kaif-crm/screen-1.webp',
      '/projects/kaif-crm/screen-2.webp',
      '/projects/kaif-crm/screen-3.webp',
      '/projects/kaif-crm/screen-4.webp',
      '/projects/kaif-crm/screen-5.webp',
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
    client: 'UNICAR',
    category: 'crm',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Dashboard'],
    cover: '/projects/unicar/cover.webp',
    screens: [
      '/projects/unicar/screen-1.webp',
      '/projects/unicar/screen-2.webp',
      '/projects/unicar/screen-3.webp',
      '/projects/unicar/screen-4.webp',
    ],
    accent: '#1A3E8F',
    en: {
      title: 'Unicar — car rental management CRM',
      summary:
        'End-to-end CRM for a car rental operator: fleet, bookings, clients, and financial dashboards.',
      challenge:
        'A growing rental operator was losing track of their fleet. Cars were double-booked, maintenance was missed, and financial reporting lived in Excel.',
      solution:
        'Shipped a custom CRM with fleet management, booking calendar, client profiles, and a live financial dashboard — replacing four separate tools with one.',
      role: 'Product, UX, frontend, dashboard',
    },
    ru: {
      title: 'Unicar — CRM для автопроката',
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
      '/projects/3dlike/screen-1.webp',
      '/projects/3dlike/screen-2.webp',
      '/projects/3dlike/screen-3.webp',
      '/projects/3dlike/screen-4.webp',
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

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return projects[0];
  return projects[(idx + 1) % projects.length];
};
