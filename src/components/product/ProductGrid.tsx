import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Sparkles, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
  isLoading?: boolean;
  columns?: 3 | 4;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onResetFilters,
  isLoading = false,
  columns = 4,
}) => {
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-2 ${
          columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'
        } gap-4 sm:gap-6`}
      >
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className="aspect-[3/4] bg-elan-200 rounded-sm" />
            <div className="h-3 bg-elan-200 rounded w-1/3" />
            <div className="h-4 bg-elan-200 rounded w-3/4" />
            <div className="h-3 bg-elan-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-white rounded-sm border border-elan-200 shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-full bg-elan-100 flex items-center justify-center text-elan-400 mb-4">
          <Sparkles className="w-6 h-6 text-elan-gold" />
        </div>
        <h3 className="font-serif-luxury text-2xl font-bold text-elan-950 mb-2">
          No garments match your filters
        </h3>
        <p className="text-xs text-elan-500 max-w-sm mx-auto mb-6">
          We could not find any items matching your selected criteria. Try loosening your price boundaries or removing selected sizes.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="btn-primary py-3 px-6 inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 ${
        columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'
      } gap-4 sm:gap-6`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
