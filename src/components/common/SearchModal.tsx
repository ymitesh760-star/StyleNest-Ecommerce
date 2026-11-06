import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ['Italian Wool Overcoat', 'Silk Slip Dress', 'Santal Impérial', 'Sneakers', 'Cashmere', 'Oud'];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const { products } = useProducts();
  const catalog = products && products.length > 0 ? products : PRODUCTS;

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length > 1) {
      const filtered = catalog.filter((p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.brand.toLowerCase().includes(trimmed) ||
        p.category.toLowerCase().includes(trimmed) ||
        p.subcategory.toLowerCase().includes(trimmed) ||
        (p.fragranceFamily && p.fragranceFamily.toLowerCase().includes(trimmed))
      ).slice(0, 6);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const handleSelectProduct = (productId: string) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start bg-[#2A0710]/85 backdrop-blur-md animate-fade-in">
      {/* Top Search Header */}
      <div className="bg-[#F8F0E2] border-b border-[#D8BD83]/40 shadow-xl py-6 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#4A0E1C] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D8BD83]" />
              STYLENEST &times; DRIPPY Global Search
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-[#89786C] hover:text-[#4A0E1C] transition-colors rounded-none hover:bg-[#F2E6D2]"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="w-6 h-6 text-[#89786C] absolute left-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search garments, footwear, fragrances, or collections..."
              className="w-full pl-10 pr-12 py-3 text-lg sm:text-xl text-[#32141B] placeholder:text-[#89786C] bg-transparent border-b-2 border-[#D8BD83]/50 focus:border-[#4A0E1C] outline-none transition-colors font-serif"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-0 text-[#89786C] hover:text-[#4A0E1C] text-xs font-mono font-semibold uppercase tracking-wider px-2"
              >
                Clear
              </button>
            )}
          </form>

          {/* Quick Suggestions Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-[#89786C] uppercase font-mono tracking-wider font-medium mr-1">Trending:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  navigate(`/search?q=${encodeURIComponent(term)}`);
                  onClose();
                }}
                className="px-3 py-1 bg-[#F2E6D2] hover:bg-[#4A0E1C] hover:text-[#F8F0E2] border border-[#D8BD83]/40 text-[#32141B] text-xs transition-colors rounded-none tracking-wide"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Suggestions Body */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 overflow-y-auto max-h-[70vh]">
        {query.trim().length > 1 && (
          <div className="bg-white rounded-xs shadow-luxury border border-[rgba(185,154,107,0.22)] p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(185,154,107,0.18)] mb-4">
              <h3 className="text-xs uppercase tracking-wider-luxury font-bold text-[#0A0A0A]">
                Creations Matching "{query}" ({results.length})
              </h3>
              {results.length > 0 && (
                <button
                  onClick={handleSubmit}
                  className="text-xs font-semibold text-[#0A0A0A] hover:text-[#B99A6B] transition-colors flex items-center gap-1.5 uppercase tracking-wider-luxury"
                >
                  View All Results <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="flex items-center gap-4 p-2.5 hover:bg-[#F8F6F2] border border-transparent hover:border-[rgba(185,154,107,0.2)] transition-all rounded-xs cursor-pointer group"
                  >
                    <div className="w-16 h-20 bg-[#F8F6F2] overflow-hidden shrink-0 rounded-xs border border-black/5">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider-luxury text-[#B99A6B] font-semibold">{product.brand}</p>
                      <h4 className="font-serif-luxury text-base font-medium text-[#0A0A0A] group-hover:text-[#B99A6B] transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#777777] capitalize">{product.category} &bull; {product.subcategory}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-[#0A0A0A]">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-[#777777] line-through font-light">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="font-serif-luxury text-lg text-[#0A0A0A]">No products found matching "{query}".</p>
                <p className="text-xs text-[#777777] mt-1 font-light">Try searching for keywords like "Wool", "Sandalwood", "Sneaker", or "Dress".</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
