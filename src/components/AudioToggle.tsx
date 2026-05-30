import styled, { keyframes, css } from 'styled-components';
import { useAmbientAudio } from './audio/AmbientAudio';

/**
 * Lusion-style audio toggle — a circular button with an equalizer glyph
 * that animates while the ambient soundscape plays.
 */

type NavTheme = 'light' | 'dark';

const bounce = keyframes`
  0%, 100% { transform: scaleY(0.28); }
  50%      { transform: scaleY(1); }
`;

const Btn = styled.button<{ $theme: NavTheme; $playing: boolean }>`
  position: relative;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 1px solid
    ${({ $theme }) =>
      $theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(10,10,12,0.14)'};
  background: ${({ $theme }) =>
    $theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)'};
  backdrop-filter: blur(10px);
  color: ${({ $theme }) => ($theme === 'dark' ? '#fff' : 'var(--ink)')};
  transition:
    background 0.4s var(--ease-snap),
    border-color 0.4s var(--ease-snap),
    color 0.4s var(--ease-snap);

  &:hover {
    border-color: ${({ $theme }) =>
      $theme === 'dark' ? '#fff' : 'var(--ink)'};
  }

  span {
    display: block;
    width: 2.5px;
    height: 15px;
    border-radius: 2px;
    background: currentColor;
    transform-origin: center;
    transform: scaleY(0.28);

    ${({ $playing }) =>
      $playing &&
      css`
        animation: ${bounce} 0.9s ease-in-out infinite;
      `}
  }

  span:nth-child(1) { animation-delay: -0.1s; }
  span:nth-child(2) { animation-delay: -0.55s; }
  span:nth-child(3) { animation-delay: -0.3s; }
  span:nth-child(4) { animation-delay: -0.7s; }

  ${({ $playing }) =>
    $playing &&
    css`
      span { transform: scaleY(1); }
    `}

  @media (prefers-reduced-motion: reduce) {
    span { animation: none; }
  }
`;

const AudioToggle = ({ theme }: { theme: NavTheme }) => {
  const { playing, toggle } = useAmbientAudio();
  return (
    <Btn
      $theme={theme}
      $playing={playing}
      onClick={toggle}
      data-audio-toggle="true"
      aria-pressed={playing}
      aria-label={playing ? 'Mute ambient sound' : 'Play ambient sound'}
      title={playing ? 'Sound on' : 'Sound off'}
    >
      <span />
      <span />
      <span />
      <span />
    </Btn>
  );
};

export default AudioToggle;
