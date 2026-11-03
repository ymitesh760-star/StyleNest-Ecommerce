import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Lock } from 'lucide-react';

export const TrustBadgesSection: React.FC = () => {
  return (
    <section className="bg-[#F8F6F2] border-y border-black/10 py-10 sm:py-12 my-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          {/* 1. Fast Delivery */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-[#0A0A0A] shrink-0">
              <Truck className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0A0A0A]">
                Fast Delivery
              </h4>
              <p className="text-[10px] text-[#666666] mt-0.5">
                Quick & safe delivery
              </p>
            </div>
          </div>

          {/* 2. Easy Returns */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-[#0A0A0A] shrink-0">
              <RotateCcw className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0A0A0A]">
                Easy Returns
              </h4>
              <p className="text-[10px] text-[#666666] mt-0.5">
                Within 14 days
              </p>
            </div>
          </div>

          {/* 3. Quality Assured */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-[#0A0A0A] shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0A0A0A]">
                Quality Assured
              </h4>
              <p className="text-[10px] text-[#666666] mt-0.5">
                Best fashion, best quality
              </p>
            </div>
          </div>

          {/* 4. Secure Payment */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-[#0A0A0A] shrink-0">
              <Lock className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0A0A0A]">
                Secure Payment
              </h4>
              <p className="text-[10px] text-[#666666] mt-0.5">
                100% secure checkout
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
