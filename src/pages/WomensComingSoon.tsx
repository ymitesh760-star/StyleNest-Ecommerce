import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8F0E2] text-[#32141B] font-sans">
      {/* Editorial Hero Container */}
      <div className="relative border-b border-[#D8BD83]/30 overflow-hidden">
        {/* Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span className="font-serif italic text-[18vw] text-[#4A0E1C]/[0.03] select-none font-bold leading-none">
            Femme
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 lg:py-28 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F2E6D2] border border-[#D8BD83]/60 rounded-none shadow-xs text-[#4A0E1C] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#4A0E1C]" />
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase">
              STYLENEST &times; DRIPPY &bull; Collection Privée
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl tracking-[-0.02em] uppercase text-[#32141B] leading-tight max-w-4xl mx-auto font-bold">
            A New Era of Elegance <br />
            <span className="italic font-normal text-[#4A0E1C] lowercase tracking-normal">
              is coming soon.
            </span>
          </h1>

          {/* Editorial Narrative */}
          <p className="text-xs sm:text-sm text-[#89786C] max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
            Our atelier is tailoring the inaugural STYLENEST &times; DRIPPY womenswear capsule. 
            Regal Indian couture embroideries, fluid raw silks, and relaxed street silhouettes crafted to redefine contemporary luxury.
          </p>

          {/* Waitlist Subscription Box */}
          <div className="max-w-md mx-auto mt-10">
            {isSubscribed ? (
              <div className="p-4 bg-[#F2E6D2] border border-[#D8BD83] shadow-sm flex items-center justify-center gap-3 text-xs text-[#32141B]">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span className="font-semibold">
                  You are registered on the VIP Private Guestlist. Check your inbox for private salon credentials.
                </span>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-[#89786C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-white border border-[#D8BD83]/50 pl-10 pr-3 py-3 text-xs text-[#32141B] placeholder:text-[#89786C] rounded-none focus:border-[#4A0E1C] outline-none transition-colors shadow-xs"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#4A0E1C] hover:bg-[#2A0710] text-[#F8F0E2] text-xs font-bold uppercase tracking-wider rounded-none shrink-0 transition-colors flex items-center justify-center gap-2 border border-[#D8BD83]/40"
                  >
                    <span>{isSubmitting ? 'Reserving...' : 'Join Private Waitlist'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#89786C] font-mono pt-1">
                  <ShieldCheck className="w-3 h-3 text-[#D8BD83]" />
                  <span>Exclusive 24-hour advance access prior to global runway release.</span>
                </div>
              </form>
            )}
          </div>

          {/* Return to Shopping Actions */}
          <div className="pt-12 flex flex-wrap items-center justify-center gap-4">
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#89786C] w-full sm:w-auto">
              Continue Shopping:
            </span>

            <Link
              to="/men"
              className="px-6 py-3 bg-[#4A0E1C] text-[#F8F0E2] text-xs font-bold uppercase tracking-wider hover:bg-[#2A0710] transition-all flex items-center gap-2 shadow-xs border border-[#D8BD83]/40"
            >
              <span>Discover Menswear</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D8BD83]" />
            </Link>

            <Link
              to="/shoes"
              className="px-6 py-3 bg-white border border-[#D8BD83]/50 text-[#32141B] text-xs font-bold uppercase tracking-wider hover:bg-[#F2E6D2] transition-all flex items-center gap-2"
            >
              <span>Explore Footwear</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D8BD83]" />
            </Link>

            <Link
              to="/perfumes"
              className="px-6 py-3 bg-white border border-[#D8BD83]/50 text-[#32141B] text-xs font-bold uppercase tracking-wider hover:bg-[#F2E6D2] transition-all flex items-center gap-2"
            >
              <span>Haute Parfumerie</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D8BD83]" />
            </Link>
          </div>

        </div>
      </div>

      {/* Editorial Teaser Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#4A0E1C] uppercase">
            Preview Lookbook
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl tracking-tight uppercase text-[#32141B] font-bold">
            The Atelier Preview
          </h2>
          <p className="text-xs text-[#89786C] max-w-lg mx-auto">
            A discreet glimpse into the sculptural silhouettes currently in creation at our Paris atelier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {previewLooks.map((look, idx) => (
            <div key={idx} className="group bg-[#FDFBF7] border border-[#D8BD83]/30 overflow-hidden shadow-xs hover:border-[#4A0E1C] transition-colors">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#EFE7D7]">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-[#2A0710]/90 backdrop-blur-sm text-[#D8BD83] text-[9px] font-mono uppercase tracking-widest border border-[#D8BD83]/30">
                  {look.note}
                </div>
              </div>

              <div className="p-5 space-y-1.5 border-t border-[#D8BD83]/20">
                <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#32141B]">
                  {look.title}
                </h3>
                <p className="text-xs text-[#89786C]">
                  {look.fabric}
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#4A0E1C] font-bold uppercase tracking-wider">
                  <span>Launching Autumn 2026</span>
                  <span className="text-[#D8BD83]">Privé Reservation Only</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
