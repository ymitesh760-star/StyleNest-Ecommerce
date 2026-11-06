import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LuxuryImage } from '../common/LuxuryImage';

export const EditorialBanner: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#F8F0E2] border-y border-[#D8BD83]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left: Editorial Campaign Visual with Offset Frame */}
          <div className="lg:col-span-7 relative">
            <div className="aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#EFE7D7] shadow-xl group border border-[#D8BD83]/40">
              <LuxuryImage
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85"
                alt="StyleNest Editorial Campaign - The Art of Everyday Poise"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                loading="lazy"
              />
            </div>
            
            {/* Editorial Label Tag */}
            <div className="absolute -bottom-4 right-6 bg-[#2A0710] text-[#F8F0E2] px-5 py-3 shadow-2xl hidden sm:block border-l-2 border-[#D8BD83]">
              <p className="text-[10px] uppercase tracking-widest text-[#D8BD83] font-bold flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3 h-3 text-[#D8BD83]" />
                <span>Campaign Atelier</span>
              </p>
              <p className="font-serif text-sm tracking-wide text-[#F8F0E2]">
                Autumn / Winter 2026 &bull; Milan Salone
              </p>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#4A0E1C] font-bold block">
              Editorial Spotlight
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#32141B] leading-[1.12]">
              The Art of <br />
              <span className="italic font-normal text-[#4A0E1C]">Everyday Poise.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#89786C] leading-relaxed font-normal">
              True elegance is never forced; it is the quiet confidence that arises when deliberate silhouette, 
              noble textiles, and artisanal integrity converge. Each piece from our Atelier is designed 
              to move organically with your daily rhythm, from private morning salons to twilight galas.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/men"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#4A0E1C] hover:bg-[#2A0710] text-[#F8F0E2] hover:text-[#D8BD83] text-xs font-bold uppercase tracking-[0.2em] border border-[#D8BD83]/40 transition-all duration-300 shadow-md group"
              >
                <span>Explore Menswear Atelier</span>
                <ArrowRight className="w-4 h-4 text-[#D8BD83] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shoes"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-transparent hover:bg-[#4A0E1C] text-[#32141B] hover:text-[#F8F0E2] text-xs font-bold uppercase tracking-[0.2em] border border-[#D8BD83]/70 hover:border-[#4A0E1C] transition-all duration-300"
              >
                Discover Footwear
              </Link>
            </div>

            {/* Quote block */}
            <div className="pt-6 border-t border-[#D8BD83]/30">
              <blockquote className="font-serif italic text-[#32141B] text-sm sm:text-base leading-relaxed">
                &ldquo;Simplicity is the keynote of all true elegance.&rdquo;
              </blockquote>
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#89786C] mt-1 font-semibold">
                — StyleNest Creative Direction &bull; Paris
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
