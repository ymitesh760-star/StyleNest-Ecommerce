import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { LuxuryImage } from '../common/LuxuryImage';

interface SlideData {
  id: string;
  number: string;
  tagline: string;
  headlineWord1: string;
  headlineWord2: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  imageAlt: string;
}

const SLIDES: SlideData[] = [
  {
    id: 'timeless',
    number: '01',
    tagline: 'AUTUMN / WINTER 2026 COUTURE',
    headlineWord1: 'TIMELESS',
    headlineWord2: 'BY DESIGN',
    description: 'Refined collections. Exceptional craftsmanship. Made for the moments that matter.',
    ctaText: 'DISCOVER COLLECTION',
    ctaLink: '/men',
    image: '/images/hero-burgundy-model.jpg',
    imageAlt: 'Editorial model in royal burgundy tailored couture suit',
  },
  {
    id: 'drippy-capsule',
    number: '02',
    tagline: 'OFFICIAL COLLABORATION',
    headlineWord1: 'HERITAGE',
    headlineWord2: 'MEETS STREET',
    description: 'When centuries of royal Indian craftsmanship collide with the raw, uncompromising pulse of urban street culture.',
    ctaText: 'EXPLORE CAPSULE',
    ctaLink: '/new-arrivals',
    image: '/images/model-leaning.jpg',
    imageAlt: 'STYLENEST × DRIPPY contemporary luxury streetwear campaign',
  },
  {
    id: 'atelier-archive',
    number: '03',
    tagline: 'THE PRIVATE ATELIER',
    headlineWord1: 'BESPOKE',
    headlineWord2: 'ELEGANCE',
    description: 'Hand-loomed silks, artisanal Italian footwear, and rare botanicals distilled in Grasse.',
    ctaText: 'VIEW THE ARCHIVE',
    ctaLink: '/sale',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'StyleNest couture silk and tailored evening collection',
  },
];

export const HeroSection: React.FC = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides every 7 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = SLIDES[activeSlideIndex];

  const handlePrev = () => {
    setActiveSlideIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlideIndex((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <section 
      className="relative w-full bg-[#F8F0E2] overflow-hidden border-b border-[#D8BD83]/30 select-none transition-colors duration-700"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Editorial Campaign Hero"
    >
      {/* Editorial Architectural Curves & Watermark Background */}
      <div 
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        {/* Soft Champagne ambient glow */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#D8BD83]/15 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] rounded-full bg-[#4A0E1C]/5 blur-3xl" />

        {/* Faint Architectural Monogram & Interlocking Geometry */}
        <svg
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[70vw] max-w-[950px] h-auto text-[#D8BD83]/20 transition-opacity duration-1000"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="400" cy="400" r="380" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="400" cy="400" r="280" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="400" cy="400" rx="200" ry="340" stroke="currentColor" strokeWidth="1" />
          <ellipse cx="400" cy="400" rx="340" ry="200" stroke="currentColor" strokeWidth="0.8" />
          <path
            d="M 260 200 C 350 200, 450 300, 450 400 C 450 500, 550 600, 640 600"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>

        {/* Delicate grid watermark line */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#D8BD83_1px,transparent_1px),linear-gradient(to_bottom,#D8BD83_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-[0.07] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 lg:py-20 min-h-[580px] lg:min-h-[660px] flex flex-col justify-between">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto">
          
          {/* Left Column: Typography, Narrative & Primary CTA */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 lg:pr-4">
            
            {/* Atelier Micro-Header / Tagline */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#F2E6D2]/80 backdrop-blur-sm border border-[#D8BD83]/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A0E1C] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.28em] uppercase text-[#32141B]">
                {currentSlide.tagline}
              </span>
            </div>

            {/* Reference-Perfect Condensed Tall Serif Headline */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl xl:text-[6.5rem] tracking-[-0.02em] uppercase text-[#32141B] leading-[0.92] select-text">
                <span className="block font-normal tracking-tight font-serif-luxury">
                  {currentSlide.headlineWord1}
                </span>
                <span className="block italic font-light text-[#4A0E1C] tracking-normal">
                  {currentSlide.headlineWord2}
                </span>
              </h1>
            </div>

            {/* Editorial Subtitle Narrative */}
            <p className="text-xs sm:text-sm md:text-[15px] text-[#6A5559] max-w-xl font-normal leading-relaxed tracking-wide select-text">
              {currentSlide.description}
            </p>

            {/* Action CTA & Slide Arrows */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={currentSlide.ctaLink}
                className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 bg-[#4A0E1C] hover:bg-[#2A0710] text-[#F8F0E2] hover:text-[#D8BD83] text-xs font-bold uppercase tracking-[0.22em] border border-[#D8BD83]/40 hover:border-[#D8BD83] transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.99] group"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#D8BD83] group-hover:translate-x-1.5 transition-transform" />
              </Link>

              {/* Prev / Next controls for instant editorial browsing */}
              <div className="hidden sm:inline-flex items-center gap-1.5 ml-2">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 flex items-center justify-center border border-[#D8BD83]/40 hover:border-[#4A0E1C] bg-[#F2E6D2]/60 hover:bg-[#4A0E1C] text-[#32141B] hover:text-[#F8F0E2] transition-colors"
                  aria-label="Previous Campaign Look"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 flex items-center justify-center border border-[#D8BD83]/40 hover:border-[#4A0E1C] bg-[#F2E6D2]/60 hover:bg-[#4A0E1C] text-[#32141B] hover:text-[#F8F0E2] transition-colors"
                  aria-label="Next Campaign Look"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Model Photography Matching Reference Visual */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none">
              
              {/* Outer Decorative Architectural Border Ring */}
              <div className="relative p-2 sm:p-3 bg-[#F2E6D2]/60 border border-[#D8BD83]/40 shadow-[0_25px_60px_-15px_rgba(74,14,28,0.15)] group">
                
                {/* Model Image Frame */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#EFE7D7]">
                  <LuxuryImage
                    src={currentSlide.image}
                    alt={currentSlide.imageAlt}
                    className="w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    loading="eager"
                  />
                  
                  {/* Subtle editorial warm gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A0710]/40 via-transparent to-transparent opacity-40 pointer-events-none" />

                  {/* Corner Atelier Watermark Stamp */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#2A0710]/85 backdrop-blur-md border border-[#D8BD83]/30 text-[9px] font-mono uppercase tracking-[0.25em] text-[#D8BD83]">
                    ATELIER LOOK {currentSlide.number} &bull; MILAN SALONE
                  </div>
                </div>

                {/* Subtle outer accent corner lines */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#D8BD83]" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#D8BD83]" />
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Minimalist Horizontal Carousel Line: 01 ─────── 03 */}
        <div className="pt-8 sm:pt-10 flex items-center justify-between border-t border-[#D8BD83]/30">
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Current Slide Number */}
            <span className="font-mono text-xs sm:text-sm font-bold text-[#32141B] tracking-widest">
              {currentSlide.number}
            </span>

            {/* Horizontal Line with Segment Indicators */}
            <div className="flex items-center gap-2 w-32 sm:w-56 md:w-72">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className="flex-1 py-2 group cursor-pointer"
                  aria-label={`Jump to slide ${slide.number}`}
                >
                  <div 
                    className={`h-[2px] transition-all duration-500 ${
                      activeSlideIndex === idx
                        ? 'bg-[#4A0E1C] h-[3px]'
                        : 'bg-[#D8BD83]/50 group-hover:bg-[#4A0E1C]/60'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Total Slides Count */}
            <span className="font-mono text-xs sm:text-sm font-semibold text-[#89786C] tracking-widest">
              0{SLIDES.length}
            </span>

          </div>

          {/* Quick Category Badges on Desktop */}
          <div className="hidden md:flex items-center gap-6 text-[11px] font-mono uppercase tracking-widest text-[#6A5559]">
            <Link to="/men" className="hover:text-[#4A0E1C] transition-colors">
              Men&apos;s Tailoring
            </Link>
            <span className="text-[#D8BD83]">&bull;</span>
            <Link to="/shoes" className="hover:text-[#4A0E1C] transition-colors">
              Artisanal Footwear
            </Link>
            <span className="text-[#D8BD83]">&bull;</span>
            <Link to="/perfumes" className="hover:text-[#4A0E1C] transition-colors">
              Haute Parfumerie
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
