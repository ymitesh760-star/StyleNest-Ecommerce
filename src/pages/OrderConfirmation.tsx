import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Printer, ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { getOrderByIdOrNumber } from '../services/orderService';

export const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const { orders } = useAuth();

  const [loadedOrder, setLoadedOrder] = useState<Order | undefined>(() => {
    return (
      location.state?.order ||
      orders.find((o) => o.orderNumber === orderId || o.id === orderId) ||
      orders[0]
    );
  });

  useEffect(() => {
    if (!loadedOrder && orderId) {
      getOrderByIdOrNumber(orderId).then((res) => {
        if (res) setLoadedOrder(res);
      }).catch(console.warn);
    }
  }, [orderId, loadedOrder]);

  const order = loadedOrder;

  useEffect(() => {
    document.title = 'Order Confirmed | STYLENEST';
    window.scrollTo(0, 0);

    // Trigger celebratory champagne & burgundy confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D8BD83', '#4A0E1C', '#F8F0E2', '#651C2D'],
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-[60vh] bg-[#F8F0E2] flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#32141B] mb-3">Order Not Found</h2>
          <p className="text-xs text-[#89786C] mb-6">We could not locate this order record.</p>
          <Link to="/" className="btn-primary">Return to Boutique</Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#F8F0E2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 lg:py-20 pb-28">

        {/* Success Badge & Headline */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto animate-slide-up">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-[0.22em] text-[#D8BD83] font-bold block">
            Acquisition Confirmed
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#32141B]">
            Thank You, {order.shippingAddress.fullName.split(' ')[0]}
          </h1>

          <p className="text-xs sm:text-sm text-[#89786C] max-w-lg mx-auto leading-relaxed">
            Your order has been officially logged with our central fulfillment atelier.
            A detailed receipt and telemetry confirmation have been sent to <strong className="text-[#32141B]">{order.shippingAddress.email}</strong>.
          </p>

          {/* Order ID Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F2E6D2] border border-[#D8BD83]/40 rounded-sm text-xs font-mono font-bold text-[#32141B]">
            <span>Order Reference:</span>
            <span className="text-[#D8BD83] font-bold">{order.orderNumber}</span>
          </div>
        </div>

        {/* Main Order Card */}
        <div className="bg-[#FDFBF7] rounded-sm border border-[#D8BD83]/30 shadow-luxury overflow-hidden">

          {/* Header bar */}
          <div className="p-6 bg-[#F2E6D2]/70 border-b border-[#D8BD83]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[#D8BD83]" />
              <div>
                <p className="text-xs font-bold text-[#32141B] uppercase tracking-wider">
                  Status: {order.orderStatus}
                </p>
                <p className="text-[11px] text-[#89786C]">Tracking: {order.trackingNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-[#F8F0E2] border border-[#D8BD83]/40 text-xs text-[#32141B] rounded-sm hover:border-[#4A0E1C] flex items-center gap-1.5 transition-colors font-medium"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>

          {/* Delivery & Shipping Info */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-[#D8BD83]/20 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#B0A296] font-bold block mb-1">
                Estimated Delivery
              </span>
              <p className="text-sm font-bold text-[#32141B] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#D8BD83]" />
                <span>{order.estimatedDelivery}</span>
              </p>
              <p className="text-[#89786C] mt-1">Dispatched via BlueDart Apex Air Express</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#B0A296] font-bold block mb-1">
                Delivery Address
              </span>
              <p className="font-bold text-[#32141B]">{order.shippingAddress.fullName}</p>
              <p className="text-[#89786C]">{order.shippingAddress.addressLine1}</p>
              <p className="text-[#89786C]">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="p-6 sm:p-8 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#32141B] mb-4">
              Items in This Consignment ({order.items.length})
            </h3>

            <div className="divide-y divide-[#D8BD83]/20">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <LuxuryImage
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-sm bg-[#F2E6D2]"
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-[#B0A296] font-bold">
                        {item.brand}
                      </span>
                      <h4 className="text-sm font-semibold text-[#32141B]">{item.name}</h4>
                      <p className="text-xs text-[#89786C] mt-0.5">
                        Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''} {item.selectedVolume ? `• Vol: ${item.selectedVolume}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-base font-bold text-[#32141B]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="pt-6 border-t border-[#D8BD83]/30 max-w-sm ml-auto space-y-2 text-xs">
              <div className="flex justify-between text-[#89786C]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#32141B]">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount Applied ({order.couponCode})</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#89786C]">
                <span>Shipping Fee</span>
                <span>{order.shippingFee === 0 ? 'Complimentary' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between items-center text-base font-bold text-[#32141B] pt-2 border-t border-[#D8BD83]/30">
                <span className="flex items-center gap-2">
                  <span>Total ({order.paymentMethod})</span>
                  <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 bg-[#F2E6D2] text-[#4A0E1C] rounded-xs">
                    {order.paymentStatus}
                  </span>
                </span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Guarantee */}
          <div className="p-6 bg-[#F2E6D2]/70 border-t border-[#D8BD83]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#89786C]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Guaranteed Authentic &amp; Backed by 14-Day Complimentary Returns</span>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/account" className="btn-secondary py-2.5 px-4 text-xs">
                View Order in Account
              </Link>
              <Link to="/men" className="btn-primary py-2.5 px-4 text-xs">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
