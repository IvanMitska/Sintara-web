import React, { Suspense, lazy, useState, useRef, useEffect } from 'react';
import type { ComponentType } from 'react';
import styled from 'styled-components';

// Упрощенная заглушка загрузки без анимации для экономии ресурсов
const StaticLoadingFallback = styled.div`
  width: 100%;
  min-height: 0;
  display: none;
`;

// Оптимизированная анимированная заглушка загрузки для десктопов
const LoadingFallback = styled.div`
  width: 100%;
  min-height: 0;
  display: none;
  
  &::after {
    content: '';
    width: 30px;
    height: 30px;
    border: 2px solid rgba(142, 45, 226, 0.1);
    border-radius: 50%;
    border-top-color: var(--color-primary);
    will-change: transform;
    animation: spin 0.6s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Определяем один раз, является ли устройство мобильным
const isMobile = (window.innerWidth < 768 || navigator.userAgent.indexOf('Mobile') !== -1);

// Функция для ленивой загрузки компонентов с мобильной оптимизацией
export function lazyLoad(importFunc: () => Promise<{ default: ComponentType<any> }>) {
  const LazyComponent = lazy(importFunc);
  
  return (props: any) => (
    <Suspense fallback={isMobile ? <StaticLoadingFallback /> : <LoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Оптимизированная функция предзагрузки изображений
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.loading = 'lazy'; // Используем нативную ленивую загрузку браузера
    img.decoding = 'async'; // Асинхронная декодировка
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

// Компонент для отложенной загрузки секций с улучшенной производительностью
interface LazyLoadSectionProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  priority?: boolean;
}

export const LazyLoadSection: React.FC<LazyLoadSectionProps> = ({ 
  children, 
  threshold = 0.05, // Уменьшаем порог для более ранней загрузки
  rootMargin = '300px 0px', // Увеличиваем отступ для предзагрузки
  priority = false
}) => {
  const [isVisible, setIsVisible] = useState(priority); // Приоритетные секции загружаются сразу
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Если это приоритетная секция, сразу отображаем
    if (priority) {
      setIsVisible(true);
      setIsLoaded(true);
      return;
    }
    
    const section = sectionRef.current;
    if (!section) return;
    
    // Используем requestIdleCallback для снижения нагрузки
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if ('requestIdleCallback' in window) {
            // @ts-ignore - не во всех типах есть определение requestIdleCallback
            window.requestIdleCallback(() => {
              setIsVisible(true);
              
              // Задержка удаления наблюдателя
              setTimeout(() => {
                observer.disconnect();
                setIsLoaded(true);
              }, 100);
            }, { timeout: 1000 });
          } else {
            // Фолбэк для браузеров без поддержки requestIdleCallback
            setTimeout(() => {
              setIsVisible(true);
              observer.disconnect();
              setIsLoaded(true);
            }, 100);
          }
        }
      },
      { 
        threshold, 
        rootMargin
      }
    );
    
    observer.observe(section);
    
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, priority]);
  
  // Помечаем для оптимизации рендеринга
  const styles = { willChange: isVisible && !isLoaded ? 'contents' : 'auto' };
  
  return (
    <div ref={sectionRef} style={styles} className="performance-container">
      {isVisible ? children : null}
    </div>
  );
};

export default {
  lazyLoad,
  preloadImage,
  LazyLoadSection,
  LoadingFallback,
  StaticLoadingFallback
}; 