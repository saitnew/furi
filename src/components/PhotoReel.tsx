import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ProfileData } from '../types';
import { Maximize2, ChevronUp, ChevronDown, Sparkles, Heart } from 'lucide-react';

interface PhotoReelProps {
  profile: ProfileData;
  onOpenFullscreen: (src: string, caption?: string) => void;
}

export const PhotoReel: React.FC<PhotoReelProps> = ({ profile, onOpenFullscreen }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const touchStartY = useRef<number | null>(null);
  const currentDragY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const isAnimating = useRef<boolean>(false);

  const photos = profile.photos;
  const totalPhotos = photos.length;

  // Preload all images so there is never a flash or render pause
  useEffect(() => {
    photos.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [photos]);

  // Reset index when switching profiles
  useEffect(() => {
    setCurrentIndex(0);
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
  }, [profile.id]);

  // Smooth cinematic gliding transition
  const animateToSlide = useCallback((index: number) => {
    if (!trackRef.current) return;
    isAnimating.current = true;
    setCurrentIndex(index);

    // 0.75s ultra-fluid Apple Spring/Bezier curve
    trackRef.current.style.transition = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
    trackRef.current.style.transform = `translate3d(0, -${index * 100}%, 0)`;

    setTimeout(() => {
      isAnimating.current = false;
    }, 750);
  }, []);

  const handleNext = useCallback(() => {
    if (isAnimating.current) return;
    const nextIdx = currentIndex < totalPhotos - 1 ? currentIndex + 1 : 0;
    animateToSlide(nextIdx);
  }, [currentIndex, totalPhotos, animateToSlide]);

  const handlePrev = useCallback(() => {
    if (isAnimating.current) return;
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : totalPhotos - 1;
    animateToSlide(prevIdx);
  }, [currentIndex, totalPhotos, animateToSlide]);

  const goToPhoto = (index: number) => {
    if (isAnimating.current || index === currentIndex) return;
    animateToSlide(index);
  };

  // Direct DOM Touch handling - avoids React 60Hz re-render overhead for true 120Hz display
  const onTouchStart = (e: React.TouchEvent) => {
    if (isAnimating.current) return;
    touchStartY.current = e.touches[0].clientY;
    currentDragY.current = 0;
    isDragging.current = true;

    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || touchStartY.current === null || !trackRef.current) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    currentDragY.current = diff;

    // Apply direct style transform without triggering React setState
    const baseOffset = -currentIndex * 100;
    trackRef.current.style.transform = `translate3d(0, calc(${baseOffset}% + ${diff}px), 0)`;
  };

  const onTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = currentDragY.current;
    touchStartY.current = null;
    currentDragY.current = 0;

    // Sensitivity threshold: 35px
    if (delta < -35) {
      const nextIdx = currentIndex < totalPhotos - 1 ? currentIndex + 1 : 0;
      animateToSlide(nextIdx);
    } else if (delta > 35) {
      const prevIdx = currentIndex > 0 ? currentIndex - 1 : totalPhotos - 1;
      animateToSlide(prevIdx);
    } else {
      // Snap back smoothly
      animateToSlide(currentIndex);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none pb-24">
      {/* Top Profile Header */}
      <div className="w-full max-w-sm mb-3 text-center transition-all duration-700 ease-out">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-white/60 mb-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-300" />
          <span className="text-[11px] font-bold tracking-wider text-pink-800 uppercase">
            {profile.subtitle}
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-800 capitalize">
          {profile.tabTitle}
        </h2>
      </div>

      {/* Main Interactive Stage with Photo Slider Container */}
      <div className="w-full max-w-sm flex items-center justify-center gap-3 my-2 px-2 relative">
        {/* Photo Container */}
        <div className="relative w-full aspect-[3/4] max-h-[440px] rounded-[28px] p-2 liquid-glass-card shadow-lg overflow-hidden">
          {/* Top gloss line */}
          <div className="absolute inset-x-4 top-2 h-8 rounded-t-[20px] bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-10" />

          {/* Swipeable Viewport */}
          <div
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="w-full h-full rounded-[20px] overflow-hidden relative bg-pink-100/50 shadow-inner group touch-none cursor-pointer"
            onClick={() => {
              if (Math.abs(currentDragY.current) < 5) {
                onOpenFullscreen(
                  photos[currentIndex],
                  `${profile.tabTitle} • Фото ${currentIndex + 1}/${totalPhotos}`
                );
              }
            }}
          >
            {/* 
              Direct Hardware Composite Layer:
              Controlled via trackRef.style.transform in touch handlers.
              Bypasses React DOM diffing completely on 120Hz displays.
            */}
            <div
              ref={trackRef}
              className="w-full h-full"
              style={{
                transform: `translate3d(0, -${currentIndex * 100}%, 0)`,
                willChange: 'transform',
              }}
            >
              {photos.map((src, idx) => (
                <div key={idx} className="w-full h-full relative overflow-hidden flex-shrink-0">
                  <img
                    src={src}
                    alt={`${profile.tabTitle} фото ${idx + 1}`}
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center pointer-events-none select-none"
                    style={{ transform: 'translateZ(0)' }}
                  />
                  {/* Subtle photo contrast scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Floating Tap to Expand Hint */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
              <div className="liquid-glass-darker px-3 py-1 rounded-full text-[11px] font-bold text-pink-700 flex items-center gap-1.5 shadow-sm">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>на весь экран</span>
              </div>
              <div className="liquid-glass px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-sm">
                0{currentIndex + 1} / 0{totalPhotos}
              </div>
            </div>
          </div>

          {/* Quick Tap arrows with smooth hover and click */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="w-8 h-8 rounded-full liquid-glass-darker flex items-center justify-center text-pink-700 shadow-md active:scale-85 transition-all duration-300 ease-out cursor-pointer hover:bg-white"
              title="Предыдущее фото"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="w-8 h-8 rounded-full liquid-glass-darker flex items-center justify-center text-pink-700 shadow-md active:scale-85 transition-all duration-300 ease-out cursor-pointer hover:bg-white"
              title="Следующее фото"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Floating Transparent/Glassy Vertical Dots */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5 z-20 py-2.5 px-1.5 rounded-full bg-black/25 backdrop-blur-xs border border-white/20 shadow-md">
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
                  className="p-1 flex items-center justify-center cursor-pointer"
                  title={`Фото ${idx + 1}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full block transition-all duration-700 ease-out ${
                      isActive
                        ? 'bg-white scale-140 shadow-[0_0_8px_rgba(255,255,255,0.95)]'
                        : 'bg-white/40 scale-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Biography Section under the 3 photos */}
      <div
        key={`bio-${profile.id}`}
        className="w-full max-w-sm mt-3 liquid-glass-card p-5 rounded-[24px] border border-white/80 shadow-md relative overflow-hidden transition-all duration-700 ease-out"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-800 uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-pink-400 text-pink-500" />
            <span>биография</span>
          </div>
        </div>

        {/* The Exact Biography Quote */}
        <blockquote className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed italic border-l-3 border-pink-500 pl-3.5 my-3">
          "{profile.bio}"
        </blockquote>

        {/* Character Badges / Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-pink-200/60 mt-3">
          {profile.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold text-pink-800 liquid-glass px-2.5 py-1 rounded-full border border-white/70 shadow-2xs capitalize"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
