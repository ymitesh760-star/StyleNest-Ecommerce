import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart, FREE_SHIPPING_THRESHOLD } from '../../context/CartContext';
import { LuxuryImage } from '../common/LuxuryImage';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
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
  const navigate = useNavigate();

  if (!isCartOpen) return null;

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

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewBag = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-[#0A0A0A]/70 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-drawer flex flex-col justify-between border-l border-[rgba(185,154,107,0.22)]">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[rgba(185,154,107,0.22)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-[#B99A6B]" />
                <h2 className="text-xs font-bold tracking-widest-luxury uppercase text-[#0A0A0A]">
                  Shopping Bag ({itemCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-[#777777] hover:text-[#0A0A0A] transition-colors rounded"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="mt-4 pt-3 border-t border-[rgba(185,154,107,0.18)]">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3 h-3 text-[#B99A6B]" />
                    <span>Unlocked Complimentary Express Delivery!</span>
                  </span>
                ) : (
                  <span className="text-[#171717] text-[11px]">
                    Add <strong className="text-[#0A0A0A]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> for Complimentary Delivery
                  </span>
                )}
                <span className="text-[10px] text-[#B99A6B] font-semibold">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#F8F6F2] rounded-full overflow-hidden border border-black/5">
                <div
                  className="h-full bg-[#B99A6B] transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F8F6F2] border border-[rgba(185,154,107,0.3)] flex items-center justify-center text-[#B99A6B] mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif-luxury text-2xl text-[#0A0A0A] mb-1 font-bold">Your bag is empty</h3>
                <p className="text-xs text-[#777777] max-w-xs mb-6 font-light">
                  Explore our curated collections of clothing, footwear, and artisanal fragrances.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/men');
                  }}
                  className="btn-primary"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-[rgba(185,154,107,0.18)] group">
                  <div
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate(`/product/${item.productId}`);
                    }}
                    className="w-20 h-24 bg-[#F8F6F2] rounded-xs overflow-hidden shrink-0 cursor-pointer border border-black/5"
                  >
                    <LuxuryImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider-luxury font-semibold text-[#B99A6B]">
                            {item.brand}
                          </p>
                          <h4
                            onClick={() => {
                              setIsCartOpen(false);
                              navigate(`/product/${item.productId}`);
                            }}
                            className="font-serif-luxury text-sm font-semibold text-[#0A0A0A] hover:text-[#B99A6B] transition-colors line-clamp-1 cursor-pointer"
                          >
                            {item.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#777777] hover:text-rose-600 transition-colors p-1"
                          aria-label={`Remove ${item.name} from bag`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Badges */}
                      <div className="flex flex-wrap gap-1.5 text-[10px] text-[#777777] mt-1.5">
                        {item.selectedSize && (
                          <span className="bg-[#F8F6F2] px-1.5 py-0.5 rounded-xs border border-black/5">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="bg-[#F8F6F2] px-1.5 py-0.5 rounded-xs border border-black/5">
                            {item.selectedColor}
                          </span>
                        )}
                        {item.selectedVolume && (
                          <span className="bg-[#F8F6F2] px-1.5 py-0.5 rounded-xs border border-black/5">
                            Vol: {item.selectedVolume}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[rgba(185,154,107,0.3)] rounded-xs bg-[#F8F6F2]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-black/5 text-[#0A0A0A] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#0A0A0A]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-black/5 text-[#0A0A0A] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#0A0A0A]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-[#F8F6F2]/80 border-t border-[rgba(185,154,107,0.22)] space-y-4">
              {/* Promo Code Input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#B99A6B]/15 border border-[rgba(185,154,107,0.3)] px-3 py-2 rounded-xs text-xs">
                  <div className="flex items-center gap-1.5 text-[#0A0A0A]">
                    <Tag className="w-3.5 h-3.5 text-[#B99A6B]" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline uppercase tracking-wider font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo Code (e.g. LUXE20, STN10)"
                      className="flex-1 px-3 py-2 text-xs border border-[rgba(185,154,107,0.3)] bg-white rounded-xs focus:border-[#0A0A0A] outline-none uppercase tracking-wider"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0A0A0A] text-white text-xs font-medium uppercase tracking-wider-luxury hover:bg-[#171717] transition-colors rounded-xs"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#777777] pt-2 border-t border-[rgba(185,154,107,0.18)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#0A0A0A]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Promotion Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-semibold">Complimentary</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#0A0A0A] pt-2 border-t border-[rgba(185,154,107,0.18)] font-serif-luxury text-base">
                  <span>Estimated Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleViewBag}
                  className="btn-secondary py-3 text-center"
                >
                  View Bag
                </button>
                <button
                  onClick={handleProceedToCheckout}
                  className="btn-primary py-3 flex items-center justify-center gap-1.5"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5 text-[#B99A6B]" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#777777] uppercase tracking-widest-luxury">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B99A6B]" />
                <span>Encrypted 256-Bit Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
