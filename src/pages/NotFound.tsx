import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-24 text-center">
      <span className="text-xs uppercase tracking-widest-luxury text-elan-gold font-bold">404 Exception</span>
      <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-elan-950 mt-2 mb-4">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-elan-500 max-w-md mx-auto mb-8">
        The destination you are seeking has retired to our seasonal archives or does not exist.
      </p>
      <Link to="/" className="btn-primary py-3.5 px-8">
        Return to Boutique
      </Link>
    </div>
  );
};
