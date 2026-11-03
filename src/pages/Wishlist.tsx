import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { FALLBACK_IMAGES } from '../utils/imageUtils';

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  React.useEffect(() => {
    document.title = 'Saved Wishlist | STYLENEST';
    window.scrollTo(0, 0);
  }, []);

  const handleMoveToBag = (product: Product) => {
    // If has sizes or perfume volumes, open selection modal
    if ((product.sizes && product.sizes.length > 1) || (product.volumes && product.volumes.length > 1)) {
      setSelectedProductForModal(product);
    } else {
      addToCart(product, {
        size: product.sizes?.[0],
        color: product.colors?.[0]?.name,
        volume: product.volumes?.[0]?.size,
        quantity: 1,
      });
      removeFromWishlist(product.id);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-24 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#F8F6F2] border border-[rgba(185,154,107,0.3)] flex items-center justify-center text-[#B99A6B] mb-6">
          <Heart className="w-8 h-8 text-[#B99A6B]" />
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-3">
          Your Wishlist is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#777777] max-w-md mx-auto mb-8 font-light">
          Save your favorite luxury garments, footwear, and rare fragrances by clicking the heart icon as you explore.
        </p>
        <Link to="/men" className="btn-primary py-4 px-10">
          Explore The Portfolios
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[rgba(185,154,107,0.22)] mb-8">
        <div>
          <span className="text-[10px] uppercase tracking-widest-luxury text-[#B99A6B] font-bold">
            Personal Atelier
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#0A0A0A] mt-1">
            Saved Wishlist ({wishlistCount})
          </h1>
        </div>

        <button
          onClick={clearWishlist}
          className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider-luxury text-[#777777] hover:text-rose-600 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Wishlist</span>
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-xs border border-[rgba(185,154,107,0.2)] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-luxury hover:border-[rgba(185,154,107,0.45)] transition-all duration-300"
          >
            <div>
              {/* Image with Link */}
              <div className="relative aspect-[3/4] bg-[#F8F6F2] overflow-hidden">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                  <LuxuryImage
                    src={product.images?.[0] || product.image || product.imageUrl || product.thumbnail}
                    alt={product.name}
                    fallbackSrc={FALLBACK_IMAGES[product.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Remove button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#777777] hover:text-rose-600 shadow-sm transition-colors border border-black/5"
                  aria-label="Remove item from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Meta */}
              <div className="p-4">
                <span className="text-[10px] uppercase tracking-wider-luxury text-[#B99A6B] font-semibold block mb-0.5">
                  {product.brand}
                </span>
                <Link
                  to={`/product/${product.id}`}
                  className="font-serif-luxury text-base font-semibold text-[#0A0A0A] hover:text-[#B99A6B] transition-colors line-clamp-1 block mb-2"
                >
                  {product.name}
                </Link>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[#0A0A0A]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#777777] line-through font-light">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Move to bag button */}
            <div className="p-4 pt-0">
              <button
                onClick={() => handleMoveToBag(product)}
                className="w-full btn-primary py-2.5 text-xs flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#B99A6B]" />
                <span>Move to Bag</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Variant Selection Modal if multi-option */}
      {selectedProductForModal && (
        <QuickViewModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}
    </div>
  );
};
