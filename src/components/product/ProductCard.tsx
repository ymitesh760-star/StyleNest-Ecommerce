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
        className="group flex flex-col relative bg-white border border-black/10 rounded-xs p-2 sm:p-2.5 transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-[#F8F6F2] overflow-hidden rounded-xs border border-black/5 group-hover:border-black/20 transition-all duration-300">
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
                className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider-luxury rounded-xs shadow-xs ${
                  badge === 'Sale'
                    ? 'bg-[#0A0A0A] text-[#B99A6B] border border-[#B99A6B]/30'
                    : badge === 'Bestseller'
                    ? 'bg-[#171717] text-white'
                    : 'bg-white/95 text-[#0A0A0A] backdrop-blur-sm'
                }`}
              >
                {badge}
              </span>
            ))}
            {discountPercent > 0 && !product.badges?.includes('Sale') && (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider-luxury rounded-xs bg-[#B99A6B] text-[#0A0A0A]">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#171717] hover:text-rose-600 shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 z-10 border border-black/5"
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 transition-colors ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          {/* Hover Action Bar (Quick View & Quick Add on Desktop) */}
          <div className="absolute inset-x-2.5 bottom-2.5 hidden sm:flex items-center gap-2 transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="flex-1 py-2.5 bg-white/95 backdrop-blur-sm text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white text-[11px] font-semibold uppercase tracking-wider-luxury rounded-xs shadow-md transition-all flex items-center justify-center gap-1.5 border border-black/5"
            >
              <Eye className="w-3.5 h-3.5 text-[#B99A6B]" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleQuickAdd}
              className="p-2.5 bg-[#0A0A0A] text-[#B99A6B] hover:bg-[#B99A6B] hover:text-[#0A0A0A] rounded-xs shadow-md transition-all"
              title="Add to Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Meta */}
        <div className="pt-3.5 pb-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] text-[#777777] uppercase tracking-wider-luxury font-semibold mb-1">
              <span>{product.brand}</span>
              <div className="flex items-center gap-0.5 text-amber-500 font-medium">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current text-amber-500' : 'text-neutral-300'}`}
                  />
                ))}
                <span className="text-[10px] text-[#777777] ml-1 font-mono">({product.reviewsCount || 24})</span>
              </div>
            </div>

            <Link
              to={`/product/${product.id}`}
              className="font-sans text-xs sm:text-sm font-bold text-[#0A0A0A] hover:text-neutral-600 transition-colors line-clamp-1 block mb-1"
            >
              {product.name}
            </Link>
          </div>

          <div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xs sm:text-sm font-black text-[#0A0A0A]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-neutral-400 line-through font-light">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Colors or Volume indicator */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200">
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
                    <span className="text-[10px] text-neutral-500 font-medium">+{product.colors.length - 4}</span>
                  )}
                </div>
              ) : product.volumes && product.volumes.length > 0 ? (
                <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                  {product.volumes.map((v) => v.size).join(' • ')}
                </span>
              ) : (
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                  {product.subcategory}
                </span>
              )}

              <span className="text-[10px] text-emerald-700 font-semibold tracking-wide">
                Free Delivery
              </span>
            </div>

            {/* Direct ADD TO CART button (Amazon / screenshot style) */}
            <button
              onClick={handleQuickAdd}
              className="mt-3 w-full py-2 px-3 bg-[#0A0A0A] hover:bg-neutral-800 text-white rounded-none text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
              title="Add to Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
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
