import { getProject } from '../data/projects';

/**
 * Every page's title and description, in both languages, in one table.
 *
 * Lives in lib/ rather than inside the RouteSeo component because the build's
 * prerender step needs the same copy: it bakes these values into the static
 * HTML of each route, and RouteSeo re-applies them at runtime for client-side
 * navigation. One source, so the two can never disagree.
 */

interface Entry {
  ru: { title: string; description: string };
  en: { title: string; description: string };
  image?: string;
  noindex?: boolean;
}

const PAGES: Record<string, Entry> = {
  '/': {
    ru: {
      title: 'Sintara — независимая цифровая студия',
      description:
        'Проектируем и создаём сайты, веб-приложения и кастомные CRM. Полный цикл: стратегия, дизайн, разработка, запуск. Работаем по всему миру.',
    },
    en: {
      title: 'Sintara — independent digital product studio',
      description:
        'We design and build websites, web apps and custom CRMs. Full cycle — strategy, design, engineering, launch. Working worldwide.',
    },
  },
  '/work': {
    ru: {
      title: 'Работы — Sintara',
      description:
        'Кейсы студии: сайты, веб-приложения и CRM для проката, логистики и сервисных компаний. По каждому проекту — задача, решение и результат.',
    },
    en: {
      title: 'Work — Sintara',
      description:
        'Selected case studies: websites, web apps and CRMs for rental, logistics and service businesses. The problem, the build and the outcome.',
    },
  },
  '/services': {
    ru: {
      title: 'Услуги — Sintara',
      description:
        'Сайты, веб-приложения, CRM и бэк-офисы, Telegram-боты, редизайн и поддержка. Фиксированная цена, прозрачные этапы, сроки, которые не сдвигаются.',
    },
    en: {
      title: 'Services — Sintara',
      description:
        'Websites, web apps, CRMs and back-offices, Telegram bots, redesign and support. Fixed price, clear milestones, deadlines that hold.',
    },
  },
  '/about': {
    ru: {
      title: 'Студия — Sintara',
      description:
        'Небольшая независимая команда: с вами говорят те же люди, которые проектируют и пишут код. Как мы работаем и почему начинаем с задачи бизнеса.',
    },
    en: {
      title: 'Studio — Sintara',
      description:
        'A small independent team — the people you talk to are the ones who design it and write the code. How we work, and why we start with the business problem.',
    },
  },
  '/contact': {
    ru: {
      title: 'Контакты — Sintara',
      description:
        'Расскажите о проекте — ответим в тот же день. Telegram, почта или подробный бриф: выбирайте, как удобнее.',
    },
    en: {
      title: 'Contact — Sintara',
      description:
        'Tell us about your project — we reply the same day. Telegram, email or a full brief, whichever suits you.',
    },
  },
  '/brief': {
    ru: {
      title: 'Бриф на проект — Sintara',
      description:
        'Заполните бриф: тип продукта, задачи, сроки и бюджет. Занимает 5–10 минут, в ответ получите оценку и план работ.',
    },
    en: {
      title: 'Project brief — Sintara',
      description:
        'Fill in a brief: product type, goals, timeline and budget. Takes 5–10 minutes; you get an estimate and a plan back.',
    },
  },
  '/products/sintara-rent-crm': {
    ru: {
      title: 'Sintara Rent — CRM для проката авто и мото',
      description:
        'Омниканальная CRM для проката: автопарк, аренды с депозитами, онлайн-бронь, GPS и инбокс Telegram/WhatsApp/Instagram с AI. Запуск за пять минут.',
    },
    en: {
      title: 'Sintara Rent — CRM for car & moto rental',
      description:
        'An omnichannel rental CRM: fleet, deposits, online booking, GPS and a Telegram/WhatsApp/Instagram inbox with AI. Live in five minutes.',
    },
  },
};

const NOT_FOUND: Entry = {
  ru: {
    title: 'Страница не найдена — Sintara',
    description: 'Такой страницы нет. Вернитесь на главную или посмотрите работы студии.',
  },
  en: {
    title: 'Page not found — Sintara',
    description: 'This page doesn’t exist. Head back home or browse our work.',
  },
  noindex: true,
};

export interface ResolvedSeo {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
}

/**
 * Metadata for a pathname. Unknown paths resolve to the 404 entry — including
 * unknown project slugs, which the router also renders as NotFound.
 */
export const resolveSeo = (
  pathname: string,
  language: 'ru' | 'en',
): ResolvedSeo => {
  const path = pathname.replace(/\/+$/, '') || '/';
  let entry = PAGES[path];
  let image: string | undefined = entry?.image;

  // Case pages are data-driven — /work/<slug> and the legacy /project/<slug>.
  if (!entry) {
    const slug = path.match(/^\/(?:work|project)\/([^/]+)$/)?.[1];
    const project = slug ? getProject(slug) : undefined;
    if (project) {
      entry = {
        ru: {
          title: `${project.ru.title} — кейс Sintara`,
          description: project.ru.summary,
        },
        en: {
          title: `${project.en.title} — Sintara case study`,
          description: project.en.summary,
        },
      };
      image = project.cover;
    }
  }

  const resolved = entry ?? NOT_FOUND;
  const copy = language === 'ru' ? resolved.ru : resolved.en;
  return {
    title: copy.title,
    description: copy.description,
    image,
    noindex: resolved.noindex,
  };
};
