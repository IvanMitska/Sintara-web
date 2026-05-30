import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Reveal from '../../components/ui/Reveal';
import PillLink from '../../components/ui/PillLink';
import { v } from '../../lib/asset';

/**
 * Our products — the home block that introduces Sintara's flagship SaaS,
 * Sintara CRM. Sits in the light run between FeaturedWork and Capabilities.
 * A two-column layout: editorial pitch on the left, a product mockup image
 * on the right (drop the file at /public/projects/sintara-crm/mockup.webp;
 * a brand-violet placeholder gradient shows until it's there).
 */

const Shell = styled.section`
  position: relative;
  z-index: 1;
  background: transparent;
  color: var(--ink);
  padding: clamp(80px, 11vh, 150px) clamp(20px, 5vw, 80px)
    clamp(90px, 13vh, 170px);
`;

const Inner = styled.div`
  max-width: 1500px;
  margin: 0 auto;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: clamp(28px, 5vh, 56px);
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);

  &::before {
    content: '';
    width: 36px;
    height: 1px;
    background: var(--accent);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: clamp(40px, 5vw, 90px);
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const Pitch = styled.div`
  display: flex;
  flex-direction: column;

  .name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: clamp(2.75rem, 7.5vw, 7rem);
    line-height: 0.92;
    letter-spacing: -0.035em;
    color: var(--ink);

    .crm {
      color: var(--accent);
    }
  }

  .slogan {
    margin-top: clamp(18px, 2.8vh, 32px);
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.5rem, 2.6vw, 2.5rem);
    line-height: 1.12;
    letter-spacing: -0.02em;
    color: var(--ink);
    max-width: 18em;

    .accent {
      color: var(--accent);
    }
  }

  .lead {
    margin-top: clamp(24px, 4vh, 40px);
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.25rem, 2vw, 1.75rem);
    line-height: 1.28;
    letter-spacing: -0.015em;
    color: var(--ink);
    max-width: 22em;
  }

  .desc {
    margin-top: clamp(20px, 3vh, 32px);
    font-family: var(--font-grotesk);
    font-size: 1rem;
    line-height: 1.6;
    color: var(--muted);
    max-width: 44ch;
  }

  .ctas {
    margin-top: auto;
    padding-top: clamp(32px, 5vh, 56px);
    display: flex;
    gap: 14px;
    flex-wrap: wrap;

    /* Mobile (single-column layout): full-width stacked CTAs so they read as
       deliberate buttons instead of narrow pills floating in the column. The
       label sits left, the arrow pins to the right edge. Desktop's two-column
       inline pills are unchanged. Matches the Grid's 900px collapse. */
    @media (max-width: 900px) {
      flex-direction: column;
      align-items: stretch;
      flex-wrap: nowrap;
      gap: 12px;
      padding-top: clamp(24px, 4vh, 36px);

      /* Full-width, but content centred (label + arrow as one group) so the
         button reads as a solid CTA — space-between left a cheap-looking void
         in the middle with these short labels. */
      a {
        width: 100%;
        justify-content: center;
        gap: 14px;
      }
    }
  }
`;

const Card = styled(Link)`
  position: relative;
  display: block;
  height: 100%;
  min-height: clamp(460px, 60vh, 620px);
  border-radius: 22px;
  overflow: hidden;
  isolation: isolate;
  /* brand-violet placeholder — visible until the mockup image is dropped
     into /public/projects/sintara-crm/mockup.webp (and behind it after) */
  background: linear-gradient(160deg, #3a1d8a 0%, #0a0a0c 100%);
  transition: transform 0.6s var(--ease-expo);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        600px 320px at 100% 0%,
        rgba(126, 212, 220, 0.28),
        transparent 60%
      ),
      radial-gradient(
        500px 300px at 0% 100%,
        rgba(139, 92, 246, 0.5),
        transparent 60%
      );
    z-index: 0;
  }

  /* the product mockup fills the card; object-fit cover keeps it crisp */
  .mockup {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;

    /* The portrait mobile card crops the landscape mockup on the sides. Centred,
       the monitor's left edge ran off the card. object-position below 50% shows
       more of the image's left side, shifting the device rightward into frame. */
    @media (max-width: 900px) {
      object-position: 42% center;
    }
  }

  &:hover {
    transform: translateY(-6px);
  }

  .arrow {
    position: absolute;
    top: clamp(28px, 4vw, 44px);
    right: clamp(28px, 4vw, 44px);
    z-index: 2;
    width: 44px;
    height: 44px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.22);
    backdrop-filter: blur(6px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    color: #fff;
    transition:
      transform 0.5s var(--ease-expo),
      background 0.4s var(--ease-snap);

    /* Touch — drop the per-frame blur, lift the matte fill a touch so
       the chip stays legible over the product mockup. */
    @media (pointer: coarse) {
      backdrop-filter: none;
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &:hover .arrow {
    transform: translate(4px, -4px);
    background: var(--accent);
    color: #fff;
  }
`;

const Products = () => {
  const { language } = useLanguage();
  const isRu = language === 'ru';

  return (
    <Shell data-nav-theme="light">
      <Inner>
        <Eyebrow>
          {isRu ? '(02) — Наши продукты' : '(02) — Our products'}
        </Eyebrow>

        <Grid>
          <Pitch>
            <Reveal as="h2" className="name">
              Sintara <span className="crm">CRM</span>
            </Reveal>
            <Reveal as="p" className="slogan" delay={0.05}>
              {isRu ? (
                <>
                  Мы не только&nbsp;делаем —{' '}
                  <span className="accent">мы строим&nbsp;собственное.</span>
                </>
              ) : (
                <>
                  We don’t just&nbsp;ship —{' '}
                  <span className="accent">we build our&nbsp;own.</span>
                </>
              )}
            </Reveal>
            <Reveal delay={0.06}>
              <p className="lead">
                {isRu
                  ? 'Флагманский SaaS студии — омниканальная CRM с интерфейсом и скоростью Linear, для малого и среднего бизнеса.'
                  : 'The studio’s flagship SaaS — an omnichannel CRM with the feel and speed of Linear, built for small and mid-sized teams.'}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="desc">
                {isRu
                  ? 'Инбокс, воронка, no-code Automation Studio с AI-шагами и онлайн-запись из коробки. Релизы каждые две недели. Рынок — Азия.'
                  : 'An inbox, a sales pipeline, a no-code Automation Studio with AI steps, and online booking out of the box. New releases every two weeks. Market — Asia.'}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="ctas">
                <PillLink to="/products/sintara-crm" variant="dark" arrow>
                  {isRu ? 'Посмотреть продукт' : 'See the product'}
                </PillLink>
                <PillLink
                  href="https://www.sintara-crm.com"
                  variant="ghost"
                  arrow
                >
                  {isRu ? 'Попробовать Sintara CRM' : 'Try Sintara CRM'}
                </PillLink>
              </div>
            </Reveal>
          </Pitch>

          <Reveal delay={0.1}>
            <Card to="/products/sintara-crm" data-cursor="hover">
              {/* Mockup image — drop the file at the path below. Until then
                  the violet placeholder gradient shows; onError hides a
                  broken-image icon if the file isn't there yet. */}
              <img
                className="mockup"
                src={v('/projects/sintara-crm/mockup.webp')}
                alt={isRu ? 'Sintara CRM — интерфейс' : 'Sintara CRM interface'}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="arrow" aria-hidden>
                ↗
              </span>
            </Card>
          </Reveal>
        </Grid>
      </Inner>
    </Shell>
  );
};

export default Products;
