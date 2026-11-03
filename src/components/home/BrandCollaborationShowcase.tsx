import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { LuxuryImage } from '../common/LuxuryImage';

export const BrandCollaborationShowcase: React.FC = () => {
  return (
    <section className="w-full bg-[#F8F6F2] py-16 sm:py-24 border-y border-black/10 relative overflow-hidden">
      {/* Subtle Architectural Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-30 z-0">
        <span className="font-serif italic text-[14vw] font-black text-[#991B1B]/[0.04] tracking-widest leading-none">
          COUTURE &times; STREET
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Collaboration Header Lockup */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#991B1B]/30 mb-6 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#991B1B]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#991B1B] uppercase">
              OFFICIAL BRAND COLLABORATION
            </span>
          </div>

          {/* Centered Large Stacked Logo Lockup */}
          <div className="py-2 mb-4">
            <BrandLogo layout="stacked" size="xl" showSubtitle={true} asLink={false} />
          </div>

          <p className="font-serif italic text-lg sm:text-2xl text-[#0A0A0A] max-w-xl mx-auto mt-2 leading-snug">
            "When centuries of royal Indian craftsmanship collide with the raw, uncompromising pulse of urban street culture."
          </p>

          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto mt-4 leading-relaxed font-light">
            An exclusive limited-edition capsule marrying centuries-old hand-embroidery, regal brocades, and pure mulberries with relaxed oversized streetwear architecture.
          </p>
        </div>

        {/* 3 Collaboration Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          
          {/* Pillar 1: Zardozi Meets Heavyweight Terry */}
          <div className="bg-white p-6 sm:p-8 border border-black/10 hover:border-[#991B1B]/40 transition-all duration-300 group shadow-xs">
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden mb-6 relative">
              <LuxuryImage
                src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
                alt="Zardozi Embroidered Streetwear Bomber"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#991B1B] text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                LOOK 01
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#991B1B] block mb-1">
              Indian Zardozi &bull; 460GSM Terry
            </span>
            <h3 className="font-sans font-black text-lg uppercase text-[#0A0A0A] mb-2">
              Royal Zardozi Street Bomber
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light mb-4">
              Hand-spun heavyweight organic fleece detailed with antique bullion wire needlework created in our Jaipur atelier.
            </p>
            <Link
              to="/new-arrivals"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] group-hover:text-[#991B1B] transition-colors"
            >
              <span>View Piece</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Pillar 2: Pure Silk Street Utility */}
          <div className="bg-white p-6 sm:p-8 border border-black/10 hover:border-[#991B1B]/40 transition-all duration-300 group shadow-xs">
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden mb-6 relative">
              <LuxuryImage
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
                alt="Mulberry Silk Cargo Trousers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#0A0A0A] text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                LOOK 02
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B99A6B] block mb-1">
              100% Mulberry Silk &bull; Relaxed Fit
            </span>
            <h3 className="font-sans font-black text-lg uppercase text-[#0A0A0A] mb-2">
              Raw Silk Utilitarian Cargo
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light mb-4">
              Bespoke drapey raw silk paired with tactical drop pockets and brass drawcords, bridging palace elegance with downtown swagger.
            </p>
            <Link
              to="/men"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] group-hover:text-[#991B1B] transition-colors"
            >
              <span>View Piece</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Pillar 3: Hand-Lasted Street High-Tops */}
          <div className="bg-white p-6 sm:p-8 border border-black/10 hover:border-[#991B1B]/40 transition-all duration-300 group shadow-xs">
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden mb-6 relative">
              <LuxuryImage
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
                alt="Handcrafted Calfskin Street Sneakers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#991B1B] text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                LOOK 03
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#991B1B] block mb-1">
              Full-Grain Calfskin &bull; Crimson Drip
            </span>
            <h3 className="font-sans font-black text-lg uppercase text-[#0A0A0A] mb-2">
              Artisan Calfskin High-Top
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light mb-4">
              Hand-lasted Italian full-grain leather marked with DRIPPY's signature dark red brushstrokes and Margom rubber outsoles.
            </p>
            <Link
              to="/shoes"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] group-hover:text-[#991B1B] transition-colors"
            >
              <span>View Piece</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Bottom Banner Bar */}
        <div className="p-6 sm:p-8 bg-[#0A0A0A] text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-black">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#EF4444]">
              LIMITED TO 250 NUMBERED UNITS WORLDWIDE
            </span>
            <h4 className="font-sans font-black text-xl uppercase tracking-tight">
              STYLENEST &times; DRIPPY Inaugural Capsule Drop
            </h4>
            <p className="text-xs text-neutral-400 font-light">
              Each garment arrives in a bespoke collector’s velvet keepsake case with certificate of royal provenance.
            </p>
          </div>

          <Link
            to="/new-arrivals"
            className="px-8 py-3.5 bg-[#991B1B] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-widest transition-colors shrink-0"
          >
            Acquire Capsule Drop
          </Link>
        </div>

      </div>
    </section>
  );
};

