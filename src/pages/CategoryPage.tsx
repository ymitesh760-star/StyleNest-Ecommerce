import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, ChevronRight, X, Search, RotateCcw } from 'lucide-react';
import { PRODUCTS, CATEGORIES_DATA } from '../data/products';
import { useProducts } from '../context/ProductContext';
import { Product, FilterState } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { FilterSidebar } from '../components/product/FilterSidebar';
import { WomensComingSoon } from './WomensComingSoon';

interface CategoryPageProps {
  forcedCategory?: 'men' | 'women' | 'shoes' | 'perfumes' | 'new-arrivals' | 'sale';
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ forcedCategory }) => {
  const params = useParams<{ categoryName?: string }>();
  const activeCategory = forcedCategory || (params.categoryName as any) || 'men';

  // Women's section is reserved for the upcoming Parisian capsule - render Coming Soon
  if (activeCategory === 'women') {
    return <WomensComingSoon />;
  }

  // Category metadata & banners
  const meta = useMemo(() => {
    if (activeCategory === 'new-arrivals') {
      return {
        title: 'New Arrivals 2026',
        subtitle: 'The Latest Haute Silhouettes & Compositions',
        description: 'Explore the newest expressions of modern elegance, crafted fresh from our European and Indian ateliers.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
        subcategories: ['Jackets', 'Dresses', 'Shirts', 'Boots', 'Extrait de Parfum', 'Sneakers']
      };
    }
    if (activeCategory === 'sale') {
      return {
        title: 'The Archive (Privileged Sale)',
        subtitle: 'Exceptional Creations at Curated Courtesy Prices',
        description: 'Acquire coveted wardrobe foundations and signature scents with complimentary express shipping.',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
        subcategories: ['Jackets', 'Casual Wear', 'Sandals', 'Fresh Fragrances']
      };
    }

    const found = CATEGORIES_DATA.find((c) => c.id === activeCategory);
    if (found) {
      let displayTitle = `${found.title}'S COLLECTION`;
      if (found.id === 'shoes') displayTitle = 'ARTISANAL FOOTWEAR';
      if (found.id === 'perfumes') displayTitle = 'HAUTE PARFUMERIE';

      return {
        title: displayTitle,
        subtitle: found.subtitle,
        description: found.description,
        image: found.image,
        subcategories: found.subcategories
      };
    }

    return {
      title: 'COLLECTION',
      subtitle: 'Luxury Lifestyle',
      description: 'Explore our curated pieces.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
      subcategories: []
    };
  }, [activeCategory]);

  useEffect(() => {
    document.title = `${meta.title} | STYLENEST Luxury Brand`;
    window.scrollTo(0, 0);
  }, [meta.title]);

  // Initial Filter State
  const [filters, setFilters] = useState<FilterState>({
    category: activeCategory as any,
    subcategory: [],
    priceRange: [1500, 20000],
    sizes: [],
    colors: [],
    ratings: null,
    inStockOnly: false,
    sortBy: 'popularity',
    searchQuery: '',
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Category-appropriate sizes list
  const availableSizesForCategory = useMemo(() => {
    if (activeCategory === 'shoes') {
      return ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
    }
    if (activeCategory === 'perfumes') {
      return ['30ml', '50ml', '100ml'];
    }
    return ['XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34', '36', '38R', '40R', '42R'];
  }, [activeCategory]);

  // Reset filters when route category changes
  useEffect(() => {
    setFilters({
      category: activeCategory as any,
      subcategory: [],
      priceRange: [1500, 20000],
      sizes: [],
      colors: [],
      ratings: null,
      inStockOnly: false,
      sortBy: 'popularity',
      searchQuery: '',
    });
    setVisibleCount(12);
  }, [activeCategory]);

  const { products, loading, error, isFirestoreEmpty } = useProducts();

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let result = products.length > 0 ? [...products] : [...PRODUCTS];

    // Filter by category
    if (activeCategory === 'new-arrivals') {
      result = result.filter((p) => p.isNewArrival);
    } else if (activeCategory === 'sale') {
      result = result.filter((p) => p.badges?.includes('Sale') || p.originalPrice);
    } else {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by subcategory
    if (filters.subcategory.length > 0) {
      result = result.filter((p) => filters.subcategory.includes(p.subcategory));
    }

    // Filter by price
    result = result.filter((p) => p.price <= filters.priceRange[1]);

    // Filter by sizes
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes && p.sizes.some((sz) => filters.sizes.includes(sz))
      );
    }

    // Filter by colors
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors && p.colors.some((c) => filters.colors.includes(c.name))
      );
    }

    // Filter by ratings
    if (filters.ratings) {
      result = result.filter((p) => p.rating >= filters.ratings!);
    }

    // Filter by inStock
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Filter by in-collection search
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
    }

    return result;
  }, [activeCategory, filters]);

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      subcategory: [],
      priceRange: [1500, 20000],
      sizes: [],
      colors: [],
      ratings: null,
      inStockOnly: false,
      searchQuery: '',
    }));
  };

  const activeFiltersCount =
    filters.subcategory.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.ratings ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="pb-24">
      {/* 1. Category Hero Banner */}
      <div className="relative bg-[#2A0710] text-white min-h-[300px] sm:min-h-[380px] flex items-center overflow-hidden border-b border-[#D8BD83]/30">
        <img
          src={meta.image}
          alt={meta.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A0710] via-[#2A0710]/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#D8BD83]/80 mb-4 font-mono">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#D8BD83]" />
            <span className="text-[#D8BD83] font-semibold">{meta.title}</span>
          </nav>

          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#D8BD83] font-bold block mb-1">
            {meta.subtitle}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 text-[#F8F0E2]">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#D8BD83]/80 max-w-xl font-normal leading-relaxed">
            {meta.description}
          </p>
        </div>
      </div>

      {/* 2. Top Controls Bar: Count, In-Collection Search, Filter Trigger, Sort Dropdown */}
      <div className="sticky top-[69px] z-30 bg-[#F8F0E2]/95 backdrop-blur-md border-b border-[#D8BD83]/30 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Product Count & Filter Drawer Toggle for Mobile */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-1.5 bg-[#4A0E1C] text-[#F8F0E2] text-xs font-semibold uppercase tracking-wider border border-[#D8BD83]/40"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D8BD83]" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            <span className="text-xs text-[#89786C] uppercase font-mono tracking-wider font-medium">
              Showing <strong className="text-[#32141B] font-bold">{Math.min(visibleCount, filteredProducts.length)}</strong> of{' '}
              <strong className="text-[#32141B] font-bold">{filteredProducts.length}</strong> items
            </span>
          </div>

          {/* Right: Search within collection & Sort */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Search Input */}
            <div className="relative hidden md:block w-48 lg:w-60">
              <Search className="w-3.5 h-3.5 text-[#89786C] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search collection..."
                value={filters.searchQuery || ''}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full bg-[#F2E6D2]/60 border border-[#D8BD83]/40 pl-8 pr-2 py-1.5 text-xs text-[#32141B] placeholder:text-[#89786C] focus:border-[#4A0E1C] outline-none"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters({ ...filters, searchQuery: '' })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#89786C] hover:text-[#4A0E1C]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#D8BD83]" />
              <span className="text-[#89786C] font-medium uppercase font-mono tracking-wider hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-transparent text-[#32141B] font-semibold uppercase tracking-wider text-xs py-1.5 pl-1 pr-6 border-b border-[#D8BD83]/40 focus:border-[#4A0E1C] outline-none cursor-pointer"
              >
                <option value="popularity">Most Coveted</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Client Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFiltersCount > 0 && (
        <div className="bg-[#F2E6D2]/60 border-b border-[#D8BD83]/30 py-2.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] uppercase tracking-wider-luxury text-[#777777] font-bold mr-1">
              Active Filters:
            </span>
            {filters.subcategory.map((sub) => (
              <span
                key={sub}
                className="inline-flex items-center gap-1.5 bg-white border border-[rgba(185,154,107,0.3)] px-2.5 py-0.5 rounded-sm text-[#0A0A0A]"
              >
                {sub}
                <button
                  onClick={() =>
                    setFilters({ ...filters, subcategory: filters.subcategory.filter((s) => s !== sub) })
                  }
                  className="text-[#777777] hover:text-[#0A0A0A]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.sizes.map((sz) => (
              <span
                key={sz}
                className="inline-flex items-center gap-1.5 bg-white border border-[rgba(185,154,107,0.3)] px-2.5 py-0.5 rounded-sm text-[#0A0A0A]"
              >
                Size: {sz}
                <button
                  onClick={() => setFilters({ ...filters, sizes: filters.sizes.filter((s) => s !== sz) })}
                  className="text-[#777777] hover:text-[#0A0A0A]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.colors.map((clr) => (
              <span
                key={clr}
                className="inline-flex items-center gap-1.5 bg-white border border-[rgba(185,154,107,0.3)] px-2.5 py-0.5 rounded-sm text-[#0A0A0A]"
              >
                Color: {clr}
                <button
                  onClick={() => setFilters({ ...filters, colors: filters.colors.filter((c) => c !== clr) })}
                  className="text-[#777777] hover:text-[#0A0A0A]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.ratings && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[rgba(185,154,107,0.3)] px-2.5 py-0.5 rounded-sm text-[#0A0A0A]">
                Rating: {filters.ratings}+ Stars
                <button
                  onClick={() => setFilters({ ...filters, ratings: null })}
                  className="text-[#777777] hover:text-[#0A0A0A]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[rgba(185,154,107,0.3)] px-2.5 py-0.5 rounded-sm text-[#0A0A0A]">
                In Stock Only
                <button
                  onClick={() => setFilters({ ...filters, inStockOnly: false })}
                  className="text-[#777777] hover:text-[#0A0A0A]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-semibold text-[#B99A6B] hover:text-[#0A0A0A] uppercase tracking-wider ml-2 underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-[#B99A6B]" />
              Reset All
            </button>
          </div>
        </div>
      )}

      {/* Main Content Layout (Sidebar + Product Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-sm border border-elan-200 shadow-sm">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={handleResetFilters}
                availableSubcategories={meta.subcategories}
                availableSizes={availableSizesForCategory}
              />
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3 space-y-8">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-sm text-rose-800 text-xs">
                <strong>Firestore Connection Notice:</strong> {error}
              </div>
            )}

            {isFirestoreEmpty && !loading && (
              <div className="p-6 bg-white border border-[rgba(185,154,107,0.3)] rounded-sm text-center space-y-2">
                <p className="font-serif-luxury text-xl font-bold text-[#0A0A0A]">Catalog Is Empty in Firestore</p>
                <p className="text-xs text-[#777777] max-w-md mx-auto">
                  The Firestore 'products' collection contains no documents. As Store Director, you can seed the catalog from the Admin console.
                </p>
                <Link to="/admin" className="btn-gold py-2 px-6 text-xs inline-block mt-2">
                  Visit Store Director Console
                </Link>
              </div>
            )}

            <ProductGrid
              products={filteredProducts.slice(0, visibleCount)}
              onResetFilters={handleResetFilters}
              isLoading={loading}
              columns={3}
            />

            {/* Load More Button */}
            {filteredProducts.length > visibleCount && (
              <div className="text-center pt-8 border-t border-elan-200">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="btn-secondary px-10 py-3.5"
                >
                  Load More Masterpieces
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-elan-950/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-drawer flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-elan-200 mb-6">
                <h3 className="font-semibold uppercase tracking-wider-luxury text-sm text-elan-950">
                  Filters ({activeFiltersCount})
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-elan-400 hover:text-elan-950"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={handleResetFilters}
                availableSubcategories={meta.subcategories}
                availableSizes={availableSizesForCategory}
              />
            </div>

            <div className="pt-6 border-t border-elan-200 mt-6">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="btn-primary w-full py-3"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
