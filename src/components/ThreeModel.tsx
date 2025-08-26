import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  MeshDistortMaterial, 
  Sphere, 
  useTexture,
  Html,
  Sparkles,
  Float
} from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';
import { gsap } from 'gsap';

const ModelContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

// Компонент ErrorBoundary для отлова ошибок в Three.js
class ThreeErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("ThreeModel Error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          color: '#ff6b6b',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: '8px'
        }}>
          <p>Не удалось загрузить 3D модель</p>
          <small style={{ fontSize: '10px', marginTop: '10px', opacity: 0.7 }}>
            {this.state.error && this.state.error.toString()}
          </small>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Простая заглушка для загрузки
const LoadingFallback = () => (
  <mesh>
    <sphereGeometry args={[1, 8, 8]} />
    <meshBasicMaterial color="#333" wireframe />
  </mesh>
);

// Упрощенный компонент сферы с оптимизированными эффектами
const CoreSphere = ({ isMobile }) => {
  const sphereRef = useRef(null);
  const innerSphereRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { camera } = useThree();
  
  // Эффект нажатия на сферу - зум камеры
  const handleClick = () => {
    setClicked(!clicked);
    
    gsap.to(camera.position, {
      z: clicked ? 5 : 3.5,
      duration: 1,
      ease: 'power2.inOut'
    });
  };
  
  // Упрощенная анимация - меньше расчетов на кадр
  useFrame((state) => {
    if (sphereRef.current) {
      // Базовая анимация вращения - оптимизирована
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      
      // Упрощенная условная анимация
      if (hovered) {
        sphereRef.current.rotation.y += 0.01;
      }
    }
    
    // Анимация внутренней сферы - только если она видна
    if (innerSphereRef.current && !isMobile) {
      innerSphereRef.current.rotation.y = -state.clock.getElapsedTime() * 0.1;
    }
  });

  // Упрощенные настройки геометрии для мобильных устройств
  const sphereDetail = isMobile ? { args: [1, 24, 24] } : { args: [1, 64, 64] };
  const innerSphereDetail = isMobile ? { args: [0.75, 16, 16] } : { args: [0.75, 32, 32] };

  return (
    <group>
      {/* Главная сфера */}
      <Sphere 
        {...sphereDetail}
        ref={sphereRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <MeshDistortMaterial 
          color="#8E2DE2" 
          attach="material" 
          distort={0.4}
          speed={2} 
          roughness={0.1}
          metalness={0.9}
          wireframe={false}
          transparent={true}
          opacity={0.9}
        />
      </Sphere>
      
      {/* Внутренняя сфера - не рендерится на мобильных */}
      {!isMobile && (
        <Sphere 
          {...innerSphereDetail}
          ref={innerSphereRef}
        >
          <MeshDistortMaterial 
            color="#4A00E0" 
            attach="material" 
            distort={0.5}
            speed={1.5}
            wireframe={true}
            transparent={true}
            opacity={0.6}
          />
        </Sphere>
      )}
      
      {/* Уменьшаем количество декоративных сфер для мобильных */}
      {[...Array(isMobile ? 2 : 5)].map((_, i) => (
        <Float 
          key={i}
          speed={1} 
          rotationIntensity={0.5}
          floatIntensity={1}
          position={[
            Math.sin(i * Math.PI * 2 / (isMobile ? 2 : 5)) * 1.8,
            Math.cos(i * Math.PI * 2 / (isMobile ? 2 : 5)) * 1.8,
            0
          ]}
        >
          <Sphere args={[0.1, 8, 8]}>
            <meshBasicMaterial 
              color={i % 2 === 0 ? '#8E2DE2' : '#4A00E0'} 
              transparent
              opacity={0.8}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
};

// Упрощенные кольца для мобильных устройств
const GlowingRing = ({ isMobile }) => {
  const ringRef = useRef(null);
  const ring2Ref = useRef(null);
  
  // Упрощенная анимация для мобильных
  useFrame((state) => {
    if (ringRef.current && (!isMobile || !ring2Ref.current)) {
      // Упрощенная анимация для первого кольца
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }
    
    // На мобильных второе кольцо не анимируется
    if (ring2Ref.current && !isMobile) {
      ring2Ref.current.rotation.z = -state.clock.getElapsedTime() * 0.03;
    }
  });
  
  // Уменьшаем детализацию для мобильных
  const ringDetail = isMobile ? 32 : 64;
  
  return (
    <>
      <mesh ref={ringRef} position={[0, 0, -0.5]} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[1.4, 1.6, ringDetail]} />
        <meshBasicMaterial 
          color="#8E2DE2" 
          transparent 
          opacity={0.6} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Второе кольцо показываем только на десктопе */}
      {!isMobile && (
        <mesh ref={ring2Ref} position={[0, 0, -0.3]} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <ringGeometry args={[1.8, 1.9, ringDetail]} />
          <meshBasicMaterial 
            color="#4A00E0" 
            transparent 
            opacity={0.4} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </>
  );
};

// Сильно упрощенные частицы
const EnhancedParticles = ({ isMobile }) => {
  // Уменьшаем количество частиц для мобильных
  const count1 = isMobile ? 15 : 50;
  const count2 = isMobile ? 10 : 30;
  
  return (
    <>
      <Sparkles 
        count={count1} 
        scale={[5, 5, 5]} 
        size={1.5} 
        speed={0.3} 
        opacity={0.5}
        color="#8E2DE2"
      />
      
      {/* Вторую систему частиц включаем только на десктопе */}
      {!isMobile && (
        <Sparkles 
          count={count2} 
          scale={[4, 4, 4]} 
          size={1} 
          speed={0.5} 
          opacity={0.3}
          color="#4A00E0"
        />
      )}
    </>
  );
};

// Упрощенный компонент орбит - отключен на мобильных
const Orbits = ({ isMobile }) => {
  // На мобильных не показываем вообще
  if (isMobile) return null;
  
  const orbit1Ref = useRef(null);
  const orbit2Ref = useRef(null);
  
  useFrame((state) => {
    if (orbit1Ref.current && orbit2Ref.current) {
      const time = state.clock.getElapsedTime();
      
      orbit1Ref.current.rotation.x = time * 0.1;
      orbit2Ref.current.rotation.x = -time * 0.08;
    }
  });
  
  // Уменьшаем детализацию
  const ringDetail = 48;
  
  return (
    <>
      <mesh ref={orbit1Ref}>
        <ringGeometry args={[2, 2.02, ringDetail]} />
        <meshBasicMaterial color="#8E2DE2" side={THREE.DoubleSide} transparent opacity={0.4} />
      </mesh>
      
      <mesh ref={orbit2Ref}>
        <ringGeometry args={[2.5, 2.52, ringDetail]} />
        <meshBasicMaterial color="#4A00E0" side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>
    </>
  );
};

// Основная сцена с условным рендерингом компонентов
const Scene = ({ isMobile }) => {
  return (
    <group>
      <ambientLight intensity={0.3} />
      <spotLight position={[5, 5, 5]} intensity={0.7} />
      
      <Suspense fallback={<LoadingFallback />}>
        <CoreSphere isMobile={isMobile} />
        <GlowingRing isMobile={isMobile} />
        <EnhancedParticles isMobile={isMobile} />
        <Orbits isMobile={isMobile} />
      </Suspense>
    </group>
  );
};

// Оптимизированный основной компонент
const ThreeModel: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [performance, setPerformance] = useState('high'); // high, medium, low
  
  useEffect(() => {
    // Проверяем поддержку WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        console.warn('WebGL не поддерживается в этом браузере');
        setHasWebGL(false);
      }
    } catch (e) {
      console.error('Ошибка при проверке WebGL:', e);
      setHasWebGL(false);
    }
    
    // Определяем устройство и производительность
    const checkDeviceAndPerformance = () => {
      // Определение мобильного устройства
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Примитивное определение производительности устройства
      if (mobile) {
        // На мобильных по умолчанию низкая производительность
        setPerformance('low');
      } else {
        // Пытаемся определить производительность по частоте обновления экрана
        if (window.screen.availWidth >= 1920) {
          // Высокое разрешение - вероятно средняя производительность
          setPerformance('medium');
        }
      }
    };
    
    // Проверяем сразу и при изменении размера
    checkDeviceAndPerformance();
    window.addEventListener('resize', checkDeviceAndPerformance);
    
    return () => {
      window.removeEventListener('resize', checkDeviceAndPerformance);
    };
  }, []);
  
  // Если WebGL не поддерживается, показываем запасной вариант
  if (!hasWebGL) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4A00E0, #8E2DE2)',
        borderRadius: '10px',
        color: 'white',
        padding: '20px'
      }}>
        <p>Для просмотра 3D модели требуется поддержка WebGL</p>
      </div>
    );
  }
  
  // Настройки в зависимости от производительности
  const pixelRatio = performance === 'low' ? 1 : performance === 'medium' ? 1.5 : 2;
  const fov = isMobile ? 60 : 45; // Увеличенное поле зрения на мобильных
  
  return (
    <ModelContainer>
      <ThreeErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 5], fov: fov }}
          gl={{ 
            antialias: performance !== 'low', // Отключаем сглаживание на мобильных
            alpha: true,
            powerPreference: 'high-performance',
            precision: performance === 'low' ? 'lowp' : 'mediump',
            stencil: false, // Отключаем ненужные функции
            depth: true
          }}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent'
          }}
          dpr={pixelRatio}
          frameloop={performance === 'low' ? 'demand' : 'always'} // Рендеринг по требованию на мобильных
          performance={{ min: 0.5 }}
          onCreated={(state) => {
            // Оптимизируем настройки рендерера
            if (state.gl) {
              state.gl.setClearColor(new THREE.Color(0, 0, 0, 0), 0);
              state.gl.physicallyCorrectLights = false; // Отключаем физически корректное освещение
            }
          }}
        >
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            rotateSpeed={0.5}
            enableDamping={performance !== 'low'} // Отключаем демпинг на мобильных
            dampingFactor={0.05}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
          <Scene isMobile={isMobile || performance === 'low'} />
          {/* Отключаем окружение на мобильных и устройствах со средней производительностью */}
          {performance === 'high' && <Environment preset="night" />}
        </Canvas>
      </ThreeErrorBoundary>
    </ModelContainer>
  );
};

export default ThreeModel; 