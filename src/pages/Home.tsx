import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, Flame
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
  const { products } = useProducts();
  const [activeTrendingTab, setActiveTrendingTab] = useState<'all' | ProductCategory>('all');

  React.useEffect(() => {
    document.title = 'StyleNest × Drippy | Ultra-Premium Luxury Fashion & Haute Parfumerie';
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
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 pb-16 bg-[#F8F0E2]">
      {/* 1. Cinematic Hero Section (Royal Burgundy × Champagne Editorial) */}
      <HeroSection />

      {/* 2. Quick Portfolios Pills Strip */}
      <QuickCategoryPills />

      {/* 3. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#D8BD83]/40">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-[0.25em] text-[#4A0E1C] block mb-1">
              HAUTE ATELIER
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl tracking-tight uppercase text-[#32141B] font-bold">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/new-arrivals"
            className="text-xs font-bold uppercase font-mono tracking-widest text-[#4A0E1C] hover:text-[#2A0710] transition-colors flex items-center gap-1.5 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D8BD83] group-hover:translate-x-1 transition-transform" />
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

      {/* 5. Shop By Category Showcase (Deep Burgundy Strip) */}
      <CategoryShowcase />

      {/* 6. The Best of StyleNest Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#D8BD83]/40">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-[0.25em] text-[#4A0E1C] block mb-1">
              CURATED EXCELLENCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl tracking-tight uppercase text-[#32141B] font-bold">
              Best of StyleNest
            </h2>
          </div>
          <Link
            to="/men"
            className="text-xs font-bold uppercase font-mono tracking-widest text-[#4A0E1C] hover:text-[#2A0710] transition-colors flex items-center gap-1.5 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D8BD83] group-hover:translate-x-1 transition-transform" />
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#D8BD83]/40 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-[#4A0E1C] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#4A0E1C]" />
              <span>Client Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl tracking-tight uppercase text-[#32141B] font-bold">
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
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  activeTrendingTab === tab.id
                    ? 'bg-[#4A0E1C] text-[#F8F0E2] border border-[#D8BD83]/50 shadow-xs'
                    : 'bg-[#F8F0E2] border border-[#D8BD83]/40 text-[#6A5559] hover:text-[#4A0E1C]'
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
        <section className="bg-gradient-to-br from-[#2A0710] via-[#1E050B] to-[#120206] text-[#F8F0E2] py-16 sm:py-24 border-y border-[#D8BD83]/40 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Visual Bottle Image */}
              <div className="lg:col-span-6 relative">
                <div className="aspect-[4/5] sm:aspect-square overflow-hidden bg-[#120206] border border-[#D8BD83]/40 shadow-2xl relative group">
                  <LuxuryImage
                    src={featuredPerfume.images?.[0] || featuredPerfume.image || featuredPerfume.imageUrl}
                    alt={featuredPerfume.name}
                    fallbackSrc={FALLBACK_IMAGES.perfumes}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120206] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 bg-[#2A0710]/90 backdrop-blur-md px-3 py-1.5 border border-[#D8BD83]/40 text-[10px] uppercase font-mono tracking-widest text-[#D8BD83] font-bold">
                    Distilled in Grasse, France
                  </div>
                </div>
              </div>

              {/* Olfactory Narrative */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4A0E1C]/80 border border-[#D8BD83]/40 text-[#D8BD83] text-[10px] uppercase font-mono tracking-widest font-bold">
                  <Sparkles className="w-3 h-3 text-[#D8BD83]" />
                  <span>The Olfactory Atelier</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F8F0E2] leading-tight">
                  {featuredPerfume.name}
                </h2>

                <p className="text-xs sm:text-sm text-[#D8BD83]/80 leading-relaxed font-normal">
                  {featuredPerfume.description}
                </p>

                {/* Fragrance Pyramids */}
                {featuredPerfume.fragranceNotes && (
                  <div className="grid grid-cols-3 gap-3 p-4 bg-[#4A0E1C]/40 border border-[#D8BD83]/30 text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-[#D8BD83] font-bold block mb-1">
                        Top Notes
                      </span>
                      <p className="text-[11px] text-[#F8F0E2] font-medium leading-tight">
                        {featuredPerfume.fragranceNotes.top.join(', ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-[#D8BD83] font-bold block mb-1">
                        Heart Notes
                      </span>
                      <p className="text-[11px] text-[#F8F0E2] font-medium leading-tight">
                        {featuredPerfume.fragranceNotes.heart.join(', ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-[#D8BD83] font-bold block mb-1">
                        Base Accords
                      </span>
                      <p className="text-[11px] text-[#F8F0E2] font-medium leading-tight">
                        {featuredPerfume.fragranceNotes.base.join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                  <span className="font-serif text-2xl font-bold text-[#D8BD83] font-mono">
                    ₹{featuredPerfume.price.toLocaleString('en-IN')}
                  </span>
                  <Link
                    to={`/product/${featuredPerfume.id}`}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D8BD83] hover:bg-[#F2E6D2] text-[#2A0710] font-bold uppercase text-xs tracking-[0.2em] transition-colors border border-[#D8BD83]"
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

      {/* 9. Trust Badges Bar */}
      <TrustBadgesSection />

      {/* 10. Dedicated Newsletter Privé Section */}
      <NewsletterSection />

      {/* 11. Brand Commitment Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-12">
        <div className="bg-[#2A0710] text-[#F8F0E2] p-8 sm:p-14 relative overflow-hidden border border-[#D8BD83]/40 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-[10px] uppercase font-mono font-bold tracking-[0.25em] text-[#D8BD83]">
              StyleNest Standard
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl tracking-tight leading-tight text-[#F8F0E2] uppercase font-bold">
              Crafted in Italy, France, and India with Unyielding Exactitude.
            </h3>
            <p className="text-xs sm:text-sm text-[#D8BD83]/80 leading-relaxed font-normal">
              We partner exclusively with multi-generational weaving mills in Biella, master shoemakers in Porto, 
              perfumers in Grasse, and handloom silk masters in Chanderi to deliver lasting modern fashion.
            </p>
            <div className="pt-2">
              <Link 
                to="/sale" 
                className="bg-[#D8BD83] hover:bg-[#F2E6D2] text-[#2A0710] font-bold uppercase text-xs px-8 py-3.5 transition-colors inline-block tracking-[0.2em]"
              >
                Discover The Archive
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
