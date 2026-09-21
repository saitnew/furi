import React from 'react';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-[#ffe4ec] via-[#fed7e2] to-[#fbcfe8]">
      {/* GPU Accelerated Smooth Ambient Glows without heavy CPU JS calculations */}
      <div 
        className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-pink-300/40 blur-2xl animate-pulse"
        style={{ animationDuration: '6s', transform: 'translateZ(0)' }}
      />
      <div 
        className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-rose-300/35 blur-2xl animate-pulse"
        style={{ animationDuration: '8s', animationDelay: '1s', transform: 'translateZ(0)' }}
      />
      <div 
        className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-pink-400/30 blur-2xl animate-pulse"
        style={{ animationDuration: '7s', animationDelay: '2s', transform: 'translateZ(0)' }}
      />

      {/* Subtle glossy glass light shimmer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

