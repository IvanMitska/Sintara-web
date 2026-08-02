import React, { createContext, useContext, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parsePath, withLanguage, otherLanguage } from '../lib/i18n';
import type { Language } from '../lib/i18n';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// All translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.work': 'Work',
    'nav.about': 'Studio',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Start a project',
    'nav.menu': 'Menu',
    'nav.close': 'Close',

    // Footer (extended)
    'footer.navigate': 'Navigate',
    'footer.elsewhere': 'Elsewhere',

    // Hero (editorial)
    'home.hero.eyebrow': 'Independent studio · est. 2026',
    'home.hero.line1': 'Sintara',
    'home.hero.line2': 'builds digital',
    'home.hero.line3': 'products.',
    'home.hero.sub': 'Fixed price. Direct contact. No surprises.',
    'home.hero.primary': 'Start a project',
    'home.hero.secondary': 'See selected work',
    'home.hero.scroll': 'Scroll',
    'home.hero.metaLabel': 'Continuous craft',
    'home.hero.metaIndex': '01',
    'home.hero.metaBody':
      'We build the web the slow way — by hand, for people who care how a thing actually feels.',

    // Marquee strip
    'home.marquee.1': 'Web development',
    'home.marquee.2': 'Product design',
    'home.marquee.3': 'Telegram bots',
    'home.marquee.4': 'CRM & dashboards',
    'home.marquee.5': 'Automation',
    'home.marquee.6': 'Based everywhere',

    // Manifesto
    'home.manifesto.eyebrow': 'What we believe',
    'home.manifesto.body':
      'We build digital products the way a good tailor cuts a suit — by hand, to fit the body, with room to move. No bloated retainers. No account managers between you and the people writing the code. Just a small team that ships fast, priced fairly, and stands behind its work for 60 days after launch.',
    'home.manifesto.footnote': '— A note from the founders',

    // Selected work
    'home.work.eyebrow': 'Selected work',
    'home.work.title1': 'Real products.',
    'home.work.title2': 'In the wild.',
    'home.work.cta': 'All projects',
    'home.work.deliverables': 'What we delivered',
    'home.work.openCase': 'Open case',

    // Services teaser
    'home.services.eyebrow': 'Services',
    'home.services.title1': 'What we',
    'home.services.title2': 'build',
    'home.services.cta': 'Full capabilities',
    'home.services.subtitle':
      'Six things we ship better than most. Hover to peek — click to dive into the details.',
    'home.services.count': 'capabilities',
    'home.services.1.title': 'Websites',
    'home.services.1.desc':
      'Marketing sites, landings and multi-page editorial. From strategy to launch.',
    'home.services.2.title': 'Web applications',
    'home.services.2.desc':
      'SaaS, dashboards, client portals and admin panels built on React and TypeScript.',
    'home.services.3.title': 'Telegram bots & Mini Apps',
    'home.services.3.desc':
      'Custom bots, mini apps, and automation flows that plug straight into your operations.',
    'home.services.4.title': 'CRMs & back-offices',
    'home.services.4.desc':
      'Desktop and web CRMs tailored to the way your team actually works — not the other way round.',
    'home.services.5.title': 'Redesign & rebuild',
    'home.services.5.desc':
      'Take an outdated product and turn it into something you are proud to show clients again.',
    'home.services.6.title': 'Ongoing support',
    'home.services.6.desc':
      'Monthly retainers for teams who want their digital product to keep getting better.',

    // Process
    'home.process.eyebrow': 'How we work',
    'home.process.title': 'Four steps. No fluff.',
    'home.process.1.title': 'Discover',
    'home.process.1.desc':
      'We start with your business, not the tech. Goals, audiences, constraints, unknowns — on the table.',
    'home.process.2.title': 'Design',
    'home.process.2.desc':
      'Fast prototypes, tight loops. We converge on a direction before a single production line is written.',
    'home.process.3.title': 'Build',
    'home.process.3.desc':
      'Weekly demos, shared access, zero black boxes. You see progress every step of the way.',
    'home.process.4.title': 'Ship & support',
    'home.process.4.desc':
      'We launch, hand over the keys — and stay on call for 60 days of free bug fixes. After that, only if you want us.',

    // Testimonials
    'home.testimonials.eyebrow': 'Clients',
    'home.testimonials.title1': 'Small team.',
    'home.testimonials.title2': 'Big outcomes.',
    'home.testimonials.1.quote':
      'Built our store in 2.5 weeks — faster than Shopify. Conversion was up 34% in the first month.',
    'home.testimonials.1.name': 'Denis V.',
    'home.testimonials.1.role': 'Founder, VeloShop',
    'home.testimonials.2.quote':
      'The bot handles 400+ orders a day. Eight months in, zero downtime. Paid for itself in three weeks.',
    'home.testimonials.2.name': 'Anna K.',
    'home.testimonials.2.role': 'COO, EasyFood',
    'home.testimonials.3.quote':
      'They redesigned our 2019 website. Leads doubled, without any ads. Now we are not embarrassed to share the link.',
    'home.testimonials.3.name': 'Igor P.',
    'home.testimonials.3.role': 'Director, StroyMaster',
    'home.testimonials.4.quote':
      'A custom CRM for our process. Night and day versus Bitrix — managers learned it in a day, not a week.',
    'home.testimonials.4.name': 'Elena N.',
    'home.testimonials.4.role': 'Ops lead, AutoTrade',

    // Big CTA
    'home.cta.line1': 'Let us build',
    'home.cta.line2': 'something',
    'home.cta.line3': 'worth shipping.',
    'home.cta.sub':
      'Fill in a short brief and you will hear from a real engineer — not a sales bot — within 24 hours.',
    'home.cta.primary': 'Start a project',
    'home.cta.secondary': 'sintaradev@gmail.com',

    // Work page
    'work.eyebrow': 'Selected work · 2025 – 2026',
    'work.title1': 'The work',
    'work.title2': 'so far.',
    'work.sub':
      'A selection of recent projects across product, web, and automation. New case studies get added as we ship them.',
    'work.viewCase': 'View case',

    // Services page
    'services.page.eyebrow': 'Capabilities',
    'services.page.title1': 'Everything',
    'services.page.title2': 'digital.',
    'services.page.sub':
      'From first landing page to full product platform — a focused menu, not an endless list.',
    'services.page.priceFrom': 'From',

    // About
    'about.eyebrow': 'The studio',
    'about.title1': 'Small studio.',
    'about.title2': 'Serious work.',
    'about.lead':
      'Sintara is an independent digital studio founded in 2026. We partner with founders, operators and marketing teams who care about the details — and want to ship without the usual agency overhead.',
    'about.block1.title': 'Why we exist',
    'about.block1.body':
      'Most software shops either sell time (and drag projects out) or sell templates (and ship the same thing to everyone). We wanted a third option: bespoke products, delivered fast, at a fixed price — with the people writing the code sitting one message away from the client.',
    'about.block2.title': 'How we think',
    'about.block2.body':
      'Every project starts with the business, not the tech. We ask what has to be true for the product to succeed — then work backwards to the simplest thing that can ship. Good software is not the one with the most features. It is the one you actually use.',
    'about.principles.eyebrow': 'How we operate',
    'about.principles.title': 'Principles',
    'about.principles.1.t': 'Fixed price, fixed scope',
    'about.principles.1.d':
      'We agree the number before we start. No hourly bills, no surprise invoices halfway through.',
    'about.principles.2.t': 'You own it all',
    'about.principles.2.d':
      'Source code, design files, documentation, credentials. Nothing is held hostage.',
    'about.principles.3.t': 'Direct access',
    'about.principles.3.d':
      'You talk to the developer, not a layer of project managers with broken telephone.',
    'about.principles.4.t': '60-day warranty',
    'about.principles.4.d':
      'Something broken after launch? We fix it. No invoice, no drama, no questions.',

    // Contact
    'contact.page.eyebrow': 'Get in touch',
    'contact.page.title1': 'Tell us what',
    'contact.page.title2': 'to build.',
    'contact.page.sub':
      'Project in mind? Rough idea? Half a sketch? Whatever shape it is in, we want to hear about it.',
    'contact.page.brief': 'Fill out the brief',
    'contact.page.email': 'Write to us',
    'contact.page.telegram': 'Telegram',
    'contact.page.response': 'Usually responds within 24h',
    'contact.brief.detail': '6 questions · about 5 minutes',
    'contact.channels.title': 'Or reach us directly',
    'contact.email.meta': 'Best for detailed briefs and files',
    'contact.telegram.meta': 'Fastest reply — usually within minutes',
    'contact.instagram.meta': 'See how we work, day to day',

    // Hero
    'hero.badge': 'Available for new projects',
    'hero.title1': 'We build',
    'hero.title2': 'digital products',
    'hero.title3': 'that work',
    'hero.subtitle': 'Web apps, mobile apps, Telegram bots, and automation — delivered fast, priced fairly, built to last.',
    'hero.cta.primary': 'Start a project',
    'hero.cta.secondary': 'See our work',
    'hero.stats.projects': 'Projects delivered',
    'hero.stats.clients': 'Happy clients',
    'hero.stats.years': 'Years of experience',

    // Services
    'services.title1': 'What we',
    'services.title2': 'build',
    'services.subtitle': 'We turn ambitious ideas into digital products that people actually want to use',
    'services.web.number': '01',
    'services.web.title': 'Web Development',
    'services.web.description': 'We craft digital experiences that captivate and convert. From blazing-fast landing pages to complex web applications.',
    'services.mobile.number': '02',
    'services.mobile.title': 'Mobile Apps',
    'services.mobile.description': 'Native performance meets cross-platform efficiency. Apps that feel at home on any device with fluid animations.',
    'services.additional.title': 'Plus everything else you need',
    'services.telegram': 'Telegram Bots',
    'services.telegram.desc': 'Custom bots for automation, customer service, and business processes',
    'services.ecommerce': 'E-commerce',
    'services.ecommerce.desc': 'Full-featured online stores with payment integration',
    'services.crm': 'CRM Systems',
    'services.crm.desc': 'Tailored solutions to streamline your sales',
    'services.seo': 'SEO Optimization',
    'services.seo.desc': 'Data-driven strategies to improve rankings',
    'services.redesign': 'Redesign',
    'services.redesign.desc': 'Transform outdated websites into modern experiences',
    'services.support': 'Tech Support',
    'services.support.desc': 'Ongoing maintenance and 24/7 support',

    // Benefits
    'benefits.title': 'Why choose us',
    'benefits.subtitle': 'We do things differently. Here\'s what sets us apart.',
    'benefits.price.title': 'Fixed price. No surprises.',
    'benefits.price.desc': 'We agree on the final cost before starting. No hidden fees, no hourly billing tricks.',
    'benefits.price.tag': 'Transparent pricing',
    'benefits.code.title': 'You own everything.',
    'benefits.code.desc': 'Full source code, design files, documentation — it\'s all yours. No vendor lock-in.',
    'benefits.code.tag': 'Code ownership',
    'benefits.direct.title': 'Direct developer access.',
    'benefits.direct.desc': 'Talk directly to the people building your product. No account managers.',
    'benefits.direct.tag': 'No middlemen',
    'benefits.warranty.title': '60-day warranty.',
    'benefits.warranty.desc': 'Found a bug after launch? We fix it free. No questions asked, no extra charges.',
    'benefits.warranty.tag': 'Free bug fixes',

    // Work Process
    'process.title': 'How we work',
    'process.subtitle': 'A simple, transparent process from idea to launch',
    'process.step1.title': 'Discovery',
    'process.step1.desc': 'We learn about your business, goals, and target audience to create a solid foundation.',
    'process.step2.title': 'Design',
    'process.step2.desc': 'We create stunning designs that reflect your brand and delight your users.',
    'process.step3.title': 'Development',
    'process.step3.desc': 'We build your product with clean code and modern technologies.',
    'process.step4.title': 'Launch',
    'process.step4.desc': 'We deploy your product and ensure everything runs smoothly.',

    // Testimonials
    'testimonials.badge': '4.7 — average rating',
    'testimonials.title': 'What clients say',
    'testimonials.1.text': 'Was skeptical at first — small team, thought there\'d be delays. But they built our store in 2.5 weeks, faster than Shopify. Conversion up 34% in the first month',
    'testimonials.1.name': 'Denis V.',
    'testimonials.1.role': 'VeloShop',
    'testimonials.2.text': 'Bot handles 400+ orders daily. Running 8 months with zero downtime. Paid for itself in 3 weeks 🔥',
    'testimonials.2.name': 'Anna K.',
    'testimonials.2.role': 'EasyFood',
    'testimonials.3.text': 'They redesigned our 2019 website. Now we\'re not embarrassed to show it to clients. Leads doubled, without any ads',
    'testimonials.3.name': 'Igor P.',
    'testimonials.3.role': 'StroyMaster',
    'testimonials.4.text': 'Working together for a year, completed 3 projects. Always available, always on time. That\'s rare, trust me',
    'testimonials.4.name': 'Michael S.',
    'testimonials.4.role': 'Digital Solutions',
    'testimonials.5.text': 'Custom CRM for our processes — night and day compared to Bitrix. Team learned it in a day, not a week',
    'testimonials.5.name': 'Elena N.',
    'testimonials.5.role': 'AutoTrade',
    'testimonials.6.text': 'Built a bot + client portal. Orders are now automated, managers don\'t waste time on routine. Saved ~80 hours per month',
    'testimonials.6.name': 'Artem L.',
    'testimonials.6.role': 'PrintExpress',

    // Pricing
    'pricing.title': 'Simple, transparent pricing',
    'pricing.subtitle': 'No hidden fees. No hourly rates. Just clear, fixed prices.',
    'pricing.landing.title': 'Landing Page',
    'pricing.landing.desc': 'Perfect for startups and product launches',
    'pricing.landing.feature1': 'Custom design',
    'pricing.landing.feature2': 'Mobile responsive',
    'pricing.landing.feature3': 'SEO optimized',
    'pricing.landing.feature4': 'Contact form',
    'pricing.landing.feature5': '2-week delivery',
    'pricing.webapp.title': 'Web Application',
    'pricing.webapp.desc': 'For complex business solutions',
    'pricing.webapp.feature1': 'Custom functionality',
    'pricing.webapp.feature2': 'User authentication',
    'pricing.webapp.feature3': 'Database integration',
    'pricing.webapp.feature4': 'Admin panel',
    'pricing.webapp.feature5': 'API development',
    'pricing.bot.title': 'Telegram Bot',
    'pricing.bot.desc': 'Automate your business processes',
    'pricing.bot.feature1': 'Custom commands',
    'pricing.bot.feature2': 'Payment integration',
    'pricing.bot.feature3': 'Admin dashboard',
    'pricing.bot.feature4': 'Analytics',
    'pricing.bot.feature5': '1-2 week delivery',
    'pricing.from': 'from',
    'pricing.getStarted': 'Get Started',
    'pricing.popular': 'Popular',

    // FAQ
    'faq.title': 'Frequently asked questions',
    'faq.subtitle': 'Everything you need to know about working with us',

    // Contact
    'contact.title': 'Let\'s work together',
    'contact.subtitle': 'Ready to start your project? Get in touch and let\'s discuss your ideas.',
    'contact.name': 'Your name',
    'contact.email': 'Email',
    'contact.message': 'Tell us about your project',
    'contact.send': 'Send message',
    'contact.or': 'Or reach out directly',

    // Footer
    'footer.description': 'We build digital products that help businesses grow.',
    'footer.services': 'Services',
    'footer.company': 'Company',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',

    // Portfolio
    'portfolio.title': 'Our work',
    'portfolio.subtitle': 'Selected projects showcasing our expertise in web development and automation',
    'portfolio.filter.all': 'All Projects',
    'portfolio.filter.websites': 'Websites',
    'portfolio.filter.bots': 'Telegram Bots',
    'portfolio.filter.crm': 'CRM',
    'portfolio.category.website': 'Website',
    'portfolio.category.bot': 'Telegram Bot',
    'portfolio.category.crm': 'CRM System',
    'portfolio.category.saas': 'SaaS Product',
    'portfolio.viewProject': 'View Project',
    'portfolio.startProject': 'Start your project',
    'portfolio.project7.title': 'KAIF CRM',
    'portfolio.project7.description': 'Desktop CRM system for fitness club management with offline mode and cloud sync.',
    'portfolio.project8.title': '3DLike',
    'portfolio.project8.description': '3D stickers manufacturer website with animations and SEO.',
    'portfolio.project9.title': 'UNICAR',
    'portfolio.project9.description': 'Car rental CRM with dashboard and fleet management.',
    'portfolio.project10.title': 'SHIBA CARS Partner System',
    'portfolio.project10.description': 'Partner affiliate system with Telegram bot, Mini App, and real-time analytics.',
    'portfolio.project11.title': 'KAIF',
    'portfolio.project11.description': 'Premium wellness complex website with video backgrounds and multilingual support.',

    // Project Showcase
    'showcase.title': 'Our projects',
    'showcase.subtitle': 'Real examples of our work — from websites to mobile apps and Telegram bots',
    'showcase.cta': 'Order similar project',
    'showcase.project1.category': 'E-commerce',
    'showcase.project1.title': 'Online Store Platform',
    'showcase.project1.description': 'Full-featured store with payments and user dashboard',
    'showcase.project1.feature1': 'Responsive design',
    'showcase.project1.feature2': 'Online payments',
    'showcase.project1.feature3': 'User accounts',
    'showcase.project1.feature4': 'Discount system',
    'showcase.project2.category': 'Telegram Bot',
    'showcase.project2.title': 'Booking Automation Bot',
    'showcase.project2.description': 'Automated client booking with CRM integration',
    'showcase.project2.feature1': 'Auto scheduling',
    'showcase.project2.feature2': 'Reminders',
    'showcase.project2.feature3': 'Online payments',
    'showcase.project2.feature4': 'CRM integration',
    'showcase.project3.category': 'Corporate Website',
    'showcase.project3.title': 'Tech Company Site',
    'showcase.project3.description': 'Modern website with animations and CRM integration',
    'showcase.project3.feature1': '3D animations',
    'showcase.project3.feature2': 'SEO optimized',
    'showcase.project3.feature3': 'CRM integration',
    'showcase.project3.feature4': 'Multi-language',
    'showcase.project4.category': 'Food Delivery',
    'showcase.project4.title': 'Delivery App',
    'showcase.project4.description': 'Real-time courier tracking and loyalty program',
    'showcase.project4.feature1': 'Live tracking',
    'showcase.project4.feature2': 'Push notifications',
    'showcase.project4.feature3': 'Loyalty program',
    'showcase.project4.feature4': 'Quick reorder',

    // Project Detail Page
    'projectDetail.back': 'Back to portfolio',
    'projectDetail.notFound': 'Project not found',
    'projectDetail.notFoundDesc': 'The project you\'re looking for doesn\'t exist or has been removed.',
    'projectDetail.viewAll': 'View all projects',
    'projectDetail.howItWorks': 'How it works',
    'projectDetail.howItWorksSubtitle': 'Key features and functionality showcase',
    'projectDetail.challenge': 'Challenge & Solution',
    'projectDetail.challengeSubtitle': 'How we transformed business challenges into results',
    'projectDetail.theChallenge': 'The Challenge',
    'projectDetail.ourSolution': 'Our Solution',
    'projectDetail.techStack': 'Tech Stack',
    'projectDetail.ctaTitle': 'Want something similar?',
    'projectDetail.ctaText': 'Let\'s discuss your project and create something amazing together.',
    'projectDetail.ctaButton': 'Start a project',
    'projectDetail.demoGif': 'Demo GIF',
    'projectDetail.salesIncrease': 'Sales increase',
    'projectDetail.timeSaved': 'Time saved',
    'projectDetail.activeUsers': 'Active users',
    'projectDetail.development': 'Development',
    'projectDetail.dailyBookings': 'Daily bookings',
    'projectDetail.automationRate': 'Automation rate',
    'projectDetail.botUsers': 'Bot users',
    'projectDetail.fasterDecisions': 'Faster decisions',
    'projectDetail.dataRefresh': 'Data refresh',
    'projectDetail.teamsUsing': 'Teams using',
    'projectDetail.completionRate': 'Completion rate',
    'projectDetail.lessonsCompleted': 'Lessons completed',
    'projectDetail.activeLearners': 'Active learners',
    'projectDetail.leadConversion': 'Lead conversion',
    'projectDetail.loadTime': 'Load time',
    'projectDetail.monthlyVisitors': 'Monthly visitors',
    'projectDetail.dailyOrders': 'Daily orders',
    'projectDetail.avgDelivery': 'Avg. delivery',
    'projectDetail.appDownloads': 'App downloads',
    'projectDetail.classesManaged': 'Classes managed',
    'projectDetail.offlineWork': 'Offline work',
    'projectDetail.clientsTracked': 'Clients tracked',
    'projectDetail.lighthouseScore': 'Lighthouse score',
    'projectDetail.pagesCreated': 'Pages created',
    'projectDetail.loadSpeed': 'Load speed',
    'projectDetail.carsManaged': 'Cars managed',
    'projectDetail.activeRentals': 'Active rentals',
    'projectDetail.modules': 'Modules',
    'projectDetail.partnersActive': 'Active partners',
    'projectDetail.clicksTracked': 'Clicks tracked',
    'projectDetail.realTimeStats': 'Real-time stats',
    'projectDetail.languages': 'Languages',
    'projectDetail.sectionsCreated': 'Sections created',

    // 404 Page
    'notFound.message': 'Looks like this page went for refactoring and never came back.',
    'notFound.submessage': 'But don\'t worry — we\'ll help you find your way home.',
    'notFound.home': 'Go home',
    'notFound.back': 'Go back',
    'notFound.eyebrow': 'Error 404 — page not found',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.services': 'Услуги',
    'nav.work': 'Работы',
    'nav.about': 'Студия',
    'nav.pricing': 'Цены',
    'nav.contact': 'Контакты',
    'nav.getStarted': 'Начать проект',
    'nav.menu': 'Меню',
    'nav.close': 'Закрыть',

    // Footer (extended)
    'footer.navigate': 'Навигация',
    'footer.elsewhere': 'Контакты',

    // Hero (editorial)
    'home.hero.eyebrow': 'Независимая студия · с 2026',
    'home.hero.line1': 'Sintara',
    'home.hero.line2': 'делает цифровые',
    'home.hero.line3': 'продукты.',
    'home.hero.sub': 'Фиксированная цена. Прямой контакт. Без сюрпризов.',
    'home.hero.primary': 'Начать проект',
    'home.hero.secondary': 'Избранные работы',
    'home.hero.scroll': 'Листайте',
    'home.hero.metaLabel': 'Ремесленный подход',
    'home.hero.metaIndex': '01',
    'home.hero.metaBody':
      'Делаем веб по-старому — руками, для тех, кому важно, как продукт ощущается на самом деле.',

    // Marquee strip
    'home.marquee.1': 'Веб-разработка',
    'home.marquee.2': 'Продуктовый дизайн',
    'home.marquee.3': 'Telegram-боты',
    'home.marquee.4': 'CRM и дашборды',
    'home.marquee.5': 'Автоматизация',
    'home.marquee.6': 'Работаем глобально',

    // Manifesto
    'home.manifesto.eyebrow': 'Во что мы верим',
    'home.manifesto.body':
      'Мы делаем цифровые продукты как хороший портной шьёт костюм — вручную, по фигуре, с запасом для движения. Без раздутых абонементов. Без аккаунт-менеджеров между вами и людьми, которые пишут код. Маленькая команда, которая запускает быстро, берёт честно и отвечает за работу 60 дней после запуска.',
    'home.manifesto.footnote': '— От основателей',

    // Selected work
    'home.work.eyebrow': 'Избранные работы',
    'home.work.title1': 'Настоящие продукты.',
    'home.work.title2': 'В бою.',
    'home.work.cta': 'Все проекты',
    'home.work.deliverables': 'Что сделали',
    'home.work.openCase': 'Открыть кейс',

    // Services teaser
    'home.services.eyebrow': 'Услуги',
    'home.services.title1': 'Что мы',
    'home.services.title2': 'делаем',
    'home.services.cta': 'Полный список',
    'home.services.subtitle':
      'Шесть вещей, которые мы делаем лучше большинства. Наведите — увидите превью, кликните — откроется кейс.',
    'home.services.count': 'направлений',
    'home.services.1.title': 'Сайты',
    'home.services.1.desc':
      'Маркетинговые сайты, лендинги и многостраничные продуктовые сайты — от стратегии до запуска.',
    'home.services.2.title': 'Веб-приложения',
    'home.services.2.desc':
      'SaaS, дашборды, клиентские кабинеты и админ-панели на React и TypeScript.',
    'home.services.3.title': 'Telegram-боты и Mini Apps',
    'home.services.3.desc':
      'Кастомные боты, Mini Apps и сценарии автоматизации, встроенные прямо в ваши процессы.',
    'home.services.4.title': 'CRM и бэк-офисы',
    'home.services.4.desc':
      'Десктопные и веб-CRM, собранные под то, как реально работает ваша команда — а не наоборот.',
    'home.services.5.title': 'Редизайн',
    'home.services.5.desc':
      'Берём устаревший продукт и превращаем его в то, что снова не стыдно показывать клиентам.',
    'home.services.6.title': 'Поддержка',
    'home.services.6.desc':
      'Месячные абонементы для команд, у которых продукт должен постоянно расти.',

    // Process
    'home.process.eyebrow': 'Как мы работаем',
    'home.process.title': 'Четыре шага. Без воды.',
    'home.process.1.title': 'Discover',
    'home.process.1.desc':
      'Начинаем с бизнеса, а не с технологий. Цели, аудитория, ограничения и неизвестные — всё на столе.',
    'home.process.2.title': 'Дизайн',
    'home.process.2.desc':
      'Быстрые прототипы, плотные итерации. Сходимся на направлении ещё до первой строчки в проде.',
    'home.process.3.title': 'Разработка',
    'home.process.3.desc':
      'Еженедельные демо, общий доступ, ноль чёрных ящиков. Вы видите прогресс каждый день.',
    'home.process.4.title': 'Запуск и поддержка',
    'home.process.4.desc':
      'Запускаем, передаём ключи и остаёмся на связи 60 дней бесплатных правок. Дальше — только если вы захотите.',

    // Testimonials
    'home.testimonials.eyebrow': 'Клиенты',
    'home.testimonials.title1': 'Маленькая команда.',
    'home.testimonials.title2': 'Большие результаты.',
    'home.testimonials.1.quote':
      'Собрали магазин за 2.5 недели — быстрее, чем на Shopify. Конверсия +34% в первый месяц.',
    'home.testimonials.1.name': 'Денис В.',
    'home.testimonials.1.role': 'Founder, VeloShop',
    'home.testimonials.2.quote':
      'Бот обрабатывает 400+ заказов в день. Восемь месяцев — ноль сбоев. Окупился за три недели.',
    'home.testimonials.2.name': 'Анна К.',
    'home.testimonials.2.role': 'COO, EasyFood',
    'home.testimonials.3.quote':
      'Переделали наш сайт 2019 года. Заявки удвоились без единой рекламы. Теперь не стыдно делиться ссылкой.',
    'home.testimonials.3.name': 'Игорь П.',
    'home.testimonials.3.role': 'Директор, StroyMaster',
    'home.testimonials.4.quote':
      'CRM под наши процессы. Небо и земля по сравнению с Битрикс — менеджеры освоили за день, а не за неделю.',
    'home.testimonials.4.name': 'Елена Н.',
    'home.testimonials.4.role': 'Ops lead, АвтоТрейд',

    // Big CTA
    'home.cta.line1': 'Давайте сделаем',
    'home.cta.line2': 'то, что',
    'home.cta.line3': 'стоит запускать.',
    'home.cta.sub':
      'Заполните короткий бриф — и в течение суток с вами свяжется живой разработчик, а не продающий бот.',
    'home.cta.primary': 'Начать проект',
    'home.cta.secondary': 'sintaradev@gmail.com',

    // Work page
    'work.eyebrow': 'Избранные работы · 2025 – 2026',
    'work.title1': 'Наши',
    'work.title2': 'работы.',
    'work.sub':
      'Подборка свежих проектов в продукте, вебе и автоматизации. Новые кейсы появляются по мере того, как мы их запускаем.',
    'work.viewCase': 'Смотреть кейс',

    // Services page
    'services.page.eyebrow': 'Возможности',
    'services.page.title1': 'Всё',
    'services.page.title2': 'цифровое.',
    'services.page.sub':
      'От первого лендинга до полноценной продуктовой платформы — собранное меню, а не бесконечный список.',
    'services.page.priceFrom': 'от',

    // About
    'about.eyebrow': 'Студия',
    'about.title1': 'Маленькая студия.',
    'about.title2': 'Серьёзная работа.',
    'about.lead':
      'Sintara — независимая цифровая студия, основанная в 2026 году. Мы работаем с фаундерами, операционными и маркетинговыми командами, которые заботятся о деталях и хотят запускаться без типичного агентского накладного жира.',
    'about.block1.title': 'Зачем мы существуем',
    'about.block1.body':
      'Большинство студий либо продают время (и растягивают проекты), либо продают шаблоны (и отгружают одно и то же всем подряд). Нам нужен был третий вариант: авторские продукты, быстрый запуск, фиксированная цена — и люди, которые пишут код, в одном сообщении от клиента.',
    'about.block2.title': 'Как мы думаем',
    'about.block2.body':
      'Каждый проект начинается с бизнеса, а не с технологий. Мы спрашиваем: что должно быть истиной, чтобы продукт сработал — и движемся обратным ходом к самой простой версии, которую можно запустить. Хороший софт — это не тот, где больше всего фич. Это тот, которым реально пользуются.',
    'about.principles.eyebrow': 'Как мы работаем',
    'about.principles.title': 'Принципы',
    'about.principles.1.t': 'Фиксированная цена, фиксированный объём',
    'about.principles.1.d':
      'Цифру согласовываем до старта. Без почасовки, без внезапных счетов посреди проекта.',
    'about.principles.2.t': 'Всё ваше',
    'about.principles.2.d':
      'Исходники, макеты, документация, доступы. Ничего не удерживается в заложниках.',
    'about.principles.3.t': 'Прямой доступ',
    'about.principles.3.d':
      'Вы общаетесь с разработчиком, а не со слоем менеджеров и испорченным телефоном.',
    'about.principles.4.t': 'Гарантия 60 дней',
    'about.principles.4.d':
      'Что-то сломалось после запуска? Исправим. Без счёта, драмы и вопросов.',

    // Contact
    'contact.page.eyebrow': 'Связаться',
    'contact.page.title1': 'Расскажите,',
    'contact.page.title2': 'что делаем.',
    'contact.page.sub':
      'Есть проект? Идея? Половинка эскиза? В каком бы виде она ни была — мы хотим о ней услышать.',
    'contact.page.brief': 'Заполнить бриф',
    'contact.page.email': 'Написать нам',
    'contact.page.telegram': 'Telegram',
    'contact.page.response': 'Обычно отвечаем в течение суток',
    'contact.brief.detail': '6 вопросов · около 5 минут',
    'contact.channels.title': 'Или напишите напрямую',
    'contact.email.meta': 'Удобно для подробных брифов и файлов',
    'contact.telegram.meta': 'Отвечаем быстрее всего — обычно за минуты',
    'contact.instagram.meta': 'Смотрите, как мы работаем каждый день',

    // Hero
    'hero.badge': 'Открыты для новых проектов',
    'hero.title1': 'Создаём',
    'hero.title2': 'цифровые продукты',
    'hero.title3': 'которые работают',
    'hero.subtitle': 'Веб-приложения, мобильные приложения, Telegram-боты и автоматизация — быстро, честно, надёжно.',
    'hero.cta.primary': 'Начать проект',
    'hero.cta.secondary': 'Наши работы',
    'hero.stats.projects': 'Проектов выполнено',
    'hero.stats.clients': 'Довольных клиентов',
    'hero.stats.years': 'Лет опыта',

    // Services
    'services.title1': 'Что мы',
    'services.title2': 'создаём',
    'services.subtitle': 'Превращаем амбициозные идеи в цифровые продукты, которыми хочется пользоваться',
    'services.web.number': '01',
    'services.web.title': 'Веб-разработка',
    'services.web.description': 'Создаём цифровые решения, которые привлекают и конвертируют. От быстрых лендингов до сложных веб-приложений.',
    'services.mobile.number': '02',
    'services.mobile.title': 'Мобильные приложения',
    'services.mobile.description': 'Нативная производительность и кроссплатформенность. Приложения с плавными анимациями для любых устройств.',
    'services.additional.title': 'И всё остальное, что вам нужно',
    'services.telegram': 'Telegram-боты',
    'services.telegram.desc': 'Боты для автоматизации, поддержки клиентов и бизнес-процессов',
    'services.ecommerce': 'Интернет-магазины',
    'services.ecommerce.desc': 'Полнофункциональные магазины с интеграцией оплаты',
    'services.crm': 'CRM-системы',
    'services.crm.desc': 'Решения под ваши процессы продаж',
    'services.seo': 'SEO-оптимизация',
    'services.seo.desc': 'Стратегии продвижения на основе данных',
    'services.redesign': 'Редизайн',
    'services.redesign.desc': 'Превращаем устаревшие сайты в современные',
    'services.support': 'Техподдержка',
    'services.support.desc': 'Обслуживание и поддержка 24/7',

    // Benefits
    'benefits.title': 'Почему мы',
    'benefits.subtitle': 'Мы работаем иначе. Вот что нас отличает.',
    'benefits.price.title': 'Фиксированная цена.',
    'benefits.price.desc': 'Договариваемся о стоимости до начала работ. Никаких скрытых платежей.',
    'benefits.price.tag': 'Прозрачные цены',
    'benefits.code.title': 'Всё ваше.',
    'benefits.code.desc': 'Исходный код, дизайн-файлы, документация — всё принадлежит вам.',
    'benefits.code.tag': 'Владение кодом',
    'benefits.direct.title': 'Прямой контакт.',
    'benefits.direct.desc': 'Общаетесь напрямую с разработчиками. Без менеджеров-посредников.',
    'benefits.direct.tag': 'Без посредников',
    'benefits.warranty.title': 'Гарантия 60 дней.',
    'benefits.warranty.desc': 'Нашли баг после запуска? Исправим бесплатно. Без вопросов.',
    'benefits.warranty.tag': 'Бесплатные исправления',

    // Work Process
    'process.title': 'Как мы работаем',
    'process.subtitle': 'Простой и прозрачный процесс от идеи до запуска',
    'process.step1.title': 'Анализ',
    'process.step1.desc': 'Изучаем ваш бизнес, цели и аудиторию для создания прочной основы.',
    'process.step2.title': 'Дизайн',
    'process.step2.desc': 'Создаём дизайн, который отражает ваш бренд и радует пользователей.',
    'process.step3.title': 'Разработка',
    'process.step3.desc': 'Строим продукт на чистом коде и современных технологиях.',
    'process.step4.title': 'Запуск',
    'process.step4.desc': 'Разворачиваем продукт и следим, чтобы всё работало идеально.',

    // Testimonials
    'testimonials.badge': '4.7 — средняя оценка',
    'testimonials.title': 'Что пишут клиенты',
    'testimonials.1.text': 'Сначала сомневался — маленькая команда, думал будут срывы. Но ребята сделали магазин за 2.5 недели, работает быстрее чем Shopify. Конверсия +34% за первый месяц',
    'testimonials.1.name': 'Денис В.',
    'testimonials.1.role': 'VeloShop',
    'testimonials.2.text': 'Бот обрабатывает 400+ заказов в день. Работает 8 месяцев без сбоев. Окупился за 3 недели 🔥',
    'testimonials.2.name': 'Анна К.',
    'testimonials.2.role': 'EasyFood',
    'testimonials.3.text': 'Переделали сайт 2019 года. Теперь не стыдно показывать клиентам. Заявок стало в 2 раза больше, и это без рекламы',
    'testimonials.3.name': 'Игорь П.',
    'testimonials.3.role': 'StroyMaster',
    'testimonials.4.text': 'Работаем год, сделали 3 проекта вместе. Всегда на связи, всегда в срок. Это редкость, поверьте',
    'testimonials.4.name': 'Михаил С.',
    'testimonials.4.role': 'Digital Solutions',
    'testimonials.5.text': 'CRM под наши процессы — небо и земля по сравнению с Битрикс. Менеджеры освоили за день, не за неделю',
    'testimonials.5.name': 'Елена Н.',
    'testimonials.5.role': 'АвтоТрейд',
    'testimonials.6.text': 'Сделали бота + личный кабинет для клиентов. Теперь заказы идут автоматом, менеджеры не тратят время на рутину. За месяц сэкономили ~80 часов',
    'testimonials.6.name': 'Артём Л.',
    'testimonials.6.role': 'PrintExpress',

    // Pricing
    'pricing.title': 'Простые и честные цены',
    'pricing.subtitle': 'Никаких скрытых платежей. Никаких почасовых ставок. Только фиксированные цены.',
    'pricing.landing.title': 'Лендинг',
    'pricing.landing.desc': 'Идеально для стартапов и запуска продуктов',
    'pricing.landing.feature1': 'Уникальный дизайн',
    'pricing.landing.feature2': 'Адаптив для мобильных',
    'pricing.landing.feature3': 'SEO-оптимизация',
    'pricing.landing.feature4': 'Форма обратной связи',
    'pricing.landing.feature5': 'Срок: 2 недели',
    'pricing.webapp.title': 'Веб-приложение',
    'pricing.webapp.desc': 'Для сложных бизнес-решений',
    'pricing.webapp.feature1': 'Кастомный функционал',
    'pricing.webapp.feature2': 'Авторизация пользователей',
    'pricing.webapp.feature3': 'Интеграция с БД',
    'pricing.webapp.feature4': 'Админ-панель',
    'pricing.webapp.feature5': 'API-разработка',
    'pricing.bot.title': 'Telegram-бот',
    'pricing.bot.desc': 'Автоматизируйте бизнес-процессы',
    'pricing.bot.feature1': 'Кастомные команды',
    'pricing.bot.feature2': 'Интеграция оплаты',
    'pricing.bot.feature3': 'Панель управления',
    'pricing.bot.feature4': 'Аналитика',
    'pricing.bot.feature5': 'Срок: 1-2 недели',
    'pricing.from': 'от',
    'pricing.getStarted': 'Начать',
    'pricing.popular': 'Популярно',

    // FAQ
    'faq.title': 'Частые вопросы',
    'faq.subtitle': 'Всё, что нужно знать о работе с нами',

    // Contact
    'contact.title': 'Давайте работать вместе',
    'contact.subtitle': 'Готовы начать проект? Свяжитесь с нами и обсудим ваши идеи.',
    'contact.name': 'Ваше имя',
    'contact.email': 'Email',
    'contact.message': 'Расскажите о проекте',
    'contact.send': 'Отправить',
    'contact.or': 'Или напишите напрямую',

    // Footer
    'footer.description': 'Создаём цифровые продукты, которые помогают бизнесу расти.',
    'footer.services': 'Услуги',
    'footer.company': 'Компания',
    'footer.contact': 'Контакты',
    'footer.rights': 'Все права защищены.',

    // Portfolio
    'portfolio.title': 'Наши работы',
    'portfolio.subtitle': 'Избранные проекты, демонстрирующие нашу экспертизу в веб-разработке и автоматизации',
    'portfolio.filter.all': 'Все проекты',
    'portfolio.filter.websites': 'Сайты',
    'portfolio.filter.bots': 'Telegram-боты',
    'portfolio.filter.crm': 'CRM',
    'portfolio.category.website': 'Сайт',
    'portfolio.category.bot': 'Telegram-бот',
    'portfolio.category.crm': 'CRM-система',
    'portfolio.category.saas': 'SaaS-продукт',
    'portfolio.viewProject': 'Смотреть проект',
    'portfolio.startProject': 'Начать проект',
    'portfolio.project7.title': 'KAIF CRM',
    'portfolio.project7.description': 'Desktop CRM-система для управления фитнес-клубом с офлайн-режимом и облачной синхронизацией.',
    'portfolio.project8.title': '3DLike',
    'portfolio.project8.description': 'Сайт производителя 3D стикеров с анимациями и SEO.',
    'portfolio.project9.title': 'UNICAR',
    'portfolio.project9.description': 'CRM для автопроката с дашбордом и управлением автопарком.',
    'portfolio.project10.title': 'SHIBA CARS Partner System',
    'portfolio.project10.description': 'Партнёрская система с Telegram-ботом, Mini App и real-time аналитикой.',
    'portfolio.project11.title': 'KAIF',
    'portfolio.project11.description': 'Сайт премиального велнес-комплекса с видео-фонами и мультиязычностью.',

    // Project Showcase
    'showcase.title': 'Наши проекты',
    'showcase.subtitle': 'Реальные примеры нашей работы — от сайтов до мобильных приложений и Telegram-ботов',
    'showcase.cta': 'Заказать похожий проект',
    'showcase.project1.category': 'Интернет-магазин',
    'showcase.project1.title': 'Платформа онлайн-магазина',
    'showcase.project1.description': 'Полнофункциональный магазин с оплатой и личным кабинетом',
    'showcase.project1.feature1': 'Адаптивный дизайн',
    'showcase.project1.feature2': 'Онлайн-оплата',
    'showcase.project1.feature3': 'Личные кабинеты',
    'showcase.project1.feature4': 'Система скидок',
    'showcase.project2.category': 'Telegram-бот',
    'showcase.project2.title': 'Бот автоматизации записи',
    'showcase.project2.description': 'Автоматическая запись клиентов с интеграцией CRM',
    'showcase.project2.feature1': 'Авто-расписание',
    'showcase.project2.feature2': 'Напоминания',
    'showcase.project2.feature3': 'Онлайн-оплата',
    'showcase.project2.feature4': 'Интеграция с CRM',
    'showcase.project3.category': 'Корпоративный сайт',
    'showcase.project3.title': 'Сайт IT-компании',
    'showcase.project3.description': 'Современный сайт с анимациями и интеграцией CRM',
    'showcase.project3.feature1': '3D-анимации',
    'showcase.project3.feature2': 'SEO-оптимизация',
    'showcase.project3.feature3': 'Интеграция с CRM',
    'showcase.project3.feature4': 'Мультиязычность',
    'showcase.project4.category': 'Доставка еды',
    'showcase.project4.title': 'Приложение доставки',
    'showcase.project4.description': 'Отслеживание курьера в реальном времени и программа лояльности',
    'showcase.project4.feature1': 'Отслеживание в реальном времени',
    'showcase.project4.feature2': 'Push-уведомления',
    'showcase.project4.feature3': 'Программа лояльности',
    'showcase.project4.feature4': 'Быстрый повторный заказ',

    // Project Detail Page
    'projectDetail.back': 'К портфолио',
    'projectDetail.notFound': 'Проект не найден',
    'projectDetail.notFoundDesc': 'Проект, который вы ищете, не существует или был удалён.',
    'projectDetail.viewAll': 'Все проекты',
    'projectDetail.howItWorks': 'Как это работает',
    'projectDetail.howItWorksSubtitle': 'Ключевые функции и возможности',
    'projectDetail.challenge': 'Задача и решение',
    'projectDetail.challengeSubtitle': 'Как мы превратили бизнес-задачи в результаты',
    'projectDetail.theChallenge': 'Задача',
    'projectDetail.ourSolution': 'Наше решение',
    'projectDetail.techStack': 'Технологии',
    'projectDetail.ctaTitle': 'Хотите похожий проект?',
    'projectDetail.ctaText': 'Давайте обсудим ваш проект и создадим что-то удивительное вместе.',
    'projectDetail.ctaButton': 'Начать проект',
    'projectDetail.demoGif': 'Демо',
    'projectDetail.salesIncrease': 'Рост продаж',
    'projectDetail.timeSaved': 'Экономия времени',
    'projectDetail.activeUsers': 'Активных пользователей',
    'projectDetail.development': 'Разработка',
    'projectDetail.dailyBookings': 'Бронирований в день',
    'projectDetail.automationRate': 'Автоматизация',
    'projectDetail.botUsers': 'Пользователей бота',
    'projectDetail.fasterDecisions': 'Быстрее решения',
    'projectDetail.dataRefresh': 'Обновление данных',
    'projectDetail.teamsUsing': 'Команд используют',
    'projectDetail.completionRate': 'Завершаемость',
    'projectDetail.lessonsCompleted': 'Уроков пройдено',
    'projectDetail.activeLearners': 'Активных учеников',
    'projectDetail.leadConversion': 'Конверсия лидов',
    'projectDetail.loadTime': 'Время загрузки',
    'projectDetail.monthlyVisitors': 'Посетителей в месяц',
    'projectDetail.dailyOrders': 'Заказов в день',
    'projectDetail.avgDelivery': 'Среднее время доставки',
    'projectDetail.appDownloads': 'Скачиваний',
    'projectDetail.classesManaged': 'Классов под управлением',
    'projectDetail.offlineWork': 'Офлайн работа',
    'projectDetail.clientsTracked': 'Клиентов в базе',
    'projectDetail.lighthouseScore': 'Lighthouse оценка',
    'projectDetail.pagesCreated': 'Страниц создано',
    'projectDetail.loadSpeed': 'Скорость загрузки',
    'projectDetail.carsManaged': 'Автомобилей',
    'projectDetail.activeRentals': 'Активных аренд',
    'projectDetail.modules': 'Модулей',
    'projectDetail.partnersActive': 'Активных партнёров',
    'projectDetail.clicksTracked': 'Переходов отслежено',
    'projectDetail.realTimeStats': 'Статистика в реальном времени',
    'projectDetail.languages': 'Языков',
    'projectDetail.sectionsCreated': 'Секций создано',

    // 404 Page
    'notFound.message': 'Похоже, эта страница ушла на рефакторинг и не вернулась.',
    'notFound.submessage': 'Но не переживай — мы поможем найти путь домой.',
    'notFound.home': 'На главную',
    'notFound.back': 'Назад',
    'notFound.eyebrow': 'Ошибка 404 — страница не найдена',
  }
};

/**
 * Language now comes from the URL (see lib/i18n): Russian at the bare path,
 * English under /en. It used to be React state seeded from localStorage and
 * navigator.language, which meant both languages lived at the same address —
 * so only one of them could ever be crawled, indexed or linked to.
 *
 * Consequences of the move, both deliberate:
 *  - No stored preference. The URL always wins, so a shared link opens in the
 *    language the sender was reading, and a search result opens in the
 *    language it was written in.
 *  - No automatic redirect by browser language. Sending a visitor somewhere
 *    they didn't ask for hides the canonical URL from them and muddies what
 *    crawlers see; the toggle in the menu is one click away.
 */
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, path } = parsePath(location.pathname);

  const toggleLanguage = useCallback(() => {
    // Same page, other language — never a jump back to the home page.
    navigate(
      `${withLanguage(path, otherLanguage(language))}${location.search}${location.hash}`,
    );
  }, [navigate, path, language, location.search, location.hash]);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const value = useMemo(
    () => ({ language, toggleLanguage, t }),
    [language, toggleLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// The provider, its hook and the context object intentionally live together
// (idiomatic React Context). That co-export only costs a Fast Refresh full
// reload when editing this one file — no runtime impact — so we opt out of
// the rule here rather than fragment a widely-imported module.
// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export default LanguageContext;
