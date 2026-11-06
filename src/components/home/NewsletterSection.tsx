import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
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
    <section className="max-w-7xl mx-auto px-4 sm:px-8 my-8">
      <div className="bg-[#F8F0E2] border border-[#D8BD83]/50 rounded-none p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-md relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <span className="font-serif italic text-6xl sm:text-7xl text-[#4A0E1C]/[0.04] select-none absolute -bottom-6 -right-6 pointer-events-none tracking-tight">
          STYLENEST &times; DRIPPY
        </span>

        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2E6D2] text-[#4A0E1C] border border-[#D8BD83]/60 rounded-none text-[10px] uppercase font-mono font-bold tracking-widest">
            <Sparkles className="w-3 h-3 text-[#4A0E1C]" />
            <span>VIP Collaboration Guestlist</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl tracking-tight uppercase text-[#32141B] font-bold">
            Join STYLENEST &times; DRIPPY Drop List
          </h2>

          <p className="text-xs sm:text-sm text-[#89786C] leading-relaxed font-normal">
            Receive private salon access to collaborative drops, exclusive couture releases, 
            and 20% off your inaugural acquisition with code <strong className="text-[#4A0E1C] font-semibold">DRIPPY20</strong>.
          </p>

          {isSubscribed ? (
            <div className="p-4 bg-[#F2E6D2] border border-[#D8BD83] text-[#32141B] text-xs font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4A0E1C]" />
              <span>Privé membership confirmed. Welcome to the circle.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your private email address"
                  className="flex-1 px-4 py-3 bg-white border border-[#D8BD83]/60 text-xs text-[#32141B] placeholder-[#89786C] focus:outline-none focus:border-[#4A0E1C] transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#4A0E1C] hover:bg-[#2A0710] text-[#F8F0E2] text-xs font-bold uppercase tracking-[0.2em] border border-[#D8BD83]/40 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Enrolling...' : 'Join Privé'}
                </button>
              </div>
              {error && <p className="text-[11px] text-rose-600 text-left">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
