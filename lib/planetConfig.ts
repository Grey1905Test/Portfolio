export interface PlanetConfig {
  model: string;
  radius: number;
  speed: number;
  size: number;
  label: string;
  startAngle: number;
  tilt: number;
}

export const generatePlanetConfigs = (): PlanetConfig[] => [
  {
    model: '/models/planet2.glb',
    radius: 8,
    speed: 0.0008,
    size: 1,
    label: 'Home',
    startAngle: Math.random() * Math.PI * 2,
    tilt: (Math.random() - 0.5) * 0.3,
  },
  {
    model: '/models/planet3.glb',
    radius: 12,
    speed: 0.0006,
    size: 1.2,
    label: 'About',
    startAngle: Math.random() * Math.PI * 2,
    tilt: (Math.random() - 0.5) * 0.3,
  },
  {
    model: '/models/planet4.glb',
    radius: 16,
    speed: 0.0005,
    size: 1.1,
    label: 'Projects',
    startAngle: Math.random() * Math.PI * 2,
    tilt: (Math.random() - 0.5) * 0.3,
  },
  {
    model: '/models/planet5.glb',
    radius: 20,
    speed: 0.0004,
    size: 1.3,
    label: 'Experience',
    startAngle: Math.random() * Math.PI * 2,
    tilt: (Math.random() - 0.5) * 0.3,
  },
  {
    model: '/models/planet6.glb',
    radius: 24,
    speed: 0.0003,
    size: 1,
    label: 'Skills',
    startAngle: Math.random() * Math.PI * 2,
    tilt: (Math.random() - 0.5) * 0.3,
  },
];