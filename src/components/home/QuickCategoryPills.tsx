import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, Tag } from 'lucide-react';

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
    <div className="w-full bg-[#F8F6F2] border-b border-black/10 py-3 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <span className="hidden lg:flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#0A0A0A] shrink-0 mr-2 border-r border-black/15 pr-3">
          <span>PORTFOLIOS</span>
        </span>

        {categories.map((c) => (
          <Link
            key={c.name}
            to={c.path}
            className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-xs border text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
              c.isSale
                ? 'bg-[#0A0A0A] text-white border-black'
                : 'bg-white text-[#0A0A0A] border-black/15 hover:border-black'
            }`}
          >
            <span className="text-[10px] font-bold">{c.name}</span>
            <span className="text-[9px] px-1.5 py-0.2 text-[#777777] font-normal border-l border-black/10 pl-1.5">
              {c.badge}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

