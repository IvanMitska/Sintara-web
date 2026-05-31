import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  /**
   * What to render when a child throws. Pass `null` to silently hide the
   * subtree (e.g. an optional 3D layer) — this is honoured as an explicit
   * choice, distinct from not passing a fallback at all (which shows the
   * branded full-screen error below).
   */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const Shell = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
  color: #fff;
  background: #08060f;
  background-image: radial-gradient(
    760px 480px at 50% -2%,
    rgba(124, 58, 237, 0.22),
    transparent 62%
  );
  font-family: var(--font-grotesk, system-ui, sans-serif);
`;

const Inner = styled.div`
  max-width: 460px;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent-bright, #a78bfa);
  margin-bottom: 22px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-bright, #a78bfa);
  }
`;

const Title = styled.h1`
  font-family: var(--font-display, system-ui, sans-serif);
  font-weight: 600;
  font-size: clamp(2rem, 7vw, 3rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0 0 14px;
`;

const Msg = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 32px;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Btn = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 50px;
  padding: 0 26px;
  border-radius: 999px;
  font-family: var(--font-grotesk, system-ui, sans-serif);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s ease,
    border-color 0.3s ease;

  ${({ $primary }) =>
    $primary
      ? `
    background: var(--accent, #7c3aed);
    color: #fff;
    border: 1px solid var(--accent, #7c3aed);
  `
      : `
    background: transparent;
    color: rgba(255,255,255,0.85);
    border: 1px solid rgba(255,255,255,0.22);
  `}

  &:hover {
    transform: translateY(-2px);
    ${({ $primary }) =>
      $primary
        ? 'background: var(--accent-bright, #a78bfa); border-color: var(--accent-bright, #a78bfa);'
        : 'border-color: rgba(255,255,255,0.5);'}
  }
`;

const Details = styled.details`
  margin-top: 30px;
  text-align: left;

  summary {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
    cursor: pointer;
  }

  pre {
    margin-top: 10px;
    font-family: var(--font-mono, 'JetBrains Mono', monospace);
    font-size: 0.7rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.4);
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    padding: 14px;
    max-height: 160px;
    overflow: auto;
  }
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => this.setState({ hasError: false, error: undefined });

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (!this.state.hasError) return this.props.children;

    // An explicit fallback (including `null`) is honoured — used to hide
    // optional subtrees like the 3D footer instead of breaking the page.
    if (this.props.fallback !== undefined) return this.props.fallback;

    return (
      <Shell role="alert">
        <Inner>
          <Eyebrow>Sintara</Eyebrow>
          <Title>Something went wrong</Title>
          <Msg>
            A part of the page didn’t load as expected. Try again, or head back
            to the homepage.
          </Msg>
          <Row>
            <Btn $primary onClick={this.handleRetry}>
              Try again
            </Btn>
            <Btn onClick={this.handleGoHome}>Go home</Btn>
          </Row>
          {import.meta.env.DEV && this.state.error && (
            <Details>
              <summary>Technical details</summary>
              <pre>{this.state.error.stack}</pre>
            </Details>
          )}
        </Inner>
      </Shell>
    );
  }
}

export default ErrorBoundary;
