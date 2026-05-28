import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

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
  transition: transform 0.4s var(--ease-expo);

  /* The pill lifts on hover (translateY). Without a buffer, the pointer
     can fall just outside the moved box at the edge, rapidly toggling
     hover and making the button jitter. Extend the hit area vertically
     (not horizontally — adjacent pills sit only 14px apart) so the lift
     never drops the hover. */
  &::after {
    content: '';
    position: absolute;
    inset: -8px 0;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex: none;
    transition: transform 0.5s var(--ease-expo);
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
    transition: transform 0.55s var(--ease-expo);
  }
  .label-line--ghost {
    position: absolute;
    top: 100%;
    left: 0;
    white-space: nowrap;
  }

  .arr {
    transition: transform 0.45s var(--ease-expo);
  }

  &:hover {
    transform: translateY(-2px);
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
