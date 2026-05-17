import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Reveal from '../../components/ui/Reveal';
import Crosshair from '../../components/ui/Crosshair';

/**
 * Capabilities — a dark cinematic break in the page rhythm. A numbered
 * list of what Sintara builds, each row shifting toward cyan on hover.
 */

const Shell = styled.section`
  position: relative;
  background: var(--ink);
  color: #fff;
  padding: clamp(90px, 13vh, 180px) clamp(20px, 5vw, 80px);
  overflow: hidden;
`;

const Inner = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  flex-wrap: wrap;
  margin-bottom: clamp(40px, 6vh, 80px);

  .eyebrow {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--cyan);
  }
  h2 {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(2.5rem, 7vw, 7rem);
    line-height: 0.95;
    letter-spacing: -0.05em;
    margin-top: 14px;
  }
  p {
    max-width: 340px;
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--muted-dark);
  }
`;

const Row = styled(Link)`
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: clamp(16px, 3vw, 48px);
  align-items: center;
  padding: clamp(22px, 3.4vh, 40px) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;

  &:last-child {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .num {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--cyan);
    font-variant-numeric: tabular-nums;
  }

  .name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.75rem, 4.5vw, 4rem);
    letter-spacing: -0.04em;
    line-height: 1;
    transition: transform 0.5s var(--ease-expo), color 0.4s var(--ease-snap);
  }

  .desc {
    max-width: 360px;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--muted-dark);
    text-align: right;
    transition: color 0.4s var(--ease-snap);
  }

  .arrow {
    font-size: 1.5rem;
    color: var(--cyan);
    opacity: 0;
    transform: translateX(-10px);
    transition: opacity 0.3s, transform 0.4s var(--ease-expo);
  }

  &:hover .name {
    color: var(--cyan);
    transform: translateX(clamp(8px, 1.5vw, 24px));
  }
  &:hover .desc {
    color: #fff;
  }
  &:hover .arrow {
    opacity: 1;
    transform: translateX(0);
  }

  @media (max-width: 760px) {
    grid-template-columns: 40px 1fr;
    .desc {
      grid-column: 1 / -1;
      text-align: left;
      margin-top: 8px;
    }
    .arrow {
      display: none;
    }
  }
`;

const Capabilities = () => {
  const { language } = useLanguage();
  const isRu = language === 'ru';

  const items = isRu
    ? [
        {
          to: '/services#web',
          name: 'Сайты',
          desc: 'Лендинги и маркетинговые сайты, которые продают.',
        },
        {
          to: '/services#webapp',
          name: 'Веб-приложения',
          desc: 'Дашборды, SaaS и сложные веб-продукты.',
        },
        {
          to: '/services#bot',
          name: 'Telegram-боты',
          desc: 'Боты, mini-apps и автоматизация внутри Telegram.',
        },
        {
          to: '/services#crm',
          name: 'CRM-системы',
          desc: 'Кастомные CRM и админ-панели под ваши процессы.',
        },
      ]
    : [
        {
          to: '/services#web',
          name: 'Websites',
          desc: 'Landing pages and marketing sites that convert.',
        },
        {
          to: '/services#webapp',
          name: 'Web apps',
          desc: 'Dashboards, SaaS and complex web products.',
        },
        {
          to: '/services#bot',
          name: 'Telegram bots',
          desc: 'Bots, mini-apps and automation inside Telegram.',
        },
        {
          to: '/services#crm',
          name: 'CRM systems',
          desc: 'Custom CRMs and admin panels built around your ops.',
        },
      ];

  return (
    <Shell data-surface="dark" data-nav-theme="dark">
      <Crosshair
        style={{ top: '10%', right: '8%' }}
        $size={16}
        $color="rgba(255,255,255,0.3)"
      />
      <Inner>
        <Head>
          <div>
            <Reveal as="span" className="eyebrow">
              {isRu ? '(02) — Чем занимаемся' : '(02) — What we do'}
            </Reveal>
            <Reveal as="h2" delay={0.05}>
              {isRu ? 'Возможности' : 'Capabilities'}
            </Reveal>
          </div>
          <Reveal as="p" delay={0.1}>
            {isRu
              ? 'Полный цикл — от стратегии и дизайна до разработки и запуска.'
              : 'Full cycle — from strategy and design to development and launch.'}
          </Reveal>
        </Head>

        {items.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.06}>
            <Row to={item.to} data-cursor="hover">
              <span className="num">0{i + 1}</span>
              <span className="name">{item.name}</span>
              <span className="desc">{item.desc}</span>
              <span className="arrow" aria-hidden>
                ↗
              </span>
            </Row>
          </Reveal>
        ))}
      </Inner>
    </Shell>
  );
};

export default Capabilities;
