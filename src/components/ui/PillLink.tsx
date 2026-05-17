import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

/**
 * Lusion-style pill button — a rounded capsule with a leading dot.
 * Variants: 'light' (white on lavender), 'dark' (ink), 'ghost' (outlined).
 */

type Variant = 'light' | 'dark' | 'ghost';

const base = css`
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
  transition:
    background 0.4s var(--ease-snap),
    color 0.4s var(--ease-snap),
    border-color 0.4s var(--ease-snap),
    transform 0.4s var(--ease-expo);

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex: none;
  }

  .arr {
    transition: transform 0.45s var(--ease-expo);
  }

  &:hover {
    transform: translateY(-2px);
    .arr {
      transform: translateX(5px);
    }
  }
`;

const variants: Record<Variant, ReturnType<typeof css>> = {
  light: css`
    background: #fff;
    color: var(--ink);
    border: 1px solid #fff;
    &:hover {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
  `,
  dark: css`
    background: var(--ink);
    color: #fff;
    border: 1px solid var(--ink);
    &:hover {
      background: var(--accent);
      border-color: var(--accent);
    }
  `,
  ghost: css`
    background: transparent;
    color: currentColor;
    border: 1px solid currentColor;
    &:hover {
      background: currentColor;
      color: var(--ink);
    }
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
      <span>{children}</span>
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
