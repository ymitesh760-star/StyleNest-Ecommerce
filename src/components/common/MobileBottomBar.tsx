import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Search, Heart, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { SearchModal } from './SearchModal';
import { CATEGORIES_DATA } from '../../data/products';

export const MobileBottomBar: React.FC = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesSheetOpen, setIsCategoriesSheetOpen] = useState(false);
  const location = useLocation();

  // Hide on checkout page so it doesn't obstruct form inputs
  if (location.pathname === '/checkout') {
    return null;
  }

  return (
    <>
      {/* Pinned Mobile Luxury Bottom Bar (Strictly for mobile & small tablets) */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#F8F0E2]/95 backdrop-blur-md border-t border-[#D8BD83]/35 shadow-[0_-4px_25px_rgba(74,14,28,0.06)] pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-1.5 transition-all"
      >
        <div className="max-w-md mx-auto px-4 flex items-center justify-around">
          {/* 1. Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 text-[10px] tracking-wider uppercase font-semibold transition-colors ${
                isActive ? 'text-[#4A0E1C] font-bold' : 'text-[#89786C] hover:text-[#4A0E1C]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Home className={`w-5 h-5 stroke-[1.75] ${isActive ? 'text-[#4A0E1C]' : ''}`} />
                <span className="text-[9px]">Home</span>
              </>
            )}
          </NavLink>

          {/* 2. Departments / Categories */}
          <button
            type="button"
            onClick={() => setIsCategoriesSheetOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] tracking-wider uppercase font-semibold text-[#89786C] hover:text-[#4A0E1C] transition-colors"
            aria-label="Explore Collections"
          >
            <Compass className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[9px]">Portfolios</span>
          </button>

          {/* 3. Global Search Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] tracking-wider uppercase font-semibold text-[#89786C] hover:text-[#4A0E1C] transition-colors"
            aria-label="Open search modal"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[9px]">Search</span>
          </button>

          {/* 4. Saved Wishlist */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 text-[10px] tracking-wider uppercase font-semibold relative transition-colors ${
                isActive ? 'text-[#4A0E1C]' : 'text-[#89786C] hover:text-[#4A0E1C]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Heart className={`w-5 h-5 stroke-[1.75] ${isActive ? 'text-[#4A0E1C] fill-[#4A0E1C]/20' : ''}`} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#4A0E1C] text-[#F8F0E2] text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-[9px]">Wishlist</span>
              </>
            )}
          </NavLink>

          {/* 5. Shopping Bag Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] tracking-wider uppercase font-semibold text-[#32141B] hover:text-[#4A0E1C] transition-colors relative"
            aria-label={`Shopping bag with ${itemCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#4A0E1C] text-[#D8BD83] text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-[#F8F0E2] shadow-xs">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold">Bag</span>
          </button>
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Categories Bottom Sheet Modal */}
      {isCategoriesSheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in" role="dialog" aria-modal="true">
          <div
            onClick={() => setIsCategoriesSheetOpen(false)}
            className="absolute inset-0 bg-[#2A0710]/60 backdrop-blur-sm"
          />
          <div className="absolute bottom-0 inset-x-0 bg-[#F8F0E2] rounded-t-2xl shadow-2xl p-6 pb-12 max-h-[85vh] overflow-y-auto animate-slide-up border-t border-[#D8BD83]/40">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8BD83]/30">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-[#4A0E1C] font-bold block">
                  Curated Universes
                </span>
                <h3 className="font-serif text-xl font-bold text-[#32141B]">
                  Explore StyleNest
                </h3>
              </div>
              <button
                onClick={() => setIsCategoriesSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F2E6D2] flex items-center justify-center text-[#89786C] hover:text-[#4A0E1C]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 pt-5">
              {CATEGORIES_DATA.filter((cat) => cat.id !== 'women').map((cat) => (
                <NavLink
                  key={cat.id}
                  to={`/${cat.id}`}
                  onClick={() => setIsCategoriesSheetOpen(false)}
                  className="group relative aspect-[4/5] rounded-none overflow-hidden bg-[#2A0710] border border-[#D8BD83]/30 flex flex-col justify-end p-3 text-white"
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A0710] via-[#2A0710]/40 to-transparent" />
                  <div className="relative z-10">
                    <span className="text-[8px] uppercase font-mono tracking-wider text-[#D8BD83] font-bold block">
                      {cat.subtitle}
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#F8F0E2]">
                      {cat.title}
                    </h4>
                  </div>
                </NavLink>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-[#D8BD83]/20 flex flex-col gap-2">
              <NavLink
                to="/new-arrivals"
                onClick={() => setIsCategoriesSheetOpen(false)}
                className="flex items-center justify-between px-4 py-3 bg-[#F2E6D2] hover:bg-white rounded-none text-xs font-semibold uppercase tracking-wider text-[#32141B] border border-[#D8BD83]/30"
              >
                <span>New Arrivals Autumn 2026</span>
                <span className="text-[#4A0E1C]">&rarr;</span>
              </NavLink>
              <NavLink
                to="/sale"
                onClick={() => setIsCategoriesSheetOpen(false)}
                className="flex items-center justify-between px-4 py-3 bg-[#4A0E1C] hover:bg-[#2A0710] rounded-none text-xs font-semibold uppercase tracking-wider text-[#F8F0E2] border border-[#D8BD83]/40"
              >
                <span>The Archive (Privileged Sale)</span>
                <span className="text-[#D8BD83]">&rarr;</span>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
