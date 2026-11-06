import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Search, Heart, ShoppingBag, User, Menu, X, ShieldAlert,
  Sparkles, ArrowRight, ChevronDown, PhoneCall
} from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { SearchModal } from './SearchModal';
import { BrandLogo } from './BrandLogo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES_DATA } from '../../data/products';

interface MegaMenuCategory {
  title: string;
  subtitle: string;
  path: string;
  featuredImage: string;
  featuredTitle: string;
  featuredTagline: string;
  subcategories: { name: string; path: string }[];
  highlights: { name: string; path: string }[];
}

const MEGA_MENUS: Record<string, MegaMenuCategory> = {
  men: {
    title: "Men's Collection",
    subtitle: "Architectural Tailoring & Everyday Foundations",
    path: '/men',
    featuredImage: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80',
    featuredTitle: 'Italian Wool Overcoat',
    featuredTagline: 'Double-faced virgin wool in rich camel tone.',
    subcategories: [
      { name: 'Overcoats & Jackets', path: '/men?sub=Jackets' },
      { name: 'Tailored Shirts', path: '/men?sub=Shirts' },
      { name: 'Selvedge Denim', path: '/men?sub=Pants' },
      { name: 'Cashmere Knitwear', path: '/men?sub=Knitwear' },
    ],
    highlights: [
      { name: 'New Arrivals 2026', path: '/new-arrivals' },
      { name: 'Bespoke Atelier Tailoring', path: '/men' },
      { name: 'Complimentary Alterations', path: '/men' },
    ],
  },
  women: {
    title: "Women's Collection",
    subtitle: "Fluid Silhouettes & Modern Elegance",
    path: '/women',
    featuredImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    featuredTitle: 'Silk Slip Gown',
    featuredTagline: '100% mulberry silk with bias-cut drape.',
    subcategories: [
      { name: 'Evening & Day Dresses', path: '/women?sub=Dresses' },
      { name: 'Structured Blazers', path: '/women?sub=Jackets' },
      { name: 'Silk Blouses', path: '/women?sub=Tops' },
      { name: 'Pleated Trousers', path: '/women?sub=Trousers' },
    ],
    highlights: [
      { name: 'Autumn / Winter Lookbook', path: '/women' },
      { name: 'Private Salon Capsule', path: '/new-arrivals' },
      { name: 'Curated Wardrobe Sets', path: '/women' },
    ],
  },
  shoes: {
    title: 'Artisanal Footwear',
    subtitle: 'Hand-Lasted Leather & Minimalist Silhouettes',
    path: '/shoes',
    featuredImage: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    featuredTitle: 'Artisan Calfskin Sneaker',
    featuredTagline: 'Handcrafted full-grain Italian leather.',
    subcategories: [
      { name: 'Minimalist Sneakers', path: '/shoes?sub=Sneakers' },
      { name: 'Chelsea & Dress Boots', path: '/shoes?sub=Boots' },
      { name: 'Goodyear Oxford Brogues', path: '/shoes?sub=Formal' },
      { name: 'Suede Belgian Loafers', path: '/shoes?sub=Loafers' },
    ],
    highlights: [
      { name: 'Goodyear Welt Construction', path: '/shoes' },
      { name: 'Shoe Care & Cedar Trees', path: '/shoes' },
      { name: 'Bespoke Sizing Guide', path: '/shoes' },
    ],
  },
  perfumes: {
    title: 'Haute Parfumerie',
    subtitle: 'Rare Extraits de Parfum & Bespoke Niche Accords',
    path: '/perfumes',
    featuredImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    featuredTitle: 'Santal Impérial Extrait',
    featuredTagline: 'Aged Mysore sandalwood, cardamom & amber resin.',
    subcategories: [
      { name: 'Woody & Smoky Extraits', path: '/perfumes?sub=Woody' },
      { name: 'Floral & Rose Absolutes', path: '/perfumes?sub=Floral' },
      { name: 'Fresh Marine & Bergamot', path: '/perfumes?sub=Fresh' },
      { name: 'Oriental Amber & Oud', path: '/perfumes?sub=Oriental' },
    ],
    highlights: [
      { name: '30ml / 50ml / 100ml Decants', path: '/perfumes' },
      { name: 'Complimentary Discovery Vials', path: '/perfumes' },
      { name: 'Master Perfumer Scent Quiz', path: '/perfumes' },
    ],
  },
};

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { itemCount, subtotal, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
  }, [location.pathname]);

  // Handle scroll effect for compact luxury navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Escape key to close open overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setActiveMegaMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseEnter = (key: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    if (MEGA_MENUS[key]) {
      setActiveMegaMenu(key);
    } else {
      setActiveMegaMenu(null);
    }
  };

  const handleMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 200);
  };

  const navLinks = [
    { name: 'Men', path: '/men', key: 'men' },
    { name: 'Footwear', path: '/shoes', key: 'shoes' },
    { name: 'Haute Parfumerie', path: '/perfumes', key: 'perfumes' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'The Archive', path: '/sale', isSpecial: true },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full transition-all duration-300"
        onMouseLeave={handleMouseLeave}
      >
        {/* Top Announcement Bar */}
        <AnnouncementBar />

        {/* Desktop & Mobile Main Header */}
        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? 'bg-[#F8F0E2]/95 backdrop-blur-md shadow-sm border-b border-[#D8BD83]/30'
              : 'bg-[#F8F0E2] border-b border-[#D8BD83]/20'
          }`}
          role="navigation"
          aria-label="Main Navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            {/* Row 1: Boutique Masthead (Left Concierge/Menu, Center BrandLogo, Right Utilities) */}
            <div className={`flex items-center justify-between transition-all duration-300 relative ${
              isScrolled ? 'py-3 sm:py-3.5' : 'py-4 sm:py-5'
            }`}>
              {/* Left: Mobile Hamburger or Desktop Concierge Service */}
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 -ml-2 text-[#32141B] hover:text-[#4A0E1C] transition-colors"
                  aria-label="Open mobile menu"
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="hidden lg:flex items-center gap-4 text-[11px] text-[#89786C] font-medium tracking-wide">
                  <span className="inline-flex items-center gap-1.5 font-mono uppercase text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8BD83] animate-pulse" />
                    Maison Privé Concierge
                  </span>
                  <span className="text-[#D8BD83]/40">|</span>
                  <span className="uppercase tracking-wider-luxury text-[10px] text-[#89786C]">
                    Complimentary White-Glove Delivery
                  </span>
                </div>
              </div>

              {/* Dead Center Brand Logo & Wordmark (Guaranteed True Center) */}
              <div className="shrink-0 text-center">
                <BrandLogo layout="horizontal" size={isScrolled ? 'sm' : 'md'} variant="dark" />
              </div>

              {/* Right: Luxury Action Suite */}
              <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 flex-1">
                {/* Search Button with Quick Pill */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2E6D2] hover:bg-[#EAE1D5] border border-[#D8BD83]/40 text-[#32141B] text-xs transition-colors"
                  aria-label="Search creations"
                >
                  <Search className="w-3.5 h-3.5 text-[#4A0E1C]" />
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Search</span>
                </button>

                {/* Search Icon for Mobile */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="md:hidden p-2 text-[#32141B] hover:text-[#4A0E1C] transition-colors"
                  aria-label="Search creations"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Store Director Link (if admin) */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-[#4A0E1C] text-[#F8F0E2] border border-[#D8BD83]/40 rounded text-[10px] font-semibold uppercase tracking-wider-luxury hover:bg-[#2A0710] transition-colors shadow-xs"
                    title="Store Director Atelier Portal"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-[#D8BD83]" />
                    <span>Director Atelier</span>
                  </Link>
                )}

                {/* Client Account */}
                <Link
                  to="/account"
                  className="p-2 text-[#32141B] hover:text-[#4A0E1C] transition-colors relative rounded-full hover:bg-[#F2E6D2]/60"
                  aria-label="Client Account"
                  title={user ? `Signed in as ${user.name}` : 'Maison Privé Client Portal'}
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  {user && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4A0E1C] ring-2 ring-[#F8F0E2]" />
                  )}
                </Link>

                {/* Saved Wishlist */}
                <Link
                  to="/wishlist"
                  className="p-2 text-[#32141B] hover:text-[#4A0E1C] transition-colors relative rounded-full hover:bg-[#F2E6D2]/60"
                  aria-label={`Saved Wishlist with ${wishlistCount} items`}
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#4A0E1C] text-[#F8F0E2] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#F8F0E2] animate-fade-in">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Shopping Bag with Subtotal Pill */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-2 pl-3 pr-3.5 py-1.5 bg-[#4A0E1C] hover:bg-[#2A0710] text-[#F8F0E2] border border-[#D8BD83]/40 rounded-xs transition-all shadow-xs group"
                  aria-label={`Shopping bag with ${itemCount} items`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#D8BD83] group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-bold tracking-wider">{itemCount}</span>
                  {subtotal > 0 && (
                    <span className="hidden sm:inline-block text-[11px] font-semibold text-[#F8F0E2] border-l border-white/20 pl-2 transition-colors">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Row 2: Desktop Editorial Navigation Links (Dead-Centered) */}
            <div className={`hidden lg:flex items-center justify-center gap-8 xl:gap-10 border-t border-[#D8BD83]/20 transition-all duration-300 ${
              isScrolled ? 'py-2 text-[11px]' : 'py-2.5 sm:py-3 text-xs'
            }`}>
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  onMouseEnter={() => link.key && handleMouseEnter(link.key)}
                  className="relative py-1"
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `tracking-[0.24em] uppercase font-semibold transition-all duration-200 relative py-1 flex items-center gap-1 group ${
                        link.isSpecial
                          ? 'text-[#651C2D] hover:text-[#4A0E1C] font-bold'
                          : isActive
                          ? 'text-[#4A0E1C] font-bold'
                          : 'text-[#32141B]/80 hover:text-[#4A0E1C]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{link.name}</span>
                        {/* Animated Champagne Gold Underline */}
                        <span
                          className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D8BD83] transition-transform duration-300 origin-left ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                        {link.key && (
                          <ChevronDown
                            className={`w-3 h-3 text-[#D8BD83] opacity-70 group-hover:opacity-100 transition-transform duration-200 ${
                              activeMegaMenu === link.key ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* ==================================================== */}
        {/* Luxury Mega Menu Overlay (Desktop) */}
        {/* ==================================================== */}
        {activeMegaMenu && MEGA_MENUS[activeMegaMenu] && (
          <div
            onMouseEnter={() => handleMouseEnter(activeMegaMenu)}
            onMouseLeave={handleMouseLeave}
            className="hidden lg:block absolute top-full left-0 w-full bg-[#F8F0E2] border-b border-[#D8BD83]/30 shadow-luxury animate-fade-in z-30"
          >
            <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8 items-start">
              {/* Column 1: Category Info */}
              <div className="col-span-3 border-r border-[#D8BD83]/20 pr-6 space-y-3">
                <span className="text-[10px] uppercase tracking-widest-luxury text-[#D8BD83] font-bold block font-mono">
                  Curated Collection
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#32141B]">
                  {MEGA_MENUS[activeMegaMenu].title}
                </h3>
                <p className="text-xs text-[#89786C] leading-relaxed">
                  {MEGA_MENUS[activeMegaMenu].subtitle}
                </p>
                <Link
                  to={MEGA_MENUS[activeMegaMenu].path}
                  className="btn-primary py-2 px-4 text-[10px] inline-flex items-center gap-1.5"
                >
                  <span>Explore Department</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D8BD83]" />
                </Link>
              </div>

              {/* Column 2: Categories List */}
              <div className="col-span-3 space-y-2">
                <span className="text-[10px] uppercase tracking-widest-luxury text-[#4A0E1C] font-bold block mb-3 font-mono">
                  Silhouettes & Accords
                </span>
                <ul className="space-y-2 text-xs">
                  {MEGA_MENUS[activeMegaMenu].subcategories.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        to={sub.path}
                        className="text-[#32141B]/80 hover:text-[#4A0E1C] hover:translate-x-1 transition-all inline-block py-0.5"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Atelier Highlights */}
              <div className="col-span-3 space-y-2">
                <span className="text-[10px] uppercase tracking-widest-luxury text-[#4A0E1C] font-bold block mb-3 font-mono">
                  Atelier Highlights
                </span>
                <ul className="space-y-2 text-xs">
                  {MEGA_MENUS[activeMegaMenu].highlights.map((h) => (
                    <li key={h.name}>
                      <Link
                        to={h.path}
                        className="text-[#89786C] hover:text-[#4A0E1C] transition-colors inline-flex items-center gap-1.5 py-0.5"
                      >
                        <Sparkles className="w-3 h-3 text-[#D8BD83]" />
                        <span>{h.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Featured Preview Card */}
              <div className="col-span-3 bg-[#F2E6D2] p-4 rounded-sm border border-[#D8BD83]/30 flex gap-3.5 items-center">
                <img
                  src={MEGA_MENUS[activeMegaMenu].featuredImage}
                  alt={MEGA_MENUS[activeMegaMenu].featuredTitle}
                  className="w-20 h-24 object-cover rounded-xs shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-[#D8BD83] font-bold block font-mono">
                    Editor's Selection
                  </span>
                  <h4 className="font-serif text-sm font-bold text-[#32141B]">
                    {MEGA_MENUS[activeMegaMenu].featuredTitle}
                  </h4>
                  <p className="text-[11px] text-[#89786C] line-clamp-2">
                    {MEGA_MENUS[activeMegaMenu].featuredTagline}
                  </p>
                  <Link
                    to={MEGA_MENUS[activeMegaMenu].path}
                    className="text-[10px] uppercase tracking-wider font-bold text-[#4A0E1C] hover:text-[#2A0710] inline-block pt-1"
                  >
                    View Piece &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Slide-in Drawer Menu (Full Experience on Phone) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-[#0A0A0A]/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer content */}
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-[#FFFFFF] shadow-2xl flex flex-col justify-between p-6 transform transition-transform duration-300 overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[rgba(185,154,107,0.22)]">
                <BrandLogo layout="horizontal" size="sm" variant="dark" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-[#777777] hover:text-[#0A0A0A] rounded-full hover:bg-[#F8F6F2] transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links with Category Thumbnails */}
              <div className="py-5 space-y-2">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#D8BD83] font-bold block mb-3 font-mono">
                  Main Portfolios
                </span>

                <NavLink
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-2.5 px-3 rounded text-xs uppercase tracking-wider font-bold ${
                      isActive ? 'bg-[#F2E6D2] text-[#4A0E1C]' : 'text-[#32141B] hover:bg-[#F2E6D2]'
                    }`
                  }
                >
                  <span>Boutique Home</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D8BD83]" />
                </NavLink>

                {CATEGORIES_DATA.filter((cat) => cat.id !== 'women').map((cat) => (
                  <NavLink
                    key={cat.id}
                    to={`/${cat.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between py-2.5 px-3 rounded text-xs uppercase tracking-wider font-bold transition-colors ${
                        isActive ? 'bg-[#F2E6D2] text-[#4A0E1C]' : 'text-[#32141B] hover:bg-[#F2E6D2]'
                      }`
                    }
                  >
                    <span>{cat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D8BD83]" />
                  </NavLink>
                ))}

                <NavLink
                  to="/new-arrivals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded text-xs uppercase tracking-wider font-bold text-[#32141B] hover:bg-[#F2E6D2]"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D8BD83]" />
                    <span>New Arrivals 2026</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D8BD83]" />
                </NavLink>

                <NavLink
                  to="/sale"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded text-xs uppercase tracking-wider font-bold text-[#4A0E1C] hover:bg-[#4A0E1C] hover:text-[#F8F0E2] transition-colors"
                >
                  <span>The Archive (Sale)</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#4A0E1C] text-[#D8BD83] rounded font-bold">20% Off</span>
                </NavLink>
              </div>

              {/* Client Services & Concierge */}
              <div className="pt-4 border-t border-[#D8BD83]/20 space-y-2">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#89786C] font-bold block mb-2 font-mono">
                  Client Privé
                </span>

                <NavLink
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-xs text-[#32141B] hover:text-[#4A0E1C]"
                >
                  <User className="w-4 h-4 text-[#D8BD83]" />
                  <span>{user ? `Account (${user.name})` : 'Sign In to Privé'}</span>
                </NavLink>

                <NavLink
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-xs text-[#32141B] hover:text-[#4A0E1C]"
                >
                  <Heart className="w-4 h-4 text-[#D8BD83]" />
                  <span>Saved Wishlist ({wishlistCount})</span>
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-xs text-[#4A0E1C] font-bold"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#D8BD83]" />
                    <span>Store Director Management</span>
                  </NavLink>
                )}
              </div>
            </div>

            {/* Bottom: Concierge Contact */}
            <div className="pt-6 border-t border-[#D8BD83]/20">
              <p className="text-[10px] uppercase tracking-wider text-[#89786C] font-mono">
                StyleNest Concierge
              </p>
              <p className="font-serif text-sm font-bold text-[#32141B] mt-0.5">
                concierge@stylenest.com
              </p>
              <p className="text-[10px] text-[#89786C] mt-1 font-light">
                Complimentary White-Glove Support
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
