import React from 'react';
import { motion } from 'motion/react';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-[#ffe4ec] via-[#fed7e2] to-[#fbcfe8]">
      {/* Primary animated liquid orbs */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-pink-400/40 via-rose-300/50 to-amber-200/30 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-gradient-to-bl from-pink-500/30 via-fuchsia-300/35 to-rose-200/40 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 35, -25, 0],
          y: [0, -30, 45, 0],
          scale: [0.95, 1.1, 1, 0.95],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute -bottom-24 left-1/4 w-88 h-88 rounded-full bg-gradient-to-r from-rose-400/35 via-pink-300/45 to-orange-200/25 blur-3xl"
      />

      {/* Subtle glossy glass light shimmer lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent" />

      {/* Floating subtle sparkles */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[15%] left-[20%] w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <div className="absolute top-[28%] right-[18%] w-2 h-2 rounded-full bg-pink-200 animate-ping duration-1000" />
        <div className="absolute top-[65%] left-[12%] w-1 h-1 rounded-full bg-white" />
        <div className="absolute top-[80%] right-[25%] w-2 h-2 rounded-full bg-white/70 animate-pulse" />
      </div>
    </div>
  );
};
