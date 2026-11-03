import React, { useState, useEffect } from 'react';
import { FALLBACK_IMAGES, sanitizeImageUrl } from '../../utils/imageUtils';

interface LuxuryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  containerClassName?: string;
  objectFit?: 'cover' | 'contain';
}

// Inline luxury architectural fallback SVG as Data URI (absolute fallback if network fails)
const DEFAULT_FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800"><rect width="100%" height="100%" fill="%23F8F6F2"/><rect x="24" y="24" width="552" height="752" fill="none" stroke="%23E7E3DD" stroke-width="1.5"/><text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="28" font-weight="700" fill="%230A0A0A" letter-spacing="6">STYLENEST</text><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="22" font-style="italic" fill="%23B99A6B">&times;</text><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="900" fill="%23991B1B" letter-spacing="4">DRIPPY</text><text x="50%" y="59%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" text-transform="uppercase" font-weight="700" fill="%238C7A6B" letter-spacing="4">INDIAN COUTURE MEETS STREETWEAR</text></svg>`;

export const LuxuryImage: React.FC<LuxuryImageProps> = ({
  src,
  alt = 'STYLENEST × DRIPPY Luxury Creation',
  className = '',
  containerClassName = '',
  fallbackSrc = FALLBACK_IMAGES.default,
  loading = 'lazy',
  objectFit = 'cover',
  ...rest
}) => {
  const [errorCount, setErrorCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Clean the provided image URL (resolves Unsplash webpage links, Google Drive links, etc.)
  const cleanedSrc = sanitizeImageUrl(src || '');

  // CRITICAL FIX: Reset error and loading state whenever the src URL prop changes
  useEffect(() => {
    setErrorCount(0);
    setIsLoaded(false);
  }, [cleanedSrc]);

  const handleError = () => {
    setErrorCount((prev) => prev + 1);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Determine current image source based on load attempts
  let currentSrc = cleanedSrc;
  if (!currentSrc || errorCount === 1) {
    // If primary failed or was empty, use high-res fallback fashion visual
    currentSrc = fallbackSrc || FALLBACK_IMAGES.default;
  } else if (errorCount >= 2) {
    // If fallback photo also failed, use inline data SVG
    currentSrc = DEFAULT_FALLBACK_SVG;
  }

  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <div className={`relative overflow-hidden bg-[#F0EDE6] ${containerClassName}`}>
      {/* Refined subtle shimmer placeholder before image is loaded */}
      {!isLoaded && errorCount === 0 && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse pointer-events-none" />
      )}

      <img
        {...rest}
        src={currentSrc}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onLoad={handleLoad}
        onError={handleError}
        className={`${fitClass} ${className} transition-opacity duration-300 ease-out ${
          isLoaded || errorCount > 0 ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
