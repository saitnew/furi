import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ProfileData } from '../types';
import { Maximize2, ChevronUp, ChevronDown, Sparkles, Heart } from 'lucide-react';

interface PhotoReelProps {
  profile: ProfileData;
  onOpenFullscreen: (src: string, caption?: string) => void;
}

export const PhotoReel: React.FC<PhotoReelProps> = ({ profile, onOpenFullscreen }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const touchStartY = useRef<number | null>(null);
  const currentDrag = useRef<number>(0);
  const lastTouchTime = useRef<number>(0);
  const lastTouchY = useRef<number>(0);
  const velocityY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const photos = profile.photos;
  const totalPhotos = photos.length;

  // Preload images into memory
  useEffect(() => {
    photos.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [photos]);

  useEffect(() => {
    setCurrentIndex(0);
    setDragOffset(0);
  }, [profile.id]);

  const goToPhoto = (index: number) => {
    if (index >= 0 && index < totalPhotos) {
      setCurrentIndex(index);
    }
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
  }, [totalPhotos]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
  }, [totalPhotos]);

  // Touch interactions with live 1:1 finger tracking & momentum
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    lastTouchY.current = e.touches[0].clientY;
    lastTouchTime.current = performance.now();
    currentDrag.current = 0;
    velocityY.current = 0;
    isDragging.current = true;
    setIsSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || touchStartY.current === null) return;
    const clientY = e.touches[0].clientY;
    const now = performance.now();
    const dt = now - lastTouchTime.current;
    
    if (dt > 0) {
      velocityY.current = (clientY - lastTouchY.current) / dt;
    }
    lastTouchY.current = clientY;
    lastTouchTime.current = now;

    const diff = clientY - touchStartY.current;
    currentDrag.current = diff;
    setDragOffset(diff);
  };

  const onTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsSwiping(false);

    const delta = currentDrag.current;
    const vel = velocityY.current;
    currentDrag.current = 0;
    setDragOffset(0);
    touchStartY.current = null;

    // Swipe if moved > 50px or flicked with speed > 0.4px/ms
    if (delta < -45 || vel < -0.4) {
      handleNext();
    } else if (delta > 45 || vel > 0.4) {
      handlePrev();
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none pb-24">
      {/* Top Profile Header */}
      <div className="w-full max-w-sm mb-3 text-center transition-all duration-500 ease-out">
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
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="w-full h-full rounded-[20px] overflow-hidden relative bg-pink-100/50 shadow-inner group touch-none cursor-pointer"
            onClick={() => {
              if (Math.abs(dragOffset) < 5) {
                onOpenFullscreen(
                  photos[currentIndex],
                  `${profile.tabTitle} • Фото ${currentIndex + 1}/${totalPhotos}`
                );
              }
            }}
          >
            {/* 
              Ultra-smooth 120Hz Apple-like spring cubic-bezier track:
              When dragging: 0ms delay, follows finger 1:1.
              When released: 650ms luxurious, cinematic, buttery smooth gliding ease.
            */}
            <div
              className="w-full h-full"
              style={{
                transform: `translate3d(0, calc(-${currentIndex * 100}% + ${dragOffset}px), 0)`,
                transition: isSwiping
                  ? 'none'
                  : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform',
              }}
            >
              {photos.map((src, idx) => (
                <div key={idx} className="w-full h-full relative overflow-hidden flex-shrink-0">
                  <img
                    src={src}
                    alt={`${profile.tabTitle} фото ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
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

          {/* Floating Transparent/Glassy Vertical Dots inside the photo container */}
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
                    className={`w-2 h-2 rounded-full block transition-all duration-500 ease-out ${
                      isActive
                        ? 'bg-white scale-140 shadow-[0_0_8px_rgba(255,255,255,0.95)]'
                        : 'bg-white/40 scale-100 hover:bg-white/70'
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
        className="w-full max-w-sm mt-3 liquid-glass-card p-5 rounded-[24px] border border-white/80 shadow-md relative overflow-hidden transition-all duration-500 ease-out"
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
