import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const glitch = keyframes`
  0%, 100% {
    text-shadow: -2px 0 #7c3aed, 2px 0 #ef4444;
  }
  25% {
    text-shadow: 2px 0 #7c3aed, -2px 0 #ef4444;
  }
  50% {
    text-shadow: -2px -2px #7c3aed, 2px 2px #ef4444;
  }
  75% {
    text-shadow: 2px -2px #7c3aed, -2px 2px #ef4444;
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const ErrorContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #050208 0%, #0a0512 50%, #050208 100%);
  padding: 40px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 70% 80%, rgba(239, 68, 68, 0.08) 0%, transparent 40%);
    pointer-events: none;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 500px;
`;

const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 32px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s ease-in-out infinite;

  svg {
    font-size: 40px;
    color: #ef4444;
  }
`;

const ErrorCode = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: clamp(4rem, 15vw, 7rem);
  font-weight: 900;
  color: transparent;
  background: linear-gradient(135deg, #ef4444 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  background-clip: text;
  line-height: 1;
  margin-bottom: 16px;
  animation: ${glitch} 3s infinite;
`;

const ErrorTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px;
`;

const ErrorMessage = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin: 0 0 32px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
    }
  ` : `
    background: rgba(255, 255, 255, 0.03);
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(124, 58, 237, 0.1);
      border-color: rgba(124, 58, 237, 0.3);
      color: white;
      transform: translateY(-2px);
    }
  `}

  svg {
    font-size: 16px;
  }
`;

const ErrorDetails = styled.details`
  margin-top: 32px;
  text-align: left;
  width: 100%;
`;

const ErrorSummary = styled.summary`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 8px 0;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const ErrorStack = styled.pre`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin-top: 8px;
  max-height: 150px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(124, 58, 237, 0.3);
    border-radius: 3px;
  }
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <Content>
            <IconWrapper>
              <FaExclamationTriangle />
            </IconWrapper>
            <ErrorCode>Oops!</ErrorCode>
            <ErrorTitle>Something went wrong</ErrorTitle>
            <ErrorMessage>
              An error occurred while loading the component.
              Try refreshing the page or click retry.
            </ErrorMessage>
            <ButtonGroup>
              <Button $primary onClick={this.handleRetry}>
                <FaRedo /> Try again
              </Button>
              <Button onClick={this.handleGoHome}>
                <FaHome /> Go home
              </Button>
            </ButtonGroup>
            {this.state.error && (
              <ErrorDetails>
                <ErrorSummary>Technical details</ErrorSummary>
                <ErrorStack>{this.state.error.stack}</ErrorStack>
              </ErrorDetails>
            )}
          </Content>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
