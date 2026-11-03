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
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#F8F6F2]/95 backdrop-blur-md border-t border-black/15 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-1.5 transition-all"
      >
        <div className="max-w-md mx-auto px-4 flex items-center justify-around">
          {/* 1. Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 text-[10px] tracking-wider uppercase font-semibold transition-colors ${
                isActive ? 'text-[#0A0A0A] font-bold' : 'text-[#777777] hover:text-[#0A0A0A]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Home className={`w-5 h-5 stroke-[1.75] ${isActive ? 'text-[#0A0A0A]' : ''}`} />
                <span className="text-[9px]">Home</span>
              </>
            )}
          </NavLink>

          {/* 2. Departments / Categories */}
          <button
            type="button"
            onClick={() => setIsCategoriesSheetOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] tracking-wider uppercase font-semibold text-[#777777] hover:text-[#0A0A0A] transition-colors"
            aria-label="Explore Collections"
          >
            <Compass className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[9px]">Portfolios</span>
          </button>

          {/* 3. Global Search Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] tracking-wider uppercase font-semibold text-[#777777] hover:text-[#0A0A0A] transition-colors"
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
                isActive ? 'text-[#B99A6B]' : 'text-[#777777] hover:text-[#0A0A0A]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Heart className={`w-5 h-5 stroke-[1.75] ${isActive ? 'text-[#B99A6B] fill-[#B99A6B]/20' : ''}`} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#0A0A0A] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white">
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
            className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] tracking-wider uppercase font-semibold text-[#0A0A0A] hover:text-[#B99A6B] transition-colors relative"
            aria-label={`Shopping bag with ${itemCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#B99A6B] text-[#0A0A0A] text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white shadow-xs">
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
            className="absolute inset-0 bg-[#0A0A0A]/60 backdrop-blur-sm"
          />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl shadow-2xl p-6 pb-12 max-h-[85vh] overflow-y-auto animate-slide-up border-t border-[rgba(185,154,107,0.3)]">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(185,154,107,0.2)]">
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#B99A6B] font-bold block">
                  Curated Universes
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-[#0A0A0A]">
                  Explore StyleNest
                </h3>
              </div>
              <button
                onClick={() => setIsCategoriesSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F8F6F2] flex items-center justify-center text-[#777777] hover:text-[#0A0A0A]"
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
                  className="group relative aspect-[4/5] rounded-sm overflow-hidden bg-[#0A0A0A] border border-[rgba(185,154,107,0.2)] flex flex-col justify-end p-3 text-white"
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                  <div className="relative z-10">
                    <span className="text-[8px] uppercase tracking-wider text-[#B99A6B] font-bold block">
                      {cat.subtitle}
                    </span>
                    <h4 className="font-serif-luxury text-base font-bold text-[#F8F6F2]">
                      {cat.title}
                    </h4>
                  </div>
                </NavLink>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-[rgba(185,154,107,0.15)] flex flex-col gap-2">
              <NavLink
                to="/new-arrivals"
                onClick={() => setIsCategoriesSheetOpen(false)}
                className="flex items-center justify-between px-4 py-3 bg-[#F8F6F2] hover:bg-[#F8F6F2]/80 rounded-sm text-xs font-semibold uppercase tracking-wider text-[#0A0A0A]"
              >
                <span>New Arrivals Autumn 2026</span>
                <span className="text-[#B99A6B]">&rarr;</span>
              </NavLink>
              <NavLink
                to="/sale"
                onClick={() => setIsCategoriesSheetOpen(false)}
                className="flex items-center justify-between px-4 py-3 bg-[#171717] hover:bg-[#0A0A0A] rounded-sm text-xs font-semibold uppercase tracking-wider text-[#B99A6B]"
              >
                <span>The Archive (Privileged Sale)</span>
                <span>&rarr;</span>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

