import styled, { css } from 'styled-components';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'solid' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ComponentPropsWithoutRef<'a'> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  as?: 'a' | 'button';
}

const base = css<{ $size: Size; $variant: Variant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-weight: 500;
  letter-spacing: -0.01em;
  text-decoration: none;
  border-radius: 9999px;
  cursor: pointer;
  user-select: none;
  position: relative;
  white-space: nowrap;
  transition:
    background 0.3s var(--ease-snap),
    color 0.3s var(--ease-snap),
    border-color 0.3s var(--ease-snap),
    transform 0.3s var(--ease-snap);
  will-change: transform;

  ${({ $size }) =>
    $size === 'sm' &&
    css`
      padding: 10px 20px;
      font-size: 0.875rem;
    `}
  ${({ $size }) =>
    $size === 'md' &&
    css`
      padding: 16px 32px;
      font-size: 1rem;
    `}
  ${({ $size }) =>
    $size === 'lg' &&
    css`
      padding: 22px 44px;
      font-size: 1.0625rem;
      @media (max-width: 768px) {
        padding: 18px 32px;
        font-size: 1rem;
      }
    `}

  ${({ $variant }) =>
    $variant === 'solid' &&
    css`
      background: var(--ink);
      color: var(--bone);
      border: 1px solid var(--ink);

      &:hover {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--bone);
      }

      [data-surface='dark'] & {
        background: var(--bone);
        color: var(--ink);
        border-color: var(--bone);

        &:hover {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--bone);
        }
      }
    `}

  ${({ $variant }) =>
    $variant === 'outline' &&
    css`
      background: transparent;
      color: var(--ink);
      border: 1px solid var(--ink);

      &:hover {
        background: var(--ink);
        color: var(--bone);
      }

      [data-surface='dark'] & {
        color: var(--bone);
        border-color: var(--bone);
        &:hover {
          background: var(--bone);
          color: var(--ink);
        }
      }
    `}

  ${({ $variant }) =>
    $variant === 'ghost' &&
    css`
      background: transparent;
      color: var(--ink);
      border: 1px solid transparent;
      padding-left: 0;
      padding-right: 0;
      border-radius: 0;
      border-bottom: 1px solid currentColor;

      &:hover {
        color: var(--accent);
      }
    `}

  &:active {
    transform: scale(0.98);
  }
`;

const StyledButton = styled.button<{ $size: Size; $variant: Variant }>`
  ${base}
`;

const StyledAnchor = styled.a<{ $size: Size; $variant: Variant }>`
  ${base}
`;

const Button = ({
  variant = 'solid',
  size = 'md',
  children,
  as = 'a',
  ...rest
}: ButtonProps) => {
  if (as === 'button') {
    return (
      <StyledButton
        $size={size}
        $variant={variant}
        {...(rest as ComponentPropsWithoutRef<'button'>)}
      >
        {children}
      </StyledButton>
    );
  }
  return (
    <StyledAnchor $size={size} $variant={variant} {...rest}>
      {children}
    </StyledAnchor>
  );
};

export default Button;
