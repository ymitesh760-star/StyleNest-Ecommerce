import { Product } from '../types';

/**
 * Curated high-resolution luxury fallback images by department
 */
export const FALLBACK_IMAGES = {
  men: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=1000&q=80',
  women: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
  shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80',
  perfumes: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
  default: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
};

/**
 * Sanitize and fix common pasted URLs (e.g. Unsplash webpage, Google Drive, Pinterest)
 */
export function sanitizeImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  let clean = url.trim();

  // If Unsplash page link (e.g. https://unsplash.com/photos/abc-123 or https://unsplash.com/photos/123)
  const unsplashMatch = clean.match(/^https?:\/\/(?:www\.)?unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/i);
  if (unsplashMatch && unsplashMatch[1]) {
    const photoId = unsplashMatch[1];
    return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1000&q=80`;
  }

  // If Google Drive viewer link: https://drive.google.com/file/d/FILE_ID/view...
  const gDriveMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${gDriveMatch[1]}`;
  }

  return clean;
}

/**
 * Validate whether a string is a direct image URL or likely a webpage
 */
export function validateImageUrl(url: string): {
  isValid: boolean;
  isWebpage: boolean;
  warning?: string;
  sanitizedUrl: string;
} {
  const sanitized = sanitizeImageUrl(url);
  if (!sanitized) {
    return { isValid: false, isWebpage: false, warning: 'Please enter an image URL.', sanitizedUrl: '' };
  }

  // Allow Base64 Data URLs
  if (sanitized.startsWith('data:image/')) {
    return { isValid: true, isWebpage: false, sanitizedUrl: sanitized };
  }

  // Must start with http:// or https://
  if (!/^https?:\/\//i.test(sanitized)) {
    return {
      isValid: false,
      isWebpage: false,
      warning: 'Image URL must begin with https:// or http://',
      sanitizedUrl: sanitized
    };
  }

  // Detect obvious webpage links (HTML, PHP, ASPX, social pages)
  const isWebpage = (
    /\.(html?|php|aspx?|jsp)(\?.*)?$/i.test(sanitized) ||
    /pinterest\.com\/pin\//i.test(sanitized) ||
    /instagram\.com\/p\//i.test(sanitized) ||
    /facebook\.com\//i.test(sanitized) ||
    /google\.com\/(search|imgres)/i.test(sanitized)
  );

  if (isWebpage) {
    return {
      isValid: false,
      isWebpage: true,
      warning: 'This appears to be a webpage link, not a direct image file. Please right-click the image and choose "Copy Image Address".',
      sanitizedUrl: sanitized
    };
  }

  return { isValid: true, isWebpage: false, sanitizedUrl: sanitized };
}

/**
 * Universal product normalizer that handles all legacy and new schemas:
 * - images: string[]
 * - image: string
 * - imageUrl: string
 * - thumbnail: string
 * - photos: string[]
 */
export function normalizeProduct(raw: any): Product {
  if (!raw) {
    throw new Error('Cannot normalize null or undefined product');
  }

  const category = (raw.category || 'men').toLowerCase();
  const fallback = FALLBACK_IMAGES[category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default;

  // Extract all potential images from any legacy field
  const candidateList: string[] = [];

  // 1. Check `images` array or string
  if (Array.isArray(raw.images)) {
    raw.images.forEach((img: any) => {
      if (typeof img === 'string' && img.trim()) {
        candidateList.push(sanitizeImageUrl(img));
      }
    });
  } else if (typeof raw.images === 'string' && raw.images.trim()) {
    // Comma-separated or single string
    raw.images.split(',').forEach((s: string) => {
      if (s.trim()) candidateList.push(sanitizeImageUrl(s));
    });
  }

  // 2. Check `photos`
  if (Array.isArray(raw.photos)) {
    raw.photos.forEach((img: any) => {
      if (typeof img === 'string' && img.trim()) {
        candidateList.push(sanitizeImageUrl(img));
      }
    });
  }

  // 3. Check single image fields: `image`, `imageUrl`, `thumbnail`, `image_url`
  ['image', 'imageUrl', 'thumbnail', 'image_url'].forEach((field) => {
    if (typeof raw[field] === 'string' && raw[field].trim()) {
      candidateList.push(sanitizeImageUrl(raw[field]));
    }
  });

  // Deduplicate and filter out empty strings
  const uniqueImages = Array.from(new Set(candidateList.filter(Boolean)));

  // If no images provided at all, use category fallback
  const finalImages = uniqueImages.length > 0 ? uniqueImages : [fallback];
  const primaryImage = finalImages[0];

  return {
    ...raw,
    id: String(raw.id || `prod-${Date.now()}`),
    name: String(raw.name || 'Untitled Creation'),
    brand: String(raw.brand || 'STYLENEST × DRIPPY'),
    sku: raw.sku ? String(raw.sku) : undefined,
    category: (raw.category || 'men') as any,
    subcategory: String(raw.subcategory || 'Atelier'),
    price: Number(raw.price) || 4999,
    originalPrice: raw.originalPrice ? Number(raw.originalPrice) : undefined,
    rating: Number(raw.rating) || 5.0,
    reviewsCount: Number(raw.reviewsCount) || 12,
    images: finalImages,
    image: primaryImage,
    imageUrl: primaryImage,
    thumbnail: primaryImage,
    description: String(raw.description || 'Architectural luxury creation tailored in our Parisian atelier.'),
    inStock: raw.inStock !== false && (raw.stockCount === undefined || raw.stockCount > 0),
    stockCount: typeof raw.stockCount === 'number' ? raw.stockCount : (typeof raw.stock === 'number' ? raw.stock : 15),
    badges: Array.isArray(raw.badges) ? raw.badges : (raw.isNewArrival ? ['New'] : undefined),
    isNewArrival: Boolean(raw.isNewArrival),
    isBestseller: Boolean(raw.isBestseller),
    isTrending: Boolean(raw.isTrending),
  };
}

