import React from 'react';
import { RotateCcw, Star, Check } from 'lucide-react';
import { FilterState } from '../../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  availableSubcategories: string[];
  availableSizes?: string[];
  availableColors?: { name: string; hex: string }[];
  maxPriceLimit?: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableSubcategories,
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
  availableColors = [
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Tan/Camel', hex: '#C19A6B' },
    { name: 'Navy', hex: '#1C2841' },
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Brown', hex: '#5D4037' },
    { name: 'Sage/Olive', hex: '#708238' },
  ],
  maxPriceLimit = 20000,
}) => {
  const toggleSubcategory = (sub: string) => {
    const next = filters.subcategory.includes(sub)
      ? filters.subcategory.filter((s) => s !== sub)
      : [...filters.subcategory, sub];
    onFilterChange({ ...filters, subcategory: next });
  };

  const toggleSize = (size: string) => {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: next });
  };

  const toggleColor = (colorName: string) => {
    const next = filters.colors.includes(colorName)
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onFilterChange({ ...filters, colors: next });
  };

  const handlePriceChange = (val: number) => {
    onFilterChange({ ...filters, priceRange: [filters.priceRange[0], val] });
  };

  return (
    <aside className="w-full space-y-6 divide-y divide-[#D8BD83]/30 text-xs">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-[#4A0E1C] font-bold block">
            Curate
          </span>
          <h3 className="font-serif font-bold uppercase tracking-wider text-[#32141B]">
            Refine Selection
          </h3>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1.5 text-[11px] text-[#89786C] hover:text-[#4A0E1C] transition-colors uppercase font-mono font-medium"
        >
          <RotateCcw className="w-3 h-3 text-[#D8BD83]" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Subcategories */}
      {availableSubcategories.length > 0 && (
        <div className="pt-5 space-y-2.5">
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#32141B] mb-2">
            Categories
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {availableSubcategories.map((sub) => {
              const isChecked = filters.subcategory.includes(sub);
              return (
                <label
                  key={sub}
                  className="flex items-center gap-2.5 cursor-pointer text-[#32141B] hover:text-[#4A0E1C] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSubcategory(sub)}
                    className="w-3.5 h-3.5 rounded-none border-[#D8BD83]/60 text-[#4A0E1C] focus:ring-[#4A0E1C]"
                  />
                  <span className="text-xs">{sub}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#32141B]">
            Price Range
          </h4>
          <span className="font-bold text-[#4A0E1C] font-mono">
            Up to ₹{filters.priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={1500}
          max={maxPriceLimit}
          step={500}
          value={filters.priceRange[1]}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-[#4A0E1C] cursor-pointer h-1.5 bg-[#F2E6D2] border border-[#D8BD83]/40 rounded-lg"
        />
        <div className="flex justify-between text-[11px] text-[#89786C] font-mono">
          <span>₹1,500</span>
          <span>₹{maxPriceLimit.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Sizes Filter */}
      {availableSizes.length > 0 && (
        <div className="pt-5 space-y-3">
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#32141B]">
            Size
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((sz) => {
              const isSelected = filters.sizes.includes(sz);
              return (
                <button
                  key={sz}
                  onClick={() => toggleSize(sz)}
                  className={`px-3 py-1.5 text-[11px] font-medium border rounded-none transition-all ${
                    isSelected
                      ? 'bg-[#4A0E1C] text-[#F8F0E2] border-[#4A0E1C] shadow-xs'
                      : 'bg-white text-[#32141B] border-[#D8BD83]/40 hover:border-[#4A0E1C]'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colors Filter */}
      {availableColors.length > 0 && (
        <div className="pt-5 space-y-3">
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#32141B]">
            Color Palette
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {availableColors.map((clr) => {
              const isSelected = filters.colors.includes(clr.name);
              return (
                <button
                  key={clr.name}
                  onClick={() => toggleColor(clr.name)}
                  className={`w-6 h-6 rounded-full border-2 transition-all relative ${
                    isSelected ? 'border-[#4A0E1C] scale-110 shadow-sm ring-2 ring-[#D8BD83]/50' : 'border-black/10 hover:scale-105'
                  }`}
                  style={{ backgroundColor: clr.hex }}
                  title={clr.name}
                >
                  {isSelected && (
                    <Check className="w-3 h-3 text-white absolute inset-0 m-auto mix-blend-difference" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Minimum Star Rating */}
      <div className="pt-5 space-y-2.5">
        <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#32141B]">
          Client Rating
        </h4>
        <div className="space-y-2">
          {[4.8, 4.5, 4.0].map((starVal) => (
            <label
              key={starVal}
              className="flex items-center gap-2 cursor-pointer text-[#32141B] hover:text-[#4A0E1C]"
            >
              <input
                type="radio"
                name="rating-filter"
                checked={filters.ratings === starVal}
                onChange={() => onFilterChange({ ...filters, ratings: filters.ratings === starVal ? null : starVal })}
                className="w-3.5 h-3.5 text-[#4A0E1C] border-[#D8BD83]/60 focus:ring-[#4A0E1C]"
              />
              <span className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold font-mono">{starVal}+</span>
                <Star className="w-3.5 h-3.5 fill-[#D8BD83] text-[#D8BD83]" />
                <span className="text-[#89786C]">and above</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability / In-Stock Only */}
      <div className="pt-5">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#32141B]">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded text-[#4A0E1C] border-[#D8BD83]/60 focus:ring-[#4A0E1C]"
          />
        </label>
      </div>
    </aside>
  );
};
