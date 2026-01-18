"use client";

import { motion } from 'framer-motion';

interface TimelineNavbarProps {
  onNavigate: (index: number) => void;
  activeSection: number;
}

export default function TimelineNavbar({ onNavigate, activeSection }: TimelineNavbarProps) {
  const sections = ['Home', 'About', 'Projects', 'Experience', 'Contact'];

  // Calculate rocket position percentage
  const rocketPosition = (activeSection / (sections.length - 1)) * 100;

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-8">
      <nav className="relative">
        {/* Section labels - Centered above dots */}
        <div className="relative mb-6 h-8">
          {sections.map((section, index) => {
            const isActive = activeSection === index;
            const position = (index / (sections.length - 1)) * 100;
            
            return (
              <motion.button
                key={section}
                onClick={() => onNavigate(index)}
                className={`absolute top-0 -translate-x-1/2 text-xl font-semibold transition-all duration-300 ${
                  isActive ? 'text-purple-300' : 'text-gray-500 hover:text-purple-400'
                }`}
                style={{ left: `${position}%` }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {section}
              </motion.button>
            );
          })}
        </div>

        {/* Progress bar container */}
        <div className="relative h-1">
          {/* Background line */}
          <div className="absolute inset-0 bg-gray-700 rounded-full" />

          {/* Progress line (colored part) */}
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-950 via-purple-900 to-purple-800 rounded-full" 
            initial={{ width: '0%' }}
            animate={{ width: `${rocketPosition}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />

          {/* Dots for each section */}
          {sections.map((_, index) => {
            const dotPosition = (index / (sections.length - 1)) * 100;
            const isPassed = index <= activeSection;
            
            return (
              <motion.div
                key={index}
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-colors duration-300 ${
                  isPassed ? 'bg-white' : 'bg-gray-600'
                }`}
                style={{ left: `${dotPosition}%`, marginLeft: '-6px' }}
                whileHover={{ scale: 1.3 }}
              />
            );
          })}

          {/* Rocket SVG - Fully Horizontal */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            animate={{ left: `${rocketPosition}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 25 }}
            style={{ marginLeft: '-24px' }}
          >
            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl"
                style={{ transform: 'rotate(0deg)' }}
              >
                <g>
                  <path
                    fill="white"
                    stroke="black"
                    strokeWidth="8"
                    d="M127.083,247.824l50.031-76.906c0,0-74.734-29.688-109.547-3.078C32.755,194.465,0.005,268.184,0.005,268.184
                      l37.109,21.516C37.114,289.699,84.083,198.684,127.083,247.824z"
                  />
                  <path
                    fill="white"
                    stroke="black"
                    strokeWidth="8"
                    d="M264.177,384.918l76.906-50.031c0,0,29.688,74.734,3.078,109.547
                      c-26.625,34.797-100.344,67.563-100.344,67.563l-21.5-37.109C222.317,474.887,313.333,427.918,264.177,384.918z"
                  />
                  <path
                    fill="white"
                    stroke="black"
                    strokeWidth="8"
                    d="M206.692,362.887l-13.203-13.188c-24,62.375-80.375,49.188-80.375,49.188s-13.188-56.375,49.188-80.375
                      l-13.188-13.188c-34.797-6-79.188,35.984-86.391,76.766c-7.188,40.781-8.391,75.563-8.391,75.563s34.781-1.188,75.578-8.391
                      S212.692,397.684,206.692,362.887z"
                  />
                  <path
                    fill="white"
                    stroke="black"
                    strokeWidth="8"
                    d="M505.224,6.777C450.786-18.738,312.927,28.98,236.255,130.668c-58.422,77.453-89.688,129.641-89.688,129.641
                      l46.406,46.406l12.313,12.313l46.391,46.391c0,0,52.219-31.25,129.672-89.656C483.005,199.074,530.739,61.215,505.224,6.777z
                      M274.63,237.371c-12.813-12.813-12.813-33.594,0-46.406s33.578-12.813,46.406,0.016c12.813,12.813,12.813,33.578,0,46.391
                      C308.208,250.184,287.442,250.184,274.63,237.371z M351.552,160.465c-16.563-16.578-16.563-43.422,0-59.984
                      c16.547-16.563,43.406-16.563,59.969,0s16.563,43.406,0,59.984C394.958,177.012,368.099,177.012,351.552,160.465z"
                  />
                </g>
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </nav>
    </div>
  );
}