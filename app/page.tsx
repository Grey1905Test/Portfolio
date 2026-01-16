"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import demos to avoid SSR issues with Three.js
const GalaxyDemo1 = dynamic(() => import('@/components/demos/GalaxyDemo1'), { ssr: false });
const GalaxyDemo2 = dynamic(() => import('@/components/demos/GalaxyDemo2'), { ssr: false });
const GalaxyDemo3 = dynamic(() => import('@/components/demos/GalaxyDemo3'), { ssr: false });
const PlanetTest = dynamic(() => import('@/components/demos/PlanetTest'), { ssr: false }); // ADD THIS

export default function Home() {
  const [selectedDemo, setSelectedDemo] = useState<number | null>(null);

  const demos = [
    {
      id: 1,
      title: 'Solar System Style',
      description: 'Planets orbit around a central sun. Classic and elegant.',
      component: GalaxyDemo1,
    },
    {
      id: 2,
      title: 'Particle Galaxy',
      description: 'Planets floating in a particle cloud. More abstract and dynamic.',
      component: GalaxyDemo2,
    },
    {
      id: 3,
      title: 'Space Station Hub',
      description: 'Planets arranged in a circle. Easy navigation, clean layout.',
      component: GalaxyDemo3,
    },
    {
      id: 4,
      title: 'Custom Planet Test',  // ADD THIS
      description: 'Testing your Sketchfab planet model',
      component: PlanetTest,
    },
  ];

  if (selectedDemo !== null) {
    const Demo = demos[selectedDemo - 1].component;
    return (
      <div className="relative w-full h-screen">
        <Demo />
        <button
          onClick={() => setSelectedDemo(null)}
          className="absolute top-4 right-4 z-20 px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all border border-white/30"
        >
          ← Back to Selection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Galaxy Style 🚀
          </h1>
          <p className="text-xl text-gray-300">
            Select a demo to see the 3D space portfolio concept in action
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Each demo shows planets representing your portfolio sections
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
                onClick={() => setSelectedDemo(demo.id)}
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-xl">
                  {demo.id}
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                  {demo.title}
                </h3>
                
                <p className="text-gray-400 mb-4">
                  {demo.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-400">Click to preview →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 text-sm">
            💡 Tip: You can rotate, zoom, and pan in each demo using your mouse
          </p>
        </motion.div>
      </div>
    </div>
  );
}