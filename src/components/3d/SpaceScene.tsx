import { Suspense } from 'react';
import { StarField3D } from './StarField3D';
import { Nebula } from './Nebula';
import { Planets } from './Planets';
import { PlanetContent } from './PlanetContent';
import { nebulaPositions } from '../../data/cameraPath';

interface SpaceSceneProps {
  starCount?: number;
  enablePlanets?: boolean;
  enableNebulae?: boolean;
  enableContent?: boolean;
}

export function SpaceScene({
  starCount = 6000,
  enablePlanets = true,
  enableNebulae = true,
  enableContent = true,
}: SpaceSceneProps) {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.15} />

      {/* Main directional light - sun */}
      <directionalLight
        position={[200, 150, 100]}
        intensity={1.4}
        color="#ffffff"
      />

      {/* Fill light from behind */}
      <directionalLight
        position={[-150, -80, -200]}
        intensity={0.5}
        color="#a78bfa"
      />

      {/* Accent lights at each planet station */}
      <pointLight position={[10, 10, 20]} intensity={0.5} color="#7c3aed" distance={80} decay={2} />
      <pointLight position={[-20, -5, -140]} intensity={0.6} color="#6366f1" distance={100} decay={2} />
      <pointLight position={[30, 10, -310]} intensity={0.6} color="#7c3aed" distance={100} decay={2} />
      <pointLight position={[-20, 5, -470]} intensity={0.5} color="#a855f7" distance={80} decay={2} />
      <pointLight position={[25, 0, -610]} intensity={0.5} color="#6366f1" distance={80} decay={2} />
      <pointLight position={[-15, 12, -770]} intensity={0.6} color="#a855f7" distance={100} decay={2} />

      {/* Star field */}
      <StarField3D count={starCount} />

      {/* Nebulae */}
      {enableNebulae && (
        <>
          {nebulaPositions.map((nebula, index) => (
            <Nebula
              key={index}
              position={nebula.position}
              color={nebula.color}
              scale={nebula.scale}
              opacity={0.06}
            />
          ))}
        </>
      )}

      {/* Planets */}
      {enablePlanets && (
        <Suspense fallback={null}>
          <Planets />
        </Suspense>
      )}

      {/* Content on planet surfaces */}
      {enableContent && (
        <Suspense fallback={null}>
          <PlanetContent />
        </Suspense>
      )}
    </>
  );
}

export default SpaceScene;
