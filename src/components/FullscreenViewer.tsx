import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, Download, Heart } from 'lucide-react';

interface FullscreenViewerProps {
  imageSrc: string | null;
  caption?: string;
  onClose: () => void;
}

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
  imageSrc,
  caption,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {imageSrc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-pink-950/80 backdrop-blur-2xl"
          onClick={onClose}
        >
          {/* Top Bar with Close button (крестик) */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
            <div className="liquid-glass px-4 py-1.5 rounded-full text-white/90 text-xs font-semibold pointer-events-auto border border-white/30">
              Полноэкранный просмотр
            </div>

            {/* X Close button */}
            <motion.button
              id="btn-close-fullscreen"
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="pointer-events-auto w-11 h-11 rounded-full liquid-glass-darker flex items-center justify-center text-pink-600 bg-white/90 border border-white shadow-xl cursor-pointer"
              aria-label="Закрыть"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </motion.button>
          </div>

          {/* Fullscreen Photo Container */}
          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full max-h-[82vh] rounded-3xl overflow-hidden liquid-glass-card p-2 border border-white/60 shadow-[0_30px_70px_rgba(0,0,0,0.4)] flex flex-col items-center"
          >
            <div className="relative w-full max-h-[72vh] rounded-2xl overflow-hidden bg-pink-900/10 flex items-center justify-center">
              <img
                src={imageSrc}
                alt={caption || 'Полноэкранное фото'}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[72vh] object-contain rounded-2xl"
              />
            </div>

            {caption && (
              <div className="w-full pt-3 pb-1 px-3 text-center">
                <p className="text-xs font-semibold text-pink-900/90 tracking-wide">
                  {caption}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
