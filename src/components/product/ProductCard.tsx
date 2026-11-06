import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { QuickViewModal } from './QuickViewModal';
import { LuxuryImage } from '../common/LuxuryImage';
import { FALLBACK_IMAGES } from '../../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isSaved = isInWishlist(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If product requires size selection or volume selection, open quick view modal for choice!
    if ((product.sizes && product.sizes.length > 1) || (product.volumes && product.volumes.length > 1)) {
      setIsQuickViewOpen(true);
    } else {
      addToCart(product, {
        size: product.sizes?.[0],
        color: product.colors?.[0]?.name,
        volume: product.volumes?.[0]?.size,
        quantity: 1,
      });
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const primaryImage =
    product.images?.[0] || product.image || product.imageUrl || product.thumbnail || FALLBACK_IMAGES[product.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default;
  const secondaryImage = product.images?.[1] || primaryImage;
  const hasMultipleImages = Array.isArray(product.images) && product.images.length > 1;
  const fallback = FALLBACK_IMAGES[product.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default;

  return (
    <>
      <div
        className="group flex flex-col relative bg-[#FDFBF7] border border-[#D8BD83]/35 rounded-none p-2 sm:p-2.5 transition-all duration-300 hover:border-[#4A0E1C]/60 hover:shadow-[0_12px_30px_-10px_rgba(74,14,28,0.12)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-[#F2E6D2]/50 overflow-hidden border border-[#D8BD83]/20 group-hover:border-[#D8BD83]/60 transition-all duration-300">
          <Link to={`/product/${product.id}`} className="block w-full h-full relative">
            {/* Primary Image */}
            <LuxuryImage
              src={primaryImage}
              alt={product.name}
              fallbackSrc={fallback}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                isHovered && hasMultipleImages ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              }`}
              loading="lazy"
            />

            {/* Secondary Image for Hover Reveal */}
            {hasMultipleImages && (
              <LuxuryImage
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                fallbackSrc={fallback}
                containerClassName="absolute inset-0"
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                  isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                loading="lazy"
              />
            )}
          </Link>

          {/* Badges: New, Bestseller, Sale */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none z-10">
            {product.badges?.map((badge) => (
              <span
                key={badge}
                className={`px-2 py-0.5 text-[9px] font-bold uppercase font-mono tracking-wider shadow-xs ${
                  badge === 'Sale'
                    ? 'bg-[#4A0E1C] text-[#F8F0E2] border border-[#D8BD83]/40'
                    : badge === 'Bestseller'
                    ? 'bg-[#2A0710] text-[#D8BD83] border border-[#D8BD83]/30'
                    : 'bg-[#F8F0E2]/95 text-[#32141B] border border-[#D8BD83]/50 backdrop-blur-sm'
                }`}
              >
                {badge}
              </span>
            ))}
            {discountPercent > 0 && !product.badges?.includes('Sale') && (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase font-mono tracking-wider bg-[#D8BD83] text-[#2A0710] border border-[#2A0710]/20">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#F8F0E2]/90 backdrop-blur-sm flex items-center justify-center text-[#4A0E1C] hover:text-[#991B1B] shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 z-10 border border-[#D8BD83]/40"
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 transition-colors ${isSaved ? 'fill-[#4A0E1C] text-[#4A0E1C]' : ''}`} />
          </button>

          {/* Hover Action Bar (Quick View & Quick Add on Desktop) */}
          <div className="absolute inset-x-2.5 bottom-2.5 hidden sm:flex items-center gap-2 transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="flex-1 py-2.5 bg-[#F8F0E2]/95 backdrop-blur-sm text-[#32141B] hover:bg-[#4A0E1C] hover:text-[#F8F0E2] text-[11px] font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 border border-[#D8BD83]/50"
            >
              <Eye className="w-3.5 h-3.5 text-[#D8BD83]" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleQuickAdd}
              className="p-2.5 bg-[#4A0E1C] text-[#D8BD83] hover:bg-[#2A0710] hover:text-[#F8F0E2] shadow-md transition-all border border-[#D8BD83]/40"
              title="Add to Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Meta */}
        <div className="pt-3.5 pb-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] text-[#89786C] uppercase font-mono tracking-wider font-semibold mb-1">
              <span>{product.brand}</span>
              <div className="flex items-center gap-0.5 text-[#D8BD83] font-medium">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-[#D8BD83] text-[#D8BD83]' : 'text-[#D8BD83]/30'}`}
                  />
                ))}
                <span className="text-[10px] text-[#89786C] ml-1 font-mono">({product.reviewsCount || 24})</span>
              </div>
            </div>

            <Link
              to={`/product/${product.id}`}
              className="font-serif text-xs sm:text-sm font-bold text-[#32141B] hover:text-[#4A0E1C] transition-colors line-clamp-1 block mb-1"
            >
              {product.name}
            </Link>
          </div>

          <div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xs sm:text-sm font-bold text-[#4A0E1C] font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-[#89786C] line-through font-light font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Colors or Volume indicator */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D8BD83]/25">
              {product.colors && product.colors.length > 0 ? (
                <div className="flex items-center gap-1.5">
                  {product.colors.slice(0, 4).map((c) => (
                    <span
                      key={c.name}
                      className="w-2.5 h-2.5 rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                  {product.colors.length > 4 && (
                    <span className="text-[10px] text-[#89786C] font-medium">+{product.colors.length - 4}</span>
                  )}
                </div>
              ) : product.volumes && product.volumes.length > 0 ? (
                <span className="text-[10px] text-[#89786C] font-medium uppercase font-mono tracking-wider">
                  {product.volumes.map((v) => v.size).join(' • ')}
                </span>
              ) : (
                <span className="text-[10px] text-[#89786C] uppercase font-mono tracking-wider">
                  {product.subcategory}
                </span>
              )}

              <span className="text-[10px] text-[#4A0E1C] font-semibold tracking-wide font-mono">
                Free Delivery
              </span>
            </div>

            {/* Direct ADD TO CART button */}
            <button
              onClick={handleQuickAdd}
              className="mt-3 w-full py-2 px-3 bg-[#4A0E1C] hover:bg-[#2A0710] text-[#F8F0E2] hover:text-[#D8BD83] rounded-none text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs border border-[#D8BD83]/30 active:scale-[0.98]"
              title="Add to Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={isQuickViewOpen ? product : null}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
