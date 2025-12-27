import React from 'react';
import styled, { keyframes } from 'styled-components';

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0) rotateX(10deg) rotateY(5deg);
  }
  50% {
    transform: translateY(-15px) rotateX(10deg) rotateY(5deg);
  }
`;

const MacBookWrapper = styled.div<{ $animate?: boolean }>`
  perspective: 2000px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MacBookDevice = styled.div<{ $animate?: boolean }>`
  position: relative;
  transform-style: preserve-3d;
  animation: ${props => props.$animate ? floatAnimation : 'none'} 5s ease-in-out infinite;
  transform: rotateX(10deg) rotateY(5deg);
`;

const Screen = styled.div`
  position: relative;
  width: 600px;
  height: 380px;
  background: linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 50%, #1c1c1e 100%);
  border-radius: 16px 16px 0 0;
  padding: 16px 16px 24px;
  box-shadow:
    inset 0 0 0 2px #3a3a3c,
    0 -2px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: 1024px) {
    width: 500px;
    height: 320px;
    padding: 12px 12px 20px;
  }

  @media (max-width: 768px) {
    width: 340px;
    height: 220px;
    padding: 8px 8px 16px;
    border-radius: 12px 12px 0 0;
  }
`;

const ScreenInner = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    border-radius: 6px;
  }
`;

const Camera = styled.div`
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #1a3a5c 0%, #0a1a2c 40%, #000 70%);
  border-radius: 50%;
  z-index: 10;
  box-shadow:
    inset 0 0 2px rgba(0, 100, 255, 0.3),
    0 0 2px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
    top: 4px;
  }
`;

const ScreenContent = styled.div`
  width: 100%;
  height: 100%;
  background: #1c1c1e;
  overflow: hidden;
`;

const ScreenImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
`;

const MenuBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  height: 24px;
  background: rgba(28, 28, 30, 0.9);
  backdrop-filter: blur(20px);
  font-size: 12px;
  color: white;
  font-weight: 500;

  @media (max-width: 768px) {
    height: 18px;
    font-size: 10px;
    padding: 0 8px;
  }
`;

const MenuLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const AppleLogo = styled.span`
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const MenuRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const Base = styled.div`
  position: relative;
  width: 680px;
  height: 14px;
  background: linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 50%, #1c1c1e 100%);
  border-radius: 0 0 14px 14px;
  transform: perspective(500px) rotateX(-5deg);
  transform-origin: top center;

  /* Notch */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 4px;
    background: linear-gradient(180deg, #2c2c2e 0%, #3a3a3c 100%);
    border-radius: 0 0 6px 6px;
  }

  @media (max-width: 1024px) {
    width: 570px;
    height: 12px;

    &::before {
      width: 150px;
    }
  }

  @media (max-width: 768px) {
    width: 390px;
    height: 10px;
    border-radius: 0 0 10px 10px;

    &::before {
      width: 100px;
      height: 3px;
    }
  }
`;

const BottomBase = styled.div`
  width: 780px;
  height: 8px;
  background: linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 100%);
  border-radius: 0 0 8px 8px;
  margin: 0 auto;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.4),
    0 10px 40px rgba(0, 0, 0, 0.3);

  @media (max-width: 1024px) {
    width: 660px;
  }

  @media (max-width: 768px) {
    width: 450px;
    height: 6px;
  }
`;

const Reflection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  z-index: 20;
  border-radius: 8px 8px 0 0;
`;

const BrowserWindow = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BrowserToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #2c2c2e;
  border-bottom: 1px solid #3a3a3c;

  @media (max-width: 768px) {
    padding: 6px 8px;
    gap: 8px;
  }
`;

const TrafficLights = styled.div`
  display: flex;
  gap: 6px;

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const TrafficLight = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: inset 0 -1px 2px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
  }
`;

const AddressBar = styled.div`
  flex: 1;
  height: 26px;
  background: #1c1c1e;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  font-size: 12px;
  color: #86868b;

  @media (max-width: 768px) {
    height: 20px;
    font-size: 9px;
    padding: 0 8px;
  }
`;

const BrowserContent = styled.div`
  flex: 1;
  overflow: hidden;
`;

interface MacBookMockupProps {
  screenImage?: string;
  animate?: boolean;
  showBrowser?: boolean;
  websiteUrl?: string;
  className?: string;
}

const MacBookMockup: React.FC<MacBookMockupProps> = ({
  screenImage,
  animate = true,
  showBrowser = true,
  websiteUrl = 'sv-mitska.com',
  className,
}) => {
  return (
    <MacBookWrapper $animate={animate} className={className}>
      <MacBookDevice $animate={animate}>
        <Screen>
          <Camera />
          <ScreenInner>
            <MenuBar>
              <MenuLeft>
                <AppleLogo></AppleLogo>
                <span>Finder</span>
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
              </MenuLeft>
              <MenuRight>
                <span>🔋 100%</span>
                <span>Wi-Fi</span>
                <span>Mon 9:41</span>
              </MenuRight>
            </MenuBar>
            <ScreenContent>
              {showBrowser ? (
                <BrowserWindow>
                  <BrowserToolbar>
                    <TrafficLights>
                      <TrafficLight color="#ff5f57" />
                      <TrafficLight color="#febc2e" />
                      <TrafficLight color="#28c840" />
                    </TrafficLights>
                    <AddressBar>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="#86868b" style={{ marginRight: '6px' }}>
                        <path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v1A1.5 1.5 0 0 0 1 7v3.5A1.5 1.5 0 0 0 2.5 12h7a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5v-1A3.5 3.5 0 0 0 6 1zm2.5 4.5v-1a2.5 2.5 0 0 0-5 0v1h5z"/>
                      </svg>
                      {websiteUrl}
                    </AddressBar>
                  </BrowserToolbar>
                  <BrowserContent>
                    {screenImage ? (
                      <ScreenImage src={screenImage} alt="Website screenshot" />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: '600'
                      }}>
                        Your Website Here
                      </div>
                    )}
                  </BrowserContent>
                </BrowserWindow>
              ) : (
                screenImage ? (
                  <ScreenImage src={screenImage} alt="Screen content" />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '600'
                  }}>
                    Your Content Here
                  </div>
                )
              )}
            </ScreenContent>
            <Reflection />
          </ScreenInner>
        </Screen>
        <Base />
        <BottomBase />
      </MacBookDevice>
    </MacBookWrapper>
  );
};

export default MacBookMockup;
