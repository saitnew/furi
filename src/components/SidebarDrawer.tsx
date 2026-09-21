import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab } from '../types';
import { Heart, Flame, Clock, X, Sparkles, ChevronRight } from 'lucide-react';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
}) => {
  const menuItems: Array<{
    id: ActiveTab;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: 'milyi',
      title: 'милый ублюдок',
      subtitle: 'фагнер • забияка • читер',
      icon: <Heart className="w-5 h-5 fill-pink-300 text-pink-600" />,
      color: 'from-pink-500 to-rose-400',
    },
    {
      id: 'indus',
      title: 'левый индус',
      subtitle: 'сабзиро • подонок кун',
      icon: <Flame className="w-5 h-5 fill-amber-300 text-rose-600" />,
      color: 'from-rose-500 to-pink-400',
    },
    {
      id: 'friendship',
      title: 'счетчик дружбы',
      subtitle: 'каждый день в 7:00 утра',
      icon: <Clock className="w-5 h-5 text-fuchsia-600" />,
      color: 'from-fuchsia-500 to-pink-500',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dimmed backdrop with liquid blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-pink-950/25 backdrop-blur-md transition-opacity cursor-pointer"
          />

          {/* Liquid Glass Sidebar Drawer */}
          <motion.aside
            id="sidebar-drawer"
            initial={{ x: '-100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
            className="fixed top-0 bottom-0 left-0 z-50 w-[82%] max-w-[320px] liquid-glass-darker border-r border-white/80 shadow-[0_25px_60px_-15px_rgba(244,63,94,0.35)] flex flex-col justify-between p-5 pt-safe pb-safe overflow-y-auto no-scrollbar"
          >
            {/* Specular gloss top light */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

            {/* Header with Title & Close */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-pink-200/60 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl liquid-glass flex items-center justify-center border border-white/80 shadow-sm">
                    <Sparkles className="w-5 h-5 text-pink-500 fill-pink-300" />
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#e0218a]"
                      style={{ fontFamily: "'Pacifico', cursive" }}
                    >
                      фури мальчики
                    </h2>
                  </div>
                </div>

                <button
                  id="btn-close-drawer"
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-pink-600 hover:bg-white/60 active:scale-90 transition-all cursor-pointer"
                  aria-label="Закрыть"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Menu Tabs */}
              <nav className="space-y-3">
                <p className="text-[11px] font-bold text-pink-800/70 tracking-wider uppercase px-2 mb-2">
                  разделы архива
                </p>
                {menuItems.map((item, index) => {
                  const isActive = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      id={`tab-btn-${item.id}`}
                      type="button"
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between relative overflow-hidden group cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-white/90 via-pink-50/90 to-white/70 border border-pink-300 shadow-md'
                          : 'liquid-glass hover:bg-white/60 border border-white/50 shadow-sm'
                      }`}
                    >
                      {/* Active glowing accent strip */}
                      {isActive && (
                        <motion.div
                          layoutId="active-tab-strip"
                          className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-gradient-to-b from-pink-500 to-rose-400 shadow-sm"
                        />
                      )}

                      <div className="flex items-center gap-3 pl-1">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md'
                              : 'bg-white/70 shadow-sm'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-pink-500/80">
                              0{index + 1}
                            </span>
                            <span
                              className={`text-base font-bold tracking-tight capitalize ${
                                isActive ? 'text-pink-900' : 'text-slate-800'
                              }`}
                            >
                              {item.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-pink-700/70 truncate max-w-[150px]">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive
                            ? 'text-pink-600 translate-x-0.5'
                            : 'text-pink-400 group-hover:translate-x-0.5'
                        }`}
                      />
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom mini status in Drawer */}
            <div className="pt-4 border-t border-pink-200/50 flex flex-col gap-2">
              <div className="liquid-glass p-3 rounded-xl border border-white/60 text-center">
                <p className="text-xs font-semibold text-pink-900">
                  создано для фури пацiков
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
