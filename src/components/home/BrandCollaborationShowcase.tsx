import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { LuxuryImage } from '../common/LuxuryImage';

export const BrandCollaborationShowcase: React.FC = () => {
  return (
    <section className="w-full bg-[#F8F0E2] py-16 sm:py-24 border-y border-[#D8BD83]/30 relative overflow-hidden">
      {/* Subtle Architectural Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-25 z-0">
        <span className="font-serif italic text-[13vw] font-bold text-[#4A0E1C]/[0.05] tracking-widest leading-none">
          COUTURE &times; STREET
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Collaboration Header Lockup */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F2E6D2] border border-[#D8BD83]/60 mb-6 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#4A0E1C]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#4A0E1C] uppercase">
              OFFICIAL BRAND COLLABORATION
            </span>
          </div>

          {/* Centered Large Stacked Logo Lockup */}
          <div className="py-2 mb-4">
            <BrandLogo layout="stacked" size="xl" showSubtitle={true} asLink={false} />
          </div>

          <p className="font-serif italic text-xl sm:text-2xl text-[#32141B] max-w-xl mx-auto mt-2 leading-snug">
            &ldquo;When centuries of royal Indian craftsmanship collide with the raw, uncompromising pulse of urban street culture.&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-[#89786C] max-w-lg mx-auto mt-4 leading-relaxed font-normal">
            An exclusive limited-edition capsule marrying centuries-old hand-embroidery, regal brocades, and pure mulberries with relaxed oversized streetwear architecture.
          </p>
        </div>

        {/* 3 Collaboration Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          
          {/* Pillar 1: Zardozi Meets Heavyweight Terry */}
          <div className="bg-[#F8F0E2] p-6 sm:p-8 border border-[#D8BD83]/40 hover:border-[#4A0E1C] transition-all duration-300 group shadow-xs">
            <div className="aspect-[4/5] bg-[#EFE7D7] overflow-hidden mb-6 relative">
              <LuxuryImage
                src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
                alt="Zardozi Embroidered Streetwear Bomber"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#4A0E1C] text-[#F8F0E2] text-[9px] font-mono font-bold uppercase tracking-wider border border-[#D8BD83]/30">
                LOOK 01
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A0E1C] block mb-1">
              Indian Zardozi &bull; 460GSM Terry
            </span>
            <h3 className="font-serif text-lg uppercase text-[#32141B] mb-2 font-bold">
              Royal Zardozi Street Bomber
            </h3>
            <p className="text-xs text-[#89786C] leading-relaxed font-normal mb-4">
              Hand-spun heavyweight organic fleece detailed with antique bullion wire needlework created in our Jaipur atelier.
            </p>
            <Link
              to="/new-arrivals"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4A0E1C] group-hover:text-[#651C2D] transition-colors"
            >
              <span>View Piece</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#D8BD83]" />
            </Link>
          </div>

          {/* Pillar 2: Pure Silk Street Utility */}
          <div className="bg-[#F8F0E2] p-6 sm:p-8 border border-[#D8BD83]/40 hover:border-[#4A0E1C] transition-all duration-300 group shadow-xs">
            <div className="aspect-[4/5] bg-[#EFE7D7] overflow-hidden mb-6 relative">
              <LuxuryImage
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
                alt="Mulberry Silk Cargo Trousers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#2A0710] text-[#D8BD83] text-[9px] font-mono font-bold uppercase tracking-wider border border-[#D8BD83]/30">
                LOOK 02
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D8BD83] block mb-1">
              100% Mulberry Silk &bull; Relaxed Fit
            </span>
            <h3 className="font-serif text-lg uppercase text-[#32141B] mb-2 font-bold">
              Raw Silk Utilitarian Cargo
            </h3>
            <p className="text-xs text-[#89786C] leading-relaxed font-normal mb-4">
              Bespoke drapey raw silk paired with tactical drop pockets and brass drawcords, bridging palace elegance with downtown swagger.
            </p>
            <Link
              to="/men"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4A0E1C] group-hover:text-[#651C2D] transition-colors"
            >
              <span>View Piece</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#D8BD83]" />
            </Link>
          </div>

          {/* Pillar 3: Heavyweight Boxy Tee */}
          <div className="bg-[#F8F0E2] p-6 sm:p-8 border border-[#D8BD83]/40 hover:border-[#4A0E1C] transition-all duration-300 group shadow-xs">
            <div className="aspect-[4/5] bg-[#EFE7D7] overflow-hidden mb-6 relative">
              <LuxuryImage
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                alt="Chanderi Jacquard Oversized Tee"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#4A0E1C] text-[#F8F0E2] text-[9px] font-mono font-bold uppercase tracking-wider border border-[#D8BD83]/30">
                LOOK 03
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A0E1C] block mb-1">
              Chanderi Jacquard &bull; 280GSM
            </span>
            <h3 className="font-serif text-lg uppercase text-[#32141B] mb-2 font-bold">
              Archival Crest Boxy Tee
            </h3>
            <p className="text-xs text-[#89786C] leading-relaxed font-normal mb-4">
              Structured drop-shoulder silhouette featuring the iconic Royal Antigravity Crest, woven on heritage jacquard looms.
            </p>
            <Link
              to="/new-arrivals"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4A0E1C] group-hover:text-[#651C2D] transition-colors"
            >
              <span>View Piece</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#D8BD83]" />
            </Link>
          </div>

        </div>

        {/* Explore All Collab CTA */}
        <div className="text-center">
          <Link
            to="/new-arrivals"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#4A0E1C] hover:bg-[#2A0710] text-[#F8F0E2] hover:text-[#D8BD83] text-xs font-bold uppercase tracking-[0.2em] border border-[#D8BD83]/40 transition-all duration-300 shadow-md group"
          >
            <span>Explore The Complete Capsule Drop</span>
            <ArrowRight className="w-4 h-4 text-[#D8BD83] group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};
