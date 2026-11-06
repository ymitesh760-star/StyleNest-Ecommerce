import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, Heart, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { LuxuryImage } from '../common/LuxuryImage';
import { FALLBACK_IMAGES } from '../../utils/imageUtils';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVolume, setSelectedVolume] = useState<string>('');
  const [quantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  if (!product) return null;

  // Initialize defaults if not set
  const currentSize = selectedSize || (product.sizes && product.sizes[0]) || '';
  const currentColor = selectedColor || (product.colors && product.colors[0].name) || '';
  const currentVolume = selectedVolume || (product.volumes && product.volumes[0].size) || '';

  // Calculate dynamic price if perfume with volume
  let displayPrice = product.price;
  if (product.volumes && product.volumes.length > 0) {
    const vol = product.volumes.find((v) => v.size === currentVolume) || product.volumes[0];
    displayPrice = Math.round(product.price * vol.priceMultiplier);
  }

  const handleAddToCart = () => {
    setErrorMsg('');
    if (product.sizes && product.sizes.length > 0 && !currentSize) {
      setErrorMsg('Please select a size before adding to bag.');
      return;
    }

    const success = addToCart(product, {
      size: currentSize,
      color: currentColor,
      volume: currentVolume,
      quantity,
    });

    if (success) {
      onClose();
    }
  };

  const isSaved = isInWishlist(product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A0710]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FDFBF7] rounded-none max-w-4xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col md:flex-row border border-[#D8BD83]/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 bg-[#F8F0E2]/90 backdrop-blur rounded-none text-[#89786C] hover:text-[#4A0E1C] border border-[#D8BD83]/40 shadow-xs transition-colors"
          aria-label="Close quick view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-[#F2E6D2]/40 border-r border-[#D8BD83]/30">
          <div className="relative aspect-[3/4] bg-[#EFE7D7] overflow-hidden rounded-none mb-4 border border-[#D8BD83]/30">
            <LuxuryImage
              src={product.images?.[activeImageIdx] || product.images?.[0] || product.image || product.imageUrl}
              alt={product.name}
              fallbackSrc={FALLBACK_IMAGES[product.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default}
              className="w-full h-full object-cover"
            />
            {product.badges && product.badges.length > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#4A0E1C] text-[#F8F0E2] border border-[#D8BD83]/40">
                {product.badges[0]}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-16 rounded-none overflow-hidden border-2 transition-all ${
                    activeImageIdx === idx ? 'border-[#4A0E1C] scale-105' : 'border-[#D8BD83]/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <LuxuryImage
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fallbackSrc={FALLBACK_IMAGES[product.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Controls */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#89786C]">
                {product.brand} &bull; {product.subcategory}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-1.5 transition-colors ${isSaved ? 'text-[#4A0E1C]' : 'text-[#89786C] hover:text-[#4A0E1C]'}`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#4A0E1C]' : ''}`} />
              </button>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#32141B] mt-1 mb-2">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-[#D8BD83]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-[#D8BD83]' : 'text-[#D8BD83]/30'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-[#89786C] font-mono">
                {product.rating} ({product.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-[#D8BD83]/30">
              <span className="text-2xl font-bold text-[#4A0E1C] font-mono">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#89786C] line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-xs text-[#6A5559] leading-relaxed mb-6 line-clamp-3">
              {product.description}
            </p>

            {/* Sizes (Clothing / Shoes) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center text-xs font-medium text-[#32141B] mb-2">
                  <span className="uppercase font-mono tracking-wider font-semibold">Select Size:</span>
                  <span className="text-[#89786C] font-mono">{currentSize || 'Required'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-10 h-9 px-3 text-xs font-medium rounded-none border transition-all ${
                        currentSize === s
                          ? 'bg-[#4A0E1C] text-[#F8F0E2] border-[#4A0E1C]'
                          : 'bg-white text-[#32141B] border-[#D8BD83]/50 hover:border-[#4A0E1C]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Volumes (Perfume) */}
            {product.volumes && product.volumes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center text-xs font-medium text-[#32141B] mb-2">
                  <span className="uppercase font-mono tracking-wider font-semibold">Select Volume:</span>
                  <span className="text-[#89786C] font-mono">{currentVolume}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.volumes.map((v) => (
                    <button
                      key={v.size}
                      onClick={() => setSelectedVolume(v.size)}
                      className={`h-9 px-4 text-xs font-medium rounded-none border transition-all ${
                        currentVolume === v.size
                          ? 'bg-[#4A0E1C] text-[#F8F0E2] border-[#4A0E1C]'
                          : 'bg-white text-[#32141B] border-[#D8BD83]/50 hover:border-[#4A0E1C]'
                      }`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-medium text-[#32141B] mb-2">
                  <span className="uppercase font-mono tracking-wider font-semibold">Color:</span>
                  <span className="text-[#89786C]">{currentColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-6 h-6 rounded-full border-2 transition-all relative ${
                        currentColor === c.name ? 'border-[#4A0E1C] scale-110 shadow-xs' : 'border-black/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {currentColor === c.name && (
                        <Check className="w-3 h-3 text-white absolute inset-0 m-auto mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errorMsg && <p className="text-xs text-rose-600 mb-3">{errorMsg}</p>}
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#D8BD83]/30 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-3.5 bg-[#4A0E1C] hover:bg-[#2A0710] text-[#F8F0E2] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#D8BD83]/40 transition-colors shadow-sm disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-[#D8BD83]" />
                {product.inStock ? 'Add to Shopping Bag' : 'Out of Stock'}
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="block text-center text-xs font-semibold uppercase font-mono tracking-wider text-[#4A0E1C] hover:text-[#2A0710] transition-colors pt-1"
            >
              View Full Product Specifications &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
