import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Award } from 'lucide-react';
import { LuxuryImage } from '../common/LuxuryImage';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full bg-[#FAF8F5] overflow-hidden border-b border-black/10 select-none">
      {/* Subtle Ambient Radial Lighting for Warm Luxury Depth (No Clutter, 0 Overflow) */}
      <div 
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#B99A6B]/5 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-[#991B1B]/4 blur-3xl" />
        {/* Delicate Atelier Grid Hairlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Narrative & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Atelier Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/90 backdrop-blur-sm border border-[#B99A6B]/35 shadow-xs text-[#0A0A0A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B] animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-[0.28em] uppercase text-[#171717]">
                STYLENEST &times; DRIPPY &bull; CAPSULE 2026
              </span>
            </div>

            {/* Headline with Haute-Couture Editorial Balance */}
            <div className="space-y-2">
              <h1 className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl xl:text-[5.1rem] tracking-tight uppercase text-[#0A0A0A] leading-[0.96]">
                Indian Couture <br />
                <span className="font-serif italic font-normal text-[#991B1B] normal-case tracking-tight text-[0.9em]">
                  meets streetwear.
                </span>
              </h1>
            </div>

            {/* Narrative Description */}
            <p className="text-xs sm:text-sm text-[#44403C] max-w-xl font-normal leading-relaxed tracking-wide">
              An explosive convergence of regal Indian heritage craftsmanship and raw urban street culture. 
              Hand-loomed silks, bespoke zardozi embroidery, and relaxed streetwear silhouettes crafted for modern individuality.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/new-arrivals"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.2em] border border-[#B99A6B]/50 hover:border-[#B99A6B] transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.99] group"
              >
                <span>Explore The Collaboration</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B99A6B] group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                to="/men"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-[#0A0A0A] hover:text-white text-[#0A0A0A] text-xs font-bold uppercase tracking-[0.2em] border border-black/25 hover:border-black transition-all duration-300 active:scale-[0.99]"
              >
                <span>Shop Streetwear Drops</span>
              </Link>
            </div>

            {/* Provenance Micro-Badges */}
            <div className="pt-5 border-t border-black/10 grid grid-cols-3 gap-3 text-neutral-600 text-[10px] font-mono font-semibold tracking-wider uppercase">
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#B99A6B] shrink-0" />
                <span className="truncate">Hand-Loomed Silks</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B99A6B] shrink-0" />
                <span className="truncate">Bespoke Embroidery</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#B99A6B] shrink-0" />
                <span className="truncate">Express Delivery</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Fashion Parisian Editorial Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Outer Passe-Partout White Gallery Matting Frame */}
              <div className="p-2 sm:p-2.5 bg-white border border-[#E5DFD5] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.14)] relative">
                
                {/* Image Container */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#F4F1EA] group">
                  <LuxuryImage
                    src="/images/hero-model.jpg"
                    alt="STYLENEST × DRIPPY Leaning Model Campaign"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                  />

                  {/* High-Fashion Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-90 pointer-events-none" />

                  {/* Top Corner Limited Edition Stamp */}
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-md border border-black/10 text-[9px] font-mono font-bold uppercase tracking-[0.22em] text-[#0A0A0A] shadow-xs">
                    ÉDITION LIMITÉE &bull; 01/50
                  </div>

                  {/* Floating Editorial Atelier Plaque at the Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 sm:p-4 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/15 text-white shadow-xl">
                    <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.22em] text-[#C5A880] mb-1">
                      <span>LOOK 01 &bull; STYLENEST &times; DRIPPY</span>
                      <span className="text-[#EF4444] font-semibold">AUTOMNE / HIVER 2026</span>
                    </div>
                    <h3 className="text-xs font-bold tracking-wider uppercase text-white truncate">
                      Avenue des Champs-Élysées &bull; Oversized Atelier Fleece
                    </h3>
                  </div>
                </div>

              </div>

              {/* Decorative Subtle Champagne Gold Frame Offset Behind */}
              <div className="absolute -inset-2.5 border border-[#B99A6B]/35 pointer-events-none -z-10 translate-x-3 translate-y-3 hidden sm:block" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};