import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileData } from '../types';
import { Maximize2, ChevronUp, ChevronDown, Sparkles, Heart } from 'lucide-react';

interface PhotoReelProps {
  profile: ProfileData;
  onOpenFullscreen: (src: string, caption?: string) => void;
}

export const PhotoReel: React.FC<PhotoReelProps> = ({ profile, onOpenFullscreen }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);

  // Reset index when profile switches
  React.useEffect(() => {
    setCurrentIndex(0);
    setDirection(0);
  }, [profile.id]);

  const photos = profile.photos;
  const totalPhotos = photos.length;

  const goToPhoto = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < totalPhotos - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop around
      setDirection(1);
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    } else {
      // Loop around
      setDirection(-1);
      setCurrentIndex(totalPhotos - 1);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none pb-24">
      {/* Top Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        key={profile.id}
        className="w-full max-w-sm mb-3 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-white/60 mb-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-300" />
          <span className="text-[11px] font-bold tracking-wider text-pink-800 uppercase">
            {profile.subtitle}
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-800 capitalize">
          {profile.tabTitle}
        </h2>
      </motion.div>

      {/* Main Interactive Stage with Photo Card and Minimalist Floating Indicators */}
      <div className="w-full max-w-sm flex items-center justify-center gap-3 my-2 px-2 relative">
        {/* Photo Container with Vertical Drag / Swipe */}
        <div className="relative w-full aspect-[3/4] max-h-[440px] rounded-[30px] p-2 liquid-glass-card shadow-[0_20px_45px_-10px_rgba(244,114,182,0.3)] overflow-hidden">
          {/* Specular gloss reflections */}
          <div className="absolute inset-x-4 top-2 h-10 rounded-t-[24px] bg-gradient-to-b from-white/70 to-transparent pointer-events-none z-10" />

          {/* Swipe gesture card */}
          <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-pink-100/60 shadow-inner group">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={`${profile.id}-${currentIndex}`}
                custom={direction}
                initial={{
                  opacity: 0,
                  y: direction > 0 ? 80 : -80,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: direction > 0 ? -80 : 80,
                  scale: 0.95,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 28,
                }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.y < -40) {
                    handleNext();
                  } else if (info.offset.y > 40) {
                    handlePrev();
                  }
                }}
                onClick={() =>
                  onOpenFullscreen(
                    photos[currentIndex],
                    `${profile.tabTitle} • Фото ${currentIndex + 1}/${totalPhotos}`
                  )
                }
                className="w-full h-full cursor-pointer relative"
              >
                <img
                  src={photos[currentIndex]}
                  alt={`${profile.tabTitle} фото ${currentIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center pointer-events-none"
                />

                {/* Bottom photo subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Tap to Expand Hint */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  <div className="liquid-glass-darker px-3 py-1 rounded-full text-[11px] font-bold text-pink-700 flex items-center gap-1.5 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>на весь экран</span>
                  </div>
                  <div className="liquid-glass px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-md">
                    0{currentIndex + 1} / 0{totalPhotos}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick Tap arrows (for seamless one-hand navigation) */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 pointer-events-auto">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full liquid-glass-darker flex items-center justify-center text-pink-700 shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              title="Предыдущее фото"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full liquid-glass-darker flex items-center justify-center text-pink-700 shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              title="Следующее фото"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Floating Transparent/Glassy Vertical Dots inside the photo container */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5 z-20 py-2.5 px-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 shadow-lg">
            {photos.map((_, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPhoto(idx);
                  }}
                  className="group p-1 flex items-center justify-center cursor-pointer"
                  title={`Фото ${idx + 1}`}
                >
                  <motion.span
                    animate={{
                      scale: isActive ? 1.35 : 1,
                      backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                      boxShadow: isActive ? '0 0 8px rgba(255,255,255,0.8)' : 'none',
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-2 h-2 rounded-full block"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Biography Section under the 3 photos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        key={`bio-${profile.id}`}
        className="w-full max-w-sm mt-3 liquid-glass-card p-5 rounded-[26px] border border-white/80 shadow-[0_15px_35px_-5px_rgba(244,114,182,0.25)] relative overflow-hidden"
      >
        {/* Soft top highlight */}
        <div className="absolute top-0 inset-x-6 h-6 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-800 uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-pink-400 text-pink-500" />
            <span>биография</span>
          </div>
        </div>

        {/* The Exact Biography Quote requested by user */}
        <blockquote className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed italic border-l-3 border-pink-500 pl-3.5 my-3">
          "{profile.bio}"
        </blockquote>

        {/* Character Badges / Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-pink-200/60 mt-3">
          {profile.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold text-pink-800 liquid-glass px-2.5 py-1 rounded-full border border-white/70 shadow-xs capitalize"
            >
              #{tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
