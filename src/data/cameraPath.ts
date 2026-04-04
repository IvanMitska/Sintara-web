import { Vector3 } from 'three';

// Planet station - content ON the planet surface
export interface PlanetStation {
  id: string;
  planet: string;
  // Planet center position in 3D space
  planetPosition: Vector3;
  planetScale: number;
  // Camera position when viewing this station
  cameraPosition: Vector3;
  // Where camera looks at
  lookAt: Vector3;
  // Content position on planet surface (calculated to be ON the surface facing camera)
  contentPosition: Vector3;
  // Content rotation to face camera
  contentRotation: [number, number, number];
  // Which sections to show on this planet
  sections: string[];
}

// Helper to calculate surface position facing camera
function getSurfacePosition(
  planetCenter: Vector3,
  cameraPos: Vector3,
  planetRadius: number,
  offset: number = 0
): Vector3 {
  const direction = new Vector3()
    .subVectors(cameraPos, planetCenter)
    .normalize();
  return new Vector3()
    .copy(planetCenter)
    .add(direction.multiplyScalar(planetRadius + offset));
}

// Define planets first, then calculate positions
const moonCenter = new Vector3(0, 0, -20);
const moonScale = 8;
const moonCam = new Vector3(0, 5, 45);

const jupiterCenter = new Vector3(-40, -10, -180);
const jupiterScale = 40;
const jupiterCam = new Vector3(25, 10, -130);

const saturnCenter = new Vector3(50, 5, -350);
const saturnScale = 20;
const saturnCam = new Vector3(-20, 15, -300);

const marsCenter = new Vector3(-30, 0, -500);
const marsScale = 18;
const marsCam = new Vector3(20, 10, -460);

const uranusCenter = new Vector3(40, -5, -650);
const uranusScale = 22;
const uranusCam = new Vector3(-15, 8, -610);

const neptuneCenter = new Vector3(-25, 10, -820);
const neptuneScale = 25;
const neptuneCam = new Vector3(25, 15, -770);

// Planet stations with content ON surfaces
export const planetStations: PlanetStation[] = [
  {
    id: 'moon',
    planet: 'moon',
    planetPosition: moonCenter,
    planetScale: moonScale,
    cameraPosition: moonCam,
    lookAt: getSurfacePosition(moonCenter, moonCam, moonScale * 0.5),
    contentPosition: getSurfacePosition(moonCenter, moonCam, moonScale * 0.5, 2),
    contentRotation: [0, 0, 0],
    sections: ['hero'],
  },
  {
    id: 'jupiter',
    planet: 'jupiter',
    planetPosition: jupiterCenter,
    planetScale: jupiterScale,
    cameraPosition: jupiterCam,
    lookAt: getSurfacePosition(jupiterCenter, jupiterCam, jupiterScale * 0.5),
    contentPosition: getSurfacePosition(jupiterCenter, jupiterCam, jupiterScale * 0.5, 3),
    contentRotation: [0, Math.PI * 0.15, 0],
    sections: ['services'],
  },
  {
    id: 'saturn',
    planet: 'saturn',
    planetPosition: saturnCenter,
    planetScale: saturnScale,
    cameraPosition: saturnCam,
    lookAt: getSurfacePosition(saturnCenter, saturnCam, saturnScale * 0.5),
    contentPosition: getSurfacePosition(saturnCenter, saturnCam, saturnScale * 0.5, 3),
    contentRotation: [0, -Math.PI * 0.12, 0],
    sections: ['portfolio'],
  },
  {
    id: 'mars',
    planet: 'mars',
    planetPosition: marsCenter,
    planetScale: marsScale,
    cameraPosition: marsCam,
    lookAt: getSurfacePosition(marsCenter, marsCam, marsScale * 0.5),
    contentPosition: getSurfacePosition(marsCenter, marsCam, marsScale * 0.5, 2),
    contentRotation: [0, Math.PI * 0.1, 0],
    sections: ['benefits', 'process'],
  },
  {
    id: 'uranus',
    planet: 'uran',
    planetPosition: uranusCenter,
    planetScale: uranusScale,
    cameraPosition: uranusCam,
    lookAt: getSurfacePosition(uranusCenter, uranusCam, uranusScale * 0.5),
    contentPosition: getSurfacePosition(uranusCenter, uranusCam, uranusScale * 0.5, 2),
    contentRotation: [0, -Math.PI * 0.1, 0],
    sections: ['pricing', 'testimonials'],
  },
  {
    id: 'neptune',
    planet: 'neptune',
    planetPosition: neptuneCenter,
    planetScale: neptuneScale,
    cameraPosition: neptuneCam,
    lookAt: getSurfacePosition(neptuneCenter, neptuneCam, neptuneScale * 0.5),
    contentPosition: getSurfacePosition(neptuneCenter, neptuneCam, neptuneScale * 0.5, 2),
    contentRotation: [0, Math.PI * 0.12, 0],
    sections: ['contact', 'faq'],
  },
];

// Get current station index based on scroll progress
export function getCurrentStationIndex(progress: number): number {
  const stationProgress = progress * (planetStations.length - 1);
  return Math.min(Math.floor(stationProgress), planetStations.length - 1);
}

// Get interpolation factor between current and next station
export function getStationInterpolation(progress: number): number {
  const stationProgress = progress * (planetStations.length - 1);
  return stationProgress - Math.floor(stationProgress);
}

// Get camera position based on scroll progress
export function getCameraPosition(progress: number): Vector3 {
  const stationIndex = getCurrentStationIndex(progress);
  const t = getStationInterpolation(progress);

  const currentStation = planetStations[stationIndex];
  const nextStation = planetStations[Math.min(stationIndex + 1, planetStations.length - 1)];

  return new Vector3().lerpVectors(
    currentStation.cameraPosition,
    nextStation.cameraPosition,
    t
  );
}

// Get look-at position based on scroll progress
export function getLookAtPosition(progress: number): Vector3 {
  const stationIndex = getCurrentStationIndex(progress);
  const t = getStationInterpolation(progress);

  const currentStation = planetStations[stationIndex];
  const nextStation = planetStations[Math.min(stationIndex + 1, planetStations.length - 1)];

  return new Vector3().lerpVectors(
    currentStation.lookAt,
    nextStation.lookAt,
    t
  );
}

// Nebula positions for atmosphere
export const nebulaPositions = [
  { position: new Vector3(-120, 70, -100), color: '#7c3aed', scale: 180 },
  { position: new Vector3(140, -60, -280), color: '#4c1d95', scale: 150 },
  { position: new Vector3(-100, 65, -450), color: '#6366f1', scale: 160 },
  { position: new Vector3(120, -55, -620), color: '#7c3aed', scale: 140 },
  { position: new Vector3(-90, 60, -800), color: '#a855f7', scale: 155 },
];

// Section names for type safety
export const sections = ['hero', 'services', 'portfolio', 'benefits', 'process', 'pricing', 'testimonials', 'contact', 'faq'] as const;
export type SectionName = (typeof sections)[number];
