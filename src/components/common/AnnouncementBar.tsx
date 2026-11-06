import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  {
    prefix: 'COMPLIMENTARY DELIVERY',
    text: 'Complimentary White-Glove Shipping On All Orders Above ₹1,999',
    cta: 'Explore Capsule',
    link: '/new-arrivals',
  },
  {
    prefix: 'HAUTE COUTURE DROP',
    text: 'STYLENEST × DRIPPY Indian Couture Meets Contemporary Streetwear',
    cta: 'Shop Now',
    link: '/men',
  },
  {
    prefix: 'PRIVÉ INVITATION',
    text: 'Private Member Atelier Privilege — 20% Off With Code DRIPPY20',
    cta: 'Discover',
    link: '/shoes',
  },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      changeSlide((currentIndex + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const changeSlide = (newIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 180);
  };

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div
      className="bg-[#2A0710] text-[#F8F0E2] text-[10px] font-medium tracking-[0.22em] border-b border-[#4A0E1C]/60 select-none uppercase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Promotional announcements"
    >
      <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between">
        {/* Left: Free delivery badge */}
        <div className="hidden lg:flex items-center gap-2 text-[#D8BD83]/90 text-[9.5px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D8BD83] animate-pulse" />
          <span>MAISON PRIVÉ ATELIER</span>
        </div>

        {/* Center: Slide Content */}
        <div className="flex items-center justify-center flex-1 lg:flex-initial gap-2 text-center">
          <button
            onClick={() => changeSlide(currentIndex === 0 ? ANNOUNCEMENTS.length - 1 : currentIndex - 1)}
            className="p-1 text-[#D8BD83]/60 hover:text-[#D8BD83] transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <span className="text-[#D8BD83] font-bold">{current.prefix}:</span>
          <span className="truncate max-w-xs sm:max-w-md text-[#F8F0E2]/90">{current.text}</span>
          <button
            onClick={() => changeSlide((currentIndex + 1) % ANNOUNCEMENTS.length)}
            className="p-1 text-[#D8BD83]/60 hover:text-[#D8BD83] transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Quick Links */}
        <div className="hidden lg:flex items-center gap-3 text-[9px] text-[#F2E6D2]/70 font-medium tracking-wider">
          <Link to="/account" className="hover:text-[#D8BD83] transition-colors">TRACK ORDER</Link>
          <span className="text-[#D8BD83]/40">|</span>
          <Link to="/sale" className="hover:text-[#D8BD83] transition-colors">ARCHIVE 20% OFF</Link>
          <span className="text-[#D8BD83]/40">|</span>
          <a href="mailto:concierge@stylenest.com" className="hover:text-[#D8BD83] transition-colors">CONCIERGE</a>
        </div>
      </div>
    </div>
  );
};
