import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  User, Package, MapPin, Heart, LogOut, Plus, Trash2,
  ShieldCheck, Check, Sparkles, ExternalLink, Clock,
  RotateCcw, Truck, AlertCircle, Printer, X, RefreshCw, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Address, Order, OrderStatus } from '../types';
import { BrandLogo } from '../components/common/BrandLogo';
import { requestOrderReturn } from '../services/orderService';

export const Account: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isAuthReady,
    isAdmin,
    isFirebaseConnected,
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    orders,
  } = useAuth();

  React.useEffect(() => {
    document.title = 'Client Privé Account | STYLENEST';
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = (location.state as any)?.from || null;

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  // Auth Form State (if not authenticated)
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Add Address Modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    fullName: '',
    phone: '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  // Profile Edit State
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  const toast = useToast();

  // Amazon-style Order Actions & Return Modal State
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Size does not fit properly');
  const [refundMode, setRefundMode] = useState<'Original Source' | 'Store Credit' | 'Bank Transfer (COD)'>('Original Source');
  const [refundUpiOrBank, setRefundUpiOrBank] = useState('');
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  const handleOpenReturnModal = (order: Order) => {
    setSelectedOrderForReturn(order);
    setReturnReason('Size does not fit properly');
    setRefundMode(order.paymentMethod === 'COD' ? 'Bank Transfer (COD)' : 'Original Source');
    setRefundUpiOrBank('');
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForReturn) return;

    setIsSubmittingReturn(true);
    try {
      await requestOrderReturn(selectedOrderForReturn.id, returnReason, refundMode);
      selectedOrderForReturn.orderStatus = 'Return Requested';
      selectedOrderForReturn.returnStatus = 'Requested';
      selectedOrderForReturn.returnReason = returnReason;
      selectedOrderForReturn.refundMode = refundMode;

      toast.luxury(
        'Return Request Submitted',
        `Return for #${selectedOrderForReturn.orderNumber} initiated. Complimentary doorstep pickup scheduled in 48 hours.`
      );
      setSelectedOrderForReturn(null);
    } catch (err: any) {
      toast.error('Return Request Error', err?.message || 'Could not register return. Please try again.');
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!emailInput.trim()) return;

    setAuthLoading(true);

    try {
      if (authMode === 'signin') {
        const res = await signIn(emailInput.trim(), passwordInput);
        if (!res.success && res.message) {
          setAuthError(res.message);
        } else if (res.success && redirectPath) {
          navigate(redirectPath, { replace: true });
        }
      } else {
        const res = await signUp(emailInput.trim(), passwordInput, nameInput.trim());
        if (!res.success && res.message) {
          setAuthError(res.message);
        } else if (res.success && redirectPath) {
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success && res.message) {
        setAuthError(res.message);
      } else if (res.success && redirectPath) {
        navigate(redirectPath, { replace: true });
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Google authentication failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!emailInput.trim()) {
      setAuthError('Please enter your email address to receive reset instructions.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      await resetPassword(emailInput.trim());
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.addressLine1 || !newAddr.pincode) return;
    addAddress(newAddr);
    setIsAddingAddress(false);
    setNewAddr({
      fullName: '',
      phone: '',
      email: user?.email || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
  };

  // Wait for Firebase Auth initialization to finish restoring session
  if (!isAuthReady) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#B99A6B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest-luxury text-[#B99A6B] font-semibold">
          Restoring Maison Privé Session...
        </p>
      </div>
    );
  }

  // If user is not authenticated, show luxury Sign In / Register interface
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-[#FDFBF7] p-8 sm:p-10 rounded-none border border-[#D8BD83]/40 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <BrandLogo layout="stacked" size="md" variant="dark" />
            </div>
            <h1 className="text-xs uppercase font-mono tracking-widest font-bold text-[#32141B]">
              Maison Privé Client Portal
            </h1>
            <p className="text-xs text-[#89786C]">
              Sign in to manage your bespoke orders, saved residences, and curated wishlist.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2E6D2] text-[#4A0E1C] border border-[#D8BD83]/50 rounded-none text-[10px] font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A0E1C]" />
              STYLENEST &times; DRIPPY &bull; Privé Member Portal
            </span>
          </div>

          {/* Google One-Click OAuth */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || authLoading}
              className="w-full py-3 px-4 bg-white hover:bg-[#F2E6D2] active:bg-[#EFE7D7] text-[#32141B] border border-[#D8BD83]/60 rounded-none text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-xs hover:border-[#4A0E1C] disabled:opacity-50"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-[#4A0E1C] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{googleLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#D8BD83]/30 w-full" />
              <span className="bg-[#FDFBF7] px-3 text-[10px] text-[#89786C] uppercase tracking-widest font-mono absolute">
                or with email
              </span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-b border-[#D8BD83]/40 text-xs font-semibold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setAuthError(null); }}
              className={`flex-1 pb-3 text-center transition-colors ${
                authMode === 'signin'
                  ? 'border-b-2 border-[#4A0E1C] text-[#4A0E1C] font-bold'
                  : 'text-[#89786C] hover:text-[#32141B]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setAuthError(null); }}
              className={`flex-1 pb-3 text-center transition-colors ${
                authMode === 'register'
                  ? 'border-b-2 border-[#4A0E1C] text-[#4A0E1C] font-bold'
                  : 'text-[#89786C] hover:text-[#32141B]'
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-none">
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {authMode === 'register' && (
              <div>
                <label className="block uppercase font-mono tracking-wider font-semibold text-[#32141B] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Arya Singhania"
                  required
                  className="w-full bg-white border border-[#D8BD83]/50 p-2.5 rounded-none focus:border-[#4A0E1C] outline-none text-[#32141B]"
                />
              </div>
            )}

            <div>
              <label className="block uppercase font-mono tracking-wider font-semibold text-[#32141B] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@domain.com"
                required
                className="w-full bg-white border border-[#D8BD83]/50 p-2.5 rounded-none focus:border-[#4A0E1C] outline-none text-[#32141B]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block uppercase font-mono tracking-wider font-semibold text-[#32141B]">
                  Password
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-[10px] text-[#4A0E1C] hover:underline uppercase font-mono tracking-wider"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password (min 6 characters)"
                required
                minLength={6}
                className="w-full bg-white border border-[#D8BD83]/50 p-2.5 rounded-none focus:border-[#4A0E1C] outline-none text-[#32141B]"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-[#4A0E1C] hover:bg-[#2A0710] text-[#F8F0E2] text-xs font-bold uppercase tracking-wider mt-2 disabled:opacity-50 border border-[#D8BD83]/40 transition-colors shadow-sm"
            >
              {authLoading
                ? 'Processing...'
                : authMode === 'signin'
                ? 'Sign In to Privé'
                : 'Join STYLENEST Privé'}
            </button>
          </form>

          <p className="text-[10px] text-center text-[#89786C] font-mono">
            Protected by Firebase Authentication & 256-bit SSL encryption.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-16 pb-28">
      {/* Account Hero Bar */}
      <div className="bg-elan-950 text-white p-6 sm:p-10 rounded-sm shadow-luxury flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-elan-850 border border-elan-700 flex items-center justify-center text-elan-gold font-serif-luxury text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold">{user.name}</h1>
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-elan-gold text-elan-950 rounded-xs">
                {user.role === 'admin' ? 'Store Director (Admin)' : 'Privé Member'}
              </span>
            </div>
            <p className="text-xs text-elan-400 mt-1">{user.email} &bull; {user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="btn-gold py-2.5 px-4 text-xs flex items-center gap-1.5"
            >
              <span>Admin Management</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={logout}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Tabs (3 cols) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-sm border border-elan-200 shadow-sm p-4 space-y-1.5 text-xs font-semibold uppercase tracking-wider-luxury">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors text-left ${
                activeTab === 'orders'
                  ? 'bg-elan-950 text-white'
                  : 'text-elan-700 hover:bg-elan-50 hover:text-elan-950'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Consignments ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors text-left ${
                activeTab === 'addresses'
                  ? 'bg-elan-950 text-white'
                  : 'text-elan-700 hover:bg-elan-50 hover:text-elan-950'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Residences ({user.addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors text-left ${
                activeTab === 'profile'
                  ? 'bg-elan-950 text-white'
                  : 'text-elan-700 hover:bg-elan-50 hover:text-elan-950'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>

            <Link
              to="/wishlist"
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-elan-700 hover:bg-elan-50 hover:text-elan-950 transition-colors text-left"
            >
              <Heart className="w-4 h-4 text-rose-600" />
              <span>Saved Wishlist</span>
            </Link>
          </div>
        </div>

        {/* Right Content Panels (9 cols) */}
        <div className="lg:col-span-9">
          {/* TAB 1: Consignments & Orders (Amazon-Style Full Experience) */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(185,154,107,0.22)]">
                <div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#0A0A0A]">
                    Your Orders & Consignments
                  </h2>
                  <p className="text-xs text-[#777777] mt-0.5">
                    Track shipments, request 14-day doorstep returns, and download tax invoices.
                  </p>
                </div>
                <span className="text-xs text-[#B99A6B] font-bold font-mono">
                  {orders.length} Orders Logged
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white border border-[rgba(185,154,107,0.2)] rounded-sm p-6 shadow-xs">
                  <Package className="w-12 h-12 mx-auto text-[#B99A6B]/50 mb-3" />
                  <h3 className="font-serif-luxury text-xl font-bold text-[#0A0A0A]">No Orders Placed Yet</h3>
                  <p className="text-xs text-[#777777] mt-1 max-w-sm mx-auto">
                    When you acquire pieces from the StyleNest boutique, their live tracking and return requests will appear here.
                  </p>
                  <Link to="/men" className="btn-primary mt-5 py-2.5 px-6 text-xs">Explore Collections</Link>
                </div>
              ) : (
                orders.map((order) => {
                  const isDelivered = order.orderStatus === 'Delivered';
                  const isShipped = order.orderStatus === 'Shipped' || order.orderStatus === 'Out for Delivery' || isDelivered;
                  const isReturnRequested = order.orderStatus === 'Return Requested';
                  const isRefunded = order.orderStatus === 'Refunded';

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-xs border border-[rgba(185,154,107,0.22)] shadow-sm overflow-hidden text-xs transition-shadow hover:shadow-md"
                    >
                      {/* Amazon-Style Order Header Bar */}
                      <div className="p-4 sm:p-5 bg-[#F8F6F2] border-b border-[rgba(185,154,107,0.18)] grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#777777] font-bold block">
                            Order Placed
                          </span>
                          <p className="font-semibold text-[#0A0A0A]">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#777777] font-bold block">
                            Total Paid
                          </span>
                          <p className="font-bold text-[#0A0A0A] font-serif-luxury text-sm">
                            ₹{order.total.toLocaleString('en-IN')}
                            <span className="text-[10px] font-sans font-normal text-[#777777] ml-1">
                              ({order.paymentMethod})
                            </span>
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#777777] font-bold block">
                            Ship To
                          </span>
                          <div className="group relative inline-block cursor-pointer">
                            <span className="font-semibold text-[#B99A6B] underline decoration-dotted">
                              {order.shippingAddress.fullName}
                            </span>
                            {/* Address Tooltip */}
                            <div className="hidden group-hover:block absolute z-30 left-0 top-full mt-1 w-64 p-3 bg-[#0A0A0A] text-white text-[11px] rounded-xs shadow-xl pointer-events-none">
                              <p className="font-bold text-[#B99A6B]">{order.shippingAddress.fullName}</p>
                              <p>{order.shippingAddress.addressLine1}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                              <p className="text-[10px] text-white/70 mt-1">Phone: {order.shippingAddress.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-wider text-[#777777] font-bold block">
                            Order #{order.orderNumber}
                          </span>
                          <Link
                            to={`/order-confirmation/${order.orderNumber}`}
                            className="text-[#0A0A0A] hover:text-[#B99A6B] font-semibold underline text-[11px]"
                          >
                            View Receipt
                          </Link>
                        </div>
                      </div>

                      {/* Amazon-Style Visual Delivery Stepper */}
                      <div className="p-4 sm:p-5 bg-white border-b border-[rgba(185,154,107,0.12)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <p className="font-bold text-sm text-[#0A0A0A] flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-[#B99A6B]" />
                            {isRefunded ? (
                              <span className="text-purple-700">Refund Processed (₹{order.refundAmount || order.total})</span>
                            ) : isReturnRequested ? (
                              <span className="text-amber-700">Return & Refund Initiated — Doorstep Pickup Scheduled</span>
                            ) : isDelivered ? (
                              <span className="text-emerald-700">Delivered</span>
                            ) : (
                              <span>Estimated Delivery: {order.estimatedDelivery}</span>
                            )}
                          </p>
                          <span className="text-[11px] text-[#777777]">
                            Courier: {order.courierPartner || 'BlueDart Apex Air Express'} • {order.trackingNumber}
                          </span>
                        </div>

                        {/* Progress Stepper Bar */}
                        {!isReturnRequested && !isRefunded && (
                          <div className="w-full py-2">
                            <div className="flex items-center justify-between relative">
                              <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#F8F6F2] -translate-y-1/2 z-0">
                                <div
                                  className="h-full bg-emerald-600 transition-all duration-500"
                                  style={{
                                    width: isDelivered
                                      ? '100%'
                                      : order.orderStatus === 'Out for Delivery'
                                      ? '75%'
                                      : isShipped
                                      ? '50%'
                                      : '25%',
                                  }}
                                />
                              </div>

                              {[
                                { label: 'Ordered', done: true },
                                { label: 'Confirmed', done: true },
                                { label: 'Shipped', done: isShipped },
                                { label: 'Out for Delivery', done: order.orderStatus === 'Out for Delivery' || isDelivered },
                                { label: 'Delivered', done: isDelivered },
                              ].map((step, sIdx) => (
                                <div key={sIdx} className="flex flex-col items-center relative z-10">
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white ${
                                      step.done ? 'bg-emerald-600 text-white' : 'bg-[#E5E5E5] text-[#777777]'
                                    }`}
                                  >
                                    {step.done ? '✓' : sIdx + 1}
                                  </div>
                                  <span className="text-[9px] uppercase font-semibold text-[#777777] mt-1 hidden sm:block">
                                    {step.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Return / Refund Highlight Banner if active */}
                        {isReturnRequested && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xs text-amber-900 text-xs flex items-start gap-2.5">
                            <RefreshCw className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 animate-spin" />
                            <div>
                              <p className="font-bold">14-Day Doorstep Return & Full Refund Scheduled</p>
                              <p className="text-[11px] text-amber-800 mt-0.5">
                                Reason: <strong>{order.returnReason || 'Customer Request'}</strong> • Our reverse-pickup executive will collect the sealed package.
                                Refund of <strong>₹{order.total.toLocaleString('en-IN')}</strong> will be credited to {order.refundMode || 'Original Mode'}.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Items and Action Buttons */}
                      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Ordered Items (8 cols) */}
                        <div className="lg:col-span-8 divide-y divide-[rgba(185,154,107,0.12)]">
                          {order.items.map((item) => (
                            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-14 h-18 object-cover rounded-xs bg-[#F8F6F2] border border-black/5"
                                />
                                <div className="space-y-0.5">
                                  <Link
                                    to={`/product/${item.id}`}
                                    className="font-semibold text-sm text-[#0A0A0A] hover:text-[#B99A6B] transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                  <p className="text-[11px] text-[#777777]">
                                    Quantity: <strong>{item.quantity}</strong>{' '}
                                    {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}{' '}
                                    {item.selectedVolume ? `• Vol: ${item.selectedVolume}` : ''}
                                  </p>
                                  <p className="text-[10px] text-emerald-700 font-semibold">
                                    Eligible for 14-day Return & Doorstep Pickup
                                  </p>
                                </div>
                              </div>
                              <span className="font-bold text-[#0A0A0A] font-serif-luxury text-base shrink-0">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Amazon-Style Action Buttons (4 cols) */}
                        <div className="lg:col-span-4 space-y-2 border-t lg:border-t-0 lg:border-l border-[rgba(185,154,107,0.18)] pt-4 lg:pt-0 lg:pl-6">
                          <button
                            onClick={() => setSelectedOrderForTracking(order)}
                            className="w-full py-2.5 px-4 bg-[#0A0A0A] hover:bg-[#B99A6B] text-white hover:text-[#0A0A0A] rounded-xs font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Package</span>
                          </button>

                          {!isReturnRequested && !isRefunded && (
                            <button
                              onClick={() => handleOpenReturnModal(order)}
                              className="w-full py-2.5 px-4 bg-white border border-[rgba(185,154,107,0.3)] hover:border-[#0A0A0A] text-[#0A0A0A] rounded-xs font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#B99A6B]" />
                              <span>Return or Replace (14-Day Refund)</span>
                            </button>
                          )}

                          <Link
                            to={`/order-confirmation/${order.orderNumber}`}
                            className="w-full py-2.5 px-4 bg-[#F8F6F2] hover:bg-white border border-[rgba(185,154,107,0.2)] text-[#0A0A0A] rounded-xs font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#777777]" />
                            <span>View or Print Invoice</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* ---------------------------------------------------- */}
              {/* MODAL 1: LIVE COURIER TRACKING MODAL                 */}
              {/* ---------------------------------------------------- */}
              {selectedOrderForTracking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/70 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-xs max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[rgba(185,154,107,0.3)] max-h-[90vh] overflow-y-auto space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-[rgba(185,154,107,0.2)]">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#B99A6B] font-bold">
                          Live Courier Telemetry
                        </span>
                        <h3 className="font-serif-luxury text-xl font-bold text-[#0A0A0A]">
                          Tracking #{selectedOrderForTracking.trackingNumber}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedOrderForTracking(null)}
                        className="p-1 text-[#777777] hover:text-[#0A0A0A]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4 bg-[#F8F6F2] rounded-xs border border-[rgba(185,154,107,0.18)] space-y-1">
                      <p className="text-xs font-bold text-[#0A0A0A]">
                        Carrier: {selectedOrderForTracking.courierPartner || 'BlueDart Apex Air Express'}
                      </p>
                      <p className="text-[11px] text-[#777777]">
                        Destination: {selectedOrderForTracking.shippingAddress.city}, {selectedOrderForTracking.shippingAddress.state} - {selectedOrderForTracking.shippingAddress.pincode}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold">
                        Estimated Handover: {selectedOrderForTracking.estimatedDelivery}
                      </p>
                    </div>

                    {/* Milestone Checkpoints */}
                    <div className="space-y-4 pl-4 border-l-2 border-[#B99A6B] text-xs">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                        <p className="font-bold text-[#0A0A0A]">Out for Delivery / In Transit</p>
                        <p className="text-[11px] text-[#777777]">Sorted at regional hub, dispatched for doorstep handover.</p>
                        <span className="text-[10px] text-[#A3A3A3]">Today, 08:30 AM</span>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#B99A6B] ring-4 ring-white" />
                        <p className="font-bold text-[#0A0A0A]">Dispatched from Central Atelier</p>
                        <p className="text-[11px] text-[#777777]">Sealed in luxury keepsake box with tamper-evident seal.</p>
                        <span className="text-[10px] text-[#A3A3A3]">Yesterday, 04:15 PM</span>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#0A0A0A] ring-4 ring-white" />
                        <p className="font-bold text-[#0A0A0A]">Order Verified & Confirmed</p>
                        <p className="text-[11px] text-[#777777]">Telemetry recorded and inventory reserved.</p>
                        <span className="text-[10px] text-[#A3A3A3]">{new Date(selectedOrderForTracking.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOrderForTracking(null)}
                      className="w-full btn-primary py-3 text-xs"
                    >
                      Close Tracking
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* MODAL 2: 14-DAY DOORSTEP RETURN & REFUND MODAL       */}
              {/* ---------------------------------------------------- */}
              {selectedOrderForReturn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/70 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-xs max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[rgba(185,154,107,0.3)] max-h-[90vh] overflow-y-auto space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[rgba(185,154,107,0.2)]">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#B99A6B] font-bold">
                          14-Day Effortless Returns
                        </span>
                        <h3 className="font-serif-luxury text-xl font-bold text-[#0A0A0A]">
                          Request Return & 100% Refund
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedOrderForReturn(null)}
                        className="p-1 text-[#777777] hover:text-[#0A0A0A]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-3.5 bg-[#F8F6F2] rounded-xs border border-[rgba(185,154,107,0.18)] text-xs text-[#0A0A0A] space-y-1">
                      <p className="font-bold">Order #{selectedOrderForReturn.orderNumber}</p>
                      <p className="text-[#777777]">
                        Refund Amount: <strong className="text-[#0A0A0A]">₹{selectedOrderForReturn.total.toLocaleString('en-IN')}</strong>
                      </p>
                      <p className="text-[11px] text-emerald-800 font-semibold">
                        ✓ Free doorstep collection from {selectedOrderForReturn.shippingAddress.city}
                      </p>
                    </div>

                    <form onSubmit={handleSubmitReturn} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-[#0A0A0A] mb-1">
                          Why are you returning this piece? *
                        </label>
                        <select
                          value={returnReason}
                          onChange={(e) => setReturnReason(e.target.value)}
                          className="w-full bg-[#F8F6F2] border border-[rgba(185,154,107,0.3)] p-2.5 rounded-xs outline-none text-[#0A0A0A]"
                        >
                          <option value="Size does not fit properly">Size does not fit properly</option>
                          <option value="Fabric or shade does not match expectations">Fabric or shade does not match expectations</option>
                          <option value="Item arrived defective or damaged">Item arrived defective or damaged</option>
                          <option value="Delayed arrival / No longer needed">Delayed arrival / No longer needed</option>
                          <option value="Received incorrect silhouette">Received incorrect silhouette</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-[#0A0A0A] mb-1">
                          Preferred Refund Method *
                        </label>
                        <select
                          value={refundMode}
                          onChange={(e) => setRefundMode(e.target.value as any)}
                          className="w-full bg-[#F8F6F2] border border-[rgba(185,154,107,0.3)] p-2.5 rounded-xs outline-none text-[#0A0A0A]"
                        >
                          <option value="Original Source">Refund to Original Payment Method (Instant)</option>
                          <option value="Bank Transfer (COD)">Bank Account / UPI Transfer (for COD)</option>
                          <option value="Store Credit">StyleNest Store Credit + 5% Bonus Privé Value</option>
                        </select>
                      </div>

                      {refundMode === 'Bank Transfer (COD)' && (
                        <div>
                          <label className="block font-semibold uppercase tracking-wider text-[#0A0A0A] mb-1">
                            UPI ID or Bank Account No. & IFSC *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. yourname@okhdfcbank or 501002938491 (HDFC000123)"
                            value={refundUpiOrBank}
                            onChange={(e) => setRefundUpiOrBank(e.target.value)}
                            className="w-full bg-[#F8F6F2] border border-[rgba(185,154,107,0.3)] p-2.5 rounded-xs outline-none text-[#0A0A0A]"
                          />
                        </div>
                      )}

                      <p className="text-[11px] text-[#777777] leading-relaxed">
                        By submitting this request, a courier partner will be assigned to collect the unworn garment with security tags intact within 48 hours.
                      </p>

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(185,154,107,0.18)]">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForReturn(null)}
                          className="px-4 py-2.5 border border-[#777777]/30 text-xs font-semibold rounded-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingReturn}
                          className="btn-primary py-2.5 px-6 text-xs"
                        >
                          {isSubmittingReturn ? 'Submitting...' : 'Confirm Return & Doorstep Pickup'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-elan-200">
                <h2 className="font-serif-luxury text-2xl font-bold text-elan-950">
                  Registered Residences
                </h2>
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Residence</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-6 rounded-sm border bg-white shadow-sm flex flex-col justify-between ${
                      addr.isDefault ? 'border-elan-950' : 'border-elan-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-elan-950">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-elan-950 text-white text-[10px] font-bold uppercase tracking-wider rounded-xs">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-elan-700 leading-relaxed">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="text-xs text-elan-600">{addr.addressLine2}</p>}
                      <p className="text-xs text-elan-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-xs text-elan-500 mt-2 font-medium">Contact: {addr.phone}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-elan-100 flex items-center justify-between text-xs">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-elan-700 hover:text-elan-950 font-semibold uppercase tracking-wider"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[11px]">Primary Destination</span>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Form Modal */}
              {isAddingAddress && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-elan-950/70 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-luxury text-elan-900">
                    <h3 className="font-serif-luxury text-2xl font-bold text-elan-950 mb-4 pb-2 border-b border-elan-200">
                      Add New Residence Address
                    </h3>
                    <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddr.fullName}
                          onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                          className="w-full bg-elan-50 border border-elan-300 p-2 rounded focus:border-elan-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Mobile Phone</label>
                        <input
                          type="tel"
                          required
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          className="w-full bg-elan-50 border border-elan-300 p-2 rounded focus:border-elan-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={newAddr.addressLine1}
                          onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                          className="w-full bg-elan-50 border border-elan-300 p-2 rounded focus:border-elan-900 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={newAddr.city}
                            onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                            className="w-full bg-elan-50 border border-elan-300 p-2 rounded focus:border-elan-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">PIN Code</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={newAddr.pincode}
                            onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                            className="w-full bg-elan-50 border border-elan-300 p-2 rounded focus:border-elan-900 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={newAddr.state}
                          onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                          className="w-full bg-elan-50 border border-elan-300 p-2 rounded focus:border-elan-900 outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-elan-100">
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(false)}
                          className="px-4 py-2 border border-elan-300 text-xs font-semibold rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary py-2 px-6"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-sm border border-elan-200 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="font-serif-luxury text-2xl font-bold text-elan-950 pb-3 border-b border-elan-200">
                Privé Profile Details
              </h2>

              <div className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-elan-800 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-elan-50 border border-elan-300 p-2.5 rounded-sm focus:border-elan-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-elan-800 mb-1">
                    Primary Email
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={user.email}
                    className="w-full bg-elan-100 border border-elan-300 p-2.5 rounded-sm text-elan-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-elan-800 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-elan-50 border border-elan-300 p-2.5 rounded-sm focus:border-elan-900 outline-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => updateProfile({ name: editName, phone: editPhone })}
                    className="btn-primary py-3 px-8 text-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
