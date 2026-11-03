import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, Check,
  ChevronRight, ChevronLeft, Sparkles, MapPin, Ruler, ZoomIn, X,
  Share2, ArrowRight, MessageSquare, RefreshCw, Banknote
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/product/ProductCard';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { normalizeProduct, FALLBACK_IMAGES } from '../utils/imageUtils';

const RECENTLY_VIEWED_KEY = 'stylenest_recently_viewed_v2';

interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const DEFAULT_REVIEWS: Record<string, ReviewItem[]> = {
  general: [
    {
      id: 'rev-1',
      author: 'Ananya Sharma',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      date: '2 days ago',
      comment: 'The drape and texture exceed expectations. Packaging arrived in a museum-grade keepsake box with silk ribbon.',
      verified: true,
    },
    {
      id: 'rev-2',
      author: 'Vikramaditya Mehta',
      location: 'New Delhi',
      rating: 5,
      date: '1 week ago',
      comment: 'Impeccable tailoring. Fabric breathability and hand-feel are on par with bespoke Milanese houses.',
      verified: true,
    },
    {
      id: 'rev-3',
      author: 'Rohit Singhania',
      location: 'Bengaluru',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Very fast complimentary delivery. Fits true to size with a flattering European silhouette.',
      verified: true,
    }
  ]
};

export const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { products, loading, error } = useProducts();
  const toast = useToast();

  const product = useMemo(() => {
    const raw = products.find((p) => p.id === productId) || PRODUCTS.find((p) => p.id === productId) || null;
    return raw ? normalizeProduct(raw) : null;
  }, [productId, products]);

  const isProductFound = Boolean(product);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVolume, setSelectedVolume] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Postcode checker state
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{ message: string; isSuccess: boolean } | null>(null);

  // Modals state
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  // Active accordion tab
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'craft' | 'reviews'>('details');

  // Sticky Add to Cart bar state on mobile
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainActionsRef = useRef<HTMLDivElement>(null);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_REVIEWS.general);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Mobile swipe touch tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Reset and load product options
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | STYLENEST Luxury Brand`;
      window.scrollTo(0, 0);

      setActiveImageIdx(0);
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0]?.name || '');
      setSelectedVolume(product.volumes?.[0]?.size || '');
      setQuantity(1);
      setErrorMsg('');
      setPincodeResult(null);

      // Save to recently viewed
      try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        let list: string[] = stored ? JSON.parse(stored) : [];
        list = [product.id, ...list.filter((id) => id !== product.id)].slice(0, 5);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));

        const recentObjs = list
          .filter((id) => id !== product.id)
          .map((id) => PRODUCTS.find((p) => p.id === id))
          .filter(Boolean) as Product[];
        setRecentlyViewed(recentObjs.slice(0, 4));
      } catch (e) {
        console.error(e);
      }
    }
  }, [product]);

  // Handle mobile scroll for sticky action bar
  useEffect(() => {
    const handleScroll = () => {
      if (mainActionsRef.current) {
        const rect = mainActionsRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard controls for lightbox
  useEffect(() => {
    if (!isZoomOpen || !product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIdx((prev) => (prev + 1) % product.images.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIdx((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen, product?.images?.length]);

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || !product) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // Swiped left -> next
      setActiveImageIdx((prev) => (prev + 1) % product.images.length);
    } else if (diff < -50) {
      // Swiped right -> prev
      setActiveImageIdx((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Dynamic price calculation
  const currentPrice = useMemo(() => {
    if (!product) return 0;
    if (product.volumes && product.volumes.length > 0) {
      const vol = product.volumes.find((v) => v.size === selectedVolume) || product.volumes[0];
      return Math.round(product.price * vol.priceMultiplier);
    }
    return product.price;
  }, [product, selectedVolume]);

  const discountPercent = useMemo(() => {
    if (!product || !product.originalPrice || product.originalPrice <= currentPrice) return 0;
    return Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100);
  }, [product, currentPrice]);

  const handleAddToCart = (): boolean => {
    if (!product) return false;
    setErrorMsg('');
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setErrorMsg('Please select a size before adding to bag.');
      toast.error('Size Selection Required', 'Please choose your preferred size to proceed.');
      return false;
    }

    const success = addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      volume: selectedVolume,
      quantity,
    });

    if (success) {
      toast.luxury('Added to Bag', `${quantity}x ${product.name} (${selectedSize || selectedVolume || 'Standard'}) added.`);
    }
    return success;
  };

  const handleBuyNow = () => {
    const success = handleAddToCart();
    if (success) {
      navigate('/checkout');
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    const pinRegex = /^[1-9][0-9]{5}$/;

    if (!pinRegex.test(cleanPin)) {
      setPincodeResult({
        message: 'Please enter a valid 6-digit Indian Postal PIN code (e.g., 400001, 110001).',
        isSuccess: false,
      });
      return;
    }

    if (['400', '110', '560', '600', '700', '500'].some((prefix) => cleanPin.startsWith(prefix))) {
      setPincodeResult({
        message: `✓ PIN ${cleanPin}: Express Next-Day Courier available. Order within 4 hours for priority dispatch.`,
        isSuccess: true,
      });
    } else {
      setPincodeResult({
        message: `✓ PIN ${cleanPin}: Standard Complimentary Express delivery in 2-3 business days.`,
        isSuccess: true,
      });
    }
  };

  const handleShare = () => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.luxury('Link Copied', 'Product link copied to clipboard.');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      location: 'Verified Client',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setIsWriteReviewOpen(false);
    setNewReviewAuthor('');
    setNewReviewComment('');
    toast.luxury('Review Published', 'Thank you for sharing your experience with the Atelier.');
  };

  // Related products from same category
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product, products]);

  const isSaved = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#B99A6B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest-luxury text-[#B99A6B] font-semibold">
          Loading Atelier Creation...
        </p>
      </div>
    );
  }

  if (!isProductFound || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-4">
        <h2 className="font-serif-luxury text-3xl font-bold text-elan-950">Creation Not Found</h2>
        <p className="text-xs text-elan-500 max-w-md mx-auto">
          The artisanal piece you are seeking may have been archived or retired from our current collection.
        </p>
        <Link to="/men" className="btn-primary inline-block py-3 px-8 text-xs tracking-wider">
          Explore Current Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-elan-100 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] uppercase tracking-wider-luxury text-elan-400">
          <div className="flex items-center gap-2 overflow-hidden">
            <Link to="/" className="hover:text-elan-950 transition-colors shrink-0">Home</Link>
            <ChevronRight className="w-3 h-3 text-elan-300 shrink-0" />
            <Link to={`/${product.category}`} className="hover:text-elan-950 transition-colors capitalize shrink-0">
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-elan-300 shrink-0" />
            <span className="text-elan-950 font-semibold truncate">{product.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-elan-600 hover:text-elan-950 transition-colors ml-4 shrink-0 text-[10px] font-semibold"
            title="Share this creation"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* ==================================================== */}
          {/* Left Column: Image Gallery with Interactive Zoom */}
          {/* ==================================================== */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails Navigation */}
            {product.images.length > 1 && (
              <div
                className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[640px] shrink-0 pb-2 sm:pb-0 scrollbar-none"
                role="tablist"
                aria-label="Product thumbnails"
              >
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    role="tab"
                    aria-selected={activeImageIdx === idx}
                    aria-label={`View product image ${idx + 1}`}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 rounded-sm overflow-hidden border-2 transition-all duration-200 shrink-0 relative group ${
                      activeImageIdx === idx
                        ? 'border-elan-950 ring-2 ring-elan-950/20 scale-[1.02]'
                        : 'border-elan-200 opacity-70 hover:opacity-100 hover:border-elan-400'
                    }`}
                  >
                    <LuxuryImage
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fallbackSrc={FALLBACK_IMAGES[product.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Featured Image with Click-to-Zoom & Swipe */}
            <div
              className="flex-1 relative aspect-[3/4] bg-elan-100 rounded-sm overflow-hidden group select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="w-full h-full cursor-zoom-in relative"
                onClick={() => setIsZoomOpen(true)}
              >
                <LuxuryImage
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.name}
                  fallbackSrc={FALLBACK_IMAGES[product.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default}
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Product Badges */}
              {product.badges && product.badges.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                  {product.badges.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider-luxury bg-elan-950 text-white shadow-luxury"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {/* Mobile Swipe Indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:hidden bg-elan-950/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImageIdx === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-4 right-4 p-2.5 bg-white/90 backdrop-blur rounded-full text-elan-800 hover:text-elan-950 hover:bg-white shadow-luxury transition-all duration-200"
                title="Enlarge Image (Click to zoom)"
                aria-label="Enlarge Image"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ==================================================== */}
          {/* Right Column: Product Purchasing Engine */}
          {/* ==================================================== */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Brand and Stock Telemetry */}
              <div className="flex items-center justify-between text-xs text-elan-400 uppercase tracking-widest-luxury font-bold mb-1.5">
                <span>{product.brand} &bull; {product.subcategory}</span>
                <span className={product.inStock ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                  {product.inStock ? `In Stock (${product.stockCount} available)` : 'Sold Out'}
                </span>
              </div>

              {/* Product Headline */}
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[40px] font-bold text-elan-950 leading-tight">
                {product.name}
              </h1>

              {/* Star Ratings & Atelier Reviews */}
              <div className="flex items-center gap-2.5 mt-2.5">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-elan-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-elan-900">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-elan-400">
                  &bull; ({product.reviewsCount} verified atelier reviews)
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex flex-wrap items-baseline gap-3 pb-6 border-b border-elan-200">
              <span className="font-serif-luxury text-3xl sm:text-4xl font-bold text-elan-950">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <span className="text-base text-elan-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                  {discountPercent}% OFF
                </span>
              )}
              <span className="text-[11px] text-elan-400 ml-auto uppercase tracking-wider font-medium">
                Inclusive of all taxes
              </span>
            </div>

            {/* Product Summary */}
            <p className="text-xs sm:text-sm text-elan-700 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Fragrance Notes Spotlight (if Perfume) */}
            {product.fragranceNotes && (
              <div className="bg-elan-50 p-4 rounded-sm border border-elan-200 space-y-2.5 text-xs">
                <p className="font-semibold uppercase tracking-wider-luxury text-elan-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-elan-gold" />
                  <span>Olfactory Architecture ({product.longevity || 'Extrait de Parfum'})</span>
                </p>
                <div className="grid grid-cols-3 gap-2.5 pt-1 text-[11px]">
                  <div>
                    <span className="text-elan-400 uppercase tracking-wider font-semibold block mb-0.5">Top</span>
                    <span className="text-elan-900 font-medium">{product.fragranceNotes.top.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-elan-400 uppercase tracking-wider font-semibold block mb-0.5">Heart</span>
                    <span className="text-elan-900 font-medium">{product.fragranceNotes.heart.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-elan-400 uppercase tracking-wider font-semibold block mb-0.5">Base</span>
                    <span className="text-elan-900 font-medium">{product.fragranceNotes.base.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Volume Selector (Perfumes) */}
            {product.volumes && product.volumes.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider-luxury text-elan-900">
                  <span>Select Flacon Volume:</span>
                  <span className="text-elan-gold font-bold">{selectedVolume}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.volumes.map((vol) => (
                    <button
                      key={vol.size}
                      onClick={() => setSelectedVolume(vol.size)}
                      className={`px-4 py-2 text-xs font-medium border rounded-sm transition-all ${
                        selectedVolume === vol.size
                          ? 'bg-elan-950 text-white border-elan-950 shadow-sm'
                          : 'bg-white text-elan-800 border-elan-200 hover:border-elan-400'
                      }`}
                    >
                      {vol.size} &bull; ₹{Math.round(product.price * vol.priceMultiplier).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector (Clothing & Shoes) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider-luxury text-elan-900">
                  <span>Available Size:</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-elan-600 hover:text-elan-950 underline decoration-elan-300 normal-case font-normal transition-colors"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide & Fit</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-12 h-10 px-3.5 text-xs font-medium border rounded-sm transition-all ${
                        selectedSize === sz
                          ? 'bg-elan-950 text-white border-elan-950 shadow-sm font-semibold'
                          : 'bg-white text-elan-800 border-elan-200 hover:border-elan-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider-luxury text-elan-900">
                  <span>Selected Shade:</span>
                  <span className="text-elan-600 font-normal">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-7 h-7 rounded-full border-2 transition-all relative ${
                        selectedColor === c.name
                          ? 'border-elan-950 ring-2 ring-elan-950/20 scale-110 shadow-sm'
                          : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={`Select ${c.name} color`}
                    >
                      {selectedColor === c.name && (
                        <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Controller & Stock */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider-luxury text-elan-900">
                Quantity:
              </span>
              <div className="flex items-center border border-elan-300 rounded-sm bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-elan-600 hover:bg-elan-100 transition-colors"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-elan-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  className="px-3 py-1.5 text-elan-600 hover:bg-elan-100 transition-colors"
                  aria-label="Increase quantity"
                  disabled={quantity >= product.stockCount}
                >
                  +
                </button>
              </div>
              <span className="text-xs text-elan-400">
                (Max: {product.stockCount})
              </span>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium bg-rose-50 border border-rose-200 px-3 py-2 rounded-sm">
                {errorMsg}
              </p>
            )}

            {/* Action Buttons: Add to Bag, Buy Now, Wishlist */}
            <div ref={mainActionsRef} className="space-y-3 pt-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="btn-primary flex-1 py-4 flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  <span>{product.inStock ? 'Add to Shopping Bag' : 'Sold Out'}</span>
                </button>
                
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 border rounded-sm transition-all duration-200 ${
                    isSaved
                      ? 'border-rose-600 bg-rose-50 text-rose-600'
                      : 'border-elan-300 hover:border-elan-950 text-elan-800'
                  }`}
                  aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-5 h-5 transition-transform duration-200 active:scale-125 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="btn-gold w-full py-4 text-center font-bold tracking-wider-luxury text-xs shadow-luxury hover:shadow-luxury-hover"
              >
                Proceed to Checkout with 1-Click
              </button>
            </div>

            {/* Amazon-style Delivery & Refund Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 pb-2 border-y border-[rgba(185,154,107,0.22)] my-4 text-center">
              <div className="p-2.5 bg-[#F8F6F2] rounded-xs flex flex-col items-center justify-center border border-[rgba(185,154,107,0.15)]">
                <Truck className="w-4 h-4 text-[#B99A6B] mb-1" />
                <span className="text-[10px] font-bold text-[#0A0A0A] uppercase tracking-wider">Free Delivery</span>
                <span className="text-[9px] text-[#777777]">Within 2-3 Days</span>
              </div>
              <div className="p-2.5 bg-[#F8F6F2] rounded-xs flex flex-col items-center justify-center border border-[rgba(185,154,107,0.15)]">
                <RefreshCw className="w-4 h-4 text-[#B99A6B] mb-1" />
                <span className="text-[10px] font-bold text-[#0A0A0A] uppercase tracking-wider">14-Day Returns</span>
                <span className="text-[9px] text-emerald-700 font-semibold">100% Refundable</span>
              </div>
              <div className="p-2.5 bg-[#F8F6F2] rounded-xs flex flex-col items-center justify-center border border-[rgba(185,154,107,0.15)]">
                <Banknote className="w-4 h-4 text-[#B99A6B] mb-1" />
                <span className="text-[10px] font-bold text-[#0A0A0A] uppercase tracking-wider">Pay on Delivery</span>
                <span className="text-[9px] text-[#777777]">Cash / UPI Eligible</span>
              </div>
              <div className="p-2.5 bg-[#F8F6F2] rounded-xs flex flex-col items-center justify-center border border-[rgba(185,154,107,0.15)]">
                <ShieldCheck className="w-4 h-4 text-[#B99A6B] mb-1" />
                <span className="text-[10px] font-bold text-[#0A0A0A] uppercase tracking-wider">Maison Assured</span>
                <span className="text-[9px] text-[#777777]">100% Authentic</span>
              </div>
            </div>

            {/* Delivery Postcode Checker */}
            <div className="pt-6 border-t border-elan-200">
              <p className="text-xs font-semibold uppercase tracking-wider-luxury text-elan-900 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-elan-gold" />
                <span>Verify Delivery Availability</span>
              </p>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Indian PIN (e.g. 400001)"
                  className="flex-1 bg-white border border-elan-300 px-3.5 py-2.5 text-xs rounded-sm focus:border-elan-900 outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-elan-900 text-white text-xs font-semibold uppercase tracking-wider-luxury rounded-sm hover:bg-elan-800 transition-colors"
                >
                  Check
                </button>
              </form>
              {pincodeResult && (
                <p
                  className={`text-xs mt-2.5 p-2.5 rounded-sm border ${
                    pincodeResult.isSuccess
                      ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}
                >
                  {pincodeResult.message}
                </p>
              )}
            </div>

            {/* Accordion Tabs for Details, Craftsmanship, Shipping, Reviews */}
            <div className="pt-6 border-t border-elan-200 space-y-3">
              <div className="flex border-b border-elan-200 text-xs font-semibold uppercase tracking-wider-luxury overflow-x-auto">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2.5 px-3 transition-colors shrink-0 ${
                    activeTab === 'details'
                      ? 'border-b-2 border-elan-950 text-elan-950'
                      : 'text-elan-400 hover:text-elan-950'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('craft')}
                  className={`pb-2.5 px-3 transition-colors shrink-0 ${
                    activeTab === 'craft'
                      ? 'border-b-2 border-elan-950 text-elan-950'
                      : 'text-elan-400 hover:text-elan-950'
                  }`}
                >
                  Craft & Care
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2.5 px-3 transition-colors shrink-0 ${
                    activeTab === 'shipping'
                      ? 'border-b-2 border-elan-950 text-elan-950'
                      : 'text-elan-400 hover:text-elan-950'
                  }`}
                >
                  Shipping & Returns
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 px-3 transition-colors shrink-0 ${
                    activeTab === 'reviews'
                      ? 'border-b-2 border-elan-950 text-elan-950'
                      : 'text-elan-400 hover:text-elan-950'
                  }`}
                >
                  Client Reviews ({reviews.length})
                </button>
              </div>

              {activeTab === 'details' && (
                <div className="text-xs text-elan-700 space-y-3 pt-2 animate-fade-in">
                  {product.features && (
                    <ul className="list-disc pl-4 space-y-1.5">
                      {product.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  )}
                  {product.details && (
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-elan-100">
                      {Object.entries(product.details).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-elan-400 uppercase tracking-wider font-semibold block">{key}</span>
                          <span className="text-elan-900 font-medium">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'craft' && (
                <div className="text-xs text-elan-600 space-y-2.5 pt-2 leading-relaxed animate-fade-in">
                  <p>
                    <strong className="text-elan-950">Artisanal Provenance:</strong> Sourced exclusively from heritage partners honoring generational craft techniques.
                  </p>
                  <p>
                    <strong className="text-elan-950">Textile Maintenance:</strong> To safeguard fine fiber luster and natural drape, professional dry cleaning is recommended. Store on contoured wooden hangers away from direct sunlight.
                  </p>
                  <p>
                    <strong className="text-elan-950">Sustainability Pledge:</strong> Formulated without toxic finishes and packaged in 100% recyclable FSC-certified paperboard.
                  </p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="text-xs text-elan-600 space-y-2.5 pt-2 leading-relaxed animate-fade-in">
                  <div className="flex items-start gap-2">
                    <Truck className="w-4 h-4 text-elan-gold shrink-0 mt-0.5" />
                    <p>Complimentary Express Delivery on domestic orders above ₹1,999. Typical transit: 24-48 hours in Tier 1 metropolises.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <RotateCcw className="w-4 h-4 text-elan-gold shrink-0 mt-0.5" />
                    <p>14-day complimentary doorstep return policy. Items must be in unblemished state with atelier tags intact.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-elan-gold shrink-0 mt-0.5" />
                    <p>Dispatched in signature STYLENEST keepsake gift boxes with tamper-evident serial security seal.</p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-xs space-y-4 pt-2 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-elan-100">
                    <div>
                      <span className="font-serif-luxury text-xl font-bold text-elan-950">
                        {product.rating.toFixed(1)} / 5.0
                      </span>
                      <span className="text-elan-400 ml-2">Overall Client Rating</span>
                    </div>
                    <button
                      onClick={() => setIsWriteReviewOpen(true)}
                      className="text-xs font-semibold uppercase tracking-wider-luxury text-elan-950 underline decoration-elan-gold hover:text-elan-gold"
                    >
                      Write a Review &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 bg-white rounded-sm border border-elan-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-elan-950">{rev.author}</span>
                            {rev.verified && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                                Verified
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-elan-400">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-500 py-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-elan-200'}`}
                            />
                          ))}
                        </div>
                        <p className="text-elan-600 leading-relaxed font-light">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Pairings Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-elan-200">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest-luxury text-elan-gold font-bold">
                  Curated Pairings
                </span>
                <h2 className="font-serif-luxury text-3xl font-bold text-elan-950 mt-1">
                  You May Also Admire
                </h2>
              </div>
              <Link
                to={`/${product.category}`}
                className="text-xs font-semibold uppercase tracking-wider-luxury text-elan-900 hover:text-elan-gold transition-colors flex items-center gap-1"
              >
                <span>View Full Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 pt-12 border-t border-elan-200">
            <h3 className="font-serif-luxury text-2xl font-bold text-elan-950 mb-6">
              Recently Viewed Creations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewed.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* Lightbox / Image Zoom Modal with Carousel Controls */}
      {/* ==================================================== */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-elan-950/95 backdrop-blur-md animate-fade-in select-none"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with counter & close */}
            <div className="w-full flex items-center justify-between pb-4 text-white">
              <span className="text-xs uppercase tracking-wider-luxury text-elan-300">
                {product.name} &bull; Image {activeImageIdx + 1} of {product.images.length}
              </span>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                aria-label="Close image zoom"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Lightbox Image with Nav Arrows */}
            <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-sm">
              <LuxuryImage
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                fallbackSrc={FALLBACK_IMAGES[product.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default}
                className="w-full h-auto max-h-[75vh] object-contain rounded-sm"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIdx((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIdx((prev) => (prev + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail selector strip in lightbox */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1 max-w-full">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-12 h-14 rounded overflow-hidden border-2 transition-all ${
                      activeImageIdx === idx ? 'border-elan-gold scale-105' : 'border-white/30 opacity-60'
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
        </div>
      )}

      {/* ==================================================== */}
      {/* Category-Specific Size Guide Modal */}
      {/* ==================================================== */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-elan-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            className="bg-white rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-luxury text-elan-900 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-elan-400 hover:text-elan-950 p-1"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-2xl font-bold text-elan-950 mb-1">
              STYLENEST Sizing & Fit Atelier
            </h3>
            <p className="text-xs text-elan-500 mb-5">
              {product.category === 'shoes'
                ? 'Standard European and UK shoe sizing metrics with millimeter foot length guide.'
                : product.category === 'perfumes'
                ? 'Haute Parfumerie volume specifications, spray count estimates, and sillage guide.'
                : 'Tailored measurements recorded in inches with standard luxury ease.'}
            </p>

            {product.category === 'shoes' ? (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-elan-300 text-elan-400 uppercase tracking-wider font-semibold">
                    <th className="py-2">UK Size</th>
                    <th className="py-2">EU Size</th>
                    <th className="py-2">US Size</th>
                    <th className="py-2">Foot Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-elan-100 text-elan-700">
                  <tr><td className="py-2 font-bold text-elan-950">UK 6</td><td>40</td><td>7.0</td><td>25.4 cm</td></tr>
                  <tr><td className="py-2 font-bold text-elan-950">UK 7</td><td>41</td><td>8.0</td><td>26.2 cm</td></tr>
                  <tr><td className="py-2 font-bold text-elan-950">UK 8</td><td>42</td><td>9.0</td><td>27.0 cm</td></tr>
                  <tr><td className="py-2 font-bold text-elan-950">UK 9</td><td>43</td><td>10.0</td><td>27.8 cm</td></tr>
                  <tr><td className="py-2 font-bold text-elan-950">UK 10</td><td>44</td><td>11.0</td><td>28.6 cm</td></tr>
                </tbody>
              </table>
            ) : product.category === 'perfumes' ? (
              <div className="space-y-3 text-xs text-elan-700">
                <div className="p-3 bg-elan-50 rounded border border-elan-200">
                  <span className="font-bold text-elan-950 block mb-0.5">30ml Travel Flacon</span>
                  <span>Approximately 300 atomized sprays. Compact, airline approved, ideal for on-the-go evenings.</span>
                </div>
                <div className="p-3 bg-elan-50 rounded border border-elan-200">
                  <span className="font-bold text-elan-950 block mb-0.5">50ml Signature Flacon</span>
                  <span>Approximately 500 sprays. The classic atelier standard for seasonal signature rotations.</span>
                </div>
                <div className="p-3 bg-elan-50 rounded border border-elan-200">
                  <span className="font-bold text-elan-950 block mb-0.5">100ml Grand Extrait Flacon</span>
                  <span>Approximately 1,000 sprays. High-concentration investment flacon with heavy magnetic brass stopper.</span>
                </div>
              </div>
            ) : (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-elan-300 text-elan-400 uppercase tracking-wider font-semibold">
                    <th className="py-2">Size</th>
                    <th className="py-2">Chest / Bust</th>
                    <th className="py-2">Waist</th>
                    <th className="py-2">Hip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-elan-100 text-elan-700">
                  <tr><td className="py-2 font-bold text-elan-950">XS</td><td>34"</td><td>28"</td><td>36"</td></tr>
                  <tr><td className="py-2 font-bold text-elan-950">S</td><td>36"</td><td>30"</td><td>38"</td></tr>
                  <tr><td className="py-2 font-bold text-elan-950">M</td><td>38" - 40"</td><td>32" - 34"</td><td>40" - 42"</td></tr>
                  <tr><td className="py-2 font-bold text-elan-950">L</td><td>42"</td><td>36"</td><td>44"</td></tr>
                  <tr><td className="py-2 font-bold text-elan-950">XL</td><td>44" - 46"</td><td>38" - 40"</td><td>46" - 48"</td></tr>
                </tbody>
              </table>
            )}

            <div className="mt-6 pt-4 border-t border-elan-100 flex justify-between items-center text-xs">
              <span className="text-elan-500">Need personal styling assistance?</span>
              <button
                onClick={() => {
                  setIsSizeGuideOpen(false);
                  toast.luxury('Concierge Contact', 'Complimentary stylist reached at concierge@stylenest.com');
                }}
                className="text-elan-950 font-semibold underline decoration-elan-gold"
              >
                Consult Private Stylist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* Write Client Review Modal */}
      {/* ==================================================== */}
      {isWriteReviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-elan-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsWriteReviewOpen(false)}
        >
          <div
            className="bg-white rounded-sm max-w-md w-full p-6 sm:p-8 shadow-luxury text-elan-900 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute top-4 right-4 text-elan-400 hover:text-elan-950 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-2xl font-bold text-elan-950 mb-1">
              Share Your Client Review
            </h3>
            <p className="text-xs text-elan-500 mb-5">
              Reviewing: <strong>{product.name}</strong>
            </p>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-elan-500 font-semibold mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Siddharth Kapur"
                  className="w-full bg-elan-50 border border-elan-300 px-3 py-2 rounded-sm focus:border-elan-900 outline-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-elan-500 font-semibold mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newReviewRating ? 'text-amber-500 fill-current' : 'text-elan-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-elan-500 font-semibold mb-1">
                  Your Experience
                </label>
                <textarea
                  rows={4}
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Detail the garment hand-feel, fit, sillage, or presentation..."
                  className="w-full bg-elan-50 border border-elan-300 p-3 rounded-sm focus:border-elan-900 outline-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3">
                Submit Client Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* Mobile Sticky Add to Cart Bar */}
      {/* ==================================================== */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-elan-200 px-4 py-3 sm:hidden shadow-drawer animate-slide-up">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-12 bg-elan-100 rounded overflow-hidden shrink-0">
                <LuxuryImage
                  src={product.images[0]}
                  alt={product.name}
                  fallbackSrc={FALLBACK_IMAGES[product.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-elan-950 truncate">{product.name}</h4>
                <p className="text-xs font-bold text-elan-900">₹{currentPrice.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn-primary py-2.5 px-4 text-xs shrink-0"
            >
              {product.inStock ? '+ Add to Bag' : 'Sold Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
