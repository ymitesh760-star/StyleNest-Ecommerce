import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { DEMO_COUPONS } from '../data/products';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { getUserCart, syncUserCart } from '../services/cartService';

export const FREE_SHIPPING_THRESHOLD = 1999;
export const STANDARD_SHIPPING_FEE = 250;

interface AddToCartOptions {
  size?: string;
  color?: string;
  volume?: string;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedCoupon: Coupon | null;
  freeShippingProgress: number;
  amountNeededForFreeShipping: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, options?: AddToCartOptions) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'stylenest_cart_items_v2';
const COUPON_STORAGE_KEY = 'stylenest_cart_coupon_v2';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();
  const { user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load initial cart from localStorage (with backwards-compatible fallback)
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY) || localStorage.getItem('elan_cart_items_v2');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load coupon from localStorage
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY) || localStorage.getItem('elan_cart_coupon_v2');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [items]);

  // Sync coupon to localStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const isRemoteCartLoaded = React.useRef(false);

  // When authenticated user changes, fetch persisted Firestore cart safely
  useEffect(() => {
    if (!user?.id) {
      isRemoteCartLoaded.current = false;
      return;
    }

    let isMounted = true;
    isRemoteCartLoaded.current = false;

    getUserCart(user.id)
      .then((remoteCart) => {
        if (!isMounted) return;
        if (remoteCart && remoteCart.items && remoteCart.items.length > 0) {
          setItems((localItems) => {
            if (localItems.length === 0) {
              return remoteCart.items;
            }
            // Merge local items with remote items to prevent data loss
            const merged = [...remoteCart.items];
            for (const localItem of localItems) {
              const existingIdx = merged.findIndex((m) => m.id === localItem.id);
              if (existingIdx >= 0) {
                merged[existingIdx].quantity = Math.max(merged[existingIdx].quantity, localItem.quantity);
              } else {
                merged.push(localItem);
              }
            }
            return merged;
          });

          if (remoteCart.coupon) {
            setAppliedCoupon((currCoupon) => currCoupon || remoteCart.coupon);
          }
        }
        isRemoteCartLoaded.current = true;
      })
      .catch((err) => {
        console.error('[StyleNest] Failed to load remote cart:', err);
        isRemoteCartLoaded.current = true;
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Sync cart state to Firestore ONLY after remote cart has been safely loaded
  useEffect(() => {
    if (!user?.id || !isRemoteCartLoaded.current) return;
    syncUserCart(user.id, items, appliedCoupon).catch((err) => {
      console.warn('[StyleNest] Sync cart to Firestore failed:', err);
    });
  }, [items, appliedCoupon, user?.id]);

  const addToCart = (product: Product, options: AddToCartOptions = {}): boolean => {
    if (!product.inStock) {
      toast.error('Out of Stock', 'This item is currently out of stock.');
      return false;
    }

    // Determine size
    let selectedSize = options.size;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      selectedSize = product.sizes[0];
    }

    // Determine color
    let selectedColor = options.color;
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      selectedColor = product.colors[0].name;
    }

    // Determine volume and compute adjusted price if perfume
    let selectedVolume = options.volume;
    let finalPrice = product.price;

    if (product.volumes && product.volumes.length > 0) {
      const foundVol = product.volumes.find((v) => v.size === options.volume) || product.volumes[0];
      selectedVolume = foundVol.size;
      finalPrice = Math.round(product.price * foundVol.priceMultiplier);
    }

    const quantityToAdd = options.quantity && options.quantity > 0 ? options.quantity : 1;

    // Composite cart item key
    const compositeId = `${product.id}-${selectedSize || 'nosize'}-${selectedColor || 'nocolor'}-${selectedVolume || 'novol'}`;

    let updated = false;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === compositeId);

      if (existingIndex > -1) {
        const existingItem = prevItems[existingIndex];
        const newQty = existingItem.quantity + quantityToAdd;

        if (newQty > product.stockCount) {
          toast.error('Maximum Stock Reached', `Only ${product.stockCount} units available in stock.`);
          return prevItems;
        }

        const newItems = [...prevItems];
        newItems[existingIndex] = {
          ...existingItem,
          quantity: newQty,
        };
        updated = true;
        return newItems;
      } else {
        if (quantityToAdd > product.stockCount) {
          toast.error('Exceeds Available Stock', `Only ${product.stockCount} units available in stock.`);
          return prevItems;
        }

        const newItem: CartItem = {
          id: compositeId,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          image: product.images[0],
          price: finalPrice,
          originalPrice: product.originalPrice,
          quantity: quantityToAdd,
          selectedSize,
          selectedColor,
          selectedVolume,
          stockCount: product.stockCount,
        };
        updated = true;
        return [...prevItems, newItem];
      }
    });

    if (updated || true) {
      toast.luxury('Added to Bag', `${product.name} has been added to your shopping bag.`);
      setIsCartOpen(true);
      return true;
    }
    return false;
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => {
      const removed = prev.find((item) => item.id === cartItemId);
      if (removed) {
        toast.info('Item Removed', `${removed.name} was removed from your bag.`);
      }
      return prev.filter((item) => item.id !== cartItemId);
    });
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          if (newQty > item.stockCount) {
            toast.error('Stock Limit', `Maximum available units: ${item.stockCount}`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const formatted = code.trim().toUpperCase();
    const coupon = DEMO_COUPONS.find((c) => c.code === formatted);

    if (!coupon) {
      return { success: false, message: 'Invalid promotional code.' };
    }

    if (subtotal < coupon.minOrderValue) {
      return {
        success: false,
        message: `Code ${coupon.code} requires a minimum order of ₹${coupon.minOrderValue.toLocaleString('en-IN')}.`,
      };
    }

    setAppliedCoupon(coupon);
    toast.luxury('Promotion Applied', `Coupon ${coupon.code} applied successfully!`);
    return { success: true, message: `Applied ${coupon.code} successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Coupon Removed', 'Promotional code has been removed.');
  };

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minOrderValue) {
      if (appliedCoupon.discountPercentage) {
        discount = Math.round((subtotal * appliedCoupon.discountPercentage) / 100);
      } else if (appliedCoupon.flatDiscount) {
        discount = appliedCoupon.flatDiscount;
      }
    }
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        total,
        appliedCoupon,
        freeShippingProgress,
        amountNeededForFreeShipping,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
