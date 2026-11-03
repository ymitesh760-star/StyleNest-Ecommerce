import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, TrendingUp, Flame, Award,
  ShieldCheck, RefreshCw, Truck, Gift, Star, CheckCircle2
} from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { QuickCategoryPills } from '../components/home/QuickCategoryPills';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { EditorialBanner } from '../components/home/EditorialBanner';
import { BrandCollaborationShowcase } from '../components/home/BrandCollaborationShowcase';
import { TrustBadgesSection } from '../components/home/TrustBadgesSection';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { ProductCard } from '../components/product/ProductCard';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { FALLBACK_IMAGES } from '../utils/imageUtils';
import { useProducts } from '../context/ProductContext';
import { ProductCategory } from '../types';

export const Home: React.FC = () => {
  const { products, loading } = useProducts();
  const [activeTrendingTab, setActiveTrendingTab] = useState<'all' | ProductCategory>('all');

  React.useEffect(() => {
    document.title = 'StyleNest | Ultra-Premium Luxury Fashion & Haute Parfumerie';
    window.scrollTo(0, 0);
  }, []);

  // Active catalog products displayed on homepage (Women's collection reserved for Coming Soon)
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.category !== 'women');
  }, [products]);

  // Filter Trending Products with Category Filter
  const filteredTrending = useMemo(() => {
    let list = activeProducts.filter((p) => p.isTrending);
    if (activeTrendingTab !== 'all') {
      list = list.filter((p) => p.category === activeTrendingTab);
    }
    return list.slice(0, 8);
  }, [activeProducts, activeTrendingTab]);

  // New Arrivals (8 products)
  const newArrivals = useMemo(() => {
    return activeProducts.filter((p) => p.isNewArrival).slice(0, 8);
  }, [activeProducts]);

  // Bestsellers (4 top rated products)
  const bestsellers = useMemo(() => {
    return activeProducts.filter((p) => p.isBestseller).slice(0, 4);
  }, [activeProducts]);

  // Featured Perfume for Olfactory Spotlight
  const featuredPerfume = useMemo(() => {
    return activeProducts.find((p) => p.category === 'perfumes' && p.isBestseller) || activeProducts.find((p) => p.category === 'perfumes') || activeProducts[0];
  }, [activeProducts]);

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 pb-16">
      {/* 1. Cinematic Hero Section (Fall Essentials / Urban Chic) */}
      <HeroSection />

      {/* 2. Quick Mobile & Desktop Portfolios Pills Strip */}
      <QuickCategoryPills />

      {/* 3. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-black/15">
          <div>
            <h2 className="font-sans font-black text-2xl sm:text-3xl tracking-tight uppercase text-[#0A0A0A]">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/new-arrivals"
            className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:opacity-60 transition-opacity flex items-center gap-1.5"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-column product grid with direct Add To Cart buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Official Brand Collaboration: STYLENEST × DRIPPY */}
      <BrandCollaborationShowcase />

      {/* 5. Shop By Category Showcase (Black Strip) */}
      <CategoryShowcase />

      {/* 6. The Best of StyleNest Showcase (Matching Screenshot "BEST OF GAZU") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-black/15">
          <div>
            <h2 className="font-sans font-black text-2xl sm:text-3xl tracking-tight uppercase text-[#0A0A0A]">
              Best of StyleNest
            </h2>
          </div>
          <Link
            to="/men"
            className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:opacity-60 transition-opacity flex items-center gap-1.5"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Interactive In High Demand / Trending Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-black/10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-neutral-500 mb-1">
              <Flame className="w-3.5 h-3.5 text-[#0A0A0A]" />
              <span>Client Favorites</span>
            </div>
            <h2 className="font-sans font-black text-2xl sm:text-3xl tracking-[-0.03em] uppercase text-[#0A0A0A]">
              Trending In Store
            </h2>
          </div>

          {/* Department Tabs for Fast Browsing */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Universes' },
              { id: 'men', label: 'Men' },
              { id: 'shoes', label: 'Footwear' },
              { id: 'perfumes', label: 'Parfums' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTrendingTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  activeTrendingTab === tab.id
                    ? 'bg-[#0A0A0A] text-white shadow-xs'
                    : 'bg-white/80 border border-black/10 text-neutral-600 hover:text-[#0A0A0A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredTrending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Haute Parfumerie Olfactory Atelier Spotlight */}
      {featuredPerfume && (
        <section className="bg-gradient-to-br from-[#171717] to-[#0A0A0A] text-white py-16 sm:py-24 border-y border-[rgba(185,154,107,0.3)] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Visual Bottle Image */}
              <div className="lg:col-span-6 relative">
                <div className="aspect-[4/5] sm:aspect-square rounded-sm overflow-hidden bg-[#0A0A0A] border border-[rgba(185,154,107,0.35)] shadow-2xl relative group">
                  <LuxuryImage
                    src={featuredPerfume.images?.[0] || featuredPerfume.image || featuredPerfume.imageUrl}
                    alt={featuredPerfume.name}
                    fallbackSrc={FALLBACK_IMAGES.perfumes}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 bg-[#0A0A0A]/85 backdrop-blur-md px-3 py-1.5 border border-[#B99A6B]/30 rounded-xs text-[10px] uppercase tracking-widest text-[#B99A6B] font-bold">
                    Distilled in Grasse, France
                  </div>
                </div>
              </div>

              {/* Olfactory Narrative */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B99A6B]/15 border border-[#B99A6B]/30 text-[#B99A6B] rounded-full text-[10px] uppercase tracking-widest font-bold">
                  <Sparkles className="w-3 h-3 text-[#B99A6B]" />
                  <span>The Olfactory Atelier</span>
                </div>

                <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#F8F6F2] leading-tight">
                  {featuredPerfume.name}
                </h2>

                <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed font-light">
                  {featuredPerfume.description}
                </p>

                {/* Fragrance Pyramids */}
                {featuredPerfume.fragranceNotes && (
                  <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 border border-white/10 rounded-sm text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#B99A6B] font-bold block mb-1">
                        Top Notes
                      </span>
                      <p className="text-[11px] text-[#F8F6F2] font-medium leading-tight">
                        {featuredPerfume.fragranceNotes.top.join(', ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#B99A6B] font-bold block mb-1">
                        Heart Notes
                      </span>
                      <p className="text-[11px] text-[#F8F6F2] font-medium leading-tight">
                        {featuredPerfume.fragranceNotes.heart.join(', ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#B99A6B] font-bold block mb-1">
                        Base Accords
                      </span>
                      <p className="text-[11px] text-[#F8F6F2] font-medium leading-tight">
                        {featuredPerfume.fragranceNotes.base.join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                  <span className="font-serif-luxury text-2xl font-bold text-[#B99A6B]">
                    ₹{featuredPerfume.price.toLocaleString('en-IN')}
                  </span>
                  <Link
                    to={`/product/${featuredPerfume.id}`}
                    className="btn-gold py-3 px-6 text-xs inline-flex items-center gap-2"
                  >
                    <span>Acquire Extrait de Parfum</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9. Trust Badges Bar (Matching Screenshot Section 5) */}
      <TrustBadgesSection />

      {/* 10. Dedicated Newsletter Privé Section (Matching Screenshot Section 6) */}
      <NewsletterSection />

      {/* 11. Brand Commitment Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-12">
        <div className="bg-[#0A0A0A] text-white rounded-none p-8 sm:p-14 relative overflow-hidden border border-black/20">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-[10px] uppercase font-mono font-bold tracking-[0.25em] text-neutral-400">
              StyleNest Standard
            </span>
            <h3 className="font-sans font-black text-2xl sm:text-4xl tracking-tight leading-tight text-white uppercase">
              Crafted in Italy, France, and India with Unyielding Exactitude.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
              We partner exclusively with multi-generational weaving mills in Biella, master shoemakers in Porto, 
              perfumers in Grasse, and handloom silk masters in Chanderi to deliver lasting modern fashion.
            </p>
            <div className="pt-2">
              <Link to="/sale" className="bg-white hover:bg-neutral-200 text-black font-black uppercase text-xs px-7 py-3 transition-colors inline-block">
                Discover The Archive
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
