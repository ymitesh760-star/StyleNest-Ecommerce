import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { subscribeNewsletter } from '../../services/newsletterService';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmed) {
      setError('Please provide an email address.');
      return;
    }

    if (!emailRegex.test(trimmed)) {
      setError('Please provide a valid email address (e.g. name@domain.com).');
      return;
    }

    setIsSubmitting(true);
    subscribeNewsletter(trimmed).then((res) => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      toast.luxury(
        'Welcome to STYLENEST × DRIPPY Privé',
        res.message || 'You have been enrolled in our private client circle. Your 20% privilege code is DRIPPY20.'
      );
    }).catch(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      toast.luxury(
        'Welcome to STYLENEST × DRIPPY Privé',
        'You have been enrolled in our private client circle. Your 20% privilege code is DRIPPY20.'
      );
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 my-6">
      <div className="bg-white border border-black/10 rounded-none p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-sm relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <span className="font-sans font-black text-5xl sm:text-6xl text-black/[0.03] select-none absolute -bottom-4 -right-4 pointer-events-none tracking-tighter">
          STYLENEST &times; DRIPPY
        </span>

        <div className="relative z-10 max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#991B1B]/10 text-[#991B1B] border border-[#991B1B]/25 rounded-none text-[10px] uppercase font-mono font-bold tracking-widest">
            <Sparkles className="w-3 h-3 text-[#991B1B]" />
            <span>VIP Collaboration Guestlist</span>
          </div>

          <h2 className="font-sans font-black text-2xl sm:text-4xl tracking-tight uppercase text-[#0A0A0A]">
            Join STYLENEST &times; DRIPPY Drop List
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            Receive private salon access to collaborative drops, exclusive couture releases, 
            and 20% off your inaugural acquisition with code <strong className="text-[#991B1B]">DRIPPY20</strong>.
          </p>

          {isSubscribed ? (
            <div className="p-4 bg-neutral-100 border border-neutral-300 rounded-none text-black text-xs flex items-center justify-center gap-2.5 animate-fade-in font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                You are enrolled in StyleNest updates. Your welcome code <strong>LUXE20</strong> is active for checkout.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email address"
                    className="w-full bg-[#ECEAE5] border border-black/10 pl-10 pr-3 py-3 text-xs text-[#0A0A0A] placeholder:text-neutral-500 rounded-none focus:border-black outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0A0A0A] hover:bg-neutral-800 text-white font-bold uppercase text-xs py-3 px-7 rounded-none shrink-0 transition-colors"
                >
                  {isSubmitting ? 'Enrolling...' : 'Subscribe'}
                </button>
              </div>
              {error && <p className="text-[11px] text-rose-500">{error}</p>}
            </form>
          )}

          <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Zero spam. Discreet communications only. Unsubscribe anytime.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
