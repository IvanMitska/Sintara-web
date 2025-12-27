import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import styled from 'styled-components';

const Model3DCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
  border-radius: inherit;
`;

const LoadingIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 500;
  z-index: 2;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
`;

interface Model3DProps {
  modelPath: string;
  className?: string;
}

const Model3D: React.FC<Model3DProps> = ({ modelPath, className }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    // Setup renderer
    renderer.setSize(600, 400);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xa855f7, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 0.5, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.multiplyScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        // Add materials with liquid glass effect
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const material = mesh.material as THREE.MeshStandardMaterial;
              material.roughness = 0.3;
              material.metalness = 0.7;
              material.envMapIntensity = 1.5;
            }
          }
        });

        scene.add(model);
        setLoading(false);

        // Animation loop
        camera.position.z = 3;

        const animate = () => {
          requestAnimationFrame(animate);

          // Rotate model
          model.rotation.y += 0.005;
          model.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;

          renderer.render(scene, camera);
        };

        animate();
      },
      (progress) => {
        // Loading progress
        console.log('Loading progress: ', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        setError('Ошибка загрузки 3D модели');
        setLoading(false);
      }
    );

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;

      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath]);

  return (
    <div ref={mountRef} className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && <LoadingIndicator>Загрузка 3D модели...</LoadingIndicator>}
      {error && <LoadingIndicator>{error}</LoadingIndicator>}
    </div>
  );
};

export default Model3D;