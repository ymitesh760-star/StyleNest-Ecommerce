import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LuxuryImage } from '../common/LuxuryImage';

export const EditorialBanner: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#FFFFFF] border-y border-[rgba(185,154,107,0.22)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left: Editorial Campaign Visual with Offset Frame */}
          <div className="lg:col-span-7 relative">
            <div className="aspect-[16/10] sm:aspect-[16/9] rounded-xs overflow-hidden bg-[#F8F6F2] shadow-luxury group border border-[rgba(185,154,107,0.22)]">
              <LuxuryImage
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85"
                alt="StyleNest Editorial Campaign - The Art of Everyday Poise"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                loading="lazy"
              />
            </div>
            
            {/* Editorial Label Tag */}
            <div className="absolute -bottom-4 right-6 bg-[#0A0A0A] text-white px-5 py-3 shadow-luxury hidden sm:block border-l-2 border-[#B99A6B]">
              <p className="text-[10px] uppercase tracking-widest-luxury text-[#B99A6B] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#B99A6B]" />
                <span>Campaign Atelier</span>
              </p>
              <p className="font-serif-luxury text-sm tracking-wide text-[#F8F6F2]">
                Autumn / Winter 2026 &bull; Milan Salone
              </p>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] uppercase tracking-widest-luxury text-[#B99A6B] font-bold block">
              Editorial Spotlight
            </span>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A0A0A] leading-[1.12]">
              The Art of <br />
              <span className="italic font-normal text-[#B99A6B]">Everyday Poise.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#777777] leading-relaxed font-light">
              True elegance is never forced; it is the quiet confidence that arises when deliberate silhouette, 
              noble textiles, and artisanal integrity converge. Each piece from our Atelier is designed 
              to move organically with your daily rhythm, from private morning salons to twilight galas.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/men"
                className="btn-primary flex items-center justify-center gap-2 group"
              >
                <span>Explore Menswear Atelier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shoes"
                className="btn-secondary flex items-center justify-center"
              >
                Discover Footwear
              </Link>
            </div>

            {/* Quote block */}
            <div className="pt-6 border-t border-[rgba(185,154,107,0.22)]">
              <blockquote className="font-serif-luxury italic text-[#171717] text-sm sm:text-base leading-relaxed">
                "Simplicity is the keynote of all true elegance."
              </blockquote>
              <p className="text-[10px] uppercase tracking-wider-luxury text-[#777777] mt-1 font-semibold">
                — StyleNest Creative Direction &bull; Paris
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
