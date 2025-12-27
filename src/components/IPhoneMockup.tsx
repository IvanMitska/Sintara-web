import React from 'react';
import styled, { keyframes } from 'styled-components';

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0) rotateY(-5deg) rotateX(5deg);
  }
  50% {
    transform: translateY(-10px) rotateY(-5deg) rotateX(5deg);
  }
`;

const IPhoneWrapper = styled.div<{ $animate?: boolean }>`
  perspective: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IPhoneDevice = styled.div<{ $animate?: boolean }>`
  position: relative;
  width: 280px;
  height: 570px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  border-radius: 50px;
  padding: 12px;
  box-shadow:
    0 0 0 2px #3a3a3a,
    0 0 0 4px #1a1a1a,
    inset 0 0 2px rgba(255, 255, 255, 0.1),
    0 30px 60px rgba(0, 0, 0, 0.5),
    0 10px 20px rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
  animation: ${props => props.$animate ? floatAnimation : 'none'} 4s ease-in-out infinite;
  transform: rotateY(-5deg) rotateX(5deg);

  /* Side buttons */
  &::before {
    content: '';
    position: absolute;
    left: -3px;
    top: 120px;
    width: 3px;
    height: 30px;
    background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #3a3a3a 100%);
    border-radius: 2px 0 0 2px;
  }

  &::after {
    content: '';
    position: absolute;
    left: -3px;
    top: 170px;
    width: 3px;
    height: 60px;
    background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #3a3a3a 100%);
    border-radius: 2px 0 0 2px;
  }

  @media (max-width: 768px) {
    width: 220px;
    height: 450px;
    border-radius: 40px;
    padding: 10px;
  }
`;

const PowerButton = styled.div`
  position: absolute;
  right: -3px;
  top: 150px;
  width: 3px;
  height: 80px;
  background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #3a3a3a 100%);
  border-radius: 0 2px 2px 0;
`;

const Screen = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 40px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    border-radius: 32px;
  }
`;

const DynamicIsland = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 35px;
  background: #000;
  border-radius: 20px;
  z-index: 10;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);

  /* Camera lens */
  &::before {
    content: '';
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: radial-gradient(circle, #1a3a5c 0%, #0a1a2c 40%, #000 70%);
    border-radius: 50%;
    box-shadow: inset 0 0 3px rgba(0, 100, 255, 0.3);
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 28px;
    top: 10px;
  }
`;

const ScreenContent = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
  position: relative;
`;

const ScreenImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
`;

const StatusBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 28px 0;
  color: white;
  font-size: 14px;
  font-weight: 600;
  z-index: 5;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 14px 24px 0;
  }
`;

const Time = styled.span`
  font-weight: 600;
`;

const StatusIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
`;

const HomeIndicator = styled.div`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 130px;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  z-index: 10;

  @media (max-width: 768px) {
    width: 100px;
    height: 4px;
    bottom: 6px;
  }
`;

const Reflection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  z-index: 20;
  border-radius: 40px 40px 0 0;
`;

interface IPhoneMockupProps {
  screenImage?: string;
  animate?: boolean;
  showStatusBar?: boolean;
  className?: string;
}

const IPhoneMockup: React.FC<IPhoneMockupProps> = ({
  screenImage,
  animate = true,
  showStatusBar = true,
  className,
}) => {
  return (
    <IPhoneWrapper $animate={animate} className={className}>
      <IPhoneDevice $animate={animate}>
        <PowerButton />
        <Screen>
          <DynamicIsland />
          {showStatusBar && (
            <StatusBar>
              <Time>9:41</Time>
              <StatusIcons>
                <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
                  <path d="M1.5 4.5C1.5 3.67157 2.17157 3 3 3H4.5C5.32843 3 6 3.67157 6 4.5V10.5C6 11.3284 5.32843 12 4.5 12H3C2.17157 12 1.5 11.3284 1.5 10.5V4.5Z" fillOpacity="0.4"/>
                  <path d="M6.5 3C6.5 2.17157 7.17157 1.5 8 1.5H9.5C10.3284 1.5 11 2.17157 11 3V10.5C11 11.3284 10.3284 12 9.5 12H8C7.17157 12 6.5 11.3284 6.5 10.5V3Z" fillOpacity="0.4"/>
                  <path d="M11.5 1.5C11.5 0.671573 12.1716 0 13 0H14.5C15.3284 0 16 0.671573 16 1.5V10.5C16 11.3284 15.3284 12 14.5 12H13C12.1716 12 11.5 11.3284 11.5 10.5V1.5Z"/>
                </svg>
                <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
                  <path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.5C5.01472 2.5 2.72426 3.57906 1.14437 5.33893C0.875716 5.64329 0.418695 5.67097 0.114335 5.40232C-0.190024 5.13367 -0.217703 4.67665 0.0509467 4.37229C1.89502 2.30217 4.56235 1 7.5 1C10.4376 1 13.105 2.30217 14.9491 4.37229C15.2177 4.67665 15.19 5.13367 14.8857 5.40232C14.5813 5.67097 14.1243 5.64329 13.8556 5.33893C12.2757 3.57906 9.98528 2.5 7.5 2.5Z"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M7.5 5.5C5.98134 5.5 4.6245 6.17946 3.68118 7.26188C3.40199 7.55646 2.94449 7.56747 2.64991 7.28828C2.35533 7.00909 2.34431 6.55159 2.6235 6.25701C3.82877 4.89721 5.57074 4 7.5 4C9.42926 4 11.1712 4.89721 12.3765 6.25701C12.6557 6.55159 12.6447 7.00909 12.3501 7.28828C12.0555 7.56747 11.598 7.55646 11.3188 7.26188C10.3755 6.17946 9.01866 5.5 7.5 5.5Z"/>
                  <circle cx="7.5" cy="9.5" r="1.5"/>
                </svg>
                <svg width="25" height="12" viewBox="0 0 25 12" fill="white">
                  <rect opacity="0.35" x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="white"/>
                  <path opacity="0.4" d="M23 4V8C23.8284 8 24.5 7.32843 24.5 6.5V5.5C24.5 4.67157 23.8284 4 23 4Z"/>
                  <rect x="2" y="2" width="18" height="8" rx="1.5" fill="white"/>
                </svg>
              </StatusIcons>
            </StatusBar>
          )}
          <ScreenContent>
            {screenImage ? (
              <ScreenImage src={screenImage} alt="App screenshot" />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Your App Here
              </div>
            )}
          </ScreenContent>
          <HomeIndicator />
          <Reflection />
        </Screen>
      </IPhoneDevice>
    </IPhoneWrapper>
  );
};

export default IPhoneMockup;
