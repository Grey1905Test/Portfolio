"use client";

import dynamic from 'next/dynamic';
import { NeutralHUDCorners } from '@/components/effects/NeutralHUDCorners';
import { NeutralScanlinesOverlay } from '@/components/effects/NeutralScanlinesOverlay';

const PlanetTest = dynamic(() => import('@/components/demos/PlanetTest'), { ssr: false });

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <PlanetTest />
      <NeutralHUDCorners />
      <NeutralScanlinesOverlay />
    </div>
  );
}