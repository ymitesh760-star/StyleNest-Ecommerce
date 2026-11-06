import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] bg-[#F8F0E2] flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-24 text-center">
        <span className="text-xs uppercase tracking-[0.22em] text-[#D8BD83] font-bold">404 Exception</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#32141B] mt-2 mb-4">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#89786C] max-w-md mx-auto mb-8">
          The destination you are seeking has retired to our seasonal archives or does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4A0E1C] text-[#F8F0E2] text-xs font-bold uppercase tracking-[0.14em] hover:bg-[#651C2D] transition-colors"
        >
          Return to Boutique
        </Link>
      </div>
    </div>
  );
};
