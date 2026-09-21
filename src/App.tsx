/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab } from './types';
import { PROFILES, COVER_IMAGE } from './data/profiles';
import { LiquidBackground } from './components/LiquidBackground';
import { SplashScreen } from './components/SplashScreen';
import { TopNav } from './components/TopNav';
import { SidebarDrawer } from './components/SidebarDrawer';
import { PhotoReel } from './components/PhotoReel';
import { FriendshipCounter } from './components/FriendshipCounter';
import { FullscreenViewer } from './components/FullscreenViewer';
import { BarbieTitle } from './components/BarbieTitle';

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('milyi');
  const [fullscreenImage, setFullscreenImage] = useState<{
    src: string;
    caption?: string;
  } | null>(null);

  const currentProfile = activeTab === 'milyi' || activeTab === 'indus' ? PROFILES[activeTab] : null;

  return (
    <div className="relative min-h-screen w-full flex justify-center bg-pink-100 overflow-x-hidden font-sans no-scrollbar">
      {/* Animated Liquid Background with floating orbs & blur */}
      <LiquidBackground />

      {/* Main Mobile Frame Container (optimized for phones & centered on desktop) */}
      <div className="relative w-full max-w-[440px] min-h-screen flex flex-col justify-between z-10 overflow-hidden shadow-2xl bg-white/10 backdrop-blur-[2px] no-scrollbar">
        {/* Top iOS / Android status bar placeholder & Top Navigation */}
        {hasEntered && (
          <TopNav
            onOpenMenu={() => setIsMenuOpen(true)}
            isMenuOpen={isMenuOpen}
            activeTabTitle={
              activeTab === 'friendship'
                ? 'счетчик дружбы'
                : currentProfile?.tabTitle
            }
            onGoBackToCover={() => setHasEntered(false)}
          />
        )}

        {/* Dynamic Main Stage */}
        <main className="flex-1 w-full flex flex-col items-center justify-center relative pt-16 px-3">
          <AnimatePresence mode="wait">
            {!hasEntered ? (
              <motion.div
                key="splash-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                  filter: 'blur(8px)',
                  transition: { duration: 0.45 },
                }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <SplashScreen
                  coverImage={COVER_IMAGE}
                  onEnter={() => setHasEntered(true)}
                />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 26,
                }}
                className="w-full flex flex-col items-center justify-start min-h-[70vh] py-2"
              >
                {activeTab === 'friendship' ? (
                  <FriendshipCounter />
                ) : currentProfile ? (
                  <PhotoReel
                    profile={currentProfile}
                    onOpenFullscreen={(src, caption) =>
                      setFullscreenImage({ src, caption })
                    }
                  />
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Fixed Barbie Brand Title at the bottom of the screen */}
        {hasEntered && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              delay: 0.1,
            }}
            className="fixed bottom-0 inset-x-0 max-w-[440px] mx-auto z-20 pointer-events-auto"
          >
            <BarbieTitle
              size="bottom"
              onClick={() => setIsMenuOpen(true)}
            />
          </motion.div>
        )}

        {/* Sidebar Drawer Menu (Tabs: Милый ублюдок, Левый индус, Счетчик дружбы) */}
        <SidebarDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsMenuOpen(false);
          }}
        />

        {/* Fullscreen Lightbox / Photo Viewer */}
        <FullscreenViewer
          imageSrc={fullscreenImage?.src || null}
          caption={fullscreenImage?.caption}
          onClose={() => setFullscreenImage(null)}
        />
      </div>
    </div>
  );
}
