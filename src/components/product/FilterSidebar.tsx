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
    <aside className="w-full space-y-6 divide-y divide-[rgba(185,154,107,0.2)] text-xs">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#B99A6B] font-bold block">
            Curate
          </span>
          <h3 className="font-semibold uppercase tracking-wider-luxury text-[#0A0A0A]">
            Refine Selection
          </h3>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1.5 text-[11px] text-[#777777] hover:text-[#0A0A0A] transition-colors uppercase tracking-wider font-medium"
        >
          <RotateCcw className="w-3 h-3 text-[#B99A6B]" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Subcategories */}
      {availableSubcategories.length > 0 && (
        <div className="pt-5 space-y-2.5">
          <h4 className="font-semibold uppercase tracking-wider-luxury text-[#0A0A0A] mb-2">
            Categories
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {availableSubcategories.map((sub) => {
              const isChecked = filters.subcategory.includes(sub);
              return (
                <label
                  key={sub}
                  className="flex items-center gap-2.5 cursor-pointer text-[#171717] hover:text-[#B99A6B] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSubcategory(sub)}
                    className="w-3.5 h-3.5 rounded-xs border-[rgba(185,154,107,0.4)] text-[#0A0A0A] focus:ring-[#B99A6B]"
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
          <h4 className="font-semibold uppercase tracking-wider-luxury text-[#0A0A0A]">
            Price Range
          </h4>
          <span className="font-bold text-[#0A0A0A]">
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
          className="w-full accent-[#B99A6B] cursor-pointer h-1.5 bg-[#F8F6F2] border border-black/10 rounded-lg"
        />
        <div className="flex justify-between text-[11px] text-[#777777]">
          <span>₹1,500</span>
          <span>₹{maxPriceLimit.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Sizes Filter */}
      {availableSizes.length > 0 && (
        <div className="pt-5 space-y-3">
          <h4 className="font-semibold uppercase tracking-wider-luxury text-[#0A0A0A]">
            Size
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((sz) => {
              const isSelected = filters.sizes.includes(sz);
              return (
                <button
                  key={sz}
                  onClick={() => toggleSize(sz)}
                  className={`px-3 py-1.5 text-[11px] font-medium border rounded-sm transition-all ${
                    isSelected
                      ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-xs'
                      : 'bg-white text-[#171717] border-[rgba(185,154,107,0.25)] hover:border-[#0A0A0A]'
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
          <h4 className="font-semibold uppercase tracking-wider-luxury text-[#0A0A0A]">
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
                    isSelected ? 'border-[#B99A6B] scale-110 shadow-sm ring-2 ring-black/10' : 'border-black/10 hover:scale-105'
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
        <h4 className="font-semibold uppercase tracking-wider-luxury text-[#0A0A0A]">
          Client Rating
        </h4>
        <div className="space-y-2">
          {[4.8, 4.5, 4.0].map((starVal) => (
            <label
              key={starVal}
              className="flex items-center gap-2 cursor-pointer text-[#171717] hover:text-[#0A0A0A]"
            >
              <input
                type="radio"
                name="rating-filter"
                checked={filters.ratings === starVal}
                onChange={() => onFilterChange({ ...filters, ratings: filters.ratings === starVal ? null : starVal })}
                className="w-3.5 h-3.5 text-[#0A0A0A] border-[rgba(185,154,107,0.4)] focus:ring-[#B99A6B]"
              />
              <span className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold">{starVal}+</span>
                <Star className="w-3.5 h-3.5 fill-[#B99A6B] text-[#B99A6B]" />
                <span className="text-[#777777]">and above</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability / In-Stock Only */}
      <div className="pt-5">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-semibold uppercase tracking-wider-luxury text-[#0A0A0A]">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded text-[#0A0A0A] border-[rgba(185,154,107,0.4)] focus:ring-[#B99A6B]"
          />
        </label>
      </div>
    </aside>
  );
};
