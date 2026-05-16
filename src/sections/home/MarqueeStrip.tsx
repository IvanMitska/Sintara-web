import styled from 'styled-components';
import Marquee from '../../components/ui/Marquee';
import { useLanguage } from '../../context/LanguageContext';

const Shell = styled.section`
  padding: 40px 0;
  background: var(--ink);
  color: #fff;
  overflow: hidden;
`;

const Item = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 56px;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 6rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  padding-right: 56px;
  text-transform: uppercase;

  &::after {
    content: '';
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }
`;

const MarqueeStrip = () => {
  const { t } = useLanguage();
  const items = [
    t('home.marquee.1'),
    t('home.marquee.2'),
    t('home.marquee.3'),
    t('home.marquee.4'),
    t('home.marquee.5'),
    t('home.marquee.6'),
  ];

  return (
    <Shell data-surface="dark" data-nav-theme="dark">
      <Marquee duration={55}>
        {items.map((text) => (
          <Item key={text}>{text}</Item>
        ))}
      </Marquee>
    </Shell>
  );
};

export default MarqueeStrip;
