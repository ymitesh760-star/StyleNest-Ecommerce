import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, Heart, Check, ShoppingBag, ArrowRight } from 'lucide-react';
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
  const [quantity, setQuantity] = useState(1);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-elan-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-sm max-w-4xl w-full overflow-hidden shadow-luxury relative max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 backdrop-blur rounded-full text-elan-700 hover:text-elan-950 shadow-sm transition-colors"
          aria-label="Close quick view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-elan-50/50">
          <div className="relative aspect-[3/4] bg-elan-100 overflow-hidden rounded-sm mb-4">
            <LuxuryImage
              src={product.images?.[activeImageIdx] || product.images?.[0] || product.image || product.imageUrl}
              alt={product.name}
              fallbackSrc={FALLBACK_IMAGES[product.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default}
              className="w-full h-full object-cover"
            />
            {product.badges && product.badges.length > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider-luxury bg-elan-950 text-white">
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
                  className={`w-14 h-16 rounded-sm overflow-hidden border-2 transition-all ${
                    activeImageIdx === idx ? 'border-elan-950 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
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
              <span className="text-[10px] uppercase tracking-wider-luxury font-bold text-elan-400">
                {product.brand} &bull; {product.subcategory}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-1.5 transition-colors ${isSaved ? 'text-rose-600' : 'text-elan-400 hover:text-rose-600'}`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h3 className="font-serif-luxury text-2xl font-bold text-elan-950 mt-1 mb-2">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-elan-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-elan-500">
                {product.rating} ({product.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-elan-100">
              <span className="text-2xl font-bold text-elan-950 font-serif-luxury">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-elan-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-xs text-elan-600 leading-relaxed mb-6 line-clamp-3">
              {product.description}
            </p>

            {/* Sizes (Clothing / Shoes) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center text-xs font-medium text-elan-800 mb-2">
                  <span className="uppercase tracking-wider-luxury font-semibold">Select Size:</span>
                  <span className="text-elan-500">{currentSize || 'Required'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-10 h-9 px-3 text-xs font-medium rounded-sm border transition-all ${
                        currentSize === s
                          ? 'bg-elan-950 text-white border-elan-950'
                          : 'bg-white text-elan-800 border-elan-200 hover:border-elan-400'
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
                <div className="flex justify-between items-center text-xs font-medium text-elan-800 mb-2">
                  <span className="uppercase tracking-wider-luxury font-semibold">Select Volume:</span>
                  <span className="text-elan-500">{currentVolume}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.volumes.map((v) => (
                    <button
                      key={v.size}
                      onClick={() => setSelectedVolume(v.size)}
                      className={`h-9 px-4 text-xs font-medium rounded-sm border transition-all ${
                        currentVolume === v.size
                          ? 'bg-elan-950 text-white border-elan-950'
                          : 'bg-white text-elan-800 border-elan-200 hover:border-elan-400'
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
                <div className="flex justify-between items-center text-xs font-medium text-elan-800 mb-2">
                  <span className="uppercase tracking-wider-luxury font-semibold">Color:</span>
                  <span className="text-elan-500">{currentColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-6 h-6 rounded-full border-2 transition-all relative ${
                        currentColor === c.name ? 'border-elan-950 scale-110' : 'border-white hover:scale-105'
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
          <div className="pt-4 border-t border-elan-100 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.inStock ? 'Add to Shopping Bag' : 'Out of Stock'}
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="block text-center text-xs font-semibold uppercase tracking-wider-luxury text-elan-800 hover:text-elan-gold transition-colors pt-1"
            >
              View Full Product Specifications &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
