import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Lock } from 'lucide-react';

export const TrustBadgesSection: React.FC = () => {
  return (
    <section className="bg-[#F2E6D2]/50 border-y border-[#D8BD83]/30 py-10 sm:py-12 my-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          {/* 1. Fast Delivery */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-none border border-[#D8BD83] bg-[#F8F0E2] flex items-center justify-center text-[#4A0E1C] shrink-0 shadow-xs">
              <Truck className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#32141B]">
                Fast Delivery
              </h4>
              <p className="text-[10px] text-[#89786C] mt-0.5">
                Complimentary white-glove courier
              </p>
            </div>
          </div>

          {/* 2. Easy Returns */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-none border border-[#D8BD83] bg-[#F8F0E2] flex items-center justify-center text-[#4A0E1C] shrink-0 shadow-xs">
              <RotateCcw className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#32141B]">
                14-Day Returns
              </h4>
              <p className="text-[10px] text-[#89786C] mt-0.5">
                Effortless doorstep exchange
              </p>
            </div>
          </div>

          {/* 3. Quality Assured */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-none border border-[#D8BD83] bg-[#F8F0E2] flex items-center justify-center text-[#4A0E1C] shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#32141B]">
                Artisanal Quality
              </h4>
              <p className="text-[10px] text-[#89786C] mt-0.5">
                Handcrafted Italian & Indian silks
              </p>
            </div>
          </div>

          {/* 4. Secure Payment */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-none border border-[#D8BD83] bg-[#F8F0E2] flex items-center justify-center text-[#4A0E1C] shrink-0 shadow-xs">
              <Lock className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#32141B]">
                Encrypted Checkout
              </h4>
              <p className="text-[10px] text-[#89786C] mt-0.5">
                256-bit bank-grade encryption
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
