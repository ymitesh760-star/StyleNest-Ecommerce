import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  {
    prefix: 'STYLENEST × DRIPPY',
    text: 'Indian Couture Meets Streetwear — Exclusive Collaborative Capsule Drop Live',
    cta: 'Explore Capsule',
    link: '/new-arrivals',
  },
  {
    prefix: 'PRIVÉ INVITATION',
    text: 'Enjoy 20% Off Collaborative Drops — Use Code DRIPPY20 at Checkout',
    cta: 'Shop Now',
    link: '/men',
  },
  {
    prefix: 'COMPLIMENTARY DELIVERY',
    text: 'Free Express Shipping Across India on Orders Above ₹1,999 + 14-Day Doorstep Returns',
    cta: 'Explore All',
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
    }, 4500);
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
      className="bg-[#0A0A0A] text-[#F8F6F2] text-[10px] font-semibold tracking-wider border-b border-black select-none uppercase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Promotional announcements"
    >
      <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between">
        {/* Left: Free delivery badge */}
        <div className="hidden lg:flex items-center gap-2 text-white/80">
          <span>FREE DELIVERY ON ORDERS ABOVE ₹1,999</span>
        </div>

        {/* Center: Slide Content */}
        <div className="flex items-center justify-center flex-1 lg:flex-initial gap-2 text-center">
          <button
            onClick={() => changeSlide(currentIndex === 0 ? ANNOUNCEMENTS.length - 1 : currentIndex - 1)}
            className="p-1 text-[#777777] hover:text-white transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <span className="text-white font-bold">{current.prefix}:</span>
          <span className="truncate max-w-xs sm:max-w-md text-white/90">{current.text}</span>
          <button
            onClick={() => changeSlide((currentIndex + 1) % ANNOUNCEMENTS.length)}
            className="p-1 text-[#777777] hover:text-white transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Quick Links */}
        <div className="hidden lg:flex items-center gap-3 text-[9px] text-[#A3A3A3] font-medium tracking-wider">
          <Link to="/account" className="hover:text-white transition-colors">TRACK ORDER</Link>
          <span>|</span>
          <Link to="/sale" className="hover:text-white transition-colors">ARCHIVE 20% OFF</Link>
          <span>|</span>
          <a href="mailto:concierge@stylenest.com" className="hover:text-white transition-colors">HELP</a>
        </div>
      </div>
    </div>
  );
};
