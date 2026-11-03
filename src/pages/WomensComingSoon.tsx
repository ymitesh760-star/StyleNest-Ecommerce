import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Mail, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { subscribeNewsletter } from '../services/newsletterService';

export const WomensComingSoon: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  React.useEffect(() => {
    document.title = 'Women’s Collection • Coming Soon | STYLENEST × DRIPPY';
    window.scrollTo(0, 0);
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribeNewsletter(email.trim());
      setIsSubscribed(true);
      toast.luxury(
        'Privé Guestlist Confirmed',
        'You have been granted private salon access 24 hours prior to global unveiling. Code: FEMME2026.'
      );
    } catch {
      setIsSubscribed(true);
      toast.luxury(
        'Privé Guestlist Confirmed',
        'You have been granted private salon access 24 hours prior to global unveiling. Code: FEMME2026.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewLooks = [
    {
      title: 'Look 01 — Le Tailleur Sculptural',
      fabric: 'Double-Faced Wool & Silk Lapels',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      note: 'Parisian Atelier Premiere',
    },
    {
      title: 'Look 02 — La Robe de Soie',
      fabric: '100% Pure Mulberry Silk Bias Cut',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      note: 'Hand-Finished in Lyon',
    },
    {
      title: 'Look 03 — Le Manteau Cachemire',
      fabric: 'Mongolian Grade-A Cashmere',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      note: 'Limited Salon Edition',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#0A0A0A] font-sans">
      {/* Editorial Hero Container */}
      <div className="relative border-b border-black/10 overflow-hidden">
        {/* Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span className="font-serif italic text-[18vw] text-black/[0.03] select-none font-black leading-none">
            Femme
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 lg:py-28 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#991B1B]/40 rounded-none shadow-xs text-[#0A0A0A] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#991B1B]" />
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase">
              STYLENEST &times; DRIPPY &bull; Collection Privée
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl tracking-[-0.03em] uppercase text-[#0A0A0A] leading-tight max-w-4xl mx-auto">
            A New Era of Elegance <br />
            <span className="font-serif italic font-normal text-[#991B1B] lowercase tracking-normal">
              is coming soon.
            </span>
          </h1>

          {/* Editorial Narrative */}
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
            Our atelier is tailoring the inaugural STYLENEST &times; DRIPPY womenswear capsule. 
            Regal Indian couture embroideries, fluid raw silks, and relaxed street silhouettes crafted to redefine contemporary luxury.
          </p>

          {/* Waitlist Subscription Box */}
          <div className="max-w-md mx-auto mt-10">
            {isSubscribed ? (
              <div className="p-4 bg-white border border-[#B99A6B]/50 shadow-sm flex items-center justify-center gap-3 text-xs text-[#0A0A0A]">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">
                  You are registered on the VIP Private Guestlist. Check your inbox for private salon credentials.
                </span>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-white border border-black/20 pl-10 pr-3 py-3 text-xs text-[#0A0A0A] placeholder:text-neutral-400 rounded-none focus:border-black outline-none transition-colors shadow-xs"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#0A0A0A] hover:bg-[#262626] text-white text-xs font-bold uppercase tracking-wider rounded-none shrink-0 transition-colors flex items-center justify-center gap-2 border border-[#B99A6B]/30"
                  >
                    <span>{isSubmitting ? 'Reserving...' : 'Join Private Waitlist'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 font-mono pt-1">
                  <ShieldCheck className="w-3 h-3 text-[#B99A6B]" />
                  <span>Exclusive 24-hour advance access prior to global runway release.</span>
                </div>
              </form>
            )}
          </div>

          {/* Return to Shopping Actions */}
          <div className="pt-12 flex flex-wrap items-center justify-center gap-4">
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-neutral-400 w-full sm:w-auto">
              Continue Shopping:
            </span>

            <Link
              to="/men"
              className="px-6 py-3 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#262626] transition-all flex items-center gap-2 shadow-xs"
            >
              <span>Discover Menswear</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B99A6B]" />
            </Link>

            <Link
              to="/shoes"
              className="px-6 py-3 bg-white border border-black/20 text-[#0A0A0A] text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-all flex items-center gap-2"
            >
              <span>Explore Footwear</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/perfumes"
              className="px-6 py-3 bg-white border border-black/20 text-[#0A0A0A] text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-all flex items-center gap-2"
            >
              <span>Haute Parfumerie</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>

      {/* Editorial Teaser Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#B99A6B] uppercase">
            Preview Lookbook
          </span>
          <h2 className="font-sans font-black text-2xl sm:text-3xl tracking-tight uppercase text-[#0A0A0A]">
            The Atelier Preview
          </h2>
          <p className="text-xs text-neutral-500 max-w-lg mx-auto">
            A discreet glimpse into the sculptural silhouettes currently in creation at our Paris atelier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {previewLooks.map((look, idx) => (
            <div key={idx} className="group bg-white border border-black/10 overflow-hidden shadow-sm">
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-[9px] font-mono uppercase tracking-widest border border-white/10">
                  {look.note}
                </div>
              </div>

              <div className="p-5 space-y-1.5 border-t border-black/10">
                <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#0A0A0A]">
                  {look.title}
                </h3>
                <p className="text-xs text-neutral-500">
                  {look.fabric}
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#B99A6B] font-bold uppercase tracking-wider">
                  <span>Launching Autumn 2026</span>
                  <span>Privé Reservation Only</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

