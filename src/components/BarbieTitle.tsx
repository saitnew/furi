import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface BarbieTitleProps {
  size?: 'large' | 'compact' | 'bottom';
  className?: string;
  onClick?: () => void;
}

export const BarbieTitle: React.FC<BarbieTitleProps> = ({
  size = 'large',
  className = '',
  onClick,
}) => {
  if (size === 'bottom') {
    return (
      <motion.div
        layoutId="barbie-brand-title"
        className={`w-full flex items-center justify-center pb-safe py-2 cursor-pointer select-none ${className}`}
        onClick={onClick}
      >
        <div className="liquid-glass px-6 py-2 rounded-full border border-white/70 shadow-lg flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-300 animate-pulse" />
          <span
            className="font-barbie font-bold tracking-wider text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-[#ff2a85] to-[#e0218a] drop-shadow-[0_2px_8px_rgba(255,20,147,0.35)]"
            style={{
              fontFamily: "'Pacifico', 'Caveat', cursive",
              letterSpacing: '0.04em',
            }}
          >
            фури мальчики
          </span>
          <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-300 animate-pulse" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId="barbie-brand-title"
      className={`flex flex-col items-center justify-center text-center select-none ${className}`}
      onClick={onClick}
    >
      <div className="relative inline-block px-4 py-1">
        {/* Soft backlight bloom */}
        <div className="absolute inset-0 bg-pink-400/20 blur-xl rounded-full transform -rotate-1" />

        <div className="relative flex items-center justify-center gap-2">
          <motion.span
            animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.15, 0.95, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-pink-500 fill-pink-200 drop-shadow-sm" />
          </motion.span>

          <h1
            className="text-4xl sm:text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-[#ff2a85] to-[#e0218a]"
            style={{
              fontFamily: "'Pacifico', 'Caveat', cursive",
              textShadow: '0 4px 16px rgba(255, 0, 127, 0.35)',
              WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.6)',
              letterSpacing: '0.03em',
            }}
          >
            фури мальчики
          </h1>

          <motion.span
            animate={{ rotate: [0, -15, 10, 0], scale: [1, 1.15, 0.95, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          >
            <Sparkles className="w-5 h-5 text-pink-500 fill-pink-200 drop-shadow-sm" />
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};
