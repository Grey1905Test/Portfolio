"use client";

import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { useState } from 'react';

export default function ResumeDownloadButton() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Track download analytics (optional - you can add your analytics here)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'download', {
          event_category: 'Resume',
          event_label: 'PDF Download',
        });
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = '/Surya_Sundar_Resume.pdf';
      link.download = 'Surya_Sundar_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset after animation
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      console.error('Download error:', error);
      setIsDownloading(false);
    }
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={isDownloading}
      className="group relative w-full border-2 border-pink-400/50 bg-pink-400/5 hover:bg-pink-400/10 hover:border-pink-400 transition-all duration-300 p-4 rounded-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-pink-500/0"
        animate={{
          x: isDownloading ? ['0%', '200%'] : '0%',
        }}
        transition={{
          duration: 1.5,
          repeat: isDownloading ? Infinity : 0,
          ease: 'linear',
        }}
      />

      <div className="relative flex items-center justify-center gap-3">
        {/* Icon */}
        <motion.div
          animate={{
            y: isDownloading ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: 0.6,
            repeat: isDownloading ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {isDownloading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <FileText className="w-5 h-5 text-pink-400" />
            </motion.div>
          ) : (
            <Download className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
          )}
        </motion.div>

        {/* Text */}
        <div className="flex flex-col items-start">
          <span className="text-pink-300 group-hover:text-pink-200 font-mono text-sm font-bold tracking-wider transition-colors">
            {isDownloading ? 'DOWNLOADING...' : 'DOWNLOAD RESUME'}
          </span>
          <span className="text-pink-400/60 text-xs font-mono">
            PDF Format • Updated 2026
          </span>
        </div>

        {/* Success checkmark */}
        {isDownloading && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-4"
          >
            <div className="w-6 h-6 rounded-full bg-green-400/20 border-2 border-green-400 flex items-center justify-center">
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <motion.path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          boxShadow: '0 0 20px rgba(255, 105, 180, 0.3)',
          opacity: 0,
        }}
        whileHover={{
          opacity: 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
