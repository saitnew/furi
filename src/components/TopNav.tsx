import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface TopNavProps {
  onOpenMenu: () => void;
  isMenuOpen: boolean;
  activeTabTitle?: string;
  onGoBackToCover?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenMenu,
  isMenuOpen,
  activeTabTitle,
  onGoBackToCover,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 pt-safe px-4 py-3 flex items-center justify-between pointer-events-none">
      {/* Three vertical bars button */}
      <motion.button
        id="btn-open-drawer"
        type="button"
        onClick={onOpenMenu}
        initial={{ opacity: 0, scale: 0.6, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="pointer-events-auto liquid-glass flex items-center justify-center gap-1.5 w-12 h-12 rounded-2xl cursor-pointer transition-all duration-300 active:bg-white/50 group"
        aria-label="Открыть меню"
        title="Открыть меню"
      >
        <div className="flex items-center gap-1">
          <motion.span
            animate={isMenuOpen ? { height: '18px', backgroundColor: '#f43f5e' } : { height: '22px', backgroundColor: '#ec4899' }}
            transition={{ duration: 0.25 }}
            className="w-1 rounded-full shadow-sm"
          />
          <motion.span
            animate={isMenuOpen ? { height: '24px', backgroundColor: '#f43f5e' } : { height: '16px', backgroundColor: '#ec4899' }}
            transition={{ duration: 0.25 }}
            className="w-1 rounded-full shadow-sm"
          />
          <motion.span
            animate={isMenuOpen ? { height: '18px', backgroundColor: '#f43f5e' } : { height: '22px', backgroundColor: '#ec4899' }}
            transition={{ duration: 0.25 }}
            className="w-1 rounded-full shadow-sm"
          />
        </div>
      </motion.button>

      {/* Active Tab Pill Indicator */}
      {activeTabTitle && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto liquid-glass px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/50 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span className="text-xs font-semibold text-pink-900 tracking-wide capitalize">
            {activeTabTitle}
          </span>
        </motion.div>
      )}

      {/* Right mini action: return to cover or heart sparkle */}
      <motion.button
        id="btn-return-cover"
        type="button"
        onClick={onGoBackToCover}
        initial={{ opacity: 0, scale: 0.6, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="pointer-events-auto liquid-glass w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer text-pink-500 hover:text-pink-600 transition-colors"
        title="На главный экран"
      >
        <Heart className="w-5 h-5 fill-pink-400/30 text-pink-500" />
      </motion.button>
    </header>
  );
};
