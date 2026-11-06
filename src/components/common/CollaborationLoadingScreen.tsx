import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';

export const CollaborationLoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if splash has already been shown in this tab session
    const hasSeenSplash = sessionStorage.getItem('stylenest_drippy_splash');
    if (hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 700);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('stylenest_drippy_splash', 'true');
    }, 1100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F0E2] transition-opacity duration-500 select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="status"
      aria-label="Loading STYLENEST × DRIPPY"
    >
      <div className="flex flex-col items-center animate-fade-in px-4">
        {/* Collaboration Logo Lockup */}
        <BrandLogo layout="stacked" size="xl" showSubtitle={true} asLink={false} />

        {/* Minimal Progress Hairline */}
        <div className="w-48 h-[1.5px] bg-[#D8BD83]/30 mt-6 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-[#4A0E1C] w-full animate-pulse" />
        </div>

        {/* Tagline */}
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#89786C] mt-4 font-bold">
          Indian Couture Meets Streetwear
        </span>
      </div>
    </div>
  );
};

