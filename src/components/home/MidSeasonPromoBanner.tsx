import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LuxuryImage } from '../common/LuxuryImage';

export const MidSeasonPromoBanner: React.FC = () => {
  return (
    <section className="w-full bg-[#EFECE6] border-y border-black/10 py-12 sm:py-16 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8 lg:gap-12">
          
          {/* Left: Editorial Narrative */}
          <div className="md:col-span-7 space-y-4">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#991B1B] uppercase block">
              STYLENEST &times; DRIPPY &bull; CAPSULE DROP
            </span>

            <h2 className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl tracking-[-0.03em] text-[#0A0A0A] uppercase leading-[0.95]">
              COUTURE <br />
              <span className="font-serif italic font-normal text-[#991B1B] lowercase">streetwear.</span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-md font-normal leading-relaxed pt-1">
              Regal Indian heritage meets raw metropolitan energy. Heavyweight fleece, hand-woven silks, and artisan streetwear drops.
            </p>

            <div className="pt-2">
              <Link
                to="/new-arrivals"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0A0A0A] hover:bg-[#262626] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 border border-[#991B1B]/40"
              >
                <span>EXPLORE CAPSULE DROP</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#991B1B]" />
              </Link>
            </div>
          </div>

          {/* Right: Model Cutout Image */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="w-full max-w-sm aspect-[4/5] rounded-xs overflow-hidden shadow-lg border border-black/10">
              <LuxuryImage
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
                alt="New Vibes Editorial"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
