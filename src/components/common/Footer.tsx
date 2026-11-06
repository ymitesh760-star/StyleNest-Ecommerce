import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldCheck, RefreshCw, Truck, Headphones, CheckCircle2, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { BrandLogo } from './BrandLogo';
import { subscribeNewsletter } from '../../services/newsletterService';

interface PolicyModalData {
  title: string;
  content: string;
}

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [policyModal, setPolicyModal] = useState<PolicyModalData | null>(null);

  const toast = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      const res = await subscribeNewsletter(email.trim());
      setIsSubscribed(true);
      toast.luxury('Welcome to StyleNest Privé', res.message || 'You have been enrolled in our private client circle. Use code LUXE20.');
    } catch {
      setIsSubscribed(true);
      toast.luxury('Welcome to StyleNest Privé', 'You have been enrolled in our private client circle. Use code LUXE20.');
    }
  };

  const openPolicy = (type: 'shipping' | 'return' | 'privacy' | 'terms') => {
    const policies: Record<string, PolicyModalData> = {
      shipping: {
        title: 'Complimentary Shipping & Delivery Policy',
        content: `At StyleNest, each creation is packaged with utmost care in our signature matte royal burgundy keepsake gift box with champagne ribbon. 
        \n• Complimentary Express Delivery: Offered across India on all orders exceeding ₹1,999.
        \n• Standard Delivery: ₹250 for orders under ₹1,999 (Estimated 2-4 business days for major metropolitan hubs: Mumbai, Delhi NCR, Bangalore, Chennai, Hyderabad, Kolkata).
        \n• Express Next-Day Courier: Available at checkout for select PIN codes.
        \n• Dispatch Telemetry: You will receive real-time SMS and email tracking credentials once your parcel departs our fulfillment atelier.`
      },
      return: {
        title: '14-Day Effortless Returns & Exchanges',
        content: `We wish you to be completely enamored with your StyleNest acquisition.
        \n• Window: Items may be returned or exchanged within 14 calendar days of delivery.
        \n• Condition: Garments, footwear, and accessories must remain unworn, unwashed, and in pristine original condition with security tags attached.
        \n• Haute Parfumerie: Perfumes include a complimentary 2ml sample vial in the package. Please sample the 2ml vial first before breaking the cellophane seal on the full-size bottle.
        \n• Complimentary Reverse Pickup: Scheduled directly from your address at no additional cost.`
      },
      privacy: {
        title: 'Privacy Policy & Data Stewardship',
        content: `Your confidentiality is paramount to the StyleNest Maison.
        \n• Data Usage: We collect strictly necessary information to process orders, authenticate Privé accounts, and tailor your shopping experience.
        \n• 256-Bit Encryption: All telemetry, payments, and addresses are encrypted end-to-end. We never sell or lease client data to third parties.
        \n• Cookies & Preferences: Used purely to preserve your bag, currency preferences, and wishlist across browser sessions.`
      },
      terms: {
        title: 'Terms & Conditions of Sale',
        content: `Welcome to StyleNest Luxury Retail.
        \n• Product Authenticity: Every item sold via our platform is guaranteed authentic, designed in-house or crafted by master artisan partners in Italy, France, Portugal, and India.
        \n• Pricing & Currencies: All transactions are processed in Indian Rupees (₹ INR) inclusive of all applicable domestic taxes (GST).
        \n• Governing Law: Contracts are subject to the jurisdiction of the High Court of Bombay.`
      }
    };

    setPolicyModal(policies[type]);
  };

  return (
    <>
      <footer className="bg-[#2A0710] text-[#D8BD83]/80 pt-16 pb-12 border-t border-[#D8BD83]/30 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Top Brand Perks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-[#D8BD83]/20 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-[#4A0E1C] border border-[#D8BD83]/40 flex items-center justify-center text-[#D8BD83] shrink-0">
                <Truck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-mono font-bold text-[#F8F0E2]">Complimentary Delivery</h4>
                <p className="text-[11px] text-[#D8BD83]/70 mt-0.5">On all domestic orders above ₹1,999</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-[#4A0E1C] border border-[#D8BD83]/40 flex items-center justify-center text-[#D8BD83] shrink-0">
                <RefreshCw className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-mono font-bold text-[#F8F0E2]">14-Day Returns</h4>
                <p className="text-[11px] text-[#D8BD83]/70 mt-0.5">Complimentary door-step collection</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-[#4A0E1C] border border-[#D8BD83]/40 flex items-center justify-center text-[#D8BD83] shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-mono font-bold text-[#F8F0E2]">Artisanal Provenance</h4>
                <p className="text-[11px] text-[#D8BD83]/70 mt-0.5">Crafted in Italy, France, and India</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-[#4A0E1C] border border-[#D8BD83]/40 flex items-center justify-center text-[#D8BD83] shrink-0">
                <Headphones className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-mono font-bold text-[#F8F0E2]">Private Concierge</h4>
                <p className="text-[11px] text-[#D8BD83]/70 mt-0.5">Styling & bespoke size advisory</p>
              </div>
            </div>
          </div>

          {/* Main Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-[#D8BD83]/20">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-block">
                <BrandLogo layout="horizontal" size="lg" variant="light" />
              </div>
              <p className="text-xs text-[#F8F0E2]/80 leading-relaxed max-w-sm">
                STYLENEST &times; DRIPPY represents the revolutionary convergence of royal Indian couture and contemporary streetwear. Hand-loomed silks, bespoke zardozi embroidery, and heavyweight street architecture.
              </p>

              {/* Newsletter Form */}
              <div className="pt-2">
                <p className="text-xs uppercase tracking-widest font-mono font-bold text-[#F8F0E2] mb-1.5">
                  Subscribe to STYLENEST &times; DRIPPY Drops
                </p>
                <p className="text-[11px] text-[#D8BD83]/70 mb-3">
                  Receive private invitations to limited capsule drops, runway previews, and 20% off your inaugural order with code <strong>DRIPPY20</strong>.
                </p>

                {isSubscribed ? (
                  <div className="flex items-center gap-2 p-3 bg-[#4A0E1C] border border-[#D8BD83]/40 text-[#F8F0E2] text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#D8BD83] shrink-0" />
                    <span>Welcome to STYLENEST &times; DRIPPY. Use code <strong>DRIPPY20</strong> at checkout.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-1.5">
                    <div className="flex">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 text-[#D8BD83]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full bg-[#1E050B] border border-[#D8BD83]/30 pl-9 pr-3 py-2.5 text-xs text-[#F8F0E2] placeholder:text-[#89786C] focus:border-[#D8BD83] outline-none transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-[#D8BD83] hover:bg-[#F2E6D2] text-[#2A0710] font-bold uppercase text-[11px] tracking-wider px-5 py-2.5 transition-colors"
                      >
                        Join
                      </button>
                    </div>
                    {error && <p className="text-[11px] text-rose-400">{error}</p>}
                  </form>
                )}
              </div>
            </div>

            {/* Col 2: Collections */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-mono font-bold text-[#F8F0E2]">Collections</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/men" className="hover:text-[#D8BD83] transition-colors">Contemporary Menswear</Link></li>
                <li><Link to="/women" className="hover:text-[#D8BD83] transition-colors">Women&apos;s Atelier (Coming Soon)</Link></li>
                <li><Link to="/shoes" className="hover:text-[#D8BD83] transition-colors">Artisanal Footwear</Link></li>
                <li><Link to="/perfumes" className="hover:text-[#D8BD83] transition-colors">Haute Parfumerie</Link></li>
                <li><Link to="/new-arrivals" className="hover:text-[#D8BD83] transition-colors">New Arrivals 2026</Link></li>
                <li><Link to="/sale" className="text-[#D8BD83] hover:text-white transition-colors font-bold">Seasonal Archive (Sale)</Link></li>
              </ul>
            </div>

            {/* Col 3: Client Care */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-mono font-bold text-[#F8F0E2]">Client Concierge</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/account" className="hover:text-[#D8BD83] transition-colors">My Orders & Tracking</Link></li>
                <li><Link to="/account" className="hover:text-[#D8BD83] transition-colors">14-Day Returns & Refunds</Link></li>
                <li><Link to="/wishlist" className="hover:text-[#D8BD83] transition-colors">Saved Wishlist</Link></li>
                <li><Link to="/cart" className="hover:text-[#D8BD83] transition-colors">Shopping Bag</Link></li>
                <li>
                  <button onClick={() => openPolicy('shipping')} className="hover:text-[#D8BD83] transition-colors text-left">
                    Shipping & Delivery
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: The Maison */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-mono font-bold text-[#F8F0E2]">The Maison</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => openPolicy('privacy')} className="hover:text-[#D8BD83] transition-colors text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => openPolicy('terms')} className="hover:text-[#D8BD83] transition-colors text-left">
                    Terms & Conditions
                  </button>
                </li>
                <li><Link to="/admin" className="text-[#D8BD83] hover:underline transition-colors font-bold">Store Director Portal</Link></li>
                <li className="pt-2 text-[11px] text-[#D8BD83]/60">
                  Flagship Store:<br />
                  Palais Royale, Worli,<br />
                  Mumbai 400018
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8BD83]/70">
            <p>&copy; {new Date().getFullYear()} STYLENEST. All rights reserved.</p>
            
            {/* Payment Method Badges */}
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider">
              <span className="px-2.5 py-1 bg-[#1E050B] border border-[#D8BD83]/30 text-[#F8F0E2]">VISA</span>
              <span className="px-2.5 py-1 bg-[#1E050B] border border-[#D8BD83]/30 text-[#F8F0E2]">MASTERCARD</span>
              <span className="px-2.5 py-1 bg-[#1E050B] border border-[#D8BD83]/30 text-[#F8F0E2]">RUPAY</span>
              <span className="px-2.5 py-1 bg-[#1E050B] border border-[#D8BD83]/30 text-[#D8BD83]">UPI</span>
              <span className="px-2.5 py-1 bg-[#1E050B] border border-[#D8BD83]/30 text-[#F8F0E2]">CASH ON DELIVERY</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy View Modal */}
      {policyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#F8F0E2] rounded-none max-w-lg w-full p-6 sm:p-8 shadow-2xl text-[#32141B] relative border border-[#D8BD83]">
            <button
              onClick={() => setPolicyModal(null)}
              className="absolute top-4 right-4 text-[#89786C] hover:text-[#4A0E1C] p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold tracking-tight text-xl text-[#32141B] mb-4 pb-2 border-b border-[#D8BD83]/40 uppercase">
              {policyModal.title}
            </h3>
            <div className="text-xs text-[#6A5559] leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto pr-2">
              {policyModal.content}
            </div>
            <div className="mt-6 pt-4 border-t border-[#D8BD83]/40 text-right">
              <button
                onClick={() => setPolicyModal(null)}
                className="bg-[#4A0E1C] text-[#F8F0E2] font-bold uppercase text-xs px-6 py-2.5 tracking-wider hover:bg-[#2A0710] border border-[#D8BD83]/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
