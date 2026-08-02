import { Link } from './Link';
import styled, { css } from 'styled-components';
import useMagnetic from '../../hooks/useMagnetic';

/**
 * Lusion-style pill button — a rounded capsule with a leading dot.
 * Variants: 'light' (white on lavender), 'dark' (ink), 'ghost' (outlined).
 */

type Variant = 'light' | 'dark' | 'ghost';

const base = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 11px;
  height: 52px;
  padding: 0 28px;
  border-radius: 999px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  white-space: nowrap;

  /* A comfortable, stable hit area. The pill deliberately does NOT lift on
     hover — a transform moves the element's hit box, so the pointer fell just
     outside it at the bottom edge and rapidly toggled hover, making the button
     (and its text roll) jitter. With no lift the hover stays rock-steady.

     The magnetic pull below is a different case and safe: it moves the pill
     *toward* the pointer, which can only deepen the overlap, never break it —
     the opposite of a lift, which retreats from the cursor. The taller hit
     area covers the pull's few px of travel on the way in. */
  &::after {
    content: '';
    position: absolute;
    inset: -12px -6px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex: none;
    transition: transform 0.5s var(--ease-snap);
  }

  .label {
    position: relative;
    display: inline-block;
    overflow: hidden;
    line-height: 1.2;
  }
  .label-line {
    display: block;
    will-change: transform;
    transition: transform 0.5s var(--ease-snap);
  }
  .label-line--ghost {
    position: absolute;
    top: 100%;
    left: 0;
    white-space: nowrap;
  }

  .arr {
    transition: transform 0.45s var(--ease-snap);
  }

  &:hover {
    .label-line {
      transform: translateY(-100%);
    }
    .dot {
      transform: scale(1.6);
    }
    .arr {
      transform: translateX(5px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    .label-line,
    .dot,
    .arr {
      transition: none;
    }
  }
`;

const variants: Record<Variant, ReturnType<typeof css>> = {
  light: css`
    background: #fff;
    color: var(--ink);
    border: 1px solid #fff;
  `,
  dark: css`
    background: var(--ink);
    color: #fff;
    border: 1px solid var(--ink);
  `,
  ghost: css`
    background: transparent;
    color: currentColor;
    border: 1px solid currentColor;
  `,
};

const StyledLink = styled(Link)<{ $variant: Variant }>`
  ${base}
  ${({ $variant }) => variants[$variant]}
`;

const StyledA = styled.a<{ $variant: Variant }>`
  ${base}
  ${({ $variant }) => variants[$variant]}
`;

interface PillLinkProps {
  to?: string;
  href?: string;
  variant?: Variant;
  children: React.ReactNode;
  arrow?: boolean;
  className?: string;
}

const PillLink = ({
  to,
  href,
  variant = 'light',
  children,
  arrow = false,
  className,
}: PillLinkProps) => {
  // The label trails the capsule slightly, so the type appears to settle a
  // beat after the shape — the button reads as having weight rather than
  // being a rectangle that slides.
  const magnetRef = useMagnetic<HTMLAnchorElement>({
    strength: 0.24,
    radius: 80,
    childSelector: '.label',
    childStrength: -0.35,
  });

  const inner = (
    <>
      {!arrow && <span className="dot" aria-hidden />}
      <span className="label">
        <span className="label-line">{children}</span>
        <span className="label-line label-line--ghost" aria-hidden>
          {children}
        </span>
      </span>
      {arrow && (
        <span className="arr" aria-hidden>
          →
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <StyledA
        ref={magnetRef}
        href={href}
        $variant={variant}
        className={className}
        data-cursor="hover"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {inner}
      </StyledA>
    );
  }

  return (
    <StyledLink
      ref={magnetRef}
      to={to ?? '#'}
      $variant={variant}
      className={className}
      data-cursor="hover"
    >
      {inner}
    </StyledLink>
  );
};

export default PillLink;
