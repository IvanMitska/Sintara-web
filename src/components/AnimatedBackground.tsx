import React from 'react';
import styled, { keyframes } from 'styled-components';

// Анимация градиента
const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Анимация для орбитальных градиентов
const rotate = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -2;
  overflow: hidden;
`;

const GradientLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    -45deg,
    #000000,
    #0a0a0a,
    #1a0a1a,
    #000000,
    #0a0a2a,
    #000000
  );
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
`;

const OrbitGradient1 = styled.div`
  position: absolute;
  top: 10%;
  right: 10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(142, 45, 226, 0.15) 0%,
    rgba(74, 0, 224, 0.08) 40%,
    transparent 70%
  );
  border-radius: 50%;
  animation: ${rotate} 20s linear infinite;
  filter: blur(40px);
`;

const OrbitGradient2 = styled.div`
  position: absolute;
  bottom: 10%;
  left: 10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(255, 125, 84, 0.12) 0%,
    rgba(255, 180, 67, 0.06) 40%,
    transparent 70%
  );
  border-radius: 50%;
  animation: ${rotate} 25s linear infinite reverse;
  filter: blur(50px);
`;

const OrbitGradient3 = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(
    ellipse,
    rgba(74, 0, 224, 0.08) 0%,
    rgba(142, 45, 226, 0.04) 50%,
    transparent 80%
  );
  border-radius: 50%;
  animation: ${rotate} 30s linear infinite;
  filter: blur(60px);
`;

// Дополнительные мелкие световые пятна
const LightSpot1 = styled.div`
  position: absolute;
  top: 20%;
  left: 20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.03) 0%,
    transparent 60%
  );
  border-radius: 50%;
  animation: ${rotate} 35s linear infinite;
  filter: blur(30px);
`;

const LightSpot2 = styled.div`
  position: absolute;
  bottom: 30%;
  right: 30%;
  width: 250px;
  height: 250px;
  background: radial-gradient(
    circle,
    rgba(142, 45, 226, 0.06) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: ${rotate} 40s linear infinite reverse;
  filter: blur(35px);
`;

const AnimatedBackground: React.FC = () => {
  return (
    <BackgroundContainer>
      <GradientLayer />
      <OrbitGradient1 />
      <OrbitGradient2 />
      <OrbitGradient3 />
      <LightSpot1 />
      <LightSpot2 />
    </BackgroundContainer>
  );
};

export default AnimatedBackground; 