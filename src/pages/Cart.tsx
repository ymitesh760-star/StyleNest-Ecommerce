import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Tag, ShieldCheck, Gift } from 'lucide-react';
import { useCart, FREE_SHIPPING_THRESHOLD } from '../context/CartContext';
import { LuxuryImage } from '../components/common/LuxuryImage';

export const Cart: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    freeShippingProgress,
    amountNeededForFreeShipping,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [includeGiftWrap, setIncludeGiftWrap] = useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = 'Shopping Bag | STYLENEST × DRIPPY';
    window.scrollTo(0, 0);
  }, []);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-28 text-center bg-[#F8F0E2]">
        <div className="w-24 h-24 mx-auto rounded-none bg-[#4A0E1C] border border-[#D8BD83]/40 flex items-center justify-center text-[#D8BD83] mb-6 shadow-xl">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#4A0E1C] font-bold block mb-2">
          Your Selection Is Empty
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#32141B] mb-4">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#89786C] max-w-md mx-auto mb-10 leading-relaxed font-normal">
          Explore our seasonal portfolios of handcrafted tailoring, Portuguese footwear, and Grasse-distilled extraits de parfum.
        </p>
        <Link to="/men" className="px-10 py-4 bg-[#4A0E1C] hover:bg-[#2A0710] text-[#F8F0E2] text-xs font-bold uppercase tracking-[0.2em] inline-block border border-[#D8BD83]/40 shadow-md">
          Discover The Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-16 bg-[#F8F0E2]">
      {/* Page Title & Breadcrumb Header */}
      <div className="border-b border-[#D8BD83]/30 pb-6 mb-8">
        <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#4A0E1C] font-bold block mb-1">
          Wardrobe Portfolio
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#32141B]">
          Shopping Bag ({itemCount} {itemCount === 1 ? 'Creation' : 'Creations'})
        </h1>

        {/* Free Shipping Progress */}
        <div className="mt-5 max-w-xl bg-[#FDFBF7] border border-[#D8BD83]/40 p-4 rounded-none shadow-xs">
          <div className="flex justify-between text-xs font-medium mb-2.5">
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                You have unlocked Complimentary Express White-Glove Delivery
              </span>
            ) : (
              <span className="text-[#32141B]">
                Add <strong className="text-[#4A0E1C] font-bold font-mono">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> to unlock Complimentary Shipping
              </span>
            )}
            <span className="text-[#4A0E1C] font-bold font-mono tracking-wider">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#F2E6D2] overflow-hidden border border-[#D8BD83]/30">
            <div
              className="h-full bg-[#4A0E1C] transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items Table (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="hidden sm:grid grid-cols-12 pb-3 border-b border-[#D8BD83]/30 text-[11px] uppercase font-mono tracking-wider text-[#89786C] font-semibold">
            <span className="col-span-6">Creation</span>
            <span className="col-span-2 text-center">Unit Price</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Subtotal</span>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-6 border-b border-[#D8BD83]/20 hover:bg-[#F2E6D2]/30 transition-colors px-2 rounded-none"
            >
              {/* Product Info */}
              <div className="sm:col-span-6 flex gap-4">
                <Link
                  to={`/product/${item.productId}`}
                  className="w-20 h-28 bg-[#2A0710] overflow-hidden shrink-0 group border border-[#D8BD83]/30"
                >
                  <LuxuryImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="flex flex-col justify-between py-0.5">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#4A0E1C] font-bold">
                      {item.brand}
                    </span>
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-serif font-bold text-sm text-[#32141B] hover:text-[#4A0E1C] transition-colors block mt-0.5"
                    >
                      {item.name}
                    </Link>
                    <div className="flex flex-wrap gap-2 text-xs text-[#89786C] mt-1.5 font-normal">
                      {item.selectedSize && <span>Size: <strong className="font-medium text-[#32141B] font-mono">{item.selectedSize}</strong></span>}
                      {item.selectedColor && <span>&bull; Color: <strong className="font-medium text-[#32141B]">{item.selectedColor}</strong></span>}
                      {item.selectedVolume && <span>&bull; Volume: <strong className="font-medium text-[#32141B] font-mono">{item.selectedVolume}</strong></span>}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1.5 mt-2 sm:mt-0 font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Unit Price */}
              <div className="sm:col-span-2 text-left sm:text-center text-xs font-semibold text-[#32141B] font-mono">
                <span className="sm:hidden text-[#89786C] font-normal mr-2">Price:</span>
                ₹{item.price.toLocaleString('en-IN')}
              </div>

              {/* Quantity */}
              <div className="sm:col-span-2 flex items-center justify-start sm:justify-center">
                <div className="flex items-center border border-[#D8BD83]/40 bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-[#32141B] hover:bg-[#F2E6D2] hover:text-[#4A0E1C] transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#32141B] font-mono">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-[#32141B] hover:bg-[#F2E6D2] hover:text-[#4A0E1C] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="sm:col-span-2 text-left sm:text-right font-serif text-base font-bold text-[#4A0E1C] font-mono">
                <span className="sm:hidden text-xs text-[#89786C] font-normal mr-2">Total:</span>
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))}

          {/* Complimentary Gift Box option */}
          <div className="p-5 bg-gradient-to-r from-[#2A0710] to-[#1E050B] border border-[#D8BD83]/40 text-[#F8F0E2] flex items-start gap-3.5 shadow-md">
            <Gift className="w-5 h-5 text-[#D8BD83] shrink-0 mt-0.5" />
            <div className="flex-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold uppercase tracking-wider text-[#F8F0E2]">
                <input
                  type="checkbox"
                  checked={includeGiftWrap}
                  onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                  className="w-4 h-4 rounded text-[#4A0E1C] border-[#D8BD83]/40 focus:ring-[#4A0E1C] bg-[#1E050B]"
                />
                <span>Include Signature STYLENEST Gift Packaging (Complimentary)</span>
              </label>
              <p className="text-[11px] text-[#D8BD83]/80 mt-1 font-normal leading-relaxed">
                Hand-wrapped in matte royal burgundy presentation box, ivory tissue, and embossed grosgrain ribbon with wax-sealed card.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Card (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-none border border-[#D8BD83]/40 shadow-xl space-y-6 sticky top-28">
            <div className="pb-4 border-b border-[#D8BD83]/30">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#4A0E1C] font-bold block mb-1">
                Order Total
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#32141B]">
                Order Summary
              </h2>
            </div>

            {/* Promo Code Input */}
            <div>
              <p className="text-xs uppercase font-mono tracking-wider font-semibold text-[#32141B] mb-2">
                Privilege Code
              </p>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#F2E6D2] border border-[#D8BD83] px-3.5 py-2.5 text-xs">
                  <div className="flex items-center gap-2 text-[#32141B]">
                    <Tag className="w-4 h-4 text-[#4A0E1C]" />
                    <span>Coupon <strong className="font-bold font-mono">{appliedCoupon.code}</strong> applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:text-rose-800 uppercase font-bold font-mono"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. DRIPPY20, LUXE20"
                      className="flex-1 px-3 py-2 text-xs border border-[#D8BD83]/50 focus:border-[#4A0E1C] outline-none uppercase font-mono tracking-wider bg-white text-[#32141B]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#4A0E1C] text-[#F8F0E2] text-xs font-bold uppercase tracking-wider hover:bg-[#2A0710] transition-colors border border-[#D8BD83]/40"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs text-[#89786C] pt-4 border-t border-[#D8BD83]/25">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-semibold text-[#32141B] font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-mono">
                  <span>Privilege Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700 font-semibold font-mono">Complimentary Express</strong>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#32141B] pt-4 border-t border-[#D8BD83]/30">
                <span>Total Amount</span>
                <span className="text-[#4A0E1C] font-mono font-bold">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-[#89786C]">All prices include applicable GST, luxury cess, and insurance.</p>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#4A0E1C] hover:bg-[#2A0710] text-[#F8F0E2] text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-[#D8BD83]/40 shadow-md transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#D8BD83]" />
            </button>

            <Link
              to="/men"
              className="block text-center text-xs font-semibold uppercase font-mono tracking-wider text-[#89786C] hover:text-[#4A0E1C] pt-1 transition-colors"
            >
              Continue Curating Wardrobe &rarr;
            </Link>

            <div className="pt-4 border-t border-[#D8BD83]/20 flex items-center justify-center gap-2 text-[10px] text-[#89786C] uppercase font-mono tracking-widest">
              <ShieldCheck className="w-4 h-4 text-[#D8BD83]" />
              <span>Certified 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
