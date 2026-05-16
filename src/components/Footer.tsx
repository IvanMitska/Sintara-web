import { Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { useLanguage } from '../context/LanguageContext';

/**
 * Editorial footer — Sintara house style.
 *
 * Three movements: an invitation band (eyebrow + oversized e-mail as the
 * primary action, live availability status on the right), a numbered
 * link grid with the signature bar-grow hover, and a full-bleed wordmark
 * that hollows into an outline on hover. Legal hairline closes it out
 * with a back-to-top control. Always on ink.
 */

const ping = keyframes`
  0%   { transform: scale(1);   opacity: 0.6; }
  70%,
  100% { transform: scale(3.4); opacity: 0; }
`;

const Shell = styled.footer`
  background: var(--ink);
  color: #fff;
  padding: 112px 32px 28px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 72px 20px 24px;
  }
`;

const Inner = styled.div`
  max-width: 1680px;
  margin: 0 auto;
`;

// ─── Invitation band ──────────────────────────────────────────────────

const TopBand = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 48px 56px;
  align-items: start;
  padding-bottom: 64px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 36px;
    padding-bottom: 48px;
  }
`;

const Lead = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted-dark);
  line-height: 1;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    flex: none;
  }
`;

const BigEmail = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 0.16em;
  width: fit-content;
  max-width: 100%;
  margin-top: 20px;
  font-family: var(--font-display);
  font-size: clamp(1.625rem, 3.6vw, 3.25rem);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: #fff;
  transition: color 0.4s var(--ease-snap);

  .addr {
    word-break: break-word;
  }

  .arrow {
    font-size: 0.4em;
    flex: none;
    margin-top: 0.12em;
    transition: transform 0.5s var(--ease-expo);
  }

  &:hover {
    color: var(--accent);

    .arrow {
      transform: translate(0.22em, -0.22em);
    }
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 28px;
  text-align: right;

  @media (max-width: 900px) {
    align-items: flex-start;
    text-align: left;
  }
`;

const Status = styled.div`
  display: flex;
  flex-direction: column;
  align-items: inherit;
  gap: 14px;

  .live {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: #fff;
  }

  .dot {
    position: relative;
    width: 8px;
    height: 8px;
    flex: none;
    border-radius: 50%;
    background: #4ade80;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #4ade80;
      animation: ${ping} 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }
  }

  .studio {
    font-family: var(--font-grotesk);
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--muted-dark);
    max-width: 240px;
  }

  @media (prefers-reduced-motion: reduce) {
    .dot::after {
      animation: none;
    }
  }
`;

const Pill = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 30px;
  background: #fff;
  border: 1.5px solid #fff;
  border-radius: 999px;
  font-family: var(--font-grotesk);
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink);
  margin-top: 32px;
  transition:
    background 0.35s var(--ease-snap),
    border-color 0.35s var(--ease-snap),
    color 0.35s var(--ease-snap);

  &::after {
    content: '→';
    transition: transform 0.45s var(--ease-expo);
  }

  &:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;

    &::after {
      transform: translateX(6px);
    }
  }
`;

// ─── Link grid ────────────────────────────────────────────────────────

const Grid = styled.nav`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  padding: 72px 0 96px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 48px 24px;
    padding: 56px 0 72px;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColHead = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted-dark);

  .idx {
    color: var(--accent);
    font-variant-numeric: tabular-nums;
  }

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.12);
  }
`;

const linkStyle = css`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 8px 0;
  font-family: var(--font-grotesk);
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.78);
  transition: color 0.3s var(--ease-snap);

  .bar {
    width: 0;
    height: 1.5px;
    background: var(--accent);
    transition:
      width 0.4s var(--ease-expo),
      margin-right 0.4s var(--ease-expo);
  }

  &:hover {
    color: #fff;

    .bar {
      width: 18px;
      margin-right: 12px;
    }
  }
`;

const FootLink = styled(Link)`
  ${linkStyle}
`;

const FootA = styled.a`
  ${linkStyle}
`;

const Bar = () => <span className="bar" aria-hidden="true" />;

// ─── Wordmark ─────────────────────────────────────────────────────────

const MarkWrap = styled.div`
  padding: 56px 0 28px;

  @media (max-width: 768px) {
    padding: 32px 0 20px;
  }
`;

const Mark = styled(Link)`
  display: block;
  width: 100%;
  font-family: var(--font-display);
  font-size: clamp(5rem, 24.5vw, 27rem);
  font-weight: 800;
  line-height: 0.8;
  letter-spacing: -0.07em;
  white-space: nowrap;
  text-transform: uppercase;
  color: #fff;
  -webkit-text-stroke: 1px transparent;
  transition: color 0.55s var(--ease-snap);

  .dot {
    display: inline-block;
    margin-left: -0.08em;
    color: var(--accent);
    -webkit-text-stroke: 0;
  }

  &:hover {
    color: transparent;
    -webkit-text-stroke: 1.4px rgba(255, 255, 255, 0.85);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// ─── Legal ────────────────────────────────────────────────────────────

const Legal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px 32px;
  padding-top: 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.5);
  flex-wrap: wrap;

  .built {
    color: var(--muted-dark);
  }
`;

const ToTop = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s var(--ease-snap);

  .ico {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.22);
    transition:
      transform 0.45s var(--ease-expo),
      border-color 0.3s var(--ease-snap),
      background 0.3s var(--ease-snap),
      color 0.3s var(--ease-snap);
  }

  &:hover {
    color: #fff;

    .ico {
      transform: translateY(-4px);
      background: var(--accent);
      border-color: var(--accent);
    }
  }
`;

// ──────────────────────────────────────────────────────────────────────

const Footer = () => {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();

  const scrollTop = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });

  return (
    <Shell data-surface="dark" data-nav-theme="dark">
      <Inner>
        <TopBand>
          <Lead>
            <Eyebrow>{t('contact.page.eyebrow')}</Eyebrow>
            <BigEmail href="mailto:sintaradev@gmail.com">
              <span className="addr">sintaradev@gmail.com</span>
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </BigEmail>
            <Pill to="/brief">{t('nav.getStarted')}</Pill>
          </Lead>

          <Right>
            <Status>
              <span className="live">
                <span className="dot" aria-hidden="true" />
                {language === 'ru'
                  ? 'Открыты для заказов'
                  : 'Open for new work'}
              </span>
              <span className="studio">
                {language === 'ru'
                  ? 'Независимая цифровая студия. Работаем по всему миру.'
                  : 'Independent digital studio. Working worldwide.'}
              </span>
            </Status>
          </Right>
        </TopBand>

        <Grid aria-label={t('footer.navigate')}>
          <Col>
            <ColHead>
              <span className="idx">01</span>
              {t('footer.navigate')}
            </ColHead>
            <FootLink to="/">
              <Bar />
              {t('nav.home')}
            </FootLink>
            <FootLink to="/work">
              <Bar />
              {t('nav.work')}
            </FootLink>
            <FootLink to="/services">
              <Bar />
              {t('nav.services')}
            </FootLink>
            <FootLink to="/about">
              <Bar />
              {t('nav.about')}
            </FootLink>
            <FootLink to="/contact">
              <Bar />
              {t('nav.contact')}
            </FootLink>
          </Col>

          <Col>
            <ColHead>
              <span className="idx">02</span>
              {t('footer.services')}
            </ColHead>
            <FootLink to="/services#web">
              <Bar />
              {language === 'ru' ? 'Сайты' : 'Websites'}
            </FootLink>
            <FootLink to="/services#webapp">
              <Bar />
              {language === 'ru' ? 'Веб-приложения' : 'Web apps'}
            </FootLink>
            <FootLink to="/services#bot">
              <Bar />
              {language === 'ru' ? 'Telegram-боты' : 'Telegram bots'}
            </FootLink>
            <FootLink to="/services#crm">
              <Bar />
              {language === 'ru' ? 'CRM / Админки' : 'CRM / Dashboards'}
            </FootLink>
            <FootLink to="/brief">
              <Bar />
              {t('nav.getStarted')}
            </FootLink>
          </Col>

          <Col>
            <ColHead>
              <span className="idx">03</span>
              {t('footer.elsewhere')}
            </ColHead>
            <FootA href="https://t.me/IvanMitska" target="_blank" rel="noreferrer">
              <Bar />
              Telegram
            </FootA>
            <FootA
              href="https://www.instagram.com/sintara_studio/"
              target="_blank"
              rel="noreferrer"
            >
              <Bar />
              Instagram
            </FootA>
            <FootA href="mailto:sintaradev@gmail.com">
              <Bar />
              Email
            </FootA>
          </Col>
        </Grid>
      </Inner>

      <MarkWrap>
        <Mark to="/" aria-label="Sintara — home">
          Sintara<span className="dot">.</span>
        </Mark>
      </MarkWrap>

      <Inner>
        <Legal>
          <span>
            © {year} Sintara — {t('footer.rights')}
          </span>
          <span className="built">
            {language === 'ru'
              ? 'Сделано с упрямой любовью к деталям'
              : 'Built with obsessive attention to detail'}
          </span>
          <ToTop onClick={scrollTop} type="button">
            {language === 'ru' ? 'Наверх' : 'Back to top'}
            <span className="ico" aria-hidden="true">
              ↑
            </span>
          </ToTop>
        </Legal>
      </Inner>
    </Shell>
  );
};

export default Footer;
