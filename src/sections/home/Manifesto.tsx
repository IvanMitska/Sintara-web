import { useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Manifesto — a single oversized paragraph whose words ignite from muted
 * to ink as the section scrolls through the viewport.
 */

const Shell = styled.section`
  position: relative;
  z-index: 1;
  background: transparent;
  color: var(--ink);
  /* Asymmetric vertical padding — keep generous breathing room at the
     top (this is where the section first enters the viewport), but
     tighten the bottom so the Statement section's CTA button below
     doesn't feel like it's floating in dead space. */
  padding: clamp(64px, 10vh, 132px) clamp(20px, 5vw, 80px)
    clamp(32px, 5vh, 64px);
`;

const Inner = styled.div`
  max-width: 1340px;
  margin: 0 auto;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: clamp(28px, 5vh, 56px);
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

const Para = styled.p`
  font-family: var(--font-display);
  /* Light, open grotesque — matches Lusion's editorial headings, not a
     heavy black display weight. */
  font-weight: 400;
  font-size: clamp(1.75rem, 4.6vw, 4.5rem);
  line-height: 1.18;
  letter-spacing: -0.02em;
`;

const Word = styled(motion.span)`
  display: inline-block;
  margin-right: 0.26em;
  white-space: pre;
`;

const AnimatedWord = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const color = useTransform(progress, range, [
    '#9A9AA8',
    children.includes('—') ? '#8B5CF6' : '#0A0A0C',
  ]);
  return <Word style={{ opacity, color }}>{children}</Word>;
};

const Manifesto = () => {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isRu = language === 'ru';

  // Reveal tracks the reading zone: words ignite as the paragraph crosses
  // the upper-middle of the viewport and finish well before it scrolls off,
  // so the text never lags behind the scroll.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.7'],
  });

  const text = isRu
    ? 'Sintara — независимая цифровая студия. Мы проектируем и создаём сайты, веб-приложения и Telegram-ботов — продукты, которые выглядят остро, двигаются красиво и выходят в срок.'
    : 'Sintara is an independent digital studio. We design and build websites, web apps and Telegram bots — products that feel sharp, move beautifully and ship on time.';
  const words = text.split(' ');

  return (
    <Shell data-nav-theme="light">
      <Inner ref={ref}>
        <Eyebrow>{isRu ? '(01) — Студия' : '(01) — The studio'}</Eyebrow>
        <Para>
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <AnimatedWord
                key={`${word}-${i}`}
                progress={scrollYProgress}
                range={[start, end]}
              >
                {word}
              </AnimatedWord>
            );
          })}
        </Para>
      </Inner>
    </Shell>
  );
};

export default Manifesto;
