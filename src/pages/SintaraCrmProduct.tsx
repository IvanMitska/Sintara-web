import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PillLink from '../components/ui/PillLink';
import Reveal from '../components/ui/Reveal';
import Crosshair from '../components/ui/Crosshair';
import { useLanguage } from '../context/LanguageContext';

/**
 * Sintara CRM — flagship in-house product. Cinematic dark-light-dark surface
 * rhythm matching ProjectDetail: editorial dark hero, light run with facts /
 * features / stack, dark conversion close with external + in-site CTAs.
 */

// ─── Hero ─────────────────────────────────────────────────────────────

const Hero = styled.header`
  position: relative;
  /* Real product mockup as the hero background — same three-layer
     pattern as the other case pages (ProjectDetail). Top of the hero
     stays dark for the headline; the cover bleeds in cleanly at the
     bottom. Fallback colour is the product's brand violet. */
  background:
    linear-gradient(
      180deg,
      rgba(10, 10, 12, 0.92) 0%,
      rgba(10, 10, 12, 0.85) 35%,
      rgba(10, 10, 12, 0.7) 60%,
      rgba(10, 10, 12, 0.3) 85%,
      rgba(10, 10, 12, 0) 100%
    ),
    url('/projects/sintara-crm/mockup.webp') center / cover no-repeat,
    #8B5CF6;
  color: #fff;
  overflow: hidden;
  min-height: 100svh;
  padding: clamp(130px, 18vh, 220px) clamp(20px, 5vw, 80px)
    clamp(48px, 8vh, 96px);

  /* Mobile: stronger overlay across the whole hero so the giant title
     stays readable on a narrow viewport. */
  @media (max-width: 860px) {
    background:
      linear-gradient(
        180deg,
        rgba(10, 10, 12, 0.94) 0%,
        rgba(10, 10, 12, 0.88) 50%,
        rgba(10, 10, 12, 0.62) 85%,
        rgba(10, 10, 12, 0.3) 100%
      ),
      url('/projects/sintara-crm/mockup.webp') center / cover no-repeat,
      #8B5CF6;
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
  /* Phones: scale the hero up with the viewport so it doesn't sit at the small
     clamp floor; the floor still protects the narrowest phones. Desktop curve
     unchanged. */
  @media (max-width: 600px) {
    font-size: clamp(3.5rem, 18.5vw, 17rem);
  }
  line-height: 0.86;
  letter-spacing: -0.04em;
  /* Compensates for the removed MetaRow strip that used to sit above
     the title — keeps the headline at roughly the same vertical spot. */
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
  /* High-opacity white — sits in the lower part of the hero where the
     overlay is lighter and the mockup bleeds through. muted-dark
     washes out on the violet/dark mockup. */
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

const FeaturesHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: end;
  margin: clamp(80px, 12vh, 160px) 0 clamp(40px, 6vh, 80px);

  h2 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.5rem, 7vw, 7rem);
    line-height: 0.95;
    letter-spacing: -0.025em;
    margin-top: 14px;
  }
  p {
    max-width: 360px;
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    justify-self: end;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 20px;
    p {
      justify-self: start;
    }
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-top: 1px solid var(--bone-line);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Feature = styled.article`
  padding: clamp(36px, 5.5vh, 64px) clamp(20px, 2.5vw, 40px)
    clamp(36px, 5.5vh, 64px) 0;
  border-bottom: 1px solid var(--bone-line);
  border-right: 1px solid var(--bone-line);

  &:nth-child(2n) {
    padding-right: 0;
    border-right: none;
    padding-left: clamp(20px, 2.5vw, 40px);
  }

  @media (max-width: 760px) {
    padding-right: 0;
    border-right: none;
    &:nth-child(2n) {
      padding-left: 0;
    }
  }

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
    font-size: clamp(1.5rem, 2.6vw, 2.25rem);
    line-height: 1.06;
    letter-spacing: -0.025em;
    color: var(--ink);
  }
  p {
    margin-top: 18px;
    font-family: var(--font-grotesk);
    font-size: 1rem;
    line-height: 1.55;
    color: var(--muted);
    max-width: 52ch;
  }
`;

const Tech = styled.div`
  padding: clamp(64px, 9vh, 130px) 0 clamp(48px, 7vh, 96px);
  border-top: 1px solid var(--bone-line);
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
  /* The photo (laptop with product on screen) competes for attention
     with the headline — the screen text bleeds through any reasonable
     overlay. Solution: move the image into ::before and blur it. The
     laptop screen content dissolves into bokeh while the colour mood
     (purple couch, laptop silhouette) stays. Filter can't sit on the
     section itself or it would blur the headline and pills too. */
  background: var(--ink);
  color: #fff;
  overflow: hidden;
  /* Padding matches the other inner-page CTAs, with a slight bottom
     bias for the fade tail. */
  padding: clamp(180px, 26vh, 320px) clamp(20px, 5vw, 80px)
    clamp(200px, 30vh, 380px);
  text-align: center;

  /* Blurred photograph + overlay sit here behind everything else.
     Slight overdraw (inset: -24px) so the blur halo doesn't reveal a
     sharp edge against the page. The radial + linear darkening layers
     are baked into this same pseudo so they get blurred together with
     the photo (a blurred gradient is still a gradient, no harm). */
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
      linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
      url('/projects/sintara-crm/cta-bg.webp') center / cover no-repeat;
    /* 5px blur — mockup stays recognisable (Sintara CRM panels visible,
       laptop shape clear), but small UI text on the screen becomes
       softened enough that it stops fighting the headline. 14px was
       erasing the mockup entirely, 0px had readable competing text.
       This is the sweet spot. */
    filter: blur(5px);
    z-index: 0;
    pointer-events: none;
  }

  /* Soft fade-to-ink along the bottom edge so the seam into the
     global Footer (solid var(--ink)) dissolves instead of cutting
     hard. Sits above the blurred image, below the content. */
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

  /* Mobile: slightly stronger blur + a touch more darkening, since the
     headline and pills sit very close to the laptop centre on a narrow
     screen and the screen content lands almost directly under the text. */
  @media (max-width: 860px) {
    &::before {
      filter: blur(8px);
      background:
        radial-gradient(
          ellipse at 50% 50%,
          rgba(0, 0, 0, 0.45) 0%,
          rgba(0, 0, 0, 0.2) 65%,
          rgba(0, 0, 0, 0) 100%
        ),
        linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
        url('/projects/sintara-crm/cta-bg.webp') center / cover no-repeat;
    }
  }
`;

const CtaInner = styled.div`
  /* Lifted above the bottom fade-to-ink overlay (CtaShell::after at
     z-index: 1) so the headline and pills stay visible on short
     viewports where they'd otherwise drift into the fade zone. */
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

const SintaraCrmProduct = () => {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const reduced = useReducedMotion();

  const features = isRu
    ? [
        {
          title: 'Омниканальный инбокс',
          desc: 'Мессенджеры, e-mail, SMS — в одной ленте. Вся история разговоров привязана к контакту, никаких потерянных диалогов.',
        },
        {
          title: 'Воронка продаж',
          desc: 'Настраиваемые pipeline, Kanban-доска, прогноз выручки и win-rate. Команда видит сделки, руководитель — план и факт.',
        },
        {
          title: 'Automation Studio',
          desc: 'No-code конструктор: триггеры, действия, условная логика. До 500 узлов в сценарии, 84 готовых шаблона, AI-шаги — классификация лидов, автоответы, суммаризация.',
        },
        {
          title: 'Онлайн-запись из коробки',
          desc: 'Ресурсы, услуги, расписание, лист ожидания, напоминания. Ядро продукта, а не плагин — поэтому работает быстро и без костылей.',
        },
        {
          title: 'Аналитика в реальном времени',
          desc: 'Воронка, forecast, активность команды, RFM-сегментация. Дашборды, по которым принимают решения, а не отчёты, которые никто не читает.',
        },
        {
          title: 'Единый профиль клиента',
          desc: 'Все контакты с timeline активности: визиты, заказы, переписки, платежи. Полная картина в одном окне.',
        },
      ]
    : [
        {
          title: 'Omnichannel inbox',
          desc: 'Messengers, e-mail and SMS in one feed. Every conversation is bound to a contact — no more lost threads.',
        },
        {
          title: 'Sales pipeline',
          desc: 'Customizable pipelines, Kanban board, revenue forecast and win-rate. The team sees deals, the lead sees plan vs. actual.',
        },
        {
          title: 'Automation Studio',
          desc: 'A no-code builder: triggers, actions, conditional logic. Up to 500 nodes per scenario, 84 prebuilt templates and AI steps — lead scoring, auto-replies, summarization.',
        },
        {
          title: 'Online booking, built-in',
          desc: 'Resources, services, schedules, waitlists, reminders. A core module, not a plugin — so it’s fast and free of duct tape.',
        },
        {
          title: 'Real-time analytics',
          desc: 'Funnel, forecast, team activity, RFM segmentation. Dashboards that drive decisions, not reports nobody opens.',
        },
        {
          title: 'Unified customer profile',
          desc: 'Every contact with a full activity timeline — visits, orders, messages, payments. The full picture in a single window.',
        },
      ];

  const facts = isRu
    ? [
        { num: '40', unit: '+', label: 'Интеграций' },
        { num: '10', unit: 'мин', label: 'Запуск из коробки' },
        { num: '14', unit: 'дней', label: 'Бесплатно, без карты' },
        { num: '~2', unit: 'нед', label: 'Цикл релизов' },
      ]
    : [
        { num: '40', unit: '+', label: 'Integrations' },
        { num: '10', unit: 'min', label: 'Setup, end-to-end' },
        { num: '14', unit: 'days', label: 'Free, no card' },
        { num: '~2', unit: 'wk', label: 'Release cadence' },
      ];

  const tech = [
    'Next.js 15',
    'React 19',
    'TypeScript',
    'Tailwind CSS v4',
    'GSAP',
    'React Three Fiber',
    'Postgres',
    'RBAC',
    'Multitenancy',
    'Cloud SaaS',
    'On-premise',
  ];

  return (
    <>
      <NavBar />

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
              Sintara <span className="accent">CRM</span>
            </motion.span>
          </ProductTitle>
          <Reveal delay={0.22}>
            <Slogan>
              {isRu
                ? 'CRM, которой приятно пользоваться. Единое окно для продаж, общения и клиентов.'
                : 'A CRM you actually enjoy using. One window for sales, conversations and customers.'}
            </Slogan>
          </Reveal>
          <Reveal delay={0.3}>
            <Lead>
              {isRu
                ? 'Омниканальная CRM для малого и среднего бизнеса в Азии. Скорость и интерфейс уровня Linear и Notion — там, где привычные CRM выглядят как софт прошлого десятилетия.'
                : 'An omnichannel CRM for SMB teams across Asia. The feel and speed of Linear or Notion — built for an industry where most CRMs still look like software from the last decade.'}
            </Lead>
          </Reveal>
          <Reveal delay={0.38}>
            <CtaRow>
              <PillLink
                href="https://www.sintara-crm.com"
                variant="light"
                arrow
              >
                {isRu ? 'Перейти к продукту' : 'Visit product'}
              </PillLink>
              <PillLink
                href="https://www.sintara-crm.com"
                variant="ghost"
                arrow
              >
                {isRu ? 'Попробовать бесплатно' : 'Try free for 14 days'}
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

          <FeaturesHead>
            <div>
              <Reveal as="span">
                <SectionLabel>
                  {isRu ? 'Что внутри' : "What's inside"}
                </SectionLabel>
              </Reveal>
              <Reveal as="h2" delay={0.06}>
                {isRu ? 'Шесть опор продукта' : 'Six product pillars'}
              </Reveal>
            </div>
            <Reveal as="p" delay={0.1}>
              {isRu
                ? 'Каждая часть — самостоятельный модуль, но вместе они работают как единое целое.'
                : 'Each part is a standalone module — together they work as a single product.'}
            </Reveal>
          </FeaturesHead>

          <Features>
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 2) * 0.06}>
                <Feature>
                  <span className="num">0{i + 1}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </Feature>
              </Reveal>
            ))}
          </Features>

          <Tech>
            <Reveal as="span">
              <SectionLabel>
                {isRu ? 'Технологии' : 'Tech stack'}
              </SectionLabel>
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
            {isRu ? 'Sintara CRM' : 'Sintara CRM'}
          </Reveal>
          <Reveal as="h2" delay={0.05}>
            {isRu ? 'Попробуйте за 10 минут' : 'Up and running in 10 minutes'}
          </Reveal>
          <Reveal delay={0.12}>
            <div className="row">
              <PillLink
                href="https://www.sintara-crm.com"
                variant="light"
                arrow
              >
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
                  <b>14 дней</b> бесплатно · без карты ·{' '}
                  <b>www.sintara-crm.com</b>
                </>
              ) : (
                <>
                  <b>14 days</b> free · no card · <b>www.sintara-crm.com</b>
                </>
              )}
            </span>
          </Reveal>
        </CtaInner>
      </CtaShell>

      <Footer />
    </>
  );
};

export default SintaraCrmProduct;
