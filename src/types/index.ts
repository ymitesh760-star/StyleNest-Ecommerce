export type ProductCategory = 'men' | 'women' | 'shoes' | 'perfumes';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface PerfumeVolume {
  size: string; // e.g. "30ml", "50ml", "100ml"
  priceMultiplier: number;
}

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  sku?: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  description: string;
  features?: string[];
  details?: Record<string, string>;
  sizes?: string[]; // for clothing ("S", "M", "L", "XL") or shoes ("UK 6", "UK 7", ...)
  colors?: ProductColor[];
  volumes?: PerfumeVolume[]; // for perfumes
  fragranceFamily?: string;
  fragranceNotes?: FragranceNotes;
  longevity?: string;
  inStock: boolean;
  stockCount: number;
  badges?: ('New' | 'Bestseller' | 'Sale')[];
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  createdAt?: string;
}

export interface CartItem {
  id: string; // Unique cart item ID (productId + variants)
  productId: string;
  name: string;
  brand: string;
  category: ProductCategory;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedVolume?: string;
  stockCount: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Placed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Refunded';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  paymentStatus: 'Completed' | 'Pending' | 'Demo Paid' | 'Refunded';
  orderStatus: OrderStatus;
  shippingAddress: Address;
  estimatedDelivery: string;
  trackingNumber: string;
  courierPartner?: string;
  returnReason?: string;
  returnStatus?: 'None' | 'Requested' | 'Approved' | 'Pickup Scheduled' | 'Refunded' | 'Rejected';
  refundAmount?: number;
  refundMode?: 'Original Source' | 'Store Credit' | 'Bank Transfer (COD)';
  customerNotes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  flatDiscount?: number;
  minOrderValue: number;
  description: string;
}

export interface FilterState {
  category?: ProductCategory | 'all';
  subcategory: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  ratings: number | null;
  inStockOnly: boolean;
  sortBy: 'popularity' | 'newest' | 'price-low' | 'price-high' | 'rating';
  searchQuery?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'luxury';
  title: string;
  message?: string;
}
