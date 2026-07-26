import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PillLink from '../components/ui/PillLink';
import Reveal from '../components/ui/Reveal';
import Crosshair from '../components/ui/Crosshair';
import { useLanguage } from '../context/LanguageContext';
import { v } from '../lib/asset';

/**
 * Sintara Rent CRM — our in-house product: a vertical CRM built for
 * vehicle rental. Same cinematic dark-light-dark rhythm as the sibling
 * ProjectDetail pages, but on the product's warm amber dashboard mockup
 * (lifted straight from the rental site's hero section).
 *
 * No pricing here on purpose — the live product site carries the up-to-date
 * plans; this case page sells the product and links out.
 */

// ─── Hero ─────────────────────────────────────────────────────────────

const Hero = styled.header`
  position: relative;
  /* The real rental dashboard mockup (laptop on a warm amber set) as the
     hero background — same three-layer pattern as the other case pages.
     Top stays dark for the headline; the mockup bleeds in at the bottom.
     Fallback colour is the product's warm amber. */
  background:
    linear-gradient(
      180deg,
      rgba(10, 10, 12, 0.92) 0%,
      rgba(10, 10, 12, 0.85) 35%,
      rgba(10, 10, 12, 0.7) 60%,
      rgba(10, 10, 12, 0.3) 85%,
      rgba(10, 10, 12, 0) 100%
    ),
    url('/projects/sintara-rent-crm/mockup.avif') center / cover no-repeat,
    #d8853a;
  color: #fff;
  overflow: hidden;
  min-height: 100svh;
  padding: clamp(130px, 18vh, 220px) clamp(20px, 5vw, 80px)
    clamp(48px, 8vh, 96px);

  @media (max-width: 860px) {
    background:
      linear-gradient(
        180deg,
        rgba(10, 10, 12, 0.94) 0%,
        rgba(10, 10, 12, 0.88) 50%,
        rgba(10, 10, 12, 0.62) 85%,
        rgba(10, 10, 12, 0.3) 100%
      ),
      url('/projects/sintara-rent-crm/mockup.avif') center / cover no-repeat,
      #d8853a;
  }
`;

const Inner = styled.div`
  max-width: 1500px;
  margin: 0 auto;
`;

const ProductTitle = styled.h1`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(3.5rem, 14vw, 17rem);
  @media (max-width: 600px) {
    font-size: clamp(3.5rem, 18.5vw, 17rem);
  }
  line-height: 0.86;
  letter-spacing: -0.04em;
  margin: clamp(72px, 13vh, 160px) 0 0;

  .accent {
    color: var(--accent);
  }
`;

const Slogan = styled.p`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.5rem, 2.8vw, 2.6rem);
  line-height: 1.22;
  letter-spacing: -0.02em;
  color: #fff;
  max-width: 22em;
  margin: clamp(28px, 4.5vh, 56px) 0 0;
`;

const Lead = styled.p`
  font-family: var(--font-grotesk);
  font-size: clamp(1.0625rem, 1.2vw, 1.3125rem);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.88);
  max-width: 36em;
  margin: clamp(20px, 3vh, 32px) 0 0;
`;

const CtaRow = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: clamp(36px, 5.5vh, 64px);
`;

// ─── Body — light ─────────────────────────────────────────────────────

const Body = styled.section`
  background: var(--paper);
  color: var(--ink);
  padding: clamp(72px, 11vh, 160px) clamp(20px, 5vw, 80px)
    clamp(48px, 7vh, 110px);
`;

const SectionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
  }
`;

const Facts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--bone-line);
  border-bottom: 1px solid var(--bone-line);

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Fact = styled.div`
  padding: clamp(28px, 4vh, 48px) 28px clamp(28px, 4vh, 48px) 0;
  border-right: 1px solid var(--bone-line);

  &:last-child {
    border-right: none;
    padding-right: 0;
  }

  @media (max-width: 760px) {
    &:nth-child(2n) {
      border-right: none;
      padding-right: 0;
    }
    &:nth-child(-n + 2) {
      border-bottom: 1px solid var(--bone-line);
    }
  }

  .num {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.25rem, 4.6vw, 4rem);
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--ink);
  }
  .num .unit {
    color: var(--accent);
    margin-left: 4px;
  }
  .label {
    display: block;
    margin-top: 14px;
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--muted);
  }
`;

// ─── Section header (shared) ──────────────────────────────────────────

const SectionHead = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: end;
  margin: clamp(80px, 13vh, 170px) 0 clamp(48px, 7vh, 96px);

  h2 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.5rem, 6.5vw, 6.25rem);
    line-height: 0.95;
    letter-spacing: -0.025em;
    margin-top: 16px;
  }
  p {
    max-width: 34ch;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--muted);
    justify-self: end;
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 18px;
    p {
      justify-self: start;
    }
  }
`;

// ─── Module showcase — alternating mockup + copy ──────────────────────

const Showcase = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(72px, 11vh, 150px);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(36px, 5vw, 96px);
  align-items: center;

  /* Flip every other row so the mockup alternates sides. The rtl trick
     swaps the visual column order without reordering the DOM; children are
     reset to ltr so their own text stays left-aligned. */
  &:nth-child(even) {
    direction: rtl;
  }
  &:nth-child(even) > * {
    direction: ltr;
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 28px;
    direction: ltr;
  }
`;

const Shot = styled.div`
  border-radius: 18px;
  overflow: hidden;
  background: #d8853a;
  box-shadow: 0 40px 90px -50px rgba(20, 12, 0, 0.55);

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const Copy = styled.div`
  max-width: 30em;

  .num {
    display: block;
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--accent);
    margin-bottom: 22px;
    font-variant-numeric: tabular-nums;
  }
  h3 {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: clamp(1.75rem, 3vw, 2.75rem);
    line-height: 1.04;
    letter-spacing: -0.025em;
    color: var(--ink);
  }
  p {
    margin-top: 20px;
    font-family: var(--font-grotesk);
    font-size: clamp(1rem, 1.1vw, 1.125rem);
    line-height: 1.6;
    color: var(--muted);
  }
`;

// ─── Secondary capabilities strip ─────────────────────────────────────

const More = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--bone-line);
  border: 1px solid var(--bone-line);
  margin-top: clamp(36px, 6vh, 72px);

  @media (max-width: 860px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Cap = styled.div`
  background: var(--paper);
  padding: clamp(28px, 4vh, 44px) clamp(20px, 2vw, 32px);

  h4 {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: clamp(1.125rem, 1.6vw, 1.375rem);
    line-height: 1.12;
    letter-spacing: -0.015em;
    color: var(--ink);
  }
  p {
    margin-top: 14px;
    font-family: var(--font-grotesk);
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--muted);
  }
`;

const Tech = styled.div`
  padding: clamp(64px, 9vh, 130px) 0 clamp(48px, 7vh, 96px);
  border-top: 1px solid var(--bone-line);
  margin-top: clamp(80px, 12vh, 160px);
`;

const TagList = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 28px;
`;

const Tag = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  padding: 8px 16px;
  border: 1px solid var(--bone-line);
  border-radius: 999px;
`;

// ─── Dark CTA finale ──────────────────────────────────────────────────

const CtaShell = styled.section`
  position: relative;
  background: var(--ink);
  color: #fff;
  overflow: hidden;
  padding: clamp(180px, 26vh, 320px) clamp(20px, 5vw, 80px)
    clamp(200px, 30vh, 380px);
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    inset: -16px;
    background:
      radial-gradient(
        ellipse at 50% 50%,
        rgba(0, 0, 0, 0.35) 0%,
        rgba(0, 0, 0, 0.15) 55%,
        rgba(0, 0, 0, 0) 100%
      ),
      linear-gradient(rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)),
      url('/projects/sintara-rent-crm/cta-bg.avif') center / cover no-repeat;
    filter: blur(6px);
    z-index: 0;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: clamp(220px, 30vh, 380px);
    background: linear-gradient(
      to bottom,
      rgba(8, 6, 18, 0) 0%,
      rgba(8, 6, 18, 0.45) 45%,
      var(--ink) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 860px) {
    &::before {
      filter: blur(9px);
      background:
        radial-gradient(
          ellipse at 50% 50%,
          rgba(0, 0, 0, 0.45) 0%,
          rgba(0, 0, 0, 0.2) 65%,
          rgba(0, 0, 0, 0) 100%
        ),
        linear-gradient(rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)),
        url('/projects/sintara-rent-crm/cta-bg.avif') center / cover no-repeat;
    }
  }
`;

const CtaInner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(28px, 5vh, 56px);

  .eyebrow {
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent-bright);
  }

  h2 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.75rem, 8.5vw, 9rem);
    line-height: 0.92;
    letter-spacing: -0.03em;
  }

  .row {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .meta {
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--muted-dark);
  }
  .meta b {
    color: var(--accent-bright);
    font-weight: 600;
  }
`;

// ─── Page ─────────────────────────────────────────────────────────────

/**
 * Scopes the product's own warm amber accent to the page body only. The
 * styled-components below all read var(--accent); overriding it here recolours
 * the whole rental page from the house violet to amber — while NavBar and
 * Footer stay outside this wrapper and keep the studio's violet.
 */
const Scope = styled.div`
  --accent: #d97706;
  --accent-hover: #b45309;
  --accent-bright: #fbbf24;
  --accent-soft: #fffbeb;
`;

const PRODUCT_URL = 'https://sintara-rent-crm.com';

const RentCrmProduct = () => {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const reduced = useReducedMotion();

  const facts = isRu
    ? [
        { num: '9', unit: '', label: 'Модулей в одном окне' },
        { num: '5', unit: 'мин', label: 'Запуск с нуля' },
        { num: '4', unit: 'канала', label: 'В одном инбоксе' },
        { num: '24', unit: '/7', label: 'Браузер и телефон' },
      ]
    : [
        { num: '9', unit: '', label: 'Modules, one workspace' },
        { num: '5', unit: 'min', label: 'Launch from scratch' },
        { num: '4', unit: 'channels', label: 'In a single inbox' },
        { num: '24', unit: '/7', label: 'Browser & phone' },
      ];

  const modules = isRu
    ? [
        {
          img: '/projects/sintara-rent-crm/shot-conversations.avif',
          title: 'Омниканальный инбокс',
          desc: 'Telegram, WhatsApp, Instagram и Facebook в одной ленте. AI подсказывает ответы, делает саммари диалога и достаёт бронь прямо из переписки.',
        },
        {
          img: '/projects/sintara-rent-crm/shot-rentals.avif',
          title: 'Аренды и депозиты',
          desc: 'Полный цикл сделки: от заявки до возврата. Депозиты с удержаниями за топливо, повреждения и штрафы, продления с проверкой пересечений, договоры и платежи.',
        },
        {
          img: '/projects/sintara-rent-crm/shot-finances.avif',
          title: 'Финансы по каждой машине',
          desc: 'Доходы, расходы и прибыль в разрезе каждого авто. Леджер с целостностью данных, кэшфлоу и отчёты — видно, какая машина реально зарабатывает.',
        },
        {
          img: '/projects/sintara-rent-crm/shot-locations.avif',
          title: 'GPS-локации без привязки к провайдеру',
          desc: 'Карта машин в реальном времени из четырёх источников: ручные пины, телефон водителя, вебхуки и Traccar — в одном потоке. История маршрутов.',
        },
        {
          img: '/projects/sintara-rent-crm/shot-calendar.avif',
          title: 'Календарь и онлайн-бронь',
          desc: 'Месяц и неделя, доступность парка с одного взгляда, проверка пересечений. Публичный сайт брони с вашими ценами — заявка сразу падает в CRM.',
        },
      ]
    : [
        {
          img: '/projects/sintara-rent-crm/shot-conversations.avif',
          title: 'Omnichannel inbox',
          desc: 'Telegram, WhatsApp, Instagram and Facebook in one feed. AI drafts replies, summarizes threads and pulls a booking straight out of the chat.',
        },
        {
          img: '/projects/sintara-rent-crm/shot-rentals.avif',
          title: 'Rentals & deposits',
          desc: 'The full deal cycle from request to return. Deposits with deductions for fuel, damage and fines, extensions with overlap checks, contracts and payments.',
        },
        {
          img: '/projects/sintara-rent-crm/shot-finances.avif',
          title: 'Per-car finances',
          desc: 'Income, expenses and profit broken down by each car. A ledger with data integrity, cash flow and reports — you see which car actually earns.',
        },
        {
          img: '/projects/sintara-rent-crm/shot-locations.avif',
          title: 'Provider-agnostic GPS',
          desc: 'A live map of your fleet from four sources: manual pins, the driver’s phone, webhooks and Traccar — in one stream. Route history.',
        },
        {
          img: '/projects/sintara-rent-crm/shot-calendar.avif',
          title: 'Calendar & online booking',
          desc: 'Month and week views, fleet availability at a glance, overlap detection. A public booking site with your prices — requests land straight in the CRM.',
        },
      ];

  const caps = isRu
    ? [
        {
          title: 'Автопарк с фотофиксацией',
          desc: 'Фото на выдаче и возврате, документы, пробег и сервис по каждой машине.',
        },
        {
          title: 'Задачи и команда',
          desc: 'Назначения с дедлайнами, роли и доступы, внутренний чат команды.',
        },
        {
          title: 'Изолированное пространство',
          desc: 'Свой поддомен, логотип и данные. Мультитенант с резервными копиями.',
        },
        {
          title: 'Отчёты и экспорт',
          desc: 'PDF и CSV, выгрузка данных в любой момент — данные всегда ваши.',
        },
      ]
    : [
        {
          title: 'Fleet with photo-proof',
          desc: 'Hand-over and return photos, documents, mileage and service per car.',
        },
        {
          title: 'Tasks & team',
          desc: 'Assignments with deadlines, roles and access, an internal team chat.',
        },
        {
          title: 'Isolated workspace',
          desc: 'Your own subdomain, logo and data. Multi-tenant with backups.',
        },
        {
          title: 'Reports & export',
          desc: 'PDF and CSV, export your data anytime — the data is always yours.',
        },
      ];

  const tech = [
    'React 18',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Node.js',
    'Express',
    'PostgreSQL',
    'Claude AI',
    'Leaflet',
    'Traccar',
    'Multitenancy',
    'Cloud SaaS',
  ];

  return (
    <>
      <NavBar />

      <Scope>
      <Hero data-surface="dark" data-nav-theme="dark">
        <Crosshair
          style={{ top: '18%', right: '8%' }}
          $size={15}
          $color="rgba(255,255,255,0.28)"
        />
        <Crosshair
          style={{ bottom: '22%', left: '6%' }}
          $size={13}
          $color="rgba(255,255,255,0.22)"
        />
        <Inner>
          <ProductTitle>
            <motion.span
              style={{ display: 'inline-block' }}
              initial={reduced ? false : { y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Sintara <span className="accent">Rent</span>
            </motion.span>
          </ProductTitle>
          <Reveal delay={0.22}>
            <Slogan>
              {isRu
                ? 'Весь автопрокат — в одном окне. Машины, клиенты, аренды, финансы и мессенджеры.'
                : 'Your whole car rental — in one workspace. Fleet, clients, rentals, finances and messengers.'}
            </Slogan>
          </Reveal>
          <Reveal delay={0.3}>
            <Lead>
              {isRu
                ? 'Изолированное рабочее пространство для проката авто и мото: от первой заявки в Telegram до возврата машины и отчёта по прибыли. Запуск за пять минут — без интеграторов и недель внедрения.'
                : 'An isolated workspace for car & moto rental: from the first Telegram request to keys back and a profit report. Live in five minutes — no integrators, no weeks of onboarding.'}
            </Lead>
          </Reveal>
          <Reveal delay={0.38}>
            <CtaRow>
              <PillLink href={PRODUCT_URL} variant="light" arrow>
                {isRu ? 'Перейти к продукту' : 'Visit product'}
              </PillLink>
              <PillLink href={PRODUCT_URL} variant="ghost" arrow>
                {isRu ? 'Создать пространство' : 'Create workspace'}
              </PillLink>
            </CtaRow>
          </Reveal>
        </Inner>
      </Hero>

      <Body data-nav-theme="light">
        <Inner>
          <Facts>
            {facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.06}>
                <Fact>
                  <div className="num">
                    {f.num}
                    <span className="unit">{f.unit}</span>
                  </div>
                  <span className="label">{f.label}</span>
                </Fact>
              </Reveal>
            ))}
          </Facts>

          <SectionHead>
            <div>
              <Reveal as="span">
                <SectionLabel>
                  {isRu ? 'Что внутри' : "What's inside"}
                </SectionLabel>
              </Reveal>
              <Reveal as="h2" delay={0.06}>
                {isRu ? 'Модули продукта' : 'The modules'}
              </Reveal>
            </div>
            <Reveal as="p" delay={0.1}>
              {isRu
                ? 'Девять модулей закрывают весь цикл аренды — от первой заявки до возврата машины и отчёта по прибыли. Вот ключевые.'
                : 'Nine modules cover the full rental cycle — from the first request to keys back and a profit report. Here are the core ones.'}
            </Reveal>
          </SectionHead>

          <Showcase>
            {modules.map((m, i) => (
              <Row key={m.title}>
                <Reveal className="shot" delay={0.04}>
                  <Shot>
                    <img
                      src={v(m.img)}
                      alt={m.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.opacity = '0';
                      }}
                    />
                  </Shot>
                </Reveal>
                <Reveal delay={0.1}>
                  <Copy>
                    <span className="num">0{i + 1}</span>
                    <h3>{m.title}</h3>
                    <p>{m.desc}</p>
                  </Copy>
                </Reveal>
              </Row>
            ))}
          </Showcase>

          <SectionHead>
            <div>
              <Reveal as="span">
                <SectionLabel>{isRu ? 'И ещё' : 'And more'}</SectionLabel>
              </Reveal>
              <Reveal as="h2" delay={0.06}>
                {isRu ? 'Всё для аренды' : 'Everything rental'}
              </Reveal>
            </div>
            <Reveal as="p" delay={0.1}>
              {isRu
                ? 'Помимо ключевых модулей — всё, без чего прокат не работает каждый день.'
                : 'Beyond the core modules — everything a rental needs to run every day.'}
            </Reveal>
          </SectionHead>

          <More>
            {caps.map((c, i) => (
              <Reveal key={c.title} delay={(i % 4) * 0.05}>
                <Cap>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </Cap>
              </Reveal>
            ))}
          </More>

          <Tech>
            <Reveal as="span">
              <SectionLabel>{isRu ? 'Технологии' : 'Tech stack'}</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <TagList>
                {tech.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagList>
            </Reveal>
          </Tech>
        </Inner>
      </Body>

      <CtaShell data-surface="dark" data-nav-theme="dark">
        <Crosshair
          style={{ top: '22%', left: '12%' }}
          $size={15}
          $color="rgba(255,255,255,0.3)"
        />
        <Crosshair
          style={{ bottom: '20%', right: '14%' }}
          $size={15}
          $color="rgba(255,255,255,0.3)"
        />
        <CtaInner>
          <Reveal as="span" className="eyebrow">
            Sintara Rent CRM
          </Reveal>
          <Reveal as="h2" delay={0.05}>
            {isRu ? 'Запустите прокат сегодня' : 'Launch your rental today'}
          </Reveal>
          <Reveal delay={0.12}>
            <div className="row">
              <PillLink href={PRODUCT_URL} variant="light" arrow>
                {isRu ? 'Перейти к продукту' : 'Visit product'}
              </PillLink>
              <PillLink to="/work" variant="ghost" arrow>
                {isRu ? 'Смотреть другие работы' : 'See other work'}
              </PillLink>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <span className="meta">
              {isRu ? (
                <>
                  <b>Бесплатный старт</b> · без карты ·{' '}
                  <b>sintara-rent-crm.com</b>
                </>
              ) : (
                <>
                  <b>Free to start</b> · no card · <b>sintara-rent-crm.com</b>
                </>
              )}
            </span>
          </Reveal>
        </CtaInner>
      </CtaShell>
      </Scope>

      <Footer />
    </>
  );
};

export default RentCrmProduct;
