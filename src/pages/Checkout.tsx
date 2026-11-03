import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, Check, ArrowRight, ArrowLeft, Truck,
  CreditCard, Smartphone, Banknote, Building, AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Address, Order } from '../types';
import { createOrder } from '../services/orderService';

export const Checkout: React.FC = () => {
  const { items, subtotal, discount, shippingFee, total, appliedCoupon, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = 'Checkout | STYLENEST';
    window.scrollTo(0, 0);
  }, []);

  // Steps: 1: Contact & Address, 2: Delivery & Payment, 3: Review & Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [contactInfo, setContactInfo] = useState({
    email: user?.email || 'client@stylenest.com',
    phone: user?.phone || '9820045812',
  });

  const [shippingAddress, setShippingAddress] = useState<Address>(() => {
    if (user?.addresses && user.addresses.length > 0) {
      return user.addresses.find((a) => a.isDefault) || user.addresses[0];
    }
    return {
      id: 'addr-new',
      fullName: user?.name || 'Arya Singhania',
      phone: '+91 98200 45812',
      email: user?.email || 'client@stylenest.com',
      addressLine1: 'The Grand Residences, 42nd Floor',
      addressLine2: 'Worli Sea Face',
      landmark: 'Near Coastal Promenade',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
      isDefault: true,
    };
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('COD');
  const [upiId, setUpiId] = useState('arya@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Delivery surcharge if express
  const expressSurcharge = deliveryMethod === 'express' ? 200 : 0;
  const finalPayable = total + expressSurcharge;

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!contactInfo.email || !contactInfo.email.includes('@')) {
      errors.email = 'Valid email is required for order confirmation.';
    }
    if (!contactInfo.phone || contactInfo.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Valid 10-digit mobile number is required.';
    }
    if (!shippingAddress.fullName.trim()) {
      errors.fullName = 'Full recipient name is required.';
    }
    if (!shippingAddress.addressLine1.trim()) {
      errors.addressLine1 = 'Street address / residence details are required.';
    }
    if (!shippingAddress.city.trim()) {
      errors.city = 'City is required.';
    }
    if (!shippingAddress.state.trim()) {
      errors.state = 'State is required.';
    }
    const cleanPin = shippingAddress.pincode.trim();
    if (!cleanPin || cleanPin.length !== 6 || isNaN(Number(cleanPin))) {
      errors.pincode = 'Valid 6-digit Indian PIN code is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        window.scrollTo(0, 0);
      }
    } else if (step === 2) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Bag is Empty', 'Please add creations to your bag before checking out.');
      return;
    }

    // Verify stock availability
    const outOfStockItem = items.find((it) => it.stockCount <= 0);
    if (outOfStockItem) {
      toast.error('Item Out of Stock', `"${outOfStockItem.name}" is sold out. Please remove it from your bag.`);
      return;
    }

    setIsProcessing(true);

    try {
      const orderNumber = `STN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const trackingNumber = `BLUEDART-IND-${Math.floor(1000000 + Math.random() * 9000000)}`;

      const newOrderPayload: Omit<Order, 'id'> = {
        orderNumber,
        createdAt: new Date().toISOString(),
        items: [...items],
        subtotal,
        discount,
        shippingFee: shippingFee + expressSurcharge,
        total: finalPayable,
        couponCode: appliedCoupon?.code,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
        orderStatus: 'Placed',
        shippingAddress,
        estimatedDelivery: deliveryMethod === 'express' ? 'Tomorrow, within 24 Hours' : 'In 2-3 Business Days',
        trackingNumber,
        courierPartner: 'BlueDart Apex Air Express',
      };

      const finalOrder = await createOrder(newOrderPayload, user?.id);

      // Add to orders in context
      addOrder(finalOrder);

      // Clear cart
      clearCart();
      setIsProcessing(false);

      toast.luxury('Order Placed Successfully', `Thank you for choosing STYLENEST × DRIPPY. Order #${finalOrder.orderNumber} confirmed.`);
      navigate(`/order-confirmation/${finalOrder.orderNumber}`, { state: { order: finalOrder } });
    } catch (err) {
      console.error('Failed to create order:', err);
      setIsProcessing(false);
      toast.error('Order Failed', 'Could not complete order creation. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif-luxury text-3xl font-bold text-elan-950 mb-3">Your Bag is Empty</h2>
        <p className="text-xs text-elan-500 mb-6">You have no items pending checkout.</p>
        <Link to="/" className="btn-primary">Return to Boutique</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-16">
      {/* Checkout Progress Stepper */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider-luxury">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-elan-950 font-bold' : 'text-elan-300'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step > 1 ? 'bg-emerald-600 text-white' : step === 1 ? 'bg-elan-950 text-white' : 'bg-elan-200 text-elan-600'
            }`}>
              {step > 1 ? '✓' : '1'}
            </span>
            <span>Delivery & Address</span>
          </div>

          <div className="h-0.5 w-12 sm:w-20 bg-elan-200" />

          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-elan-950 font-bold' : 'text-elan-300'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step > 2 ? 'bg-emerald-600 text-white' : step === 2 ? 'bg-elan-950 text-white' : 'bg-elan-200 text-elan-600'
            }`}>
              {step > 2 ? '✓' : '2'}
            </span>
            <span>Method & Payment</span>
          </div>

          <div className="h-0.5 w-12 sm:w-20 bg-elan-200" />

          <div className={`flex items-center gap-2 ${step === 3 ? 'text-elan-950 font-bold' : 'text-elan-300'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step === 3 ? 'bg-elan-950 text-white' : 'bg-elan-200 text-elan-600'
            }`}>
              3
            </span>
            <span>Review & Authorize</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Multi-Step Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* STEP 1: Address & Contact */}
          {step === 1 && (
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-elan-200 shadow-sm space-y-6 animate-fade-in">
              <div>
                <h2 className="font-serif-luxury text-2xl font-bold text-elan-950">
                  Recipient & Shipping Destination
                </h2>
                <p className="text-xs text-elan-500 mt-1">
                  All parcels are dispatched from our domestic luxury vaults via insured express courier.
                </p>
              </div>

              {/* Saved Addresses quick selection */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] uppercase tracking-wider-luxury text-elan-400 font-bold">
                    Saved Addresses:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setShippingAddress(addr)}
                        className={`p-3 rounded-sm border cursor-pointer transition-all ${
                          shippingAddress.id === addr.id
                            ? 'border-elan-950 bg-elan-50/50 shadow-xs'
                            : 'border-elan-200 hover:border-elan-400'
                        }`}
                      >
                        <p className="text-xs font-bold text-elan-900">{addr.fullName}</p>
                        <p className="text-[11px] text-elan-600 truncate">{addr.addressLine1}</p>
                        <p className="text-[11px] text-elan-500">{addr.city}, {addr.pincode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Address Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider-luxury text-elan-900 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full bg-elan-50/50 border border-elan-300 px-3 py-2 text-xs rounded-sm focus:border-elan-900 outline-none"
                    placeholder="e.g. Arya Singhania"
                  />
                  {formErrors.fullName && <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider-luxury text-elan-900 mb-1">
                    Mobile Phone (+91) *
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full bg-elan-50/50 border border-elan-300 px-3 py-2 text-xs rounded-sm focus:border-elan-900 outline-none"
                    placeholder="10-digit number"
                  />
                  {formErrors.phone && <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider-luxury text-elan-900 mb-1">
                    Email Address for Telemetry *
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full bg-elan-50/50 border border-elan-300 px-3 py-2 text-xs rounded-sm focus:border-elan-900 outline-none"
                    placeholder="name@domain.com"
                  />
                  {formErrors.email && <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider-luxury text-elan-900 mb-1">
                    Street Address / Residence Name *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                    className="w-full bg-elan-50/50 border border-elan-300 px-3 py-2 text-xs rounded-sm focus:border-elan-900 outline-none"
                    placeholder="Flat / Suite / Tower / Road"
                  />
                  {formErrors.addressLine1 && <p className="text-[11px] text-rose-600 mt-1">{formErrors.addressLine1}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider-luxury text-elan-900 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.landmark || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                    className="w-full bg-elan-50/50 border border-elan-300 px-3 py-2 text-xs rounded-sm focus:border-elan-900 outline-none"
                    placeholder="Prominent landmark nearby"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider-luxury text-elan-900 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    className="w-full bg-elan-50/50 border border-elan-300 px-3 py-2 text-xs rounded-sm focus:border-elan-900 outline-none"
                    placeholder="6-digit Indian PIN Code"
                  />
                  {formErrors.pincode && <p className="text-[11px] text-rose-600 mt-1">{formErrors.pincode}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider-luxury text-elan-900 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-elan-50/50 border border-elan-300 px-3 py-2 text-xs rounded-sm focus:border-elan-900 outline-none"
                    placeholder="e.g. Mumbai"
                  />
                  {formErrors.city && <p className="text-[11px] text-rose-600 mt-1">{formErrors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider-luxury text-elan-900 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full bg-elan-50/50 border border-elan-300 px-3 py-2 text-xs rounded-sm focus:border-elan-900 outline-none"
                    placeholder="e.g. Maharashtra"
                  />
                  {formErrors.state && <p className="text-[11px] text-rose-600 mt-1">{formErrors.state}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-elan-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary py-3.5 px-8 flex items-center gap-2"
                >
                  <span>Continue to Delivery & Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery & Payment Method */}
          {step === 2 && (
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-elan-200 shadow-sm space-y-8 animate-fade-in">
              {/* Delivery Speed */}
              <div>
                <h2 className="font-serif-luxury text-2xl font-bold text-elan-950 mb-1">
                  Select Delivery Protocol
                </h2>
                <p className="text-xs text-elan-500 mb-4">
                  Delivered in temperature-controlled vehicles with discreet packaging.
                </p>

                <div className="space-y-3">
                  <label
                    onClick={() => setDeliveryMethod('standard')}
                    className={`flex items-center justify-between p-4 rounded-sm border cursor-pointer transition-all ${
                      deliveryMethod === 'standard' ? 'border-elan-950 bg-elan-50/60' : 'border-elan-200 hover:border-elan-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={deliveryMethod === 'standard'}
                        onChange={() => setDeliveryMethod('standard')}
                        className="text-elan-900"
                      />
                      <div>
                        <p className="text-xs font-bold text-elan-950 uppercase tracking-wider">
                          Standard Complimentary Delivery
                        </p>
                        <p className="text-[11px] text-elan-500">Delivered within 2 to 3 business days</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">
                      {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}
                    </span>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('express')}
                    className={`flex items-center justify-between p-4 rounded-sm border cursor-pointer transition-all ${
                      deliveryMethod === 'express' ? 'border-elan-950 bg-elan-50/60' : 'border-elan-200 hover:border-elan-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                        className="text-elan-900"
                      />
                      <div>
                        <p className="text-xs font-bold text-elan-950 uppercase tracking-wider">
                          VIP Priority Air Express
                        </p>
                        <p className="text-[11px] text-elan-500">Guaranteed next-day delivery before 2 PM</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-elan-950">+₹200</span>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-6 border-t border-elan-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-serif-luxury text-2xl font-bold text-elan-950">
                    Payment Protocol
                  </h2>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                    COD Active & Online Ready
                  </span>
                </div>
                <p className="text-xs text-elan-500 mb-4">
                  Pay on Arrival (Cash on Delivery) is ready for immediate courier dispatch across all domestic PIN codes.
                </p>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-sm border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'UPI' ? 'border-elan-950 bg-elan-950 text-white' : 'border-elan-200 bg-white text-elan-800'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Instant UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-sm border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'Card' ? 'border-elan-950 bg-elan-950 text-white' : 'border-elan-200 bg-white text-elan-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cards (Demo)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NetBanking')}
                    className={`p-3 rounded-sm border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'NetBanking' ? 'border-elan-950 bg-elan-950 text-white' : 'border-elan-200 bg-white text-elan-800'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-sm border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'COD' ? 'border-elan-950 bg-elan-950 text-white' : 'border-elan-200 bg-white text-elan-800'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Pay on Arrival</span>
                  </button>
                </div>

                {/* Sub-panels for payment */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 bg-elan-50 rounded-sm border border-elan-200 space-y-3">
                    <p className="text-xs text-elan-700">Enter your UPI ID (VPA) or scan demo QR code:</p>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full bg-white border border-elan-300 p-2 text-xs rounded-sm focus:border-elan-900 outline-none"
                    />
                    <div className="flex items-center gap-2 text-[11px] text-elan-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Supported across GPay, PhonePe, Paytm, and BHIM</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="p-4 bg-elan-50 rounded-sm border border-elan-200 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2">
                        <label className="block text-[11px] text-elan-500 uppercase tracking-wider mb-1 font-semibold">Demo Card Number</label>
                        <input
                          type="text"
                          readOnly
                          value="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                          className="w-full bg-white border border-elan-300 p-2 text-xs rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-elan-500 uppercase tracking-wider mb-1 font-semibold">Expiry</label>
                        <input
                          type="text"
                          readOnly
                          value="12/28"
                          className="w-full bg-white border border-elan-300 p-2 text-xs rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-elan-500 uppercase tracking-wider mb-1 font-semibold">CVV</label>
                        <input
                          type="text"
                          readOnly
                          value="***"
                          className="w-full bg-white border border-elan-300 p-2 text-xs rounded font-mono"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-elan-500 italic">
                      * Pre-populated with PCI-DSS compliant sandbox credentials.
                    </p>
                  </div>
                )}

                {paymentMethod === 'NetBanking' && (
                  <div className="p-4 bg-elan-50 rounded-sm border border-elan-200 space-y-3">
                    <label className="block text-xs font-semibold text-elan-900">Choose Bank:</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-white border border-elan-300 p-2 text-xs rounded-sm outline-none"
                    >
                      <option value="HDFC Bank">HDFC Bank Privé</option>
                      <option value="ICICI Bank">ICICI Bank Wealth</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank Burgundy</option>
                      <option value="Kotak Mahindra">Kotak Privy League</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="p-4 bg-elan-50 rounded-sm border border-elan-200 space-y-2 text-xs text-elan-700">
                    <p className="font-semibold text-elan-900">Cash / UPI on Doorstep Handover:</p>
                    <p>Our concierge delivery executive will present your sealed parcel. You may settle via cash, UPI, or card on the handheld POS.</p>
                  </div>
                )}
              </div>

              {/* Back / Continue Buttons */}
              <div className="pt-4 border-t border-elan-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider-luxury text-elan-600 hover:text-elan-950"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary py-3.5 px-8 flex items-center gap-2"
                >
                  <span>Review Final Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Authorize */}
          {step === 3 && (
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-elan-200 shadow-sm space-y-6 animate-fade-in">
              <div>
                <h2 className="font-serif-luxury text-2xl font-bold text-elan-950">
                  Review & Authorize Acquisition
                </h2>
                <p className="text-xs text-elan-500 mt-1">
                  Please verify your shipping telemetry and items before placing the order.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-elan-50 rounded border border-elan-200 space-y-1">
                  <div className="flex justify-between font-semibold uppercase tracking-wider text-elan-900">
                    <span>Shipping Address</span>
                    <button onClick={() => setStep(1)} className="text-elan-gold hover:underline">Edit</button>
                  </div>
                  <p className="font-bold text-elan-900 pt-1">{shippingAddress.fullName}</p>
                  <p className="text-elan-600">{shippingAddress.addressLine1}</p>
                  <p className="text-elan-600">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                  <p className="text-elan-500">Contact: {contactInfo.phone}</p>
                </div>

                <div className="p-4 bg-elan-50 rounded border border-elan-200 space-y-1">
                  <div className="flex justify-between font-semibold uppercase tracking-wider text-elan-900">
                    <span>Payment & Speed</span>
                    <button onClick={() => setStep(2)} className="text-elan-gold hover:underline">Edit</button>
                  </div>
                  <p className="font-bold text-elan-900 pt-1">
                    {paymentMethod === 'UPI' ? `UPI (${upiId})` : paymentMethod}
                  </p>
                  <p className="text-elan-600">
                    Speed: {deliveryMethod === 'express' ? 'Priority Air Express (Next Day)' : 'Standard Complimentary (2-3 Days)'}
                  </p>
                  <p className="text-emerald-700 font-semibold">256-Bit SSL Encrypted Sandbox</p>
                </div>
              </div>

              {/* Items in order */}
              <div className="pt-4 border-t border-elan-100">
                <h3 className="text-xs font-semibold uppercase tracking-wider-luxury text-elan-900 mb-3">
                  Creations in Order ({items.length})
                </h3>
                <div className="divide-y divide-elan-100 max-h-56 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-sm" />
                        <div>
                          <p className="font-semibold text-elan-900">{item.name}</p>
                          <p className="text-elan-400 text-[11px]">
                            Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''} {item.selectedVolume ? `• Vol: ${item.selectedVolume}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-elan-950 font-serif-luxury text-sm">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-sm text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Simulated Checkout Mode:</strong> Your order will be recorded in your Firestore <code>orders</code> collection with tracking telemetry. No real banking charge will be incurred.
                </p>
              </div>

              {/* Place Order CTA */}
              <div className="pt-6 border-t border-elan-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider-luxury text-elan-600 hover:text-elan-950"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Payment</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="btn-gold py-4 px-10 text-xs font-bold tracking-widest-luxury flex items-center gap-2"
                >
                  {isProcessing ? (
                    <span>Securing Reservation...</span>
                  ) : (
                    <span>Authorize & Place Order (₹{finalPayable.toLocaleString('en-IN')})</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-elan-200 shadow-luxury space-y-6 sticky top-28">
            <h3 className="font-serif-luxury text-2xl font-bold text-elan-950 pb-4 border-b border-elan-200">
              Acquisition Summary
            </h3>

            <div className="space-y-3 text-xs text-elan-600">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-elan-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Privilege Code ({appliedCoupon?.code})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700 font-semibold">Complimentary</strong>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              {deliveryMethod === 'express' && (
                <div className="flex justify-between text-elan-900">
                  <span>Priority Air Delivery</span>
                  <span>+₹200</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-elan-950 pt-4 border-t border-elan-200">
                <span>Total Payable</span>
                <span>₹{finalPayable.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-elan-400">All prices include applicable Goods and Services Tax (GST).</p>
            </div>

            {/* Amazon-Style Trust & Return Guarantees */}
            <div className="p-4 bg-[#F8F6F2] rounded-xs border border-[rgba(185,154,107,0.25)] space-y-2.5 text-[11px] text-[#777777]">
              <div className="flex items-center gap-1.5 font-bold text-[#0A0A0A] uppercase tracking-wider text-xs pb-1 border-b border-[rgba(185,154,107,0.18)]">
                <ShieldCheck className="w-4 h-4 text-[#B99A6B]" />
                <span>StyleNest Client Guarantees</span>
              </div>
              <div className="space-y-1.5">
                <p className="flex items-start gap-1.5">
                  <span className="text-[#B99A6B] font-bold">✓</span>
                  <span><strong>14-Day Doorstep Returns:</strong> Unworn pieces collected from your doorstep with 100% full refund.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-[#B99A6B] font-bold">✓</span>
                  <span><strong>Insured Air Dispatch:</strong> Sealed keepsake boxes dispatched via BlueDart with live tracking telemetry.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-[#B99A6B] font-bold">✓</span>
                  <span><strong>Pay on Delivery:</strong> Settle via Cash or UPI upon physical inspection at your door.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
