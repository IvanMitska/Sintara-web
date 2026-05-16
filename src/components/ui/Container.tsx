import styled from 'styled-components';

/**
 * Editorial container: generous max-width, side padding, optional
 * full-bleed variant for hero-type content that needs edge-to-edge.
 */
const Container = styled.div<{ $bleed?: boolean; $narrow?: boolean }>`
  width: 100%;
  margin: 0 auto;
  padding-left: ${({ $bleed }) => ($bleed ? '0' : '40px')};
  padding-right: ${({ $bleed }) => ($bleed ? '0' : '40px')};
  max-width: ${({ $narrow }) => ($narrow ? '1120px' : '1680px')};

  @media (max-width: 768px) {
    padding-left: ${({ $bleed }) => ($bleed ? '0' : '20px')};
    padding-right: ${({ $bleed }) => ($bleed ? '0' : '20px')};
  }
`;

export default Container;
