import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Reveal from '../../components/ui/Reveal';
import PillLink from '../../components/ui/PillLink';
import { v } from '../../lib/asset';

/**
 * Our products — the home block that introduces Sintara's own SaaS,
 * Sintara Rent CRM. Sits in the light run between FeaturedWork and
 * Capabilities. A two-column layout: editorial pitch on the left, a product
 * mockup image on the right (/public/projects/sintara-rent-crm/mockup.webp).
 *
 * This block is scoped to the rental product, so it overrides the studio's
 * violet `--accent` with the product's own warm amber locally — only this
 * section recolours; the rest of the site keeps the house violet.
 */

const Shell = styled.section`
  /* The rental product block reads monochrome on the home page — the accent
     is ink (black), not the house violet nor the product's amber. Keeps the
     "(02) — Our products" eyebrow, the "Rent" wordmark and the slogan accent
     all black on the light surface. */
  --accent: #0a0a0c;
  --accent-hover: #0a0a0c;
  --accent-bright: #0a0a0c;
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

  /* The custom cursor (Cursor.tsx) uses mix-blend-mode: difference. Without
     its own compositing layer, large text under the cursor gets re-rasterised
     every frame the cursor moves/scales — which reads as a shimmer/jitter on
     this section's display type. Promoting each text block to its own layer
     means the blended cursor composites against a cached raster instead, so
     the text stays rock-steady. (will-change, not transform: framer-motion
     sets an inline transform on the Reveal headings and would override it.) */
  .name,
  .slogan,
  .lead,
  .desc {
    will-change: transform;
    backface-visibility: hidden;
  }

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
  /* neutral dark placeholder — visible until the mockup image loads
     from /public/projects/sintara-rent-crm/mockup.webp (and behind it after).
     Kept monochrome so the block shows no orange before the photo arrives. */
  background: linear-gradient(160deg, #2a2a30 0%, #0a0a0c 100%);
  transition: transform 0.6s var(--ease-expo);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        600px 320px at 100% 0%,
        rgba(255, 255, 255, 0.1),
        transparent 60%
      ),
      radial-gradient(
        500px 300px at 0% 100%,
        rgba(255, 255, 255, 0.06),
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
              Sintara <span className="crm">Rent</span>
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
                  ? 'Собственный SaaS студии — омниканальная CRM для проката авто и мото: парк, аренды, депозиты и онлайн-бронь в одном окне.'
                  : 'The studio’s own SaaS — an omnichannel CRM for car & moto rental: fleet, rentals, deposits and online booking in one window.'}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="desc">
                {isRu
                  ? 'Инбокс TG·WA·IG·FB с AI, аренды с депозитами, финансы по каждой машине, GPS-локации и сайт онлайн-брони. Запуск за пять минут. Рынок — весь мир.'
                  : 'A TG·WA·IG·FB inbox with AI, rentals with deposits, per-car finances, GPS tracking and a booking site. Live in five minutes. Market — global.'}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="ctas">
                <PillLink to="/products/sintara-rent-crm" variant="dark" arrow>
                  {isRu ? 'Посмотреть продукт' : 'See the product'}
                </PillLink>
                <PillLink
                  href="https://sintara-rent-crm.com"
                  variant="ghost"
                  arrow
                >
                  {isRu ? 'Попробовать Sintara Rent' : 'Try Sintara Rent'}
                </PillLink>
              </div>
            </Reveal>
          </Pitch>

          <Reveal delay={0.1}>
            <Card to="/products/sintara-rent-crm" data-cursor="hover">
              {/* Mockup image — the rental dashboard from the product's own
                  hero. Until it loads the warm amber placeholder shows;
                  onError hides a broken-image icon if the file is missing. */}
              <img
                className="mockup"
                src={v('/projects/sintara-rent-crm/mockup.webp')}
                alt={
                  isRu
                    ? 'Sintara Rent CRM — интерфейс'
                    : 'Sintara Rent CRM interface'
                }
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
