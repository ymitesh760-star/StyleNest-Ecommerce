import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/product/ProductCard';

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'rating'>('popularity');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  React.useEffect(() => {
    document.title = `Search: "${query}" | STYLENEST × DRIPPY`;
    window.scrollTo(0, 0);
  }, [query]);

  const { products, loading } = useProducts();
  const catalog = products;

  // Filter products matching search term
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    let list = catalog.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSub = p.subcategory.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchFragrance = p.fragranceFamily?.toLowerCase().includes(q);
      return matchName || matchBrand || matchCat || matchSub || matchDesc || matchFragrance;
    });

    if (categoryFilter !== 'all') {
      list = list.filter((p) => p.category === categoryFilter);
    }

    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
    }

    return list;
  }, [catalog, query, categoryFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-16 pb-24">
      {/* Search Header */}
      <div className="pb-6 border-b border-[#D8BD83]/30 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#4A0E1C] font-bold block mb-1">
              Global Search
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#32141B]">
              {query ? `Results for "${query}"` : 'Search Creations'}
            </h1>
            <p className="text-xs text-[#89786C] mt-1.5 font-normal">
              Found <strong className="text-[#32141B] font-bold font-mono">{results.length}</strong> matching creations across our portfolios
            </p>
          </div>

          {/* Search Query Input & Clear */}
          <div className="flex items-center gap-3">
            <div className="relative w-64 sm:w-80">
              <Search className="w-4 h-4 text-[#89786C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setSearchParams({ q: e.target.value })}
                placeholder="Search garments, footwear, fragrances..."
                className="w-full bg-[#F2E6D2]/60 border border-[#D8BD83]/40 pl-9 pr-8 py-2 text-xs rounded-none focus:border-[#4A0E1C] outline-none text-[#32141B]"
              />
              {query && (
                <button
                  onClick={() => setSearchParams({ q: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#89786C] hover:text-[#4A0E1C]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#D8BD83]/40 text-xs py-2 px-3 rounded-none text-[#32141B] outline-none uppercase font-mono tracking-wider font-semibold cursor-pointer"
            >
              <option value="popularity">Most Coveted</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Client Rating</option>
            </select>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#89786C] font-bold mr-1">
            Filter Portfolio:
          </span>
          {['all', 'men', 'shoes', 'perfumes'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-none border transition-all ${
                categoryFilter === cat
                  ? 'bg-[#4A0E1C] text-[#F8F0E2] border-[#4A0E1C] shadow-xs'
                  : 'bg-white text-[#32141B] border-[#D8BD83]/40 hover:border-[#4A0E1C]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-[3/4] bg-[#F2E6D2] rounded-none" />
              <div className="h-3 bg-[#F2E6D2] rounded-none w-1/3" />
              <div className="h-4 bg-[#F2E6D2] rounded-none w-3/4" />
              <div className="h-3 bg-[#F2E6D2] rounded-none w-1/4" />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#FDFBF7] border border-[#D8BD83]/40 rounded-none p-8 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-none bg-[#4A0E1C] border border-[#D8BD83]/40 flex items-center justify-center text-[#D8BD83] mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#32141B] mb-2">
            No creations found for &ldquo;{query}&rdquo;
          </h3>
          <p className="text-xs text-[#89786C] max-w-sm mx-auto mb-6 leading-relaxed font-normal">
            We could not find anything matching your search. Please check your spelling or try exploring our atelier collections below.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/men" className="px-6 py-2.5 bg-[#4A0E1C] text-[#F8F0E2] text-xs font-bold uppercase tracking-wider hover:bg-[#2A0710] border border-[#D8BD83]/40 transition-colors">
              Explore Menswear
            </Link>
            <Link to="/shoes" className="px-6 py-2.5 bg-white border border-[#D8BD83]/50 text-[#32141B] text-xs font-bold uppercase tracking-wider hover:bg-[#F2E6D2] transition-colors">
              Explore Footwear
            </Link>
            <Link to="/perfumes" className="px-6 py-2.5 bg-[#D8BD83] text-[#2A0710] text-xs font-bold uppercase tracking-wider hover:bg-[#F2E6D2] transition-colors">
              Explore Haute Parfumerie
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
