import React from 'react';
import { Link } from 'react-router-dom';

export interface BrandLogoProps {
  layout?: 'horizontal' | 'stacked' | 'compact' | 'monogram';
  variant?: 'dark' | 'light' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  asLink?: boolean;
}

/**
 * Minimal Ornamental Indian Couture Crest
 * Combines delicate royal lotus filigree, mughal arch symmetry, and couture jewel points.
 */
export const CoutureOrnamentalCrest: React.FC<{
  size?: number;
  className?: string;
  color?: string;
  accentColor?: string;
}> = ({ size = 28, className = '', color = 'currentColor', accentColor = '#B99A6B' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Central Royal Diamond / Bindu */}
      <circle cx="20" cy="5" r="1.5" fill={accentColor} />
      
      {/* Upper Lotus Finial */}
      <path
        d="M20 7.5C18.8 11.5 15.5 13.5 12.5 14C15.5 15.5 18 18 20 22C22 18 24.5 15.5 27.5 14C24.5 13.5 21.2 11.5 20 7.5Z"
        fill={color}
        fillOpacity="0.9"
      />

      {/* Side Filigree Petals */}
      <path
        d="M12.5 14C9.5 14.5 7 17 6.5 20.5C9.5 20 12 18.5 13.5 16.5"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M27.5 14C30.5 14.5 33 17 33.5 20.5C30.5 20 28 18.5 26.5 16.5"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Regal Mughal Arch Base */}
      <path
        d="M8 26C12 23 16 23.5 20 26C24 23.5 28 23 32 26"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      
      {/* Lower Foundation Symmetry */}
      <path
        d="M13 29C16.5 28 20 31 20 34C20 31 23.5 28 27 29"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="35.5" r="1.2" fill={accentColor} />
    </svg>
  );
};

/**
 * Expressive Dark Red Streetwear Graffiti/Brush Wordmark for "DRIPPY"
 * High-impact urban typography with street-culture drip accents.
 */
export const DrippyWordmark: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'gold';
}> = ({ className = '', size = 'md', variant = 'dark' }) => {
  // Size heights
  const heights = {
    sm: 18,
    md: 24,
    lg: 32,
    xl: 44,
  };

  const h = heights[size];
  const w = Math.round(h * 3.6);

  // Deep rich dark red palette inspired by streetwear graffiti
  const dripRed = variant === 'light' ? '#EF4444' : '#991B1B';

  return (
    <span className={`inline-flex items-center select-none ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 180 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        aria-label="DRIPPY Streetwear"
      >
        <defs>
          <filter id="drippyShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="1" dy="1.5" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* DRIPPY Graffiti Brush Wordmark Group */}
        <g filter="url(#drippyShadow)">
          {/* Letter D */}
          <path
            d="M8 8H26C36 8 41 14 41 24C41 34 35 42 24 42H8V8ZM18 16V34H24C30 34 32 29 32 24C32 19 29 16 23 16H18Z"
            fill={dripRed}
          />
          {/* Subtle Drip on D stem */}
          <path
            d="M8 42C7 45 8.5 48 10 49C11.5 48 12.5 45 12 42"
            fill={dripRed}
          />

          {/* Letter R */}
          <path
            d="M45 8H63C70 8 75 12 75 19C75 25 71 28 65 29L76 42H64L55 29H54V42H45V8ZM54 15V23H62C65 23 67 22 67 19C67 16 65 15 62 15H54Z"
            fill={dripRed}
          />

          {/* Letter I */}
          <path
            d="M80 8H90V42H80V8Z"
            fill={dripRed}
          />

          {/* Letter P (first) */}
          <path
            d="M95 8H113C121 8 126 13 126 21C126 29 121 33 113 33H104V45H95V8ZM104 15V26H112C116 26 117 24 117 21C117 18 116 15 112 15H104Z"
            fill={dripRed}
          />
          {/* Drip on first P tail */}
          <path
            d="M96 45C95 48 97 51 98.5 52C100 51 101.5 48 100 45"
            fill={dripRed}
          />

          {/* Letter P (second) */}
          <path
            d="M128 8H146C154 8 159 13 159 21C159 29 154 33 146 33H137V42H128V8ZM137 15V26H145C149 26 150 24 150 21C150 18 149 15 145 15H137Z"
            fill={dripRed}
          />

          {/* Letter Y */}
          <path
            d="M157 8L166 23V42H174V23L183 8H173L170 14L167 8H157Z"
            fill={dripRed}
          />
          {/* Drip on Y base */}
          <path
            d="M169 42C168 45 170 48 171.5 49C173 48 174.5 45 173 42"
            fill={dripRed}
          />
        </g>
      </svg>
    </span>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  layout = 'horizontal',
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
  className = '',
  asLink = true,
}) => {
  // Palette config
  const textPrimary =
    variant === 'light'
      ? 'text-white'
      : variant === 'gold'
      ? 'text-[#B99A6B]'
      : 'text-[#0A0A0A]';

  const subtitleColor =
    variant === 'light'
      ? 'text-[#D4D4D4]'
      : variant === 'gold'
      ? 'text-[#B99A6B]/80'
      : 'text-[#777777]';

  const goldAccent = variant === 'light' ? '#EFECE6' : '#B99A6B';

  // Sizing tokens
  const crestSizes = {
    sm: 18,
    md: 24,
    lg: 32,
    xl: 44,
  };

  const titleSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const subSizes = {
    sm: 'text-[6.5px]',
    md: 'text-[7.5px] sm:text-[8.5px]',
    lg: 'text-[9px] sm:text-[10px]',
    xl: 'text-[10px] sm:text-[11px]',
  };

  const crossSizes = {
    sm: 'text-xs',
    md: 'text-sm sm:text-base',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
  };

  // ----------------------------------------------------
  // LAYOUT 1: STACKED (Editorial Campaign & Hero/Footer)
  // ----------------------------------------------------
  if (layout === 'stacked') {
    const content = (
      <div
        className={`flex flex-col items-center text-center transition-all group ${className}`}
        aria-label="STYLENEST × DRIPPY — Indian Couture Meets Streetwear"
      >
        {/* Top Minimal Ornamental Lotus Crest */}
        <CoutureOrnamentalCrest
          size={crestSizes[size]}
          color={variant === 'light' ? '#FFFFFF' : '#0A0A0A'}
          accentColor={goldAccent}
          className="mb-1.5 transition-transform duration-300 group-hover:scale-105"
        />

        {/* STYLENEST High-Contrast Serif Wordmark */}
        <h1
          className={`font-serif tracking-[0.24em] font-bold uppercase ${titleSizes[size]} ${textPrimary} leading-none`}
          style={{ letterSpacing: '0.24em' }}
        >
          STYLENEST
        </h1>

        {/* Subtitle: INDIAN COUTURE */}
        {showSubtitle && (
          <span
            className={`font-sans uppercase font-bold tracking-[0.38em] text-[#8C7A6B] ${subSizes[size]} mt-1`}
            style={{ letterSpacing: '0.38em' }}
          >
            INDIAN COUTURE
          </span>
        )}

        {/* Centered Collaboration Cross Symbol */}
        <div className="flex items-center gap-2 my-1.5">
          <span className="w-4 h-[1px] bg-[#B99A6B]/40" />
          <span className={`font-serif italic text-[#B99A6B] font-light ${crossSizes[size]}`}>
            &times;
          </span>
          <span className="w-4 h-[1px] bg-[#B99A6B]/40" />
        </div>

        {/* DRIPPY Streetwear Wordmark */}
        <DrippyWordmark size={size} variant={variant} />

        {/* Tagline */}
        <span
          className={`font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-[#991B1B] font-bold mt-1.5 opacity-90`}
        >
          Streetwear Atelier
        </span>
      </div>
    );

    if (asLink) {
      return (
        <Link to="/" className="inline-block focus:outline-none" title="STYLENEST × DRIPPY Home">
          {content}
        </Link>
      );
    }
    return content;
  }

  // ----------------------------------------------------
  // LAYOUT 2: COMPACT / MONOGRAM (Favicon / Micro Icons)
  // ----------------------------------------------------
  if (layout === 'monogram') {
    const content = (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <CoutureOrnamentalCrest
          size={crestSizes[size]}
          color={variant === 'light' ? '#FFFFFF' : '#0A0A0A'}
          accentColor={goldAccent}
        />
        <span className="font-serif italic text-xs text-[#B99A6B]">&times;</span>
        <span className="font-sans font-black text-xs text-[#991B1B] tracking-wider">DRIPPY</span>
      </div>
    );
    if (asLink) {
      return (
        <Link to="/" className="inline-block focus:outline-none">
          {content}
        </Link>
      );
    }
    return content;
  }

  // ----------------------------------------------------
  // LAYOUT 3: HORIZONTAL (Standard Navbar & Mobile Header)
  // ----------------------------------------------------
  const horizontalContent = (
    <div
      className={`inline-flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-95 select-none ${className}`}
      aria-label="STYLENEST × DRIPPY — Indian Couture"
    >
      {/* Left: Minimal Ornamental Crest */}
      <CoutureOrnamentalCrest
        size={crestSizes[size]}
        color={variant === 'light' ? '#FFFFFF' : '#0A0A0A'}
        accentColor={goldAccent}
      />

      {/* Center-Left: STYLENEST + INDIAN COUTURE */}
      <div className="flex flex-col items-start leading-none">
        <span
          className={`font-serif tracking-[0.22em] font-bold uppercase ${titleSizes[size]} ${textPrimary}`}
          style={{ letterSpacing: '0.22em' }}
        >
          STYLENEST
        </span>

        {showSubtitle && (
          <span
            className={`font-sans uppercase font-bold tracking-[0.32em] text-[#8C7A6B] ${subSizes[size]} mt-0.5`}
            style={{ letterSpacing: '0.32em' }}
          >
            INDIAN COUTURE
          </span>
        )}
      </div>

      {/* Centered Collaboration Cross Symbol */}
      <span className={`font-serif italic text-[#B99A6B] font-light px-0.5 ${crossSizes[size]}`}>
        &times;
      </span>

      {/* Center-Right: DRIPPY in Bold Dark Red Streetwear Lettering */}
      <div className="flex flex-col items-start leading-none">
        <DrippyWordmark size={size === 'sm' ? 'sm' : size === 'lg' || size === 'xl' ? 'lg' : 'md'} variant={variant} />
        {showSubtitle && (
          <span className="text-[7px] font-mono uppercase tracking-[0.2em] text-[#991B1B] font-bold mt-0.5 hidden sm:inline-block">
            STREETWEAR
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="inline-block focus:outline-none" title="STYLENEST × DRIPPY — Indian Couture Meets Streetwear">
        {horizontalContent}
      </Link>
    );
  }

  return horizontalContent;
};

export default BrandLogo;
