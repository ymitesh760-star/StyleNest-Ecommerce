import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const departments = [
    {
      id: 'men',
      title: 'MEN',
      tagline: 'Elevated everyday essentials.',
      cta: 'SHOP MEN',
      path: '/men',
      image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'shoes',
      title: 'FOOTWEAR',
      tagline: 'Artisanal Italian leather & boots.',
      cta: 'SHOP FOOTWEAR',
      path: '/shoes',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'perfumes',
      title: 'PARFUMS',
      tagline: 'Rare botanical niche extraits.',
      cta: 'DISCOVER SCENTS',
      path: '/perfumes',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'archive',
      title: 'THE ARCHIVE',
      tagline: 'Archival seasonal editions at courtesy prices.',
      cta: 'EXPLORE ARCHIVE',
      path: '/sale',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section id="category-portfolios" className="w-full bg-[#0A0A0A] text-white py-10 sm:py-14 border-y border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              to={dept.path}
              className="flex items-center gap-4 group p-2 rounded-xs hover:bg-white/5 transition-colors"
            >
              {/* Portrait Thumbnail */}
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xs overflow-hidden bg-neutral-900 shrink-0 border border-white/10 group-hover:border-white/40 transition-colors">
                <img
                  src={dept.image}
                  alt={dept.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Department Meta */}
              <div className="space-y-1">
                <h3 className="font-sans font-black text-sm sm:text-base tracking-wider uppercase text-white">
                  {dept.title}
                </h3>
                <p className="text-[11px] text-[#A3A3A3] line-clamp-2 font-light leading-snug">
                  {dept.tagline}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white group-hover:underline pt-1">
                  <span>{dept.cta}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
