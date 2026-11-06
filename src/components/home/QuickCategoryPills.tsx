import React from 'react';
import { Link } from 'react-router-dom';

export const QuickCategoryPills: React.FC = () => {
  const categories = [
    { name: 'All Collections', path: '/men', icon: '✨', badge: 'Curated' },
    { name: "Men's Tailoring", path: '/men', icon: '👔', badge: 'Atelier' },
    { name: 'Artisanal Footwear', path: '/shoes', icon: '👞', badge: 'Italian Leather' },
    { name: 'Haute Parfumerie', path: '/perfumes', icon: '✨', badge: 'Grasse Extraits' },
    { name: 'New Arrivals 2026', path: '/new-arrivals', icon: '🔥', badge: 'Just In', isHot: true },
    { name: 'The Archive', path: '/sale', icon: '🏷️', badge: '20% Off', isSale: true },
  ];

  return (
    <div className="w-full bg-[#F2E6D2]/60 border-b border-[#D8BD83]/30 py-3.5 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1">
        <span className="hidden lg:flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold tracking-[0.25em] text-[#4A0E1C] shrink-0 mr-2 border-r border-[#D8BD83]/40 pr-3">
          <span>PORTFOLIOS</span>
        </span>

        {categories.map((c) => (
          <Link
            key={c.name}
            to={c.path}
            className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 border text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
              c.isSale
                ? 'bg-[#4A0E1C] text-[#F8F0E2] border-[#D8BD83]/50 hover:bg-[#2A0710]'
                : 'bg-[#F8F0E2] text-[#32141B] border-[#D8BD83]/40 hover:border-[#4A0E1C] hover:bg-white shadow-xs'
            }`}
          >
            <span className="text-[10px] font-bold tracking-wider">{c.name}</span>
            <span className={`text-[9px] px-1.5 py-0.2 font-normal border-l pl-1.5 ${
              c.isSale ? 'border-[#D8BD83]/30 text-[#D8BD83]' : 'border-[#D8BD83]/40 text-[#89786C]'
            }`}>
              {c.badge}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
