import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BarbieTitle } from './BarbieTitle';

interface SplashScreenProps {
  coverImage: string;
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ coverImage, onEnter }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-5 pt-8 pb-10 overflow-hidden select-none">
      {/* Center Section: First Photo + Barbie Title + Arrow Button */}
      <div className="w-full max-w-sm flex flex-col items-center my-auto">
        {/* The First Photo Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{
            opacity: 0,
            scale: 0.82,
            y: -80,
            filter: 'blur(12px)',
            transition: { duration: 0.55, ease: [0.32, 0.72, 0, 1] },
          }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 24,
            delay: 0.15,
          }}
          className="relative w-full aspect-[4/3] rounded-[28px] p-2 liquid-glass-card group shadow-[0_25px_50px_-12px_rgba(244,114,182,0.35)] mb-6"
        >
          {/* Glass specular sheen line */}
          <div className="absolute inset-x-4 top-2 h-8 rounded-t-[20px] bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-10" />

          <div className="w-full h-full rounded-[22px] overflow-hidden relative shadow-inner bg-pink-100/50">
            <img
              id="cover-main-image"
              src={coverImage}
              alt="Фури мальчики обложка"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
            />
            {/* Soft pink gradient overlay at the bottom of the photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Floating decorative mini sticker */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-3 -right-2 liquid-glass px-3 py-1 rounded-full text-[11px] font-bold text-pink-600 border border-white/80 shadow-md flex items-center gap-1"
          >
            <span>friends</span>
            <Sparkles className="w-3 h-3 text-pink-500 fill-pink-400" />
          </motion.div>
        </motion.div>

        {/* Barbie title right under the photo in the middle of the screen */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mb-6"
        >
          <BarbieTitle size="large" />
        </motion.div>

        {/* Arrow Button in circle under the title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 350, damping: 20 }}
          className="flex flex-col items-center"
        >
          <button
            id="btn-splash-enter"
            type="button"
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => {
              setIsPressed(false);
              onEnter();
            }}
            onPointerCancel={() => setIsPressed(false)}
            onClick={onEnter}
            aria-label="Перейти к сайту"
            className={`relative w-16 h-16 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
              isPressed ? 'scale-90' : 'hover:scale-105'
            }`}
          >
            {/* Outer glowing liquid pulse rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 blur-md opacity-50 animate-pulse" />
            <div className="absolute -inset-1 rounded-full border border-pink-300/60 animate-ping opacity-25" />

            {/* Glass button face */}
            <div className="relative w-full h-full rounded-full liquid-glass-darker border-2 border-white/90 shadow-[0_10px_25px_rgba(244,63,94,0.3)] flex items-center justify-center overflow-hidden">
              {/* Gloss highlight */}
              <div className="absolute top-0 inset-x-2 h-1/2 bg-gradient-to-b from-white/70 to-transparent rounded-t-full pointer-events-none" />

              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <ArrowRight className="w-7 h-7 text-pink-600 drop-shadow-sm stroke-[2.5]" />
              </motion.div>
            </div>
          </button>

          <span className="text-[11px] font-medium text-pink-700/80 mt-3 tracking-wide uppercase">
            нажми чтобы войти
          </span>
        </motion.div>
      </div>
    </div>
  );
};
